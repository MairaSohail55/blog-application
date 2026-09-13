# 📝 Blog Application

A full-stack Blog Application developed step-by-step using HTML, CSS, JavaScript, Node.js, Express.js, MongoDB, Mongoose, JWT, and bcryptjs.

This project was built through five modules, starting with the frontend foundation and gradually adding backend APIs, database integration, CRUD functionality, and secure authentication and authorization.

## 🚀 Project Overview

The Blog Application allows users to register, log in, create blog posts, view their own blogs, edit their blogs, delete their blogs, and securely log out.

The application uses JWT authentication to identify logged-in users and authorization checks to ensure that users can only manage their own blog posts.

## 📚 Modules Completed

### Module 1 — Frontend Foundation

The first module focused on creating the basic frontend structure of the Blog Application.

The following pages were created:

- Homepage
- Registration page
- Login page
- Dashboard page
- Create Blog page

HTML was used to create the structure of the application, CSS was used for styling, and JavaScript was used to add frontend functionality and navigation.

The basic application flow was:

User → Homepage → Register/Login → Dashboard → Create Blog

Module 1 provided the foundation for the complete Blog Application.

### Module 2 — Backend & REST APIs

In Module 2, a backend was created using Node.js and Express.js.

The frontend was connected to the backend using the Fetch API and REST APIs.

The following functionality was implemented:

- Node.js backend
- Express.js server
- REST API structure
- User registration API
- User login API
- Blog creation API
- JSON request and response handling
- Frontend-to-backend communication
- Fetch API integration

The basic communication flow became:

Frontend → Fetch API → Express.js Server → REST API → Backend Processing → JSON Response → Frontend

Module 2 introduced backend development and allowed the frontend to communicate with the server.

### Module 3 — MongoDB & Mongoose

In Module 3, MongoDB was integrated into the application to provide persistent data storage.

MongoDB Atlas was connected to the Node.js backend using Mongoose.

The following functionality was implemented:

- MongoDB Atlas connection
- Mongoose integration
- User model
- Blog model
- Database schemas
- User data storage
- Blog data storage
- Database queries
- Backend-to-database communication

The application workflow became:

Frontend → Express.js API → Mongoose → MongoDB Atlas → Store/Retrieve Data → API Response → Frontend

Module 3 changed the application from temporary data handling to persistent database storage.

### Module 4 — CRUD Operations

In Module 4, complete CRUD functionality was implemented for blog posts.

CRUD stands for:

- Create
- Read
- Update
- Delete

Users can create new blogs using:

POST /api/blogs

Users can read blogs using:

GET /api/blogs

Users can update blogs using:

PUT /api/blogs/:id

Users can delete blogs using:

DELETE /api/blogs/:id

The following features were implemented:

- Create blog functionality
- Read blog functionality
- Edit blog functionality
- Delete blog functionality
- Blog cards on the dashboard
- Edit buttons
- Delete buttons
- Backend CRUD APIs
- Frontend CRUD integration

The CRUD workflow is:

Frontend → REST API → Express.js → Mongoose → MongoDB → Response → Frontend

Module 4 transformed the application into a functional blog management system.

### Module 5 — Authentication & Authorization

In Module 5, the main focus was application security.

JWT-based authentication and authorization were implemented to identify logged-in users and control access to protected resources.

Authentication answers:

"Who are you?"

Authorization answers:

"What are you allowed to do?"

The following security features were implemented:

- User registration
- User login
- Password hashing using bcryptjs
- JWT token generation
- JWT token verification
- Authentication middleware
- Protected API routes
- User-specific blog access
- Blog ownership validation
- Authorized blog creation
- Authorized blog editing
- Authorized blog deletion
- Token storage using LocalStorage
- Secure logout

The login process works as follows:

User enters email and password → Frontend sends login request → Backend finds user → Password verified using bcrypt → JWT token generated → Token returned to frontend → Token stored in LocalStorage

Protected API requests use the JWT token in the Authorization header:

Authorization: Bearer <JWT_TOKEN>

The backend verifies the token before allowing access to protected routes.

Blog ownership was also implemented. Each blog is associated with the user who created it.

The authorization process works as follows:

User Request → JWT Token → Authentication Middleware → Verify Token → Identify User → Check Blog Ownership → Allow/Deny Request

This ensures that users can only view, edit, and delete their own blogs.

Passwords are not stored as plain text. bcryptjs is used to hash passwords before they are stored in MongoDB.

