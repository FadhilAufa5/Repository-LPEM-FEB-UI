# ARCHITECTURE DOCUMENTATION

Dokumentasi arsitektur teknis dari Sistem Repository LPEM FEB UI.

---

## Table of Contents

1. [Application Architecture](#application-architecture)
2. [Technology Stack Layers](#technology-stack-layers)
3. [Request-Response Flow](#request-response-flow)
4. [Component Architecture](#component-architecture)
5. [Data Flow](#data-flow)
6. [Authentication Architecture](#authentication-architecture)
7. [File Storage Architecture](#file-storage-architecture)
8. [Deployment Architecture](#deployment-architecture)

---

## 1. Application Architecture

### High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Web Browser]
    end

    subgraph "Frontend Layer"
        Vite[Vite Dev Server]
        React[React Application]
        Inertia[Inertia.js Client]
        Components[UI Components]
    end

    subgraph "Backend Layer"
        Laravel[Laravel Application]
        InertiaServer[Inertia.js Server]
        Controllers[Controllers]
        Middleware[Middleware]
        Models[Eloquent Models]
        Queues[Queue System]
    end

    subgraph "Data Layer"
        SQLite[(SQLite Database)]
        FileSystem[File System]
        Cache[Cache]
    end

    subgraph "External Services"
        SMTP[SMTP Server<br/>Email OTP]
    end

    Browser <--> Vite
    Vite --> React
    React --> Inertia
    Inertia <--> InertiaServer
    InertiaServer --> Controllers
    Controllers --> Middleware
    Middleware --> Models
    Models <--> SQLite
    Queues --> SMTP
    Controllers --> Queues
    Models --> Cache
    Laravel --> FileSystem
```

### Architecture Pattern

Sistem ini menggunakan beberapa design patterns:

1. **MVC (Model-View-Controller)**
    - **Model**: Eloquent ORM (User, Asset, Client, dll)
    - **View**: React Components via Inertia.js
    - **Controller**: Laravel Controllers

2. **Repository Pattern** (Implicit via Eloquent)
    - Eloquent Models act as repositories
    - Abstraksi database queries

3. **Service Layer Pattern** (untuk business logic kompleks)
    - AssetService, AuthService, dll

4. **Middleware Pattern**
    - Authentication (auth)
    - Role checking (role middleware)
    - Permission checking

---

## 2. Technology Stack Layers

### Layer Diagram

```mermaid
graph TB
    subgraph "Presentation Layer"
        A1[React 19]
        A2[TypeScript]
        A3[TailwindCSS 4.0]
        A4[Radix UI]
        A5[Sonner Toasts]
    end

    subgraph "Client-Server Bridge"
        B1[Inertia.js]
        B2[Vite]
    end

    subgraph "Application Layer"
        C1[Laravel 12]
        C2[Controllers]
        C3[Middleware]
        C4[Form Requests]
    end

    subgraph "Domain Layer"
        D1[Eloquent Models]
        D2[Business Logic]
        D3[Services]
    end

    subgraph "Infrastructure Layer"
        E1[Laravel Fortify]
        E2[Queue System]
        E3[Cache]
        E4[File Storage]
    end

    subgraph "Data Layer"
        F1[(SQLite)]
        F2[Migrations]
        F3[Seeders]
    end

    A1 --> B1
    A2 --> B1
    A3 --> A1
    A4 --> A1
    B1 --> C1
    B2 --> A1
    C1 --> D1
    C2 --> D2
    C3 --> C2
    D1 --> E1
    D2 --> E2
    D1 --> F1
    E4 --> F1
```

### Stack Components

| Layer                  | Technology      | Purpose                        |
| ---------------------- | --------------- | ------------------------------ |
| **Frontend Framework** | React 19        | UI rendering & interactivity   |
| **Type Safety**        | TypeScript 5.7  | Static typing                  |
| **Styling**            | TailwindCSS 4.0 | Utility-first CSS              |
| **UI Components**      | Radix UI        | Headless accessible components |
| **Charts**             | Recharts 3.6    | Data visualization             |
| **Notifications**      | Sonner          | Toast notifications            |
| **Build Tool**         | Vite 7          | Fast development & build       |
| **SPA Adapter**        | Inertia.js 2.1  | Server-side routing for React  |
| **Backend Framework**  | Laravel 12      | PHP framework                  |
| **Authentication**     | Laravel Fortify | Auth scaffolding               |
| **ORM**                | Eloquent        | Database abstraction           |
| **Database**           | SQLite          | Embedded database              |
| **Task Queue**         | Laravel Queue   | Async job processing           |
| **Email**              | SMTP            | Email delivery                 |

---

## 3. Request-Response Flow

### Traditional Page Request (Inertia)

```mermaid
sequenceDiagram
    participant Browser
    participant Vite
    participant InertiaClient
    participant Laravel
    participant InertiaServer
    participant Controller
    participant Model
    participant Database

    Browser->>Vite: Request /assets
    Vite->>InertiaClient: Load React App
    InertiaClient->>Laravel: HTTP GET /assets<br/>X-Inertia: true
    Laravel->>InertiaServer: Process Request
    InertiaServer->>Controller: AssetController@index
    Controller->>Model: Asset::all()
    Model->>Database: SELECT * FROM assets
    Database-->>Model: Results
    Model-->>Controller: Collection
    Controller->>InertiaServer: Inertia::render('assets', $props)
    InertiaServer-->>InertiaClient: JSON Response<br/>{component, props, url}
    InertiaClient->>Browser: Render React Component
    Browser-->>Browser: Display Page
```

### Form Submission (Inertia)

```mermaid
sequenceDiagram
    participant User
    participant React
    participant InertiaClient
    participant Laravel
    participant Controller
    participant Validation
    participant Model
    participant Database
    participant Queue

    User->>React: Fill & Submit Form
    React->>InertiaClient: router.post('/assets', formData)
    InertiaClient->>Laravel: HTTP POST /assets<br/>X-Inertia: true
    Laravel->>Controller: AssetController@store
    Controller->>Validation: Validate Form Request

    alt Validation Failed
        Validation-->>InertiaClient: 422 Errors
        InertiaClient-->>React: Show Errors
    else Validation Passed
        Validation->>Controller: Continue
        Controller->>Model: Asset::create($data)
        Model->>Database: INSERT INTO assets
        Database-->>Model: Success
        Model-->>Controller: Asset Instance
        Controller->>Queue: Dispatch Notification Job
        Controller-->>InertiaClient: 302 Redirect + Flash
        InertiaClient->>Laravel: GET /assets (follow redirect)
        Laravel-->>InertiaClient: Updated Page
        InertiaClient-->>React: Render
        React-->>User: Show Success + Data
    end
```

### API Request Flow (if applicable)

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Middleware
    participant Controller
    participant Service
    participant Model
    participant Database

    Client->>API: HTTP Request<br/>Authorization: Bearer token
    API->>Middleware: auth:sanctum
    Middleware->>Middleware: Validate Token

    alt Invalid Token
        Middleware-->>Client: 401 Unauthorized
    else Valid Token
        Middleware->>Controller: Continue
        Controller->>Service: Business Logic
        Service->>Model: Query Data
        Model->>Database: SQL Query
        Database-->>Model: Results
        Model-->>Service: Data
        Service-->>Controller: Processed Data
        Controller-->>Client: JSON Response
    end
```

---

## 4. Component Architecture

### Frontend Component Hierarchy

```
App Root (Inertia)
│
├── Layouts
│   ├── AppLayout
│   │   ├── Navbar
│   │   ├── Sidebar (if exists)
│   │   └── Footer
│   └── GuestLayout
│
├── Pages (Inertia Pages)
│   ├── Welcome
│   ├── Dashboard
│   ├── Assets
│   │   └── uses: AssetTable, AssetDialog
│   ├── Clients
│   │   └── uses: ClientTable, ClientDialog
│   ├── Users
│   │   └── uses: UserTable, UserDialog
│   ├── Roles
│   └── Permissions
│
└── Components (Reusable)
    ├── UI (shadcn/ui)
    │   ├── Button
    │   ├── Dialog
    │   ├── Input
    │   ├── Select
    │   ├── Table
    │   └── Toast (Sonner)
    │
    ├── Domain Specific
    │   ├── AssetTable
    │   ├── AssetDialog
    │   ├── ClientTable
    │   ├── ClientDialog
    │   ├── SearchBar
    │   └── FilterSidebar
    │
    └── Charts
        ├── BarChart
        ├── PieChart
        └── LineChart
```

### Backend Component Hierarchy

```
Laravel Application
│
├── Routes
│   ├── web.php (main routes)
│   └── settings.php
│
├── Middleware
│   ├── Authenticate
│   ├── RoleMiddleware
│   └── HandleInertiaRequests
│
├── Controllers
│   ├── AssetController
│   ├── ClientController
│   ├── UserController
│   ├── RoleController
│   ├── PermissionController
│   └── Auth/OtpLoginController
│
├── Models (Eloquent)
│   ├── User
│   ├── Asset
│   ├── Client
│   ├── Role
│   ├── Permission
│   └── Wilayah
│
├── Requests (Form Validation)
│   ├── StoreAssetRequest
│   ├── UpdateAssetRequest
│   └── ...
│
└── Jobs (Queue)
    └── SendOtpEmail
```

---

## 5. Data Flow

### Asset Creation Data Flow

```mermaid
graph LR
    A[User Input Form] --> B[React Component]
    B --> C[Form Validation<br/>Client-side]
    C --> D{Valid?}
    D -->|No| E[Show Errors]
    E --> A
    D -->|Yes| F[Inertia POST]
    F --> G[Laravel Controller]
    G --> H[Form Request<br/>Validation]
    H --> I{Valid?}
    I -->|No| J[Return 422 Errors]
    J --> B
    I -->|Yes| K[Process File Upload]
    K --> L[Convert to Binary]
    L --> M[Eloquent Model]
    M --> N[SQLite Database<br/>BLOB Storage]
    N --> O[Return Response]
    O --> P[Inertia Redirect]
    P --> Q[Refresh Page]
    Q --> R[Show Success Toast]
```

### Authentication Data Flow (OTP)

```mermaid
graph TB
    A[User Enter Email] --> B[Request OTP]
    B --> C[Backend Validate Email]
    C --> D[Generate OTP<br/>6 digits]
    D --> E[Store in DB<br/>with expiry]
    E --> F[Queue Email Job]
    F --> G[Worker Process Job]
    G --> H[Send Email via SMTP]
    H --> I[User Receive OTP]
    I --> J[User Enter OTP]
    J --> K[Backend Verify]
    K --> L{Valid & Not Expired?}
    L -->|No| M[Error: Invalid OTP]
    L -->|Yes| N[Mark as Verified]
    N --> O{User Exists?}
    O -->|No| P[Create User]
    O -->|Yes| Q[Get User]
    P --> R[Login User]
    Q --> R
    R --> S[Create Session]
    S --> T[Redirect Dashboard]
```

### Permission Check Data Flow

```mermaid
graph TB
    A[User Request] --> B[Auth Middleware]
    B --> C{Authenticated?}
    C -->|No| D[Redirect Login]
    C -->|Yes| E[Role Middleware]
    E --> F[Load User Roles]
    F --> G[Query role_user table]
    G --> H{Has Required Role?}
    H -->|No| I[403 Forbidden]
    H -->|Yes| J[Load Permissions]
    J --> K[Query permission_role]
    K --> L{Has Required Permission?}
    L -->|No| I
    L -->|Yes| M[Allow Access]
    M --> N[Execute Controller]
```

---

## 6. Authentication Architecture

### OTP Authentication System

```mermaid
graph TB
    subgraph "Client Side"
        A[Login Form]
        B[OTP Verification Form]
    end

    subgraph "Laravel Backend"
        C[OtpLoginController]
        D[LoginOtp Model]
        E[User Model]
    end

    subgraph "Queue System"
        F[SendOtpEmail Job]
        G[Queue Worker]
    end

    subgraph "External"
        H[SMTP Server]
        I[User's Email]
    end

    subgraph "Database"
        J[(login_otps table)]
        K[(users table)]
    end

    A -->|email| C
    C --> D
    D --> J
    C --> F
    F --> G
    G --> H
    H --> I
    I -->|OTP Code| B
    B -->|email + code| C
    C --> D
    D --> J
    C --> E
    E --> K
```

### Session Management

```mermaid
graph LR
    A[User Login] --> B[Create Session]
    B --> C[Store in sessions table]
    C --> D[Set Cookie]
    D --> E[Subsequent Requests]
    E --> F[Validate Session]
    F --> G{Valid?}
    G -->|Yes| H[Continue]
    G -->|No| I[Redirect Login]
    H --> J[Controller Action]
```

---

## 7. File Storage Architecture

### Binary Storage in Database

```mermaid
graph TB
    subgraph "Upload Process"
        A[User Select File] --> B[Browser Read File]
        B --> C[FormData or Base64]
        C --> D[POST to Laravel]
        D --> E[File Validation]
        E --> F{Valid?}
        F -->|No| G[Return Error]
        F -->|Yes| H[Read File Content]
        H --> I[Convert to Binary]
    end

    subgraph "Storage"
        I --> J[Eloquent Model]
        J --> K[(SQLite BLOB Column)]
        K --> L[file_content LONGBLOB]
        K --> M[proposal_content LONGBLOB]
    end

    subgraph "Metadata"
        J --> N[file_name VARCHAR]
        J --> O[file_mime VARCHAR]
        J --> P[file_size BIGINT]
    end

    subgraph "Download Process"
        Q[User Click Download] --> R[GET /download]
        R --> S[Query Database]
        S --> K
        K --> T[Retrieve BLOB]
        T --> U[Stream to Browser]
        U --> V[Browser Download]
    end
```

### Storage Schema

```
assets table:
├── file_content      (LONGBLOB)    - Binary file content
├── file_name         (VARCHAR)     - Original filename
├── file_mime         (VARCHAR)     - MIME type (application/pdf)
├── file_size         (BIGINT)      - File size in bytes
├── proposal_content  (LONGBLOB)    - Binary proposal content
├── proposal_name     (VARCHAR)     - Proposal filename
├── proposal_mime     (VARCHAR)     - Proposal MIME type
└── proposal_size     (BIGINT)      - Proposal size in bytes
```

**Advantages:**

- ✅ Single backup (database backup includes files)
- ✅ ACID compliance
- ✅ Atomic operations
- ✅ No filesystem permission issues
- ✅ Easy deployment

**Considerations:**

- ⚠️ Database size grows with files
- ⚠️ Regular VACUUM needed for SQLite
- ⚠️ Max file size: 200MB

---

## 8. Deployment Architecture

### Development Environment

```mermaid
graph TB
    subgraph "Developer Machine"
        A[Code Editor]
        B[Git]
        C[Composer]
        D[NPM]
        E[PHP CLI]
        F[Node.js]
    end

    subgraph "Local Services"
        G[Laravel Server<br/>php artisan serve]
        H[Queue Worker<br/>php artisan queue:listen]
        I[Vite Dev Server<br/>npm run dev]
        J[SQLite Database<br/>database.sqlite]
    end

    A --> B
    B --> C
    C --> E
    D --> F
    E --> G
    E --> H
    F --> I
    G --> J
    H --> J
```

### Production Environment (Example)

```mermaid
graph TB
    subgraph "Web Server"
        A[Nginx/Apache]
        B[PHP-FPM]
        C[Laravel Application]
    end

    subgraph "Background Services"
        D[Supervisor]
        E[Queue Worker 1]
        F[Queue Worker 2]
    end

    subgraph "Data Storage"
        G[(SQLite Database)]
        H[Storage Directory]
        I[Cache]
    end

    subgraph "External Services"
        J[SMTP Server]
        K[Monitoring]
    end

    A --> B
    B --> C
    C --> G
    C --> H
    C --> I
    D --> E
    D --> F
    E --> J
    F --> J
    C --> J
    K --> C
```

### Deployment Checklist

**Environment Configuration:**

```bash
# Production .env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://repository.lpem.org

# Cache optimization
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Build assets
npm run build
```

**Web Server Configuration (Nginx Example):**

```nginx
server {
    listen 80;
    server_name repository.lpem.org;
    root /var/www/inventory-app/public;

    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
    }

    client_max_body_size 210M;
}
```

**Supervisor Configuration (Queue Worker):**

```ini
[program:inventory-queue]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/inventory-app/artisan queue:work --tries=3
autostart=true
autorestart=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/inventory-app/storage/logs/queue.log
```

---

## Security Architecture

### Security Layers

```mermaid
graph TB
    A[User Request] --> B[HTTPS/TLS]
    B --> C[Web Server]
    C --> D[Rate Limiting]
    D --> E[CSRF Protection]
    E --> F[Authentication]
    F --> G[Authorization<br/>Role/Permission]
    G --> H[Input Validation]
    H --> I[SQL Injection Protection<br/>Eloquent ORM]
    I --> J[XSS Protection]
    J --> K[Controller Logic]
```

### Security Features

| Layer                | Implementation        | Protection                 |
| -------------------- | --------------------- | -------------------------- |
| **Transport**        | HTTPS/TLS             | Data encryption in transit |
| **Authentication**   | Laravel Fortify + OTP | Secure login               |
| **Session**          | Encrypted cookies     | Session hijacking          |
| **CSRF**             | Token validation      | Cross-site request forgery |
| **XSS**              | React escaping        | Cross-site scripting       |
| **SQL Injection**    | Eloquent ORM          | Parameterized queries      |
| **Authorization**    | Role/Permission       | Unauthorized access        |
| **Rate Limiting**    | Throttle middleware   | Brute force attacks        |
| **Input Validation** | Form Requests         | Malicious input            |

---

## Monitoring & Logging

### Log Structure

```
storage/logs/
├── laravel.log          # Main application log
├── queue.log            # Queue worker log
└── custom/
    ├── auth.log         # Authentication events
    ├── asset.log        # Asset operations
    └── error.log        # Error tracking
```

### Monitoring Points

```mermaid
graph LR
    A[Application] --> B[Laravel Log]
    A --> C[Database Queries]
    A --> D[Queue Jobs]
    A --> E[HTTP Requests]

    B --> F[Log Viewer]
    C --> G[Query Performance]
    D --> H[Job Status]
    E --> I[Response Time]

    F --> J[Alerts]
    G --> J
    H --> J
    I --> J
```

---

## Performance Optimization

### Caching Strategy

```mermaid
graph TB
    A[Request] --> B{Cache Hit?}
    B -->|Yes| C[Return Cached]
    B -->|No| D[Query Database]
    D --> E[Process Data]
    E --> F[Store in Cache]
    F --> G[Return Response]
    C --> H[Fast Response]
    G --> I[Normal Response]
```

### Optimization Techniques

1. **Database Optimization**
    - Proper indexing
    - Query optimization
    - VACUUM for SQLite

2. **Application Optimization**
    - Config caching
    - Route caching
    - View caching
    - Eager loading (avoid N+1)

3. **Asset Optimization**
    - Vite code splitting
    - Image optimization
    - CSS/JS minification

4. **Server Optimization**
    - OPcache enabled
    - PHP-FPM tuning
    - Gzip compression

---

**Last Updated:** 14 Februari 2026  
**Version:** 1.0.0
