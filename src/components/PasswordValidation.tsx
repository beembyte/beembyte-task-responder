
import React from 'react';
import { Check } from 'lucide-react';

interface PasswordValidationProps {
  password: string;
}

interface ValidationRule {
  label: string;
  test: (password: string) => boolean;
}

const PasswordValidation: React.FC<PasswordValidationProps> = ({ password }) => {
  const validationRules: ValidationRule[] = [
    {
      label: 'At least 8 characters long',
      test: (pwd) => pwd.length >= 8
    },
    {
      label: 'Contains at least one uppercase letter',
      test: (pwd) => /[A-Z]/.test(pwd)
    },
    {
      label: 'Contains at least one lowercase letter',
      test: (pwd) => /[a-z]/.test(pwd)
    },
    {
      label: 'Contains at least one number',
      test: (pwd) => /[0-9]/.test(pwd)
    },
    {
      label: 'Contains at least one special character',
      test: (pwd) => /[\W_]/.test(pwd)
    }
  ];

  return (
    <div className="mt-2 space-y-1">
      {validationRules.map((rule, index) => {
        const isValid = rule.test(password);
        return (
          <div key={index} className={`flex items-center text-xs ${isValid ? 'text-green-600' : 'text-gray-500'}`}>
            <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${isValid ? 'bg-green-100' : 'bg-gray-100'}`}>
              {isValid && <Check className="w-3 h-3 text-green-600" />}
            </div>
            <span>{rule.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default PasswordValidation;
