
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import { TaskProvider } from "./context/TaskContext";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TaskHistory from "./pages/TaskHistory";
import Profile from "./pages/Profile";
import TaskDetail from "./pages/TaskDetail";
import NotFound from "./pages/NotFound";
import Wallet from "./pages/Wallet";
import Chat from "./pages/Chat";
import VerifyCode from "./pages/VerifyCode";
import PendingTasks from "./pages/PendingTasks";
import OngoingTasks from "./pages/OngoingTasks";
import CompletedTasks from "./pages/CompletedTasks";

const queryClient = new QueryClient();

// Helper function to check if user is authenticated
const isUserAuthenticated = () => {
  const storedUser = localStorage.getItem("authorizeUser");
  const authCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('authToken='));
  
  return !!(storedUser && authCookie);
};

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = isUserAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Auth layout route component
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = isUserAuthenticated();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if auth state is resolved
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <TaskProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
        <Route path="/verify-code" element={<VerifyCode />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/task-history" element={<ProtectedRoute><TaskHistory /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/task/:id" element={<ProtectedRoute><TaskDetail /></ProtectedRoute>} />
        <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
        <Route path="/chat/:id" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        
        {/* Task Management Routes */}
        <Route path="/pending-tasks" element={<ProtectedRoute><PendingTasks /></ProtectedRoute>} />
        <Route path="/ongoing-tasks" element={<ProtectedRoute><OngoingTasks /></ProtectedRoute>} />
        <Route path="/completed-tasks" element={<ProtectedRoute><CompletedTasks /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </TaskProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
