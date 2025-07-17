
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { vettingApi, VettingSubmissionRequest, VettingResponse } from '../services/vettingApi';
import { useToast } from './use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useVetting = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Submit vetting application
  const submitVettingMutation = useMutation({
    mutationFn: (vettingData: VettingSubmissionRequest) => vettingApi.submitVetting(vettingData),
    onSuccess: async (data: VettingResponse) => {
      if (data.success) {
        toast({
          title: "Vetting Application Submitted",
          description: "Your application has been submitted for review. Redirecting to dashboard...",
        });
        
        try {
          // Refresh user profile to get updated vetting status
          await refreshUser();
          
          // Navigate to dashboard after successful submission
          navigate('/dashboard');
        } catch (error) {
          console.error('Failed to refresh user after vetting:', error);
          // Still navigate to dashboard even if refresh fails
          navigate('/dashboard');
        }
      } else {
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: data.message || "Failed to submit your vetting application. Please try again.",
        });
      }
    },
    onError: (error) => {
      console.error('Vetting submission error:', error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "Failed to submit your vetting application. Please try again.",
      });
    },
  });

  // Get vetting status
  const { data: vettingStatus, isLoading: isLoadingStatus, refetch: refetchStatus } = useQuery({
    queryKey: ['vettingStatus'],
    queryFn: () => vettingApi.getVettingStatus(),
    enabled: false, // Only fetch when explicitly called
  });

  const submitVetting = async (vettingData: VettingSubmissionRequest) => {
    setIsSubmitting(true);
    try {
      await submitVettingMutation.mutateAsync(vettingData);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitVetting,
    isSubmitting: isSubmitting || submitVettingMutation.isPending,
    vettingStatus: vettingStatus?.data,
    isLoadingStatus,
    refetchStatus,
    error: submitVettingMutation.error,
  };
};
