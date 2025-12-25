# Dashboard Features

## Overview
Dashboard halaman yang menampilkan statistik dan visualisasi data repository secara comprehensive dan indah.

## Features Implemented

### 1. **Statistics Cards**
Empat kartu statistik dengan gradient background dan icon:
- **Total Repositories**: Total semua repository yang terdaftar
- **This Year**: Jumlah repository tahun ini dengan persentase pertumbuhan
- **Unique Authors**: Jumlah author/peneliti unik
- **Last Year**: Total repository tahun lalu

### 2. **Charts & Visualizations**

#### Line Chart - Repositories by Year
- Menampilkan trend repository dalam 5 tahun terakhir
- Menggunakan line chart dengan smooth transition
- Warna: Yellow gradient (sesuai brand)

#### Pie Chart - Repositories by Type
- Menampilkan distribusi repository berdasarkan jenis (Penelitian, Survey, Diklat, Jurnal, Buku, dll)
- Pie chart dengan label persentase
- Multi-color gradient

#### Bar Chart - Top 5 Research Groups
- Menampilkan 5 grup kajian/research group teratas
- Bar chart dengan rounded corners
- Menampilkan nama grup dengan label yang diperpendek untuk readability

### 3. **Recent Repositories**
- List 5 repository terbaru
- Clickable cards dengan hover effect
- Menampilkan: Title, Author, Year, dan Type
- Link langsung ke detail repository

## Tech Stack
- **Frontend**: React + TypeScript
- **Charts**: Recharts library
- **Styling**: Tailwind CSS with custom gradients
- **Backend**: Laravel with Inertia.js
- **Database**: MySQL (menggunakan model Asset)

## File Structure
```
app/Http/Controllers/DashboardController.php  - Backend controller untuk statistik
resources/js/pages/dashboard.tsx              - Dashboard UI component
routes/web.php                                - Route definition
```

## API Endpoints
- `GET /dashboard` - Menampilkan dashboard dengan statistik lengkap

## Data Flow
1. DashboardController mengambil data dari model Asset
2. Data diolah menjadi statistik dan format chart
3. Data dikirim ke frontend via Inertia.js
4. React component merender charts menggunakan Recharts
5. User dapat mengklik recent repositories untuk melihat detail

## Styling Features
- Responsive design (mobile, tablet, desktop)
- Dark mode support
- Smooth hover transitions
- Gradient backgrounds untuk visual appeal
- Consistent color scheme (yellow as primary)

## Future Enhancements (Optional)
- Filter by date range
- Export chart as image
- Download statistics as PDF
- Real-time updates
- More detailed analytics
