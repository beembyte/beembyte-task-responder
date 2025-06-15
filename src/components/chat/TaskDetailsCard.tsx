
```tsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TaskInfo } from "@/types";
import { format } from "date-fns";

interface TaskDetailsCardProps {
  task: TaskInfo | null;
}

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground break-words">{value || "—"}</p>
    </div>
);

const TaskDetailsCard: React.FC<TaskDetailsCardProps> = ({ task }) => {
  if (!task) return null;

  const formatPayment = (amount: number) => {
    // The screenshot shows an unusual format, so we'll format as standard USD.
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100); 
  };

  const statusColor = task.status === 'INPROGRESS' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800';

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="p-4 border-t">
        <CardTitle className="text-base font-semibold">Task Details</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 text-sm space-y-3">
        <DetailItem label="Title" value={task.title} />
        <DetailItem label="Subject" value={task.subject} />
        <DetailItem label="Description" value={task.description} />
        <DetailItem label="Price" value={<span className="font-semibold text-green-600">{formatPayment(task.price)}</span>} />
        <DetailItem 
          label="Status" 
          value={
            <span className={`px-2 py-0.5 text-xs font-semibold rounded-md inline-block ${statusColor}`}>
              {task.status}
            </span>
          }
        />
        <DetailItem label="Created" value={format(new Date(task.createdAt), "MMM d, yyyy, h:mm a")} />
      </CardContent>
    </Card>
  );
};

export default TaskDetailsCard;
```
