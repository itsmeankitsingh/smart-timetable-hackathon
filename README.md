# Smart Timetable Management System

A full-stack timetable generation and faculty leave management system for the Government Engineering College Madhubani, designed specifically for a hackathon.

## 🚀 Features

- **Automated Timetable Generation:** Easily generate schedules for different branches and semesters.
- **Faculty Leave Management:** A simple UI for faculty to request leaves for specific dates and time slots.
- **Auto-Substitute:** Automatically assigns substitute faculty based on department, expertise, and availability.
- **Dual Frontends (Showcase Focus):**
  - **Vanilla HTML Dashboard (Main):** An integrated, full-featured admin dashboard displaying stats, timetable generation controls, and faculty leave workflows.
  - **React Dashboard:** A lightweight component for fetching and rendering specific timetables.

## 🛠️ Technology Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (with Mongoose ORM)
- **Frontend (Main):** Vanilla HTML, CSS, JavaScript
- **Frontend (Secondary):** React.js, Vite, TailwindCSS, Axios

## 📦 Setup & Installation

### 1. Prerequisites
- [Node.js](https://nodejs.org/en/) installed
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally on port 27017

### 2. Backend Setup
```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Start the server (runs on http://localhost:5000)
node server.js
```

### 3. Frontend Setup

**Vanilla Dashboard (Recommended for full demo):**
- Simply double-click on `frontend/index.html` to open it in your browser.
- Ensure the backend is running so the dashboard can fetch the API.

**React Dashboard (Optional):**
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 🖥️ How to Use the Dashboard

1. **View Timetable:** Select the Branch, Section (for Civil), and Semester, then click `🔄 Refresh`.
2. **Generate Timetable:** Click `⚡ Auto Generate` to run the assignment algorithm on the backend and build the timetable.
3. **Faculty Leave:** Select a faculty member taking leave, a date, the class period they are supposed to teach, and an optional preferred substitute. Click `📩 Submit Leave Request`.

## 📜 Authors & Acknowledgements
- Developed by Yash Kumar Jha for Government Engineering College Madhubani.
