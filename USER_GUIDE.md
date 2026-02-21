# USER GUIDE - LPEM FEB UI Repository System

Panduan penggunaan sistem untuk pengguna akhir (end users).

---

## Daftar Isi

1. [Pengguna Umum (Guest)](#pengguna-umum-guest)
2. [Login dengan OTP](#login-dengan-otp)
3. [Dashboard](#dashboard)
4. [Mengelola Assets/Dokumen](#mengelola-assetsdokumen)
5. [Mengelola Clients](#mengelola-clients)
6. [Admin: Mengelola Users](#admin-mengelola-users)
7. [Admin: Mengelola Roles & Permissions](#admin-mengelola-roles--permissions)
8. [Tips & Trik](#tips--trik)
9. [FAQ](#faq)

---

## Pengguna Umum (Guest)

Pengguna yang belum login dapat mengakses repository publik.

### 1. Mengakses Halaman Utama

1. Buka browser
2. Akses URL: `http://localhost:8000` (atau URL yang diberikan)
3. Anda akan melihat halaman welcome dengan search bar

### 2. Mencari Dokumen

**Cara 1: Search Bar Utama**

1. Ketik kata kunci di search bar (contoh: "ekonomi makro")
2. Tekan Enter atau klik icon search
3. Hasil pencarian akan muncul

**Cara 2: Browse Repository**

1. Klik menu "Repository" di navbar
2. Lihat daftar semua dokumen yang tersedia
3. Gunakan filter di sidebar:
    - **Jenis Laporan**: Penelitian, Jurnal, Buku, dll
    - **Grup Kajian**: Pilih grup kajian LPEM
    - **Tahun**: Filter berdasarkan tahun publikasi
    - **Author**: Cari berdasarkan nama kepala proyek

**Cara 3: Advanced Search**

1. Klik "Advanced Search" atau akses `/report-search`
2. Isi multiple criteria:
    - Title
    - Author
    - Abstract keywords
    - Year range
    - Client
3. Klik "Search"

### 3. Melihat Detail Dokumen

1. Klik pada card/baris dokumen dari hasil pencarian
2. Anda akan melihat:
    - ✅ Judul Laporan
    - ✅ Abstrak lengkap
    - ✅ Jenis Laporan
    - ✅ Grup Kajian
    - ✅ Kepala Proyek
    - ✅ Tim Staf
    - ✅ Tahun Publikasi
    - ✅ Client/Mitra
    - ✅ Informasi wilayah client

### 4. Download Dokumen

1. Di halaman detail dokumen, cari bagian "Files"
2. Klik tombol **"Download Laporan"** untuk download file utama
3. Jika ada proposal, klik **"Download Proposal"**
4. File akan otomatis terdownload (format PDF)

> **💡 Tip:** Pastikan browser Anda mengizinkan download dari situs ini.

---

## Login dengan OTP

Sistem menggunakan **One-Time Password (OTP)** untuk keamanan maksimal.

### Langkah-langkah Login

#### 1. Akses Halaman Login

- Klik tombol **"Login"** di navbar
- Atau akses URL: `/login`

#### 2. Masukkan Email

```
┌─────────────────────────────────┐
│  Login dengan OTP               │
├─────────────────────────────────┤
│  Email Address:                 │
│  ┌───────────────────────────┐  │
│  │ your-email@example.com    │  │
│  └───────────────────────────┘  │
│                                 │
│  [ Send OTP ]                   │
└─────────────────────────────────┘
```

1. Masukkan alamat email Anda
2. Klik tombol **"Send OTP"**
3. Tunggu pesan konfirmasi: "OTP has been sent to your email"

#### 3. Cek Email Anda

1. Buka aplikasi email (Gmail, Outlook, dll)
2. Cari email dari LPEM FEB UI (check folder Spam jika tidak ada di Inbox)
3. Email berisi kode OTP 6 digit, contoh:

```
────────────────────────────────────
LPEM FEB UI - OTP Login Code
────────────────────────────────────

Your OTP code is:

    123456

This code will expire in 10 minutes.
Please do not share this code with anyone.

────────────────────────────────────
```

#### 4. Masukkan Kode OTP

```
┌─────────────────────────────────┐
│  Verify OTP                     │
├─────────────────────────────────┤
│  Enter 6-digit OTP code:        │
│  ┌───┬───┬───┬───┬───┬───┐      │
│  │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │      │
│  └───┴───┴───┴───┴───┴───┘      │
│                                 │
│  [ Verify & Login ]             │
│  [ Resend OTP ]                 │
└─────────────────────────────────┘
```

1. Masukkan kode 6 digit
2. Klik **"Verify & Login"**
3. Jika berhasil, Anda akan diarahkan ke Dashboard

#### 5. Jika OTP Expired

- Jika kode sudah kadaluarsa (>10 menit), klik **"Resend OTP"**
- Sistem akan mengirim kode baru ke email Anda

> ⚠️ **Penting:**
>
> - OTP hanya valid selama **10 menit**
> - Jangan share kode OTP kepada siapapun
> - Jika tidak menerima email, cek folder Spam

---

## Dashboard

Setelah login, Anda akan melihat dashboard dengan informasi:

### Komponen Dashboard

#### 1. **Statistics Cards** (Kartu Statistik)

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Total Assets │  │Total Clients │  │ Total Users  │
│     245      │  │      32      │  │      18      │
└──────────────┘  └──────────────┘  └──────────────┘
```

#### 2. **Charts** (Grafik)

- **Bar Chart**: Assets per Tahun
- **Pie Chart**: Assets per Jenis Laporan
- **Pie Chart**: Assets per Grup Kajian

#### 3. **Recent Activities**

Aktivitas terbaru di sistem (create, update, delete)

#### 4. **Quick Actions**

Tombol cepat untuk:

- ➕ Add New Asset
- ➕ Add New Client
- 📊 View Reports
- ⚙️ Settings

### Navigasi Dashboard

**Sidebar Menu:**

- 🏠 Dashboard
- 📄 Assets
- 🏢 Clients
- 📊 Reports (if available)
- 👥 Users (Admin only)
- 🔐 Roles (Admin only)
- 🔑 Permissions (Admin only)
- ⚙️ Settings

---

## Mengelola Assets/Dokumen

### 1. Melihat Daftar Assets

1. Klik menu **"Assets"** di sidebar
2. Anda akan melihat tabel dengan kolom:
    - Kode
    - Judul Laporan
    - Jenis Laporan
    - Grup Kajian
    - Tahun
    - Client
    - Actions (Edit, Delete, Download)

#### Fitur Tabel:

- **Search**: Cari berdasarkan judul atau kode
- **Filter**: Filter by jenis laporan, grup kajian, tahun
- **Sort**: Klik header kolom untuk sort
- **Pagination**: Navigasi halaman (10, 25, 50, 100 items per page)

### 2. Menambah Asset Baru

#### Step-by-Step:

**1. Klik Tombol "Add New Asset"**

- Berada di kanan atas tabel

**2. Isi Form:**

```
┌─────────────────────────────────────────────┐
│  Create New Asset                        [X]│
├─────────────────────────────────────────────┤
│                                             │
│  Kode: ___________________________          │
│  (Auto-generate atau manual)               │
│                                             │
│  Judul Laporan: _____________________       │
│  (Max 500 karakter)                         │
│                                             │
│  Abstrak:                                   │
│  ┌─────────────────────────────────────┐   │
│  │                                     │   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Jenis Laporan: [Pilih ▼]                  │
│  ☐ Penelitian + Survey                      │
│  ☐ Penelitian                               │
│  ☐ Diklat                                   │
│  ☐ Jurnal                                   │
│  ☐ Buku                                     │
│  ☐ Lainnya                                  │
│                                             │
│  Grup Kajian: [Pilih ▼]                    │
│  (Pilih salah satu dari 10 grup kajian)    │
│                                             │
│  Kepala Proyek: ___________________         │
│                                             │
│  Staf:                                      │
│  ┌─────────────────────┐                   │
│  │ Nama Staf 1         │ [×]               │
│  │ Nama Staf 2         │ [×]               │
│  └─────────────────────┘                   │
│  [+ Add Staf]                               │
│                                             │
│  Tahun: [2026 ▼]                           │
│                                             │
│  Client: [Pilih Client ▼]                  │
│                                             │
│  File Laporan (PDF, max 200MB):            │
│  [Choose File] No file chosen               │
│                                             │
│  File Proposal (Optional):                  │
│  [Choose File] No file chosen               │
│                                             │
│  [ Cancel ]              [ Save Asset ]     │
└─────────────────────────────────────────────┘
```

**3. Upload File:**

- Klik "Choose File" untuk file laporan (WAJIB)
- Pilih file PDF dari komputer Anda
- File maksimal 200MB
- (Optional) Upload file proposal

**4. Klik "Save"**

- Sistem akan memvalidasi form
- Jika ada error, akan ditampilkan
- Jika berhasil, muncul notifikasi sukses

> **✅ Validasi:**
>
> - Kode: Unique, tidak boleh duplikat
> - Judul: Wajib diisi, max 500 karakter
> - Abstrak: Wajib diisi
> - Jenis Laporan: Wajib pilih salah satu
> - File Laporan: Wajib, format PDF, max 200MB

### 3. Mengedit Asset

1. Klik icon **✏️ Edit** pada baris asset
2. Dialog edit akan muncul dengan data terisi
3. Ubah data yang diperlukan
4. Untuk mengganti file:
    - Klik "Choose File" pada field yang ingin diganti
    - Pilih file baru
5. Klik **"Update"**

### 4. Menghapus Asset

1. Klik icon **🗑️ Delete** pada baris asset
2. Dialog konfirmasi muncul:

    ```
    ⚠️ Delete Asset?

    Are you sure you want to delete this asset?
    This action cannot be undone.

    [ Cancel ]  [ Delete ]
    ```

3. Klik **"Delete"** untuk konfirmasi
4. Asset akan dihapus permanen (termasuk file-nya)

### 5. Download File dari Asset

**Download Laporan:**

1. Klik icon **⬇️ Download** atau tombol "Download Laporan"
2. File PDF akan terdownload

**Download Proposal:**

1. Klik tombol "Download Proposal" (jika ada)
2. File proposal akan terdownload

---

## Mengelola Clients

### 1. Melihat Daftar Clients

1. Klik menu **"Clients"** di sidebar
2. Tabel clients akan tampil dengan kolom:
    - Kode Klien
    - Nama Klien
    - Type of Client
    - Alamat
    - Wilayah (Kab/Kota, Provinsi)
    - Kontak Person
    - Telepon
    - Actions

### 2. Menambah Client Baru

**1. Klik "Add New Client"**

**2. Isi Form:**

```
┌─────────────────────────────────────────────┐
│  Create New Client                       [X]│
├─────────────────────────────────────────────┤
│                                             │
│  Kode Klien: ______________________         │
│  (Auto-generate: CL-2026-XXX)              │
│                                             │
│  Nama Klien: _______________________        │
│  (Contoh: Kementerian Keuangan RI)         │
│                                             │
│  Type of Client: ___________________        │
│  (Contoh: Government, Private, NGO)        │
│                                             │
│  Alamat:                                    │
│  ┌─────────────────────────────────────┐   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Provinsi: [Pilih Provinsi ▼]              │
│                                             │
│  Kabupaten/Kota: [Pilih Kab/Kota ▼]        │
│  (Muncul setelah pilih provinsi)           │
│                                             │
│  Kontak Person: ___________________         │
│  (Nama PIC di klien)                        │
│                                             │
│  Telepon: ___________________               │
│  (Contoh: 021-3449230)                     │
│                                             │
│  [ Cancel ]              [ Save Client ]    │
└─────────────────────────────────────────────┘
```

**3. Klik "Save"**

> **✅ Validasi:**
>
> - Kode Klien: Unique
> - Nama Klien: Wajib diisi
> - Alamat: Wajib diisi
> - Wilayah: Wajib pilih provinsi dan kabupaten/kota
> - Kontak Person: Wajib diisi
> - Telepon: Wajib diisi

### 3. Mengedit Client

1. Klik icon **✏️ Edit**
2. Update data yang diperlukan
3. Klik **"Update"**

### 4. Menghapus Client

⚠️ **Perhatian:**

- Jika client memiliki assets terkait, akan muncul warning
- Jika client dihapus, `client_id` di assets akan menjadi NULL (assets tidak terhapus)

1. Klik icon **🗑️ Delete**
2. Konfirmasi penghapusan
3. Klik **"Delete"**

---

## Admin: Mengelola Users

> **🔒 Fitur ini hanya dapat diakses oleh Admin**

### 1. Melihat Daftar Users

1. Klik menu **"Users"** di sidebar (hanya terlihat untuk admin)
2. Tabel users tampil dengan:
    - Name
    - Email
    - Role(s)
    - Status (Active/Inactive)
    - Phone
    - Created At
    - Actions

### 2. Menambah User Baru

**1. Klik "Add New User"**

**2. Isi Form:**

```
┌─────────────────────────────────────────────┐
│  Create New User                         [X]│
├─────────────────────────────────────────────┤
│                                             │
│  Name: ___________________________          │
│                                             │
│  Email: ___________________________         │
│  (Unique, akan dipakai untuk login)        │
│                                             │
│  Password: ________________________         │
│  (Min 8 karakter)                           │
│                                             │
│  Confirm Password: _________________        │
│                                             │
│  Phone: ___________________________         │
│  (Optional)                                 │
│                                             │
│  Status: ● Active  ○ Inactive              │
│                                             │
│  Assign Roles:                              │
│  ☐ Admin                                    │
│  ☐ User                                     │
│  ☐ Editor (if exists)                       │
│                                             │
│  [ Cancel ]              [ Create User ]    │
└─────────────────────────────────────────────┘
```

**3. Klik "Create User"**

> **📝 Notes:**
>
> - User dapat memiliki multiple roles
> - Password akan di-hash secara otomatis
> - Jika status Inactive, user tidak dapat login

### 3. Mengedit User

1. Klik icon **✏️ Edit**
2. Update data (tidak perlu isi password jika tidak ingin mengubah)
3. Ubah roles jika diperlukan
4. Klik **"Update"**

### 4. Menghapus User

⚠️ **Perhatian:** Menghapus user akan:

- Menghapus user dari database
- Set `user_id` di assets/clients menjadi NULL (data tidak hilang)
- Hapus relasi di `role_user`

1. Klik icon **🗑️ Delete**
2. Konfirmasi
3. User terhapus

---

## Admin: Mengelola Roles & Permissions

> **🔒 Fitur ini hanya dapat diakses oleh Admin**

### Mengelola Roles

#### 1. Melihat Daftar Roles

- Klik menu **"Roles"**
- Lihat semua roles dengan permissions terkait

#### 2. Menambah Role Baru

```
┌─────────────────────────────────────────────┐
│  Create New Role                         [X]│
├─────────────────────────────────────────────┤
│                                             │
│  Name: ___________________________          │
│  (Contoh: Editor)                           │
│                                             │
│  Slug: ___________________________          │
│  (Contoh: editor - lowercase, no space)    │
│                                             │
│  Description:                               │
│  ┌─────────────────────────────────────┐   │
│  │ Can edit and manage content         │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Assign Permissions:                        │
│                                             │
│  Module: users                              │
│  ☐ users.view                               │
│  ☐ users.create                             │
│  ☐ users.update                             │
│  ☐ users.delete                             │
│                                             │
│  Module: assets                             │
│  ☑ assets.view                              │
│  ☑ assets.create                            │
│  ☑ assets.update                            │
│  ☐ assets.delete                            │
│                                             │
│  (... dst untuk module lainnya)             │
│                                             │
│  [ Cancel ]              [ Create Role ]    │
└─────────────────────────────────────────────┘
```

#### 3. Mengedit Role

- Update name, slug, description
- Check/uncheck permissions
- Klik "Update"

#### 4. Menghapus Role

- ⚠️ Hati-hati: akan hapus relasi di `role_user` dan `permission_role`
- Klik Delete → Konfirmasi

### Mengelola Permissions

#### 1. Melihat Daftar Permissions

- Klik menu **"Permissions"**
- Lihat permissions grouped by module

#### 2. Menambah Permission Baru

```
┌─────────────────────────────────────────────┐
│  Create New Permission                   [X]│
├─────────────────────────────────────────────┤
│                                             │
│  Name: ___________________________          │
│  (Contoh: View Reports)                     │
│                                             │
│  Slug: ___________________________          │
│  (Contoh: reports.view)                     │
│                                             │
│  Module: ___________________________        │
│  (Contoh: reports)                          │
│                                             │
│  Description:                               │
│  ┌─────────────────────────────────────┐   │
│  │ Can view all reports                │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [ Cancel ]         [ Create Permission ]   │
└─────────────────────────────────────────────┘
```

> **💡 Best Practice:**
>
> - Slug format: `{module}.{action}` (contoh: `assets.create`)
> - Module: grouping permissions (users, assets, clients, dll)
> - Name: Human-readable description

---

## Tips & Trik

### 1. Keyboard Shortcuts

| Shortcut   | Action                            |
| ---------- | --------------------------------- |
| `Ctrl + K` | Focus search bar (if implemented) |
| `Esc`      | Close dialog                      |
| `Enter`    | Submit form (when focused)        |
| `Tab`      | Navigate form fields              |

### 2. Search Tips

**Untuk hasil terbaik:**

- Gunakan kata kunci spesifik
- Gunakan filter untuk mempersempit hasil
- Search di multiple fields: title, abstract, author

**Contoh Search:**

- ❌ "ekonomi" (terlalu umum)
- ✅ "ekonomi makro indonesia 2025" (lebih spesifik)

### 3. File Upload Tips

**Persiapan File:**

1. Pastikan file dalam format **PDF**
2. Ukuran file **max 200MB**
3. Nama file sebaiknya deskriptif (contoh: `Laporan_Ekonomi_2025.pdf`)
4. Compress file jika terlalu besar

**Jika Upload Gagal:**

- Check ukuran file (max 200MB)
- Check format (harus PDF)
- Check koneksi internet
- Refresh page dan coba lagi

### 4. Best Practices

**Membuat Asset:**

- ✅ Isi semua field dengan lengkap
- ✅ Tulis abstrak yang informatif
- ✅ Pilih grup kajian yang tepat
- ✅ Upload file dengan nama yang jelas
- ✅ Double-check sebelum save

**Membuat Client:**

- ✅ Gunakan nama resmi klien
- ✅ Isi alamat lengkap
- ✅ Input nomor telepon yang valid
- ✅ Pilih wilayah yang tepat

---

## FAQ

### Pertanyaan Umum

**Q: Bagaimana cara reset password?**  
A: Sistem menggunakan OTP login, tidak ada password. Request OTP baru setiap kali login.

**Q: OTP tidak masuk ke email saya?**  
A:

1. Check folder Spam/Junk
2. Tunggu beberapa menit (mungkin delay)
3. Click "Resend OTP"
4. Hubungi admin jika masih bermasalah

**Q: Berapa lama OTP berlaku?**  
A: OTP valid selama **10 menit** setelah dikirim.

**Q: Apakah saya bisa upload file selain PDF?**  
A: Tidak, sistem hanya menerima file **PDF** untuk menjaga konsistensi.

**Q: File saya 250MB, bagaimana?**  
A: Sistem max 200MB. Anda perlu compress file terlebih dahulu menggunakan tools seperti:

- Adobe Acrobat
- SmallPDF.com
- iLovePDF.com

**Q: Apakah data yang sudah dihapus bisa dikembalikan?**  
A: Tidak, penghapusan bersifat permanen. Pastikan sebelum menghapus.

**Q: Bagaimana cara download multiple file sekaligus?**  
A: Saat ini belum ada fitur bulk download. Download satu per satu.

**Q: Saya tidak bisa akses menu Users/Roles, kenapa?**  
A: Menu tersebut hanya untuk **Admin**. Hubungi admin jika Anda memerlukan akses.

**Q: Bagaimana cara mengubah data yang sudah di-save?**  
A: Klik icon **Edit (✏️)** pada baris data, lakukan perubahan, lalu klik **Update**.

**Q: Apa yang terjadi jika saya hapus client yang memiliki assets?**  
A: Client akan terhapus, tetapi assets-nya tetap ada dengan `client_id = NULL`.

**Q: Bagaimana cara menambah staf lebih dari 1 orang?**  
A: Di form asset, klik tombol **"+ Add Staf"** untuk menambah field staf baru.

### Troubleshooting

**Problem: Page loading sangat lama**  
Solution:

- Refresh page (F5)
- Clear browser cache
- Check koneksi internet
- Hubungi admin jika persist

**Problem: Dialog tidak muncul setelah klik tombol**  
Solution:

- Check apakah ada error di browser console (F12)
- Refresh page
- Try different browser

**Problem: Form tidak bisa di-submit**  
Solution:

- Check validasi form (field yang error akan ditandai merah)
- Pastikan semua field wajib terisi
- Check file upload (format & size)

**Problem: Download file gagal**  
Solution:

- Check browser settings: allow downloads
- Disable pop-up blocker untuk site ini
- Try download dengan browser lain

---

## Kontak Support

Jika Anda mengalami masalah atau memiliki pertanyaan:

**LPEM FEB UI Support**  
📧 Email: support@lpem.org  
☎️ Telepon: (021) XXX-XXXX  
🕐 Jam Kerja: Senin-Jumat, 09:00-17:00 WIB

---

**Last Updated:** 14 Februari 2026  
**Version:** 1.0.0
