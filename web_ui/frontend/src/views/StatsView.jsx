import { useEffect, useState } from 'react'
import { BarChart3, TrendingUp, Database, Zap, Activity, PieChart as PieChartIcon } from 'lucide-react'
import { Bar, Line, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function StatsView() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stats')
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }
      const data = await res.json()
      setStats(data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">加载统计数据中...</p>
        </div>
      </div>
    )
  }

  // Prepare chart data
  const wingsData = stats?.wings ? Object.entries(stats.wings).sort((a, b) => b[1] - a[1]).slice(0, 10) : []
  const roomsData = stats?.rooms ? Object.entries(stats.rooms).sort((a, b) => b[1] - a[1]).slice(0, 10) : []

  const wingChartData = {
    labels: wingsData.map(([name]) => name),
    datasets: [{
      label: '记忆数量',
      data: wingsData.map(([, count]) => count),
      backgroundColor: 'rgba(139, 92, 246, 0.5)',
      borderColor: 'rgba(139, 92, 246, 1)',
      borderWidth: 2
    }]
  }

  const roomChartData = {
    labels: roomsData.map(([name]) => name),
    datasets: [{
      label: '记忆数量',
      data: roomsData.map(([, count]) => count),
      backgroundColor: 'rgba(245, 158, 11, 0.5)',
      borderColor: 'rgba(245, 158, 11, 1)',
      borderWidth: 2
    }]
  }

  const doughnutData = {
    labels: wingsData.map(([name]) => name),
    datasets: [{
      data: wingsData.map(([, count]) => count),
      backgroundColor: [
        'rgba(139, 92, 246, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(99, 102, 241, 0.8)',
        'rgba(20, 184, 166, 0.8)',
        'rgba(249, 115, 22, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(34, 197, 94, 0.8)'
      ],
      borderWidth: 2,
      borderColor: '#1e293b'
    }]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#e2e8f0',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(51, 65, 85, 0.3)'
        },
        ticks: {
          color: '#94a3b8'
        }
      },
      y: {
        grid: {
          color: 'rgba(51, 65, 85, 0.3)'
        },
        ticks: {
          color: '#94a3b8'
        }
      }
    }
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#cbd5e1',
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#e2e8f0',
        bodyColor: '#cbd5e1'
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-primary-500/20 to-wing-500/20 ring-1 ring-primary-500/50">
          <BarChart3 className="w-8 h-8 text-primary-400" />
        </div>
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary-400 via-wing-400 to-primary-400 bg-clip-text text-transparent">
          统计概览
        </h1>
        <p className="text-slate-400 text-lg">记忆宫殿的统计数据和深度分析</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="总记忆数"
          value={stats?.total_memories || 0}
          icon={<Database className="w-6 h-6" />}
          color="from-primary-500/20 to-primary-600/20 text-primary-400 border-primary-500/30"
        />
        <StatCard
          title="总翼数"
          value={Object.keys(stats?.wings || {}).length}
          icon={<TrendingUp className="w-6 h-6" />}
          color="from-wing-500/20 to-wing-600/20 text-wing-400 border-wing-500/30"
        />
        <StatCard
          title="总房间数"
          value={Object.keys(stats?.rooms || {}).length}
          icon={<Zap className="w-6 h-6" />}
          color="from-green-500/20 to-green-600/20 text-green-400 border-green-500/30"
        />
        <StatCard
          title="实体数"
          value={stats?.knowledge_graph?.entity_count || 0}
          icon={<Activity className="w-6 h-6" />}
          color="from-blue-500/20 to-blue-600/20 text-blue-400 border-blue-500/30"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wing Distribution */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="w-5 h-5 text-primary-400" />
            <h3 className="text-lg font-semibold text-slate-200">翼分布</h3>
          </div>
          <div style={{ height: '300px' }}>
            {wingsData.length > 0 ? (
              <Doughnut data={doughnutData} options={doughnutOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">
                暂无数据
              </div>
            )}
          </div>
        </div>

        {/* Top Wings */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-wing-400" />
            <h3 className="text-lg font-semibold text-slate-200">Top 10 翼</h3>
          </div>
          <div style={{ height: '300px' }}>
            {wingsData.length > 0 ? (
              <Bar data={wingChartData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">
                暂无数据
              </div>
            )}
          </div>
        </div>

        {/* Top Rooms */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-slate-200">Top 10 房间</h3>
          </div>
          <div style={{ height: '300px' }}>
            {roomsData.length > 0 ? (
              <Bar data={roomChartData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">
                暂无数据
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Knowledge Graph Stats */}
      {stats?.knowledge_graph && (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-slate-200">知识图谱统计</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KGStatItem label="实体数量" value={stats.knowledge_graph.entity_count || 0} />
            <KGStatItem label="关系数量" value={stats.knowledge_graph.triple_count || 0} />
            <KGStatItem label="平均连接度" value={(stats.knowledge_graph.avg_degree || 0).toFixed(2)} />
            <KGStatItem label="最大连接度" value={stats.knowledge_graph.max_degree || 0} />
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className={`${color} rounded-xl border p-4 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${color.replace('from-', 'bg-').replace('to-', 'to-').split(' ')[0]}`}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-slate-400">{title}</div>
    </div>
  )
}

function KGStatItem({ label, value }) {
  return (
    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
      <div className="text-lg font-bold text-blue-400 mb-1">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  )
}
