import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import useAuth from './hooks/useAuth';

import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import AssetManagement from './pages/AssetManagement';
import AssetView from './pages/AssetView';
import AssetEdit from './pages/AssetEdit';
import EmployeeManagement from './pages/EmployeeManagement';
import CategoryManagement from './pages/CategoryManagement';
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="assets" element={<AssetManagement />} />
            <Route path="assets/:id" element={<AssetView />} />
            <Route path="assets/edit/:id" element={<AssetEdit />} />
            <Route path="employees" element={<EmployeeManagement />} />
            <Route path="categories" element={<CategoryManagement />} />
          </Route>
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}

export default App;