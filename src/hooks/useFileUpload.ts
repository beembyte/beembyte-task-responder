
import { useState, useCallback } from 'react';
import { fileUploadApi } from '@/services/fileUploadApi';
import { toast } from 'sonner';

export interface UploadResult {
  success: boolean;
  urls?: string[];
  url?: string;
  error?: string;
}

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFiles = useCallback(async (files: File[]): Promise<UploadResult> => {
    if (!files || files.length === 0) {
      return { success: false, error: 'No files provided' };
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      
      // Append all files to the FormData
      files.forEach((file) => {
        formData.append('files', file);
      });

      console.log('Uploading files:', files.map(f => f.name));

      const response = await fileUploadApi.uploadMultiple(formData);
      
      if (response.success && response.urls) {
        setUploadProgress(100);
        toast.success(`Successfully uploaded ${files.length} file(s)`);
        return { success: true, urls: response.urls };
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (error) {
      console.error('File upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload files';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, []);

  const uploadSingleFile = useCallback(async (file: File): Promise<UploadResult> => {
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      console.log('Uploading single file:', file.name);

      const response = await fileUploadApi.uploadSingle(file);
      
      if (response.success && response.url) {
        setUploadProgress(100);
        toast.success('File uploaded successfully');
        return { success: true, url: response.url };
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Single file upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, []);

  return {
    uploadFiles,
    uploadSingleFile,
    isUploading,
    uploadProgress,
  };
};
