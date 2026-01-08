'use client';

import type { Task } from '@/types';
import { Calendar, CheckCircle, Circle, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onComplete, onEdit, onDelete }: TaskCardProps) {
  const isOverdue = new Date(task.deadline) < new Date() && !task.isCompleted;
  const deadlineDate = new Date(task.deadline);

  return (
    <div className={`card hover:shadow-lg transition-shadow duration-200 ${
      task.isCompleted ? 'bg-gray-50' : ''
    } ${isOverdue ? 'border-l-4 border-red-500' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-start space-x-3">
            <button
              onClick={() => !task.isCompleted && onComplete(task._id)}
              className="mt-1 focus:outline-none"
              disabled={task.isCompleted}
            >
              {task.isCompleted ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <Circle className="w-6 h-6 text-gray-400 hover:text-primary-600 transition-colors" />
              )}
            </button>
            
            <div className="flex-1">
              <h3 className={`text-lg font-semibold ${
                task.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'
              }`}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className={`text-sm mt-1 ${
                  task.isCompleted ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {task.description}
                </p>
              )}
              
              <div className="flex items-center space-x-2 mt-3">
                <Calendar className={`w-4 h-4 ${
                  isOverdue ? 'text-red-500' : task.isCompleted ? 'text-gray-400' : 'text-primary-600'
                }`} />
                <span className={`text-sm ${
                  isOverdue ? 'text-red-500 font-medium' : task.isCompleted ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {format(deadlineDate, 'PPp')}
                  {isOverdue && ' (Overdue)'}
                </span>
              </div>

              {task.isCompleted && (
                <span className="inline-block mt-2 px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                  Completed
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="Edit task"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
// "use client";

// import { format } from "date-fns";
// import Link from "next/link";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import type { Task } from "@/types/task";
// import { completeTask, deleteTask } from "@/services/task.service";
// import { toast } from "sonner";
// import { useState } from "react";

// interface TaskCardProps {
//   task: Task;
//   onUpdate: () => void;
// }

// export function TaskCard({ task, onUpdate }: TaskCardProps) {
//   const [isLoading, setIsLoading] = useState(false);

//   const handleComplete = async () => {
//     setIsLoading(true);
//     try {
//       await completeTask(task.id);
//       toast.success("Task marked as completed");
//       onUpdate();
//     } catch (error) {
//       console.error("Error completing task:", error);
//       toast.error("Failed to complete task");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (!confirm("Are you sure you want to delete this task?")) {
//       return;
//     }

//     setIsLoading(true);
//     try {
//       await deleteTask(task.id);
//       toast.success("Task deleted");
//       onUpdate();
//     } catch (error) {
//       console.error("Error deleting task:", error);
//       toast.error("Failed to delete task");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const deadline = new Date(task.deadline);
//   const isOverdue = !task.isCompleted && deadline < new Date();
//   const isDueSoon = !task.isCompleted && deadline <= new Date(Date.now() + 24 * 60 * 60 * 1000);

//   return (
//     <Card className={`${task.isCompleted ? "opacity-60" : ""} ${isOverdue ? "border-red-500" : ""}`}>
//       <CardHeader>
//         <div className="flex items-start justify-between">
//           <div className="flex-1">
//             <CardTitle className={task.isCompleted ? "line-through" : ""}>
//               {task.title}
//             </CardTitle>
//             {task.description && (
//               <CardDescription className="mt-2">
//                 {task.description}
//               </CardDescription>
//             )}
//           </div>
//           {task.isCompleted && (
//             <Badge variant="secondary" className="ml-2">
//               Completed
//             </Badge>
//           )}
//         </div>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-2 text-sm">
//           <div className="flex items-center justify-between">
//             <span className="text-gray-600">Deadline:</span>
//             <span className={isOverdue ? "font-semibold text-red-600" : isDueSoon ? "font-semibold text-orange-600" : ""}>
//               {format(deadline, "MMM dd, yyyy")}
//             </span>
//           </div>
//           {isOverdue && !task.isCompleted && (
//             <Badge variant="destructive" className="mt-2">
//               Overdue
//             </Badge>
//           )}
//           {isDueSoon && !task.isCompleted && !isOverdue && (
//             <Badge variant="outline" className="mt-2 border-orange-500 text-orange-600">
//               Due Soon
//             </Badge>
//           )}
//         </div>
//       </CardContent>
//       <CardFooter className="flex justify-between gap-2">
//         <div className="flex gap-2">
//           {!task.isCompleted && (
//             <Button
//               size="sm"
//               onClick={handleComplete}
//               disabled={isLoading}
//             >
//               Mark Complete
//             </Button>
//           )}
//           <Button
//             size="sm"
//             variant="outline"
//             asChild
//           >
//             <Link href={`/tasks/${task.id}/edit`}>Edit</Link>
//           </Button>
//         </div>
//         <Button
//           size="sm"
//           variant="destructive"
//           onClick={handleDelete}
//           disabled={isLoading}
//         >
//           Delete
//         </Button>
//       </CardFooter>
//     </Card>
//   );
// }


