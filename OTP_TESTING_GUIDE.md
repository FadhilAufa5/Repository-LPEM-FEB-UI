# OTP Login Testing Guide

## Prerequisites
1. ✅ Migration completed (`php artisan migrate`)
2. ✅ Frontend built (`npm run build`)
3. ✅ Email configured in `.env`
4. ✅ Test user created

## Test Scenario 1: Successful OTP Login

### Step 1: Create Test User (Admin)
```bash
php artisan tinker
```

```php
User::create([
    'name' => 'Test User OTP',
    'email' => 'testotp@example.com',
    'password' => bcrypt('password123'),
    'role' => 'user',
    'status' => 'active'
]);
```

### Step 2: Test OTP Login Flow
1. Open browser: `http://inventory-app.test/login`
2. Should see "OTP Login" tab selected by default
3. Enter email: `testotp@example.com`
4. Click "Send OTP Code"
5. **Expected**: Message "OTP code has been sent to your email"

### Step 3: Get OTP Code
For development (MAIL_MAILER=log):
```bash
# Check logs for OTP
tail -f storage/logs/laravel.log | grep -A 10 "OTP"
```

Look for line like:
```
[2025-12-25 23:30:00] local.INFO: OTP Verify attempt {"email":"testotp@example.com","otp":"123456"}
```

For production (real email):
- Check inbox for email from your app
- Subject: "Your Login OTP Code"
- Find 6-digit code in email body

### Step 4: Verify OTP
1. Enter the 6-digit OTP code
2. (Optional) Check "Remember me"
3. Click "Verify & Log in"
4. **Expected**: Redirected to `/dashboard`

### Step 5: Verify Login
- Check if you're logged in
- Check user menu in top right
- Should show "Test User OTP"

## Test Scenario 2: Unregistered Email

### Steps:
1. Go to login page
2. Select "OTP Login"
3. Enter: `notregistered@example.com`
4. Click "Send OTP Code"
5. **Expected**: Error "No account found with this email address"

## Test Scenario 3: Inactive User

### Step 1: Create Inactive User
```php
User::create([
    'name' => 'Inactive User',
    'email' => 'inactive@example.com',
    'password' => bcrypt('password123'),
    'role' => 'user',
    'status' => 'inactive'  // ← Note: inactive
]);
```

### Step 2: Try Login
1. Go to login page
2. Select "OTP Login"
3. Enter: `inactive@example.com`
4. Click "Send OTP Code"
5. **Expected**: Error "Your account is inactive. Please contact support"

## Test Scenario 4: Rate Limiting

### Steps:
1. Go to login page
2. Select "OTP Login"
3. Enter same email 4 times rapidly
4. **Expected**: After 3 attempts: "Too many OTP requests. Please try again in XX seconds"
5. Wait 60 seconds
6. Try again - should work

## Test Scenario 5: Invalid/Expired OTP

### Test Invalid OTP:
1. Request OTP for valid email
2. Enter wrong code (e.g., `000000`)
3. Click "Verify & Log in"
4. **Expected**: Error "Invalid or expired OTP code"

### Test Expired OTP:
1. Request OTP
2. Wait 11 minutes (OTP expires in 10 minutes)
3. Try to verify
4. **Expected**: Error "Invalid or expired OTP code"

## Test Scenario 6: Password Login (Fallback)

### Steps:
1. Go to login page
2. Click "Password Login" tab
3. Enter email: `testotp@example.com`
4. Enter password: `password123`
5. Click "Log in"
6. **Expected**: Redirected to `/dashboard`

## Test Scenario 7: Admin User Creation Flow

### Step 1: Login as Admin
```php
// Create admin user if not exists
User::create([
    'name' => 'Admin User',
    'email' => 'admin@example.com',
    'password' => bcrypt('admin123'),
    'role' => 'admin',
    'status' => 'active'
]);
```

### Step 2: Create New User via UI
1. Login as admin
2. Navigate to `/users`
3. Click "Tambah User"
4. Fill form:
   - Name: "New Employee"
   - Email: "newemployee@company.com"
   - Phone: "+62 812 3456 7890"
   - Password: (leave empty or set)
   - Role: "user"
   - Status: "active"
5. Click "Simpan"
6. **Expected**: User created successfully

### Step 3: Test New User Login
1. Logout
2. Go to `/login`
3. Select "OTP Login"
4. Enter: `newemployee@company.com`
5. Complete OTP flow
6. **Expected**: Login successful

## Debugging Tips

### Check Logs
```bash
# Real-time logs
tail -f storage/logs/laravel.log

# Search for OTP logs
grep "OTP" storage/logs/laravel.log

# Last 50 lines
tail -50 storage/logs/laravel.log
```

### Check Database
```bash
php artisan tinker
```

