<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\LoginOtp;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class OtpLoginController extends Controller
{
    public function requestOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $email = $request->email;

        // Rate limiting: 3 requests per minute
        $key = 'otp-request:' . $email;
        if (RateLimiter::tooManyAttempts($key, 3)) {
            $seconds = RateLimiter::availableIn($key);
            throw ValidationException::withMessages([
                'email' => ["Too many OTP requests. Please try again in {$seconds} seconds."],
            ]);
        }

        // Check if user exists
        $user = User::where('email', $email)->first();
        if (!$user) {
            throw ValidationException::withMessages([
                'email' => ['No account found with this email address.'],
            ]);
        }

        // Check if user is active
        if (isset($user->status) && $user->status !== User::STATUS_ACTIVE) {
            throw ValidationException::withMessages([
                'email' => ['Your account is inactive. Please contact support.'],
            ]);
        }

        // Generate and send OTP
        try {
            LoginOtp::generate($email);
            RateLimiter::hit($key, 60);

            return back()->with('status', 'OTP code has been sent to your email.');
        } catch (\Exception $e) {
            \Log::error('Failed to send OTP: ' . $e->getMessage());
            throw ValidationException::withMessages([
                'email' => ['Failed to send OTP. Please try again later.'],
            ]);
        }
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6',
        ]);

        $email = $request->email;
        $otp = $request->otp;

        \Log::info('OTP Verify attempt', ['email' => $email, 'otp' => $otp]);

        // Rate limiting: 5 attempts per minute
        $key = 'otp-verify:' . $email;
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            throw ValidationException::withMessages([
                'otp' => ["Too many verification attempts. Please try again in {$seconds} seconds."],
            ]);
        }

        // Verify OTP
        if (!LoginOtp::verify($email, $otp)) {
            RateLimiter::hit($key, 60);
            throw ValidationException::withMessages([
                'otp' => ['Invalid or expired OTP code.'],
            ]);
        }

        // Get user and log in
        $user = User::where('email', $email)->first();
        if (!$user) {
            throw ValidationException::withMessages([
                'email' => ['User not found.'],
            ]);
        }

        // Clear rate limiters
        RateLimiter::clear($key);
        RateLimiter::clear('otp-request:' . $email);

        // Log the user in
        Auth::login($user, $request->boolean('remember'));

        // Regenerate session
        $request->session()->regenerate();

        \Log::info('OTP Login successful', ['user_id' => $user->id, 'email' => $user->email]);

        return redirect()->intended(config('fortify.home'));
    }
}
