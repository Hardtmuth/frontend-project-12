import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router'
import 'bootstrap/dist/css/bootstrap.min.css'
import MainPage from './MainPage.jsx'
import AuthPage from './AuthPage.jsx'
import ErrorPage from './ErrorPage.jsx'
import SignupPage from './SignupPage.jsx'
import AuthContext from '../contexts/index.js'
import useAuth from '../hooks/index.js'
import Header from './Header.jsx'

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false)

  const logIn = () => setLoggedIn(true)
  const logOut = () => {
    localStorage.removeItem('userId')
    setLoggedIn(false)
  }

  return (
    <AuthContext.Provider value={{ loggedIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  )
}

const PrivateRoute = ({ children }) => {
  const auth = useAuth()
  const location = useLocation()

  return (
    auth.loggedIn ? children : <Navigate to="/login" state={{ from: location }} />
  )
}

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          {/* <Route path="/" element={<MainPage />} /> */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<ErrorPage />} />
          <Route
            path="/"
            element={(
              <PrivateRoute>
                <MainPage />
              </PrivateRoute>
            )}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
