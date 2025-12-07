# 🚀 Anvaya CRM (Full‑Stack Project)

A complete **Customer Relationship Management (CRM)** system built using:

- **React + Axios + Bootstrap** (Frontend)
- **Node.js + Express + MongoDB (Mongoose)** (Backend)
- **REST API with CRUD operations**
- **Role‑based management for Leads & Sales Agents**
- **Analytics Dashboard + Reporting Charts (Chart.js)**

Live Backend API:  
🔗 [Live Demo] (https://anvaya-crm-backend-001.vercel.app/)

---

## 🧩 Features

| Category            | Included                                            |
| ------------------- | --------------------------------------------------- |
| 🧑‍💼 Lead Management  | ✔ Create, view, update, delete leads                |
| 🎯 Status Tracking  | ✔ Status filters (New, Qualified, Proposal, Closed) |
| 🏷 Tags & Priority   | ✔ Add multiple tags & priority (Low/Medium/High)    |
| 👥 Agent Assignment | ✔ Assign leads to agents                            |
| 💬 Comments System  | ✔ Add time‑stamped comments on each lead            |
| 📊 Analytics        | ✔ Pipeline charts + closed‑lead summary             |
| 🔍 Smart Filters    | ✔ Filter by status, priority, tags, source          |
| 📱 Responsive UI    | ✔ Works on mobile, tablets, and desktop             |

---

## 🛠 Tech Stack

### Frontend

- React (Vite)
- Axios
- Bootstrap
- React Router
- Chart.js (Reports)

### Backend

- Node.js
- Express
- MongoDB + Mongoose
- REST API architecture
- CORS, Validation, Sanitization

### Deployment

| Layer    | Platform                  |
| -------- | ------------------------- |
| Frontend | Vercel / Netlify          |
| Backend  | Vercel / Render / Railway |
| Database | MongoDB Atlas             |

---

## 📦 Project Setup

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/Abdul-Kalam0/Anvaya-CRM-Frontend.git
cd Anvaya-CRM-Frontend
```

---

### 2️⃣ Backend Setup

```sh
cd backend
npm install
```

Create `.env`:

```
PORT=3000
MONGO_URI=your_mongodb_connection
```

Run server:

```sh
npm run dev
```

---

### 3️⃣ Frontend Setup

```sh
cd client
npm install
npm run dev
```

---

## 📡 API Endpoints

| Method | Route                 | Description         |
| ------ | --------------------- | ------------------- |
| POST   | `/leads`              | Create lead         |
| GET    | `/leads`              | Get all leads       |
| GET    | `/leads/:id`          | Get lead by ID      |
| PUT    | `/leads/:id`          | Update lead         |
| DELETE | `/leads/:id`          | Delete lead         |
| POST   | `/agents`             | Create agent        |
| GET    | `/agents`             | List agents         |
| POST   | `/leads/:id/comments` | Add comment         |
| GET    | `/report/...`         | Analytics reporting |

---

## 🔧 Folder Structure

```
📦 Anvaya‑CRM
 ┣ 📁 backend
 ┃ ┣ 📁 models
 ┃ ┣ 📁 routes
 ┃ ┣ 📁 controllers
 ┃ ┣ server.js
 ┃ ┗ config/db.js
 ┣ 📁 frontend
 ┃ ┣ 📁 components
 ┃ ┣ App.jsx
 ┃ ┗ utils/api.js
 ┗ README.md
```

---

## 🤝 Contributing

1. Fork repo
2. Create new feature branch:
   ```sh
   git checkout -b feature-name
   ```
3. Push and create Pull Request

---

## 🚧 Future Roadmap

- ☐ Add Authentication (Admin/Agent roles)
- ☐ Export reports (PDF / CSV)
- ☐ Notifications & Email reminders
- ☐ Dark Mode

---

## 📄 License

MIT License — Free to use & customize.

---

### ⭐ If you like this project, consider giving a **GitHub Star**!

Made with ❤️ by Abdul Kalam
