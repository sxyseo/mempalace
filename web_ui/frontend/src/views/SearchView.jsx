import { useState, useEffect } from 'react'
import { Search, Sparkles, Clock, Filter, X, TrendingUp, FolderOpen, Hash } from 'lucide-react'

export default function SearchView() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [searched, setSearched] = useState(false)
  const [searchHistory, setSearchHistory] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    wing: '',
    room: '',
    n_results: 20
  })
  const [wings, setWings] = useState([])

  useEffect(() => {
    loadSearchHistory()
    fetchWings()
  }, [])

  const loadSearchHistory = () => {
    const history = localStorage.getItem('searchHistory') || '[]'
    setSearchHistory(JSON.parse(history))
  }

  const saveSearchHistory = (query) => {
    if (!query.trim()) return

    const history = searchHistory.filter(h => h !== query)
    history.unshift(query)
    const newHistory = history.slice(0, 10) // Keep only 10 recent searches

    setSearchHistory(newHistory)
    localStorage.setItem('searchHistory', JSON.stringify(newHistory))
  }

  const fetchWings = async () => {
    try {
      const res = await fetch('/api/wings')
      if (!res.ok) return

      const data = await res.json()
      setWings(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch wings:', error)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setSearching(true)
    setSearched(true)
    saveSearchHistory(query)

    try {
      const params = new URLSearchParams({
        q: query,
        n: filters.n_results.toString()
      })

      if (filters.wing) params.append('wing', filters.wing)
      if (filters.room) params.append('room', filters.room)

      const res = await fetch(`/api/search?${params}`)
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }
      const data = await res.json()
      setResults(Array.isArray(data.results) ? data.results : [])
    } catch (error) {
      console.error('Search failed:', error)
      setResults([])
    } finally {
      setSearching(false)
    }
  }

  const handleQuickSearch = (searchQuery) => {
    setQuery(searchQuery)
    setTimeout(() => {
      const form = document.querySelector('form')
      if (form) form.requestSubmit()
    }, 100)
  }

  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem('searchHistory')
  }

  const getScoreColor = (score) => {
    if (score >= 0.8) return 'text-green-400'
    if (score >= 0.6) return 'text-wing-400'
    if (score >= 0.4) return 'text-primary-400'
    return 'text-slate-400'
  }

  const getScoreBg = (score) => {
    if (score >= 0.8) return 'bg-green-500/20 border-green-500/30'
    if (score >= 0.6) return 'bg-wing-500/20 border-wing-500/30'
    if (score >= 0.4) return 'bg-primary-500/20 border-primary-500/30'
    return 'bg-slate-500/20 border-slate-500/30'
  }

  // Group results by wing
  const groupedResults = results.reduce((groups, result) => {
    const wing = result.metadata?.wing || 'Unknown'
    if (!groups[wing]) {
      groups[wing] = []
    }
    groups[wing].push(result)
    return groups
  }, {})

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-primary-500/20 to-wing-500/20 ring-1 ring-primary-500/50">
          <Search className="w-8 h-8 text-primary-400" />
        </div>
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary-400 via-wing-400 to-primary-400 bg-clip-text text-transparent">
          搜索记忆宫殿
        </h1>
        <p className="text-slate-400 text-lg">输入关键词，探索你的 AI 记忆</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative max-w-3xl mx-auto">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-wing-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          <div className="relative flex items-center bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-700 hover:border-slate-600 transition-all duration-300 shadow-2xl">
            <Search className="absolute left-5 w-5 h-5 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索你的记忆..."
              className="flex-1 pl-14 pr-36 py-4 bg-transparent text-white placeholder-slate-500 focus:outline-none text-lg"
            />
            <div className="absolute right-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                title="筛选"
              >
                <Filter className="w-5 h-5 text-slate-400" />
              </button>
              <button
                type="submit"
                disabled={searching || !query.trim()}
                className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary-500/25 disabled:shadow-none flex items-center gap-2"
              >
                {searching ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    搜索中
                  </>
                ) : (
                  '搜索'
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Filters */}
      {showFilters && (
        <div className="max-w-3xl mx-auto bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">翼</label>
              <select
                value={filters.wing}
                onChange={(e) => setFilters({ ...filters, wing: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
              >
                <option value="">全部</option>
                {wings.map(([wing]) => (
                  <option key={wing} value={wing}>{wing}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">房间</label>
              <input
                type="text"
                value={filters.room}
                onChange={(e) => setFilters({ ...filters, room: e.target.value })}
                placeholder="输入房间名"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">结果数量</label>
              <select
                value={filters.n_results}
                onChange={(e) => setFilters({ ...filters, n_results: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
              >
                <option value="10">10 条</option>
                <option value="20">20 条</option>
                <option value="50">50 条</option>
                <option value="100">100 条</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Search History & Suggestions */}
      {!searched && results.length === 0 && (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary-400" />
                  <h3 className="font-semibold text-slate-200">搜索历史</h3>
                </div>
                <button
                  onClick={clearHistory}
                  className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
                >
                  清除
                </button>
              </div>
              <div className="space-y-2">
                {searchHistory.slice(0, 5).map((historyQuery, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickSearch(historyQuery)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-700/50 transition-colors text-sm text-slate-400 hover:text-slate-200"
                  >
                    {historyQuery}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Suggestions */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-wing-400" />
              <h3 className="font-semibold text-slate-200">热门搜索</h3>
            </div>
            <div className="space-y-2">
              <SuggestionButton query="项目架构设计" icon="💡" />
              <SuggestionButton query="Bug 修复方案" icon="🔧" />
              <SuggestionButton query="学习笔记" icon="📚" />
              <SuggestionButton query="会议记录" icon="📝" />
              <SuggestionButton query="API 文档" icon="🔌" />
            </div>
          </div>
        </div>
      )}

      {/* No Results */}
      {searched && !searching && results.length === 0 && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-700/50 flex items-center justify-center">
              <Search className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">未找到相关记忆</h3>
            <p className="text-slate-500 mb-4">试试其他关键词，或者先添加一些记忆到宫殿中</p>
            {searchHistory.length > 0 && (
              <div className="mt-6">
                <p className="text-sm text-slate-400 mb-2">从历史搜索中尝试：</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {searchHistory.slice(0, 3).map((historyQuery, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickSearch(historyQuery)}
                      className="px-3 py-1 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {historyQuery}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search Results - Grouped */}
      {searched && results.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-200">
              找到 <span className="text-primary-400">{results.length}</span> 条相关记忆
            </h2>
            <div className="text-sm text-slate-500">
              搜索词: <span className="text-primary-400">"{query}"</span>
            </div>
          </div>

          {Object.entries(groupedResults).map(([wing, wingResults]) => (
            <div key={wing} className="space-y-3">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-primary-400" />
                <h3 className="text-lg font-semibold text-slate-200">{wing}</h3>
                <span className="text-sm text-slate-500">({wingResults.length} 条)</span>
              </div>

              <div className="space-y-3 ml-7">
                {wingResults.map((result, index) => {
                  const score = result.distance ? 1 - result.distance : 0
                  return (
                    <div
                      key={index}
                      className="group bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 hover:border-primary-500/50 transition-all duration-300 overflow-hidden hover:shadow-xl hover:shadow-primary-500/10"
                    >
                      <div className="p-4">
                        <div className="flex items-start gap-4">
                          <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${getScoreBg(score)} border flex items-center justify-center`}>
                            <span className={`text-sm font-bold ${getScoreColor(score)}`}>
                              {(score * 100).toFixed(0)}%
                            </span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-wing-500/10 border border-wing-500/20">
                                <Hash className="w-3 h-3 text-wing-400" />
                                <span className="text-xs font-medium text-wing-400">{result.metadata?.room || 'Unknown'}</span>
                              </div>
                            </div>

                            <p className="text-slate-300 line-clamp-2 leading-relaxed group-hover:text-white transition-colors">
                              {result.document}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SuggestionButton({ query, icon }) {
  return (
    <button
      onClick={() => {
        const input = document.querySelector('input[type="text"]')
        if (input) {
          input.value = query
          input.dispatchEvent(new Event('input', { bubbles: true }))
        }
      }}
      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700/50 transition-colors text-left text-sm text-slate-400 hover:text-slate-200"
    >
      <span>{icon}</span>
      <span>{query}</span>
    </button>
  )
}
