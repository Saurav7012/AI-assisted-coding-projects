# MERN Google OAuth Authentication

A beginner-friendly full-stack app with Google OAuth 2.0 sign-in, session-based auth, and a clean React + DaisyUI interface.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React, JavaScript, TailwindCSS, DaisyUI, React Router, Axios |
| Backend | Node.js, Express.js, MongoDB (Mongoose) |
| Auth | Passport.js (`passport-google-oauth20`), `express-session` |

## Project Structure

```
mern-google-auth/
├── client/          # React frontend (Vite)
├── server/          # Express backend
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (or local MongoDB)
- [Google Cloud Console](https://console.cloud.google.com/) account

---

## 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or select an existing one).
3. Open **APIs & Services → OAuth consent screen**.
   - Choose **External** user type.
   - Fill in the app name, support email, and developer contact.
   - Add scopes: `email` and `profile`.
   - Add yourself as a **Test user** while the app is in testing mode.
4. Open **APIs & Services → Credentials**.
5. Click **Create Credentials → OAuth client ID**.
6. Choose **Web application**.
7. Set **Authorized JavaScript origins**:
   - `http://localhost:5173`
   - `http://localhost:5000`
8. Set **Authorized redirect URIs**:
   - `http://localhost:5000/auth/google/callback`
9. Click **Create** and copy the **Client ID** and **Client Secret**.

---

## 2. MongoDB Setup

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a database user and allow network access (for development, `0.0.0.0/0` is fine).
3. Copy your connection string. It looks like:

```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/mern-google-auth?retryWrites=true&w=majority
```

---

## 3. Environment Variables

Create `server/.env` from the example file:

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```env
MONGODB_URI=your_mongodb_connection_uri
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=any_random_secret_string
CLIENT_URL=http://localhost:5173
PORT=5000
```

Replace the placeholder values with your real credentials.

---

## 4. Install Dependencies

Open two terminals from the project root.

**Backend:**

```bash
cd server
npm install
```

**Frontend:**

```bash
cd client
npm install
```

---

## 5. Run the Project

**Terminal 1 — start the backend:**

```bash
cd server
npm run dev
```

Server runs at `http://localhost:5000`.

**Terminal 2 — start the frontend:**

```bash
cd client
npm run dev
```

Frontend runs at `http://localhost:5173`.

Open `http://localhost:5173` in your browser.

---

## Auth Flow

1. User clicks **Sign in with Google** on the Login page.
2. Browser navigates to `GET /auth/google` on the backend.
3. Google shows the consent screen.
4. After approval, Google redirects to `GET /auth/google/callback`.
5. Passport finds or creates the user in MongoDB and creates a session.
6. User is redirected to the Profile page (`http://localhost:5173/profile`).
7. Profile page calls `GET /auth/me` to load user details.
8. **Logout** calls `GET /auth/logout`, destroys the session, and returns to Login.

---

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/auth/google` | Start Google OAuth login |
| GET | `/auth/google/callback` | Google OAuth callback |
| GET | `/auth/me` | Return logged-in user (protected) |
| GET | `/auth/logout` | Destroy session and log out |

---

## Troubleshooting

**Redirect URI mismatch**  
Make sure the redirect URI in Google Cloud Console exactly matches:
`http://localhost:5000/auth/google/callback`

**Session / cookie issues**  
Ensure `CLIENT_URL` in `.env` is `http://localhost:5173` and that API requests use `withCredentials: true` (already configured in the client).

**MongoDB connection failed**  
Check your connection string, database user password, and IP whitelist in Atlas.

**403 / access blocked on Google login**  
Add your Google account as a test user on the OAuth consent screen while the app is in testing mode.

---

## License

MIT
