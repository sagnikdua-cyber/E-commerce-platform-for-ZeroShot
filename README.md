# ShopNexus E-Commerce Platform

A robust, full-stack E-Commerce platform built with React, Node.js, Express, and MongoDB. The system features a public customer storefront and a protected admin catalog dashboard with live, dynamic, database-driven filtering, sorting, and image uploading.

## Project Architecture
- **Frontend (Client)**: React (Vite), Tailwind CSS, React Router.
- **Backend (Server)**: Node.js, Express, Mongoose.
- **Database**: MongoDB Atlas.
- **Image Storage**: Cloudinary (for persistent catalog image uploads).
- **Architecture Flow**: `React -> Express API -> MongoDB`. The frontend utilizes the backend API exclusively (no mock data).

## Local Development Setup

### 1. Database Setup
Create a free MongoDB Atlas cluster and acquire the connection string (URI).

### 2. Image Storage Setup
Create a free Cloudinary account and acquire your Cloud Name, API Key, and API Secret.

### 3. Local Environment Variables
Create a `.env` file in the `server` directory with:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_string
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD_HASH=your_bcrypt_hash
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create a `.env` file in the `client` directory with:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Running Locally
Terminal 1 (Backend):
```bash
cd server
npm install
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm install
npm run dev
```

### 5. Owner Login Setup
Navigate to `http://localhost:5173/admin/login` and log in using the `ADMIN_EMAIL` and the plaintext version of the password you hashed for `ADMIN_PASSWORD_HASH`.

---

## Production Deployment (Vercel)

This repository is pre-configured for Vercel deployment with serverless MongoDB connection pooling and React SPA routing via `vercel.json`.

1. Import the repository into Vercel.
2. The `vercel.json` file will automatically configure the monorepo builds for you.
3. Configure the following Environment Variables in the Vercel Dashboard BEFORE deploying:

### Vercel Environment Variables

**Frontend Variables:**
- `VITE_API_URL`: `/api` (This relative path ensures CORS compatibility on the same domain).

**Backend Variables:**
- `MONGO_URI`: Your production MongoDB connection string.
- `JWT_SECRET`: A secure, randomly generated string.
- `ADMIN_EMAIL`: The admin login email.
- `ADMIN_PASSWORD_HASH`: The bcrypt hash of the admin password.
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name.
- `CLOUDINARY_API_KEY`: Cloudinary API key.
- `CLOUDINARY_API_SECRET`: Cloudinary API secret.

**Note:** Do not include `PORT`; Vercel dynamically assigns it.

Once the environment variables are set, Vercel will build both the frontend and backend, serving them securely on a unified domain!
