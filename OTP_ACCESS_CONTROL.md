# OTP Login Access Control

## Overview
Sistem OTP login hanya dapat digunakan oleh user yang sudah terdaftar di database oleh admin. Ini memastikan kontrol akses yang ketat dan mencegah registrasi yang tidak sah.

## Access Control Flow

### 1. Admin Creates User Account
Admin harus membuat user account terlebih dahulu melalui User Management:
- Navigate to `/users`
- Click "Tambah User"
- Fill in user details:
  - Name
  - Email (akan digunakan untuk OTP)
  - Password (opsional untuk backup login)
  - Role (admin/user)
  - Status (must be "active" untuk OTP login)
  - Phone (opsional)

### 2. User Receives Access
Setelah admin membuat account:
- User menerima kredensial akses
- User bisa login dengan 2 cara:
  1. **OTP Email** - Masukkan email → Terima OTP → Login
  2. **Password** - Masukkan email + password → Login

### 3. OTP Login Validations

Backend melakukan validasi berikut sebelum mengirim OTP:

#### Validasi 1: Email Must Exist
```php
$user = User::where('email', $email)->first();
if (!$user) {
    throw ValidationException::withMessages([
        'email' => ['No account found with this email address.'],
    ]);
}
```

#### Validasi 2: User Must Be Active
```php
if (isset($user->status) && $user->status !== User::STATUS_ACTIVE) {
    throw ValidationException::withMessages([
        'email' => ['Your account is inactive. Please contact support.'],
    ]);
}
```

#### Validasi 3: Rate Limiting
```php
// Maximum 3 OTP requests per minute per email
$key = 'otp-request:' . $email;
if (RateLimiter::tooManyAttempts($key, 3)) {
    $seconds = RateLimiter::availableIn($key);
    throw ValidationException::withMessages([
        'email' => ["Too many OTP requests. Please try again in {$seconds} seconds."],
    ]);
}
```

## User Status Management

### Active Status
- User dengan status `active` dapat:
  - Login dengan OTP
  - Login dengan password
  - Access semua fitur sesuai role

### Inactive Status
- User dengan status `inactive`:
  - **TIDAK BISA** login dengan OTP
  - **TIDAK BISA** login dengan password
  - Akan menerima error: "Your account is inactive. Please contact support."

## Admin User Management Features

### Creating New User
Di halaman User Management, admin dapat:
1. Click "Tambah User"
2. Isi form user baru
3. Set status "Aktif" untuk memberikan akses login
4. User langsung bisa login dengan OTP atau password

### Updating User Status
Admin dapat mengubah status user:
- **Aktif → Tidak Aktif**: Revoke access immediately
- **Tidak Aktif → Aktif**: Grant access immediately

### Deleting User
Admin dapat menghapus user untuk permanently revoke access.

## UI Indicators

### Login Page
User melihat informasi berikut:
- "Enter your registered email to receive an OTP code"
- "Only registered accounts can use OTP login. Contact admin if you need access."

### User Management
Admin melihat informasi:
- "Kelola pengguna dan hak akses mereka. User terdaftar dapat login dengan OTP email atau password."

### User Dialog
Saat membuat user baru:
- "Lengkapi form di bawah untuk menambahkan user baru. User dapat login menggunakan password atau OTP email."
- "Email ini akan digunakan untuk login dengan OTP atau password."
- "Hanya user dengan status 'Aktif' yang dapat login menggunakan OTP."

## Error Messages

### User Not Found
```
No account found with this email address.
```
**Solution**: Contact admin to create account

### User Inactive
```
Your account is inactive. Please contact support.
```
**Solution**: Contact admin to activate account

### Rate Limit Exceeded
```
Too many OTP requests. Please try again in XX seconds.
```
**Solution**: Wait for rate limit to expire

### Invalid OTP
```
Invalid or expired OTP code.
```
**Solution**: Request new OTP or check for typos

## Security Benefits

### 1. Controlled Access
- Hanya admin yang bisa membuat user
- Tidak ada self-registration
- Centralized user management

### 2. Immediate Access Revocation
- Admin bisa set status "inactive" untuk immediately block login
- Tidak perlu delete user untuk temporary revocation

