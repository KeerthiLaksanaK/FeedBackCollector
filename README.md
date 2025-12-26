# Feedback Collector

A full-stack web application for collecting and managing user feedback with authentication.

## Features

- User registration and login
- Submit feedback with ratings
- View all submitted feedbacks
- Responsive design
- MongoDB database integration

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- CORS enabled
- Environment variables with dotenv

### Frontend
- React with Vite
- Modern CSS styling
- Component-based architecture

## Project Structure

```
Feedback collector/
├── feedbackBackend/          # Backend API server
│   ├── models/              # Database models
│   ├── middleware/          # Custom middleware
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
└── feedbackFrontend/        # React frontend
    ├── src/
    │   ├── components/      # React components
    │   └── css/            # Styling files
    ├── public/             # Static assets
    └── package.json        # Frontend dependencies
```

## Installation & Setup

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd feedbackBackend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with:
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=8002
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd feedbackFrontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with:
   ```
   VITE_API_URL=http://localhost:8002
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/feedbacks` - Get all feedbacks
- `POST /api/feedback` - Submit new feedback
- `GET /api/feedback/:id` - Get feedback by ID

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is open source and available under the MIT License.