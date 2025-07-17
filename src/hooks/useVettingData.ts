
import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '@/config/env';

interface Category {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Tool {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface CategoriesResponse {
  message: string;
  data: Category[];
  success: boolean;
}

interface ToolsResponse {
  message: string;
  data: Tool[];
  success: boolean;
}

const fetchCategories = async (): Promise<CategoriesResponse> => {
  const response = await fetch(`${API_BASE_URL}/users/preferred-categories`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

const fetchTools = async (): Promise<ToolsResponse> => {
  const response = await fetch(`${API_BASE_URL}/users/tools-technologies`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const useVettingData = () => {
  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const { data: toolsData, isLoading: isLoadingTools } = useQuery({
    queryKey: ['tools'],
    queryFn: fetchTools,
  });

  return {
    categories: categoriesData?.data || [],
    tools: toolsData?.data || [],
    isLoadingCategories,
    isLoadingTools,
  };
};
