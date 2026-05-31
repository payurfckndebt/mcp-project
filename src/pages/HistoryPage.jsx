import { useState } from 'react'
import { useApp } from '../context/AppContext'

const StatusBadge = ({ status }) => {
  const map = {
    pending_warehouse: <span className="badge badge-pending">Menunggu Warehouse</span>,
    pending_ppc: <span className="badge badge-process">Menunggu PPC</span>,
    approved: <span className="badge badge-approved">Disetujui</span>,
    rejected: <span className="badge badge-rejected">Ditolak</span>,
  }
  return map[status] || <span className="badge">{status}</span>
}

export default function HistoryPage() {
  const { requests, currentRole } = useApp()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = requests.filter(r => {
    const matchStatus = filter === 'all' || r.status === filter
    const matchSearch = !search || r.id.toLowerCase().includes(search.toLowerCase()) || r.material.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const selectedReq = selected ? requests.find(r => r.id === selected) : null

  return (
    <div className="space-y-5 animate-in max-w-5xl">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-1">
          {[['all', 'Semua'], ['pending_warehouse', 'Pending WH'], ['pending_ppc', 'Pending PPC'], ['approved', 'Disetujui'], ['rejected', 'Ditolak']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${filter === val ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
            >
              {label}
            </button>
          ))}
        </div>
        <input
          className="input max-w-48 ml-auto"
          placeholder="Cari ID / material..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className={`card ${selected ? 'lg:col-span-3' : 'lg:col-span-5'}`}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-800">Semua Request ({filtered.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left pb-2 text-xs font-medium text-slate-500">ID</th>
                  <th className="text-left pb-2 text-xs font-medium text-slate-500">Material</th>
                  <th className="text-left pb-2 text-xs font-medium text-slate-500 hidden sm:table-cell">Volume</th>
                  <th className="text-left pb-2 text-xs font-medium text-slate-500 hidden md:table-cell">Tujuan</th>
                  <th className="text-left pb-2 text-xs font-medium text-slate-500">Status</th>
                  <th className="text-left pb-2 text-xs font-medium text-slate-500 hidden lg:table-cell">Waktu</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(req => (
                  <tr
                    key={req.id}
                    onClick={() => setSelected(selected === req.id ? null : req.id)}
                    className={`border-b border-slate-50 cursor-pointer transition-colors ${selected === req.id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                  >
                    <td className="py-2.5 font-mono text-xs text-slate-700 font-medium">{req.id}</td>
                    <td className="py-2.5 text-xs text-slate-600">{req.material}</td>
                    <td className="py-2.5 text-xs text-slate-500 hidden sm:table-cell">{req.volume.toLocaleString('id-ID')} L</td>
                    <td className="py-2.5 text-xs text-slate-500 hidden md:table-cell">{req.destination}</td>
                    <td className="py-2.5"><StatusBadge status={req.status} /></td>
                    <td className="py-2.5 text-xs text-slate-400 hidden lg:table-cell">{req.createdAt}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-slate-400">Tidak ada data yang sesuai filter</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail panel */}
        {selectedReq && (
          <div className="card lg:col-span-2 animate-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-800">Detail Request</h3>
              <button onClick={() => setSelected(null)} className="text-xs text-slate-400 hover:text-slate-600">✕ Tutup</button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'ID Request', val: selectedReq.id },
                  { label: 'Order ID', val: selectedReq.orderId },
                  { label: 'Material', val: selectedReq.material },
                  { label: 'Volume', val: `${selectedReq.volume.toLocaleString('id-ID')} L` },
                  { label: 'Tujuan', val: selectedReq.destination },
                  { label: 'Prioritas', val: selectedReq.priority },
                  { label: 'Pemohon', val: selectedReq.requesterName },
                  { label: 'Dibuat', val: selectedReq.createdAt },
                ].map(item => (
                  <div key={item.label} className="bg-slate-50 rounded-lg p-2">
                    <p className="text-xs text-slate-400">{item.label}</p>
                    <p className="text-xs font-medium text-slate-700 mt-0.5 break-all">{item.val}</p>
                  </div>
                ))}
              </div>

              {selectedReq.note && (
                <div className="p-2.5 bg-blue-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-0.5">Catatan:</p>
                  <p className="text-xs text-blue-700">{selectedReq.note}</p>
                </div>
              )}

              {selectedReq.rejectReason && (
                <div className="p-2.5 bg-red-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-0.5">Alasan Penolakan:</p>
                  <p className="text-xs text-red-600">{selectedReq.rejectReason}</p>
                </div>
              )}

              <div>
                <p className="text-xs font-medium text-slate-600 mb-2">Timeline Proses:</p>
                <div className="space-y-2">
                  {selectedReq.timeline.map((t, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${t.status === 'done' ? 'bg-emerald-500' : t.status === 'rejected' ? 'bg-red-500' : 'bg-amber-400'}`} />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-slate-700">{t.actor}</p>
                        <p className="text-xs text-slate-500">{t.action}</p>
                        <p className="text-xs text-slate-400">{t.time}</p>
                      </div>
                    </div>
                  ))}
                  {/* Pending steps */}
                  {selectedReq.status === 'pending_warehouse' && (
                    <div className="flex items-start gap-2 opacity-50">
                      <div className="w-2 h-2 rounded-full mt-1 bg-slate-300 flex-shrink-0" />
                      <p className="text-xs text-slate-400">Menunggu verifikasi Warehouse...</p>
                    </div>
                  )}
                  {(selectedReq.status === 'pending_warehouse' || selectedReq.status === 'pending_ppc') && (
                    <div className="flex items-start gap-2 opacity-30">
                      <div className="w-2 h-2 rounded-full mt-1 bg-slate-300 flex-shrink-0" />
                      <p className="text-xs text-slate-400">Menunggu konfirmasi PPC...</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <StatusBadge status={selectedReq.status} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
