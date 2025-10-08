# ChatApp Backend

Backend API untuk aplikasi chat real-time menggunakan Node.js, Express, Socket.io, dan MySQL.

## Setup & Instalasi

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Setup Database
- Buat database MySQL dengan menjalankan file `database/schema.sql`
- Atau jalankan manual di MySQL:
```bash
mysql -u root -p < database/schema.sql
```

### 3. Konfigurasi Environment
- Copy file `.env.example` menjadi `.env`
- Edit file `.env` dengan konfigurasi Anda:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=chatapp_db
JWT_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:8080
```

### 4. Jalankan Server
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

Server akan berjalan di `http://localhost:5000`

## Struktur Folder

```
server/
├── config/
│   └── db.js              # Database connection
├── controllers/
│   ├── authController.js  # Authentication logic
│   ├── friendController.js # Friend management
│   └── messageController.js # Message handling
├── models/
│   ├── User.js            # User model
│   ├── Friend.js          # Friend model
│   └── Message.js         # Message model
├── routes/
│   ├── authRoutes.js      # Auth endpoints
│   ├── friendRoutes.js    # Friend endpoints
│   └── messageRoutes.js   # Message endpoints
├── middleware/
│   └── auth.js            # JWT authentication
├── database/
│   └── schema.sql         # Database schema
├── .env.example           # Environment template
├── package.json           # Dependencies
└── server.js              # Main entry point
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Friends
- `GET /api/friends` - Get semua teman
- `POST /api/friends/add` - Tambah teman
- `PUT /api/friends/accept/:friendId` - Terima permintaan teman
- `DELETE /api/friends/:friendId` - Hapus teman
- `GET /api/friends/requests` - Get pending requests

### Messages
- `GET /api/messages/:friendId` - Get percakapan dengan teman
- `POST /api/messages` - Kirim pesan
- `PUT /api/messages/:messageId/read` - Tandai dibaca
- `GET /api/messages/unread/count` - Get jumlah pesan belum dibaca
- `DELETE /api/messages/:messageId` - Hapus pesan

## Socket.io Events

### Client -> Server
- `authenticate` - Authenticate user dengan userId
- `sendMessage` - Kirim pesan real-time
- `typing` - Indikator sedang mengetik

### Server -> Client
- `message` - Pesan baru diterima
- `userOnline` - User online
- `userOffline` - User offline
- `typing` - User sedang mengetik
- `error` - Error notification

## Dependencies

### Production
- `express` - Web framework
- `socket.io` - Real-time WebSocket
- `mysql2` - MySQL driver
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `cors` - CORS middleware
- `dotenv` - Environment variables

### Development
- `nodemon` - Auto-restart server

## Database Schema

### Users Table
- id (Primary Key)
- username (Unique)
- email (Unique)
- password (Hashed)
- created_at
- updated_at

### Friends Table
- id (Primary Key)
- user_id (Foreign Key)
- friend_id (Foreign Key)
- status (pending/accepted/blocked)
- created_at

### Messages Table
- id (Primary Key)
- sender_id (Foreign Key)
- recipient_id (Foreign Key)
- content (Text)
- is_read (Boolean)
- created_at

## Security Features

- Password hashing dengan bcrypt
- JWT authentication
- Protected routes dengan middleware
- CORS configuration
- SQL injection prevention dengan prepared statements

## Notes

- Port default: 5000
- Socket.io CORS sudah dikonfigurasi untuk localhost:8080
- JWT token berlaku 7 hari
- Database connection pool untuk performa lebih baik
