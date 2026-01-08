# Research Group Badge Feature

## Overview
Menambahkan badge notifikasi yang menampilkan jumlah repository untuk setiap research group di halaman repository.

## Fitur yang Ditambahkan

### Frontend (resources/js/pages/repository.tsx)
1. **Badge Count Display**: Menampilkan jumlah repository untuk setiap research group dalam bentuk badge
2. **Tooltip**: Hover pada badge akan menampilkan informasi lengkap
3. **Visual Design**: 
   - Badge kuning untuk research group individual
   - Badge abu-abu untuk "All Groups"
   - Animasi transisi smooth
   - Responsive design

### Backend

#### RepositoryService (app/Services/RepositoryService.php)
- **Method Baru**: `getGrupKajianCounts()`
  - Menghitung jumlah repository per grup kajian
  - Menggunakan query agregasi untuk performa optimal
  - Return: Array dengan key = grup_kajian, value = count

```php
public function getGrupKajianCounts(): array
{
    $counts = Asset::query()
        ->selectRaw('grup_kajian, COUNT(*) as count')
        ->groupBy('grup_kajian')
        ->pluck('count', 'grup_kajian')
        ->toArray();

    return $counts;
}
```

#### RepositoryController (app/Http/Controllers/RepositoryController.php)
- Menambahkan `grupKajianCounts` ke data yang dikirim ke frontend
- Data ini dikirim bersama dengan `repositories` dan `filters`

## Cara Kerja

1. Backend menghitung jumlah repository per grup kajian menggunakan SQL aggregation
2. Data dikirim ke frontend melalui Inertia.js
3. Frontend menampilkan badge di setiap option research group
4. Badge hanya ditampilkan jika count > 0
5. User dapat hover untuk melihat tooltip dengan informasi lengkap

## Visual Design

### Badge untuk Research Group
- Background: Yellow (bg-yellow-100 / dark:bg-yellow-900/30)
- Text: Yellow-800 (dark:text-yellow-400)
- Rounded full badge dengan padding minimal
- Animasi transisi 200ms

### Badge untuk "All Groups"
- Background: Gray (bg-gray-200 / dark:bg-neutral-700)
- Text: Gray-700 (dark:text-neutral-300)
- Menampilkan total semua repository

## Contoh Output

```
BC-GLOVE          [15]
NRES              [23]
GEC-RG            [8]
DTBS              [12]
...
```

## Testing

Untuk memastikan fitur berfungsi:
1. Buka halaman `/repository`
2. Lihat sidebar filter "Research Group"
3. Expand section research group
4. Setiap research group harus menampilkan badge dengan jumlah repository
5. Hover pada badge untuk melihat tooltip
6. Badge "All Groups" harus menampilkan total semua repository

## Future Improvements

1. Cache hasil query `getGrupKajianCounts()` untuk meningkatkan performa
2. Tambahkan filter dinamis berdasarkan filter lain (title, author, year)
3. Animasi counter ketika count berubah
4. Loading state saat data sedang di-fetch
