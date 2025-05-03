EdTech E-commerce Platform 📚💳

An e-commerce platform designed to offer educational courses and materials for students and learners. The platform supports course purchases, user authentication, payment processing with Razorpay, and a dynamic course catalog.

🚀 Features
Course Catalog: Browse and filter available courses by category, price, and rating.
User Authentication: Sign up, log in, and manage your account.
Course Purchase: Buy courses securely via Razorpay.
Course Content: Access videos, PDFs, and other course materials after purchase.
Ratings & Reviews: Rate and review courses you’ve taken.
Admin Dashboard: Admins can manage courses, users, and payments.

## 🚀 Features

- 📚 Add and organize subjects or topics
- ✅ Track task progress
- 🔐 User authentication (JWT-based)
- ✉️ Email notifications using templates
- 💳 Razorpay integration for payments/donations
- 🛠️ Built with Node.js, Express, MongoDB, and more

---
## 📁 Folder Structure

Study-Arc/
├── backend/ # Express server and API routes
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── utils/
│ └── .env.example # Example environment config
├── mail/
│ └── template/ # Email templates (ignored in .gitignore)
├── frontend/ # Frontend code (if applicable)
├── .gitignore        
├── README.md            

## 🛠️ Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Email Service**: Nodemailer with HTML templates
- **Payment Gateway**: Razorpay

---

## 🔐 Environment Variables

Add these to your `.env` file:

```env
# =========================
# 📧 Mail Configuration
# =========================
MAIL_HOST=
MAIL_USER=
MAIL_PASS=

# For allowing frontend URL (CORS policy)
CORS_ORIGIN=["http://localhost:3000"]

# =========================
# 🔐 JWT Secret
# =========================
JWT_SECRET=

# =========================
# 📁 Cloudinary Folder Names
# =========================
FOLDER_NAME=images         # Cloudinary folder for images
FOLDER_VIDEO=videos        # Cloudinary folder for videos

# =========================
# 💳 Razorpay Integration
# =========================
RAZORPAY_KEY=

# =========================
# ☁️ Cloudinary Config
# =========================
CLOUD_NAME=
API_KEY=
API_SECRET=

# =========================
# 📬 Contact/Support Email
# =========================
CONTACT_MAIL=

# =========================
# 🌐 Server & DB
# =========================
PORT=4000
MONGODB_URL=

🧪 Setup Instructions
1. Clone the Repository
git clone https://github.com/AJKakarot/Study-Arc.git
cd Study-Arc


2. Install Dependencies
npm install


4. Start the Server
npm start

📬 Contact
Created by Ajeet Gupta — 2nd year CSE (AI/ML) student @ Dr. Ambedkar Institute of Technology, Kanpur.
