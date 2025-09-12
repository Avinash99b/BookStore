# 📚 Multi-Seller Bookstore App

A monorepo project for a **multi-seller bookstore app** with a React Native frontend, Node.js/Express backend, and PostgreSQL database (hosted on Supabase).

---

## 🚀 Tech Stack

* **Frontend:** React Native
* **Backend:** Node.js + Express.js
* **Database:** PostgreSQL (Supabase)
* **Authentication:** JWT

---

## 📂 Project Structure

```
.
├── backend   # Node.js + Express.js server
└── frontend  # React Native app
```

---

## 🛒 Features

### Buyer Side (Storefront)

* **Storefront Page:** Scrollable feed of books with cover image, title, price, and seller name.
* **Product Page:** Book details with image, title, description, price, and `Add to Cart` button.
* **Cart Page:** Displays selected books with quantity, price, and total.

### Seller Side (Seller Panel)

* **Book Listing:** Add and manage books (title, description, price, stock, image).
* **Sales Dashboard:** View orders with buyer info, product, and status.
* **Order Management:** Update order status (Pending → Shipped).

### Backend APIs

* **Auth:** Register, Login (JWT based).
* **Product Management:** CRUD for books.
* **Cart Management:** Add/remove/view cart items.
* **Order Management:** Place orders, view orders, update status.

---

## 🗄️ Database Schema

**Tables:**

* **users**: `(id, name, email, password, role)`
* **books**: `(id, seller_id, title, description, price, stock, image_url)`
* **cart**: `(id, buyer_id, book_id, quantity)`
* **orders**: `(id, buyer_id, seller_id, book_id, status)`

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/Avinash99b/BookStore
cd multi-seller-bookstore
```

### 2. Backend Setup

```bash
cd backend
npm install
```

* Create a `.env` file in the **backend** folder:

```env
PORT=5000
DATABASE_URL=<your-supabase-postgres-url>
JWT_SECRET=<your-secret>
```

* Run server:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

* Create a `.env` file in the **frontend** folder:

```env
API_URL=http://localhost:5000
```

* Run app:

```bash
npm start
```

---

## 📖 API Endpoints

### Auth

* `POST /api/auth/register` → Register with **name, email, password**
* `POST /api/auth/login` → Login and get JWT token

### Books

* `POST /api/books` → Add new book *(Seller only)*
* `GET /api/books` → Get all books
* `GET /api/books/:id` → Get book by ID

### Cart

* `POST /api/cart` → Add to cart
* `GET /api/cart` → Get user cart
* `DELETE /api/cart/:id` → Remove item from cart

### Orders

* `POST /api/orders` → Place order
* `GET /api/orders/seller` → Seller's orders
* `PATCH /api/orders/:id` → Update order status

---

## 📝 Evaluation Criteria

* Clean code & folder structure
* React Native navigation & state management
* Proper API integration
* SQL schema design
* Clear documentation

---

## 👨‍💻 Author

Built with ❤️ by Avinash Bathula
