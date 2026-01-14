# RESTART HERD - PENTING!

## Konfigurasi PHP dan Nginx sudah diupdate:

### PHP Settings (php.ini):
- ✅ `upload_max_filesize = 210M`
- ✅ `post_max_size = 210M`
- ✅ `max_execution_time = 300`

### Nginx Settings (herd.conf):
- ✅ `client_max_body_size = 210M`

## RESTART HERD SEKARANG!

### Cara Restart Herd:

#### Opsi 1: Melalui GUI (Paling Mudah)
1. Buka aplikasi **Laravel Herd** di taskbar
2. Klik kanan pada icon Herd
3. Pilih **"Stop All Services"**
4. Tunggu beberapa detik
5. Klik kanan lagi
6. Pilih **"Start All Services"**

#### Opsi 2: Melalui Command Line
```powershell
# Stop Herd
herd stop

# Start Herd
herd start
```

#### Opsi 3: Restart Komputer
Jika cara di atas tidak berhasil, restart komputer Anda.

## Verifikasi Setelah Restart

Setelah restart Herd, jalankan command ini untuk memastikan setting sudah benar:

```bash
php -i | findstr "upload_max_filesize"
# Expected output: upload_max_filesize => 210M => 210M

php -i | findstr "post_max_size"
# Expected output: post_max_size => 210M => 210M

php -i | findstr "max_execution_time"
# Expected output: max_execution_time => 300 => 300
```

## Testing Upload

1. **Jalankan Queue Worker:**
   ```bash
   php artisan queue:work --timeout=300
   ```

2. **Buka browser:**
   - Go to: http://inventory-app.test/assets
   - Login
   - Klik "Add Asset"
   - Upload file hingga 200MB
   - Submit

3. **Check hasil:**
   - Tidak ada error 413 lagi ✓
   - Asset tersimpan di database
   - File bisa didownload kembali

## Troubleshooting

### Masih Error 413?
1. Pastikan Herd sudah di-restart
2. Clear browser cache (Ctrl+Shift+Del)
3. Coba di browser lain (incognito mode)
4. Restart komputer

### Error lain?
Check logs:
```bash
# Laravel logs
tail -f storage/logs/laravel.log

# Nginx logs
cat "C:/Users/ADVAN/.config/herd/Log/nginx-error.log"
```
