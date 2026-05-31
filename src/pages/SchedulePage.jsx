import { useState } from 'react'
import { useApp } from '../context/AppContext'

const statusConfig = {
  done: { label: 'Selesai', cls: 'badge-approved' },
  on_progress: { label: 'On Progress', cls: 'badge-process' },
  pending: { label: 'Belum Mulai', cls: 'badge-pending' },
}

export default function SchedulePage() {
  const { schedule } = useApp()
  const [filter, setFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [localSchedule, setLocalSchedule] = useState(schedule)
  const [form, setForm] = useState({ id: '', product: '', volume: '', target: '', mixer: 'Mixer 1', formulaId: '' })

  const filtered = filter === 'all' ? localSchedule : localSchedule.filter(s => s.status === filter)

  const handleAdd = () => {
    if (!form.product || !form.volume || !form.target) return
    setLocalSchedule(prev => [{
      ...form,
      volume: Number(form.volume),
      id: `SPD-2024-${String(prev.length + 14).padStart(2, '0')}`,
      status: 'pending'
    }, ...prev])
    setForm({ id: '', product: '', volume: '', target: '', mixer: 'Mixer 1', formulaId: '' })
    setShowForm(false)
  }

  const totals = {
    done: localSchedule.filter(s => s.status === 'done').length,
    on_progress: localSchedule.filter(s => s.status === 'on_progress').length,
    pending: localSchedule.filter(s => s.status === 'pending').length,
  }

  return (
    <div className="space-y-5 animate-in max-w-5xl">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="stat-card border-emerald-200 bg-emerald-50">
          <p className="text-xs text-emerald-600">Selesai</p>
          <p className="text-2xl font-semibold text-emerald-700">{totals.done}</p>
          <p className="text-xs text-emerald-500 mt-1">batch bulan ini</p>
        </div>
        <div className="stat-card border-blue-200 bg-blue-50">
          <p className="text-xs text-blue-600">On Progress</p>
          <p className="text-2xl font-semibold text-blue-700">{totals.on_progress}</p>
          <p className="text-xs text-blue-500 mt-1">sedang berjalan</p>
        </div>
        <div className="stat-card border-amber-200 bg-amber-50">
          <p className="text-xs text-amber-600">Terjadwal</p>
          <p className="text-2xl font-semibold text-amber-700">{totals.pending}</p>
          <p className="text-xs text-amber-500 mt-1">menunggu mulai</p>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Jadwal Produksi — Juni 2024</h2>
            <p className="text-xs text-slate-400 mt-0.5">Schedule Produksi (SPD) yang dikelola PPC</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[['all', 'Semua'], ['pending', 'Pending'], ['on_progress', 'Progress'], ['done', 'Selesai']].map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setFilter(val)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${filter === val ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <button onClick={() => setShowForm(!showForm)} className="btn-primary text-xs py-1.5">
              + Tambah Schedule
            </button>
          </div>
        </div>

        {/* Add form */}
        {showForm && (
          <div className="mb-4 p-4 bg-slate-50 rounded-xl border border-slate-200 animate-in">
            <h3 className="text-xs font-semibold text-slate-700 mb-3">Tambah Schedule Baru</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="label">Nama Produk *</label>
                <input className="input" placeholder="cth. Cat Tembok A" value={form.product} onChange={e => setForm({...form, product: e.target.value})} />
              </div>
              <div>
                <label className="label">Volume (L) *</label>
                <input type="number" className="input" placeholder="0" value={form.volume} onChange={e => setForm({...form, volume: e.target.value})} />
              </div>
              <div>
                <label className="label">Target Selesai *</label>
                <input type="date" className="input" value={form.target} onChange={e => setForm({...form, target: e.target.value})} />
              </div>
              <div>
                <label className="label">Mixer</label>
                <select className="input" value={form.mixer} onChange={e => setForm({...form, mixer: e.target.value})}>
                  <option>Mixer 1</option>
                  <option>Mixer 2</option>
                  <option>Mixer 1+2</option>
                </select>
              </div>
              <div>
                <label className="label">ID Formulasi</label>
                <input className="input" placeholder="cth. F-005" value={form.formulaId} onChange={e => setForm({...form, formulaId: e.target.value})} />
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={handleAdd} className="btn-primary text-xs py-1.5">Simpan Schedule</button>
              <button onClick={() => setShowForm(false)} className="btn-secondary text-xs py-1.5">Batal</button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left pb-3 text-xs font-medium text-slate-500">ID SPD</th>
                <th className="text-left pb-3 text-xs font-medium text-slate-500">Produk</th>
                <th className="text-left pb-3 text-xs font-medium text-slate-500 hidden sm:table-cell">Volume</th>
                <th className="text-left pb-3 text-xs font-medium text-slate-500 hidden md:table-cell">Target</th>
                <th className="text-left pb-3 text-xs font-medium text-slate-500 hidden lg:table-cell">Mixer</th>
                <th className="text-left pb-3 text-xs font-medium text-slate-500 hidden lg:table-cell">Formula</th>
                <th className="text-left pb-3 text-xs font-medium text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-3 font-mono text-xs text-slate-600">{item.id}</td>
                  <td className="py-3 text-xs font-medium text-slate-800">{item.product}</td>
                  <td className="py-3 text-xs text-slate-600 hidden sm:table-cell">{item.volume.toLocaleString('id-ID')} L</td>
                  <td className="py-3 text-xs text-slate-500 hidden md:table-cell">{item.target}</td>
                  <td className="py-3 text-xs text-slate-500 hidden lg:table-cell">{item.mixer}</td>
                  <td className="py-3 text-xs font-mono text-slate-400 hidden lg:table-cell">{item.formulaId || '—'}</td>
                  <td className="py-3">
                    <span className={`badge ${statusConfig[item.status].cls}`}>{statusConfig[item.status].label}</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-slate-400">Tidak ada data untuk filter ini</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
