import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../css/Feedback.css';

const FeedbackForm = ({ user }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState("5");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setName(user.name);
    setEmail(user.email);
  }, [user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      alert('Please login to submit feedback');
      navigate('/login');
      return;
    }

    try {
      const req = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8002'}/api/feedback`, {
        name,
        email,
        rating,
        message,
        userId: user.id
      });

      console.log("Feedback response:", req.data);
      
      if (req.data) {
        alert("Feedback submitted successfully!");
        setRating("5");
        setMessage("");
        navigate("/view-feedbacks");
      } else {
        alert("Feedback submission failed - Invalid response from server");
      }
    } catch (e) {
      console.error("Feedback error:", e);
      if (e.response) {
        alert("Feedback Failed: " + (e.response.data?.error || "Server error"));
      } else if (e.request) {
        alert("Feedback Failed: Unable to connect to server");
      } else {
        alert("Feedback Failed: " + e.message);
      }
    }
  };

  if (!user) {
    return <div>Please login to submit feedback.</div>;
  }

  return (
    <div className="feedback-form-container">
      <div className="feedback-form-card">
        <h2>Submit Your Feedback</h2>
        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input 
              id="name"
              type="text" 
              onChange={(e) => setName(e.target.value)} 
              value={name} 
              required 
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              id="email"
              type="email" 
              onChange={(e) => setEmail(e.target.value)} 
              value={email} 
              required 
              placeholder="Enter your email address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="rating">Rating</label>
            <div className="rating-container">
              <select 
                id="rating"
                onChange={(e) => setRating(e.target.value)} 
                value={rating} 
                required
                className="rating-select"
              >
                <option value="1">⭐ 1 - Poor</option>
                <option value="2">⭐⭐ 2 - Fair</option>
                <option value="3">⭐⭐⭐ 3 - Good</option>
                <option value="4">⭐⭐⭐⭐ 4 - Very Good</option>
                <option value="5">⭐⭐⭐⭐⭐ 5 - Excellent</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea 
              id="message"
              onChange={(e) => setMessage(e.target.value)} 
              value={message} 
              rows="5" 
              required
              placeholder="Share your detailed feedback here..."
              className="feedback-textarea"
            ></textarea>
          </div>

          <button type="submit" className="submit-btn">
            <span>Submit Feedback</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;