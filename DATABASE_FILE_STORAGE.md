# Database File Storage - 200MB Upload

## Overview

System ini menyimpan file langsung ke database sebagai base64 dalam kolom `longText`, bukan di filesystem. Proses upload menggunakan queue job untuk menghindari timeout.

## Struktur Database

### Tabel `assets` - Kolom File:
- `file_content` (longText) - Base64 encoded file content
- `file_name` (string) - Original filename
- `file_mime` (string) - MIME type (e.g., application/pdf)
- `file_size` (bigint) - File size in bytes

## Flow Upload

```
1. User Submit Form
   ↓
2. Controller menerima file (max 200MB)
   ↓
3. File disimpan temporary → storage/app/public/temp/
   ↓
4. Asset record dibuat (tanpa file content)
   ↓
5. Queue job dispatched → ProcessAssetFileUpload
   ↓
6. Response langsung ke user (cepat!)
   ↓
7. Queue worker baca file dari temp
   ↓
8. Encode file ke base64
   ↓
9. Save base64 ke database (kolom file_content)
   ↓
10. Delete temp file
    ↓
11. Log success ✓
```

## Flow Download

```
1. User klik download button
   ↓
2. Frontend panggil: GET /assets/{id}/download
   ↓
3. Controller ambil data dari database
   ↓
4. Decode base64 → binary
   ↓
5. Return response dengan proper headers:
   - Content-Type
   - Content-Disposition (attachment)
   - Content-Length
   ↓
6. Browser download file
```

## Files Changed

### 1. Migration
- `2026_01_13_150848_add_file_binary_columns_to_assets_table.php`
  - Drop kolom `file_laporan`
  - Add kolom: `file_content`, `file_name`, `file_mime`, `file_size`

### 2. Model
- `app/Models/Asset.php`
  - Update `$fillable` dengan kolom baru
  - Hide `file_content` dari JSON response (security)

### 3. Job
- `app/Jobs/ProcessAssetFileUpload.php`
  - Read file dari temp storage
  - Encode ke base64
  - Save ke database
  - Delete temp file
  - Timeout: 5 menit, retry: 3x

### 4. Service
- `app/Services/AssetService.php`
  - Store file temp saat create/update
  - Dispatch queue job dengan metadata (name, mime, size)
  - Clear old file data saat update

### 5. Controller
- `app/Http/Controllers/AssetController.php`
  - Validation max file: 202400 KB (≈200MB)
  - New method: `download()` untuk handle download

### 6. Routes
- `routes/web.php`
  - Add route: `GET /assets/{asset}/download`

### 7. Frontend
- `resources/js/pages/assets.tsx`
  - Update interface: `file_name`, `file_size`, `file_mime`
  - Update download handler: panggil `/assets/{id}/download`

## Requirements

### PHP Configuration (php.ini)
```ini
upload_max_filesize = 210M
post_max_size = 210M
max_execution_time = 300
max_input_time = 300
memory_limit = 512M
```

### MySQL Configuration (my.cnf / my.ini)
```ini
max_allowed_packet = 256M
```

### Queue Worker
```bash
# Development
php artisan queue:work --timeout=300

# Production (with supervisor)
See FILE_UPLOAD_CONFIG.md for supervisor setup
```

## Advantages vs Filesystem Storage

✅ **No file loss** - File aman dalam database, tidak hilang karena server issue
✅ **Easy backup** - Backup database = backup file
✅ **Easy migration** - Pindah server tinggal restore database
✅ **No symbolic link issues** - Tidak perlu `php artisan storage:link`
✅ **Version control friendly** - Tidak ada binary files di git

⚠️ **Considerations**
- Database size akan besar (1 file 100MB = ~133MB base64 di database)
- Perlu monitoring disk space database
- Query akan lambat jika banyak file besar (solved with `hidden = ['file_content']`)

## Testing

1. **Jalankan queue worker:**
   ```bash
   php artisan queue:work --timeout=300
   ```

2. **Upload file 200MB:**
   - Buka Asset Management
   - Klik "Add Asset"
   - Upload file besar (PDF/ZIP/RAR hingga 200MB)
   - Submit form

3. **Verifikasi:**
   ```bash
   # Cek queue job terproses
   php artisan queue:monitor database
   
   # Cek logs
   tail -f storage/logs/laravel.log
   
   # Cek database
   SELECT id, kode, file_name, file_size FROM assets WHERE file_content IS NOT NULL;
   ```

4. **Test download:**
   - Klik icon download di tabel
   - File harus terdownload dengan nama original

## Maintenance

### Clean Failed Jobs
```bash
php artisan queue:failed
php artisan queue:retry all
php artisan queue:flush
```

### Clean Temp Files (jika queue worker crash)
```bash
# Manual cleanup
rm -rf storage/app/public/temp/*
```

### Monitor Database Size
```sql
SELECT 
  table_name AS 'Table',
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'your_database_name'
  AND table_name = 'assets';
```

## Rollback (jika perlu kembali ke filesystem storage)

```bash
php artisan migrate:rollback --step=1
```

Kemudian restore code lama dari git history.
