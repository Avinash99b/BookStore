# 📱 Bookstore Frontend

This is the React Native (Expo) frontend for the Multi-Seller Bookstore App.

---

## 🚀 Features
- Buyer and seller flows (storefront, cart, orders, seller dashboard)
- Authentication (login/register)
- Connects to backend REST API
- Modern UI with Expo Router

---

## 🛠️ Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the app:**
   ```bash
   npx expo start
   ```
   - Use the QR code to open in Expo Go, or run on an emulator/simulator.

---

## 🌐 Backend API
- The app expects the backend API to be running (see `../backend/README.md`).
- Update API URLs in `src/api/api.ts` if your backend is not running on the default address.

---

## 🧩 Environment Variables
- No environment variables are required by default.
- See `.env.example` for future use.

---

## 🗄️ Project Structure
```
app/         # App entry and navigation
assets/      # Images and static assets
src/
  api/       # API calls
  components/# Reusable UI components
  context/   # Auth context
  navigation/# Navigation stacks
  screens/   # App screens
  utils/     # Helpers
```

---

## 🧑‍💻 Development
- Uses TypeScript
- File-based routing with Expo Router
- Edit screens/components in `src/`

---

## 🤝 Contributing
1. Fork the repo & create a feature branch
2. Make your changes (with clear commits)
3. Ensure code is linted and tested
4. Open a pull request

---

## 📝 License
MIT
