import { BarChart3 } from 'lucide-react'

export default function StatsView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">统计概览</h1>
        <p className="text-gray-400">记忆宫殿的统计数据和分析</p>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 p-12 text-center">
        <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-600" />
        <h3 className="text-lg font-medium text-gray-300 mb-2">统计数据</h3>
        <p className="text-gray-500 mb-4">此功能正在开发中</p>
        <p className="text-sm text-gray-600">将显示记忆数量、分布趋势等信息</p>
      </div>
    </div>
  )
}
