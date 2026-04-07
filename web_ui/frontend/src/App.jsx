import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import PalaceView from './views/PalaceView'
import SearchView from './views/SearchView'
import MemoryView from './views/MemoryView'
import GraphView from './views/GraphView'
import StatsView from './views/StatsView'
import TimelineView from './views/TimelineView'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<PalaceView />} />
        <Route path="/search" element={<SearchView />} />
        <Route path="/memory/:id" element={<MemoryView />} />
        <Route path="/graph" element={<GraphView />} />
        <Route path="/stats" element={<StatsView />} />
        <Route path="/timeline" element={<TimelineView />} />
      </Routes>
    </Layout>
  )
}

export default App
