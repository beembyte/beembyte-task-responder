
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import ProtectedRoute from './components/ProtectedRoute';
import VettingProtectedRoute from './components/VettingProtectedRoute';
import Dashboard from './pages/Dashboard';
import PendingTasks from './pages/PendingTasks';
import OngoingTasks from './pages/OngoingTasks';
import CompletedTasks from './pages/CompletedTasks';
import TaskDetail from './pages/TaskDetail';
import SingleTask from '@/pages/SingleTask';
import TaskHistory from '@/pages/TaskHistory';
import Chat from '@/pages/Chat';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import VerifyCode from '@/pages/VerifyCode';
import ForgotPassword from '@/pages/ForgotPassword';
import VerifyResetOTP from '@/pages/VerifyResetOTP';
import ResetPassword from '@/pages/ResetPassword';
import Vetting from '@/pages/Vetting';
import Profile from '@/pages/Profile';
import Wallet from '@/pages/Wallet';
import { Toaster } from '@/components/ui/sonner';
import { useAuthGuard } from './hooks/useAuthGuard';

const queryClient = new QueryClient();

// Root route component that handles authentication-based routing
const RootRoute = () => {
  const { isAuthenticated, user } = useAuthGuard(false); // Don't require auth for root check

  console.log("🔍 RootRoute check:", {
    isAuthenticated,
    userVetted: user?.is_vetted
  });

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    if (!user.is_vetted) {
      console.log("🔍 RootRoute redirecting to: /vetting");
      window.location.href = '/vetting';
      return null;
    } else {
      console.log("🔍 RootRoute redirecting to: /dashboard");
      window.location.href = '/dashboard';
      return null;
    }
  }

  console.log("🔍 RootRoute redirecting to: /login");
  window.location.href = '/login';
  return null;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="App">
          <AuthProvider>
            <TaskProvider>
              <Routes>
                {/* Root route with authentication logic */}
                <Route path="/" element={<RootRoute />} />

                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                {/* <Route path="/register" element={<Register />} /> */}
                <Route path="/verify-code" element={<VerifyCode />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-reset-otp" element={<VerifyResetOTP />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Vetting route with special protection */}
                <Route path="/vetting" element={
                  <VettingProtectedRoute>
                    <Vetting />
                  </VettingProtectedRoute>
                } />

                {/* Protected routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/pending-tasks" element={
                  <ProtectedRoute>
                    <PendingTasks />
                  </ProtectedRoute>
                } />
                <Route path="/ongoing-tasks" element={
                  <ProtectedRoute>
                    <OngoingTasks />
                  </ProtectedRoute>
                } />
                <Route path="/completed-tasks" element={
                  <ProtectedRoute>
                    <CompletedTasks />
                  </ProtectedRoute>
                } />
                <Route path="/task/:id" element={
                  <ProtectedRoute>
                    <SingleTask />
                  </ProtectedRoute>
                } />
                <Route path="/chat/:id" element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                } />
                <Route path="/task-history" element={
                  <ProtectedRoute>
                    <TaskHistory />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/wallet" element={
                  <ProtectedRoute>
                    <Wallet />
                  </ProtectedRoute>
                } />
              </Routes>
              <Toaster />
            </TaskProvider>
          </AuthProvider>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
