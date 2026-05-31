import { useState } from 'react'
import { useApp } from '../context/AppContext'

const roleConfig = {
  produksi: {
    label: 'Produksi',
    name: 'Operator Produksi',
    initials: 'OP',
    color: 'bg-blue-100 text-blue-700',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    nav: ['dashboard', 'request', 'approval', 'monitoring', 'history'],
  },
  warehouse: {
    label: 'Warehouse',
    name: 'Staff Warehouse',
    initials: 'WH',
    color: 'bg-emerald-100 text-emerald-700',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    nav: ['dashboard', 'approval', 'stock', 'monitoring', 'history'],
  },
  ppc: {
    label: 'PPC',
    name: 'Planner PPC',
    initials: 'PC',
    color: 'bg-amber-100 text-amber-700',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    nav: ['dashboard', 'approval', 'schedule', 'monitoring', 'history'],
  },
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
  { id: 'request', label: 'Request Produksi', icon: '＋' },
  { id: 'approval', label: 'Approval', icon: '✓', badge: true },
  { id: 'stock', label: 'Manajemen Stok', icon: '📦' },
  { id: 'schedule', label: 'Jadwal Produksi', icon: '📅' },
  { id: 'monitoring', label: 'Monitoring T-101', icon: '◎' },
  { id: 'history', label: 'Riwayat', icon: '⊙' },
]

export default function Layout({ activePage, setActivePage, children }) {
  const { currentRole, setCurrentRole, getPendingForRole, getUnreadCount, notifications, markNotifRead, markAllRead } = useApp()
  const [showNotif, setShowNotif] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const cfg = roleConfig[currentRole]
  const pendingCount = getPendingForRole().length
  const unreadCount = getUnreadCount()

  const myNotifs = notifications.filter(n => n.role === currentRole || n.role === 'all')

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-60 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">N</div>
            <div>
              <div className="text-sm font-bold text-slate-800 leading-tight">NKSI</div>
              <div className="text-xs text-slate-400 leading-tight">Sistem Produksi</div>
            </div>
          </div>
        </div>

        {/* Role indicator */}
        <div className="px-3 py-3 border-b border-slate-100">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${cfg.badgeColor}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${cfg.color}`}>
              {cfg.initials}
            </div>
            <div>
              <div className="text-xs font-semibold leading-tight">{cfg.name}</div>
              <div className="text-xs opacity-70 leading-tight">Role: {cfg.label}</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.filter(n => cfg.nav.includes(n.id)).map(item => (
            <button
              key={item.id}
              onClick={() => { setActivePage(item.id); setSidebarOpen(false) }}
              className={`sidebar-link w-full ${activePage === item.id ? 'active' : ''}`}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && pendingCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 font-medium">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-100">
          <button
            onClick={() => setCurrentRole(null)}
            className="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <span className="text-base w-5 text-center">→</span>
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
            >
              ☰
            </button>
            <div>
              <h1 className="text-sm font-semibold text-slate-800">
                {navItems.find(n => n.id === activePage)?.label || 'Dashboard'}
              </h1>
              <p className="text-xs text-slate-400">PT. NKSI · {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotif(!showNotif)}
                className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotif && (
                <div className="absolute right-0 top-full mt-1 w-80 bg-white rounded-xl border border-slate-200 shadow-xl z-50">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                    <span className="text-sm font-semibold text-slate-800">Notifikasi</span>
                    <button onClick={markAllRead} className="text-xs text-blue-600 hover:text-blue-700">Tandai semua dibaca</button>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {myNotifs.length === 0 ? (
                      <div className="py-8 text-center text-sm text-slate-400">Tidak ada notifikasi</div>
                    ) : myNotifs.map(n => (
                      <div
                        key={n.id}
                        onClick={() => markNotifRead(n.id)}
                        className={`px-4 py-3 border-b border-slate-50 cursor-pointer hover:bg-slate-50 ${!n.read ? 'bg-blue-50/50' : ''}`}
                      >
                        <div className="flex items-start gap-2">
                          {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />}
                          {n.read && <div className="w-1.5 h-1.5 flex-shrink-0" />}
                          <div>
                            <p className="text-xs text-slate-700 leading-snug">{n.msg}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${cfg.color}`}>
              {cfg.initials}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
