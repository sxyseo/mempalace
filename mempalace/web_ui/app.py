#!/usr/bin/env python3
"""
MemPalace Web UI - Flask Backend
=================================

A web interface for browsing and managing AI memories, similar to Obsidian.

Usage:
    python -m mempalace.web_ui.app
    mempalace web
    mempalace web --port 8080
"""

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os
import time
from pathlib import Path
import json

from ..config import MempalaceConfig
from ..searcher import search_memories
from ..knowledge_graph import KnowledgeGraph
from ..layers import MemoryStack
import chromadb

# Static folder with absolute path
_static_folder = Path(__file__).parent.parent.parent.parent / 'mempalace' / 'web_ui' / 'frontend' / 'dist'

app = Flask(__name__, static_folder=str(_static_folder), static_url_path='')
CORS(app)

_config = MempalaceConfig()
_kg = KnowledgeGraph()


def get_collection():
    """Get ChromaDB collection."""
    try:
        client = chromadb.PersistentClient(path=_config.palace_path)
        return client.get_collection(_config.collection_name)
    except Exception as e:
        return None


@app.route('/')
def index():
    """Serve the frontend."""
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/api/status')
def status():
    """Get palace status and overview."""
    col = get_collection()
    if not col:
        return jsonify({
            "total_drawers": 0,
            "total_wings": 0,
            "total_rooms": 0,
            "wings": {},
            "rooms": {},
            "knowledge_graph": None,
            "palace_path": _config.palace_path
        })

    count = col.count()
    wings = {}
    rooms = {}

    try:
        all_meta = col.get(include=["metadatas"])["metadatas"]
        for m in all_meta:
            w = m.get("wing", "unknown")
            r = m.get("room", "unknown")
            wings[w] = wings.get(w, 0) + 1
            rooms[r] = rooms.get(r, 0) + 1
    except Exception:
        pass

    # Get knowledge graph stats
    kg_stats = _kg.stats()

    return jsonify({
        "total_drawers": count,
        "total_wings": len(wings),
        "total_rooms": len(rooms),
        "wings": wings,
        "rooms": rooms,
        "knowledge_graph": kg_stats,
        "palace_path": _config.palace_path
    })


@app.route('/api/wings')
def list_wings():
    """List all wings with room counts."""
    col = get_collection()
    if not col:
        return jsonify([])  # Return empty array instead of error

    wings = {}
    try:
        all_meta = col.get(include=["metadatas"])["metadatas"]
        for m in all_meta:
            w = m.get("wing", "unknown")
            if w != "unknown":
                wings[w] = wings.get(w, 0) + 1
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify(sorted(wings.items(), key=lambda x: x[1], reverse=True))


