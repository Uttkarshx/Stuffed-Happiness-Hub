# Deployment Checklist

## 1) Environment Variables

### Frontend (`.env.local`)

```
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
```

### Backend (`backend/.env`)

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
CORS_ORIGINS=https://your-frontend-domain.com
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
TWILIO_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
ADMIN_WHATSAPP_NUMBER=whatsapp:+91XXXXXXXXXX
```

## 2) Install Dependencies

### Frontend

```
pnpm install
```

### Backend

```
cd backend
npm install
```

## 3) Verify Build/Runtime

### Frontend (strict build)

```
pnpm build
```

### Backend

```
cd backend
npm run start
```

## 4) Product Data

This project currently has 37 products available through the backend API.
No product removal is required for deployment.

Optional re-seed (only if DB is empty):

```
cd backend
npm run seed
```

## 5) Local Dev Recovery (if lock/process issue)

```
npm run dev:reset
```

Then run frontend and backend in separate terminals:

```
npm run dev:frontend
npm run dev:backend
```
