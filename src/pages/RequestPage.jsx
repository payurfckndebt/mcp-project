import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { format } from 'date-fns'

const StatusBadge = ({ status }) => {
  const map = {
    pending_warehouse: <span className="badge badge-pending">Menunggu Warehouse</span>,
    pending_ppc: <span className="badge badge-process">Menunggu PPC</span>,
    approved: <span className="badge badge-approved">Disetujui</span>,
    rejected: <span className="badge badge-rejected">Ditolak</span>,
  }
  return map[status] || <span className="badge">{status}</span>
}

export default function RequestPage() {
  const { currentRole, requests, addRequest } = useApp()
  const [submitted, setSubmitted] = useState(false)
  const [submittedId, setSubmittedId] = useState('')
  const [form, setForm] = useState({
    orderId: '',
    material: 'Daigiri A',
    volume: '',
    destination: 'Mixer 1',
    priority: 'Normal',
    note: '',
    date: format(new Date(), 'yyyy-MM-dd'),
  })
  const [errors, setErrors] = useState({})
  const [showDetail, setShowDetail] = useState(null)

  const myRequests = requests.filter(r => r.requester === currentRole)

  const validate = () => {
    const e = {}
    if (!form.orderId.trim()) e.orderId = 'Nomor order wajib diisi'
    if (!form.volume || Number(form.volume) <= 0) e.volume = 'Volume harus lebih dari 0'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length > 0) { setErrors(e2); return }
    const id = addRequest({ ...form, volume: Number(form.volume) })
    setSubmittedId(id)
    setSubmitted(true)
    setForm({ orderId: '', material: 'Daigiri A', volume: '', destination: 'Mixer 1', priority: 'Normal', note: '', date: format(new Date(), 'yyyy-MM-dd') })
    setErrors({})
    setTimeout(() => setSubmitted(false), 5000)
  }

  const selectedReq = showDetail ? requests.find(r => r.id === showDetail) : null

  return (
    <div className="space-y-5 animate-in max-w-4xl">
      {submitted && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 flex-shrink-0">✓</div>
          <div>
            <p className="text-sm font-semibold text-emerald-800">Request {submittedId} berhasil dibuat</p>
            <p className="text-xs text-emerald-600 mt-0.5">Menunggu verifikasi stok oleh Warehouse. Anda akan mendapat notifikasi saat ada update.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Form */}
        <div className="card lg:col-span-3">
          <h2 className="text-sm font-semibold text-slate-800 mb-4">Form Request Material Baru</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Nomor Order (TPD/SPD) *</label>
                <input className={`input ${errors.orderId ? 'border-red-300 focus:ring-red-400' : ''}`} placeholder="cth. TPD-2024-025" value={form.orderId} onChange={e => setForm({...form, orderId: e.target.value})} />
                {errors.orderId && <p className="text-red-500 text-xs mt-1">{errors.orderId}</p>}
              </div>
              <div>
                <label className="label">Tanggal Request</label>
                <input type="date" className="input" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Jenis Material *</label>
                <select className="input" value={form.material} onChange={e => setForm({...form, material: e.target.value})}>
                  <option>Daigiri A</option>
                  <option>Daigiri B</option>
                  <option>Mix A+B</option>
                  <option>Additive X</option>
                  <option>Solvent C</option>
                  <option>Pigmen Putih</option>
                </select>
              </div>
              <div>
                <label className="label">Volume (Liter) *</label>
                <input type="number" className={`input ${errors.volume ? 'border-red-300' : ''}`} placeholder="0" min="1" value={form.volume} onChange={e => setForm({...form, volume: e.target.value})} />
                {errors.volume && <p className="text-red-500 text-xs mt-1">{errors.volume}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Tujuan Pengisian</label>
                <select className="input" value={form.destination} onChange={e => setForm({...form, destination: e.target.value})}>
                  <option>Mixer 1</option>
                  <option>Mixer 2</option>
                  <option>Tanki Proses</option>
                  <option>Drum Kemasan</option>
                  <option>Tanki T-101</option>
                </select>
              </div>
              <div>
                <label className="label">Prioritas</label>
                <select className="input" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                  <option>Normal</option>
                  <option>Urgent</option>
                  <option>Kritis</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label">Catatan Tambahan</label>
              <textarea className="input" rows={3} placeholder="Informasi tambahan untuk Warehouse / PPC..." value={form.note} onChange={e => setForm({...form, note: e.target.value})} />
            </div>

            {/* Flow info */}
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
              <p className="text-xs font-medium text-slate-600 mb-2">Alur Approval:</p>
              <div className="flex items-center gap-1.5 flex-wrap">
                {['Produksi (Kamu)', '→', 'Warehouse (Cek Stok)', '→', 'PPC (Jadwal)', '→', 'Selesai'].map((s, i) => (
                  <span key={i} className={`text-xs ${s === '→' ? 'text-slate-400' : i === 0 ? 'font-semibold text-blue-600' : 'text-slate-500'}`}>{s}</span>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-primary w-full justify-center py-2.5">
              Kirim Request →
            </button>
          </form>
        </div>

        {/* My active requests */}
        <div className="card lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Request Saya ({myRequests.length})</h3>
          <div className="space-y-2">
            {myRequests.length === 0 && (
              <p className="text-xs text-slate-400 py-4 text-center">Belum ada request</p>
            )}
            {myRequests.map(req => (
              <div
                key={req.id}
                onClick={() => setShowDetail(showDetail === req.id ? null : req.id)}
                className="p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 cursor-pointer transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-mono font-medium text-slate-700">{req.id}</span>
                      {req.priority === 'Urgent' && <span className="badge badge-urgent text-xs">Urgent</span>}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{req.material} · {req.volume.toLocaleString('id-ID')} L · {req.destination}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{req.createdAt}</p>
                  </div>
                  <StatusBadge status={req.status} />
                </div>

                {/* Timeline expand */}
                {showDetail === req.id && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-xs font-medium text-slate-600 mb-2">Timeline:</p>
                    <div className="space-y-1.5">
                      {req.timeline.map((t, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${t.status === 'done' ? 'bg-emerald-500' : t.status === 'rejected' ? 'bg-red-500' : 'bg-amber-400'}`} />
                          <div>
                            <p className="text-xs text-slate-600">{t.actor}: {t.action}</p>
                            <p className="text-xs text-slate-400">{t.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {req.rejectReason && (
                      <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-600">
                        Alasan penolakan: {req.rejectReason}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
