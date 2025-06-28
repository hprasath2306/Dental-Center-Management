import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { Layout } from './components/common/Layout';
import { LoginForm } from './pages/auth/LoginForm';

// Admin
import { Dashboard } from './pages/admin/Dashboard';
import { PatientManagement } from './pages/admin/PatientManagement';
import { AppointmentManagement } from './pages/admin/AppointmentManagement';
import { CalendarView } from './pages/admin/CalendarView';

// Patient
import { PatientDashboard } from './pages/patient/PatientDashboard';
import { PatientAppointments } from './pages/patient/PatientAppointments';
import { PatientRecords } from './pages/patient/PatientRecords';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'Admin' ? '/dashboard' : '/patient-dashboard'} replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={user ? <Navigate to={user.role === 'Admin' ? '/dashboard' : '/patient-dashboard'} replace /> : <LoginForm />} 
      />
      
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/patients" 
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <PatientManagement />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/appointments" 
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AppointmentManagement />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/calendar" 
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <CalendarView />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/patient-dashboard" 
        element={
          <ProtectedRoute allowedRoles={['Patient']}>
            <PatientDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/patient-appointments" 
        element={
          <ProtectedRoute allowedRoles={['Patient']}>
            <PatientAppointments />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/patient-records" 
        element={
          <ProtectedRoute allowedRoles={['Patient']}>
            <PatientRecords />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/" 
        element={
          user ? (
            <Navigate to={user.role === 'Admin' ? '/dashboard' : '/patient-dashboard'} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Layout>
            <AppRoutes />
          </Layout>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;