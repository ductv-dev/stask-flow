Testing Login (manual)

1. Start the backend:

```bash
cd apps/taskflow-backend
pnpm install
pnpm dev
```

2. Start the web app:

```bash
cd apps/web
pnpm install
pnpm dev
```

3. Create a test user:

```bash
curl -X POST http://localhost:8000/api/auth/register -H "Content-Type: application/json" -d '{"fullName":"Test User","email":"test@example.com","password":"password123"}'
```

4. Open http://localhost:3000/auth/login and sign in with the test user.

Notes:
- On successful login you'll be redirected to `/dashboard` and the server will set an `access_token` httpOnly cookie.
- If login fails, check the backend logs and the response message returned by the register/login endpoints.
