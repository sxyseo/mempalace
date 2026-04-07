import { useEffect, useState } from 'react'
import { Clock, Calendar, Filter, ChevronDown, FileText, Tag } from 'lucide-react'

export default function TimelineView() {
  const [timeline, setTimeline] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEntity, setSelectedEntity] = useState('')
  const [entities, setEntities] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchTimeline()
    fetchEntities()
  }, [selectedEntity])

  const fetchTimeline = async () => {
    setLoading(true)
    try {
      const url = selectedEntity
        ? `/api/timeline?entity=${encodeURIComponent(selectedEntity)}&limit=100`
        : '/api/timeline?limit=100'

      const res = await fetch(url)
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }
      const data = await res.json()
      setTimeline(data.events || [])
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch timeline:', error)
      setLoading(false)
    }
  }

  const fetchEntities = async () => {
    try {
      const res = await fetch('/api/graph')
      if (!res.ok) return

      const data = await res.json()
      const entityList = (data.entities || []).slice(0, 50)
      setEntities(entityList)
    } catch (error) {
      console.error('Failed to fetch entities:', error)
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return '未知时间'
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const groupByDate = (events) => {
    const groups = {}
    events.forEach(event => {
      const date = new Date(event.timestamp * 1000).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(event)
    })
    return groups
  }

  const groupedEvents = groupByDate(timeline)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary-400 to-wing-400 bg-clip-text text-transparent">
            时间线
          </h1>
          <p className="text-slate-400">按时间顺序浏览记忆的演变历程</p>
        </div>
        <div className="text-sm text-slate-500">
          {timeline.length} 个事件
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Calendar className="w-5 h-5 text-slate-400" />
            <select
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
              className="flex-1 px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
            >
              <option value="">所有实体</option>
              {entities.map(entity => (
                <option key={entity} value={entity}>{entity}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            <Filter className="w-4 h-4" />
            筛选
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FilterSelect
                label="记忆类型"
                options={['全部', '事实', '事件', '发现', '偏好', '建议']}
                value="全部"
              />
              <FilterSelect
                label="时间范围"
                options={['全部', '今天', '本周', '本月', '本年']}
                value="全部"
              />
              <FilterSelect
                label="排序方式"
                options={['最新', '最旧', '相关度']}
                value="最新"
              />
            </div>
          </div>
        )}
      </div>

      {/* Timeline */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">加载时间线中...</p>
          </div>
        </div>
      ) : timeline.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Clock className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-2">暂无时间线数据</p>
            <p className="text-sm text-slate-500">添加一些记忆后，时间线会自动生成</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedEvents).map(([date, events]) => (
            <div key={date} className="relative">
              {/* Date Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-500/20 border-2 border-primary-500">
                  <Calendar className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-200">
                    {new Date(date).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </h3>
                  <p className="text-sm text-slate-500">{events.length} 个事件</p>
                </div>
              </div>

              {/* Events */}
              <div className="ml-6 space-y-4">
                {events.map((event, index) => (
                  <TimelineEvent key={index} event={event} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function TimelineEvent({ event }) {
  return (
    <div className="relative pl-6 pb-6 border-l-2 border-slate-700 last:border-0">
      {/* Timeline Dot */}
      <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-primary-500 border-2 border-slate-900 transform -translate-x-[9px]"></div>

      {/* Event Card */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-4 hover:border-primary-500/30 transition-all duration-200">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-primary-400 font-mono">
                {new Date(event.timestamp * 1000).toLocaleTimeString('zh-CN', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
              {event.entity && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-wing-500/20 text-wing-400 border border-wing-500/30">
                  {event.entity}
                </span>
              )}
            </div>
            <h4 className="font-semibold text-slate-200">{event.title || '未命名事件'}</h4>
          </div>
          {event.type && (
            <span className="px-2 py-1 text-xs rounded-lg bg-slate-700 text-slate-400">
              {event.type}
            </span>
          )}
        </div>

        {event.description && (
          <p className="text-sm text-slate-400 mt-2 line-clamp-2">{event.description}</p>
        )}

        {event.tags && event.tags.length > 0 && (
          <div className="flex items-center gap-2 mt-3">
            <Tag className="w-3 h-3 text-slate-500" />
            <div className="flex flex-wrap gap-1">
              {event.tags.slice(0, 3).map((tag, i) => (
                <span key={i} className="px-2 py-0.5 text-xs rounded bg-slate-700/50 text-slate-400">
                  {tag}
                </span>
              ))}
              {event.tags.length > 3 && (
                <span className="text-xs text-slate-500">+{event.tags.length - 3}</span>
              )}
            </div>
          </div>
        )}

        {event.metadata && (
          <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center gap-4 text-xs text-slate-500">
            {event.metadata.wing && (
              <span>翼: {event.metadata.wing}</span>
            )}
            {event.metadata.room && (
              <span>房间: {event.metadata.room}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function FilterSelect({ label, options, value }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-400 mb-1">{label}</label>
      <select
        value={value}
        className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white text-sm"
      >
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  )
}
