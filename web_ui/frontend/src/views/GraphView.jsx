import { Network } from 'lucide-react'

export default function GraphView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">知识图谱</h1>
        <p className="text-gray-400">可视化实体关系和连接</p>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 p-12 text-center">
        <Network className="w-16 h-16 mx-auto mb-4 text-gray-600" />
        <h3 className="text-lg font-medium text-gray-300 mb-2">知识图谱可视化</h3>
        <p className="text-gray-500 mb-4">此功能正在开发中</p>
        <p className="text-sm text-gray-600">将使用 D3.js 创建交互式图谱</p>
      </div>
    </div>
  )
}
