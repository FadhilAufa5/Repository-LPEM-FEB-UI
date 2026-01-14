# Queue Worker Guide - Quick Start

## Cara Menjalankan Queue Worker

### Development (Manual):
```bash
php artisan queue:work --timeout=300
```

### Development (Auto-restart saat code berubah):
```bash
php artisan queue:listen --timeout=300
```

### Background (Windows):
```powershell
start /B php artisan queue:work --timeout=300
```

## Status Queue

### Cek Pending Jobs:
```bash
php artisan queue:monitor database
```

### Cek Failed Jobs:
```bash
php artisan queue:failed
```

### Retry Failed Jobs:
```bash
# Retry semua
php artisan queue:retry all

# Retry specific job
php artisan queue:retry {job-id}
```

### Clear Failed Jobs:
```bash
php artisan queue:flush
```

## Testing Upload

1. Pastikan queue worker berjalan
2. Upload file besar (>50MB) melalui Asset Management
3. Cek logs: `storage/logs/laravel.log`
4. Cek file tersimpan di: `storage/app/public/assets/`

## Troubleshooting

**Queue worker tidak proses job?**
- Stop worker: `Ctrl+C`
- Restart: `php artisan queue:work --timeout=300`

**Perubahan code tidak teraplikasi?**
- Gunakan `queue:listen` bukan `queue:work` saat development
- Atau restart queue worker setiap kali ada perubahan code

**File tidak muncul?**
- Cek `storage/logs/laravel.log` untuk error
- Cek tabel `failed_jobs` di database
