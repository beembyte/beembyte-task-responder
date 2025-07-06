
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import Logo from '@/components/Logo';
import { authApi } from '@/services/authApi';
import { handleApiErrors } from '@/utils/apiResponse';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const VerifyResetOTP: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const resetEmail = localStorage.getItem("resetEmail");
    if (!resetEmail) {
      navigate("/forgot-password");
      return;
    }
    setEmail(resetEmail);
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await authApi.verifyOTP({
        code,
        type: "forgot_password"
      });
      
      if (response.success && response.data?.user_id) {
        const message = typeof response.message === 'string' ? response.message : response.message?.message || "OTP verified successfully!";
        toast.success(message);
        
        // Store user_id and code for password reset
        localStorage.setItem("resetUserId", response.data.user_id);
        localStorage.setItem("resetCode", code);
        navigate("/reset-password");
      } else {
        if (typeof response.message === 'string') {
          handleApiErrors({ ...response, message: response.message });
        } else {
          toast.error(response.message?.message || "OTP verification failed");
        }
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    try {
      const response = await authApi.forgotPassword(email);
      if (response.success) {
        toast.success("New reset code sent to your email!");
      } else {
        toast.error("Failed to resend code. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to resend code. Please try again.");
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
          <CardTitle className="text-2xl">Verify Reset Code</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to {email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={code}
                onChange={(value) => setCode(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2"
              disabled={loading || code.length !== 6}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={handleResendCode}
              className="text-sm text-primary hover:underline"
              disabled={loading}
            >
              Didn't receive the code? Resend
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyResetOTP;
