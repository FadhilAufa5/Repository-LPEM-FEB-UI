# File Upload Configuration untuk 200MB - Database Storage

## Konfigurasi PHP (php.ini)

Untuk menangani upload file hingga 200MB yang disimpan di database, pastikan setting PHP berikut:

```ini
upload_max_filesize = 210M
post_max_size = 210M
max_execution_time = 300
max_input_time = 300
memory_limit = 512M
```

### Lokasi php.ini:
- **Laravel Herd**: Biasanya di `~/.config/herd/bin/phpX.X/php.ini`
- **XAMPP**: `C:\xampp\php\php.ini`
- **WAMP**: `C:\wamp\bin\php\phpX.X\php.ini`

Setelah mengubah php.ini, restart web server atau PHP-FPM.

## Konfigurasi Web Server

### Nginx (jika menggunakan)
Tambahkan di block server atau location:

```nginx
client_max_body_size 210M;
```

### Apache (.htaccess)
File `.htaccess` sudah dibuat di folder `public/` dengan konfigurasi yang sesuai.

## Konfigurasi Database

File disimpan di database sebagai base64 dalam kolom `longText`. Pastikan MySQL memiliki konfigurasi:

```ini
max_allowed_packet = 256M
```

Edit di `/etc/mysql/my.cnf` atau `C:\xampp\mysql\bin\my.ini` (Windows).

## Konfigurasi Queue Worker

### 1. Pastikan Queue Connection di .env:
```env
QUEUE_CONNECTION=database
```

### 2. Jalankan Queue Worker:
```bash
php artisan queue:work --timeout=300
```

Atau untuk development:
```bash
php artisan queue:listen --timeout=300
```

### 3. Untuk Production (menggunakan Supervisor):

Buat file konfigurasi supervisor: `/etc/supervisor/conf.d/inventory-queue-worker.conf`

```ini
[program:inventory-queue-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /path/to/your/project/artisan queue:work database --sleep=3 --tries=3 --timeout=300
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/path/to/your/project/storage/logs/worker.log
stopwaitsecs=3600
```

Reload supervisor:
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start inventory-queue-worker:*
```

## Cara Kerja Queue Upload (Database Storage)

1. **User upload file** → File disimpan sementara di `storage/app/public/temp/`
2. **Asset record dibuat** → Data asset disimpan ke database tanpa file content
3. **Queue job dispatched** → Job `ProcessAssetFileUpload` dimasukkan ke queue
4. **Queue worker proses** → File dibaca, di-encode ke base64, disimpan ke database
5. **Temp file dihapus** → File temp otomatis terhapus setelah tersimpan
6. **Asset updated** → Kolom `file_content`, `file_name`, `file_mime`, `file_size` terisi

**Keuntungan Database Storage:**
- Tidak perlu khawatir kehilangan file di server
- Backup database = backup file
- Mudah migrasi antar server
- Tidak perlu setup symbolic link storage

## Monitoring

### Cek Queue Jobs:
```bash
# Lihat failed jobs
php artisan queue:failed

# Retry failed jobs
php artisan queue:retry all

# Flush failed jobs
php artisan queue:flush
```

### Cek Logs:
```bash
# Laravel logs
tail -f storage/logs/laravel.log

# Worker logs (jika pakai supervisor)
tail -f storage/logs/worker.log
```

## Testing

Upload file berukuran 200MB melalui form Asset Management untuk memastikan:
1. File berhasil diupload tanpa timeout
2. Asset record terbuat di database
3. Queue job terproses
4. File tersimpan di database (kolom `file_content`)
5. Bisa didownload kembali melalui endpoint `/assets/{id}/download`
6. Temp file terhapus otomatis dari `storage/app/public/temp/`

## Troubleshooting

### Error: "Maximum execution time exceeded"
- Tingkatkan `max_execution_time` di php.ini
- Pastikan queue worker berjalan dengan timeout yang cukup

### Error: "File size exceeds maximum"
- Cek `upload_max_filesize` dan `post_max_size` di php.ini
- Cek `client_max_body_size` di Nginx (jika ada)

### Queue Job Tidak Terproses
- Pastikan queue worker berjalan: `php artisan queue:work`
- Cek tabel `jobs` di database
- Cek logs: `storage/logs/laravel.log`

### File Tidak Muncul Setelah Upload
- Cek folder `storage/app/public/temp/` apakah file ada
- Cek tabel `jobs` dan `failed_jobs` di database
- Cek logs untuk error messages
- Cek kolom `file_content` di tabel `assets` apakah terisi

### Database Error: Packet too large
- Tingkatkan `max_allowed_packet` di MySQL
- Restart MySQL service