Logout removes the stored authentication information and redirects the user back to the login page.

## 🧰 Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript
- Fetch API
- LocalStorage

### Backend

- Node.js
- Express.js
- REST APIs

### Database

- MongoDB
- MongoDB Atlas
- Mongoose

### Authentication & Security

- JSON Web Token (JWT)
- bcryptjs
- Authentication Middleware
- Authorization Checks

### Development Tools

- Visual Studio Code
- Git
- GitHub
- Node.js

## 📂 Project Structure

blog-application/
│
├── backend/
│   ├── .env
│   ├── server.js
│   ├── package.json
│   │
│   ├── data/
│   │   └── data.js
│   │
│   └── models/
│       ├── User.js
│       └── Blog.js
│
├── javascript/
│   └── script.js
│
├── css/
│   └── style.css
│
├── index.html
├── login.html
├── register.html
├── dashboard.html
└── create-blog.html

## 🌐 API Endpoints

### Authentication

Register a new user:

POST /api/register

Login:

POST /api/login

### Blog APIs

Get authenticated user's blogs:

GET /api/blogs

Get a specific authenticated user's blog:

GET /api/blogs/:id

Create a blog:

POST /api/blogs

Update a blog:

PUT /api/blogs/:id

Delete a blog:

DELETE /api/blogs/:id

## 🔐 Environment Variables

The backend uses environment variables for sensitive configuration.

Create a `.env` file inside the `backend` folder:

MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key

Never upload the `.env` file to GitHub.

The `.env` file should be included in `.gitignore` because it contains sensitive information.

## ▶️ How to Run the Project

Clone the repository:

git clone https://github.com/MairaSohail55/blog-application.git

Open the project:

cd blog-application

Install backend dependencies:

cd backend
npm install

Create a `.env` file inside the backend folder and add:

MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key

Start the backend:

node server.js

The backend will run on:

http://localhost:5000

Open `index.html` using VS Code Live Server or your browser to access the frontend.

## 🔄 Complete Application Flow

The overall application works through the following architecture:

User
↓
Frontend
↓
JavaScript / Fetch API
↓
Express.js REST API
↓
Authentication Middleware
↓
Authorization Check
↓
Mongoose
↓
MongoDB Atlas
↓
Response
↓
Frontend

## 📈 Project Progress

Module 1 → Frontend Foundation

Module 2 → Backend & REST APIs

Module 3 → MongoDB & Mongoose

Module 4 → CRUD Operations

Module 5 → Authentication & Authorization

Module 6 → UI/UX Improvements

## 📚 Learning Outcomes

Through the first five modules, I learned how to build a full-stack web application step-by-step.

I learned how to:

- Build a frontend using HTML, CSS, and JavaScript
- Create a backend using Node.js and Express.js
- Build and consume REST APIs
- Connect an application to MongoDB Atlas
- Use Mongoose for database modeling
- Implement CRUD operations
- Create and manage user accounts
- Hash passwords using bcryptjs
- Implement JWT authentication
- Protect backend API routes
- Implement authorization
- Associate blogs with their owners
- Control access to user-specific resources
- Connect frontend authentication with backend authorization
- Use Git and GitHub for version control

One of the most important concepts learned in Module 5 was the difference between authentication and authorization.

Authentication verifies the identity of a user, while authorization determines what that authenticated user is allowed to access or modify.

## ✅ Completed Features

- [x] Frontend pages
- [x] HTML structure
- [x] CSS styling
- [x] JavaScript functionality
- [x] Node.js backend
- [x] Express.js server
- [x] REST APIs
- [x] MongoDB Atlas
- [x] Mongoose models
- [x] User registration
- [x] User login
- [x] Create blogs
- [x] Read blogs
- [x] Edit blogs
- [x] Delete blogs
- [x] Password hashing
- [x] JWT authentication
- [x] Protected API routes
- [x] Authentication middleware
- [x] Authorization
- [x] User-specific blogs
- [x] Blog ownership validation
- [x] Secure logout

## 🔮 Upcoming Features

Future modules will focus on improving the user experience and application interface.

Planned improvements include:

- Blog search
- Category filtering
- Improved blog cards
- Responsive design
- Better forms
- Dashboard improvements
- Better success and error messages
- Additional UI/UX improvements

## 👩‍💻 Developer

Maira Sohail

This project is being developed step-by-step as part of my full-stack web development learning journey.

## ⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.
