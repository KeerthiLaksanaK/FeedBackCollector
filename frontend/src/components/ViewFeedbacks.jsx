import { useState, useEffect } from "react";
import axios from "axios";

const ViewFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/feedbacks");
      setFeedbacks(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return "⭐".repeat(rating);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading feedbacks...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h2>All Feedbacks</h2>
      {feedbacks.length === 0 ? (
        <p>No feedbacks available.</p>
      ) : (
        <div>
          {feedbacks.map((feedback) => (
            <div key={feedback._id} style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              padding: '1rem', 
              marginBottom: '1rem',
              backgroundColor: '#f9f9f9'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong>{feedback.name}</strong>
                <span>{renderStars(feedback.rating)} ({feedback.rating}/5)</span>
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                {feedback.message}
              </div>
              
              {feedback.adminReply && (
                <div style={{ 
                  backgroundColor: '#e8f5e8', 
                  padding: '0.75rem', 
                  borderRadius: '5px', 
                  marginBottom: '0.5rem',
                  borderLeft: '4px solid #28a745'
                }}>
                  <strong style={{ color: '#28a745' }}>Admin Response:</strong>
                  <p style={{ margin: '0.25rem 0 0 0', color: '#333' }}>{feedback.adminReply}</p>
                </div>
              )}
              
              <div style={{ fontSize: '0.8rem', color: '#888' }}>
                {new Date(feedback.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewFeedbacks;