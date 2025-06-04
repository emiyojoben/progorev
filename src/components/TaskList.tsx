import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import TaskItem from './TaskItem';
import { ClipboardList } from 'lucide-react';

const TaskList: React.FC = () => {
  const { filteredTasks } = useTaskContext();
  
  if (filteredTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <ClipboardList size={48} className="mb-4 opacity-30" />
        <p className="text-lg">Görev bulunamadı</p>
        <p className="text-sm mt-1">Yeni bir görev ekleyin veya filtreleri değiştirin</p>
      </div>
    );
  }
  
  // Group tasks by status
  const activeTasks = filteredTasks.filter(task => task.status === 'active');
  const completedTasks = filteredTasks.filter(task => task.status === 'completed');
  
  return (
    <div>
      {/* Active tasks */}
      {activeTasks.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-[#232323] border-b pb-2">
            Aktif Görevler ({activeTasks.length})
          </h2>
          <div className="space-y-3">
            {activeTasks.map(task => (
              <TaskItem key={task.id} taskId={task.id} />
            ))}
          </div>
        </div>
      )}
      
      {/* Completed tasks */}
      {completedTasks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3 text-[#232323] border-b pb-2">
            Tamamlanan Görevler ({completedTasks.length})
          </h2>
          <div className="space-y-3">
            {completedTasks.map(task => (
              <TaskItem key={task.id} taskId={task.id} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;