# ✅ Fix 413 Error (Request Entity Too Large) - DONE!

## Masalah
Error `413 Request Entity Too Large` terjadi karena:
1. ❌ PHP `upload_max_filesize` = 50M (terlalu kecil)
2. ❌ PHP `post_max_size` = 50M (terlalu kecil)
3. ❌ Nginx `client_max_body_size` = 50M (terlalu kecil)

## Solusi yang Sudah Diterapkan

### 1. PHP Configuration ✅
**File:** `C:\Users\ADVAN\.config\herd\bin\php84\php.ini`

Changed:
```ini
# Before
upload_max_filesize = 50M
post_max_size = 50M
max_execution_time = 30

# After
upload_max_filesize = 210M
post_max_size = 210M
max_execution_time = 300
```

### 2. Nginx Configuration ✅
**File:** `C:\Users\ADVAN\.config\herd\config\nginx\herd.conf`

Changed:
```nginx
# Before
client_max_body_size 50M;

# After
client_max_body_size 210M;
```

## ⚠️ PENTING: RESTART HERD SEKARANG!

Perubahan konfigurasi **TIDAK AKAN BERLAKU** sampai Herd di-restart!

### Cara Restart Herd:

#### ✨ Opsi 1: GUI (Recommended)
1. Klik icon **Laravel Herd** di taskbar (kanan bawah)
2. Klik kanan → **Stop All Services**
3. Tunggu 5 detik
4. Klik kanan lagi → **Start All Services**

#### 💻 Opsi 2: Command Line
```bash
herd stop
herd start
```

#### 🔄 Opsi 3: Restart Komputer
Jika masih error, restart komputer.

## Verifikasi

Setelah restart Herd, jalankan script checker:

```bash
php check-upload-config.php
```

Expected output:
```
✅ upload_max_filesize: OK (>= 210M)
✅ post_max_size: OK (>= 210M)
✅ max_execution_time: OK (>= 300 or unlimited)
✅ ALL CHECKS PASSED!
```

## Testing Upload 200MB

### Step 1: Start Queue Worker
```bash
php artisan queue:work --timeout=300
```

### Step 2: Test Upload
1. Buka: http://inventory-app.test/assets
2. Login
3. Klik "Add Asset"
4. Upload file 200MB (PDF/ZIP/RAR)
5. Fill form dan submit

### Step 3: Verify
✅ No more 413 error!
✅ Response cepat (file masuk queue)
✅ Queue worker proses file
✅ File tersimpan di database
✅ Bisa download kembali

## Troubleshooting

### Masih 413 setelah restart?

**1. Clear browser cache:**
```
Ctrl+Shift+Del → Clear cache
```

**2. Try incognito/private mode:**
Browser cache mungkin masih menyimpan error lama

**3. Verify PHP settings:**
```bash
php -i | findstr "upload_max_filesize"
php -i | findstr "post_max_size"
```

Should show: **210M**

**4. Check Nginx is running:**
Open Task Manager → Check if nginx.exe is running

**5. Restart komputer:**
Sometimes needed for all changes to take effect

### Error lain?

**Check Laravel logs:**
```bash
tail -f storage/logs/laravel.log
```

**Check Nginx logs:**
```bash
cat "C:\Users\ADVAN\.config\herd\Log\nginx-error.log"
```

**Check queue status:**
```bash
php artisan queue:failed
php artisan queue:monitor database
```

## Files Changed

1. ✅ `C:\Users\ADVAN\.config\herd\bin\php84\php.ini`
2. ✅ `C:\Users\ADVAN\.config\herd\config\nginx\herd.conf`

## Helper Scripts

- `check-upload-config.php` - Verify all settings
- `RESTART_HERD_INSTRUCTIONS.md` - Detailed restart guide

## Next Steps

1. ✅ **RESTART HERD** (most important!)
2. ✅ Run `php check-upload-config.php`
3. ✅ Start queue worker: `php artisan queue:work --timeout=300`
4. ✅ Test upload 200MB file
5. ✅ Verify file saved in database
6. ✅ Test download

---

**Status:** Ready to use after Herd restart! 🚀
