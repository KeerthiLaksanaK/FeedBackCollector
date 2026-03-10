import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, avgRating: 0, replied: 0 });
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchFeedbacks();
  }, [navigate]);

  const fetchFeedbacks = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('http://localhost:5000/admin/feedbacks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const feedbackData = response.data;
      setFeedbacks(feedbackData);
      
      // Calculate stats
      const total = feedbackData.length;
      const avgRating = total > 0 ? (feedbackData.reduce((sum, f) => sum + f.rating, 0) / total).toFixed(1) : 0;
      const replied = feedbackData.filter(f => f.status === 'replied').length;
      setStats({ total, avgRating, replied });
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (feedbackId) => {
    if (!replyText.trim()) {
      alert('Please enter a reply message');
      return;
    }
    
    try {
      const token = localStorage.getItem('adminToken');
      console.log('Sending reply:', { feedbackId, reply: replyText });
      
      const response = await axios.post(`http://localhost:5000/admin/reply/${feedbackId}`, 
        { reply: replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('Reply response:', response.data);
      alert('Reply sent successfully!');
      
      setReplyingTo(null);
      setReplyText('');
      fetchFeedbacks(); // Refresh data
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Error sending reply: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const getRatingStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return '#28a745';
    if (rating >= 3) return '#ffc107';
    return '#dc3545';
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center bg-primary text-white p-3 rounded">
            <div>
              <h2 className="mb-0">Admin Dashboard</h2>
              <small>Feedback Management System</small>
            </div>
            <button className="btn btn-outline-light" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt me-2"></i>Logout
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <h3 className="card-title">{stats.total}</h3>
              <p className="card-text">Total Feedbacks</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <h3 className="card-title">{stats.avgRating}/5</h3>
              <p className="card-text">Average Rating</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-warning text-white">
            <div className="card-body text-center">
              <h3 className="card-title">{stats.replied}</h3>
              <p className="card-text">Replied</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feedbacks */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4 className="mb-0">All Feedbacks</h4>
            </div>
            <div className="card-body">
              {feedbacks.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                  <p className="text-muted">No feedbacks available.</p>
                </div>
              ) : (
                <div className="row">
                  {feedbacks.map((feedback) => {
                    console.log('Feedback ID:', feedback._id, 'Type:', typeof feedback._id);
                    return (
                    <div key={feedback._id} className="col-lg-6 col-xl-4 mb-4">
                      <div className="card h-100 shadow-sm">
                        <div className="card-header d-flex justify-content-between align-items-center">
                          <strong className="text-primary">{feedback.name}</strong>
                          <div className="d-flex align-items-center gap-2">
                            <span 
                              className="badge fs-6" 
                              style={{ backgroundColor: getRatingColor(feedback.rating), color: 'white' }}
                            >
                              {getRatingStars(feedback.rating)}
                            </span>
                            {feedback.status === 'replied' && (
                              <span className="badge bg-success">Replied</span>
                            )}
                          </div>
                        </div>
                        <div className="card-body">
                          <p className="card-text">{feedback.message}</p>
                          
                          {feedback.adminReply && (
                            <div className="mt-3 p-2 bg-light rounded">
                              <strong className="text-success">Admin Reply:</strong>
                              <p className="mb-1 mt-1">{feedback.adminReply}</p>
                              <small className="text-muted">
                                Replied on: {new Date(feedback.repliedAt).toLocaleDateString()}
                              </small>
                            </div>
                          )}
                          
                          {replyingTo === feedback._id ? (
                            <div className="mt-3">
                              <textarea
                                className="form-control mb-2"
                                rows="3"
                                placeholder="Type your reply..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                              />
                              <div className="d-flex gap-2">
                                <button 
                                  className="btn btn-success btn-sm"
                                  onClick={() => {
                                    console.log('Reply button clicked for feedback:', feedback._id);
                                    handleReply(feedback._id);
                                  }}
                                  disabled={!replyText.trim()}
                                >
                                  <i className="fas fa-paper-plane me-1"></i>Send Reply
                                </button>
                                <button 
                                  className="btn btn-secondary btn-sm"
                                  onClick={() => {
                                    setReplyingTo(null);
                                    setReplyText('');
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            !feedback.adminReply && (
                              <button 
                                className="btn btn-outline-primary btn-sm mt-2"
                                onClick={() => {
                                  console.log('Opening reply for feedback:', feedback._id);
                                  setReplyingTo(feedback._id);
                                  setReplyText('');
                                }}
                              >
                                <i className="fas fa-reply me-1"></i>Reply
                              </button>
                            )
                          )}
                        </div>
                        <div className="card-footer bg-light">
                          <small className="text-muted d-block">
                            <i className="fas fa-envelope me-1"></i>{feedback.email}
                          </small>
                          <small className="text-muted">
                            <i className="fas fa-calendar me-1"></i>
                            {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </small>
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;