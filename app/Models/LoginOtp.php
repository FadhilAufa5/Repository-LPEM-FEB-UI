<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Mail;
use App\Mail\LoginOtpMail;

class LoginOtp extends Model
{
    protected $fillable = [
        'email',
        'otp',
        'expires_at',
        'verified',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'verified' => 'boolean',
    ];

    public static function generate(string $email): self
    {
        // Delete old OTPs for this email
        self::where('email', $email)
            ->where('verified', false)
            ->delete();

        // Generate 6 digit OTP
        $otp = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Create new OTP (expires in 10 minutes)
        $loginOtp = self::create([
            'email' => $email,
            'otp' => $otp,
            'expires_at' => now()->addMinutes(10),
            'verified' => false,
        ]);

        // Send email
        Mail::to($email)->send(new LoginOtpMail($otp));

        return $loginOtp;
    }

    public static function verify(string $email, string $otp): bool
    {
        $loginOtp = self::where('email', $email)
            ->where('otp', $otp)
            ->where('verified', false)
            ->where('expires_at', '>', now())
            ->first();

        if (!$loginOtp) {
            return false;
        }

        $loginOtp->update(['verified' => true]);

        return true;
    }

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }
}
