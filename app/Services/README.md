# Services Layer

Folder ini berisi service classes yang mengelola business logic aplikasi untuk memisahkan logika dari controllers, membuat kode lebih clean, maintainable, dan mudah di-test.

## Structure

```
app/Services/
├── AssetService.php              # Mengelola asset/laporan management
├── ClientService.php             # Mengelola client management
├── DashboardService.php          # Mengelola data statistik dashboard
├── RepositoryService.php         # Mengelola public repository
├── RolePermissionService.php     # Mengelola roles dan permissions
└── UserService.php               # Mengelola user management
```

## Design Principles

### 1. Single Responsibility
Setiap service class fokus pada satu domain bisnis tertentu.

### 2. Dependency Injection
Services di-inject melalui constructor di controllers untuk memudahkan testing dan maintainability.

### 3. Query Optimization
- Menggunakan eager loading untuk menghindari N+1 problem
- Menggunakan `clone` pada query builder untuk reusability
- Memisahkan logic filtering ke private methods

### 4. Reusability
Logic yang sering dipakai dipisahkan ke private/protected methods agar bisa digunakan kembali.

## Service Classes

### AssetService
Mengelola semua logic terkait asset/laporan:
- **Filtering & Pagination**: `getFilteredAssets()`
- **CRUD Operations**: `createAsset()`, `updateAsset()`, `deleteAsset()`
- **Authorization**: `checkAssetOwnership()`
- **File Handling**: Upload dan delete file secara otomatis

### ClientService
Mengelola client data:
- **Filtering & Search**: `getFilteredClients()`
- **Geographic Data**: `getWilayahList()`, `getProvinsiList()`
- **CRUD Operations**: `createClient()`, `updateClient()`, `deleteClient()`
- **Authorization**: `checkClientOwnership()`

### DashboardService
Mengelola statistik dan data dashboard:
- **Statistics**: `getStatistics()` - Total repositories, year comparisons
- **Charts Data**: `getChartData()` - Data untuk visualisasi
- **Recent Items**: `getRecentRepositories()` - 5 repository terbaru
- **Optimized Queries**: Menggunakan query cloning untuk efisiensi

### RepositoryService
Mengelola public repository view:
- **Public Listing**: `getPublicRepositories()`
- **Detail View**: `getRepositoryById()`
- **Data Transformation**: `transformForList()`, `transformForDetail()`

### RolePermissionService
Mengelola role-based access control:
- **Roles Management**: `getFilteredRoles()`, CRUD operations
- **Permissions Management**: `getFilteredPermissions()`, CRUD operations
- **Helper Methods**: `getAllPermissionsGrouped()`, `getUniqueModules()`
- **Validation**: Business rules untuk delete operations

### UserService
Mengelola user management:
- **User Filtering**: `getFilteredUsers()`
- **CRUD Operations**: `createUser()`, `updateUser()`, `deleteUser()`
- **Business Rules**: Validasi admin deletion, self-deletion prevention

## Usage Example

```php
// In Controller
class AssetController extends Controller
{
    protected $assetService;

    public function __construct(AssetService $assetService)
    {
        $this->assetService = $assetService;
    }

    public function index(Request $request)
    {
        $filters = [
            'search' => $request->input('search'),
            'jenis_laporan' => $request->input('jenis_laporan'),
        ];

        $assets = $this->assetService->getFilteredAssets(
            $filters, 
            $request->user(), 
            $perPage = 10
        );

        return Inertia::render('assets', ['assets' => $assets]);
    }
}
```

## Benefits

### Performance
- Reduced code duplication
- Optimized database queries
- Efficient memory usage dengan query cloning

### Maintainability
- Single source of truth untuk business logic
- Mudah di-refactor tanpa mengubah controllers
- Konsisten dalam penanganan data

### Testability
- Services bisa di-unit test secara terpisah
- Dependency injection memudahkan mocking
- Business logic terpisah dari HTTP layer

### Scalability
- Mudah menambahkan fitur baru
- Logic bisa di-reuse di berbagai controllers
- Arsitektur yang jelas dan terstruktur

## Best Practices

1. **Keep Controllers Thin**: Controllers hanya handle HTTP requests/responses
2. **Services Handle Logic**: Semua business logic ada di services
3. **Private Methods**: Gunakan private methods untuk internal operations
4. **Type Hints**: Selalu gunakan type hints untuk clarity
5. **Exception Handling**: Throw exceptions dari services, catch di controllers
6. **Query Optimization**: Gunakan eager loading dan proper indexing
