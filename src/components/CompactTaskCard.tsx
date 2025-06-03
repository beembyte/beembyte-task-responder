
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, DollarSign } from 'lucide-react';

interface CompactTaskCardProps {
  task: any;
  onClick?: () => void;
}

const CompactTaskCard: React.FC<CompactTaskCardProps> = ({ task, onClick }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPayment = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-blue-500"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-sm line-clamp-2 flex-1 mr-2">
              {task.title}
            </h3>
            <Badge variant="outline" className="text-xs">
              {task.status || 'pending'}
            </Badge>
          </div>
          
          <p className="text-xs text-gray-600 line-clamp-2">
            {task.description}
          </p>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <DollarSign className="w-3 h-3" />
              <span className="font-medium text-green-600">
                {formatPayment(task.payment || 0)}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{formatDate(task.deadline || task.createdAt)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompactTaskCard;
