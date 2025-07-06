
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/Logo';
import PasswordValidation from '@/components/PasswordValidation';
import { authApi } from '@/services/authApi';
import { handleApiErrors } from '@/utils/apiResponse';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const resetUserId = localStorage.getItem("resetUserId");
    const resetCode = localStorage.getItem("resetCode");
    
    if (!resetUserId || !resetCode) {
      navigate("/forgot-password");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    
    setLoading(true);
    
    try {
      const resetUserId = localStorage.getItem("resetUserId")!;
      const resetCode = localStorage.getItem("resetCode")!;
      
      const response = await authApi.resetPassword({
        code: resetCode,
        new_password: newPassword,
        confirm_password: confirmPassword,
        user_id: resetUserId
      });
      
      if (response.success) {
        const message = typeof response.message === 'string' ? response.message : response.message?.message || "Password reset successfully!";
        toast.success(message);
        
        // Clean up stored data
        localStorage.removeItem("resetEmail");
        localStorage.removeItem("resetUserId");
        localStorage.removeItem("resetCode");
        
        navigate("/login");
      } else {
        if (typeof response.message === 'string') {
          handleApiErrors({ ...response, message: response.message });
        } else {
          toast.error(response.message?.message || "Password reset failed");
        }
      }
    } catch (error) {
      console.error('Password reset failed:', error);
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>Enter your new password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="newPassword" className="text-sm font-medium">New Password</label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? "Hide" : "Show"}
                </button>
              </div>
              <PasswordValidation password={newPassword} />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm New Password</label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-sm text-red-600">Passwords do not match</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full mt-6 flex items-center justify-center gap-2"
              disabled={loading || newPassword !== confirmPassword || newPassword.length < 8}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Resetting password...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
