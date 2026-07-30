# LPEM FEB UI Repository Management System

<div align="center">

![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Sistem Manajemen Repository Dokumen Penelitian**  
_Lembaga Penyelidikan Ekonomi dan Masyarakat (LPEM) FEB UI_

[📖 Dokumentasi Lengkap](DOKUMENTASI.md) · [🗄️ Database Schema](DATABASE_SCHEMA.md) · [🔄 System Flow](SYSTEM_FLOW.md)

</div>

---

## 📋 Overview

Sistem Repository LPEM FEB UI adalah aplikasi web modern untuk mengelola dan mengarsipkan dokumen penelitian, laporan, jurnal, dan publikasi lainnya dari LPEM Fakultas Ekonomi dan Bisnis Universitas Indonesia.

### ✨ Fitur Utama

- 🔐 **OTP Authentication** - Login menggunakan One-Time Password via email
- 📚 **Repository Management** - Kelola dokumen penelitian dengan metadata lengkap
- 🏢 **Client Management** - Manajemen data klien/mitra kerja
- 👥 **User & Role Management** - Sistem role-based access control (RBAC)
- 🔍 **Advanced Search** - Pencarian dokumen dengan multiple filters
- 📊 **Dashboard & Analytics** - Visualisasi statistik dan data
- 💾 **Database File Storage** - File disimpan dalam database (BLOB) hingga 200MB
- 🌐 **Public Repository** - Akses publik untuk browsing dan download dokumen,

### 🛠️ Tech Stack

**Backend:**

- Laravel 12.x
- PHP 8.2+
- SQLite Database
- Laravel Fortify (Authentication)
- Inertia.js Server Adapter

**Frontend:**

- React 19.x
- TypeScript 5.7
- Inertia.js Client
- TailwindCSS 4.0
- Radix UI Components
- Recharts (Charts)
- Sonner (Toast Notifications)

---

## 🚀 Quick Start

### Prerequisites

- PHP >= 8.2
- Node.js >= 18.x
- Composer >= 2.x
- NPM >= 9.x

### Installation

```bash
# 1. Clone repository
git clone <repository-url>
cd inventory-app

# 2. Install dependencies
composer install
npm install

# 3. Setup environment
copy .env.example .env
php artisan key:generate

# 4. Configure database & email di .env
# Edit .env file untuk email settings (SMTP)

# 5. Run migrations
php artisan migrate

# 6. (Optional) Seed sample data
php artisan db:seed

# 7. Run application
composer dev
```

### Akses Aplikasi

```
🌐 http://localhost:8000
```

**Default Admin Account** (jika ada seeder):

- Email: `admin@lpem.org`
- Gunakan OTP login

---

## 📂 Project Structure

```
inventory-app/
├── app/
│   ├── Http/Controllers/       # Business logic
│   │   ├── AssetController.php
│   │   ├── ClientController.php
│   │   ├── UserController.php
│   │   └── ...
│   └── Models/                 # Eloquent models
│       ├── User.php
│       ├── Asset.php
│       ├── Client.php
│       └── ...
├── database/
│   ├── migrations/             # Database schema
│   └── seeders/                # Sample data
├── resources/
│   └── js/
│       ├── pages/              # Inertia pages
│       └── components/         # React components
├── routes/
│   └── web.php                 # Route definitions
└── public/                     # Public assets
```

---

## 🗄️ Database Schema (Ringkas)

### Tables Utama

| Table               | Description                                      |
| ------------------- | ------------------------------------------------ |
| **users**           | Data pengguna sistem                             |
| **assets**          | Dokumen/laporan penelitian (dengan BLOB storage) |
| **clients**         | Data klien/mitra                                 |
| **wilayah**         | Data wilayah Indonesia                           |
| **roles**           | Role/peran pengguna                              |
| **permissions**     | Hak akses                                        |
| **role_user**       | Pivot table user-role (M:N)                      |
| **permission_role** | Pivot table role-permission (M:N)                |
| **login_otps**      | OTP authentication                               |

### Relationship Diagram

```
users ──┬─→ assets (1:N)
        ├─→ clients (1:N)
        └─→ roles (M:N via role_user)

clients ─→ assets (1:N)
wilayah ─→ clients (1:N)

roles ──→ permissions (M:N via permission_role)
```

📖 **Detail lengkap:** Lihat [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)

---

## 🔐 Authentication & Authorization

### OTP Login Flow

1. User memasukkan email
2. System generate & kirim OTP (6 digit) via email
3. User input OTP code
4. System verify → login success
5. Redirect ke dashboard

### Roles

- **Admin** - Full access (user management, role management, semua fitur)
- **User** - Limited access (manage own assets & clients)

### Permissions

Permissions dikelompokkan per module: `users`, `roles`, `permissions`, `assets`, `clients`

Format: `{module}.{action}` (contoh: `assets.create`, `users.delete`)

---

## 📝 Module Documentation

### 1. Assets Management

**Path:** `/assets`

**Fitur:**

- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Upload file laporan (PDF, max 200MB) → stored as BLOB
- ✅ Upload file proposal (PDF) → stored as BLOB
- ✅ Metadata: judul, abstrak, jenis laporan, grup kajian, tahun, dll
- ✅ Multi-staff assignment (JSON array)
- ✅ Client association

**Fields:**

- Kode (unique)
- Judul Laporan
- Abstrak
- Jenis Laporan (penelitian_survey, penelitian, diklat, jurnal, buku, lainnya)
- Grup Kajian (10 grup kajian LPEM)
- Kepala Proyek
- Staf (multiple)
- Tahun
- File Laporan (PDF)
- File Proposal (PDF, optional)
- Client

### 2. Clients Management

**Path:** `/clients`

**Fitur:**

- ✅ CRUD operations
- ✅ Auto-generate kode klien
- ✅ Integrasi wilayah Indonesia

**Fields:**

- Kode Klien (unique)
- Nama Klien
- Type of Client
- Alamat
- Provinsi & Kabupaten/Kota
- Kontak Person
- Telepon

### 3. Users Management (Admin Only)

**Path:** `/users`

**Fitur:**

- ✅ CRUD operations (admin only)
- ✅ Assign multiple roles
- ✅ Set status (active/inactive)

### 4. Repository (Public)

**Path:** `/repository`, `/`

**Fitur:**

- ✅ Public access (no login required)
- ✅ Search documents
- ✅ Multiple filters (jenis laporan, grup kajian, tahun, author)
- ✅ Download files
- ✅ View detailed metadata

### 5. Dashboard

**Path:** `/dashboard`

**Fitur:**

- ✅ Statistics overview
- ✅ Charts (assets by year, jenis laporan, grup kajian)
- ✅ Recent activities
- ✅ Quick actions

---

## 🔧 Configuration

### Email Configuration (untuk OTP)

Edit `.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="LPEM FEB UI"
```

### File Upload Configuration

**Max Upload Size: 200MB**

Edit `php.ini`:

```ini
upload_max_filesize = 210M
post_max_size = 210M
max_execution_time = 300
memory_limit = 512M
```

Lihat [README_UPLOAD_200MB.md](README_UPLOAD_200MB.md) untuk detail.

### Queue Worker (untuk OTP email)

OTP email dikirim via queue. Pastikan queue worker berjalan:

```bash
php artisan queue:listen --tries=1
```

Atau gunakan `composer dev` yang sudah include queue worker.

---

## 🎯 API Endpoints (Ringkas)

### Public Routes

```
GET     /                           Welcome page
GET     /repository                 List public assets
GET     /repository/{id}            Asset detail
GET     /repository/{id}/download   Download file
POST    /auth/otp/request           Request OTP
POST    /auth/otp/verify            Verify OTP
```

### Authenticated Routes

```
GET     /dashboard                  Dashboard

# Assets
GET     /assets                     List assets
POST    /assets                     Create asset
GET     /assets/{id}                Show asset
PUT     /assets/{id}                Update asset
DELETE  /assets/{id}                Delete asset
GET     /assets/{id}/download       Download laporan
GET     /assets/{id}/download-proposal  Download proposal

# Clients
GET     /clients                    List clients
POST    /clients                    Create client
PUT     /clients/{id}               Update client
DELETE  /clients/{id}               Delete client
```

### Admin Only Routes

```
# Users
GET     /users                      List users
POST    /users                      Create user
PUT     /users/{id}                 Update user
DELETE  /users/{id}                 Delete user

# Roles & Permissions
GET     /roles                      List roles
GET     /permissions                List permissions
```

📖 **Detail lengkap:** Lihat [DOKUMENTASI.md](DOKUMENTASI.md#api-endpoints)

---

## 🧪 Testing

```bash
# Run all tests
composer test

# Run specific test
php artisan test --filter=AssetTest
```

---

## 🔄 Development Workflow

### Development Mode

```bash
# Start server, queue worker, dan vite dev server
composer dev

# Atau manual (3 terminal terpisah):
php artisan serve
php artisan queue:listen
npm run dev
```

### Production Build

```bash
# Build frontend assets
npm run build

# Cache config & routes
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Code Quality

```bash
# Format code
npm run format

# Lint code
npm run lint

# Type check
npm run types
```

---

## 📊 Grup Kajian LPEM

Sistem ini mendukung 10 grup kajian LPEM FEB UI:

1. **BC-GLOVE** - Business Climate and Global Value Chain
2. **NRES** - Natural Resources and Energy Studies
3. **GEC-RG** - Green Economy and Climate Research Group
4. **DTBS** - Digital Transformation and Behavioral Studies
5. **MFPE** - Macro, Finance, and Political Economy
6. **SPL** - Social Protection and Labor
7. **SECE** - Social Engineering and Community Empowerment
8. **DEVPFIN** - Public Finance and Development Planning
9. **MPOWER** - Multidimensional Poverty and Well Being Research Group
10. **TRUST** - Transport, Real Estate, and Urban Studies

---

## 🐛 Troubleshooting

### OTP email tidak terkirim?

1. Check queue worker: `php artisan queue:listen`
2. Verify email config di `.env`
3. Check logs: `storage/logs/laravel.log`

### File upload gagal?

1. Check `php.ini`: `upload_max_filesize`, `post_max_size`
2. Restart web server
3. Check file size <= 200MB

### Permission denied?

1. Check user role di database
2. Clear cache: `php artisan cache:clear`
3. Check middleware di routes

### 404 Not Found?

```bash
php artisan route:clear
php artisan config:clear
php artisan cache:clear
```

---

## 📚 Documentation

| Document                                         | Description                                        |
| ------------------------------------------------ | -------------------------------------------------- |
| [DOKUMENTASI.md](DOKUMENTASI.md)                 | 📖 Dokumentasi lengkap sistem (bahasa Indonesia)   |
| [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)         | 🗄️ ERD, relationships, constraints, sample queries |
| [SYSTEM_FLOW.md](SYSTEM_FLOW.md)                 | 🔄 Flow diagrams untuk semua proses (Mermaid)      |
| [OTP_LOGIN_GUIDE.md](OTP_LOGIN_GUIDE.md)         | 🔐 Panduan OTP authentication                      |
| [README_UPLOAD_200MB.md](README_UPLOAD_200MB.md) | 💾 Konfigurasi file upload 200MB                   |
| [QUICK_START.md](QUICK_START.md)                 | 🚀 Quick start guide                               |

---

## 📞 Support

**LPEM FEB UI**  
Lembaga Penyelidikan Ekonomi dan Masyarakat  
Fakultas Ekonomi dan Bisnis  
Universitas Indonesia

Website: [lpem.org](https://lpem.org)  
Email: info@lpem.org

---

## 📄 License

Proprietary - © 2026 LPEM FEB UI

---

<div align="center">

**Built with ❤️ by LPEM FEB UI Development Team**

Laravel · React · TypeScript · TailwindCSS · Inertia.js

</div>
