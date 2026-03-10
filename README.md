# Feedback Collector

A full-stack MERN application for collecting and managing user feedback with admin panel.

## Features

### User Features
- User authentication (signup/login)
- Submit feedback with 1-5 star ratings
- View all public feedbacks
- See admin responses to feedbacks

### Admin Features
- Secure admin login
- Professional dashboard with statistics
- View all feedbacks with user details
- Reply to user feedbacks
- Track feedback status (new/replied)

### Technical Features
- JWT-based authentication
- Responsive Bootstrap design
- RESTful API
- MongoDB database
- Secure password hashing

## Tech Stack

- **Frontend**: React 18, React Router, Vite, Axios, Bootstrap
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt
- **Database**: MongoDB (Local or Atlas)

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or Atlas account)
- Git

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd feedbackCollector/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/feedbackCollector
   JWT_SECRET=your_secret_key_here
   PORT=5000
   ```

5. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd feedbackCollector/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Quick Start (Windows)

Double-click `start-servers.bat` to start both servers automatically.

## API Endpoints

### User Endpoints
- `POST /signup` - User registration
- `POST /login` - User login
- `POST /feedback` - Submit feedback
- `GET /feedbacks` - Get all feedbacks

### Admin Endpoints
- `POST /admin/login` - Admin login
- `GET /admin/feedbacks` - Get all feedbacks (protected)
- `POST /admin/reply/:feedbackId` - Reply to feedback (protected)
- `GET /admin/feedback/:feedbackId` - Get single feedback (protected)

## Default Admin Credentials

- **Email**: admin@feedback.com
- **Password**: admin123

⚠️ **Important**: Change these credentials in production!

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  isAdmin: Boolean,
  timestamps: true
}
```

### Feedback Model
```javascript
{
  name: String,
  email: String,
  rating: Number (1-5),
  message: String,
  adminReply: String,
  status: String (new/replied),
  repliedAt: Date,
  timestamps: true
}
```

## Project Structure

```
feedbackCollector/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Feedback.js
│   ├── .env
│   ├── .env.example
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── FeedbackForm.jsx
│   │   │   ├── ViewFeedbacks.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── Navbar.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── .gitignore
├── README.md
└── start-servers.bat
```

## MongoDB Setup

### Local MongoDB
1. Install MongoDB Community Server
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/feedbackCollector`

### MongoDB Atlas (Cloud)
1. Create account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get connection string
4. Update `.env` with Atlas connection string

## Usage

1. **User Flow**:
   - Sign up for an account
   - Login with credentials
   - Submit feedback with rating
   - View all feedbacks and admin responses

2. **Admin Flow**:
   - Login with admin credentials
   - View dashboard with statistics
   - Read user feedbacks
   - Reply to feedbacks
   - Track feedback status

## Screenshots

- Home Page with features overview
- User feedback submission form
- Public feedback view
- Admin dashboard with statistics
- Admin reply interface

## Contributing

Feel free to fork this project and submit pull requests!

## License

MIT License

## Author

Your Name

## Acknowledgments

- Built with MERN Stack
- Bootstrap for styling
- Font Awesome for icons