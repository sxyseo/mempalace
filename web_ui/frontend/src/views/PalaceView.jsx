import { useState, useEffect } from 'react'
import { ChevronRight, ChevronDown, FolderOpen, FileText, Folder, Sparkles } from 'lucide-react'

export default function PalaceView() {
  const [wings, setWings] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedWings, setExpandedWings] = useState({})

  useEffect(() => {
    fetchWings()
  }, [])

  const fetchWings = async () => {
    try {
      const res = await fetch('/api/wings')
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }
      const data = await res.json()
      setWings(Array.isArray(data) ? data : [])
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch wings:', error)
      setWings([])
      setLoading(false)
    }
  }

  const toggleWing = (wingName) => {
    setExpandedWings(prev => ({
      ...prev,
      [wingName]: !prev[wingName]
    }))
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary-500 animate-pulse" />
        </div>
        <p className="mt-4 text-slate-400">加载宫殿中...</p>
      </div>
    )
  }

  if (wings.length === 0) {
    return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-primary-500/20 to-wing-500/20 ring-1 ring-primary-500/50">
          <Sparkles className="w-10 h-10 text-primary-400" />
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-400 via-wing-400 to-primary-400 bg-clip-text text-transparent">
          欢迎来到 MemPalace
        </h1>
        <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
          你的 AI 记忆宫殿还空空如也。开始创建你的第一个记忆吧！
        </p>

        {/* Quick Start Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <QuickStartCard
            icon="📁"
            title="初始化项目"
            description="选择一个项目目录并初始化宫殿"
            command="mempalace init ~/projects/myapp"
          />
          <QuickStartCard
            icon="💬"
            title="导入对话"
            description="从 Claude、ChatGPT 等导入对话历史"
            command="mempalace mine ~/chats --mode convos"
          />
          <QuickStartCard
            icon="🔍"
            title="开始搜索"
            description="添加记忆后即可搜索"
            command='mempalace search "your query"'
          />
        </div>
      </div>

      {/* Empty State Illustration */}
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-12">
        <div className="text-center">
          <Folder className="w-16 h-16 mx-auto mb-4 text-slate-600" />
          <h3 className="text-lg font-semibold text-slate-300 mb-2">暂无记忆</h3>
          <p className="text-slate-500 mb-6">
            使用以下命令添加你的第一个记忆：
          </p>
          <div className="bg-slate-900 rounded-lg p-4 inline-block text-left">
            <code className="text-sm text-green-400">
              $ mempalace init ~/projects/myapp
            </code>
            <br />
            <code className="text-sm text-blue-400">
              $ mempalace mine ~/projects/myapp
            </code>
          </div>
        </div>
      </div>
    </div>
  )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">记忆宫殿</h1>
          <p className="text-slate-400">浏览你的 AI 记忆宫殿结构</p>
        </div>
        <div className="text-sm text-slate-500">
          {wings.length} 个翼 · {wings.reduce((sum, [, count]) => sum + count, 0)} 个房间
        </div>
      </div>

      {/* Wings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wings.map(([wingName, roomCount]) => (
          <WingCard
            key={wingName}
            wingName={wingName}
            roomCount={roomCount}
            isExpanded={expandedWings[wingName]}
            onToggle={() => toggleWing(wingName)}
          />
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="总翼数"
          value={wings.length}
          icon="🏛️"
          color="from-primary-500/20 to-primary-600/20 text-primary-400 border-primary-500/30"
          trend="+0"
        />
        <StatCard
          title="总房间数"
          value={wings.reduce((sum, [, count]) => sum + count, 0)}
          icon="🚪"
          color="from-wing-500/20 to-wing-600/20 text-wing-400 border-wing-500/30"
          trend="+0"
        />
        <StatCard
          title="总记忆数"
          value={wings.reduce((sum, [, count]) => sum + count, 0)}
          icon="💾"
          color="from-green-500/20 to-green-600/20 text-green-400 border-green-500/30"
          trend="+0"
        />
      </div>
    </div>
  )
}

function WingItem({ wingName, roomCount, isExpanded, onToggle }) {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchRooms = async () => {
    if (isExpanded || rooms.length > 0) return

    setLoading(true)
    try {
      const res = await fetch(`/api/wings/${encodeURIComponent(wingName)}`)
      const data = await res.json()
      setRooms(data.rooms || {})
    } catch (error) {
      console.error('Failed to fetch rooms:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClick = () => {
    onToggle()
    if (!isExpanded) {
      fetchRooms()
    }
  }

  return (
    <div className="group">
      <button
        onClick={handleClick}
        className="w-full px-4 py-3 flex items-center justify-between bg-slate-800/50 hover:bg-slate-700/50 rounded-xl transition-all duration-200 border border-slate-700 hover:border-slate-600 group-hover:shadow-lg"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg transition-all duration-200 ${
            isExpanded ? 'bg-primary-500/20 text-primary-400' : 'bg-slate-700/50 text-slate-400 group-hover:bg-slate-700'
          }`}>
            {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
          </div>
          <FolderOpen className={`w-5 h-5 transition-colors duration-200 ${
            isExpanded ? 'text-primary-400' : 'text-slate-500 group-hover:text-slate-300'
          }`} />
          <span className="font-medium">{wingName}</span>
          <span className="text-sm text-slate-500">({roomCount} 房间)</span>
        </div>
      </button>

      {isExpanded && (
        <div className="mt-2 ml-4 space-y-1 animate-fade-in">
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-slate-500 py-2">
              <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              加载房间中...
            </div>
          ) : Object.keys(rooms).length > 0 ? (
            Object.entries(rooms).map(([roomName, count]) => (
              <div
                key={roomName}
                className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-slate-700/30 transition-colors cursor-pointer group/item"
              >
                <FileText className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{roomName}</span>
                <span className="text-xs text-slate-600 ml-auto">{count}</span>
              </div>
            ))
          ) : (
            <div className="text-sm text-slate-500 py-2">暂无房间</div>
          )}
        </div>
      )}
    </div>
  )
}

function WingCard({ wingName, roomCount, isExpanded, onToggle }) {
  const [rooms, setRooms] = useState({})
  const [loading, setLoading] = useState(false)

  const fetchRooms = async () => {
    if (isExpanded || Object.keys(rooms).length > 0) return

    setLoading(true)
    try {
      const res = await fetch(`/api/wings/${encodeURIComponent(wingName)}`)
      const data = await res.json()
      setRooms(data.rooms || {})
    } catch (error) {
      console.error('Failed to fetch rooms:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClick = () => {
    onToggle()
    if (!isExpanded) {
      fetchRooms()
    }
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden shadow-xl hover:shadow-2xl hover:border-slate-600 transition-all duration-300 animate-fade-in">
      <button
        onClick={handleClick}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl transition-all duration-200 ${
            isExpanded
              ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25'
              : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
          }`}>
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-200">{wingName}</h3>
            <p className="text-xs text-slate-500">{roomCount} 个房间</p>
          </div>
        </div>
        <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>
      </button>

      {isExpanded && (
        <div className="px-6 pb-4 space-y-2 animate-fade-in">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : Object.keys(rooms).length > 0 ? (
            Object.entries(rooms).map(([roomName, count]) => (
              <div
                key={roomName}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-primary-500/30 hover:bg-slate-800 transition-all duration-200 cursor-pointer group"
              >
                <FileText className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{roomName}</span>
                <span className="ml-auto text-xs font-semibold text-primary-400">{count}</span>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-sm text-slate-500">
              <Folder className="w-8 h-8 mx-auto mb-2 opacity-50" />
              暂无房间
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function StatCard({ title, value, icon, color, trend }) {
  return (
    <div className={`${color} rounded-2xl border p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${color.replace('from-', 'bg-').replace('to-', 'to-').split(' ')[0]}`}>
          <span className="text-2xl">{icon}</span>
        </div>
        {trend && (
          <span className="text-xs font-medium text-green-400 bg-green-500/20 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-slate-400">{title}</div>
    </div>
  )
}

function QuickStartCard({ icon, title, description, command }) {
  return (
    <div className="group relative bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6 hover:border-primary-500/50 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 mb-4">{description}</p>
      <code className="block bg-slate-900 px-3 py-2 rounded-lg text-xs text-primary-400 font-mono">
        {command}
      </code>
    </div>
  )
}
