# 📘 Exam Duty Management System
## overview

The Exam Duty Management System is a full-stack MERN application designed to automate the allocation and management of exam duties for teachers.
It ensures fair duty distribution, tracks teacher availability, maintains duty counts.

This system reduces manual workload and improves transparency in exam scheduling.

## 🚀 Tech Stack

* MongoDB – Database
* Express.js – Backend Framework
* React.js – Frontend
* Node.js – Runtime Environment
* JWT – Authentication
* Nodemailer – Email Notifications

## ⚙️ Environment Configuration
### 🔐 Step 1: Create .env File
Inside the backend folder, create a file named:
``` 
 .env
```
Add the following content:
```bash
MONGO_URI=
PORT=5000
JWT_SECRET=
EMAIL_USER=
EMAIL_PASS=
```

## 🛠️ How to Get Required Credentials
### 1️⃣ MongoDB Connection String (MONGO_URI)

1. Install MongoDB Community Server

2. Make sure MongoDB service is running on your system

3. Install and open MongoDB Compass

4. In the connection field, enter:

```
   mongodb://localhost:27017
```
5. Click Connect

6. Click Create Database

7. Enter:

> * Database Name → exam-duty

> * Collection Name → users

8. Click Create Database

9. Use this in your .env file:
```
   MONGO_URI=mongodb://localhost:27017/examDutyDB
```

## 2️⃣ JWT Secret

#### Generate a random secure string.

* Example:

```
   JWT_SECRET=examDutyManagementSecretKey123
```

## 3️⃣ Gmail Setup for Email Notifications
#### EMAIL_USER

Use your Gmail address:

```
   EMAIL_USER=yourgmail@gmail.com
```

## 4️⃣ Generate 16-Digit Gmail App Password (EMAIL_PASS)

### ⚠️ Do NOT use your normal Gmail password.

**Steps:**

1. Go to your Google Account

2. Click Security

3. Enable 2-Step Verification

4. Search for App Passwords

5. Select:

   * App → Mail

   * Device → Windows (or Other)

6. Click Generate

7. Google will provide a 16-digit password

    **Example:**

```
   abcd efgh ijkl mnop
```
**use this:**
```
   EMAIL_PASS=abcd efgh ijkl mnop
```
   

## 📦 Installation Guide
### 1️⃣ Install Dependencies
#### Backend
```
   cd backend
   npm install
```
#### Frontend
```
   cd frontend
   npm install
```

## ▶️ Run the Project
### Start Backend

#### Inside backend folder:

       npm start


#### Server runs on:

       http://localhost:5000

### Start Frontend

#### Inside frontend folder:

       npm run dev


#### Frontend runs on:

       http://localhost:5173
