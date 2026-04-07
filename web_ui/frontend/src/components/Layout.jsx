import { Link, useLocation } from 'react-router-dom'
import {
  Home,
  Search,
  Network,
  BarChart3,
  Clock,
  Settings,
  Menu,
  X
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
    { name: '宫殿', href: '/', icon: Home },
    { name: '搜索', href: '/search', icon: Search },
    { name: '图谱', href: '/graph', icon: Network },
    { name: '统计', href: '/stats', icon: BarChart3 },
    { name: '时间线', href: '/timeline', icon: Clock },
  ]

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0`}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-palace-500 to-wing-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold">MemPalace</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive
                        ? 'bg-palace-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    } group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors`}
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Status Footer */}
          {status && (
            <div className="border-t border-gray-700 px-6 py-4">
              <div className="text-xs text-gray-400 mb-2">宫殿状态</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>总记忆</span>
                  <span className="text-palace-400 font-medium">{status.total_drawers}</span>
                </div>
                <div className="flex justify-between">
                  <span>翼</span>
                  <span className="text-wing-400 font-medium">{status.total_wings}</span>
                </div>
                <div className="flex justify-between">
                  <span>房间</span>
                  <span className="text-green-400 font-medium">{status.total_rooms}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-700 bg-gray-800 px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-4">
            <Link
              to="/settings"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