```php
// Check if OTP was created
DB::table('login_otps')->where('email', 'testotp@example.com')->get();

// Check user exists and status
User::where('email', 'testotp@example.com')->first();

// Check all active users
User::where('status', 'active')->get(['id', 'name', 'email', 'status']);
```

### Check Routes
```bash
# List OTP routes
php artisan route:list --path=otp

# List all auth routes
php artisan route:list --path=auth
```

### Check Email Configuration
```bash
# Check .env
cat .env | grep MAIL

# Test email (optional)
php artisan tinker
Mail::raw('Test email', function($msg) {
    $msg->to('test@example.com')->subject('Test');
});
```

## Common Issues & Solutions

### Issue 1: OTP not redirecting to dashboard
**Symptoms**: After entering OTP, nothing happens

**Debug steps**:
```bash
# Check logs for errors
tail -f storage/logs/laravel.log

# Look for:
# - "OTP Verify attempt" log
# - "OTP Login successful" log
# - Any errors after verify
```

**Solutions**:
- Check if `config/fortify.php` has `'home' => '/dashboard'`
- Check if user is actually logged in: `Auth::check()`
- Check browser console for JS errors
- Clear cache: `php artisan config:clear`

### Issue 2: OTP email not received
**Symptoms**: "OTP sent" message but no email

**Debug steps**:
```bash
# Check MAIL_MAILER in .env
echo $MAIL_MAILER

# For development, check logs
tail -f storage/logs/laravel.log | grep "Login OTP"
```

**Solutions**:
- If `MAIL_MAILER=log`, check `storage/logs/laravel.log`
- If using SMTP, verify credentials
- Check spam folder
- Test mail config: `php artisan config:cache`

### Issue 3: "No account found" error
**Symptoms**: Valid email shows "No account found"

**Debug steps**:
```php
// In tinker
User::where('email', 'youremail@example.com')->first();
```

**Solutions**:
- User doesn't exist - create it via admin panel or tinker
- Email typo - double check spelling
- Case sensitivity - Laravel email search is case-sensitive

### Issue 4: Rate limit errors
**Symptoms**: "Too many OTP requests"

**Solutions**:
- Wait 60 seconds
- Or clear rate limiter:
```php
// In tinker
use Illuminate\Support\Facades\RateLimiter;
RateLimiter::clear('otp-request:youremail@example.com');
RateLimiter::clear('otp-verify:youremail@example.com');
```

## Performance Testing

### Load Testing (Optional)
```bash
# Install Apache Bench (if not installed)
# On Windows: part of Apache installation
# On Mac: built-in
# On Linux: sudo apt install apache2-utils

# Test OTP request endpoint (use valid email)
ab -n 10 -c 2 -p post_data.txt -T application/x-www-form-urlencoded \
   http://inventory-app.test/auth/otp/request
```

## Security Testing

### Test Rate Limiting
- Rapid requests should be blocked
- Wait time should be enforced

### Test Invalid Inputs
- SQL injection attempts
- XSS attempts
- Invalid email formats
- Empty fields
- Very long inputs

### Test Session Security
- Check CSRF token
- Check session regeneration after login
- Check remember me functionality

## Cleanup After Testing

### Remove Test Users
```php
// In tinker
User::where('email', 'testotp@example.com')->delete();
User::where('email', 'inactive@example.com')->delete();
```

### Clear OTP Records
```php
// In tinker
DB::table('login_otps')->truncate();
```

### Clear Logs (optional)
```bash
# Backup first
cp storage/logs/laravel.log storage/logs/laravel.log.backup

# Clear
echo "" > storage/logs/laravel.log
```

## Expected Log Output (Success Flow)

```
[2025-12-25 23:30:00] local.INFO: OTP Verify attempt {"email":"testotp@example.com","otp":"123456"}
[2025-12-25 23:30:00] local.INFO: OTP Login successful {"user_id":1,"email":"testotp@example.com"}
```

## Checklist for Production Deployment

- [ ] Change `MAIL_MAILER=log` to `MAIL_MAILER=smtp`
- [ ] Configure real SMTP credentials
- [ ] Test email delivery in production
- [ ] Set proper `APP_URL` in `.env`
- [ ] Enable SSL/HTTPS
- [ ] Test with real email addresses
- [ ] Monitor rate limiting behavior
- [ ] Set up email monitoring/alerts
- [ ] Document support process for users
- [ ] Train admins on user creation process

## Support Contact

If issues persist:
1. Check all logs
2. Verify configuration
3. Test with different browsers
4. Clear browser cache/cookies
5. Contact development team with:
   - Error messages
   - Log excerpts
   - Steps to reproduce
   - Browser/device info

---

**Last Updated**: 2025-12-25  
**Tested On**: Laravel 12.x, PHP 8.2, Vite 7.x
