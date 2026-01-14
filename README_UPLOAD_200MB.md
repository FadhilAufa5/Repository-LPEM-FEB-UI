# 📦 Upload File 200MB - Complete Guide

## 🎯 Fitur

- ✅ Upload file hingga **200MB**
- ✅ File disimpan di **database** (bukan filesystem)
- ✅ **Tidak ada timeout** saat upload
- ✅ **Queue processing** untuk performa optimal
- ✅ Support: PDF, DOC, DOCX, ZIP, RAR
- ✅ Auto cleanup temp files

## 🚀 Quick Start (PERTAMA KALI)

### Step 1: Restart Herd (WAJIB!)
Configuration sudah diupdate, tinggal restart:

**Cara termudah:**
1. Klik icon **Laravel Herd** di taskbar
2. Klik kanan → **"Stop All Services"**
3. Tunggu 5 detik
4. Klik kanan lagi → **"Start All Services"**

### Step 2: Verify Settings
```bash
php check-upload-config.php
```

Harus muncul: `✅ ALL CHECKS PASSED!`

### Step 3: Start Queue Worker
```bash
php artisan queue:work --timeout=300
```

Atau double-click: `start-upload-system.bat`

### Step 4: Test Upload
1. Open: http://inventory-app.test/assets
2. Login
3. Click "Add Asset"
4. Upload file 200MB
5. Submit → Tunggu response (cepat!)
6. Check queue worker terminal → File sedang diproses
7. Refresh page → File sudah muncul di list

## 💡 Cara Kerja

```
┌─────────────┐
│ User Upload │
│   200MB     │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Save Temp File │ ← Response langsung ke user (cepat!)
│ storage/temp/   │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Queue Job      │
│  Dispatched     │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Queue Worker    │ ← Background processing
│ - Read file     │
│ - Encode base64 │
│ - Save to DB    │
│ - Delete temp   │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  File Saved!    │
│  in Database    │
└─────────────────┘
```

## 📁 File Structure

### Tabel Database (assets)
```sql
file_content  LONGTEXT   -- Base64 encoded file (hidden from API)
file_name     VARCHAR    -- Original filename
file_mime     VARCHAR    -- MIME type (application/pdf, etc)
file_size     BIGINT     -- File size in bytes
```

### Temp Storage (auto-cleanup)
```
storage/app/public/temp/
  ├── temp_1736789012_document.pdf  ← Deleted after processing
  └── temp_1736789123_report.zip    ← Deleted after processing
```

## 🛠️ Configuration Summary

### PHP (C:\Users\ADVAN\.config\herd\bin\php84\php.ini)
```ini
upload_max_filesize = 210M
post_max_size = 210M
max_execution_time = 300
memory_limit = 512M
```

### Nginx (C:\Users\ADVAN\.config\herd\config\nginx\herd.conf)
```nginx
client_max_body_size 210M;
```

### Laravel (app/Http/Controllers/AssetController.php)
```php
'file_laporan' => 'nullable|file|mimes:pdf,doc,docx,zip,rar|max:202400'
```

### Queue (.env)
```env
QUEUE_CONNECTION=database
```

## 📊 Monitoring

### Check Queue Status
```bash
# See all jobs in queue
php artisan queue:monitor database

# See failed jobs
php artisan queue:failed

# Retry failed job
php artisan queue:retry {job-id}

# Retry all failed jobs
php artisan queue:retry all

# Clear failed jobs
php artisan queue:flush
```

### Check Logs
```bash
# Laravel logs
tail -f storage/logs/laravel.log

# Nginx error logs
cat "C:\Users\ADVAN\.config\herd\Log\nginx-error.log"
```

### Check Database Size
```bash
php check-upload-config.php
```

## ⚠️ Important Notes

### Memory Usage
- File 100MB = ~133MB di database (karena base64 encoding)
- Monitor disk space regularly
- Database akan besar seiring banyaknya file

### Queue Worker
- **HARUS running** saat ada upload!
- Jika crash, restart: `php artisan queue:work --timeout=300`
- Jangan close terminal saat ada file sedang diupload

### Temp Files
- Auto cleanup setelah berhasil
- Jika queue crash, cleanup manual: `rm -rf storage/app/public/temp/*`

## 🔧 Troubleshooting

### 413 Request Entity Too Large
```bash
# 1. Verify settings
php check-upload-config.php

# 2. Restart Herd
# GUI: Klik kanan icon Herd → Stop/Start

# 3. Clear browser cache
# Ctrl+Shift+Del

# 4. Try incognito mode
```

### File Tidak Muncul
```bash
# 1. Check queue worker running?
# Terminal harus show: "Processing: App\Jobs\ProcessAssetFileUpload"

# 2. Check failed jobs
php artisan queue:failed

# 3. Check logs
tail -f storage/logs/laravel.log

# 4. Check temp files
ls storage/app/public/temp/
```

### Queue Worker Crash
```bash
# 1. Restart worker
php artisan queue:work --timeout=300

# 2. Retry failed jobs
php artisan queue:retry all

# 3. Check logs for errors
tail storage/logs/laravel.log
```

### Database Error: Packet Too Large
```bash
# Edit MySQL config (if using MySQL)
# C:\xampp\mysql\bin\my.ini
# Add: max_allowed_packet = 256M

# Restart MySQL
```

## 📚 Complete Documentation

| File | Description |
|------|-------------|
| `QUICK_START.md` | Quick reference untuk daily usage |
| `DATABASE_FILE_STORAGE.md` | Arsitektur & technical details |
| `FILE_UPLOAD_CONFIG.md` | Full configuration guide |
| `FIX_413_ERROR_SUMMARY.md` | Fix error 413 |
| `RESTART_HERD_INSTRUCTIONS.md` | Cara restart Herd |
| `QUEUE_WORKER_GUIDE.md` | Queue management guide |
| `check-upload-config.php` | Configuration checker script |
| `start-upload-system.bat` | Auto-start queue worker |

## 🎓 Best Practices

### Development
1. Always run queue worker: `php artisan queue:work --timeout=300`
2. Monitor logs: `tail -f storage/logs/laravel.log`
3. Use `queue:listen` if changing code frequently

### Production
1. Use Supervisor for queue worker (auto-restart)
2. Setup monitoring alerts
3. Regular database backups
4. Monitor disk space

### Testing
1. Test dengan file kecil dulu (1MB)
2. Kemudian test 50MB
3. Baru test 200MB
4. Verify download works

## ✅ Success Indicators

Upload berhasil jika:
- ✅ Form submit tanpa error
- ✅ Response cepat (<5 detik)
- ✅ Queue worker show "Processing" message
- ✅ Asset muncul di list
- ✅ Download button tersedia
- ✅ File bisa didownload dengan nama asli

## 📞 Support

Jika ada masalah:
1. Check dokumentasi di atas
2. Run: `php check-upload-config.php`
3. Check logs: `storage/logs/laravel.log`
4. Check failed jobs: `php artisan queue:failed`

---

**Version:** 1.0  
**Last Updated:** 2026-01-13  
**Status:** ✅ Production Ready (after Herd restart)
