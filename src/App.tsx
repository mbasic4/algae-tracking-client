import { Routes, Route, Navigate } from "react-router-dom";

import { HomePage } from './pages/Home'
import { Navbar } from "./components/Navbar";
import { LoginPage } from "./pages/Login";
import { SignupPage } from "./pages/Signup";
import { CitizenSignup } from "./pages/Signup/CitizenSignup";
import { BiologistSignup } from "./pages/Signup/BiologistSignup";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Account } from "./pages/Account";
import { useCurrentUser } from "./auth/useCurrentUser";
import { Observations } from "./pages/Observations";
import { Spinner } from "./components/Spinner";
import { useEffect } from "react";
import { apiClient } from "./apiClient";

function App() {
  const { token, currentUser, logout } = useCurrentUser();

  useEffect(() => {
    const interceptorId = apiClient.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        if (error.response.status === 403) {
          logout()
        }
        return Promise.reject(error);
      }
    );

    return () => apiClient.interceptors.response.eject(interceptorId);
  }, []);

  if (token && !currentUser) {
    return <Spinner />
  }

  return (
    <>
      <Navbar />
      <div className="h-full">
      <div style={{ height: 64 }} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={token ? <Navigate replace to="/account" /> : <LoginPage />}
          />
          <Route
            path="/signup"
            element={token ? <Navigate replace to="/account" /> : <SignupPage />}
          />
          <Route
            path="/signup/citizen-scientist"
            element={token ? <Navigate replace to="/account" /> : <CitizenSignup />}
          />
          <Route
            path="/signup/biologist"
            element={token ? <Navigate replace to="/account" /> : <BiologistSignup />}
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/observations"
            element={
              <ProtectedRoute>
                <Observations />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </>
  )
}

export default App
