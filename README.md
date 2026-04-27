# 🏘️ RentalApp API

Backend REST API untuk sistem peminjaman fasilitas warga RT, dibangun dengan **Express.js**, **Prisma ORM**, dan **PostgreSQL**.

---

## 📋 Deskripsi

RentalApp API adalah layanan backend yang mengelola seluruh proses peminjaman barang/fasilitas milik RT. Sistem ini mendukung dua peran pengguna:

- **RT** — Admin yang mengelola data warga, barang, dan persetujuan peminjaman
- **WARGA** — Anggota yang dapat mengajukan peminjaman fasilitas

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Runtime | Node.js + TypeScript |
| Framework | Express.js v5 |
| ORM | Prisma v6 |
| Database | PostgreSQL (Supabase) |
| Auth | JWT + bcrypt |
| Security | Helmet, express-rate-limit, CORS |
| Logging | Winston |
| File Upload | Multer + Cloudinary |
| PDF | PDFKit |
| WhatsApp | whatsapp-web.js |
| Testing | Jest + Supertest |

---

## 📁 Struktur Proyek

```
RentalApp-API/
├── prisma/
│   ├── schema.prisma       # Definisi model database
│   ├── seed.ts             # Data awal (seeding)
│   └── migrations/         # Riwayat migrasi database
├── src/
│   ├── config/             # Konfigurasi Prisma client
│   ├── controllers/        # Handler request HTTP
│   ├── service/            # Business logic
│   ├── repositories/       # Query database
│   ├── routers/            # Definisi route API
│   ├── middleware/         # Auth & role middleware
│   ├── utils/              # Helper (PDF, WhatsApp)
│   ├── types/              # TypeScript types
│   ├── app.ts              # Setup Express app
│   └── index.ts            # Entry point server
└── __test__/               # Unit & integration tests
```

---

## 🗃️ Model Database

| Model | Deskripsi |
|-------|-----------|
| `User` | Akun login (RT & Warga) |
| `Warga` | Data kependudukan warga |
| `Barang` | Inventaris barang/fasilitas RT |
| `Peminjaman` | Transaksi peminjaman barang |
| `Kerusakan` | Laporan kerusakan & denda |

---

## 🚀 Cara Menjalankan

### 1. Clone & Install

```bash
git clone https://github.com/AmrEmirate/RentalApp-API.git
cd RentalApp-API
npm install
```

### 2. Setup Environment

Buat file `.env` di root project:

```env
# Database (Supabase / PostgreSQL)
DATABASE_URL="postgresql://user:password@host:5432/dbname?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/dbname"

# JWT
JWT_SECRET="your_jwt_secret_key"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV=development

# Cloudinary (Upload Foto)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

### 3. Migrasi & Seeding Database

```bash
# Jalankan migrasi
npx prisma migrate deploy

# Seed data awal
npm run seed
```

### 4. Jalankan Server

```bash
# Mode development (auto-reload)
npm run dev

# Mode production
npm start
```

Server berjalan di `http://localhost:5000`

---

## 🔑 Default Login (Setelah Seeding)

| Role | Username | Password |
|------|----------|----------|
| RT | `rt@rentalapp.com` | `password123` |
| Warga | `08123456789` | `password123` |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/api/auth/login` | Login pengguna |
| `POST` | `/api/auth/logout` | Logout |
| `GET` | `/api/auth/me` | Data pengguna aktif |

### Barang (Fasilitas)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/barang` | Daftar semua barang |
| `GET` | `/api/barang/:id` | Detail barang |
| `POST` | `/api/barang` | Tambah barang *(RT only)* |
| `PUT` | `/api/barang/:id` | Edit barang *(RT only)* |
| `DELETE` | `/api/barang/:id` | Hapus barang *(RT only)* |

### Peminjaman
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/peminjaman` | Daftar peminjaman |
| `POST` | `/api/peminjaman` | Ajukan peminjaman *(Warga)* |
| `PATCH` | `/api/peminjaman/:id/status` | Update status *(RT only)* |
| `GET` | `/api/peminjaman/riwayat` | Riwayat peminjaman saya |

### Warga
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/warga` | Daftar warga *(RT only)* |
| `POST` | `/api/warga` | Tambah warga *(RT only)* |
| `PUT` | `/api/warga/:id` | Edit warga *(RT only)* |
| `DELETE` | `/api/warga/:id` | Hapus warga *(RT only)* |

### Dashboard
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/dashboard` | Statistik & ringkasan data |

---

## 🧪 Menjalankan Tests

```bash
npm test
```

---

## 📄 Scripts

| Command | Deskripsi |
|---------|-----------|
| `npm run dev` | Jalankan server development |
| `npm start` | Jalankan server production |
| `npm run build` | Compile TypeScript |
| `npm run seed` | Seed database |
| `npm test` | Jalankan unit tests |

---

## 🔐 Keamanan

- JWT Authentication pada semua endpoint terproteksi
- Role-based access control (RT vs WARGA)
- Rate limiting untuk mencegah brute force
- Helmet untuk HTTP security headers
- Input validation dengan express-validator
- Password di-hash dengan bcrypt

---

## 🔗 Frontend

Frontend tersedia di: [RentalApp](https://github.com/AmrEmirate/RentalApp)

---

## 👤 Author

**Amar** — [GitHub](https://github.com/AmrEmirate)
