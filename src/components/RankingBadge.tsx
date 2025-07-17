
import React from 'react';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RankingBadgeProps {
  rankStatus?: {
    rank_name: string;
    rank_color: string;
    criteria: {
      tasks_completed: number;
      minimum_rating: number;
    };
  } | {
    rank_name: string;
    rank_color: string;
    min_tasks_completed: number;
    min_rating: number;
  };
  userCriteria?: {
    tasks_completed: number;
    minimum_rating: number;
  };
  completedTasks?: number; // Fallback for backward compatibility
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
}

const RankingBadge: React.FC<RankingBadgeProps> = ({ 
  rankStatus, 
  userCriteria, 
  completedTasks = 0, 
  size = 'md', 
  showProgress = false 
}) => {
  // If we have API data, use it; otherwise fall back to old hardcoded system
  if (rankStatus && userCriteria) {
    // Handle both API response formats
    const criteriaTasksCompleted = 'criteria' in rankStatus 
      ? rankStatus.criteria.tasks_completed 
      : rankStatus.min_tasks_completed;
    
    const progress = criteriaTasksCompleted > 0 
      ? (userCriteria.tasks_completed / criteriaTasksCompleted) * 100
      : 100;

    const iconSize = size === 'sm' ? 12 : size === 'md' ? 14 : 16;
    const badgeSize = size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base';

    return (
      <div className="flex flex-col items-start space-y-2">
        <Badge 
          className={`text-white ${badgeSize} flex items-center space-x-1`}
          style={{ backgroundColor: rankStatus.rank_color }}
        >
          <Star size={iconSize} fill="currentColor" />
          <span>{rankStatus.rank_name}</span>
        </Badge>
        
        {showProgress && (
          <div className="w-full">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{userCriteria.tasks_completed} tasks</span>
              <span>{criteriaTasksCompleted} for next rank</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min(progress, 100)}%`,
                  backgroundColor: rankStatus.rank_color 
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Fallback to old hardcoded system for backward compatibility
  const RANKS = [
    { name: 'Rookie', min: 0, max: 4, color: 'bg-gray-500', textColor: 'text-gray-100' },
    { name: 'Explorer', min: 5, max: 14, color: 'bg-green-500', textColor: 'text-green-100' },
    { name: 'Specialist', min: 15, max: 29, color: 'bg-blue-500', textColor: 'text-blue-100' },
    { name: 'Expert', min: 30, max: 49, color: 'bg-purple-500', textColor: 'text-purple-100' },
    { name: 'Master', min: 50, max: 99, color: 'bg-orange-500', textColor: 'text-orange-100' },
    { name: 'Legend', min: 100, max: Infinity, color: 'bg-yellow-500', textColor: 'text-yellow-900' }
  ];

  const currentRank = RANKS.find(rank => completedTasks >= rank.min && completedTasks <= rank.max) || RANKS[0];
  const nextRank = RANKS.find(rank => rank.min > completedTasks);
  
  const progress = nextRank 
    ? ((completedTasks - currentRank.min) / (nextRank.min - currentRank.min)) * 100
    : 100;

  const iconSize = size === 'sm' ? 12 : size === 'md' ? 14 : 16;
  const badgeSize = size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base';

  return (
    <div className="flex flex-col items-start space-y-2">
      <Badge className={`${currentRank.color} ${currentRank.textColor} ${badgeSize} flex items-center space-x-1`}>
        <Star size={iconSize} fill="currentColor" />
        <span>{currentRank.name}</span>
      </Badge>
      
      {showProgress && nextRank && (
        <div className="w-full">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{completedTasks} tasks</span>
            <span>{nextRank.min} for {nextRank.name}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${currentRank.color}`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RankingBadge;
