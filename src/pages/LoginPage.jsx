import { useState } from 'react'
import { useApp } from '../context/AppContext'

const roles = [
  {
    id: 'produksi',
    label: 'Produksi',
    desc: 'Buat request material, monitor proses produksi, dan lihat status batch.',
    icon: '⚙️',
    color: 'blue',
    users: [{ name: 'Operator Produksi', pass: 'prod123' }]
  },
  {
    id: 'warehouse',
    label: 'Warehouse',
    desc: 'Verifikasi stok bahan baku, kelola inventaris, dan proses approval pertama.',
    icon: '🏭',
    color: 'emerald',
    users: [{ name: 'Staff Warehouse', pass: 'wh123' }]
  },
  {
    id: 'ppc',
    label: 'PPC',
    desc: 'Kelola jadwal produksi, buat schedule, dan approval final distribusi material.',
    icon: '📋',
    color: 'amber',
    users: [{ name: 'Planner PPC', pass: 'ppc123' }]
  },
]

const colorMap = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', hover: 'hover:bg-blue-50 hover:border-blue-300', selected: 'bg-blue-50 border-blue-400 ring-2 ring-blue-200' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', hover: 'hover:bg-emerald-50 hover:border-emerald-300', selected: 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-200' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', hover: 'hover:bg-amber-50 hover:border-amber-300', selected: 'bg-amber-50 border-amber-400 ring-2 ring-amber-200' },
}

export default function LoginPage() {
  const { setCurrentRole } = useApp()
  const [selectedRole, setSelectedRole] = useState(null)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = () => {
    if (!selectedRole) { setError('Pilih role terlebih dahulu.'); return }
    const role = roles.find(r => r.id === selectedRole)
    const valid = role.users.some(u => u.pass === password)
    if (valid) {
      setCurrentRole(selectedRole)
    } else {
      setError('Password salah. Coba lagi.')
    }
  }

  const handleQuickLogin = (roleId) => {
    setCurrentRole(roleId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-white text-2xl font-bold">N</span>
          </div>
          <h1 className="text-white text-2xl font-bold tracking-tight">NKSI Production System</h1>
          <p className="text-slate-400 text-sm mt-1">Sistem Manajemen Produksi & Distribusi Material</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6">
          <h2 className="text-slate-800 font-semibold text-base mb-4">Pilih Role</h2>

          <div className="grid grid-cols-3 gap-3 mb-5">
            {roles.map(role => {
              const c = colorMap[role.color]
              const isSelected = selectedRole === role.id
              return (
                <button
                  key={role.id}
                  onClick={() => { setSelectedRole(role.id); setError('') }}
                  className={`p-3 rounded-xl border-2 text-left transition-all duration-150 ${isSelected ? c.selected : `bg-white border-slate-200 ${c.hover}`}`}
                >
                  <div className="text-xl mb-1">{role.icon}</div>
                  <div className={`text-xs font-semibold ${isSelected ? c.text : 'text-slate-700'}`}>{role.label}</div>
                  <div className="text-xs text-slate-400 mt-0.5 leading-tight hidden sm:block">{role.desc.split(',')[0]}</div>
                </button>
              )
            })}
          </div>

          {selectedRole && (
            <div className="mb-4 animate-in">
              <label className="label">Password</label>
              <input
                type="password"
                className="input"
                placeholder={`Password untuk ${roles.find(r => r.id === selectedRole)?.label}`}
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                autoFocus
              />
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
              <p className="text-xs text-slate-400 mt-1.5">
                Password demo: {roles.find(r => r.id === selectedRole)?.users[0].pass}
              </p>
            </div>
          )}

          <button
            onClick={handleLogin}
            className="w-full btn-primary justify-center py-2.5 text-sm"
          >
            Masuk ke Sistem
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100" /></div>
            <div className="relative flex justify-center"><span className="bg-white px-2 text-xs text-slate-400">atau akses cepat (demo)</span></div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {roles.map(role => (
              <button
                key={role.id}
                onClick={() => handleQuickLogin(role.id)}
                className="text-xs py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 transition-colors"
              >
                {role.icon} {role.label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-slate-500 text-xs mt-4">
          PT. NKSI · Sistem Manajemen Produksi v1.0 · Prototype
        </p>
      </div>
    </div>
  )
}
