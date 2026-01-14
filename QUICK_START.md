# 🚀 Quick Start - Upload 200MB Files

## ⚠️ FIRST TIME SETUP (ONE TIME ONLY)

### 1. Restart Laravel Herd
**WAJIB dilakukan dulu sebelum mulai!**

Klik icon Herd di taskbar → Klik kanan → **Stop All Services** → **Start All Services**

📖 Detail: See `RESTART_HERD_INSTRUCTIONS.md`

### 2. Verify Configuration
```bash
php check-upload-config.php
```

Expected: `✅ ALL CHECKS PASSED!`

---

## 🎯 DAILY USAGE (Setiap hari kerja)

### Cara Cepat:
Double-click: `start-upload-system.bat`

### Cara Manual:

#### 1. Start Queue Worker
```bash
php artisan queue:work --timeout=300
```

Keep this terminal running! ⚠️

#### 2. Upload Files
- Open browser: http://inventory-app.test/assets
- Login
- Click "Add Asset"
- Upload file up to 200MB
- Submit

#### 3. Monitor
Watch queue worker terminal for progress:
```
[2026-01-13 15:30:45] Processing: App\Jobs\ProcessAssetFileUpload
[2026-01-13 15:31:20] Processed:  App\Jobs\ProcessAssetFileUpload
```

---

## 📋 Common Commands

### Queue Management
```bash
# Monitor queue
php artisan queue:monitor database

# Check failed jobs
php artisan queue:failed

# Retry all failed jobs
php artisan queue:retry all

# Clear failed jobs
php artisan queue:flush
```

### Clear Cache
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

---

## ❓ Troubleshooting

### Problem: 413 Error masih muncul
**Solution:**
1. Restart Herd lagi
2. Clear browser cache (Ctrl+Shift+Del)
3. Try incognito mode
4. Run: `php check-upload-config.php`

### Problem: File tidak terupload
**Solution:**
1. Check queue worker masih running?
2. Check logs: `tail -f storage/logs/laravel.log`
3. Check failed jobs: `php artisan queue:failed`

### Problem: Queue worker crash
**Solution:**
1. Restart queue worker: `php artisan queue:work --timeout=300`
2. Retry failed jobs: `php artisan queue:retry all`

### Problem: Database too large
**Solution:**
Database akan besar karena file disimpan di dalamnya.
Monitor dengan: `php check-upload-config.php`

---

## 📚 Documentation

- `DATABASE_FILE_STORAGE.md` - Penjelasan teknis lengkap
- `FILE_UPLOAD_CONFIG.md` - Konfigurasi detail
- `FIX_413_ERROR_SUMMARY.md` - Fix error 413
- `RESTART_HERD_INSTRUCTIONS.md` - Cara restart Herd

---

## ✅ Checklist Before Upload

- [ ] Herd sudah di-restart (first time only)
- [ ] Queue worker running (`php artisan queue:work --timeout=300`)
- [ ] Browser sudah login
- [ ] File size ≤ 200MB
- [ ] File type: PDF, DOC, DOCX, ZIP, RAR

Ready to upload! 🎉
