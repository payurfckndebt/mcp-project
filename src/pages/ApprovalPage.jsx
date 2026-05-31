import { useState } from 'react'
import { useApp } from '../context/AppContext'

const priorityBadge = (p) => {
  if (p === 'Urgent') return <span className="badge badge-urgent">⚡ Urgent</span>
  if (p === 'Kritis') return <span className="badge badge-rejected">🔴 Kritis</span>
  return <span className="badge" style={{background:'#F8FAFC',color:'#64748B',border:'1px solid #E2E8F0'}}>Normal</span>
}

export default function ApprovalPage() {
  const { currentRole, requests, approveRequest, rejectRequest, getPendingForRole } = useApp()
  const [rejectModal, setRejectModal] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [processed, setProcessed] = useState({})

  const pending = getPendingForRole()
  const roleLabel = currentRole === 'warehouse' ? 'Warehouse' : 'PPC'

  const handleApprove = (id) => {
    approveRequest(id, currentRole)
    setProcessed(p => ({ ...p, [id]: 'approved' }))
  }

  const handleReject = () => {
    if (!rejectReason.trim()) return
    rejectRequest(rejectModal, currentRole, rejectReason)
    setProcessed(p => ({ ...p, [rejectModal]: 'rejected' }))
    setRejectModal(null)
    setRejectReason('')
  }

  const getContextInfo = (req) => {
    if (currentRole === 'warehouse') {
      return {
        title: 'Yang perlu diperiksa:',
        items: [`Stok ${req.material} tersedia?`, `Volume ${req.volume.toLocaleString('id-ID')} L mencukupi?`, `Lokasi ${req.destination} siap?`]
      }
    }
    return {
      title: 'Yang perlu dikonfirmasi:',
      items: [`Jadwal produksi ${req.destination} tersedia?`, `Kapasitas mixer sesuai?`, `Formulasi ${req.orderId} sudah ada?`]
    }
  }

  return (
    <div className="space-y-5 animate-in max-w-4xl">
      {/* Header summary */}
      <div className={`card ${currentRole === 'warehouse' ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${currentRole === 'warehouse' ? 'bg-emerald-100' : 'bg-amber-100'}`}>
            {currentRole === 'warehouse' ? '📦' : '📋'}
          </div>
          <div>
            <h2 className={`text-sm font-semibold ${currentRole === 'warehouse' ? 'text-emerald-800' : 'text-amber-800'}`}>
              {roleLabel} — Antrian Approval
            </h2>
            <p className={`text-xs mt-0.5 ${currentRole === 'warehouse' ? 'text-emerald-600' : 'text-amber-600'}`}>
              {pending.length > 0 ? `${pending.length} request menunggu persetujuanmu` : 'Tidak ada request pending — semua sudah diproses ✓'}
            </p>
          </div>
        </div>
      </div>

      {/* Pending requests */}
      {pending.length === 0 && Object.keys(processed).length === 0 ? (
        <div className="card py-16 text-center">
          <div className="text-4xl mb-3">✅</div>
          <h3 className="text-sm font-semibold text-slate-700">Semua request sudah diproses</h3>
          <p className="text-xs text-slate-400 mt-1">Tidak ada request yang menunggu persetujuan kamu saat ini.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {[...pending, ...requests.filter(r => processed[r.id])].map(req => {
            const isProcessed = !!processed[req.id]
            const ctx = getContextInfo(req)
            return (
              <div key={req.id} className={`card transition-all ${isProcessed ? 'opacity-60' : ''}`}>
                {/* Request header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-slate-800">{req.id}</span>
                      {priorityBadge(req.priority)}
                      {isProcessed && (
                        <span className={`badge ${processed[req.id] === 'approved' ? 'badge-approved' : 'badge-rejected'}`}>
                          {processed[req.id] === 'approved' ? '✓ Disetujui' : '✗ Ditolak'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{req.orderId} · {req.createdAt}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-semibold text-blue-600">{req.volume.toLocaleString('id-ID')} L</p>
                    <p className="text-xs text-slate-400">{req.material}</p>
                  </div>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                  {[
                    { label: 'Material', val: req.material },
                    { label: 'Tujuan', val: req.destination },
                    { label: 'Pemohon', val: req.requesterName },
                    { label: 'Volume', val: `${req.volume.toLocaleString('id-ID')} L` },
                  ].map(item => (
                    <div key={item.label} className="bg-slate-50 rounded-lg p-2.5">
                      <p className="text-xs text-slate-400">{item.label}</p>
                      <p className="text-xs font-medium text-slate-700 mt-0.5">{item.val}</p>
                    </div>
                  ))}
                </div>

                {req.note && (
                  <div className="mb-3 p-2.5 bg-blue-50 border border-blue-100 rounded-lg">
                    <p className="text-xs text-blue-600"><span className="font-medium">Catatan pemohon:</span> {req.note}</p>
                  </div>
                )}

                {/* Checklist */}
                {!isProcessed && (
                  <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs font-medium text-slate-600 mb-2">{ctx.title}</p>
                    <div className="space-y-1">
                      {ctx.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded border border-slate-300 flex-shrink-0" />
                          <span className="text-xs text-slate-600">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timeline so far */}
                <div className="mb-4">
                  <p className="text-xs font-medium text-slate-500 mb-2">Progress:</p>
                  <div className="flex items-center gap-0">
                    {[
                      { label: 'Dibuat', done: true },
                      { label: 'Warehouse', done: req.status !== 'pending_warehouse' || processed[req.id] === 'approved' },
                      { label: 'PPC', done: req.status === 'approved' },
                      { label: 'Selesai', done: req.status === 'approved' },
                    ].map((step, i, arr) => (
                      <div key={i} className="flex items-center">
                        <div className={`flex flex-col items-center ${i > 0 ? '' : ''}`}>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium ${step.done ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                            {step.done ? '✓' : i + 1}
                          </div>
                          <span className="text-xs text-slate-400 mt-0.5 whitespace-nowrap">{step.label}</span>
                        </div>
                        {i < arr.length - 1 && (
                          <div className={`h-0.5 w-8 sm:w-12 mx-1 mb-4 ${step.done ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                {!isProcessed && (
                  <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleApprove(req.id)}
                      className="btn-success flex-1 justify-center py-2"
                    >
                      ✓ Setujui Request
                    </button>
                    <button
                      onClick={() => { setRejectModal(req.id); setRejectReason('') }}
                      className="btn-danger flex-1 justify-center py-2"
                    >
                      ✗ Tolak Request
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setRejectModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md animate-in" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-semibold text-slate-800 mb-1">Tolak Request</h3>
            <p className="text-xs text-slate-500 mb-4">Berikan alasan penolakan yang jelas agar pemohon dapat melakukan penyesuaian.</p>
            <label className="label">Alasan Penolakan *</label>
            <textarea
              className="input mb-4"
              rows={3}
              placeholder="cth. Stok tidak mencukupi, kapasitas mixer penuh, jadwal konflik..."
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              autoFocus
            />
            <div className="flex gap-3">
              <button onClick={() => setRejectModal(null)} className="btn-secondary flex-1 justify-center">Batal</button>
              <button onClick={handleReject} disabled={!rejectReason.trim()} className="btn-danger flex-1 justify-center py-2 disabled:opacity-50 disabled:cursor-not-allowed">
                Konfirmasi Tolak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
