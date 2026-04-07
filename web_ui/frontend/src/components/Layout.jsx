import { Link, useLocation } from 'react-router-dom'
import {
  Home,
  Search,
  Network,
  BarChart3,
  Clock,
  Settings,
  Menu,
  X,
  Database,
  Sparkles,
  BookOpen,
} from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [status, setStatus] = useState(null)
  const location = useLocation()

  useEffect(() => {
    // Fetch palace status
    fetch('/api/status')
      .then(res => res.json())
      .then(data => setStatus(data))
      .catch(err => console.error('Failed to fetch status:', err))
  }, [])

  const navigation = [
    { name: '宫殿', href: '/', icon: Home, description: '浏览宫殿结构' },
    { name: '搜索', href: '/search', icon: Search, description: '搜索记忆' },
    { name: '图谱', href: '/graph', icon: Network, description: '知识图谱' },
    { name: '统计', href: '/stats', icon: BarChart3, description: '统计分析' },
    { name: '时间线', href: '/timeline', icon: Clock, description: '时间线' },
  ]

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800_1px,transparent_1px)] bg-[length:20px_20px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#8080800_1px,transparent_1px)] bg-[length:20px_20px]"></div>
      </div>

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-72 bg-slate-900/95 backdrop-blur-xl transition-transform duration-300 ease-out lg:static lg:translate-x-0 border-r border-slate-800 shadow-2xl`}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-primary-400 to-wing-400 bg-clip-text text-transparent">
                  MemPalace
                </h1>
                <p className="text-xs text-slate-500">AI 记忆宫殿</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActive
                      ? 'bg-gradient-to-r from-primary-600/20 to-wing-600/20 text-primary-400 border border-primary-500/30 shadow-lg shadow-primary-500/10'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent hover:border-slate-700'
                  } group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium`}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${
                    isActive ? 'text-primary-400' : 'text-slate-500 group-hover:text-slate-300'
                  }`} />
                  <span className="transition-colors duration-200">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Status Footer */}
          {status && (
            <div className="border-t border-slate-800 bg-slate-800/30">
              <div className="px-6 py-4">
                <div className="flex items-center gap-2 mb-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <Database className="w-4 h-4" />
                  宫殿状态
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">总记忆</span>
                    <span className="font-semibold text-primary-400">{status.total_drawers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">翼</span>
                    <span className="font-semibold text-wing-400">{status.total_wings}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">房间</span>
                    <span className="font-semibold text-green-400">{status.total_rooms}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between px-6 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary-400" />
              <span className="text-sm text-slate-400">MemPalace</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/settings"
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
