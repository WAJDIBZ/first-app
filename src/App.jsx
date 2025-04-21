import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";


import Login from "./component/Login";
import Registration from "./component/RegistrationForm";
import "./App.css";
import SignUp from "./component/SignUp";
import EncadreurDashboard from "./component/encadreur";
// Layout components
const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 to-indigo-900">
      {children}
    </div>
  );
};

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* You can add a sidebar here later if needed */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

// Route protection
const ProtectedRoute = ({ children }) => {
  
  //const isAuthenticated = localStorage.getItem("user_id") !== null;
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route
          path="/"
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthLayout>
              <SignUp />
            </AuthLayout>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/registration"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Registration />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/encadreur-dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <EncadreurDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* 404 Route */}
        <Route
          path="*"
          element={
            <AuthLayout>
              <div className="flex items-center justify-center min-h-screen">
                <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
                  <h1 className="text-4xl font-bold text-red-600 mb-4">404</h1>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    Page non trouvée
                  </h2>
                  <p className="text-gray-600 mb-6">
                    La page que vous recherchez n'existe pas ou a été déplacée.
                  </p>
                  <a
                    href="/"
                    className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2 px-6 rounded-md transition-all duration-300"
                  >
                    Retour à l'accueil
                  </a>
                </div>
              </div>
            </AuthLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
