import { Canvas } from './components/Canvas'
import { Settings } from './components/Settings'
import { WidgetSettings } from './components/WidgetSettings'

function App() {
  return (
    <main className="animate-fade-in">
      <Canvas />
      <Settings />
      <WidgetSettings />
    </main>
  )
}

export default App
