
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import Dashboard from './pages/Dashboard';
import PendingTasks from './pages/PendingTasks';
import OngoingTasks from './pages/OngoingTasks';
import CompletedTasks from './pages/CompletedTasks';
import TaskDetail from './pages/TaskDetail';
import SingleTask from '@/pages/SingleTask';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <AuthProvider>
          <TaskProvider>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/pending-tasks" element={<PendingTasks />} />
              <Route path="/ongoing-tasks" element={<OngoingTasks />} />
              <Route path="/completed-tasks" element={<CompletedTasks />} />
              <Route path="/task/:id" element={<SingleTask />} />
            </Routes>
          </TaskProvider>
        </AuthProvider>
      </div>
    </QueryClientProvider>
  );
}

export default App;
