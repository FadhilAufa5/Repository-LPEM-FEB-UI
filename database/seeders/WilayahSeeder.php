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

        
        Wilayah::truncate();

        $file = fopen($csvFile, 'r');

        
        fgetcsv($file);

        $wilayahData = [];
        $seen = [];
        $count = 0;

        while (($row = fgetcsv($file)) !== false) {
            if (count($row) >= 4) {
                $kodeKabupaten = trim($row[1]);

                
                if (isset($seen[$kodeKabupaten])) {
                    continue;
                }
                $seen[$kodeKabupaten] = true;

                $wilayahData[] = [
                    'kode_provinsi'  => trim($row[0]),
                    'kode_kabupaten' => $kodeKabupaten,
                    'provinsi'       => trim($row[2]),
                    'kabupaten'      => trim($row[3]),
                    'created_at'     => now(),
                    'updated_at'     => now(),
                ];

                $count++;

               
                if ($count % 100 === 0) {
                    Wilayah::insert($wilayahData);
                    $wilayahData = [];
                }
            }
        }

      
        if (!empty($wilayahData)) {
            Wilayah::insert($wilayahData);
        }

        fclose($file);

        $this->command->info("Successfully seeded {$count} wilayah records.");
    }
}
