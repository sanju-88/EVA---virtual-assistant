import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
<<<<<<< HEAD
import UserContext from './context/userContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <UserContext>
    <App />
  </UserContext>
=======
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
>>>>>>> 2ba6c5aca6c41a8eb9b2df402efbde95c935150c
  </BrowserRouter>
)
