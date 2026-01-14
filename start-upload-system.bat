@echo off
echo ============================================
echo   Large File Upload System - Starter
echo ============================================
echo.

REM Check PHP configuration first
echo [1/3] Checking PHP configuration...
php check-upload-config.php
echo.

if errorlevel 1 (
    echo.
    echo ERROR: Configuration check failed!
    echo Please restart Laravel Herd first.
    echo.
    pause
    exit /b 1
)

echo [2/3] Starting Queue Worker...
echo.
echo Press Ctrl+C to stop the queue worker when done.
echo.
timeout /t 3
echo.

REM Start queue worker
php artisan queue:work --timeout=300

echo.
echo [3/3] Queue worker stopped.
echo.
pause
