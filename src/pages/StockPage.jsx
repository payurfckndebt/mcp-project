import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function StockPage() {
  const { stock } = useApp()
  const [search, setSearch] = useState('')
  const [editId, setEditId] = useState(null)
  const [localStock, setLocalStock] = useState(stock)
  const [editVal, setEditVal] = useState('')
  const [updated, setUpdated] = useState(null)

  const filtered = localStock.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))

  const statusInfo = (s) => {
    if (s.status === 'critical') return { label: 'Kritis', cls: 'badge-rejected', bar: 'bg-red-400', pct: Math.min(100, Math.round(s.stock / s.minStock * 100)) }
    if (s.status === 'low') return { label: 'Hampir Habis', cls: 'badge-pending', bar: 'bg-amber-400', pct: Math.min(100, Math.round(s.stock / s.minStock * 100)) }
    return { label: 'Cukup', cls: 'badge-approved', bar: 'bg-emerald-400', pct: Math.min(100, Math.round(s.stock / s.minStock * 100)) }
  }

  const handleUpdate = (id) => {
    const val = Number(editVal)
    if (isNaN(val) || val < 0) return
    setLocalStock(prev => prev.map(s => {
      if (s.id !== id) return s
      const newStock = val
      const status = newStock <= 0 ? 'critical' : newStock < s.minStock ? (newStock < s.minStock * 0.5 ? 'critical' : 'low') : 'ok'
      return { ...s, stock: newStock, status }
    }))
    setUpdated(id)
    setEditId(null)
    setTimeout(() => setUpdated(null), 3000)
  }

  const totals = {
    ok: localStock.filter(s => s.status === 'ok').length,
    low: localStock.filter(s => s.status === 'low').length,
    critical: localStock.filter(s => s.status === 'critical').length,
  }

  return (
    <div className="space-y-5 animate-in max-w-4xl">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="stat-card border-emerald-200 bg-emerald-50">
          <p className="text-xs text-emerald-600">Stok Aman</p>
          <p className="text-2xl font-semibold text-emerald-700">{totals.ok}</p>
          <p className="text-xs text-emerald-500 mt-1">material</p>
        </div>
        <div className="stat-card border-amber-200 bg-amber-50">
          <p className="text-xs text-amber-600">Hampir Habis</p>
          <p className="text-2xl font-semibold text-amber-700">{totals.low}</p>
          <p className="text-xs text-amber-500 mt-1">perlu reorder</p>
        </div>
        <div className="stat-card border-red-200 bg-red-50">
          <p className="text-xs text-red-600">Kritis</p>
          <p className="text-2xl font-semibold text-red-700">{totals.critical}</p>
          <p className="text-xs text-red-500 mt-1">segera order</p>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4 gap-3">
          <h2 className="text-sm font-semibold text-slate-800">Inventaris Bahan Baku</h2>
          <input
            className="input max-w-48"
            placeholder="Cari material..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {updated && (
          <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700">
            ✓ Stok berhasil diperbarui
          </div>
        )}

        <div className="space-y-3">
          {filtered.map(item => {
            const info = statusInfo(item)
            const pct = Math.min(100, Math.round(item.stock / item.minStock * 100))
            return (
              <div key={item.id} className="border border-slate-100 rounded-xl p-4 hover:border-slate-200 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-800">{item.name}</h3>
                      <span className={`badge ${info.cls}`}>{info.label}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">📍 {item.location}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {editId === item.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          className="input w-28 text-right"
                          value={editVal}
                          onChange={e => setEditVal(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleUpdate(item.id)}
                          autoFocus
                        />
                        <span className="text-xs text-slate-400">{item.unit}</span>
                        <button onClick={() => handleUpdate(item.id)} className="btn-success py-1 px-2 text-xs">✓</button>
                        <button onClick={() => setEditId(null)} className="btn-secondary py-1 px-2 text-xs">✗</button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-lg font-semibold text-slate-800">{item.stock.toLocaleString('id-ID')} {item.unit}</p>
                        <p className="text-xs text-slate-400">Min: {item.minStock.toLocaleString('id-ID')} {item.unit}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-slate-500">Level stok</span>
                    <span className="text-xs font-medium text-slate-600">{pct}% dari minimum</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${info.bar} transition-all`} style={{ width: `${Math.min(100, pct)}%` }} />
                  </div>
                </div>

                {!editId || editId !== item.id ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setEditId(item.id); setEditVal(String(item.stock)) }}
                      className="btn-secondary text-xs py-1.5"
                    >
                      ✏️ Update Stok
                    </button>
                    {(item.status === 'critical' || item.status === 'low') && (
                      <button className="btn-primary text-xs py-1.5">
                        📋 Request PO
                      </button>
                    )}
                    {item.status === 'critical' && (
                      <span className="text-xs text-red-500 font-medium">⚠️ Stok di bawah minimum — segera reorder</span>
                    )}
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
