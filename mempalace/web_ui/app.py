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
from pathlib import Path
import json

from ..config import MempalaceConfig
from ..searcher import search_memories
from ..knowledge_graph import KnowledgeGraph
from ..layers import get_critical_facts, get_wake_up_context
import chromadb

app = Flask(__name__, static_folder='frontend/dist', static_url_path='')
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
        return jsonify({"error": "No palace found"}), 404

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
    kg_stats = _kg.get_stats()

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
        return jsonify({"error": "No palace found"}), 404

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
    """Search memories."""
    query = request.args.get('q', '')
    wing = request.args.get('wing')
    room = request.args.get('room')
    n_results = int(request.args.get('n', 10))

    if not query:
        return jsonify({"error": "Query required"}), 400

    try:
        results = search_memories(
            query,
            palace_path=_config.palace_path,
            wing=wing,
            room=room,
            n_results=n_results
        )

        return jsonify({
            "query": query,
            "wing": wing,
            "room": room,
            "results": results
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


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
        # Get all entities
        entities = _kg.get_all_entities()

        # Get all relationships
        relationships = []
        for entity in entities:
            triples = _kg.query_entity(entity)
            for triple in triples:
                relationships.append({
                    "from": triple["subject"],
                    "relation": triple["predicate"],
                    "to": triple["object"],
                    "valid_from": triple.get("valid_from"),
                    "valid_to": triple.get("valid_to")
                })

        return jsonify({
            "entities": list(set(entities)),
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
        if entity:
            events = _kg.timeline(entity, limit=limit)
        else:
            # Get all events
            events = []
            # TODO: Implement global timeline

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
        kg_stats = _kg.get_stats()

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
        context = get_wake_up_context(_config.palace_path)
        return jsonify(context)
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
