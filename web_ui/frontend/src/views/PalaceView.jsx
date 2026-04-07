import { useState, useEffect } from 'react'
import { ChevronRight, ChevronDown, FolderOpen, FileText } from 'lucide-react'

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
      const data = await res.json()
      setWings(data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch wings:', error)
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
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">加载中...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">记忆宫殿</h1>
        <p className="text-gray-400">浏览你的记忆宫殿结构</p>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">翼与房间</h2>
        </div>

        <div className="divide-y divide-gray-700">
          {wings.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-400">
              暂无记忆，请先使用 <code className="bg-gray-700 px-2 py-1 rounded">mempalace init</code> 和 <code className="bg-gray-700 px-2 py-1 rounded">mempalace mine</code> 命令添加记忆
            </div>
          ) : (
            wings.map(([wingName, roomCount]) => (
              <WingItem
                key={wingName}
                wingName={wingName}
                roomCount={roomCount}
                isExpanded={expandedWings[wingName]}
                onToggle={() => toggleWing(wingName)}
              />
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="总翼数" value={wings.length} color="text-wing-400" />
        <StatCard title="总房间数" value={wings.reduce((sum, [, count]) => sum + count, 0)} color="text-palace-400" />
        <StatCard title="总记忆数" value={wings.reduce((sum, [, count]) => sum + count, 0)} color="text-green-400" />
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
    <div>
      <button
        onClick={handleClick}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          )}
          <FolderOpen className="w-5 h-5 text-wing-400" />
          <span className="font-medium">{wingName}</span>
          <span className="text-sm text-gray-400">({roomCount} 房间)</span>
        </div>
      </button>

      {isExpanded && (
        <div className="px-6 pb-4 pl-14">
          {loading ? (
            <div className="text-sm text-gray-400">加载房间中...</div>
          ) : Object.keys(rooms).length > 0 ? (
            <div className="space-y-1">
              {Object.entries(rooms).map(([roomName, count]) => (
                <div
                  key={roomName}
                  className="flex items-center gap-2 py-2 px-3 rounded hover:bg-gray-700/30 transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-palace-400 flex-shrink-0" />
                  <span className="text-sm">{roomName}</span>
                  <span className="text-xs text-gray-500 ml-auto">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-400">暂无房间</div>
          )}
        </div>
      )}
    </div>
  )
}

function StatCard({ title, value, color }) {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <div className="text-sm text-gray-400 mb-1">{title}</div>
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
    </div>
  )
}
