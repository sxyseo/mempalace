import { Clock } from 'lucide-react'

export default function TimelineView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">时间线</h1>
        <p className="text-gray-400">按时间顺序浏览记忆</p>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 p-12 text-center">
        <Clock className="w-16 h-16 mx-auto mb-4 text-gray-600" />
        <h3 className="text-lg font-medium text-gray-300 mb-2">时间线视图</h3>
        <p className="text-gray-500 mb-4">此功能正在开发中</p>
        <p className="text-sm text-gray-600">将按时间顺序显示所有记忆事件</p>
      </div>
    </div>
  )
}
