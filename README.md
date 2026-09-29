# 🪑 Tharunya Furniture Store

A full-stack furniture e-commerce web application that allows customers to browse furniture products, place orders, track deliveries, and manage their purchases. The application also provides an admin dashboard for managing products, customers, orders, and business statistics.

## ✨ Features

### 👤 Customer

* Customer registration and login
* Browse available furniture products
* Product search and filtering
* Filter products by:

  * Category
  * Price
  * Availability
* View product details
* Place furniture orders
* View order history
* Track order status
* Customer billing
* **10% discount for regular customers**
* Responsive and user-friendly interface

### 👨‍💼 Admin

* Admin login and dashboard
* Manage furniture products
* Add, update and delete products
* Manage customers
* View customer information
* Manage customer orders
* Update order status
* Monitor business activity
* View profit and loss information

### 📦 Order Tracking

Orders can move through different stages:

`Pending → Processing → Dispatched → On the Way → Reached → Delivered`

Previously completed orders can also be maintained as old orders.

## 🛠️ Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Communication

* REST API
* Fetch API
* CORS

## 📂 Project Structure

```text
FURNITURE_STORE/
│
├── client/
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── admin.js
│   │   ├── admin-customers.js
│   │   ├── admin-orders.js
│   │   ├── admin-products.js
│   │   ├── customer.js
│   │   ├── customer-products.js
│   │   ├── customer-orders.js
│   │   ├── customer-tracking.js
│   │   ├── customer-billing.js
│   │   ├── login.js
│   │   └── signup.js
│   │
│   ├── images/
│   │
│   ├── index.html
│   ├── login.html
│   ├── admin.html
│   ├── admin-products.html
│   ├── admin-orders.html
│   ├── admin-customers.html
│   ├── customer.html
│   ├── customer-products.html
│   ├── customer-orders.html
│   ├── customer-tracking.html
│   └── customer-billing.html
│
└── server/
    ├── models/
    ├── routes/
    ├── server.js
    └── package.json
```

## 🚀 How to Run

### 1. Clone the repository

```bash
git clone https://github.com/tharunyareddy01/Tharunya-Furniture-Store.git
```

### 2. Open the project

```bash
cd Tharunya-Furniture-Store
```

### 3. Install backend dependencies

Go to the server folder:

```bash
cd server
npm install
```

### 4. Configure MongoDB

Make sure MongoDB is running on your system.

Configure your MongoDB connection string in the server configuration.

Example:

```text
mongodb://127.0.0.1:27017/furniture_store
```

### 5. Start the server

```bash
node server.js
```

The backend will run on:

```text
http://localhost:4000
```

### 6. Open the application

Open the frontend from the `client` folder or serve it through the backend according to the project configuration.

## 🔐 User Roles

| Role     | Access                                 |
| -------- | -------------------------------------- |
| Customer | Products, Orders, Billing, Tracking    |
| Admin    | Products, Customers, Orders, Dashboard |

## 🛒 Main Modules

```text
Authentication
     ↓
Customer Dashboard
     ↓
Products → Cart/Order → Billing → Tracking
     
Admin Dashboard
     ↓
Products
Customers
Orders
Profit & Loss
```

## 🎯 Project Objective

The main objective of this project is to develop a complete furniture e-commerce system that demonstrates practical implementation of frontend development, backend REST APIs, database management, authentication, product management, order processing, and admin operations.

## 📚 What I Learned

Through this project, I gained practical experience in:

* Building a full-stack web application
* Creating REST APIs using Express.js
* Connecting Node.js with MongoDB
* Using Mongoose for database operations
* Implementing customer and admin workflows
* Managing products and orders
* Working with frontend-backend communication
* Using Fetch API
* Handling CRUD operations
* Designing responsive web pages
* Implementing order tracking and billing functionality

## 🔮 Future Improvements

* Online payment gateway integration
* Product reviews and ratings
* Wishlist functionality
* Email notifications
* Advanced authentication and authorization
* Cloud image storage
* Deployment to a cloud platform
* Mobile-friendly improvements

## 👩‍💻 Author

**V. Tharunya Sree**

B.Tech – Computer Science and Engineering

GitHub:
https://github.com/tharunyareddy01

---

⭐ If you find this project useful, consider giving it a star!
