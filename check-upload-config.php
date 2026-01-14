<?php
/**
 * Check Upload Configuration
 * Run: php check-upload-config.php
 */

echo "===========================================\n";
echo "    Upload Configuration Check\n";
echo "===========================================\n\n";

// PHP Configuration
echo "📋 PHP CONFIGURATION:\n";
echo "-------------------------------------------\n";
echo "upload_max_filesize: " . ini_get('upload_max_filesize') . "\n";
echo "post_max_size:       " . ini_get('post_max_size') . "\n";
echo "max_execution_time:  " . ini_get('max_execution_time') . " seconds\n";
echo "max_input_time:      " . ini_get('max_input_time') . " seconds\n";
echo "memory_limit:        " . ini_get('memory_limit') . "\n";
echo "max_file_uploads:    " . ini_get('max_file_uploads') . "\n\n";

// Convert to bytes for comparison
function convertToBytes($value) {
    $value = trim($value);
    $last = strtolower($value[strlen($value)-1]);
    $value = (int) $value;
    switch($last) {
        case 'g':
            $value *= 1024;
        case 'm':
            $value *= 1024;
        case 'k':
            $value *= 1024;
    }
    return $value;
}

$uploadMax = convertToBytes(ini_get('upload_max_filesize'));
$postMax = convertToBytes(ini_get('post_max_size'));

// Check if settings are correct
echo "✅ VALIDATION:\n";
echo "-------------------------------------------\n";

$errors = [];

if ($uploadMax < 210 * 1024 * 1024) {
    $errors[] = "❌ upload_max_filesize too small (need 210M)";
} else {
    echo "✅ upload_max_filesize: OK (>= 210M)\n";
}

if ($postMax < 210 * 1024 * 1024) {
    $errors[] = "❌ post_max_size too small (need 210M)";
} else {
    echo "✅ post_max_size: OK (>= 210M)\n";
}

if (ini_get('max_execution_time') < 300 && ini_get('max_execution_time') != 0) {
    $errors[] = "❌ max_execution_time too small (need 300)";
} else {
    echo "✅ max_execution_time: OK (>= 300 or unlimited)\n";
}

echo "\n";

// PHP.ini location
echo "📁 PHP.INI LOCATION:\n";
echo "-------------------------------------------\n";
echo php_ini_loaded_file() . "\n\n";

// Database check
echo "💾 DATABASE:\n";
echo "-------------------------------------------\n";
try {
    $dbPath = __DIR__ . '/database/database.sqlite';
    if (file_exists($dbPath)) {
        $dbSize = filesize($dbPath);
        echo "Database size: " . number_format($dbSize / (1024*1024), 2) . " MB\n";
        echo "Database path: " . $dbPath . "\n";
        
        // Check available disk space
        $freespace = disk_free_space(__DIR__);
        echo "Free disk space: " . number_format($freespace / (1024*1024*1024), 2) . " GB\n";
    } else {
        echo "⚠️  Database file not found\n";
    }
} catch (Exception $e) {
    echo "⚠️  Could not check database: " . $e->getMessage() . "\n";
}

echo "\n";

// Summary
echo "===========================================\n";
if (empty($errors)) {
    echo "✅ ALL CHECKS PASSED!\n";
    echo "===========================================\n\n";
    echo "🚀 You can now upload files up to 200MB\n";
    echo "👉 Make sure to run: php artisan queue:work --timeout=300\n";
} else {
    echo "❌ ERRORS FOUND:\n";
    echo "===========================================\n";
    foreach ($errors as $error) {
        echo $error . "\n";
    }
    echo "\n";
    echo "⚠️  Please restart Laravel Herd and run this script again.\n";
    echo "📖 See: RESTART_HERD_INSTRUCTIONS.md\n";
}

echo "\n";
