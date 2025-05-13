
import React, { useMemo } from 'react';
import { Progress } from '@/components/ui/progress';

interface ProgressIndicatorProps {
  startDate: Date;
  endDate: Date;
  className?: string;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ startDate, endDate, className }) => {
  const { percentage, color } = useMemo(() => {
    const now = new Date();
    const total = endDate.getTime() - startDate.getTime();
    const elapsed = now.getTime() - startDate.getTime();
    
    let calculatedPercentage = Math.min(Math.max(Math.round((elapsed / total) * 100), 0), 100);
    
    // Color calculation: green (hsl(142, 71%, 45%)) to red (hsl(0, 84%, 60%))
    // First half: green to yellow, second half: yellow to red
    let hue;
    if (calculatedPercentage <= 50) {
      // Green (142) to Yellow (60)
      hue = 142 - (142 - 60) * (calculatedPercentage / 50);
    } else {
      // Yellow (60) to Red (0)
      hue = 60 - 60 * ((calculatedPercentage - 50) / 50);
    }
    
    // Ensure hue is within valid range
    hue = Math.max(Math.min(hue, 142), 0);
    
    return { 
      percentage: calculatedPercentage, 
      color: `hsl(${hue}, 71%, 45%)`
    };
  }, [startDate, endDate]);

  return (
    <div className={`w-full ${className}`}>
      <Progress 
        value={percentage} 
        className="h-2"
        style={{ 
          '--progress-color': color
        } as React.CSSProperties}
        indicatorStyle={{ backgroundColor: color }}
      />
      <div className="mt-1 flex justify-between text-xs text-gray-500">
        <span>Progress</span>
        <span>{percentage}%</span>
      </div>
    </div>
  );
};

export default ProgressIndicator;
