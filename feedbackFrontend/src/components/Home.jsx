import { Link } from 'react-router-dom'

function Home({ user }) {
  return (
    <div className="home">
      <div className="hero-section">
        <h1>Welcome to Feedback Collector</h1>
        {user ? (
          <p>Hello {user.name}! Your opinion matters! Share your feedback and help us improve.</p>
        ) : (
          <p>Your opinion matters! Please login to share your feedback and help us improve.</p>
        )}
        <div className="cta-buttons">
          {user ? (
            <>
              <Link to="/feedback" className="btn btn-primary">
                Submit Feedback
              </Link>
              <Link to="/view-feedbacks" className="btn btn-secondary">
                View All Feedbacks
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
              <Link to="/register" className="btn btn-secondary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home