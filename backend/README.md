# 📚 Bookstore Backend

This is the backend for the Multi-Seller Bookstore App, built with Node.js, Express, and PostgreSQL (via Supabase).

---

## 🚀 Features
- JWT-based authentication (buyer/seller roles)
- Book CRUD (for sellers)
- Cart management (for buyers)
- Order placement and management
- RESTful API (OpenAPI docs via `swagger.yaml`)

---

## 🛠️ Setup

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in your values.
4. **Run the server:**
   ```bash
   npm run dev
   ```
   The server will start on the port specified in `.env` (default: 5000).

---

## 🧩 Environment Variables
See `.env.example` for all required variables:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_KEY` - Supabase service role key
- `JWT_SECRET` - Secret for JWT signing
- `JWT_EXPIRES_IN` - (optional) JWT expiry (default: 7d)
- `PORT` - (optional) Server port (default: 5000)

---

## 📖 API Documentation
- OpenAPI spec: [`swagger.yaml`](./swagger.yaml)
- View docs locally: Use [Swagger Editor](https://editor.swagger.io/) or similar tools

---

## 🗄️ Project Structure
```
src/
  components/      # Supabase client
  controllers/     # Route controllers
  middlewares/     # Express middlewares
  models/          # Data models
  routes/          # API routes
  types/           # TypeScript types
  app.ts           # Express app setup
  server.ts        # Entry point
```

---

## 🧑‍💻 Development
- Uses TypeScript
- Nodemon for hot-reloading (`npm run dev`)
- All API endpoints are prefixed with `/api`

---

## 🤝 Contributing
1. Fork the repo & create a feature branch
2. Make your changes (with clear commits)
3. Ensure code is linted and tested
4. Open a pull request

---

## 📝 License
MIT

