import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const generateFlowData = () => Array.from({ length: 20 }, (_, i) => ({
  t: `${i}s`,
  flow: 145 + Math.round(Math.random() * 10)
}))

export default function MonitoringPage() {
  const { tankLevel } = useApp()
  const [flowData, setFlowData] = useState(generateFlowData())
  const [pumpOn, setPumpOn] = useState(true)
  const [lcvMode, setLcvMode] = useState('Auto')
  const [lcvOpening, setLcvOpening] = useState(68)
  const [bypassActive, setBypassActive] = useState(false)
  const [activeJalur, setActiveJalur] = useState([1])

  // Simulate live flow data
  useEffect(() => {
    if (!pumpOn) return
    const interval = setInterval(() => {
      setFlowData(prev => {
        const newPoint = { t: Date.now().toString().slice(-4), flow: 145 + Math.round(Math.random() * 10) }
        return [...prev.slice(-19), newPoint]
      })
    }, 1500)
    return () => clearInterval(interval)
  }, [pumpOn])

  const sensors = [
    { tag: 'LSHH-101', name: 'Level Switch High-High', value: 'OFF', desc: 'Alarm level sangat tinggi', status: 'ok' },
    { tag: 'LIT-101', name: 'Level Indicator Transmitter', value: `${(30000 * tankLevel / 100).toLocaleString('id-ID')} L`, desc: 'Monitoring level real-time', status: 'ok' },
    { tag: 'LSH-101', name: 'Level Switch High', value: 'OFF', desc: 'Alarm level tinggi', status: 'ok' },
    { tag: 'LSL-101', name: 'Level Switch Low', value: 'OFF', desc: 'Alarm level rendah', status: 'ok' },
    { tag: 'LSHH', name: 'Level Switch HH (Discharge)', value: 'OFF', desc: 'Alarm sangat tinggi di discharge', status: 'ok' },
    { tag: 'PVRV', name: 'Pressure Vacuum Relief Valve', value: 'Normal', desc: 'Proteksi tekanan berlebih', status: 'ok' },
  ]

  const jalurStatus = [
    { id: 1, name: 'Jalur A — Chamber 1', strainer: 'OK', checkValve: 'OK', blockValve: 'Buka' },
    { id: 2, name: 'Jalur B — Chamber 2', strainer: 'OK', checkValve: 'OK', blockValve: 'Tutup' },
    { id: 3, name: 'Jalur C — Chamber 3', strainer: 'OK', checkValve: 'OK', blockValve: 'Tutup' },
  ]

  return (
    <div className="space-y-5 animate-in max-w-5xl">
      {/* Status bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="stat-card">
          <p className="text-xs text-slate-500">Level T-101</p>
          <p className="text-xl font-semibold text-blue-600">{tankLevel}%</p>
          <p className="text-xs text-slate-400 mt-1">{(30000 * tankLevel / 100).toLocaleString('id-ID')} / 30.000 L</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-slate-500">Flow Rate</p>
          <p className={`text-xl font-semibold ${pumpOn ? 'text-emerald-600' : 'text-slate-400'}`}>{pumpOn ? '148 L/min' : '0 L/min'}</p>
          <p className="text-xs text-slate-400 mt-1">Target: 150 L/min</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-slate-500">Grounding</p>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
            <p className="text-sm font-semibold text-emerald-600">AMAN</p>
          </div>
          <p className="text-xs text-slate-400 mt-1">Terverifikasi</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-slate-500">Pompa</p>
          <div className="flex items-center gap-1.5 mt-1">
            <div className={`w-2 h-2 rounded-full ${pumpOn ? 'bg-emerald-500 pulse-dot' : 'bg-slate-300'}`} />
            <p className={`text-sm font-semibold ${pumpOn ? 'text-emerald-600' : 'text-slate-400'}`}>{pumpOn ? 'AKTIF' : 'MATI'}</p>
          </div>
          <p className="text-xs text-slate-400 mt-1">{pumpOn ? '65 Hz · Inverter' : 'Standby'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pump control */}
        <div className="card">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Kontrol Sistem</h3>
          <div className="space-y-4">
            {/* Pump */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <p className="text-xs font-semibold text-slate-700">Pompa Utama</p>
                <p className="text-xs text-slate-400 mt-0.5">Kapasitas: 150 L/min · Jarak max: 80 m</p>
              </div>
              <div className="flex items-center gap-2">
                <div className={`text-xs font-medium px-2 py-1 rounded-full ${pumpOn ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                  {pumpOn ? 'ON' : 'OFF'}
                </div>
                <button
                  onClick={() => setPumpOn(!pumpOn)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${pumpOn ? 'btn-danger' : 'btn-success'}`}
                >
                  {pumpOn ? 'Stop' : 'Start'}
                </button>
              </div>
            </div>

            {/* LCV */}
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-xs font-semibold text-slate-700">LCV — Level Control Valve</p>
                  <p className="text-xs text-slate-400">Mode: {lcvMode} · Bukaan: {lcvOpening}%</p>
                </div>
                <button
                  onClick={() => setLcvMode(m => m === 'Auto' ? 'Manual' : 'Auto')}
                  className="btn-secondary text-xs py-1"
                >
                  {lcvMode === 'Auto' ? 'Switch Manual' : 'Switch Auto'}
                </button>
              </div>
              {lcvMode === 'Manual' && (
                <div>
                  <input
                    type="range" min="0" max="100" value={lcvOpening}
                    onChange={e => setLcvOpening(Number(e.target.value))}
                    className="w-full mt-1"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-0.5">
                    <span>Tutup (0%)</span>
                    <span className="font-medium text-blue-600">{lcvOpening}%</span>
                    <span>Buka Penuh (100%)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bypass */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <p className="text-xs font-semibold text-slate-700">By Pass Area (BARA)</p>
                <p className="text-xs text-slate-400 mt-0.5">Untuk maintenance & pengalihan aliran</p>
              </div>
              <button
                onClick={() => setBypassActive(!bypassActive)}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${bypassActive ? 'bg-amber-50 text-amber-700 border-amber-200' : 'btn-secondary'}`}
              >
                {bypassActive ? '⚠️ Aktif — Matikan' : 'Aktifkan'}
              </button>
            </div>
          </div>
        </div>

        {/* Live flow chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-800">Flow Rate Live</h3>
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${pumpOn ? 'bg-emerald-500 pulse-dot' : 'bg-slate-300'}`} />
              <span className="text-xs text-slate-400">{pumpOn ? 'Live' : 'Stopped'}</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={flowData}>
              <XAxis dataKey="t" tick={false} axisLine={false} />
              <YAxis domain={[130, 165]} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip formatter={(v) => [`${v} L/min`, 'Flow Rate']} />
              <Line type="monotone" dataKey="flow" stroke={pumpOn ? '#10B981' : '#94A3B8'} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sensors */}
      <div className="card">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Status Instrumen P&ID — T-101</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sensors.map(s => (
            <div key={s.tag} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono font-semibold text-slate-700">{s.tag}</span>
                <span className={`text-xs font-medium ${s.status === 'ok' ? 'text-emerald-600' : 'text-red-500'}`}>{s.value}</span>
              </div>
              <p className="text-xs font-medium text-slate-600">{s.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3 Jalur pipa */}
      <div className="card">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Status 3 Jalur Pipa dari T-101</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {jalurStatus.map(j => {
            const isActive = activeJalur.includes(j.id)
            return (
              <div
                key={j.id}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${isActive ? 'bg-blue-50 border-blue-300' : 'bg-slate-50 border-slate-200'}`}
                onClick={() => setActiveJalur(prev => prev.includes(j.id) ? prev.filter(x => x !== j.id) : [...prev, j.id])}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className={`text-xs font-semibold ${isActive ? 'text-blue-700' : 'text-slate-600'}`}>{j.name}</p>
                  <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-blue-500 pulse-dot' : 'bg-slate-300'}`} />
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between"><span className="text-slate-400">Strainer</span><span className="text-emerald-600">{j.strainer}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Check Valve</span><span className="text-emerald-600">{j.checkValve}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Block Valve</span><span className={j.blockValve === 'Buka' ? 'text-emerald-600' : 'text-slate-400'}>{j.blockValve}</span></div>
                </div>
              </div>
            )
          })}
        </div>
        <p className="text-xs text-slate-400 mt-3">* Klik jalur untuk toggle aktif/nonaktif. Semua valve adalah manual valve (kecuali LCV).</p>
      </div>
    </div>
  )
}
