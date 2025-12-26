require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/User')
const Feedback = require('./models/Feedback')

const app = express()
const PORT = process.env.PORT || 8002

// Environment validation
if (!process.env.MONGODB_URI) {
    console.error('Missing required environment variables:');
    console.error('- MONGODB_URI is required');
    process.exit(1);
}

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB Connection
if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI environment variable is not set');
    process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    })

// Routes
app.get('/', (req, res) => {
    res.send('Feedback Collector Backend is running!')
})

// Auth Routes
app.post('/api/register', async (req, res) => {
    try {
        console.log('Register request received:', req.body)
        const { name, email, password } = req.body
        
        if (!name || !email || !password) {
            console.log('Missing fields:', { name: !!name, email: !!email, password: !!password })
            return res.status(400).json({ error: 'All fields are required' })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            console.log('User already exists:', email)
            return res.status(400).json({ error: 'User already exists' })
        }

        const user = new User({ name, email, password })
        await user.save()
        console.log('User registered successfully:', email)

        res.status(201).json({ 
            message: 'User registered successfully', 
            user: { id: user._id, name: user.name, email: user.email } 
        })
    } catch (error) {
        console.error('Registration error:', error)
        res.status(500).json({ error: 'Server error' })
    }
})

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' })
        }

        const user = await User.findOne({ email })
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ error: 'Invalid credentials' })
        }

        res.json({ 
            message: 'Login successful', 
            user: { id: user._id, name: user.name, email: user.email } 
        })
    } catch (error) {
        res.status(500).json({ error: 'Server error' })
    }
})



// Get all feedbacks
app.get('/api/feedbacks', async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 })
        res.json(feedbacks)
    } catch (error) {
        res.status(500).json({ error: 'Server error' })
    }
})

// Submit new feedback
app.post('/api/feedback', async (req, res) => {
    try {
        const { name, email, rating, message, userId } = req.body
        
        if (!name || !email || !rating || !message) {
            return res.status(400).json({ error: 'All fields are required' })
        }
        
        const feedback = new Feedback({
            name,
            email,
            rating: parseInt(rating),
            message,
            userId
        })
        
        await feedback.save()
        res.status(201).json({ message: 'Feedback submitted successfully', feedback })
    } catch (error) {
        res.status(500).json({ error: 'Server error' })
    }
})

// Get feedback by ID
app.get('/api/feedback/:id', async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id)
        if (!feedback) {
            return res.status(404).json({ error: 'Feedback not found' })
        }
        res.json(feedback)
    } catch (error) {
        res.status(500).json({ error: 'Server error' })
    }
})



app.listen(PORT, () => {
    console.log(`Feedback Backend Server is running on port ${PORT}`)
})