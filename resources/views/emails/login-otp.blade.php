<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Login OTP Code</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            background-color: #f9fafb;
            border-radius: 8px;
            padding: 30px;
            text-align: center;
        }
        .otp-code {
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #1f2937;
            background-color: #e5e7eb;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .warning {
            color: #dc2626;
            font-size: 14px;
            margin-top: 20px;
        }
        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Login OTP Code</h1>
        <p>Use this code to log in to your account:</p>
        
        <div class="otp-code">{{ $otp }}</div>
        
        <p>This code will expire in <strong>10 minutes</strong>.</p>
        
        <div class="warning">
            <strong>⚠️ Security Notice:</strong><br>
            Never share this code with anyone. Our team will never ask for this code.
        </div>
        
        <div class="footer">
            <p>If you didn't request this code, please ignore this email.</p>
        </div>
    </div>
</body>
</html>
