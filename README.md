# GigFlow 🚀

GigFlow is a **full-stack freelance marketplace platform** built as part of a Full Stack Development Internship assignment.  
It allows users to post gigs, submit bids, and hire freelancers using secure authentication and atomic hiring logic.

---

## 📌 Project Overview

GigFlow simulates a real-world freelance marketplace where:

- **Clients** can post jobs (Gigs)
- **Freelancers** can browse gigs and submit proposals (Bids)
- Clients can review bids and **hire exactly one freelancer** per gig

The project focuses on:
- Secure authentication
- Role-based access control
- Complex database relationships
- State management
- Transaction-safe business logic

**Estimated Time:** 2–3 Days  
**Submission:** GitHub Repository + Hosted Link

---

## 🛠 Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS
- Redux Toolkit

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose

### Authentication
- JWT (JSON Web Tokens)
- HttpOnly Cookies

### Bonus
- MongoDB Transactions
- Socket.io (Real-time updates)

---

## ✨ Core Features

### 🔐 User Authentication
- Secure Sign-up & Login
- JWT-based authentication stored in HttpOnly cookies
- Role selection at registration (**Client / Freelancer**)

---

### 👥 Role-Based Access

**Clients**
- Post gigs
- View bids on their gigs
- Hire freelancers

**Freelancers**
- Browse open gigs
- Submit proposals with price & message
- Track bid status (Pending / Hired / Rejected)

UI elements are conditionally rendered based on user role.

---

## 📂 Gig Management (CRUD)

- Browse all **open gigs**
- Search gigs by title
- View detailed gig information
- Post new gigs with:
  - Title
  - Description
  - Budget

---

## 🤝 Hiring Logic (Crucial Feature)

1. A freelancer submits a **bid** (price + message)
2. The client reviews all bids on their gig
3. The client clicks **Hire** on one bid

### Hiring Rules
- Gig status changes from **open → assigned**
- Selected bid status becomes **hired**
- All other bids are automatically marked **rejected**

---

## 🔒 Transactional Integrity (Bonus)

- MongoDB transactions ensure atomic updates
- Prevents race conditions (multiple hires at same time)
- If a gig is already assigned, further hire attempts are blocked

---

## ⚡ Real-Time Updates (Bonus)

- Implemented using **Socket.io**
- Freelancers receive instant notification when hired:
  > "You have been hired for [Project Name]!"

---

## 🔗 API Architecture

### Auth
- `POST /api/auth/register` – Register a new user
- `POST /api/auth/login` – Login & set HttpOnly cookie

### Gigs
- `GET /api/gigs` – Fetch all open gigs (supports search)
- `POST /api/gigs` – Create a new gig (Client only)

### Bids
- `POST /api/bids` – Submit a bid (Freelancer only)
- `GET /api/bids/:gigId` – Fetch bids for a gig (Owner only)

### Hiring
- `PATCH /api/bids/:bidId/hire` – Hire freelancer (Atomic operation)

---

## 🗄 Database Schema

### User
- name
- email
- password
- role (client | freelancer)

### Gig
- title
- description
- budget
- ownerId
- status (open | assigned)

### Bid
- gigId
- freelancerId
- message
- price
- status (pending | hired | rejected)

---

## ⚙️ Local Setup

### Clone Repository
```bash
git clone https://github.com/Adityaagarwal12345/GIGFLOWW.git
cd GIGFLOWW

### Backend
cd server
npm install
npm run dev

Frontend
cd client
npm install
npm run dev

Frontend: http://localhost:5173
Backend: http://localhost:5000

<img width="1897" height="910" alt="image" src="https://github.com/user-attachments/assets/008f96de-08f0-471e-b515-b336e7012c7e" />

