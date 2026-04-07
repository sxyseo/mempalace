# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MemPalace is an AI memory system that stores conversations and project files in a searchable "palace" structure. The core innovation is the **palace metaphor** (wings → halls → rooms → closets → drawers) which provides a 34% retrieval improvement over flat vector search.

**Key architectural components:**
- **Palace (ChromaDB)**: Stores verbatim content organized hierarchically by wing/project, hall/memory type, and room/topic
- **Knowledge Graph (SQLite)**: Temporal entity-relationship triples with validity windows
- **AAAK Dialect**: 30x lossless compression format readable by any LLM (Claude, GPT, Llama, etc.)
- **MCP Server**: 19 tools for AI agents to read/write memories
- **4-layer memory stack**: L0 (identity) → L1 (critical facts) → L2 (room recall) → L3 (deep search)

## Development Commands

```bash
# Install in development mode
pip install -e ".[dev]"

# Run tests
pytest tests/ -v

# Run specific test file
pytest tests/test_searcher.py -v

# Run single test
pytest tests/test_searcher.py::test_search -v

# Format and lint
ruff format .
ruff check --fix .

# Pre-commit hooks (installed via .pre-commit-config.yaml)
pre-commit run --all-files
```

## Architecture Deep Dive

### Data Flow

```
User → CLI → miner/convo_miner → ChromaDB (palace)
                                     ↕
                              knowledge_graph (SQLite)
                                     ↕
User → MCP Server → searcher → results
                  → kg_query → entity facts
                  → diary    → agent journal
```

### Core Modules (by responsibility)

**Ingest Pipeline:**
- `cli.py` - CLI entry point, routes commands
- `miner.py` - Project file ingest (code, docs, notes)
- `convo_miner.py` - Conversation ingest (chunks by Q+A exchange pairs)
- `normalize.py` - Converts 5 chat formats to standard transcript
- `split_mega_files.py` - Splits concatenated transcripts into per-session files

**Palace Structure:**
- `searcher.py` - Semantic search via ChromaDB with wing/room filters
- `palace_graph.py` - Room-based navigation (BFS traversal, tunnel detection)
- `layers.py` - 4-layer memory stack (L0-L3)

**Knowledge & Intelligence:**
- `knowledge_graph.py` - Temporal entity graph (SQLite, time-filtered queries)
- `dialect.py` - AAAK compression (entity codes, emotion markers, 30x ratio)
- `entity_detector.py` - Auto-detect people/projects from content
- `room_detector_local.py` - Maps folders to room names (70+ patterns, no API)
- `general_extractor.py` - Classifies text into 5 memory types

**AI Integration:**
- `mcp_server.py` - MCP server with 19 tools (read/write palace, KG queries, agent diary)
- `onboarding.py` - Guided setup generating AAAK bootstrap + wing config
- `entity_registry.py` - Maps names to AAAK codes

**Infrastructure:**
- `config.py` - Configuration (env vars > ~/.mempalace/config.json > defaults)
- `spellcheck.py` - Name-aware spellcheck (respects entity registry)

### Palace Hierarchy

```
Wing (person/project)
  └── Hall (memory type: facts/events/discoveries/preferences/advice)
        └── Room (topic: auth-migration, graphql-switch, etc.)
              └── Closet (AAAK summary pointing to original)
                    └── Drawer (verbatim file content)
```

**Halls are memory types** - same in every wing, acting as corridors:
- `hall_facts` - decisions made, choices locked in
- `hall_events` - sessions, milestones, debugging
- `hall_discoveries` - breakthroughs, new insights
- `hall_preferences` - habits, likes, opinions
- `hall_advice` - recommendations and solutions

**Tunnels** connect the same room across different wings (e.g., `auth-migration` room in `wing_kai`, `wing_driftwood`, and `wing_priya` creates cross-references).

## MCP Server Tools

**19 tools total** - the AI learns AAAK and memory protocol from `mempalace_status` response automatically.

**Palace (read):** `status`, `list_wings`, `list_rooms`, `get_taxonomy`, `search`, `check_duplicate`, `get_aaak_spec`
**Palace (write):** `add_drawer`, `delete_drawer`
**Knowledge Graph:** `kg_query`, `kg_add`, `kg_invalidate`, `kg_timeline`, `kg_stats`
**Navigation:** `traverse`, `find_tunnels`, `graph_stats`
**Agent Diary:** `diary_write`, `diary_read`

## Key Development Principles

1. **Verbatim first** - Never summarize user content. Store exact words. Summaries go in closets, but originals in drawers.
2. **Local first** - Everything runs on user's machine. No cloud dependencies in core features.
3. **Zero API by default** - Core features work without any API key. Optional hybrid mode uses Haiku rerank but isn't required.
4. **Palace structure matters** - Wings, halls, and rooms drive 34% retrieval improvement. Respect the hierarchy.
5. **Minimal dependencies** - Only ChromaDB and PyYAML. Don't add new deps without discussion.

## Testing Principles

- Tests must run without API keys or network access
- Tests should be reproducible and isolated
- Focus on core logic: search accuracy, knowledge graph temporal queries, AAAK compression
- Benchmark runners in `benchmarks/` are reproducible against published datasets (LongMemEval, LoCoMo, MemBench)

## Configuration Files

- `~/.mempalace/config.json` - Global config (palace path, collection name, people map)
- `~/.mempalace/wing_config.json` - Generated by init, maps people/projects to wings
- `~/.mempalace/identity.txt` - Plain text, becomes Layer 0 (always loaded)
- `~/.mempalace/agents/*.json` - Specialist agent configs (each has own wing + diary)

## AAAK Compression Format

AAAK is a lossless shorthand dialect with universal grammar:

```
Header:   FILE_NUM|PRIMARY_ENTITY|DATE|TITLE
Zettel:   ZID:ENTITIES|topic_keywords|"key_quote"|WEIGHT|EMOTIONS|FLAGS
Tunnel:   T:ZID<->ZID|label
Arc:      ARC:emotion->emotion->emotion
```

Entity codes (e.g., KAI, PRI) map to full names via `entity_registry.py`. Emotion codes are universal (vul, joy, fear, trust, grief, wonder, rage, love, hope, despair, peace, humor, tender, raw, doubt, relief, anx, exhaust, convict, passion).

Flags: ORIGIN, CORE, SENSITIVE, PIVOT, GENESIS, DECISION, TECHNICAL.
