# 📚 Multi-Seller Bookstore App

A monorepo project for a **multi-seller bookstore app** with a React Native frontend, Node.js/Express backend, and PostgreSQL database (hosted on Supabase).

---

## 🏗️ Project Structure

```
.
├── backend   # Node.js + Express.js server (see backend/README.md)
└── frontend  # React Native app (see frontend/README.md)
```

---

## 🚀 Tech Stack

- **Frontend:** React Native (Expo)
- **Backend:** Node.js + Express.js
- **Database:** PostgreSQL (Supabase)
- **Authentication:** JWT

---

## 🛠️ Getting Started

### 1. Clone the repository

### 2. Setup the backend

See [backend/README.md](./backend/README.md) for full instructions.

### 3. Setup the frontend

See [frontend/README.md](./frontend/README.md) for full instructions.

---

## 🧩 Environment Variables

- Backend: see `backend/.env.example`
- Frontend: see `frontend/.env.example`

---

## 📖 API Documentation

- OpenAPI spec: [`backend/swagger.yaml`](./backend/swagger.yaml)
- View with [Swagger Editor](https://editor.swagger.io/)

---

## 🤝 Contributing

1. Fork the repo & create a feature branch
2. Make your changes (with clear commits)
3. Ensure code is linted and tested
4. Open a pull request

---

## 📝 License

MIT

---

## 🧩 Features Overview

### Buyer Side (Storefront)

- Storefront Page: Scrollable feed of books with cover image, title, price, and seller name.
- Product Page: Book details with image, title, description, price, and `Add to Cart` button.
- Cart Page: Displays selected books with quantity, price, and total.

### Seller Side (Seller Panel)

- Book Listing: Add and manage books (title, description, price, stock, image).
- Sales Dashboard: View orders with buyer info, product, and status.
- Order Management: Update order status (Pending → Shipped).

### Backend APIs

- Auth: Register, Login (JWT based).
- Product Management: CRUD for books.
- Cart Management: Add/remove/view cart items.
- Order Management: Place orders, view orders, update status.

---

## 🗄️ Database Schema

See backend documentation and Supabase setup for details.
