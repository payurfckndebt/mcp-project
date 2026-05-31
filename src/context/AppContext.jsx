import { createContext, useContext, useState } from 'react'
import { format } from 'date-fns'

const AppContext = createContext(null)

const today = format(new Date(), 'dd MMM yyyy')

const initialRequests = [
  {
    id: 'REQ-2024-022',
    orderId: 'TPD-2024-022',
    material: 'Mix A+B',
    volume: 300,
    destination: 'Drum Kemasan',
    priority: 'Urgent',
    requester: 'produksi',
    requesterName: 'Operator Produksi',
    status: 'pending_warehouse',
    note: 'Order customer mendesak, harap segera diproses.',
    createdAt: today + ' 10:00',
    timeline: [
      { actor: 'Produksi', action: 'Request dibuat', time: today + ' 10:00', status: 'done' },
    ]
  },
  {
    id: 'REQ-2024-021',
    orderId: 'TPD-2024-021',
    material: 'Daigiri A',
    volume: 800,
    destination: 'Mixer 2',
    priority: 'Normal',
    requester: 'produksi',
    requesterName: 'Operator Produksi',
    status: 'pending_warehouse',
    note: 'Kebutuhan batch produksi cat tembok minggu ini.',
    createdAt: today + ' 09:15',
    timeline: [
      { actor: 'Produksi', action: 'Request dibuat', time: today + ' 09:15', status: 'done' },
    ]
  },
  {
    id: 'REQ-2024-020',
    orderId: 'TPD-2024-020',
    material: 'Daigiri B',
    volume: 1200,
    destination: 'Mixer 1',
    priority: 'Normal',
    requester: 'produksi',
    requesterName: 'Operator Produksi',
    status: 'approved',
    note: '',
    createdAt: today + ' 08:00',
    timeline: [
      { actor: 'Produksi', action: 'Request dibuat', time: today + ' 08:00', status: 'done' },
      { actor: 'Warehouse', action: 'Stok diverifikasi — cukup', time: today + ' 08:20', status: 'done' },
      { actor: 'PPC', action: 'Jadwal dikonfirmasi & disetujui', time: today + ' 08:45', status: 'done' },
      { actor: 'Warehouse', action: 'Material disiapkan', time: today + ' 09:00', status: 'done' },
    ]
  },
  {
    id: 'REQ-2024-019',
    orderId: 'WH-2024-019',
    material: 'Top-up T-101',
    volume: 5000,
    destination: 'Tanki T-101',
    priority: 'Normal',
    requester: 'warehouse',
    requesterName: 'Staff Warehouse',
    status: 'pending_ppc',
    note: 'Level T-101 mendekati batas bawah, perlu top-up dari supplier.',
    createdAt: '31 Mei 2024 16:00',
    timeline: [
      { actor: 'Warehouse', action: 'Request top-up dibuat', time: '31 Mei 16:00', status: 'done' },
      { actor: 'PPC', action: 'Menunggu konfirmasi jadwal', time: '31 Mei 16:05', status: 'pending' },
    ]
  },
  {
    id: 'REQ-2024-018',
    orderId: 'TPD-2024-018',
    material: 'Daigiri A',
    volume: 600,
    destination: 'Mixer 1',
    priority: 'Normal',
    requester: 'produksi',
    requesterName: 'Operator Produksi',
    status: 'approved',
    note: '',
    createdAt: '31 Mei 2024 14:00',
    timeline: [
      { actor: 'Produksi', action: 'Request dibuat', time: '31 Mei 14:00', status: 'done' },
      { actor: 'Warehouse', action: 'Stok diverifikasi & disetujui', time: '31 Mei 14:30', status: 'done' },
    ]
  },
  {
    id: 'REQ-2024-017',
    orderId: 'TPD-2024-017',
    material: 'Solvent C',
    volume: 400,
    destination: 'Mixer 2',
    priority: 'Normal',
    requester: 'produksi',
    requesterName: 'Operator Produksi',
    status: 'rejected',
    note: '',
    rejectReason: 'Stok Solvent C tidak mencukupi. Saat ini hanya tersedia 420L, minimum operasi 1000L.',
    createdAt: '30 Mei 2024 11:00',
    timeline: [
      { actor: 'Produksi', action: 'Request dibuat', time: '30 Mei 11:00', status: 'done' },
      { actor: 'Warehouse', action: 'Ditolak — stok tidak mencukupi', time: '30 Mei 11:20', status: 'rejected' },
    ]
  },
]

const initialStock = [
  { id: 1, name: 'Daigiri A', stock: 8400, minStock: 5000, unit: 'L', location: 'Gudang A-1', status: 'ok' },
  { id: 2, name: 'Daigiri B', stock: 3200, minStock: 5000, unit: 'L', location: 'Gudang A-2', status: 'low' },
  { id: 3, name: 'Mix A+B (Premix)', stock: 1500, minStock: 1000, unit: 'L', location: 'Gudang B-1', status: 'ok' },
  { id: 4, name: 'Additive X', stock: 1100, minStock: 500, unit: 'L', location: 'Gudang B-2', status: 'ok' },
  { id: 5, name: 'Solvent C', stock: 420, minStock: 1000, unit: 'L', location: 'Gudang C-1', status: 'critical' },
  { id: 6, name: 'Pigmen Putih', stock: 2800, minStock: 1000, unit: 'kg', location: 'Gudang C-2', status: 'ok' },
]

