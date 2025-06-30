
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Clock, CheckCircle } from 'lucide-react';

interface AccountActivationBannerProps {
  isActivated?: boolean;
}

const AccountActivationBanner: React.FC<AccountActivationBannerProps> = ({ 
  isActivated = false 
}) => {
  if (isActivated) {
    return (
      <Alert className="bg-green-50 border-green-200 mb-6">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Account Activated!</AlertTitle>
        <AlertDescription className="text-green-700">
          Your account has been successfully activated. You can now view and respond to tasks.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="bg-yellow-50 border-yellow-200 mb-6">
      <Clock className="h-4 w-4 text-yellow-600" />
      <AlertTitle className="text-yellow-800">Account Under Review</AlertTitle>
      <AlertDescription className="text-yellow-700">
        Thank you for completing your profile! Your account is currently being reviewed by our team. 
        You'll be notified once your account is activated and you can start viewing tasks.
      </AlertDescription>
    </Alert>
  );
};

export default AccountActivationBanner;
