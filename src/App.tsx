
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

const queryClient = new QueryClient();

// Root route component to handle initial routing logic
const RootRoute = () => {
  const hasAuthCookie = document.cookie.includes('authToken=');
  const storedUser = localStorage.getItem("authorizeUser");
  const isAuthenticated = !!storedUser && (hasAuthCookie || !!storedUser);
  
  console.log("🔍 RootRoute check:", { 
    hasAuthCookie, 
    hasStoredUser: !!storedUser, 
    isAuthenticated 
  });

  if (isAuthenticated) {
    try {
      const user = JSON.parse(storedUser);
      console.log("🔍 RootRoute user check:", { 
        userId: user?.user_id, 
        isVetted: user?.is_vetted 
      });
      
      if (!user.is_vetted) {
        console.log("🔍 RootRoute redirecting to: /vetting");
        window.location.href = '/vetting';
        return null;
      } else {
        console.log("🔍 RootRoute redirecting to: /dashboard");
        window.location.href = '/dashboard';
        return null;
      }
    } catch (error) {
      console.error("🔍 Error parsing stored user:", error);
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
                <Route path="/register" element={<Register />} />
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
