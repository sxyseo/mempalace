import { App, Plugin, PluginSettingTab, Setting, Notice, TFile } from 'obsidian'

interface MemPalaceSettings {
	palacePath: string
	apiEndpoint: string
	autoSync: boolean
	syncInterval: number
}

const DEFAULT_SETTINGS: MemPalaceSettings = {
	palacePath: '~/.mempalace/palace',
	apiEndpoint: 'http://localhost:8080',
	autoSync: false,
	syncInterval: 60
}

export default class MemPalacePlugin extends Plugin {
	settings: MemPalaceSettings
	syncTimer: number | null = null

	async onload() {
		await this.loadSettings()

		// Add ribbon icon
		this.addRibbonIcon('database', 'MemPalace', () => {
			this.openMemPalaceView()
		})

		// Add command palette commands
		this.addCommand({
			id: 'open-mempalace',
			name: 'Open MemPalace Web UI',
			callback: () => {
				this.openMemPalaceWeb()
			}
		})

		this.addCommand({
			id: 'sync-current-note',
			name: 'Sync current note to MemPalace',
			callback: () => {
				this.syncCurrentNote()
			}
		})

		this.addCommand({
			id: 'search-mempalace',
			name: 'Search MemPalace',
			callback: () => {
				this.searchMemPalace()
			}
		})

		// Add settings tab
		this.addSettingTab(new MemPalaceSettingTab(this.app, this))

		// Setup auto-sync if enabled
		if (this.settings.autoSync) {
			this.setupAutoSync()
		}

		new Notice('MemPalace plugin loaded')
	}

	onunload() {
		if (this.syncTimer) {
			window.clearInterval(this.syncTimer)
		}
		new Notice('MemPalace plugin unloaded')
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
	}

	async saveSettings() {
		await this.saveData(this.settings)
	}

	setupAutoSync() {
		if (this.syncTimer) {
			window.clearInterval(this.syncTimer)
		}

		if (this.settings.autoSync) {
			this.syncTimer = window.setInterval(() => {
				this.syncAllNotes()
			}, this.settings.syncInterval * 1000)
		}
	}

	openMemPalaceView() {
		const { vault } = this.app
		new Notice('MemPalace: Right-click on notes to sync them')
	}

	openMemPalaceWeb() {
		window.open(this.settings.apiEndpoint, '_blank')
	}

	async syncCurrentNote() {
		const activeFile = this.app.workspace.getActiveFile()
		if (!activeFile) {
			new Notice('No active note to sync')
			return
		}

		new Notice(`Syncing ${activeFile.name} to MemPalace...`)

		try {
			const content = await this.app.vault.read(activeFile)
			await this.sendToMemPalace(activeFile, content)
			new Notice(`Successfully synced ${activeFile.name}`)
		} catch (error) {
			new Notice(`Failed to sync: ${error.message}`)
			console.error('MemPalace sync error:', error)
		}
	}

	async syncAllNotes() {
		const { vault } = this.app
		const markdownFiles = vault.getMarkdownFiles()

		new Notice(`Syncing ${markdownFiles.length} notes to MemPalace...`)

		let successCount = 0
		let errorCount = 0

		for (const file of markdownFiles) {
			try {
				const content = await vault.read(file)
				await this.sendToMemPalace(file, content)
				successCount++
			} catch (error) {
				errorCount++
				console.error(`Failed to sync ${file.name}:`, error)
			}
		}

		new Notice(`Sync complete: ${successCount} succeeded, ${errorCount} failed`)
	}

	async sendToMemPalace(file: TFile, content: string) {
		const metadata = {
			path: file.path,
			name: file.basename,
			created: file.stat.ctime,
			modified: file.stat.mtime,
			size: file.stat.size
		}

		const response = await fetch(`${this.settings.apiEndpoint}/api/memories`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				document: content,
				metadata: metadata
			})
		})

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`)
		}

		return await response.json()
	}

	async searchMemPalace() {
		const query = await this.askInput('Search MemPalace', 'Enter your search query:')
		if (!query) return

		try {
			const response = await fetch(`${this.settings.apiEndpoint}/api/search?q=${encodeURIComponent(query)}`)
			const data = await response.json()

			if (data.results && data.results.length > 0) {
				this.displaySearchResults(data.results)
			} else {
				new Notice('No results found')
			}
		} catch (error) {
			new Notice(`Search failed: ${error.message}`)
		}
	}

	displaySearchResults(results: any[]) {
		// Create a new note with search results
		const { vault } = this.app
		const content = this.formatSearchResults(results)

		vault.create('MemPalace Search Results.md', content).then(() => {
			new Notice('Search results created')
		})
	}

	formatSearchResults(results: any[]): string {
		let content = '# MemPalace Search Results\n\n'

		results.forEach((result, index) => {
			content += `## Result ${index + 1}\n\n`
			content += `**Score:** ${(1 - result.distance).toFixed(2)}\n\n`
			content += `**Wing:** ${result.metadata?.wing || 'Unknown'}\n\n`
			content += `**Room:** ${result.metadata?.room || 'Unknown'}\n\n`
			content += `${result.document}\n\n`
			content += '---\n\n'
		})

		return content
	}

	async askInput(prompt: string, placeholder: string): Promise<string> {
		return new Promise((resolve) => {
			const input = prompt(prompt, placeholder)
			resolve(input || '')
		})
	}
}

class MemPalaceSettingTab extends PluginSettingTab {
	plugin: MemPalacePlugin

	constructor(app: App, plugin: MemPalacePlugin) {
		super(app, plugin)
		this.plugin = plugin
	}

	display(): void {
		const { containerEl } = this
		containerEl.empty()

		containerEl.createEl('h2', { text: 'MemPalace Settings' })

		new Setting(containerEl)
			.setName('Palace Path')
			.setDesc('Path to your MemPalace data directory')
			.addText(text => text
				.setPlaceholder('~/.mempalace/palace')
				.setValue(this.plugin.settings.palacePath)
				.onChange(async (value) => {
					this.plugin.settings.palacePath = value
					await this.plugin.saveSettings()
				}))

		new Setting(containerEl)
			.setName('API Endpoint')
			.setDesc('URL of the MemPalace Web UI')
			.addText(text => text
				.setPlaceholder('http://localhost:8080')
				.setValue(this.plugin.settings.apiEndpoint)
				.onChange(async (value) => {
					this.plugin.settings.apiEndpoint = value
					await this.plugin.saveSettings()
				}))

		new Setting(containerEl)
			.setName('Auto-sync')
			.setDesc('Automatically sync notes to MemPalace')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.autoSync)
				.onChange(async (value) => {
					this.plugin.settings.autoSync = value
					await this.plugin.saveSettings()
					this.plugin.setupAutoSync()
				}))

		new Setting(containerEl)
			.setName('Sync Interval (seconds)')
			.setDesc('How often to auto-sync notes')
			.addText(text => text
				.setPlaceholder('60')
				.setValue(this.plugin.settings.syncInterval.toString())
				.onChange(async (value) => {
					const num = parseInt(value)
					if (!isNaN(num)) {
						this.plugin.settings.syncInterval = num
						await this.plugin.saveSettings()
						this.plugin.setupAutoSync()
					}
				}))
	}
}