### 3. Audit Trail
- Semua user creation di-track dengan timestamps
- Admin bisa lihat kapan user dibuat
- Track user activity

### 4. Role-Based Access
- Admin dapat assign role saat create user
- Role determines permissions dalam aplikasi
- Granular access control

## Best Practices

### For Admins:
1. **Create users dengan informasi lengkap**
   - Name yang jelas
   - Email yang valid
   - Phone untuk emergency contact

2. **Set status dengan hati-hati**
   - Default "active" untuk user baru yang ready
   - Use "inactive" untuk temporary suspension

3. **Regular user audit**
   - Review user list regularly
   - Remove unused accounts
   - Update roles as needed

4. **Email validation**
   - Pastikan email valid dan accessible
   - Test OTP delivery untuk user baru
   - Verify email ownership

### For Users:
1. **Keep email accessible**
   - Use primary email address
   - Check spam folder for OTP
   - Report delivery issues to admin

2. **Contact admin for access**
   - Don't try to self-register
   - Provide valid email to admin
   - Wait for account creation

3. **Report issues immediately**
   - Account inactive
   - OTP not received
   - Login problems

## Admin Workflow Example

### Scenario: New Employee Onboarding
```
1. HR notifies IT admin about new employee
2. Admin logs in to inventory app
3. Navigate to User Management (/users)
4. Click "Tambah User"
5. Fill form:
   - Name: "John Doe"
   - Email: "john.doe@company.com"
   - Phone: "+62 812 3456 7890"
   - Role: "user"
   - Status: "active"
   - Password: (optional, auto-generated atau manual)
6. Click "Simpan"
7. Inform employee:
   - "Your account is ready"
   - "You can login with email: john.doe@company.com"
   - "Choose OTP login at login page"
8. Employee receives OTP at john.doe@company.com
9. Employee logs in successfully
```

### Scenario: Employee Leave (Temporary)
```
1. HR notifies IT admin
2. Admin finds user in User Management
3. Click "Edit" button
4. Change status: "active" → "inactive"
5. Click "Perbarui"
6. Employee cannot login anymore (immediate effect)
7. When employee returns:
   - Change status back to "active"
   - Employee can login again immediately
```

### Scenario: Employee Termination
```
1. HR notifies IT admin
2. Admin finds user in User Management
3. Option A: Set status to "inactive" (soft)
4. Option B: Click "Delete" button (permanent)
5. Employee cannot login anymore
6. Keep user data for audit (Option A preferred)
```

## Troubleshooting

### Problem: User can't receive OTP
**Checklist**:
1. ✓ Email terdaftar di database?
2. ✓ User status "active"?
3. ✓ Email valid dan accessible?
4. ✓ Check spam folder?
5. ✓ Mail configuration correct? (check `.env`)
6. ✓ Check logs: `storage/logs/laravel.log`

### Problem: "No account found" error
**Solution**:
- Confirm email address is correct
- Contact admin to create account
- Admin checks User Management untuk verify

### Problem: OTP expired
**Solution**:
- OTP valid for 10 minutes only
- Request new OTP
- Use OTP immediately after receiving

## Configuration

### Email Settings
Ensure `.env` is properly configured:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.yourprovider.com
MAIL_PORT=587
MAIL_USERNAME=your-email@company.com
MAIL_PASSWORD=your-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@company.com
MAIL_FROM_NAME="${APP_NAME}"
```

### OTP Settings
Default settings in `LoginOtp` model:
- OTP length: 6 digits
- OTP expiry: 10 minutes
- Rate limit (request): 3 per minute
- Rate limit (verify): 5 per minute

To modify, edit:
- `app/Models/LoginOtp.php` - OTP generation
- `app/Http/Controllers/Auth/OtpLoginController.php` - Rate limits

## Conclusion

Sistem OTP dengan access control ini memastikan:
- ✅ Hanya user terdaftar yang bisa login
- ✅ Admin memiliki full control atas access
- ✅ Immediate access revocation capability
- ✅ Secure authentication flow
- ✅ User-friendly experience
- ✅ Clear error messages dan guidance

Untuk pertanyaan atau masalah, contact development team atau system administrator uhuyyy
