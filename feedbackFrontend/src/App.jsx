import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Home from './components/Home'
import FeedbackForm from './components/FeedbackForm'
import ViewFeedbacks from './components/ViewFeedbacks'
import Login from './components/Login'
import Register from './components/Register'
import './css/App.css'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar user={user} setUser={setUser} />
        <main>
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route path="/feedback" element={<FeedbackForm user={user} />} />
            <Route path="/view-feedbacks" element={<ViewFeedbacks />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App