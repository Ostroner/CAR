import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate } from
'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageCustomers } from './pages/admin/ManageCustomers';
import { ManageVehicles } from './pages/admin/ManageVehicles';
import { ManageReservations } from './pages/admin/ManageReservations';
import { ManageReports } from './pages/admin/ManageReports';
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { BookCar } from './pages/customer/BookCar';
import { ProfileForm } from './pages/customer/ProfileForm';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { RoleGuard } from './routes/RoleGuard';

export function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
            <RoleGuard allowedRoles={['admin']}>
                <AdminDashboard />
              </RoleGuard>
            } />
          
          <Route
            path="/admin/customers"
            element={
            <RoleGuard allowedRoles={['admin']}>
                <ManageCustomers />
              </RoleGuard>
            } />
          
          <Route
            path="/admin/vehicles"
            element={
            <RoleGuard allowedRoles={['admin']}>
                <ManageVehicles />
              </RoleGuard>
            } />
          
          <Route
            path="/admin/reservations"
            element={
            <RoleGuard allowedRoles={['admin']}>
                <ManageReservations />
              </RoleGuard>
            } />
          
          <Route
            path="/admin/reports"
            element={
            <RoleGuard allowedRoles={['admin']}>
                <ManageReports />
              </RoleGuard>
            } />
          

          {/* Customer Routes */}
          <Route
            path="/customer/dashboard"
            element={
            <ProtectedRoute>
                <CustomerDashboard />
              </ProtectedRoute>
            } />
          
          <Route
            path="/customer/book"
            element={
            <ProtectedRoute>
                <BookCar />
              </ProtectedRoute>
            } />
          
          <Route
            path="/customer/profile"
            element={
            <ProtectedRoute>
                <ProfileForm />
              </ProtectedRoute>
            } />
          

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster
        position="top-center"
        toastOptions={{
          className:
          '!bg-card !text-ink !border !border-border !shadow-card-hover !rounded-xl',
          duration: 4000
        }} />
      
    </AuthProvider>);
}
