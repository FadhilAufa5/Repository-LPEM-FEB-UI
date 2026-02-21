# SYSTEM FLOW DIAGRAMS

Dokumentasi ini berisi berbagai diagram alur (flowchart) untuk proses-proses utama dalam Sistem Repository LPEM FEB UI.

---

## Table of Contents

1. [Authentication Flow](#authentication-flow)
2. [Asset Management Flow](#asset-management-flow)
3. [Client Management Flow](#client-management-flow)
4. [User Management Flow](#user-management-flow)
5. [Repository Search Flow](#repository-search-flow)
6. [Permission Checking Flow](#permission-checking-flow)
7. [File Upload Flow](#file-upload-flow)

---

## 1. Authentication Flow

### OTP Login Process

```mermaid
flowchart TD
    Start([User mengakses /login]) --> InputEmail[User memasukkan email]
    InputEmail --> ClickSend[User klik 'Send OTP']
    ClickSend --> ValidateEmail{Email valid?}

    ValidateEmail -->|No| ErrorEmail[Tampilkan error<br>email tidak valid]
    ErrorEmail --> InputEmail

    ValidateEmail -->|Yes| GenerateOTP[Backend generate<br>OTP 6 digit]
    GenerateOTP --> SaveDB[Simpan OTP ke database<br>dengan expires_at]
    SaveDB --> QueueEmail[Queue job untuk<br>kirim email]
    QueueEmail --> ShowSuccess[Tampilkan pesan:<br>'OTP sent to email']

    ShowSuccess --> Worker[Queue Worker<br>memproses job]
    Worker --> SendEmail[Kirim email<br>dengan OTP code]
    SendEmail --> UserEmail[User menerima<br>email dengan OTP]

    UserEmail --> InputOTP[User memasukkan<br>kode OTP]
    InputOTP --> ClickVerify[User klik 'Verify']
    ClickVerify --> CheckOTP{OTP valid<br>dan belum expired?}

    CheckOTP -->|No| ErrorOTP[Tampilkan error:<br>OTP invalid/expired]
    ErrorOTP --> InputOTP

    CheckOTP -->|Yes| MarkVerified[Mark OTP sebagai<br>verified]
    MarkVerified --> CheckUser{User dengan<br>email ini<br>sudah ada?}

    CheckUser -->|No| CreateUser[Auto-create<br>user baru]
    CheckUser -->|Yes| GetUser[Get existing user]

    CreateUser --> Login[Login user]
    GetUser --> Login

    Login --> Session[Create session]
    Session --> Redirect[Redirect ke /dashboard]
    Redirect --> End([Selesai])
```

### Traditional Login Process (Jika Ada)

```mermaid
flowchart TD
    Start([User akses /login]) --> Form[Form login<br>Email & Password]
    Form --> Submit[User submit form]
    Submit --> Validate{Credentials valid?}

    Validate -->|No| ErrorMsg[Tampilkan error<br>'Invalid credentials']
    ErrorMsg --> Form

    Validate -->|Yes| CheckStatus{User status<br>active?}

    CheckStatus -->|No| ErrorInactive[Error: Account inactive]
    ErrorInactive --> Form

    CheckStatus -->|Yes| Login[Login user]
    Login --> Session[Create session]
    Session --> Redirect[Redirect ke /dashboard]
    Redirect --> End([Selesai])
```

---

## 2. Asset Management Flow

### Create Asset Flow

```mermaid
flowchart TD
    Start([User buka halaman Assets]) --> ClickAdd[Klik 'Add New Asset']
    ClickAdd --> Dialog[Tampilkan dialog form]

    Dialog --> FillForm[User mengisi form:<br>- Kode<br>- Judul<br>- Abstrak<br>- Jenis Laporan<br>- Grup Kajian<br>- Kepala Proyek<br>- Staf<br>- Tahun<br>- Client]

    FillForm --> UploadFile[User upload file laporan]
    UploadFile --> UploadProposal{Upload proposal?}

    UploadProposal -->|Yes| SelectProposal[Upload file proposal]
    UploadProposal -->|No| ClickSubmit[Klik 'Save']
    SelectProposal --> ClickSubmit

    ClickSubmit --> ValidateForm{Form valid?}

    ValidateForm -->|No| ShowErrors[Tampilkan validation errors]
    ShowErrors --> FillForm

    ValidateForm -->|Yes| CheckFileSize{File size <= 200MB?}

    CheckFileSize -->|No| ErrorFileSize[Error: File too large]
    ErrorFileSize --> FillForm

    CheckFileSize -->|Yes| ProcessFile[Backend memproses file:<br>- Read file content<br>- Convert to binary<br>- Get MIME type<br>- Get file size]

    ProcessFile --> SaveAsset[Simpan asset ke database:<br>- Metadata<br>- File content (BLOB)<br>- Proposal content (BLOB)]

    SaveAsset --> Success{Berhasil?}

    Success -->|No| ErrorSave[Error: Gagal menyimpan]
    ErrorSave --> FillForm

    Success -->|Yes| CloseDialog[Tutup dialog]
    CloseDialog --> Refresh[Refresh daftar assets]
    Refresh --> Toast[Tampilkan toast:<br>'Asset created successfully']
    Toast --> End([Selesai])
```

### Update Asset Flow

```mermaid
flowchart TD
    Start([User di halaman Assets]) --> ClickEdit[Klik icon edit<br>pada asset]
    ClickEdit --> LoadData[Load data asset<br>dari database]
    LoadData --> Dialog[Tampilkan dialog<br>dengan data terisi]

    Dialog --> Modify[User memodifikasi data]
    Modify --> ReplaceFile{Upload file baru?}

    ReplaceFile -->|Yes| SelectNewFile[Pilih file baru]
    ReplaceFile -->|No| ClickSave[Klik 'Update']
    SelectNewFile --> ClickSave

    ClickSave --> ValidateForm{Form valid?}

    ValidateForm -->|No| ShowErrors[Tampilkan errors]
    ShowErrors --> Modify

    ValidateForm -->|Yes| UpdateDB[Update data di database:<br>- Update metadata<br>- Update file jika ada<br>- Update proposal jika ada]

    UpdateDB --> Success{Berhasil?}

    Success -->|No| ErrorUpdate[Error: Gagal update]
    ErrorUpdate --> Modify

    Success -->|Yes| CloseDialog[Tutup dialog]
    CloseDialog --> Refresh[Refresh daftar]
    Refresh --> Toast[Toast: 'Asset updated']
    Toast --> End([Selesai])
```

### Delete Asset Flow

```mermaid
flowchart TD
    Start([User di halaman Assets]) --> ClickDelete[Klik icon delete<br>pada asset]
    ClickDelete --> Confirm[Tampilkan dialog<br>konfirmasi]

    Confirm --> UserChoice{User konfirmasi?}

    UserChoice -->|Cancel| CloseConfirm[Tutup dialog]
    CloseConfirm --> End([Selesai])

    UserChoice -->|Confirm| CheckPermission{User punya<br>permission?}

    CheckPermission -->|No| ErrorPermission[Error: No permission]
    ErrorPermission --> End

    CheckPermission -->|Yes| DeleteDB[Hapus asset dari<br>database<br>including files]

    DeleteDB --> Success{Berhasil?}

    Success -->|No| ErrorDelete[Error: Gagal hapus]
    ErrorDelete --> End

    Success -->|Yes| CloseDialog[Tutup dialog]
    CloseDialog --> Refresh[Refresh daftar]
    Refresh --> Toast[Toast: 'Asset deleted']
    Toast --> End
```

### Download File Flow

```mermaid
flowchart TD
    Start([User klik download button]) --> DetermineType{Type file?}

    DetermineType -->|Laporan| RequestLaporan[GET /assets/{id}/download]
    DetermineType -->|Proposal| RequestProposal[GET /assets/{id}/download-proposal]

    RequestLaporan --> BackendLaporan[Backend ambil file_content<br>dari database]
    RequestProposal --> BackendProposal[Backend ambil proposal_content<br>dari database]

    BackendLaporan --> CheckExists{File exists?}
    BackendProposal --> CheckExists

    CheckExists -->|No| Error404[Error 404:<br>File not found]
    Error404 --> End([Selesai])

    CheckExists -->|Yes| PrepareResponse[Prepare response:<br>- Set headers<br>- Set MIME type<br>- Set filename]

    PrepareResponse --> StreamFile[Stream binary content<br>ke browser]
    StreamFile --> BrowserDownload[Browser memulai download]
    BrowserDownload --> End
```

---

## 3. Client Management Flow

### Create Client Flow

```mermaid
flowchart TD
    Start([User buka halaman Clients]) --> ClickAdd[Klik 'Add New Client']
    ClickAdd --> Dialog[Tampilkan dialog form]

    Dialog --> FillForm[User mengisi form:<br>- Kode Klien<br>- Nama Klien<br>- Type of Client<br>- Alamat<br>- Provinsi<br>- Kabupaten/Kota<br>- Kontak Person<br>- Telepon]

    FillForm --> ClickSave[Klik 'Save']
    ClickSave --> ValidateForm{Form valid?}

    ValidateForm -->|No| ShowErrors[Tampilkan errors]
    ShowErrors --> FillForm

    ValidateForm -->|Yes| CheckUnique{Kode klien unique?}

    CheckUnique -->|No| ErrorDuplicate[Error: Kode sudah ada]
    ErrorDuplicate --> FillForm

    CheckUnique -->|Yes| SaveClient[Simpan client ke database:<br>- user_id dari auth user<br>- semua data form]

    SaveClient --> Success{Berhasil?}

    Success -->|No| ErrorSave[Error: Gagal simpan]
    ErrorSave --> FillForm

    Success -->|Yes| CloseDialog[Tutup dialog]
    CloseDialog --> Refresh[Refresh daftar clients]
    Refresh --> Toast[Toast: 'Client created']
    Toast --> End([Selesai])
```

### Update & Delete Client Flow

```mermaid
flowchart TD
    Start([User di halaman Clients]) --> Action{Aksi?}

    Action -->|Edit| ClickEdit[Klik icon edit]
    Action -->|Delete| ClickDelete[Klik icon delete]

    ClickEdit --> LoadData[Load data client]
    LoadData --> ShowDialog[Tampilkan dialog<br>dengan data terisi]
    ShowDialog --> ModifyData[User modifikasi data]
    ModifyData --> SaveUpdate[Simpan update]
    SaveUpdate --> RefreshEdit[Refresh & toast]
    RefreshEdit --> End([Selesai])

    ClickDelete --> CheckAssets{Client punya<br>assets?}

    CheckAssets -->|Yes| WarningMsg[Warning: Client<br>memiliki assets]
    WarningMsg --> ConfirmDelete[Konfirmasi tetap hapus?]

    CheckAssets -->|No| ConfirmDelete

    ConfirmDelete --> UserConfirm{User confirm?}

    UserConfirm -->|No| Cancel[Cancel]
    Cancel --> End

    UserConfirm -->|Yes| DeleteClient[Hapus client<br>Set NULL di assets.client_id]
    DeleteClient --> RefreshDelete[Refresh & toast]
    RefreshDelete --> End
```

---

## 4. User Management Flow

### Create User Flow (Admin Only)

```mermaid
flowchart TD
    Start([Admin buka halaman Users]) --> CheckRole{User role<br>= admin?}

    CheckRole -->|No| Error403[403 Forbidden]
    Error403 --> End([Selesai])

    CheckRole -->|Yes| ShowPage[Tampilkan halaman Users]
    ShowPage --> ClickAdd[Klik 'Add New User']
    ClickAdd --> Dialog[Tampilkan dialog form]

    Dialog --> FillForm[Admin mengisi form:<br>- Name<br>- Email<br>- Password<br>- Phone<br>- Status<br>- Assign Roles]

    FillForm --> ClickSave[Klik 'Save']
    ClickSave --> ValidateForm{Form valid?}

    ValidateForm -->|No| ShowErrors[Tampilkan errors]
    ShowErrors --> FillForm

    ValidateForm -->|Yes| CheckEmail{Email unique?}

    CheckEmail -->|No| ErrorEmail[Error: Email sudah ada]
    ErrorEmail --> FillForm

    CheckEmail -->|Yes| CreateUser[Create user:<br>- Hash password<br>- Save to database]

    CreateUser --> AttachRoles[Attach roles ke user<br>via role_user table]

    AttachRoles --> Success{Berhasil?}

    Success -->|No| ErrorSave[Error: Gagal simpan]
    ErrorSave --> FillForm

    Success -->|Yes| CloseDialog[Tutup dialog]
    CloseDialog --> Refresh[Refresh user list]
    Refresh --> Toast[Toast: 'User created']
    Toast --> End
```

### Assign Roles to User Flow

```mermaid
flowchart TD
    Start([Admin edit user]) --> LoadUser[Load user data<br>dan current roles]
    LoadUser --> ShowRoles[Tampilkan checkbox<br>untuk semua roles]

    ShowRoles --> SelectRoles[Admin select/deselect roles]
    SelectRoles --> SaveChanges[Klik 'Save']

    SaveChanges --> DetachOld[Detach semua roles lama<br>dari role_user]
    DetachOld --> AttachNew[Attach roles baru<br>ke role_user]

    AttachNew --> LoadPermissions[Load permissions<br>untuk roles tersebut]
    LoadPermissions --> UpdateCache[Update permission cache]
    UpdateCache --> Success[Toast: 'Roles updated']
    Success --> End([Selesai])
```

---

## 5. Repository Search Flow

### Public Search Flow

```mermaid
flowchart TD
    Start([User akses /repository]) --> ShowPage[Tampilkan halaman repository<br>dengan search & filters]

    ShowPage --> Input[User input query<br>dan/atau pilih filters:<br>- Search text<br>- Jenis Laporan<br>- Grup Kajian<br>- Tahun<br>- Author]

    Input --> ClickSearch[Klik 'Search' atau auto-search]

    ClickSearch --> BuildQuery[Backend build SQL query:<br>WHERE conditions dengan AND/OR]

    BuildQuery --> AddFilters{Ada filters?}

    AddFilters -->|Jenis Laporan| FilterJenis[AND jenis_laporan = ?]
    AddFilters -->|Grup Kajian| FilterGrup[AND grup_kajian = ?]
    AddFilters -->|Tahun| FilterTahun[AND tahun = ?]
    AddFilters -->|Author| FilterAuthor[AND kepala_proyek LIKE ?]
    AddFilters -->|Search Text| FilterText[AND judul_laporan LIKE ?<br>OR abstrak LIKE ?]

    FilterJenis --> ExecuteQuery
    FilterGrup --> ExecuteQuery
    FilterTahun --> ExecuteQuery
    FilterAuthor --> ExecuteQuery
    FilterText --> ExecuteQuery
    AddFilters -->|No filters| ExecuteQuery[Execute query<br>dengan pagination]

    ExecuteQuery --> JoinTables[JOIN dengan tables:<br>- clients<br>- users<br>- wilayah]

    JoinTables --> GetResults[Get results<br>dengan LIMIT & OFFSET]

    GetResults --> Count[Count total results<br>untuk pagination]

    Count --> FormatData[Format data:<br>- Hide file_content<br>- Add computed fields<br>- Select necessary columns]

    FormatData --> ReturnJSON[Return JSON response<br>ke frontend]

    ReturnJSON --> RenderResults[Render results<br>di halaman]

    RenderResults --> UserAction{User action?}

    UserAction -->|View Detail| ViewDetail[Navigate to<br>/repository/{id}]
    UserAction -->|Download| DownloadFile[Trigger download]
    UserAction -->|Refine Search| Input
    UserAction -->|Pagination| NextPage[Load next page]

    ViewDetail --> End([Selesai])
    DownloadFile --> End
    NextPage --> ClickSearch
```

### Advanced Search Flow

```mermaid
flowchart TD
    Start([User akses /report-search]) --> ShowAdvanced[Tampilkan advanced search form<br>dengan lebih banyak options]

    ShowAdvanced --> FillFilters[User mengisi multiple filters:<br>- Title<br>- Author/Kepala Proyek<br>- Staf<br>- Abstract keywords<br>- Jenis Laporan<br>- Grup Kajian<br>- Year range<br>- Client<br>- Date range]

    FillFilters --> ClickSearch[Submit search]

    ClickSearch --> BuildComplex[Build complex query<br>dengan multiple JOINs]

    BuildComplex --> ApplyFilters[Apply semua filters<br>dengan AND logic]

    ApplyFilters --> FullTextSearch{Gunakan<br>full-text search?}

    FullTextSearch -->|Yes| FTS[Use FTS query<br>untuk search abstrak]
    FullTextSearch -->|No| LikeSearch[Use LIKE query]

    FTS --> OrderResults
    LikeSearch --> OrderResults[Order by relevance<br>atau tahun DESC]

    OrderResults --> Paginate[Apply pagination]
    Paginate --> Return[Return results]
    Return --> Display[Display di tabel<br>dengan highlight]
    Display --> End([Selesai])
```

---

## 6. Permission Checking Flow

### Route Permission Check

```mermaid
flowchart TD
    Start([User request route]) --> Middleware1[auth middleware]
    Middleware1 --> CheckAuth{Authenticated?}

    CheckAuth -->|No| Redirect401[Redirect to /login]
    Redirect401 --> End([Akses ditolak])

    CheckAuth -->|Yes| Middleware2[role middleware]
    Middleware2 --> CheckRoute{Route memerlukan<br>specific role?}

    CheckRoute -->|No| AllowAccess
    CheckRoute -->|Yes| GetUserRoles[Query user roles:<br>SELECT * FROM role_user<br>WHERE user_id = ?]

    GetUserRoles --> LoadRoles[Load roles data<br>dari cache atau DB]

    LoadRoles --> CheckRole{User memiliki<br>required role?}

    CheckRole -->|No| Error403[403 Forbidden]
    Error403 --> End

    CheckRole -->|Yes| CheckPermission{Route memerlukan<br>specific permission?}

    CheckPermission -->|No| AllowAccess[Allow access]
    CheckPermission -->|Yes| LoadPerms[Query permissions:<br>via role_user → roles<br>→ permission_role<br>→ permissions]

    LoadPerms --> HasPerm{User memiliki<br>required permission?}

    HasPerm -->|No| Error403
    HasPerm -->|Yes| AllowAccess

    AllowAccess --> Controller[Execute controller]
    Controller --> Response[Return response]
    Response --> EndSuccess([Akses diberikan])
```

### Permission Check in Frontend

```mermaid
flowchart TD
    Start([Component render]) --> GetAuth[Get auth.user<br>dari Inertia props]

    GetAuth --> CheckFeature{Fitur memerlukan<br>permission?}

    CheckFeature -->|No| RenderUI[Render UI]
    RenderUI --> End([Selesai])

    CheckFeature -->|Yes| GetRole[Get user.role]
    GetRole --> IsAdmin{role === 'admin'?}

    IsAdmin -->|Yes| ShowFeature[Show feature/button]
    ShowFeature --> End

    IsAdmin -->|No| CheckUserPerm{Cek permission<br>di frontend?}

    CheckUserPerm -->|User owns resource| ShowFeature
    CheckUserPerm -->|User has permission| ShowFeature
    CheckUserPerm -->|No permission| HideFeature[Hide feature/button]

    HideFeature --> End
```

---

## 7. File Upload Flow

### Binary File Upload to Database

```mermaid
flowchart TD
    Start([User select file]) --> FileSelect[File input<br>onChange event]

    FileSelect --> ValidateClient{File selected?}

    ValidateClient -->|No| End([Selesai])

    ValidateClient -->|Yes| CheckSize{File size<br><= 200MB?}

    CheckSize -->|No| ErrorSize[Error: File too large<br>Max 200MB]
    ErrorSize --> End

    CheckSize -->|Yes| CheckType{File type<br>= PDF?}

    CheckType -->|No| ErrorType[Error: Only PDF allowed]
    ErrorType --> End

    CheckType -->|Yes| ReadFile[Read file as<br>base64 atau blob]

    ReadFile --> PreviewFile[Optional: Show preview<br>atau file info]

    PreviewFile --> UserSubmit[User submit form]

    UserSubmit --> SendToBackend[POST request dengan:<br>- FormData<br>- atau JSON dengan base64]

    SendToBackend --> BackendReceive[Backend receive request]

    BackendReceive --> ValidateBackend{Validate file<br>di backend}

    ValidateBackend -->|Invalid| ReturnError[Return validation error]
    ReturnError --> ShowError[Tampilkan error di form]
    ShowError --> End

    ValidateBackend -->|Valid| ProcessFile[Process file:<br>1. Get file content<br>2. Get MIME type<br>3. Get file size<br>4. Get original name]

    ProcessFile --> PrepareData[Prepare data untuk DB:<br>- file_content = binary<br>- file_name = string<br>- file_mime = string<br>- file_size = integer]

    PrepareData --> SaveToDB[INSERT/UPDATE<br>ke database<br>with BLOB column]

    SaveToDB --> Success{Berhasil?}

    Success -->|No| ErrorDB[Error: DB save failed]
    ErrorDB --> ShowError

    Success -->|Yes| ReturnSuccess[Return success response]
    ReturnSuccess --> ShowToast[Toast: 'File uploaded']
    ShowToast --> ClearForm[Clear form<br>atau close dialog]
    ClearForm --> End
```

### File Download from Database

```mermaid
flowchart TD
    Start([User klik download]) --> SendRequest[GET /assets/{id}/download]

    SendRequest --> Backend[Backend controller<br>receive request]

    Backend --> CheckAuth{User authenticated<br>jika private?}

    CheckAuth -->|No| Return401[401 Unauthorized]
    Return401 --> End([Gagal])

    CheckAuth -->|Yes| QueryDB[Query database:<br>SELECT file_content,<br>file_name, file_mime<br>FROM assets<br>WHERE id = ?]

    QueryDB --> FileExists{File content<br>exists?}

    FileExists -->|No| Return404[404 Not Found]
    Return404 --> End

    FileExists -->|Yes| PrepareResponse[Prepare HTTP response:<br>- Content-Type: file_mime<br>- Content-Disposition: attachment<br>- filename: file_name]

    PrepareResponse --> StreamContent[Stream binary content<br>dari BLOB column]

    StreamContent --> SendResponse[Send response<br>ke browser]

    SendResponse --> BrowserReceive[Browser receive<br>binary data]

    BrowserReceive --> BrowserDownload[Browser trigger<br>download dialog]

    BrowserDownload --> SaveFile[User save file<br>ke local]

    SaveFile --> EndSuccess([Berhasil])
```

---

## 8. Dashboard Analytics Flow

### Load Dashboard Data

```mermaid
flowchart TD
    Start([User akses /dashboard]) --> CheckAuth{Authenticated?}

    CheckAuth -->|No| Redirect[Redirect to /login]
    Redirect --> End([Akses ditolak])

    CheckAuth -->|Yes| LoadData[Backend load data<br>secara parallel]

    LoadData --> Query1[Query 1:<br>Total assets count]
    LoadData --> Query2[Query 2:<br>Total clients count]
    LoadData --> Query3[Query 3:<br>Total users count<br>jika admin]
    LoadData --> Query4[Query 4:<br>Assets by year<br>GROUP BY tahun]
    LoadData --> Query5[Query 5:<br>Assets by jenis laporan<br>GROUP BY jenis_laporan]
    LoadData --> Query6[Query 6:<br>Assets by grup kajian<br>GROUP BY grup_kajian]
    LoadData --> Query7[Query 7:<br>Recent activities<br>ORDER BY created_at DESC<br>LIMIT 10]

    Query1 --> Aggregate[Aggregate semua data]
    Query2 --> Aggregate
    Query3 --> Aggregate
    Query4 --> Aggregate
    Query5 --> Aggregate
    Query6 --> Aggregate
    Query7 --> Aggregate

    Aggregate --> FormatData[Format data untuk charts:<br>- Transform ke format Recharts<br>- Calculate percentages<br>- Sort data]

    FormatData --> ReturnProps[Return sebagai<br>Inertia props]

    ReturnProps --> RenderPage[Render dashboard page<br>dengan React components]

    RenderPage --> RenderCharts[Render charts:<br>- BarChart<br>- PieChart<br>- LineChart<br>- Statistics cards]

    RenderCharts --> Interactive[User interact:<br>- Hover charts<br>- Click quick actions<br>- View recent activities]

    Interactive --> End([Selesai])
```

---

## Summary

Dokumen ini mencakup flow diagram untuk:

1. ✅ **Authentication Flow** - OTP login dan traditional login
2. ✅ **Asset Management Flow** - Create, update, delete, dan download assets
3. ✅ **Client Management Flow** - CRUD operations untuk clients
4. ✅ **User Management Flow** - Admin creates users dan assign roles
5. ✅ **Repository Search Flow** - Public search dan advanced search
6. ✅ **Permission Checking Flow** - Route middleware dan frontend checks
7. ✅ **File Upload Flow** - Binary upload ke database dan download
8. ✅ **Dashboard Analytics Flow** - Load dan display statistics

Semua flow menggunakan **Mermaid diagram syntax** yang dapat di-render di Markdown viewers yang mendukung Mermaid (seperti GitHub, GitLab, atau VS Code dengan extension).

---

**Last Updated:** 14 Februari 2026  
**Version:** 1.0.0
