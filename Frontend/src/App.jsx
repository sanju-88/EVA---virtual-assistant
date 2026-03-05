import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Signin from './pages/SignIn.jsx'
import Signup from './pages/SignUp.jsx'

function App() {
  return (
    <Routes>
      <Route path='/signin' element={<Signin></Signin>}></Route>
      <Route path='/signup' element={<Signup></Signup>}></Route>

    </Routes>
  )
}

export default App