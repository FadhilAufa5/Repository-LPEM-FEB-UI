# Toast Notifications Implementation

Proyek ini menggunakan **Sonner** library untuk menampilkan toast notifications yang modern dan user-friendly.

## Fitur Toast yang Telah Diimplementasikan

### 1. **Edit Asset** (`assets.tsx`)
- **Trigger**: Ketika user klik tombol Edit pada asset
- **Jenis**: Info Toast
- **Pesan**: "Opening edit form for [nama asset]"
- **Deskripsi**: "You can now modify the asset details."
- **Durasi**: 3 detik

### 2. **Konfirmasi Create/Update Asset** (`asset-dialog.tsx`)
- **Trigger**: Ketika user submit form (create atau update)
- **Jenis**: Dialog Konfirmasi (bukan toast)
- **Pesan**: "Confirm Create/Update - Are you sure you want to create/update this asset?"
- **Isi**: Menampilkan kode, judul, dan nama file (jika ada)
- **Aksi**: 
  - Tombol "Confirm": Melanjutkan proses create/update
  - Tombol "Cancel": Membatalkan proses

### 3. **Upload File Progress** (`asset-dialog.tsx`)
- **Trigger**: Ketika user upload file dan klik confirm
- **Jenis**: Loading Toast (dengan spinner animation)
- **Pesan**: "Uploading file..."
- **Deskripsi**: "Uploading [nama file]. Please wait..."
- **Catatan**: Toast ini otomatis dismiss ketika upload selesai (success/error)

### 4. **Success Create Asset** (`asset-dialog.tsx`)
- **Trigger**: Setelah berhasil create asset
- **Jenis**: Success Toast (hijau)
- **Pesan**: "Asset created successfully!"
- **Deskripsi**: "Asset '[nama asset]' has been added."

### 5. **Success Update Asset** (`asset-dialog.tsx`)
- **Trigger**: Setelah berhasil update asset
- **Jenis**: Success Toast (hijau)
- **Pesan**: "Asset updated successfully!"
- **Deskripsi**: "Asset '[nama asset]' has been updated."

### 6. **Failed Create/Update Asset** (`asset-dialog.tsx`)
- **Trigger**: Ketika terjadi error saat create/update
- **Jenis**: Error Toast (merah)
- **Pesan**: "Failed to create/update asset"
- **Deskripsi**: Pesan error detail dari server

### 7. **Success Delete Asset** (`delete-asset-dialog.tsx`)
- **Trigger**: Setelah berhasil delete asset
- **Jenis**: Success Toast (hijau)
- **Pesan**: "Asset deleted successfully!"
- **Deskripsi**: "Asset '[nama asset]' has been permanently deleted."

### 8. **Failed Delete Asset** (`delete-asset-dialog.tsx`)
- **Trigger**: Ketika terjadi error saat delete
- **Jenis**: Error Toast (merah)
- **Pesan**: "Failed to delete asset"
- **Deskripsi**: Pesan error detail dari server

## Konfigurasi

Toast Toaster sudah dikonfigurasi di `resources/js/app.tsx`:

```tsx
import { Toaster } from 'sonner';

<Toaster richColors position="top-right" />
```

### Properties:
- **richColors**: true - Mengaktifkan warna yang lebih kaya untuk success, error, info, dll.
- **position**: "top-right" - Toast muncul di pojok kanan atas

## Cara Menggunakan di Komponen Lain

Import toast dari sonner:

```tsx
import { toast } from 'sonner';
```

### Contoh Penggunaan:

#### 1. Success Toast
```tsx
toast.success('Berhasil!', {
    description: 'Data telah disimpan.'
});
```

#### 2. Error Toast
```tsx
toast.error('Gagal!', {
    description: 'Terjadi kesalahan saat menyimpan data.'
});
```

#### 3. Info Toast
```tsx
toast.info('Informasi', {
    description: 'Ini adalah pesan informasi.',
    duration: 5000 // dalam milidetik
});
```

#### 4. Loading Toast
```tsx
const loadingToast = toast.loading('Memuat...', {
    description: 'Mohon tunggu sebentar.'
});

// Dismiss setelah selesai
toast.dismiss(loadingToast);
```

#### 5. Toast dengan Action Button
```tsx
toast.info('Konfirmasi', {
    duration: 5000,
    action: {
        label: 'Confirm',
        onClick: () => {
            // Action ketika confirm diklik
        }
    },
    cancel: {
        label: 'Cancel',
        onClick: () => {
            toast.dismiss();
        }
    }
});
```

## Package yang Digunakan

- **sonner**: ^1.7.1 (atau versi terbaru yang terinstall)

## Dokumentasi Lengkap

Untuk informasi lebih detail tentang Sonner, kunjungi:
https://sonner.emilkowal.ski/

## Flow Lengkap Create/Update Asset

1. User mengisi form asset
2. User klik tombol "Save" atau "Update"
3. **Dialog konfirmasi** muncul menampilkan detail (bukan toast)
4. User klik "Confirm" pada dialog
5. Jika ada file, **Loading toast** muncul dengan nama file
6. Proses upload/save berlangsung
7. Loading toast otomatis dismiss
8. **Success toast** (hijau) atau **Error toast** (merah) muncul sesuai hasil

## Notes

- Toast notifications otomatis dismiss setelah durasi tertentu (default 4 detik)
- Loading toast hanya muncul jika ada file yang diupload
- Loading toast akan di-dismiss secara manual ketika proses selesai
- Bisa dimuat beberapa toast sekaligus (stacked)
- Support dark mode otomatis
- Responsive dan accessible
- Dialog konfirmasi terpisah dari toast untuk UX yang lebih baik
