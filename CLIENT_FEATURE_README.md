# Fitur Client Management

## Deskripsi
Fitur ini memungkinkan pengelolaan data client dengan informasi lengkap termasuk lokasi (wilayah/kabupaten) yang diambil dari master data wilayah Indonesia.

## Struktur Database

### Tabel `wilayah`
- `id` (Primary Key)
- `kode_provinsi` (2 digit)
- `kode_kabupaten` (4 digit, unique)
- `provinsi`
- `kabupaten`
- `timestamps`

### Tabel `clients`
- `id` (Primary Key)
- `kode_klien` (unique)
- `nama_klien`
- `alamat`
- `kode_kabupaten` (Foreign Key ke tabel wilayah)
- `kontak_person`
- `telp`
- `user_id` (Foreign Key ke tabel users, nullable)
- `timestamps`

## File yang Dibuat

### Backend (Laravel)

1. **Migrations**
   - `database/migrations/2025_12_25_000001_create_wilayah_table.php`
   - `database/migrations/2025_12_25_000002_create_clients_table.php`

2. **Models**
   - `app/Models/Wilayah.php` - Model untuk master data wilayah
   - `app/Models/Client.php` - Model untuk data client

3. **Controller**
   - `app/Http/Controllers/ClientController.php` - Menangani CRUD client

4. **Seeder**
   - `database/seeders/WilayahSeeder.php` - Seed data wilayah dari CSV

5. **Routes**
   - Ditambahkan resource route untuk clients di `routes/web.php`

### Frontend (React + TypeScript)

1. **Components**
   - `resources/js/components/client-dialog.tsx` - Dialog untuk create/edit client
   - `resources/js/components/delete-client-dialog.tsx` - Dialog konfirmasi hapus client

2. **Pages**
   - `resources/js/pages/clients.tsx` - Halaman utama client management

## Fitur

### 1. Menampilkan Data Client
- Tabel dengan informasi lengkap client
- Menampilkan wilayah (kabupaten dan provinsi)
- Menampilkan user yang membuat data (untuk admin)
- Pagination

### 2. Filter & Search
- Search: kode klien, nama, alamat, kontak person, telepon, wilayah
- Filter provinsi dari dropdown

### 3. Create Client
- Form lengkap dengan validasi
- Dropdown wilayah dengan search functionality
- Auto-assign user_id dari user yang login

### 4. Edit Client
- Form pre-filled dengan data existing
- Validasi unique untuk kode_klien (kecuali untuk record yang sedang di-edit)
- Permission check: user hanya bisa edit client miliknya, admin bisa edit semua

### 5. Delete Client
- Konfirmasi dialog sebelum hapus
- Permission check: user hanya bisa hapus client miliknya, admin bisa hapus semua

## Permission & Access Control

- **Admin**: 
  - Dapat melihat semua client dari semua user
  - Dapat create, edit, delete semua client

- **User (Non-Admin)**:
  - Hanya dapat melihat client yang dibuat olehnya
  - Dapat create client baru
  - Hanya dapat edit/delete client miliknya sendiri

## Cara Install & Setup

1. **Jalankan Migration**
   ```bash
   php artisan migrate
   ```

2. **Seed Data Wilayah**
   ```bash
   php artisan db:seed --class=WilayahSeeder
   ```
   
   Data wilayah diambil dari: `database/seeders/csv/Master Wilayah.csv`
   Total: 514 wilayah (kabupaten/kota) di Indonesia

3. **Build Frontend Assets**
   ```bash
   npm run build
   ```
   atau untuk development:
   ```bash
   npm run dev
   ```

## URL Akses

- **Client Management**: `/clients` (requires authentication)

## Teknologi yang Digunakan

- **Backend**: Laravel 11, PHP 8.2+
- **Frontend**: React 18, TypeScript, Inertia.js
- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS)
- **Icons**: Lucide React

## Catatan Penting

1. Data wilayah adalah master data dan tidak dapat diubah dari fitur client
2. Relasi `kode_kabupaten` menggunakan foreign key dengan `ON DELETE RESTRICT` untuk mencegah penghapusan wilayah yang masih digunakan oleh client
3. Semua operasi client memerlukan autentikasi
4. Field `user_id` di tabel clients otomatis terisi dengan user yang sedang login saat create
5. Validasi unique untuk `kode_klien` mencegah duplikasi

## Konvensi yang Diikuti

Implementasi ini mengikuti konvensi yang sudah ada di project:
- Struktur Controller mirip dengan `AssetController`
- Struktur Component mirip dengan `asset-dialog.tsx`
- Struktur Page mirip dengan `assets.tsx`
- Menggunakan sistem role yang sudah ada (admin vs user)
- Menggunakan Inertia.js untuk routing dan form handling

## Peningkatan UX pada Dialog

### Client Dialog
- **Auto-focus** pada field pertama (Kode Klien) saat dialog dibuka
- **Searchable dropdown** untuk wilayah dengan sticky search input
- **Client-side validation** sebelum submit
- **Disabled state** pada semua input saat submitting untuk mencegah multiple submission
- **Type hint** untuk field telepon (`type="tel"`)
- **Placeholder yang informatif** untuk setiap field
- **Dialog cleanup** yang tepat saat ditutup (clear selected client dan search)
- **Better button labels**: "Simpan Client" / "Update Client" / "Menyimpan..."
- **Dialog size yang lebih lebar** (650px) untuk form yang lebih nyaman

### Delete Dialog
- **Preview data** client yang akan dihapus
- **State management** yang tepat untuk mencegah race condition
- **Loading state** pada tombol saat proses delete

### Page Improvements
- **Konsisten parameter handling** untuk filter dan pagination
- **Proper state cleanup** saat dialog ditutup
- **Icon yang sesuai** di sidebar (UserCheck)
- **Responsive design** untuk mobile dan desktop
