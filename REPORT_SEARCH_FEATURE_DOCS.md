# Report Search Feature Documentation

## Overview
Halaman khusus untuk browsing dan searching repository berdasarkan jenis laporan (report type). Halaman ini berbeda dari halaman repository utama dengan fokus pada kategorisasi berdasarkan tipe dokumen.

## Fitur yang Ditambahkan

### 1. Frontend (resources/js/pages/report-search.tsx)
Halaman baru dengan fitur:

#### Visual Design
- **Card Grid Layout**: 6 kategori jenis laporan dalam grid card yang menarik
- **Color-Coded Cards**: Setiap jenis laporan memiliki warna unique:
  - Penelitian + Survey: Blue
  - Penelitian: Purple
  - Diklat: Green
  - Jurnal: Yellow
  - Buku: Red
  - Lainnya: Gray
- **Icon Representation**: Setiap kategori memiliki icon yang relevan
- **Badge Count**: Menampilkan jumlah dokumen di setiap kategori
- **Hover Effects**: Animasi smooth saat hover dengan scale dan shadow

#### Interaksi User
1. User melihat 6 card kategori jenis laporan
2. Klik card untuk filter dokumen berdasarkan jenis laporan
3. Hasil ditampilkan di bawah card grid
4. Button "Clear Selection" untuk reset filter

#### Components
- Navbar dan Footer yang konsisten
- Breadcrumb navigation
- Empty state yang informatif
- Results listing dengan format APA-style citation

### 2. Backend

#### ReportSearchController (app/Http/Controllers/ReportSearchController.php)
Controller khusus untuk halaman report search dengan features:
- Handling filter berdasarkan jenis_laporan
- Pagination support
- Empty state handling ketika tidak ada filter

#### RepositoryService Enhancement (app/Services/RepositoryService.php)
- **Method Baru**: `getJenisLaporanCounts()`
  - Menghitung jumlah dokumen per jenis laporan
  - Query agregasi untuk performa optimal
  - Return: Array dengan key = jenis_laporan, value = count

```php
public function getJenisLaporanCounts(): array
{
    $counts = Asset::query()
        ->selectRaw('jenis_laporan, COUNT(*) as count')
        ->groupBy('jenis_laporan')
        ->pluck('count', 'jenis_laporan')
        ->toArray();

    return $counts;
}
```

### 3. Routing (routes/web.php)
```php
Route::get('/report-search', [ReportSearchController::class, 'index'])->name('report-search');
```

### 4. Navigation Update (resources/js/pages/welcome.tsx)
Menambahkan link "Browse by Report Type" di sidebar menu welcome page

## Jenis Laporan yang Didukung

1. **Penelitian + Survey**
   - Value: `penelitian_survey`
   - Icon: FileStack
   - Description: Comprehensive research with survey data collection

2. **Penelitian**
   - Value: `penelitian`
   - Icon: Search
   - Description: Academic research and studies

3. **Diklat**
   - Value: `diklat`
   - Icon: GraduationCap
   - Description: Training and education materials

4. **Jurnal**
   - Value: `jurnal`
   - Icon: Newspaper
   - Description: Journal publications and articles

5. **Buku**
   - Value: `buku`
   - Icon: BookOpen
   - Description: Books and monographs

6. **Lainnya**
   - Value: `lainnya`
   - Icon: FolderOpen
   - Description: Other types of reports

## User Flow

```
Welcome Page
    └─> Click "Browse by Report Type"
        └─> Report Search Page
            ├─> View all 6 report type cards with counts
            ├─> Click on a card (e.g., "Penelitian")
            │   └─> Results filtered by report type
            │       ├─> View list of documents
            │       ├─> Click "View Details" to see full document
            │       └─> Click "Clear Selection" to reset
            └─> No selection: Shows helpful empty state
```

## Perbedaan dengan Repository Page

| Feature | Repository Page | Report Search Page |
|---------|----------------|-------------------|
| **Primary Filter** | Research Group | Report Type |
| **Layout** | Sidebar + List | Card Grid + List |
| **Visual Style** | Form-based filters | Visual card selection |
| **Additional Filters** | Title, Author, Abstract, Year | None (focused) |
| **Use Case** | Advanced search | Quick browse by category |

## Cara Akses

1. **Dari Welcome Page**: Klik "Browse by Report Type" di sidebar menu
2. **Direct URL**: `/report-search`
3. **Dengan Filter**: `/report-search?jenis_laporan=penelitian`

## Testing

### Manual Testing Checklist
- [ ] Akses halaman `/report-search`
- [ ] Verifikasi 6 card jenis laporan tampil
- [ ] Verifikasi badge count tampil di setiap card
- [ ] Klik salah satu card, verifikasi hasil filter muncul
- [ ] Verifikasi pagination jika hasil > 12 dokumen
- [ ] Klik "Clear Selection", verifikasi kembali ke empty state
- [ ] Test dark mode compatibility
- [ ] Test responsive di mobile

### Expected Behavior
1. Tanpa filter: Menampilkan card grid dengan empty state message
2. Dengan filter: Menampilkan hasil dokumen yang sesuai
3. Card yang dipilih: Memiliki ring highlight
4. Badge: Hanya tampil jika count > 0

## Technical Details

### Props Interface
```typescript
interface ReportSearchPageProps {
    repositories: PaginatedData<RepositoryItem>;
    jenisLaporanCounts: Record<string, number>;
    filters: {
        jenis_laporan?: string;
    };
}
```

### Color System
Menggunakan Tailwind CSS dengan consistent color palette:
- Light mode: Pastel backgrounds dengan darker text
- Dark mode: Dark backgrounds dengan lighter text
- Hover states: Slightly darker/lighter variants

## Future Enhancements

1. **Combined Filters**: Tambahkan filter tambahan (year, research group)
2. **Export Results**: Export hasil search ke PDF/Excel
3. **Save Search**: Save favorite searches
4. **Statistics View**: Visualisasi distribusi dokumen per kategori
5. **Quick Preview**: Preview dokumen tanpa navigate ke detail page
6. **Sort Options**: Sort by year, title, author
7. **Grid/List Toggle**: Toggle antara grid dan list view untuk hasil
