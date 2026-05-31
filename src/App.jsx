import { useState } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import LoginPage from './pages/LoginPage'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import RequestPage from './pages/RequestPage'
import ApprovalPage from './pages/ApprovalPage'
import StockPage from './pages/StockPage'
import SchedulePage from './pages/SchedulePage'
import MonitoringPage from './pages/MonitoringPage'
import HistoryPage from './pages/HistoryPage'

function AppInner() {
  const { currentRole } = useApp()
  const [activePage, setActivePage] = useState('dashboard')

  if (!currentRole) return <LoginPage />

  const pageMap = {
    dashboard: <Dashboard setActivePage={setActivePage} />,
    request: <RequestPage />,
    approval: <ApprovalPage />,
    stock: <StockPage />,
    schedule: <SchedulePage />,
    monitoring: <MonitoringPage />,
    history: <HistoryPage />,
  }

  return (
    <Layout activePage={activePage} setActivePage={setActivePage}>
      {pageMap[activePage] || <Dashboard setActivePage={setActivePage} />}
    </Layout>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}
