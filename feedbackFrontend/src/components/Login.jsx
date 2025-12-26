import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../css/Auth.css'

const Login = ({ setUser }) => {
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8002'}/api/login`, formData)
            localStorage.setItem('user', JSON.stringify(response.data.user))
            setUser(response.data.user)
            navigate('/')
        } catch (error) {
            setError(error.response?.data?.error || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Login</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p>Don't have an account? <a href="/register">Register here</a></p>
            </div>
        </div>
    )
}

export default Login