const initialSchedule = [
  { id: 'SPD-2024-13', product: 'Cat Tembok A', volume: 2400, target: '03 Jun 2024', mixer: 'Mixer 1', status: 'on_progress', formulaId: 'F-001' },
  { id: 'SPD-2024-12', product: 'Cat Kayu B', volume: 1800, target: '05 Jun 2024', mixer: 'Mixer 2', status: 'pending', formulaId: 'F-002' },
  { id: 'SPD-2024-11', product: 'Primer Anti Karat', volume: 900, target: '07 Jun 2024', mixer: 'Mixer 1', status: 'pending', formulaId: 'F-003' },
  { id: 'SPD-2024-10', product: 'Cat Eksterior', volume: 3000, target: '01 Jun 2024', mixer: 'Mixer 1+2', status: 'done', formulaId: 'F-004' },
  { id: 'SPD-2024-09', product: 'Cat Interior', volume: 2000, target: '28 Mei 2024', mixer: 'Mixer 2', status: 'done', formulaId: 'F-001' },
]

export function AppProvider({ children }) {
  const [currentRole, setCurrentRole] = useState(null) // null = login screen
  const [requests, setRequests] = useState(initialRequests)
  const [stock] = useState(initialStock)
  const [schedule] = useState(initialSchedule)
  const [notifications, setNotifications] = useState([
    { id: 1, msg: 'REQ-2024-022 masuk — menunggu verifikasi stok', time: today + ' 10:00', read: false, role: 'warehouse' },
    { id: 2, msg: 'REQ-2024-021 masuk — menunggu verifikasi stok', time: today + ' 09:15', read: false, role: 'warehouse' },
    { id: 3, msg: 'REQ-2024-019 menunggu konfirmasi jadwal PPC', time: '31 Mei 16:05', read: false, role: 'ppc' },
    { id: 4, msg: 'REQ-2024-020 disetujui — material siap', time: today + ' 09:00', read: true, role: 'produksi' },
    { id: 5, msg: 'REQ-2024-017 ditolak — stok Solvent C kurang', time: '30 Mei 11:20', read: true, role: 'produksi' },
  ])
  const [tankLevel] = useState(71.5)

  const addRequest = (data) => {
    const newReq = {
      ...data,
      id: `REQ-2024-0${String(requests.length + 23).padStart(2, '0')}`,
      requester: currentRole,
      requesterName: currentRole === 'produksi' ? 'Operator Produksi' : currentRole === 'warehouse' ? 'Staff Warehouse' : 'Planner PPC',
      status: 'pending_warehouse',
      createdAt: format(new Date(), 'dd MMM yyyy HH:mm'),
      timeline: [
        { actor: currentRole === 'produksi' ? 'Produksi' : 'Warehouse', action: 'Request dibuat', time: format(new Date(), 'dd MMM HH:mm'), status: 'done' }
      ]
    }
    setRequests(prev => [newReq, ...prev])
    const newNotif = {
      id: Date.now(),
      msg: `${newReq.id} masuk — menunggu verifikasi stok`,
      time: format(new Date(), 'dd MMM HH:mm'),
      read: false,
      role: 'warehouse'
    }
    setNotifications(prev => [newNotif, ...prev])
    return newReq.id
  }

  const approveRequest = (id, approverRole, note = '') => {
    setRequests(prev => prev.map(r => {
      if (r.id !== id) return r
      let newStatus = r.status
      const timelineEntry = { actor: '', action: '', time: format(new Date(), 'dd MMM HH:mm'), status: 'done' }

      if (approverRole === 'warehouse' && r.status === 'pending_warehouse') {
        newStatus = 'pending_ppc'
        timelineEntry.actor = 'Warehouse'
        timelineEntry.action = 'Stok diverifikasi — cukup'
      } else if (approverRole === 'ppc' && r.status === 'pending_ppc') {
        newStatus = 'approved'
        timelineEntry.actor = 'PPC'
        timelineEntry.action = 'Jadwal dikonfirmasi & disetujui'
      }

      return { ...r, status: newStatus, timeline: [...r.timeline, timelineEntry] }
    }))

    const notifMsg = approverRole === 'warehouse'
      ? `${id} diverifikasi warehouse — menunggu PPC`
      : `${id} disetujui PPC — material siap diproses`
    const notifRole = approverRole === 'warehouse' ? 'ppc' : 'produksi'
    setNotifications(prev => [{ id: Date.now(), msg: notifMsg, time: format(new Date(), 'dd MMM HH:mm'), read: false, role: notifRole }, ...prev])
  }

  const rejectRequest = (id, approverRole, reason = '') => {
    setRequests(prev => prev.map(r => {
      if (r.id !== id) return r
      const timelineEntry = {
        actor: approverRole === 'warehouse' ? 'Warehouse' : 'PPC',
        action: `Ditolak — ${reason || 'tidak memenuhi syarat'}`,
        time: format(new Date(), 'dd MMM HH:mm'),
        status: 'rejected'
      }
      return { ...r, status: 'rejected', rejectReason: reason, timeline: [...r.timeline, timelineEntry] }
    }))
    setNotifications(prev => [{ id: Date.now(), msg: `${id} ditolak oleh ${approverRole}`, time: format(new Date(), 'dd MMM HH:mm'), read: false, role: 'produksi' }, ...prev])
  }

  const markNotifRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const getPendingForRole = () => {
    if (currentRole === 'warehouse') return requests.filter(r => r.status === 'pending_warehouse')
    if (currentRole === 'ppc') return requests.filter(r => r.status === 'pending_ppc')
    return []
  }

  const getUnreadCount = () => {
    return notifications.filter(n => !n.read && (n.role === currentRole || n.role === 'all')).length
  }

  return (
    <AppContext.Provider value={{
      currentRole, setCurrentRole,
      requests, addRequest, approveRequest, rejectRequest,
      stock, schedule,
      notifications, markNotifRead, markAllRead,
      tankLevel,
      getPendingForRole,
      getUnreadCount,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
