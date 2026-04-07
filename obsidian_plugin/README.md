# MemPalace Obsidian Plugin

Integrate MemPalace AI memory system with Obsidian.

## Features

- 🔄 **Auto-sync**: Automatically sync your Obsidian notes to MemPalace
- 🔍 **Search**: Search through your AI memory from within Obsidian
- 🏛️ **Organize**: Notes are automatically organized into Wings, Halls, and Rooms
- 🧠 **AI-powered**: Leverage MemPalace's semantic search and knowledge graph

## Installation

1. Copy the entire `obsidian_plugin` folder to your Obsidian vault's plugins directory
   - macOS: `~/Library/Application Support/obsidian/plugins/`
   - Windows: `%APPDATA%/obsidian/plugins/`
   - Linux: `~/.config/obsidian/plugins/`

2. Rename the folder to `mempalace`

3. Enable the plugin in Obsidian settings:
   - Open Settings → Community Plugins
   - Search for "MemPalace"
   - Click "Enable"

## Setup

1. Make sure the MemPalace Web UI is running:
   ```bash
   mempalace web --port 8080
   ```

2. Configure the plugin:
   - Open Settings → MemPalace
   - Set the API Endpoint (default: `http://localhost:8080`)
   - Enable auto-sync if desired

## Usage

### Manual Sync

1. Open a note in Obsidian
2. Press `Cmd/Ctrl + P` to open Command Palette
3. Select "MemPalace: Sync current note to MemPalace"

### Search MemPalace

1. Press `Cmd/Ctrl + P` to open Command Palette
2. Select "MemPalace: Search MemPalace"
3. Enter your search query
4. Results will be displayed in a new note

### Open Web UI

1. Press `Cmd/Ctrl + P` to open Command Palette
2. Select "MemPalace: Open MemPalace Web UI"
3. The Web UI will open in your default browser

## Plugin Settings

- **Palace Path**: Path to your MemPalace data directory
- **API Endpoint**: URL of the MemPalace Web UI
- **Auto-sync**: Automatically sync notes to MemPalace
- **Sync Interval**: How often to auto-sync notes (in seconds)

## Development

```bash
# Install dependencies
npm install

# Build the plugin
npm run build

# Watch mode for development
npm run dev
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details
