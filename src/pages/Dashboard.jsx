import { useApp } from '../context/AppContext'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const chartData = [
  { day: '27 Mei', volume: 18200 },
  { day: '28 Mei', volume: 19500 },
  { day: '29 Mei', volume: 22100 },
  { day: '30 Mei', volume: 20800 },
  { day: '31 Mei', volume: 19200 },
  { day: '01 Jun', volume: 21450 },
]

const StatusBadge = ({ status }) => {
  const map = {
    pending_warehouse: <span className="badge badge-pending">Menunggu Warehouse</span>,
    pending_ppc: <span className="badge badge-process">Menunggu PPC</span>,
    approved: <span className="badge badge-approved">Disetujui</span>,
    rejected: <span className="badge badge-rejected">Ditolak</span>,
  }
  return map[status] || <span className="badge">{status}</span>
}

export default function Dashboard({ setActivePage }) {
  const { currentRole, requests, tankLevel, getPendingForRole } = useApp()
  const pendingCount = getPendingForRole().length
  const approvedToday = requests.filter(r => r.status === 'approved' && r.createdAt.includes('01 Jun')).length
  const recentRequests = requests.slice(0, 5)

  const tankFillHeight = `${tankLevel}%`

  return (
    <div className="space-y-5 animate-in">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="stat-card">
          <p className="text-xs text-slate-500 mb-1">Volume T-101</p>
          <p className="text-2xl font-semibold text-slate-800">21.450 L</p>
          <p className="text-xs text-emerald-600 mt-1">↑ {tankLevel}% kapasitas</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-slate-500 mb-1">Request Pending</p>
          <p className={`text-2xl font-semibold ${pendingCount > 0 ? 'text-amber-600' : 'text-slate-800'}`}>{pendingCount}</p>
          <p className="text-xs text-slate-400 mt-1">menunggu persetujuan</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-slate-500 mb-1">Disetujui Hari Ini</p>
          <p className="text-2xl font-semibold text-emerald-600">{approvedToday}</p>
          <p className="text-xs text-slate-400 mt-1">request selesai diproses</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-slate-500 mb-1">Status Pompa</p>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
            <p className="text-sm font-semibold text-emerald-600">AKTIF</p>
          </div>
          <p className="text-xs text-slate-400 mt-1">150 L/min · 65 Hz</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Tank visualization */}
        <div className="card">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Tangki T-101 — Daigiri Storage</h3>
          <div className="flex items-end gap-6">
            {/* Tank visual */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-20 h-48 border-2 border-blue-400 rounded-b-lg rounded-t-sm bg-slate-100 overflow-hidden">
                {/* Level markers */}
                <div className="absolute w-full border-t border-dashed border-red-400" style={{top: '10%'}}>
                  <span className="absolute -right-8 text-xs text-red-500" style={{top: '-8px'}}>LSHH</span>
                </div>
                <div className="absolute w-full border-t border-dashed border-amber-400" style={{top: '20%'}}>
                  <span className="absolute -right-7 text-xs text-amber-500" style={{top: '-8px'}}>LSH</span>
                </div>
                <div className="absolute w-full border-t border-dashed border-emerald-400" style={{top: '80%'}}>
                  <span className="absolute -right-6 text-xs text-emerald-500" style={{top: '-8px'}}>LSL</span>
                </div>
                {/* Fill */}
                <div
                  className="absolute bottom-0 left-0 right-0 bg-blue-300/70 tank-fill-bar"
                  style={{ height: tankFillHeight }}
                >
                  <div className="absolute top-1 left-0 right-0 text-center">
                    <span className="text-xs font-semibold text-blue-800">{tankLevel}%</span>
                  </div>
                </div>
              </div>
              <span className="text-xs text-slate-500">30.000 L</span>
            </div>
            {/* Sensor status */}
            <div className="flex-1 space-y-2">
              {[
                { tag: 'LSHH-101', label: 'Level Switch Hi-Hi', val: 'OFF', ok: true },
                { tag: 'LIT-101', label: 'Level Indicator', val: '21.450 L', ok: true },
                { tag: 'LSH-101', label: 'Level Switch High', val: 'OFF', ok: true },
                { tag: 'LSL-101', label: 'Level Switch Low', val: 'OFF', ok: true },
                { tag: 'PVRV', label: 'Pressure Vacuum RV', val: 'Normal', ok: true },
              ].map(s => (
                <div key={s.tag} className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono font-medium text-slate-600">{s.tag}</span>
                    <span className="text-xs text-slate-400 ml-1">{s.label}</span>
                  </div>
                  <span className={`text-xs font-medium ${s.ok ? 'text-emerald-600' : 'text-red-500'}`}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="card lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Riwayat Level T-101 (7 Hari)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="tankGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={[15000, 25000]} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => [`${v.toLocaleString('id-ID')} L`, 'Volume']} labelStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="volume" stroke="#3B82F6" strokeWidth={2} fill="url(#tankGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent requests */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-800">Request Terbaru</h3>
          <button onClick={() => setActivePage('history')} className="text-xs text-blue-600 hover:text-blue-700">Lihat semua →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left pb-2 text-xs font-medium text-slate-500">ID</th>
                <th className="text-left pb-2 text-xs font-medium text-slate-500">Material</th>
                <th className="text-left pb-2 text-xs font-medium text-slate-500 hidden sm:table-cell">Volume</th>
                <th className="text-left pb-2 text-xs font-medium text-slate-500 hidden md:table-cell">Pemohon</th>
                <th className="text-left pb-2 text-xs font-medium text-slate-500">Status</th>
                <th className="text-left pb-2 text-xs font-medium text-slate-500 hidden lg:table-cell">Waktu</th>
              </tr>
            </thead>
            <tbody>
              {recentRequests.map(req => (
                <tr key={req.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 font-mono text-xs text-slate-600">{req.id}</td>
                  <td className="py-2.5 text-xs text-slate-700">{req.material}</td>
                  <td className="py-2.5 text-xs text-slate-600 hidden sm:table-cell">{req.volume.toLocaleString('id-ID')} L</td>
                  <td className="py-2.5 text-xs text-slate-500 hidden md:table-cell capitalize">{req.requester}</td>
                  <td className="py-2.5"><StatusBadge status={req.status} /></td>
                  <td className="py-2.5 text-xs text-slate-400 hidden lg:table-cell">{req.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick actions for role */}
      {currentRole === 'produksi' && (
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-blue-800">Buat Request Material</h3>
              <p className="text-xs text-blue-600 mt-0.5">Ajukan permintaan bahan baku untuk produksi hari ini.</p>
            </div>
            <button onClick={() => setActivePage('request')} className="btn-primary text-xs py-2">
              Buat Request →
            </button>
          </div>
        </div>
      )}
      {currentRole === 'warehouse' && pendingCount > 0 && (
        <div className="card bg-amber-50 border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-amber-800">{pendingCount} Request Menunggu Verifikasi Stok</h3>
              <p className="text-xs text-amber-600 mt-0.5">Periksa ketersediaan bahan baku dan proses approval.</p>
            </div>
            <button onClick={() => setActivePage('approval')} className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors">
              Proses →
            </button>
          </div>
        </div>
      )}
      {currentRole === 'ppc' && pendingCount > 0 && (
        <div className="card bg-emerald-50 border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-emerald-800">{pendingCount} Request Menunggu Konfirmasi Jadwal</h3>
              <p className="text-xs text-emerald-600 mt-0.5">Verifikasi kesesuaian dengan jadwal produksi dan setujui.</p>
            </div>
            <button onClick={() => setActivePage('approval')} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors">
              Proses →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
