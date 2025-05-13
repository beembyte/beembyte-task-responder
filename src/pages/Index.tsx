
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';

const Index: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 text-center">
          <div>
            <div className="flex justify-center">
              <Logo className="text-primary" />
            </div>
            <h1 className="mt-6 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Beembyte Responder
            </h1>
            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              Accept tasks, complete them efficiently, and get paid for your expertise
            </p>
          </div>
          
          <div className="flex flex-col space-y-4">
            <Button 
              size="lg" 
              className="w-full" 
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full" 
              onClick={() => navigate('/register')}
            >
              Create an Account
            </Button>
          </div>
          
          <div className="pt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">How It Works</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold mx-auto mb-3">1</div>
                <h3 className="font-medium">Accept Tasks</h3>
                <p className="text-sm text-gray-600 mt-1">Find and accept tasks that match your skills</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold mx-auto mb-3">2</div>
                <h3 className="font-medium">Complete Work</h3>
                <p className="text-sm text-gray-600 mt-1">Finish tasks before the deadline</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold mx-auto mb-3">3</div>
                <h3 className="font-medium">Get Paid</h3>
                <p className="text-sm text-gray-600 mt-1">Receive payment directly to your wallet</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="bg-white border-t py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Beembyte. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
