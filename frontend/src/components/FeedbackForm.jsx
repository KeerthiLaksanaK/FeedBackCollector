import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FeedbackForm = ({ user }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState("5");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const req = await axios.post("http://localhost:5000/feedback", {
        name,
        email,
        rating,
        message,
      });

      if (req.data) {
        alert("Feedback submitted successfully!");
        setRating("5");
        setMessage("");
        navigate("/view-feedbacks");
      }
    } catch (e) {
      console.error("Feedback error:", e);
      alert("Feedback Failed: " + (e.response?.data?.message || "Server error"));
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h2>Submit Your Feedback</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Name:</label>
          <input 
            type="text" 
            onChange={(e) => setName(e.target.value)} 
            value={name} 
            required 
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Email:</label>
          <input 
            type="email" 
            onChange={(e) => setEmail(e.target.value)} 
            value={email} 
            required 
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Rating:</label>
          <select 
            onChange={(e) => setRating(e.target.value)} 
            value={rating} 
            required
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          >
            <option value="1">⭐ 1 - Poor</option>
            <option value="2">⭐⭐ 2 - Fair</option>
            <option value="3">⭐⭐⭐ 3 - Good</option>
            <option value="4">⭐⭐⭐⭐ 4 - Very Good</option>
            <option value="5">⭐⭐⭐⭐⭐ 5 - Excellent</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Message:</label>
          <textarea 
            onChange={(e) => setMessage(e.target.value)} 
            value={message} 
            rows="5" 
            required
            placeholder="Share your detailed feedback here..."
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          ></textarea>
        </div>

        <button type="submit" style={{ width: '100%', padding: '0.75rem', backgroundColor: '#28a745', color: 'white', border: 'none' }}>
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;