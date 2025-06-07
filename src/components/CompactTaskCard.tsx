
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface CompactTaskCardProps {
  task: any;
  onClick?: () => void;
}

const CompactTaskCard: React.FC<CompactTaskCardProps> = ({ task, onClick }) => {
  const navigate = useNavigate();

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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'hard':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/task/${task._id}`);
    }
  };

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-blue-500"
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-sm line-clamp-2 flex-1 mr-2">
              {task.title}
            </h3>
            <div className="flex gap-1">
              <Badge variant="outline" className="text-xs">
                {task.status || 'pending'}
              </Badge>
              {task.difficulty && (
                <Badge className={`text-xs ${getDifficultyColor(task.difficulty)}`}>
                  {task.difficulty}
                </Badge>
              )}
            </div>
          </div>

          <p className="text-xs text-gray-600 line-clamp-2">
            {task.description}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <span className="font-medium text-green-600">
                {formatPayment(task.price || 0)}
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
