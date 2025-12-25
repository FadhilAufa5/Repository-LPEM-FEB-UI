# OTP Email Login System - Quick Reference

## 🚀 Quick Start

### For Admins
1. Navigate to `/users` (User Management)
2. Click "Tambah User" untuk create user baru
3. Fill required fields (name, email, status = "active")
4. User can login immediately with OTP or password

### For Users  
1. Open `/login`
2. Choose "OTP Login" (default)
3. Enter your **registered email**
4. Check email for 6-digit OTP code
5. Enter OTP and login

## ⚠️ Important Rules

### Access Control
- ✅ **Only registered users** can use OTP login
- ✅ **No self-registration** - admin must create accounts
- ✅ **Active users only** - inactive users cannot login
- ✅ **Email must exist** in database

### Security
- 🔒 OTP expires in **10 minutes**
- 🔒 Rate limit: **3 OTP requests per minute**
- 🔒 Rate limit: **5 verify attempts per minute**
- 🔒 One-time use only
- 🔒 Auto-delete old OTPs

## 📊 System Flow

```
Admin Creates User → User Receives Access → User Requests OTP → 
Email Sent → User Enters OTP → Verified → Logged In
```

## 🔑 Key Features

| Feature | Status |
|---------|--------|
| OTP Login | ✅ |
| Password Login | ✅ |
| Toggle Between Methods | ✅ |
| Admin User Management | ✅ |
| Status-based Access Control | ✅ |
| Rate Limiting | ✅ |
| Professional Email Template | ✅ |
| Error Handling | ✅ |

## 📁 Files Overview

### Backend
- `app/Models/LoginOtp.php` - OTP model & logic
- `app/Mail/LoginOtpMail.php` - Email mailable
- `app/Http/Controllers/Auth/OtpLoginController.php` - OTP controller
- `resources/views/emails/login-otp.blade.php` - Email template
- `database/migrations/*_create_login_otps_table.php` - Database migration

### Frontend
- `resources/js/pages/auth/login.tsx` - Login page with OTP/Password toggle
- `resources/js/components/user-dialog.tsx` - User creation form
- `resources/js/pages/users.tsx` - User management page
- `resources/js/routes/otp/index.ts` - OTP route definitions

### Routes
- `POST /auth/otp/request` - Request OTP
- `POST /auth/otp/verify` - Verify OTP & login

## 📝 Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "No account found with this email address" | Email not registered | Contact admin |
| "Your account is inactive" | User status = inactive | Contact admin |
| "Too many OTP requests" | Rate limit exceeded | Wait 60 seconds |
| "Invalid or expired OTP" | Wrong/expired code | Request new OTP |

## 🛠️ Configuration

### Email Setup (.env)
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

### Testing (Development)
```env
MAIL_MAILER=log  # Logs OTP to storage/logs/laravel.log
```

## 📖 Detailed Documentation

- **[OTP_LOGIN_GUIDE.md](./OTP_LOGIN_GUIDE.md)** - Complete technical documentation
- **[OTP_ACCESS_CONTROL.md](./OTP_ACCESS_CONTROL.md)** - Access control & security details

## ✅ Installation Checklist

- [x] Migration created and run
- [x] Models created (LoginOtp)
- [x] Controller created (OtpLoginController)
- [x] Routes registered
- [x] Email template created
- [x] Frontend components updated
- [x] Build successful
- [x] Access control implemented
- [x] Documentation complete

## 🔍 Quick Commands

```bash
# Run migration
php artisan migrate

# Check routes
php artisan route:list --path=otp

# Build frontend
npm run build

# Check email logs (development)
tail -f storage/logs/laravel.log

# Create test user (tinker)
php artisan tinker
User::create([
    'name' => 'Test User',
    'email' => 'test@example.com',
    'password' => bcrypt('password'),
    'status' => 'active'
]);
```

## 🎯 User Scenarios

### Scenario 1: Normal Login
1. User goes to `/login`
2. Selects "OTP Login"
3. Enters email: `john@company.com`
4. Receives OTP: `123456`
5. Enters OTP
6. ✅ Logged in to dashboard

### Scenario 2: Unregistered User
1. User goes to `/login`
2. Selects "OTP Login"
3. Enters email: `unknown@company.com`
4. ❌ Error: "No account found with this email address"
5. User contacts admin
6. Admin creates account
7. User can login

### Scenario 3: Inactive User
1. User goes to `/login`
2. Selects "OTP Login"
3. Enters email: `inactive@company.com`
4. ❌ Error: "Your account is inactive. Please contact support"
5. User contacts admin
6. Admin sets status to "active"
7. User can login

## 🎨 UI Components

### Login Page Features
- Toggle pills (OTP / Password)
- 2-step OTP flow
- Large OTP input (6 digits, centered)
- Back button
- Helper text
- Error messages

### User Management Features
- List all users with status badges
- Create new user dialog
- Edit user dialog
- Delete user confirmation
- Search & filters
- Pagination

## 🔐 Security Best Practices

### For Admins
1. ✅ Verify email ownership before creating accounts
2. ✅ Use strong passwords (if setting password)
3. ✅ Set status "inactive" for temporary suspension
4. ✅ Regular user audit
5. ✅ Monitor OTP logs for suspicious activity

### For Users
1. ✅ Keep email account secure
2. ✅ Don't share OTP codes
3. ✅ Use OTP immediately (expires in 10 min)
4. ✅ Check spam folder if OTP not received
5. ✅ Report suspicious activity

## 📞 Support

- **Users**: Contact admin for account issues
- **Admins**: Check logs or contact development team
- **Developers**: See detailed documentation files

---

**Last Updated**: 2025-12-25  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
