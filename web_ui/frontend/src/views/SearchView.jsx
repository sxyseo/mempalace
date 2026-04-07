import { useState } from 'react'
import { Search } from 'lucide-react'

export default function SearchView() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setSearching(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&n=20`)
      const data = await res.json()
      setResults(data.results || [])
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">搜索记忆</h1>
        <p className="text-gray-400">在记忆宫殿中搜索内容</p>
      </div>

      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索你的记忆..."
          className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-palace-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={searching || !query.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-palace-600 hover:bg-palace-700 disabled:bg-gray-700 disabled:text-gray-400 rounded-md text-sm font-medium transition-colors"
        >
          {searching ? '搜索中...' : '搜索'}
        </button>
      </form>

      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">找到 {results.length} 条结果</h2>
          <div className="space-y-3">
            {results.map((result, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-lg border border-gray-700 p-4 hover:border-palace-500 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-palace-400">{result.metadata?.wing}</span>
                      <span className="text-gray-600">→</span>
                      <span className="text-sm text-wing-400">{result.metadata?.room}</span>
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-2">{result.document}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {result.distance ? (1 - result.distance).toFixed(2) : 'N/A'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
