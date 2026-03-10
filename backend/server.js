require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const Feedback = require("./models/Feedback");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Admin middleware
const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("MongoDB Connection Successful");
    
    // Create default admin user if it doesn't exist
    const adminExists = await User.findOne({ email: 'admin@feedback.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const adminUser = new User({
        name: 'Admin',
        email: 'admin@feedback.com',
        password: hashedPassword,
        isAdmin: true
      });
      await adminUser.save();
      console.log('Default admin user created: admin@feedback.com / admin123');
    }
  })
  .catch((err) => console.log("MongoDB Connection Unsuccessful", err));

app.get("/", (req, res) => {
  res.send("Feedback Collector Server Running");
});

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required", isSignup: false });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists", isSignup: false });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    
    res.status(200).json({ message: "Signup Successful", isSignup: true });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Signup Error", isSignup: false });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required", isLoggedIn: false });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found. Please signup first", isLoggedIn: false });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Incorrect password", isLoggedIn: false });
    }
    
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(200).json({
      message: "Login Successful",
      isLoggedIn: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login Error", isLoggedIn: false });
  }
});

// Admin login endpoint
app.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required", isLoggedIn: false });
    }
    
    const user = await User.findOne({ email, isAdmin: true });
    if (!user) {
      return res.status(404).json({ message: "Admin not found", isLoggedIn: false });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Incorrect password", isLoggedIn: false });
    }
    
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(200).json({
      message: "Admin Login Successful",
      isLoggedIn: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Admin Login Error", isLoggedIn: false });
  }
});

app.post("/feedback", async (req, res) => {
  try {
    const { name, email, rating, message } = req.body;
    
    if (!name || !email || !rating || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    const newFeedback = new Feedback({ name, email, rating: parseInt(rating), message });
    await newFeedback.save();
    
    res.status(200).json({ message: "Feedback Submitted Successfully" });
  } catch (error) {
    console.error("Feedback error:", error);
    res.status(500).json({ message: "Error submitting feedback" });
  }
});

app.get("/feedbacks", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    console.error("Feedbacks error:", error);
    res.status(500).json({ message: "Error fetching feedbacks" });
  }
});

// Admin-only endpoint to get all feedbacks
app.get("/admin/feedbacks", adminAuth, async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    console.error("Admin feedbacks error:", error);
    res.status(500).json({ message: "Error fetching feedbacks" });
  }
});

// Admin reply to feedback
app.post("/admin/reply/:feedbackId", adminAuth, async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const { reply } = req.body;
    
    console.log('Admin reply request:', { feedbackId, reply });
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(feedbackId)) {
      return res.status(400).json({ message: "Invalid feedback ID format" });
    }
    
    if (!reply || !reply.trim()) {
      return res.status(400).json({ message: "Reply message is required" });
    }
    
    // First check if feedback exists
    const existingFeedback = await Feedback.findById(feedbackId);
    if (!existingFeedback) {
      console.log('Feedback not found with ID:', feedbackId);
      return res.status(404).json({ message: "Feedback not found" });
    }
    
    const feedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      {
        adminReply: reply.trim(),
        status: 'replied',
        repliedAt: new Date()
      },
      { new: true }
    );
    
    console.log('Reply saved successfully:', feedback._id);
    res.json({ message: "Reply sent successfully", feedback });
  } catch (error) {
    console.error("Admin reply error:", error);
    res.status(500).json({ message: "Error sending reply", error: error.message });
  }
});

// Test endpoint to check feedback exists
app.get("/admin/feedback/:feedbackId", adminAuth, async (req, res) => {
  try {
    const { feedbackId } = req.params;
    console.log('Checking feedback with ID:', feedbackId);
    
    if (!mongoose.Types.ObjectId.isValid(feedbackId)) {
      return res.status(400).json({ message: "Invalid feedback ID format" });
    }
    
    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    
    res.json(feedback);
  } catch (error) {
    console.error("Error finding feedback:", error);
    res.status(500).json({ message: "Error finding feedback" });
  }
});

app.listen(PORT, () => {
  console.log(`Server Started Successfully on port ${PORT}`);
});