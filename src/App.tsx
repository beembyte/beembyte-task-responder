
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import Dashboard from './pages/Dashboard';
import PendingTasks from './pages/PendingTasks';
import OngoingTasks from './pages/OngoingTasks';
import CompletedTasks from './pages/CompletedTasks';
import TaskDetail from './pages/TaskDetail';
import SingleTask from '@/pages/SingleTask';
import TaskHistory from '@/pages/TaskHistory';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import VerifyCode from '@/pages/VerifyCode';
import Profile from '@/pages/Profile';
import Wallet from '@/pages/Wallet';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="App">
          <AuthProvider>
            <TaskProvider>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-code" element={<VerifyCode />} />
                <Route path="/pending-tasks" element={<PendingTasks />} />
                <Route path="/ongoing-tasks" element={<OngoingTasks />} />
                <Route path="/completed-tasks" element={<CompletedTasks />} />
                <Route path="/task/:id" element={<SingleTask />} />
                <Route path="/task-history" element={<TaskHistory />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/wallet" element={<Wallet />} />
              </Routes>
            </TaskProvider>
          </AuthProvider>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
