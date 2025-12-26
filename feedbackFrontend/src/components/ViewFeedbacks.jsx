import { useState, useEffect } from "react";
import axios from "axios";
import '../css/Feedback.css';

const ViewFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const req = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8002'}/api/feedbacks`);
      setFeedbacks(req.data);
      setError('');
    } catch (e) {
      console.error("Fetch feedbacks error:", e);
      setError('Failed to load feedbacks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rating ? 'filled' : 'empty'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="feedbacks-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading feedbacks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feedbacks-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchFeedbacks} className="retry-btn">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="feedbacks-container">
      <div className="feedbacks-header">
        <h2>Customer Feedbacks</h2>
        <div className="feedbacks-count">
          {feedbacks.length} {feedbacks.length === 1 ? 'Feedback' : 'Feedbacks'}
        </div>
      </div>
      
      {feedbacks.length === 0 ? (
        <div className="no-feedbacks">
          <div className="no-feedbacks-icon">📝</div>
          <h3>No feedbacks yet</h3>
          <p>Be the first to share your feedback!</p>
        </div>
      ) : (
        <div className="feedbacks-grid">
          {feedbacks.map((feedback) => (
            <div key={feedback._id || feedback.id} className="feedback-card">
              <div className="feedback-header">
                <div className="user-info">
                  <div className="user-avatar">
                    {feedback.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-details">
                    <h3 className="user-name">{feedback.name}</h3>
                  </div>
                </div>
                <div className="rating-display">
                  <div className="stars">
                    {renderStars(feedback.rating)}
                  </div>
                  <span className="rating-text">({feedback.rating}/5)</span>
                </div>
              </div>
              
              <div className="feedback-content">
                <p className="feedback-message">{feedback.message}</p>
              </div>
              
              <div className="feedback-footer">
                <span className="feedback-date">
                  {formatDate(feedback.createdAt || feedback.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewFeedbacks;