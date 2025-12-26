# Feedback Collector Backend

A Node.js Express server for collecting and managing user feedback.

## Features

- Submit feedback with name, email, rating, and message
- View all submitted feedbacks
- Get individual feedback by ID
- CORS enabled for frontend integration

## API Endpoints

- `GET /` - Server status
- `GET /api/feedbacks` - Get all feedbacks
- `POST /api/feedback` - Submit new feedback
- `GET /api/feedback/:id` - Get feedback by ID

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the server:
   ```
   npm start
   ```

Server runs on http://localhost:8002