import { useParams, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'

export default function MemoryView() {
  const { id } = useParams()
  const [memory, setMemory] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMemory()
  }, [id])

  const fetchMemory = async () => {
    try {
      const res = await fetch(`/api/memories/${id}`)
      const data = await res.json()
      setMemory(data)
    } catch (error) {
      console.error('Failed to fetch memory:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-gray-400">加载中...</div>
  }

  if (!memory) {
    return <div className="text-gray-400">记忆不存在</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold">记忆详情</h1>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-palace-600/20 text-palace-400 rounded text-sm">
                {memory.metadata?.wing}
              </span>
              <span className="text-gray-600">→</span>
              <span className="px-2 py-1 bg-wing-600/20 text-wing-400 rounded text-sm">
                {memory.metadata?.room}
              </span>
            </div>
            <div className="text-sm text-gray-500">ID: {memory.id}</div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
              <Edit className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-red-400">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <p>{memory.document}</p>
        </div>

        {memory.metadata && (
          <div className="mt-6 pt-6 border-t border-gray-700">
            <h3 className="text-sm font-medium text-gray-400 mb-3">元数据</h3>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              {Object.entries(memory.metadata).map(([key, value]) => (
                <div key={key}>
                  <dt className="text-gray-500">{key}</dt>
                  <dd className="text-gray-300">{value?.toString()}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </div>
  )
}