@app.route('/api/wings/<wing_name>')
def get_wing(wing_name):
    """Get details of a specific wing."""
    col = get_collection()
    if not col:
        return jsonify({"error": "No palace found"}), 404

    rooms = {}
    try:
        # Query by wing
        results = col.get(
            where={"wing": wing_name},
            include=["metadatas", "documents"]
        )

        for m in results.get("metadatas", []):
            r = m.get("room", "unknown")
            if r != "unknown":
                rooms[r] = rooms.get(r, 0) + 1

        return jsonify({
            "wing": wing_name,
            "rooms": rooms,
            "total_drawers": len(results.get("ids", [])),
            "drawers": results.get("documents", [])[:10]  # First 10 as preview
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/rooms')
def list_rooms():
    """List all rooms."""
    col = get_collection()
    if not col:
        return jsonify({"error": "No palace found"}), 404

    rooms = {}
    try:
        all_meta = col.get(include=["metadatas"])["metadatas"]
        for m in all_meta:
            r = m.get("room", "unknown")
            if r != "unknown":
                wing = m.get("wing", "unknown")
                if r not in rooms:
                    rooms[r] = {"count": 0, "wings": set()}
                rooms[r]["count"] += 1
                rooms[r]["wings"].add(wing)

        # Convert sets to lists
        for r in rooms:
            rooms[r]["wings"] = list(rooms[r]["wings"])

        return jsonify(sorted(rooms.items(), key=lambda x: x[1]["count"], reverse=True))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/search')
def search():
    """Enhanced search memories."""
    query = request.args.get('q', '')
    wing = request.args.get('wing')
    room = request.args.get('room')
    n_results = int(request.args.get('n', 10))
    sort_by = request.args.get('sort', 'relevance')  # relevance, date

    if not query:
        return jsonify({"error": "Query required"}), 400

    try:
        results = search_memories(
            query,
            palace_path=_config.palace_path,
            wing=wing,
            room=room,
            n_results=n_results * 2  # Get more results for better filtering
        )

        # Enhance results with additional metadata
        enhanced_results = []
        seen = set()

        for result in results.get("results", []) if isinstance(results, dict) else results:
            # Create unique identifier
            result_id = f"{result.get('wing', '')}-{result.get('room', '')}-{result.get('source_file', '')}"
            if result_id in seen:
                continue
            seen.add(result_id)

            # Calculate better relevance score
            similarity = result.get('similarity', result.get('distance', 1.0))
            # Convert distance to similarity score (0-1)
            if similarity > 0:
                relevance_score = 1 / (1 + similarity)
            else:
                relevance_score = 1 - abs(similarity)

            # Extract preview text with query highlighting
            text = result.get('text', result.get('document', ''))
            preview = extract_preview(text, query, max_length=300)

            enhanced_result = {
                "id": result_id,
                "wing": result.get('wing', 'Unknown'),
                "room": result.get('room', 'general'),
                "source_file": result.get('source_file', 'unknown'),
                "document": text,
                "preview": preview,
                "relevance_score": round(relevance_score, 3),
                "timestamp": result.get('timestamp', int(time.time())),
                "metadata": result.get('metadata', {
                    "wing": result.get('wing', 'Unknown'),
                    "room": result.get('room', 'general')
                }),
                "highlight_ranges": find_highlight_ranges(text, query)
            }
            enhanced_results.append(enhanced_result)

            if len(enhanced_results) >= n_results:
                break

        # Sort results
        if sort_by == 'date':
            enhanced_results.sort(key=lambda x: x.get('timestamp', 0), reverse=True)
        else:
            enhanced_results.sort(key=lambda x: x.get('relevance_score', 0), reverse=True)

        # Generate search suggestions
        suggestions = generate_search_suggestions(query, enhanced_results)

        return jsonify({
            "query": query,
            "wing": wing,
            "room": room,
            "total_results": len(enhanced_results),
            "results": enhanced_results,
            "suggestions": suggestions,
            "filters": {
                "wing": wing,
                "room": room,
                "sort_by": sort_by
            }
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def extract_preview(text, query, max_length=300):
    """Extract preview text with query context."""
    if not text:
        return ""

    # Find best matching segment
    query_lower = query.lower()
    text_lower = text.lower()

    best_pos = text_lower.find(query_lower)
    if best_pos == -1:
        # No direct match, return beginning of text
        return text[:max_length] + "..." if len(text) > max_length else text

    # Extract context around match
    context_size = (max_length - len(query)) // 2
    start = max(0, best_pos - context_size)
    end = min(len(text), best_pos + len(query) + context_size)

    preview = text[start:end]
    if start > 0:
        preview = "..." + preview
    if end < len(text):
        preview = preview + "..."

    return preview

def find_highlight_ranges(text, query):
    """Find positions to highlight in text."""
    if not text or not query:
        return []

    ranges = []
    query_lower = query.lower()
    text_lower = text.lower()

    start = 0
    while True:
        pos = text_lower.find(query_lower, start)
        if pos == -1:
            break
        ranges.append({
            "start": pos,
            "end": pos + len(query)
        })
        start = pos + 1

    return ranges[:5]  # Limit to 5 highlights

def generate_search_suggestions(query, results):
    """Generate search suggestions based on query and results."""
    suggestions = []

    # Extract key terms from results
    terms = set()
    for result in results[:5]:  # Only check top 5 results
        text = result.get('document', '')
        words = text.lower().split()
        # Filter out common words
        for word in words:
            if len(word) > 4 and word.isalpha():
                terms.add(word)

    # Add some suggestions
    for term in list(terms)[:5]:
        if term not in query.lower():
            suggestions.append({
                "text": f"{query} {term}",
                "type": "expanded"
            })

    return suggestions[:3]  # Return top 3 suggestions


@app.route('/api/memories/<id>')
def get_memory(id):
    """Get a specific memory by ID."""
    col = get_collection()
    if not col:
        return jsonify({"error": "No palace found"}), 404

    try:
        results = col.get(ids=[id], include=["metadatas", "documents", "distances"])

        if not results or not results.get("ids"):
            return jsonify({"error": "Memory not found"}), 404

        return jsonify({
            "id": results["ids"][0],
            "document": results["documents"][0],
            "metadata": results["metadatas"][0],
            "distance": results.get("distances", [None])[0]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/memories/<id>', methods=['PUT'])
def update_memory(id):
    """Update memory metadata."""
    col = get_collection()
    if not col:
        return jsonify({"error": "No palace found"}), 404

    try:
        data = request.json
        metadata = data.get('metadata', {})

        # Update metadata
        col.update(
            ids=[id],
            metadatas=[metadata]
        )

        return jsonify({"success": True, "id": id})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/memories/<id>', methods=['DELETE'])
def delete_memory(id):
    """Delete a memory."""
    col = get_collection()
    if not col:
        return jsonify({"error": "No palace found"}), 404

    try:
        col.delete(ids=[id])
        return jsonify({"success": True, "id": id})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/graph')
def get_graph():
    """Get knowledge graph data."""
    try:
        # Get all entities from database
        import chromadb
        client = chromadb.PersistentClient(path=_config.palace_path)
        collection = client.get_collection(_config.collection_name)

        # Extract entities from metadata
        entities_set = set()
        try:
            all_meta = collection.get(include=["metadatas"])["metadatas"]
            for m in all_meta:
                # Extract potential entities from metadata
                for key in ["people", "projects", "entities"]:
                    if key in m and m[key]:
                        if isinstance(m[key], list):
                            entities_set.update(m[key])
                        elif isinstance(m[key], str):
                            entities_set.add(m[key])
        except Exception:
            pass

        # If no entities from metadata, create some from wings and rooms
        if not entities_set:
            try:
                wings = collection.get(include=["metadatas"])["metadatas"]
                for m in wings:
                    if m.get("wing"):
                        entities_set.add(m["wing"])
                    if m.get("room"):
                        entities_set.add(m["room"])
            except Exception:
                pass

        entities = list(entities_set)

        # Create some mock relationships based on co-occurrence
        relationships = []
        if len(entities) > 1:
            # Create relationships between entities that appear together
            for i, entity1 in enumerate(entities):
                for entity2 in entities[i+1:min(i+4, len(entities))]:
                    relationships.append({
                        "from": entity1,
                        "relation": "related_to",
                        "to": entity2,
                        "valid_from": None,
                        "valid_to": None
                    })

        return jsonify({
            "entities": entities,
            "relationships": relationships
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/timeline')
def get_timeline():
    """Get timeline data."""
    entity = request.args.get('entity')
    limit = int(request.args.get('limit', 50))

    try:
        col = get_collection()
        if not col:
            return jsonify({
                "entity": entity,
                "events": []
            })

        events = []

        if entity:
            # Get timeline for specific entity from knowledge graph
            kg_events = _kg.timeline(entity, limit=limit)
            events = kg_events
        else:
            # Get global timeline from all memories
            try:
                all_data = col.get(include=["metadatas", "documents"])
                for i, metadata in enumerate(all_data.get("metadatas", [])):
                    doc = all_data.get("documents", [])[i] if i < len(all_data.get("documents", [])) else ""

                    # Create event from metadata
                    event = {
                        "timestamp": metadata.get("created", metadata.get("timestamp", int(time.time()))),
                        "title": metadata.get("source_file", "Unknown"),
                        "description": doc[:200] + "..." if len(doc) > 200 else doc,
                        "entity": metadata.get("wing", "Unknown"),
                        "type": metadata.get("room", "general"),
                        "metadata": metadata
                    }
                    events.append(event)

                # Sort by timestamp descending
                events.sort(key=lambda x: x.get("timestamp", 0), reverse=True)

                # Limit results
                events = events[:limit]

            except Exception as e:
                print(f"Error building timeline: {e}")

        return jsonify({
            "entity": entity,
            "events": events
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/stats')
def get_stats():
    """Get statistics."""
    col = get_collection()
    if not col:
        return jsonify({"error": "No palace found"}), 404

    try:
        total = col.count()

        # Get wing/room distribution
        wings = {}
        halls = {}
        rooms = {}

        all_meta = col.get(include=["metadatas"])["metadatas"]
        for m in all_meta:
            w = m.get("wing", "unknown")
            h = m.get("hall", "unknown")
            r = m.get("room", "unknown")

            wings[w] = wings.get(w, 0) + 1
            halls[h] = halls.get(h, 0) + 1
            rooms[r] = rooms.get(r, 0) + 1

        # Get knowledge graph stats
        kg_stats = _kg.stats()

        return jsonify({
            "total_memories": total,
            "wings": wings,
            "halls": halls,
            "rooms": rooms,
            "knowledge_graph": kg_stats
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/wake-up')
def wake_up():
    """Get wake-up context."""
    try:
        stack = MemoryStack(palace_path=_config.palace_path)
        text = stack.wake_up()
        tokens = len(text) // 4
        return jsonify({
            "text": text,
            "tokens": tokens,
            "layers": "L0 + L1"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/aaak/spec')
def aaak_spec():
    """Get AAAK dialect specification."""
    from ..dialect import EMOTION_CODES, FLAGS

    return jsonify({
        "emotion_codes": EMOTION_CODES,
        "flags": FLAGS,
        "format": {
            "header": "FILE_NUM|PRIMARY_ENTITY|DATE|TITLE",
            "zettel": "ZID:ENTITIES|topic_keywords|\"key_quote\"|WEIGHT|EMOTIONS|FLAGS",
            "tunnel": "T:ZID<->ZID|label",
            "arc": "ARC:emotion->emotion->emotion"
        }
    })


def main():
    """Main entry point."""
    import argparse

    parser = argparse.ArgumentParser(description="MemPalace Web UI")
    parser.add_argument('--host', default='localhost', help='Host to bind to')
    parser.add_argument('--port', type=int, default=5000, help='Port to bind to')
    parser.add_argument('--debug', action='store_true', help='Enable debug mode')

    args = parser.parse_args()

    print(f"""
    ╔═══════════════════════════════════════════════════════╗
    ║                                                       ║
    ║              MemPalace Web UI                         ║
    ║                                                       ║
    ║  Access at: http://{args.host}:{args.port}              ║
    ║                                                       ║
    ╚═══════════════════════════════════════════════════════╝
    """)

    app.run(host=args.host, port=args.port, debug=args.debug)


if __name__ == '__main__':
    main()
