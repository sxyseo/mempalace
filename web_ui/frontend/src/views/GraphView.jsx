import { useEffect, useRef, useState } from 'react'
import { Network, Loader, AlertCircle, ZoomIn, ZoomOut, RotateCcw, Filter } from 'lucide-react'
import * as d3 from 'd3'

export default function GraphView() {
  const svgRef = useRef(null)
  const [graphData, setGraphData] = useState({ nodes: [], links: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    fetchGraphData()
  }, [])

  useEffect(() => {
    if (graphData.nodes.length > 0 && svgRef.current) {
      renderGraph()
    }
  }, [graphData])

  const fetchGraphData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/graph')
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }
      const data = await res.json()

      // Transform data for D3
      const nodes = (data.entities || []).map((entity, i) => ({
        id: entity,
        group: Math.floor(Math.random() * 5) + 1
      }))

      const links = (data.relationships || []).map((rel, i) => ({
        source: rel.from,
        target: rel.to,
        relation: rel.relation
      })).filter(link => nodes.find(n => n.id === link.source) && nodes.find(n => n.id === link.target))

      setGraphData({ nodes, links })
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch graph data:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  const renderGraph = () => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = svgRef.current.clientWidth
    const height = 600

    // Color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10)

    // Simulation
    const simulation = d3.forceSimulation(graphData.nodes)
      .force('link', d3.forceLink(graphData.links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30))

    // Zoom behavior
    const zoomBehavior = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
        setZoom(event.transform.k)
      })

    svg.call(zoomBehavior)

    const g = svg.append('g')

    // Arrow markers
    svg.append('defs').selectAll('marker')
      .data(['arrow'])
      .join('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#64748b')

    // Links
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(graphData.links)
      .join('line')
      .attr('stroke', '#64748b')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 1.5)
      .attr('marker-end', 'url(#arrow)')

    // Link labels
    const linkLabel = g.append('g')
      .attr('class', 'link-labels')
      .selectAll('text')
      .data(graphData.links)
      .join('text')
      .attr('font-size', '10px')
      .attr('fill', '#94a3b8')
      .attr('text-anchor', 'middle')
      .text(d => d.relation || '')

    // Nodes
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(graphData.nodes)
      .join('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))

    // Node circles
    node.append('circle')
      .attr('r', 8)
      .attr('fill', d => color(d.group))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .on('mouseover', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 12)
          .attr('stroke', '#8b5cf6')
          .attr('stroke-width', 3)
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 8)
          .attr('stroke', '#fff')
          .attr('stroke-width', 2)
      })
      .on('click', (event, d) => {
        setSelectedNode(d)
      })

    // Node labels
    node.append('text')
      .attr('dx', 12)
      .attr('dy', '.35em')
      .text(d => d.id)
      .attr('font-size', '12px')
      .attr('fill', '#e2e8f0')
      .style('pointer-events', 'none')

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)

      linkLabel
        .attr('x', d => (d.source.x + d.target.x) / 2)
        .attr('y', d => (d.source.y + d.target.y) / 2)

      node
        .attr('transform', d => `translate(${d.x},${d.y})`)
    })

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(event, d) {
      d.fx = event.x
      d.fy = event.y
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }
  }

  const handleZoomIn = () => {
    const svg = d3.select(svgRef.current)
    svg.transition().call(d3.zoom().scaleBy, 1.3)
  }

  const handleZoomOut = () => {
    const svg = d3.select(svgRef.current)
    svg.transition().call(d3.zoom().scaleBy, 0.7)
  }

  const handleReset = () => {
    const svg = d3.select(svgRef.current)
    svg.transition().call(d3.zoom().transform, d3.zoomIdentity)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary-400 to-wing-400 bg-clip-text text-transparent">
            知识图谱
          </h1>
          <p className="text-slate-400">可视化实体关系和知识连接</p>
        </div>
        <div className="text-sm text-slate-500">
          {graphData.nodes.length} 个实体 · {graphData.links.length} 个关系
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleZoomIn}
          className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          title="放大"
        >
          <ZoomIn className="w-5 h-5 text-slate-400" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          title="缩小"
        >
          <ZoomOut className="w-5 h-5 text-slate-400" />
        </button>
        <button
          onClick={handleReset}
          className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          title="重置"
        >
          <RotateCcw className="w-5 h-5 text-slate-400" />
        </button>
        <div className="ml-auto text-sm text-slate-500">
          缩放: {zoom.toFixed(1)}x
        </div>
      </div>

      {/* Graph Container */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-[600px]">
            <div className="text-center">
              <Loader className="w-12 h-12 text-primary-400 mx-auto mb-4 animate-spin" />
              <p className="text-slate-400">加载知识图谱中...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[600px]">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-slate-400 mb-2">加载失败</p>
              <p className="text-sm text-slate-500">{error}</p>
            </div>
          </div>
        ) : graphData.nodes.length === 0 ? (
          <div className="flex items-center justify-center h-[600px]">
            <div className="text-center">
              <Network className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 mb-2">暂无知识图谱数据</p>
              <p className="text-sm text-slate-500">添加一些记忆后，知识图谱会自动生成</p>
            </div>
          </div>
        ) : (
          <svg
            ref={svgRef}
            className="w-full"
            style={{ height: '600px' }}
          />
        )}
      </div>

      {/* Selected Node Info */}
      {selectedNode && (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-200 mb-3">选中的实体</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">名称:</span>
              <span className="text-primary-400 font-medium">{selectedNode.id}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">分组:</span>
              <span className="text-wing-400">{selectedNode.group}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">连接数:</span>
              <span className="text-green-400">
                {graphData.links.filter(l => l.source.id === selectedNode.id || l.target.id === selectedNode.id).length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">图例</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <LegendItem color="#8b5cf6" label="实体 1" />
          <LegendItem color="#f59e0b" label="实体 2" />
          <LegendItem color="#10b981" label="实体 3" />
          <LegendItem color="#3b82f6" label="实体 4" />
        </div>
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <div className="w-8 h-0.5 bg-slate-500"></div>
            <span>关系连接</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }}></div>
      <span className="text-sm text-slate-400">{label}</span>
    </div>
  )
}
