# 🏋️ FitPro – Gym Management System

FitPro is a **full-stack web application** designed to streamline gym operations for **administrators, trainers, and members**.  
It uses a **Spring Boot backend** and a **React frontend**, with secure authentication, role-based access control, automated membership tracking, and online payments.

---

## 🚀 Features

### 👤 Members
- Secure dashboard to view membership status, active plans, and assigned trainers  
- BMI calculator to track health metrics  
- Attendance history (check-in records)  
- Online membership renewal via **Razorpay**

### 🏋️ Trainers
- View assigned active members  
- Track client progress and membership status  

### 🛠️ Administrators
- Global dashboard for revenue, members, and trainers  
- Full CRUD for members, trainers, and membership plans  
- Manual (cash) payment entry with automatic expiry updates  
- Digital attendance management  

---

## 🧰 Tech Stack

### Backend
- **Java Spring Boot**
- **Spring Security + JWT**
- **MySQL + Spring Data JPA (Hibernate)**
- **Razorpay API**

### Frontend
- **React (Vite)**
- **Bootstrap 5 + Custom CSS (Dark Theme)**
- **React Context API**
- **React Router (Protected Routes)**
- **Lucide-React Icons**

---

## 🔐 Security

- Stateless authentication using **JWT**
- Role-Based Access Control (**ADMIN**, **TRAINER**, **MEMBER**)
- Custom `JwtRequestFilter` validates Bearer tokens
- Authorization enforced at:
  - Backend (`SecurityConfig`)
  - Frontend (`ProtectedRoute`)

---

## ⚙️ Configuration & Setup

### Backend Configuration

Edit `src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/fitpro_db?createDatabaseIfNotExist=true
spring.datasource.username=YOUR_USERNAME_WHATEVER_USERNAME_IS
spring.datasource.password=YOUR_PASSWORD_WHATEVER_PASSWORD_IS

# Razorpay
razorpay.api.key=YOUR_KEY_WHATEVER_KEY_IS
razorpay.api.secret=YOUR_SECRET_WHATEVER_SECRET_IS



### Frontend Configuration

#### 1. Set API Base URL

Update the Axios configuration file:

```js
// frontend/src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

export default api;

2. Install Dependencies

Navigate to the frontend directory and install required packages:

npm install

3. Start Development Server

Run the application locally:

npm run dev

4. Environment Variables (Optional – Recommended)

For better environment management, you can use a .env file:

VITE_API_BASE_URL=http://localhost:8080/api


Then update Axios to use it:

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});



