import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Register from './pages/register.jsx'
import Login from './pages/login.jsx'
import NewJob from './pages/newJob.jsx'
import Jobs from './pages/jobs.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path='/NewJob' element={<NewJob />} />
        <Route path='/jobs' element={<Jobs />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
