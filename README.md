# NKSI Production Management System

Prototype aplikasi manajemen produksi PT. NKSI untuk pengelolaan request material, approval workflow, dan monitoring tangki T-101.

## Fitur

- **3 Role**: Produksi, Warehouse, PPC — masing-masing dengan akses berbeda
- **Alur Approval**: Produksi → Warehouse (cek stok) → PPC (konfirmasi jadwal) → Selesai
- **Monitoring T-101**: Level sensor, instrumen P&ID, kontrol pompa & LCV
- **Manajemen Stok**: Inventaris bahan baku dengan status level
- **Jadwal Produksi**: SPD management oleh PPC
- **Riwayat**: Log semua request dengan timeline detail
- **Notifikasi**: Real-time notification antar role

## Password Demo

| Role | Password |
|------|----------|
| Produksi | `prod123` |
| Warehouse | `wh123` |
| PPC | `ppc123` |

## Deploy ke Vercel

### Cara 1 — Via Vercel CLI (Recommended)

```bash
# Install dependencies
npm install

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Cara 2 — Via GitHub + Vercel Dashboard

1. Upload folder ini ke GitHub repository baru
2. Buka [vercel.com](https://vercel.com) → New Project
3. Import repository
4. Settings:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Klik Deploy

### Cara 3 — Drag & Drop ke Vercel

1. Build dulu: `npm run build`
2. Buka [vercel.com/new](https://vercel.com/new)
3. Drag folder `dist/` ke halaman deploy

## Struktur Proyek

```
nksi-app/
├── src/
│   ├── context/
│   │   └── AppContext.jsx      # Global state & data
│   ├── components/
│   │   └── Layout.jsx          # Sidebar + topbar
│   ├── pages/
│   │   ├── LoginPage.jsx       # Halaman login + role select
│   │   ├── Dashboard.jsx       # Overview & statistik
│   │   ├── RequestPage.jsx     # Form request (Produksi)
│   │   ├── ApprovalPage.jsx    # Approval queue (WH & PPC)
│   │   ├── StockPage.jsx       # Manajemen stok (Warehouse)
│   │   ├── SchedulePage.jsx    # Jadwal produksi (PPC)
│   │   ├── MonitoringPage.jsx  # Monitoring T-101
│   │   └── HistoryPage.jsx     # Riwayat semua request
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
│   └── favicon.svg
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── vercel.json
```

## Teknologi

- **React 18** + **Vite**
- **Tailwind CSS** untuk styling
- **Recharts** untuk grafik
- **date-fns** untuk format tanggal

## Pengembangan Lanjutan

Untuk produksi nyata, tambahkan:
- Backend API (Node.js/Python)
- Database (PostgreSQL/MySQL)
- Autentikasi JWT
- Integrasi SCADA/PLC via WebSocket
- Push notification
- Export laporan PDF/Excel
