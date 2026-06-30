import { useState } from 'react'
import type { ModuleId } from './components/header/Header'
import ThemeProvider from './components/ThemeProvider'
import Header from './components/header/Header'
import SettingsDialog from './components/settings/SettingsDialog'
import EditPage from './pages/EditPage'
import LibraryPage from './pages/LibraryPage'
import NodesPage from './pages/NodesPage'
import LensPage from './pages/LensPage'

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleId>('edit')

  return (
    <ThemeProvider>
      <div className="w-screen h-screen flex flex-col">
        <Header activeModule={activeModule} onModuleChange={setActiveModule} />
        {activeModule === 'edit' && <EditPage />}
        {activeModule === 'library' && <LibraryPage />}
        {activeModule === 'nodes' && <NodesPage />}
        {activeModule === 'lens' && <LensPage />}
      </div>
      <SettingsDialog />
    </ThemeProvider>
  )
}
