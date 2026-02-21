# DOKUMENTASI SISTEM REPOSITORY LPEM FEB UI

## 📋 Daftar Isi

1. [Pendahuluan](#pendahuluan)
2. [Ringkasan Project](#ringkasan-project)
3. [Teknologi yang Digunakan](#teknologi-yang-digunakan)
4. [Arsitektur Sistem](#arsitektur-sistem)
5. [Database Schema](#database-schema)
6. [Fitur Utama](#fitur-utama)
7. [Role & Permission System](#role--permission-system)
8. [Instalasi & Setup](#instalasi--setup)
9. [Penggunaan](#penggunaan)
10. [API Endpoints](#api-endpoints)

---

## 📖 Pendahuluan

Sistem Repository LPEM FEB UI adalah aplikasi web berbasis Laravel dan React yang dirancang untuk mengelola dan mengarsipkan dokumen penelitian, laporan, jurnal, dan publikasi lainnya dari **Lembaga Penyelidikan Ekonomi dan Masyarakat (LPEM) Fakultas Ekonomi dan Bisnis Universitas Indonesia**.

### Tujuan Sistem

- **Mengelola repository dokumen** penelitian dan publikasi LPEM FEB UI
- **Menyediakan akses publik** untuk pencarian dan download dokumen
- **Mengelola data klien** yang bekerja sama dengan LPEM
- **Sistem autentikasi** dengan OTP (One-Time Password)
- **Manajemen pengguna** dengan role-based access control (RBAC)

---

## 🎯 Ringkasan Project

**Nama Project:** LPEM FEB UI Repository Management System  
**Jenis:** Web Application  
**Framework Backend:** Laravel 12.x  
**Framework Frontend:** React 19.x dengan Inertia.js  
**Database:** SQLite  
**Authentication:** Laravel Fortify dengan OTP Login  
**UI Library:** Radix UI + TailwindCSS + shadcn/ui

### Modul Utama:

1. **Public Repository** - Pencarian dan akses publik ke dokumen
2. **Asset Management** - Pengelolaan dokumen/laporan penelitian
3. **Client Management** - Manajemen data klien/mitra kerja
4. **User Management** - Pengelolaan pengguna sistem
5. **Role & Permission Management** - Kontrol akses berbasis peran
6. **Dashboard & Analytics** - Visualisasi data dan statistik

---

## 🛠️ Teknologi yang Digunakan

### Backend

| Teknologi          | Versi | Deskripsi                        |
| ------------------ | ----- | -------------------------------- |
| PHP                | ^8.2  | Server-side programming language |
| Laravel            | ^12.0 | PHP Framework                    |
| Laravel Fortify    | ^1.30 | Authentication system            |
| Inertia.js Laravel | ^2.0  | Server-side adapter              |
| SQLite             | -     | Database (embedded)              |

### Frontend

| Teknologi        | Versi    | Deskripsi              |
| ---------------- | -------- | ---------------------- |
| React            | ^19.2.0  | JavaScript library     |
| TypeScript       | ^5.7.2   | Type-safe JavaScript   |
| Inertia.js React | ^2.1.4   | Client-side adapter    |
| TailwindCSS      | ^4.0.0   | Utility-first CSS      |
| Radix UI         | Various  | Headless UI components |
| Lucide React     | ^0.475.0 | Icon library           |
| Recharts         | ^3.6.0   | Charting library       |
| Sonner           | ^2.0.7   | Toast notifications    |

### Tools & Dev Dependencies

- **Vite** - Build tool dan dev server
- **ESLint** - JavaScript linter
- **Prettier** - Code formatter
- **Concurrently** - Run multiple commands

---

## 🏗️ Arsitektur Sistem

### Architecture Pattern

Sistem ini menggunakan **MVC (Model-View-Controller)** pattern dengan **Inertia.js** sebagai penghubung antara Laravel backend dan React frontend.

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT SIDE                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              React + TypeScript (SPA)                │  │
│  │    - Pages (TSX Components)                          │  │
│  │    - Components (Reusable UI)                        │  │
│  │    - Hooks & State Management                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                            ↕                                │
│                     Inertia.js Protocol                     │
│                            ↕                                │
└─────────────────────────────────────────────────────────────┘
                             ↕
┌─────────────────────────────────────────────────────────────┐
│                        SERVER SIDE                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                Laravel Application                   │  │
│  │  ┌────────────┐  ┌─────────────┐  ┌──────────────┐  │  │
│  │  │ Routes     │→ │Controllers  │→ │ Models       │  │  │
│  │  │ (web.php)  │  │ (Business   │  │ (Eloquent    │  │  │
│  │  │            │  │  Logic)     │  │  ORM)        │  │  │
│  │  └────────────┘  └─────────────┘  └──────────────┘  │  │
│  │                                          ↕            │  │
│  │                                  ┌──────────────┐    │  │
│  │                                  │  Database    │    │  │
│  │                                  │  (SQLite)    │    │  │
│  │                                  └──────────────┘    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Folder Structure

```
inventory-app/
├── app/
│   ├── Http/
│   │   ├── Controllers/      # Business logic handlers
│   │   │   ├── AssetController.php
│   │   │   ├── ClientController.php
│   │   │   ├── UserController.php
│   │   │   ├── RoleController.php
│   │   │   └── PermissionController.php
│   │   └── Middleware/       # Request filters
│   └── Models/               # Database models (Eloquent)
│       ├── User.php
│       ├── Asset.php
│       ├── Client.php
│       ├── Role.php
│       └── Permission.php
├── database/
│   ├── migrations/           # Database schema definitions
│   └── seeders/              # Sample data generators
├── resources/
│   └── js/
│       ├── pages/            # Inertia.js pages (Routes)
│       │   ├── welcome.tsx
│       │   ├── dashboard.tsx
│       │   ├── assets.tsx
│       │   ├── clients.tsx
│       │   └── users.tsx
│       └── components/       # Reusable React components
├── routes/
│   ├── web.php              # Web routes definition
│   └── settings.php         # Settings routes
└── public/                  # Public assets
```

---

## 🗄️ Database Schema

### Entity Relationship Diagram (ERD)

```
┌─────────────────────┐
│       users         │
├─────────────────────┤
│ id (PK)             │
│ name                │
│ email (unique)      │
│ password            │
│ role                │
│ status              │
│ phone               │
│ avatar              │
│ created_at          │
│ updated_at          │
└─────────────────────┘
         │
         │ 1:N
         ├─────────────────────────┐
         │                         │
         ↓                         ↓
┌─────────────────────┐   ┌─────────────────────┐
│      assets         │   │      clients        │
├─────────────────────┤   ├─────────────────────┤
│ id (PK)             │   │ id (PK)             │
│ user_id (FK)        │   │ user_id (FK)        │
│ client_id (FK)      │   │ kode_klien (unique) │
│ kode (unique)       │   │ nama_klien          │
│ judul_laporan       │   │ type_of_client      │
│ abstrak             │   │ alamat              │
│ jenis_laporan       │   │ kode_kabupaten (FK) │
│ grup_kajian         │   │ kontak_person       │
│ kepala_proyek       │   │ telp                │
│ staf (JSON)         │   │ created_at          │
│ tahun               │   │ updated_at          │
│ file_content (BLOB) │   └─────────────────────┘
│ file_name           │            │
│ file_mime           │            │ N:1
│ file_size           │            ↓
│ proposal_content    │   ┌─────────────────────┐
│ proposal_name       │   │      wilayah        │
│ proposal_mime       │   ├─────────────────────┤
│ proposal_size       │   │ id (PK)             │
│ created_at          │   │ kode_kabupaten      │
│ updated_at          │   │ nama_provinsi       │
└─────────────────────┘   │ nama_kabupaten      │
         │                │ created_at          │
         │ N:1            │ updated_at          │
         ↓                └─────────────────────┘
┌─────────────────────┐
│      clients        │
└─────────────────────┘

         ┌─────────────────────┐
         │       users         │
         └─────────────────────┘
                  │
                  │ M:N (via role_user)
                  ↓
         ┌─────────────────────┐
         │       roles         │
         ├─────────────────────┤
         │ id (PK)             │
         │ name (unique)       │
         │ slug (unique)       │
         │ description         │
         │ created_at          │
         │ updated_at          │
         └─────────────────────┘
                  │
                  │ M:N (via permission_role)
                  ↓
         ┌─────────────────────┐
         │    permissions      │
         ├─────────────────────┤
         │ id (PK)             │
         │ name (unique)       │
         │ slug (unique)       │
         │ module              │
         │ description         │
         │ created_at          │
         │ updated_at          │
         └─────────────────────┘

         ┌─────────────────────┐
         │    login_otps       │
         ├─────────────────────┤
         │ id (PK)             │
         │ email               │
         │ otp_code            │
         │ expires_at          │
         │ verified_at         │
         │ created_at          │
         └─────────────────────┘
```

### Tabel Detail

#### 1. **users** (Pengguna Sistem)

| Column     | Type             | Description                                  |
| ---------- | ---------------- | -------------------------------------------- |
| id         | BIGINT (PK)      | Primary key                                  |
| name       | VARCHAR          | Nama lengkap pengguna                        |
| email      | VARCHAR (unique) | Email pengguna                               |
| password   | VARCHAR (hashed) | Password ter-hash                            |
| role       | VARCHAR          | Role pengguna (untuk backward compatibility) |
| status     | VARCHAR          | Status: active/inactive                      |
| phone      | VARCHAR          | Nomor telepon                                |
| avatar     | VARCHAR          | Path avatar image                            |
| created_at | TIMESTAMP        | Waktu pembuatan                              |
| updated_at | TIMESTAMP        | Waktu update terakhir                        |

#### 2. **assets** (Dokumen/Laporan Penelitian)

| Column           | Type             | Description                                                         |
| ---------------- | ---------------- | ------------------------------------------------------------------- |
| id               | BIGINT (PK)      | Primary key                                                         |
| user_id          | BIGINT (FK)      | User yang membuat                                                   |
| client_id        | BIGINT (FK)      | Klien terkait                                                       |
| kode             | VARCHAR (unique) | Kode unik asset                                                     |
| judul_laporan    | VARCHAR(500)     | Judul laporan                                                       |
| abstrak          | TEXT             | Abstrak/ringkasan                                                   |
| jenis_laporan    | ENUM             | Jenis: penelitian_survey, penelitian, diklat, jurnal, buku, lainnya |
| grup_kajian      | VARCHAR          | Grup kajian LPEM                                                    |
| kepala_proyek    | VARCHAR          | Nama kepala proyek                                                  |
| staf             | JSON             | Array nama staf                                                     |
| tahun            | INTEGER          | Tahun publikasi                                                     |
| file_content     | BLOB             | Binary file laporan                                                 |
| file_name        | VARCHAR          | Nama file                                                           |
| file_mime        | VARCHAR          | MIME type file                                                      |
| file_size        | INTEGER          | Ukuran file (bytes)                                                 |
| proposal_content | BLOB             | Binary file proposal                                                |
| proposal_name    | VARCHAR          | Nama file proposal                                                  |
| proposal_mime    | VARCHAR          | MIME type proposal                                                  |
| proposal_size    | INTEGER          | Ukuran proposal                                                     |
| created_at       | TIMESTAMP        | Waktu pembuatan                                                     |
| updated_at       | TIMESTAMP        | Waktu update                                                        |

**Grup Kajian Options:**

- BC-GLOVE: Business Climate and Global Value Chain
- NRES: Natural Resources and Energy Studies
- GEC-RG: Green Economy and Climate Research Group
- DTBS: Digital Transformation and Behavioral Studies
- MFPE: Macro, Finance, and Political Economy
- SPL: Social Protection and Labor
- SECE: Social Engineering and Community Empowerment
- DEVPFIN: Public Finance and Development Planning
- MPOWER: Multidimensional Poverty and Well Being Research Group
- TRUST: Transport, Real Estate, and Urban Studies

#### 3. **clients** (Data Klien/Mitra)

| Column         | Type             | Description        |
| -------------- | ---------------- | ------------------ |
| id             | BIGINT (PK)      | Primary key        |
| user_id        | BIGINT (FK)      | User yang membuat  |
| kode_klien     | VARCHAR (unique) | Kode unik klien    |
| nama_klien     | VARCHAR          | Nama klien         |
| type_of_client | VARCHAR          | Tipe klien         |
| alamat         | TEXT             | Alamat lengkap     |
| kode_kabupaten | VARCHAR(4) (FK)  | Kode wilayah       |
| kontak_person  | VARCHAR          | Nama kontak person |
| telp           | VARCHAR          | Nomor telepon      |
| created_at     | TIMESTAMP        | Waktu pembuatan    |
| updated_at     | TIMESTAMP        | Waktu update       |

#### 4. **wilayah** (Data Wilayah Indonesia)

| Column         | Type                | Description         |
| -------------- | ------------------- | ------------------- |
| id             | BIGINT (PK)         | Primary key         |
| kode_kabupaten | VARCHAR(4) (unique) | Kode kabupaten/kota |
| nama_provinsi  | VARCHAR             | Nama provinsi       |
| nama_kabupaten | VARCHAR             | Nama kabupaten/kota |
| created_at     | TIMESTAMP           | Waktu pembuatan     |
| updated_at     | TIMESTAMP           | Waktu update        |

#### 5. **roles** (Role/Peran)

| Column      | Type             | Description           |
| ----------- | ---------------- | --------------------- |
| id          | BIGINT (PK)      | Primary key           |
| name        | VARCHAR (unique) | Nama role             |
| slug        | VARCHAR (unique) | Slug untuk identifier |
| description | TEXT             | Deskripsi role        |
| created_at  | TIMESTAMP        | Waktu pembuatan       |
| updated_at  | TIMESTAMP        | Waktu update          |

#### 6. **permissions** (Hak Akses)

| Column      | Type             | Description     |
| ----------- | ---------------- | --------------- |
| id          | BIGINT (PK)      | Primary key     |
| name        | VARCHAR (unique) | Nama permission |
| slug        | VARCHAR (unique) | Slug identifier |
| module      | VARCHAR(50)      | Modul terkait   |
| description | TEXT             | Deskripsi       |
| created_at  | TIMESTAMP        | Waktu pembuatan |
| updated_at  | TIMESTAMP        | Waktu update    |

#### 7. **role_user** (Pivot Table)

| Column  | Type        | Description        |
| ------- | ----------- | ------------------ |
| id      | BIGINT (PK) | Primary key        |
| role_id | BIGINT (FK) | Reference ke roles |
| user_id | BIGINT (FK) | Reference ke users |

#### 8. **permission_role** (Pivot Table)

| Column        | Type        | Description              |
| ------------- | ----------- | ------------------------ |
| id            | BIGINT (PK) | Primary key              |
| permission_id | BIGINT (FK) | Reference ke permissions |
| role_id       | BIGINT (FK) | Reference ke roles       |

#### 9. **login_otps** (OTP Authentication)

| Column      | Type        | Description        |
| ----------- | ----------- | ------------------ |
| id          | BIGINT (PK) | Primary key        |
| email       | VARCHAR     | Email pengguna     |
| otp_code    | VARCHAR     | Kode OTP (6 digit) |
| expires_at  | TIMESTAMP   | Waktu kadaluarsa   |
| verified_at | TIMESTAMP   | Waktu verifikasi   |
| created_at  | TIMESTAMP   | Waktu pembuatan    |

---

## ✨ Fitur Utama

### 1. **Public Repository**

📂 Akses publik untuk browsing dan download dokumen

**Fitur:**

- ✅ Pencarian dokumen berdasarkan: judul, author, abstrak, tahun
- ✅ Filter berdasarkan jenis laporan dan grup kajian
- ✅ Preview detail dokumen
- ✅ Download file laporan dan proposal
- ✅ Responsive design untuk mobile & desktop

**Halaman Terkait:**

- `/` - Welcome page dengan search
- `/repository` - Daftar repository
- `/repository/{id}` - Detail dokumen
- `/report-search` - Pencarian advanced

### 2. **Asset Management** (CRUD Dokumen)

📄 Pengelolaan dokumen penelitian

**Fitur:**

- ✅ Create, Read, Update, Delete aset/dokumen
- ✅ Upload file laporan (PDF, max 200MB)
- ✅ Upload file proposal (PDF)
- ✅ Binary file storage (database BLOB)
- ✅ Metadata lengkap: judul, abstrak, jenis laporan, grup kajian, tahun, dll
- ✅ Multi-staff assignment (JSON array)
- ✅ Client association
- ✅ Auto-generate kode unik

**Permissions:**

- Semua authenticated users dapat CRUD assets mereka sendiri
- Admin dapat melihat dan mengelola semua assets

### 3. **Client Management** (CRUD Klien)

🏢 Pengelolaan data klien/mitra

**Fitur:**

- ✅ Create, Read, Update, Delete klien
- ✅ Auto-generate kode klien
- ✅ Integrasi dengan data wilayah Indonesia
- ✅ Tipe klien (kategori)
- ✅ Kontak person dan telepon
- ✅ Relation dengan assets

**Permissions:**

- Semua authenticated users dapat CRUD clients

### 4. **User Management** (Admin Only)

👥 Pengelolaan pengguna sistem

**Fitur:**

- ✅ Create, Read, Update, Delete users
- ✅ Assign multiple roles ke user
- ✅ Set status active/inactive
- ✅ Manage phone & avatar
- ✅ Reset password

**Permissions:**

- Hanya admin yang dapat akses modul ini

### 5. **Role & Permission Management** (Admin Only)

🔐 Kontrol akses berbasis peran

**Fitur:**

- ✅ CRUD roles
- ✅ CRUD permissions
- ✅ Assign permissions ke roles
- ✅ Module-based permissions
- ✅ Flexible permission checking

**Permissions:**

- Hanya admin yang dapat akses modul ini

### 6. **OTP Login System**

🔑 Autentikasi menggunakan One-Time Password

**Fitur:**

- ✅ Login menggunakan email + OTP (tanpa password)
- ✅ OTP dikirim via email (queue system)
- ✅ OTP valid 10 menit
- ✅ OTP 6 digit numeric
- ✅ Auto-create user jika email belum terdaftar
- ✅ Rate limiting untuk mencegah spam

**Flow:**

1. User input email
2. Backend generate OTP dan kirim ke email
3. User input OTP code
4. Backend verify OTP
5. User authenticated & redirect ke dashboard

### 7. **Dashboard & Analytics**

📊 Visualisasi data dan statistik

**Fitur:**

- ✅ Overview statistics (total assets, clients, users)
- ✅ Charts: assets by year, assets by grup kajian, assets by jenis laporan
- ✅ Recent activities
- ✅ Quick actions
- ✅ Responsive design dengan Recharts

---

## 🔐 Role & Permission System

### Default Roles

#### 1. **Admin** (Super User)

- Full access ke semua modul
- Dapat manage users, roles, permissions
- Dapat manage semua assets dan clients

#### 2. **User** (Regular User)

- Akses ke dashboard
- Dapat manage assets milik sendiri
- Dapat manage clients
- Tidak dapat akses user management

### Permission Structure

Permissions dikelompokkan berdasarkan **module**:

```typescript
Module: users - users.view - users.create - users.update - users.delete;

Module: roles - roles.view - roles.create - roles.update - roles.delete;

Module: permissions -
    permissions.view -
    permissions.create -
    permissions.update -
    permissions.delete;

Module: assets - assets.view - assets.create - assets.update - assets.delete;

Module: clients -
    clients.view -
    clients.create -
    clients.update -
    clients.delete;
```

### Checking Permissions

Di **Backend (Laravel)**:

```php
// Check if user has role
if ($user->hasRole('admin')) {
    // Do something
}

// Check if user has permission
if ($user->hasPermission('users.create')) {
    // Do something
}
```

Di **Frontend (React)**:

```typescript
// Check role
if (auth.user.role === 'admin') {
    // Show admin UI
}

// Can be extended with permission checking
```

---

## 🚀 Instalasi & Setup

### System Requirements

- PHP >= 8.2
- Node.js >= 18.x
- NPM >= 9.x
- Composer >= 2.x
- SQLite (included in PHP)

### Step-by-Step Installation

#### 1. Clone Repository

```bash
git clone <repository-url>
cd inventory-app
```

#### 2. Install Dependencies

```bash
# Install PHP dependencies
composer install

# Install JavaScript dependencies
npm install
```

#### 3. Environment Configuration

```bash
# Copy environment file
copy .env.example .env

# Generate application key
php artisan key:generate
```

#### 4. Edit `.env` File

```env
APP_NAME="LPEM FEB UI"
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
# DB_DATABASE akan otomatis ke database/database.sqlite

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="${APP_NAME}"
```

#### 5. Database Setup

```bash
# Create SQLite database
php artisan migrate

# (Optional) Seed database with sample data
php artisan db:seed
```

#### 6. Storage Link (if needed)

```bash
php artisan storage:link
```

#### 7. Build Assets

```bash
# Development
npm run dev

# Production
npm run build
```

#### 8. Run Application

```bash
# Option 1: Single command (recommended)
composer dev

# Option 2: Manual (3 separate terminals)
# Terminal 1 - Laravel server
php artisan serve

# Terminal 2 - Queue worker (untuk OTP email)
php artisan queue:listen

# Terminal 3 - Vite dev server
npm run dev
```

#### 9. Access Application

```
http://localhost:8000
```

### Quick Setup (One Command)

```bash
composer setup
```

This will run:

- `composer install`
- Copy `.env.example` to `.env`
- Generate app key
- Run migrations
- `npm install`
- `npm run build`

---

## 📱 Penggunaan

### Untuk Pengguna Umum (Guest)

#### 1. Browse Repository

1. Buka halaman utama (`/`)
2. Gunakan search bar untuk mencari dokumen
3. Filter berdasarkan jenis laporan, grup kajian, atau tahun
4. Klik dokumen untuk melihat detail
5. Download file laporan atau proposal

#### 2. Login dengan OTP

1. Klik tombol "Login" di navbar
2. Masukkan alamat email
3. Klik "Send OTP"
4. Cek email untuk mendapatkan kode OTP (6 digit)
5. Masukkan kode OTP
6. Klik "Verify & Login"
7. Akan redirect ke dashboard

### Untuk User Terautentikasi

#### 1. Manage Assets

1. Login ke sistem
2. Navigasi ke menu "Assets"
3. Klik "Add New Asset" untuk membuat dokumen baru
4. Isi form:
    - Kode (auto-generate atau manual)
    - Judul Laporan
    - Abstrak
    - Jenis Laporan
    - Grup Kajian
    - Kepala Proyek
    - Staf (bisa multiple)
    - Tahun
    - Upload File Laporan (PDF)
    - Upload File Proposal (PDF) - optional
    - Pilih Client
5. Klik "Save"
6. Asset akan tersimpan dan muncul di public repository

**Edit Asset:**

- Klik icon edit (pensil) pada baris asset
- Update data yang diperlukan
- Klik "Update"

**Delete Asset:**

- Klik icon delete (trash) pada baris asset
- Konfirmasi penghapusan

#### 2. Manage Clients

1. Navigasi ke menu "Clients"
2. Klik "Add New Client"
3. Isi form:
    - Kode Klien (auto-generate atau manual)
    - Nama Klien
    - Tipe Klien
    - Alamat
    - Pilih Provinsi & Kabupaten/Kota
    - Kontak Person
    - Telepon
4. Klik "Save"

### Untuk Admin

#### 1. Manage Users

1. Login sebagai admin
2. Navigasi ke menu "Users"
3. Klik "Add New User"
4. Isi form:
    - Name
    - Email
    - Password
    - Phone
    - Status (Active/Inactive)
    - Assign Roles (bisa multiple)
5. Klik "Save"

#### 2. Manage Roles

1. Navigasi ke menu "Roles"
2. Klik "Add New Role"
3. Isi form:
    - Name (e.g., "Editor")
    - Slug (e.g., "editor")
    - Description
    - Assign Permissions (check/uncheck)
4. Klik "Save"

#### 3. Manage Permissions

1. Navigasi ke menu "Permissions"
2. Klik "Add New Permission"
3. Isi form:
    - Name (e.g., "Create Reports")
    - Slug (e.g., "reports.create")
    - Module (e.g., "reports")
    - Description
4. Klik "Save"

---

## 🔌 API Endpoints

### Public Routes (No Auth Required)

| Method | Endpoint                    | Description            |
| ------ | --------------------------- | ---------------------- |
| GET    | `/`                         | Welcome page           |
| GET    | `/repository`               | List all public assets |
| GET    | `/repository/{id}`          | Show asset detail      |
| GET    | `/repository/{id}/download` | Download file laporan  |
| GET    | `/report-search`            | Advanced search page   |
| POST   | `/auth/otp/request`         | Request OTP code       |
| POST   | `/auth/otp/verify`          | Verify OTP code        |

### Authenticated Routes (Requires Login)

#### Dashboard

| Method | Endpoint     | Description                   |
| ------ | ------------ | ----------------------------- |
| GET    | `/dashboard` | Dashboard page with analytics |

#### Assets Management

| Method    | Endpoint                         | Description            |
| --------- | -------------------------------- | ---------------------- |
| GET       | `/assets`                        | List all assets        |
| POST      | `/assets`                        | Create new asset       |
| GET       | `/assets/{id}`                   | Show asset detail      |
| PUT/PATCH | `/assets/{id}`                   | Update asset           |
| DELETE    | `/assets/{id}`                   | Delete asset           |
| GET       | `/assets/{id}/download`          | Download file laporan  |
| GET       | `/assets/{id}/download-proposal` | Download file proposal |

#### Clients Management

| Method    | Endpoint        | Description        |
| --------- | --------------- | ------------------ |
| GET       | `/clients`      | List all clients   |
| POST      | `/clients`      | Create new client  |
| GET       | `/clients/{id}` | Show client detail |
| PUT/PATCH | `/clients/{id}` | Update client      |
| DELETE    | `/clients/{id}` | Delete client      |

### Admin Only Routes (Requires Admin Role)

#### Users Management

| Method    | Endpoint      | Description      |
| --------- | ------------- | ---------------- |
| GET       | `/users`      | List all users   |
| POST      | `/users`      | Create new user  |
| GET       | `/users/{id}` | Show user detail |
| PUT/PATCH | `/users/{id}` | Update user      |
| DELETE    | `/users/{id}` | Delete user      |

#### Roles Management

| Method    | Endpoint      | Description      |
| --------- | ------------- | ---------------- |
| GET       | `/roles`      | List all roles   |
| POST      | `/roles`      | Create new role  |
| GET       | `/roles/{id}` | Show role detail |
| PUT/PATCH | `/roles/{id}` | Update role      |
| DELETE    | `/roles/{id}` | Delete role      |

#### Permissions Management

| Method    | Endpoint            | Description            |
| --------- | ------------------- | ---------------------- |
| GET       | `/permissions`      | List all permissions   |
| POST      | `/permissions`      | Create new permission  |
| GET       | `/permissions/{id}` | Show permission detail |
| PUT/PATCH | `/permissions/{id}` | Update permission      |
| DELETE    | `/permissions/{id}` | Delete permission      |

### Request & Response Format

Karena menggunakan **Inertia.js**, semua request dan response mengikuti protokol Inertia:

**Request Headers:**

```
X-Inertia: true
X-Inertia-Version: <asset-version>
```

**Response Format (JSON):**

```json
{
  "component": "PageComponentName",
  "props": {
    "auth": {...},
    "data": {...},
    "errors": {...},
    "flash": {...}
  },
  "url": "/current-url",
  "version": "<asset-version>"
}
```

**Success Response Example (Asset Create):**

```json
{
  "component": "assets",
  "props": {
    "auth": { "user": {...} },
    "assets": [...],
    "flash": {
      "success": "Asset created successfully"
    }
  }
}
```

**Error Response Example:**

```json
{
    "component": "assets",
    "props": {
        "errors": {
            "judul_laporan": ["The judul laporan field is required."]
        }
    }
}
```

---

## 📊 Flow Diagram

### Authentication Flow (OTP Login)

```
┌─────────┐
│  User   │
└────┬────┘
     │
     │ 1. Navigate to /login
     ↓
┌─────────────────┐
│  Login Page     │
│  (Enter Email)  │
└────┬────────────┘
     │
     │ 2. POST /auth/otp/request
     ↓
┌──────────────────┐
│  OtpController   │
│  - Validate email│
│  - Generate OTP  │
│  - Store to DB   │
│  - Queue email   │
└────┬─────────────┘
     │
     │ 3. Dispatch email job
     ↓
┌──────────────────┐
│  Queue Worker    │
│  - Send email    │
│  - OTP code      │
└────┬─────────────┘
     │
     │ 4. Email delivered
     ↓
┌─────────────────┐
│  User's Email   │
│  OTP: 123456    │
└────┬────────────┘
     │
     │ 5. User enters OTP
     ↓
┌─────────────────┐
│  Verify OTP     │
│  (Enter Code)   │
└────┬────────────┘
     │
     │ 6. POST /auth/otp/verify
     ↓
┌──────────────────┐
│  OtpController   │
│  - Verify code   │
│  - Check expiry  │
│  - Authenticate  │
└────┬─────────────┘
     │
     │ 7. Login success
     ↓
┌──────────────────┐
│   Dashboard      │
└──────────────────┘
```

### Asset Creation Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │
     │ 1. Navigate to /assets
     ↓
┌─────────────────┐
│  Assets Page    │
│  - List assets  │
└────┬────────────┘
     │
     │ 2. Click "Add New"
     ↓
┌─────────────────┐
│  Create Dialog  │
│  - Fill form    │
│  - Upload files │
└────┬────────────┘
     │
     │ 3. POST /assets
     ↓
┌──────────────────────┐
│  AssetController     │
│  - Validate data     │
│  - Process files     │
│  - Store to BLOB     │
│  - Save metadata     │
└────┬─────────────────┘
     │
     │ 4. Asset created
     ↓
┌──────────────────────┐
│  Database            │
│  - assets table      │
│  - file_content BLOB │
└────┬─────────────────┘
     │
     │ 5. Redirect with success
     ↓
┌──────────────────────┐
│  Assets Page         │
│  - Show new asset    │
│  - Toast notification│
└──────────────────────┘
```

### Repository Search Flow

```
┌─────────┐
│  Guest  │
└────┬────┘
     │
     │ 1. Navigate to /repository
     ↓
┌─────────────────────┐
│  Repository Page    │
│  - Search input     │
│  - Filters          │
└────┬────────────────┘
     │
     │ 2. Enter search query
     │    & apply filters
     ↓
┌────────────────────────┐
│  RepositoryController  │
│  - Parse query         │
│  - Build SQL query     │
│  - Apply filters       │
└────┬───────────────────┘
     │
     │ 3. Execute query
     ↓
┌─────────────────────┐
│  Database           │
│  - Search assets    │
│  - JOIN clients     │
└────┬────────────────┘
     │
     │ 4. Return results
     ↓
┌─────────────────────┐
│  Repository Page    │
│  - Display results  │
│  - Pagination       │
└────┬────────────────┘
     │
     │ 5. Click asset
     ↓
┌─────────────────────┐
│  Asset Detail Page  │
│  - Full metadata    │
│  - Download buttons │
└─────────────────────┘
```

### Role & Permission Check Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │
     │ 1. Request protected route
     ↓
┌──────────────────┐
│  Middleware      │
│  - auth          │
└────┬─────────────┘
     │
     │ 2. Check authenticated
     ↓
┌──────────────────┐
│  RoleMiddleware  │
│  - Check role    │
└────┬─────────────┘
     │
     │ 3. Query user roles
     ↓
┌──────────────────────┐
│  Database            │
│  - users             │
│  - role_user         │
│  - roles             │
│  - permission_role   │
│  - permissions       │
└────┬─────────────────┘
     │
     │ 4. Has required role?
     ├─── YES ───┐
     │           ↓
     │      ┌─────────────┐
     │      │  Controller │
     │      └─────────────┘
     │
     └─── NO ────┐
                 ↓
            ┌──────────┐
            │  403     │
            │ Forbidden│
            └──────────┘
```

---

## 📝 Notes & Tips

### File Upload Configuration

Sistem ini menyimpan file dalam **database BLOB** (binary), bukan di filesystem. Konfigurasi:

- Max file size: **200MB**
- Supported format: **PDF**
- Storage: **SQLite BLOB column**

File upload configuration tercantum di:

- `php.ini` - `upload_max_filesize`, `post_max_size`
- `config/filesystems.php`

Lihat file `README_UPLOAD_200MB.md` untuk detail lengkap.

### Queue Worker

Untuk mengirim email OTP, pastikan queue worker berjalan:

```bash
php artisan queue:listen --tries=1
```

Atau gunakan:

```bash
composer dev
```

### Development vs Production

**Development:**

```bash
composer dev  # Run server, queue, and vite simultaneously
```

**Production:**

```bash
npm run build              # Build assets
php artisan config:cache   # Cache config
php artisan route:cache    # Cache routes
php artisan view:cache     # Cache views
```

### Database Backup

Karena menggunakan SQLite, backup sangat mudah:

```bash
# Backup
copy database\database.sqlite database\backup\database_backup_2026-02-14.sqlite

# Restore
copy database\backup\database_backup_2026-02-14.sqlite database\database.sqlite
```

### Testing

```bash
# Run all tests
composer test

# Run specific test
php artisan test --filter=AssetTest
```

---

## 🔧 Troubleshooting

### Problem: OTP email tidak terkirim

**Solution:**

1. Pastikan queue worker berjalan
2. Check konfigurasi email di `.env`
3. Check log: `storage/logs/laravel.log`

### Problem: File upload gagal (413 Request Entity Too Large)

**Solution:**

1. Check `php.ini`:
    - `upload_max_filesize = 210M`
    - `post_max_size = 210M`
2. Restart web server
3. Check web server config (Nginx/Apache)

### Problem: Permission denied

**Solution:**

1. Check user role di database
2. Check role_user pivot table
3. Check permission_role pivot table
4. Clear cache: `php artisan cache:clear`

### Problem: 404 Not Found setelah build

**Solution:**

```bash
php artisan route:clear
php artisan config:clear
php artisan cache:clear
```

---

## 📞 Contact & Support

Untuk pertanyaan atau dukungan terkait sistem ini, hubungi:

**LPEM FEB UI**  
Lembaga Penyelidikan Ekonomi dan Masyarakat  
Fakultas Ekonomi dan Bisnis  
Universitas Indonesia

Website: [lpem.org](https://lpem.org)  
Email: info@lpem.org

---

## 📄 License

This project is proprietary software owned by LPEM FEB UI.

---

**Last Updated:** 14 Februari 2026  
**Version:** 1.0.0  
**Author:** Development Team LPEM FEB UI
