<?php

namespace Database\Seeders;

use App\Models\Wilayah;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class WilayahSeeder extends Seeder
{
    public function run(): void
    {
        $csvFile = database_path('seeders/csv/Master Wilayah.csv');

        if (!File::exists($csvFile)) {
            $this->command->error("CSV file not found: {$csvFile}");
            return;
        }

        $file = fopen($csvFile, 'r');
        
        // Skip header row
        fgetcsv($file);

        $wilayahData = [];
        $count = 0;

        while (($row = fgetcsv($file)) !== false) {
            if (count($row) >= 4) {
                $wilayahData[] = [
                    'kode_provinsi' => $row[0],
                    'kode_kabupaten' => $row[1],
                    'provinsi' => $row[2],
                    'kabupaten' => $row[3],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                $count++;

                // Insert in batches of 100 for better performance
                if ($count % 100 === 0) {
                    Wilayah::insert($wilayahData);
                    $wilayahData = [];
                }
            }
        }

        // Insert remaining records
        if (!empty($wilayahData)) {
            Wilayah::insert($wilayahData);
        }

        fclose($file);

        $this->command->info("Successfully seeded {$count} wilayah records.");
    }
}
