import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import AdminGate from './pages/AdminGate';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Dashboard Pages
import DashboardHome from './pages/dashboard/DashboardHome';
import Library from './pages/dashboard/Library';
import PdfLibrary from './pages/dashboard/PdfLibrary';
import Upload from './pages/dashboard/Upload';
import Search from './pages/dashboard/Search';
import Settings from './pages/dashboard/Settings';
import Viewer from './pages/dashboard/Viewer';

// Layout & Context
import DashboardLayout from './components/DashboardLayout';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DocumentProvider } from './context/DocumentContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <DocumentProvider>
        <ThemeProvider>
          <Router>
            <Routes>
              {/* Public */}
              <Route path="/" element={<AdminGate />} />
              <Route path="/landing" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Private Dashboard */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardHome />} />
                <Route path="library" element={<Library />} />
                <Route path="pdf-library" element={<PdfLibrary />} />
                <Route path="upload" element={<Upload />} />
                <Route path="search" element={<Search />} />
                <Route path="settings" element={<Settings />} />
                <Route path="viewer/:id" element={<Viewer />} />
              </Route>

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </DocumentProvider>
    </AuthProvider>
  );
}

export default App;
