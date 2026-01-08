# OTP Email Login System

## Overview
Sistem login menggunakan OTP (One-Time Password) email yang aman dan mudah digunakan. User dapat memilih antara login menggunakan OTP atau password tradisional.

**IMPORTANT**: Hanya user yang sudah terdaftar oleh admin yang dapat menggunakan OTP login. Tidak ada self-registration. Lihat [OTP_ACCESS_CONTROL.md](./OTP_ACCESS_CONTROL.md) untuk detail lengkap tentang access control.

## Features
- ✅ Login dengan OTP 6 digit via email
- ✅ Login tradisional dengan password (tetap tersedia)
- ✅ Toggle antara OTP dan Password login
- ✅ Rate limiting untuk keamanan
- ✅ OTP expires dalam 10 menit
- ✅ Email template yang profesional
- ✅ Validasi email sebelum mengirim OTP
- ✅ **Admin-controlled access** - Only registered users can login
- ✅ **Status-based access** - Inactive users cannot login
- ✅ Immediate access revocation capability

## Backend Components

### 1. Database Migration
**File:** `database/migrations/2025_12_25_000001_create_login_otps_table.php`

Membuat table `login_otps` dengan struktur:
- `id` - Primary key
- `email` - Email user
- `otp` - 6 digit OTP code
- `expires_at` - Waktu kadaluarsa OTP
- `verified` - Status verifikasi
- `timestamps` - Created at & updated at

### 2. Model
**File:** `app/Models/LoginOtp.php`

Features:
- `generate($email)` - Generate dan kirim OTP ke email
- `verify($email, $otp)` - Verifikasi OTP code
- `isExpired()` - Cek apakah OTP sudah expired

### 3. Mailable
**File:** `app/Mail/LoginOtpMail.php`
**Template:** `resources/views/emails/login-otp.blade.php`

Email template profesional dengan:
- OTP code besar dan jelas
- Warning security notice
- Informasi expiry time
- Responsive design

### 4. Controller
**File:** `app/Http/Controllers/Auth/OtpLoginController.php`

Endpoints:
- `POST /auth/otp/request` - Request OTP code
- `POST /auth/otp/verify` - Verify OTP dan login

Features:
- Rate limiting (3 request/menit, 5 verify/menit)
- Validasi user exists dan active
- Auto login setelah verifikasi sukses

### 5. Routes
**File:** `routes/web.php`

```php
Route::middleware('guest')->group(function () {
    Route::post('/auth/otp/request', [OtpLoginController::class, 'requestOtp'])->name('otp.request');
    Route::post('/auth/otp/verify', [OtpLoginController::class, 'verifyOtp'])->name('otp.verify');
});
```

## Frontend Components

### 1. Login Page
**File:** `resources/js/pages/auth/login.tsx`

Features:
- Toggle antara OTP dan Password login
- Step-by-step OTP flow:
  1. Input email → Send OTP
  2. Input OTP code → Verify & Login
- Back button untuk kembali ke input email
- Large OTP input field dengan tracking-widest
- Remember me checkbox
- Error handling yang baik

### 2. Route Definitions
**File:** `resources/js/routes/otp/index.ts`

TypeScript route definitions untuk:
- `otp.request.form()` - Form untuk request OTP
- `otp.verify.form()` - Form untuk verify OTP

## Configuration

### Email Setup
Update `.env` untuk konfigurasi email:

```env
# Untuk development - log email ke file
MAIL_MAILER=log

# Untuk production - gunakan SMTP
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your-username
MAIL_PASSWORD=your-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourapp.com
MAIL_FROM_NAME="${APP_NAME}"
```

## Security Features

### 1. Rate Limiting
- **OTP Request:** 3 percobaan per menit per email
- **OTP Verify:** 5 percobaan per menit per email
- Auto clear rate limiter setelah login sukses

### 2. OTP Security
- OTP expires dalam 10 menit
- Auto delete old unverified OTPs
- 6 digit random number
- One-time use only (marked as verified)

### 3. User Validation
- Validasi email exists
- Cek user status active
- Session regeneration setelah login

## Usage Flow

### Admin Perspective (User Creation):
1. Admin login ke sistem
2. Navigate ke User Management (`/users`)
3. Click "Tambah User"
4. Fill in user details:
   - Name, Email, Phone (optional)
   - Password (optional - user can login with OTP only)
   - Role (admin/user)
   - Status (must be "active" for login access)
5. Click "Simpan"
6. User account is created and can login immediately

### User Perspective (Login):
1. User buka halaman login
2. Pilih "OTP Login" (default) atau "Password Login"
3. **OTP Flow:**
   - Input **registered email** → Klik "Send OTP Code"
   - System validates: email exists + user is active
   - Cek email untuk 6-digit code
   - Input OTP code → Klik "Verify & Log in"
   - Redirect ke dashboard
4. **Password Flow:**
   - Input email & password
   - Klik "Log in"
   - Redirect ke dashboard

**Note**: If email is not registered, user will see error "No account found with this email address." Contact admin to create account.

## Testing

### Manual Testing:
1. Jalankan migration:
```bash
php artisan migrate
```

2. Setup email (development):
```bash
# Email akan di-log ke storage/logs/laravel.log
MAIL_MAILER=log
```

3. Buat test user jika belum ada:
```bash
php artisan tinker
User::create([
    'name' => 'Test User',
    'email' => 'test@example.com',
    'password' => bcrypt('password'),
    'status' => 'active'
]);
```

4. Test OTP flow:
   - Buka `/login`
   - Pilih "OTP Login"
   - Input email: test@example.com
   - Cek `storage/logs/laravel.log` untuk OTP code
   - Input OTP code
   - Should redirect to dashboard

### Check Routes:
```bash
php artisan route:list --path=otp
```

### Check Email Logs:
```bash
tail -f storage/logs/laravel.log
```

## Error Handling

### Common Errors:
1. **"No account found with this email"**
   - Solution: Pastikan email terdaftar di database

2. **"Too many OTP requests"**
   - Solution: Tunggu 60 detik sebelum request lagi

3. **"Invalid or expired OTP"**
   - Solution: Request OTP baru atau cek typo

4. **"Your account is inactive"**
   - Solution: Contact admin untuk aktivasi account

## Future Enhancements
- [ ] Resend OTP button dengan countdown timer
- [ ] SMS OTP sebagai alternatif
- [ ] OTP via WhatsApp
- [ ] Remember device untuk skip OTP
- [ ] Admin dashboard untuk OTP logs

## Related Documentation
- [OTP_ACCESS_CONTROL.md](./OTP_ACCESS_CONTROL.md) - Detailed access control documentation
- Admin workflows
- User status management
- Troubleshooting guide

## Support
Jika ada masalah atau pertanyaan, silakan hubungi tim development.

### For Users:
- Cannot login? Contact admin to check if your account exists and is active
- OTP not received? Check spam folder or contact admin

### For Admins:
- User management issues? Check UserController and UserService
- OTP delivery issues? Check email configuration in `.env`
- Access logs: `storage/logs/laravel.log`
