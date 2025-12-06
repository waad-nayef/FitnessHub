# 🏋️‍♂️ Fitness Hub – Gym Hiring & Trainer Evaluation Platform

## 📌 Project Overview

**Fitness Hub** is a web-based platform designed to digitize and simplify the gym trainer hiring process. It allows gym administrators to create fitness evaluation forms and quizzes, while applicants can sign up, apply, take tests, and receive automatic results in a fair and efficient way.

The project simulates a full hiring system using **localStorage** as a backend alternative.

---

## 🎯 Project Objectives

* Digitize the trainer hiring and evaluation process
* Provide fair and automated assessment using online forms
* Apply core web technologies in a real-world scenario
* Demonstrate role-based access and CRUD operations

---

## 🧑‍🤝‍🧑 User Roles

### 👤 Guest

* View Home page
* Sign In
* Sign Up

### 🧑‍🏋️ User (Trainer Applicant)

* View available forms
* Take fitness tests
* Edit profile information

### 🛠️ Admin (Gym Manager)

* Manage users
* Create, edit, and delete forms
* View all submissions
* Analyze statistics
* Control form activation

---

## 🗂️ Pages & Features

### Public Pages

* Home (Hero image + Sign In / Sign Up)
* Sign In
* Sign Up
* Contact Us
* About Us
* 404 / Unauthorized Page

### User Pages

* Available Forms
* Fill Form Page
* Submit Result Page
* Edit Profile

### Admin Pages

* Admin Dashboard
* Users Management
* Forms Management
* Form Builder
* Statistics Dashboard

---

## 🧠 Core Features

* Role-based navigation & access control
* Dynamic form and question builder
* Automatic scoring system
* Pass / Fail logic for hiring decisions
* Statistics and performance tracking
* Responsive and clean user interface
* LocalStorage-based data handling

---

## 🗃️ Local Storage Data Structure

Stored as separate keys:

* `users`
* `forms`
* `submissions`
* `currentUser`

All data is handled using:

```js
JSON.parse(localStorage.getItem())
JSON.stringify(data)
```

---

## 🎨 UI Theme & Design

* **Primary Text & Borders:** `#222831`
* **Secondary Text & Borders:** `#393E46`
* **Buttons & Accent:** `#00ADB5`
* **Cards & Boxes:** `#EEEEEE`
* **Background:** `#FFFFFF`

Design follows a **modern, card-based UX** with clear navigation and responsive layout.

---

## ⚙️ Technologies Used

* HTML5
* CSS3
* Bootstrap
* JavaScript
* Web Storage API (localStorage)

---

## 🔐 Key Logic Rules

* Only admins can manage users and forms
* Only non-admin users can submit forms
* Users can submit a form only once
* Scores are calculated automatically per submission
* Admin users cannot be evaluated

---

## 🚀 How to Run the Project

1. Clone or download the repository
2. Open `index.html` in a browser
3. Run the dummy data seed file (once) after uncomment it
4. Use provided admin or user accounts to test

> No server or database setup is required.


## 📎 Notes

* This project is built for educational purposes
* All backend operations are simulated using localStorage
* Designed to demonstrate full CRUD and system logic

---

## 👨‍💻 Team

Waad Nayef (Scrum Master)
Mohammad Alghrasi (Product Owner)
Laila Adel
Mohammad Alqaisi

---
