import { Link } from 'react-router-dom';

const Navbar = ({ user, logout }) => {
  return (
    <nav style={{ padding: '1rem', backgroundColor: '#f0f0f0', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
          Feedback Collector
        </Link>
        <div>
          {user ? (
            <>
              <span style={{ marginRight: '1rem' }}>Welcome, {user.name}</span>
              <Link to="/feedback" style={{ marginRight: '1rem' }}>Submit Feedback</Link>
              <Link to="/view-feedbacks" style={{ marginRight: '1rem' }}>View Feedbacks</Link>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
              <Link to="/signup" style={{ marginRight: '1rem' }}>Signup</Link>
              <Link to="/admin/login" style={{ marginRight: '1rem', color: '#dc3545' }}>Admin</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;