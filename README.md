
# 🦷 Dental Center Management Dashboard

A responsive, fully client-side React application simulating a Dental Center Management System for Admins (Dentists) and Patients. Built as part of the ENTNT Frontend Developer Technical Assignment.

## 🚀 Live Demo

🔗 [Deployed on Vercel](https://dental-center-management.vercel.app/)

---

## 📁 Repository

📦 [GitHub Repository](https://github.com/hprasath2306/Dental-Center-Management)

---

## 📌 Features

### ✅ Authentication (Simulated)
- Role-based login with hardcoded users (Admin / Patient)
- Session persistence via `localStorage`
- Redirects based on user roles

### 👩‍⚕️ Admin Functionality
- **Patient Management**
  - Add, edit, delete patient records
  - Fields: Full Name, DOB, Contact Info, Health Info

- **Incident / Appointment Management**
  - Add multiple incidents per patient
  - Fields: Title, Description, Comments, Appointment DateTime
  - Post-treatment: Cost, Treatment Details, Status, Next Date
  - File upload for treatment documents (PDF, images)

- **Calendar View**
  - Monthly/Weekly calendar showing scheduled appointments
  - Click a day to view treatments

- **Dashboard**
  - KPIs: Upcoming appointments, revenue, top patients, treatment statuses, etc.

### 🧑‍💻 Patient Functionality
- View only their own:
  - Profile & health info
  - Appointment history
  - Treatment details & uploaded files

### 💾 Data Persistence
- All data stored and managed using `localStorage`
- Uploaded files converted to base64 or blob URLs

### 📱 Responsive UI
- Fully responsive layout using TailwindCSS
- Optimized for mobile, tablet, and desktop

---

## 🧠 Technical Stack

| Technology        | Description                                    |
|-------------------|------------------------------------------------|
| React             | Functional components, Hooks-based             |
| React Router DOM  | Frontend routing                               |
| Context API       | Global auth & data state management            |
| TailwindCSS       | Responsive and utility-first styling           |
| localStorage      | Data and session simulation                    |

---

## 🔐 Simulated Users

\`\`\`json
[
  {
    "id": "1",
    "role": "Admin",
    "email": "admin@entnt.in",
    "password": "admin123"
  },
  {
    "id": "2",
    "role": "Patient",
    "email": "john@entnt.in",
    "password": "patient123",
    "patientId": "p1"
  }
]
\`\`\`

---

## 🧪 How to Run Locally

```bash
git clone https://github.com/hprasath2306/Dental-Center-Management
cd Dental-Center-Management
npm install
npm run dev
```

App will run at [http://localhost:5173](http://localhost:5173)

---

## 🏗️ Technical Decisions

- **State Management:** Chose Context API for simplicity and centralized access to auth & data.
- **Data Handling:** All CRUD operations mirror backend workflows using localStorage.
- **File Uploads:** Handled as base64 or blob URLs to simulate upload/download without a backend.
- **Routing:** Role-based access and nested routes for admin/patient segregation.
- **Styling:** TailwindCSS for consistency, responsiveness, and ease of utility-driven design.
- **Modularization:** Focused on reusability of forms, cards, tables, and layout components.

---

## 🙏 Acknowledgements

Thanks to ENTNT for the opportunity and well-structured assignment prompt.
