import { Link, useNavigate } from 'react-router-dom'

function Navbar({ user, setUser }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Feedback Collector
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          {user ? (
            <>
              <li className="nav-item">
                <Link to="/feedback" className="nav-link">
                  Submit Feedback
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/view-feedbacks" className="nav-link">
                  View Feedbacks
                </Link>
              </li>
              <li className="nav-item">
                <span className="nav-user">Welcome, {user.name}</span>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-logout">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar