import React, { useState } from 'react';
import { Edit2, Trash2, Check, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';
import { formatDate } from '../utils/dateUtils';
import TaskNotes from './TaskNotes';
import TaskForm from './TaskForm';

interface TaskItemProps {
  taskId: string;
}

const TaskItem: React.FC<TaskItemProps> = ({ taskId }) => {
  const { tasks, deleteTask, markTaskComplete } = useTaskContext();
  const task = tasks.find(t => t.id === taskId);
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [completionNote, setCompletionNote] = useState('');
  const [showCompletionForm, setShowCompletionForm] = useState(false);

  if (!task) return null;
  
  const handleDelete = () => {
    if (window.confirm('Bu görevi silmek istediğinizden emin misiniz?')) {
      deleteTask(taskId);
    }
  };
  
  const handleComplete = () => {
    if (task.status === 'active') {
      setShowCompletionForm(true);
    }
  };
  
  const submitCompletion = () => {
    markTaskComplete(taskId, completionNote);
    setShowCompletionForm(false);
    setCompletionNote('');
  };
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Don't show edit form when showing completion form
  if (isEditing && !showCompletionForm) {
    return (
      <TaskForm 
        isEditing 
        taskId={taskId} 
        onClose={() => setIsEditing(false)} 
      />
    );
  }
  
  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 mb-4 ${
        task.status === 'completed' ? 'border-l-4 border-[#BEE4D0]' : `border-l-4`
      }`}
      style={{ borderLeftColor: task.status === 'completed' ? '#BEE4D0' : task.color }}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-[#232323]'}`}>
              {task.title}
            </h3>
            
            <div className="text-sm text-gray-500 mt-1 flex flex-wrap gap-2">
              <span>{formatDate(task.startDate)}</span>
              {task.endDate && (
                <>
                  <span>-</span>
                  <span>{formatDate(task.endDate)}</span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex space-x-1">
            {task.status === 'active' && (
              <>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-1 text-gray-500 hover:text-blue-500 transition-colors"
                  title="Düzenle"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={handleComplete}
                  className="p-1 text-gray-500 hover:text-green-500 transition-colors"
                  title="Tamamlandı"
                >
                  <Check size={18} />
                </button>
              </>
            )}
            <button 
              onClick={handleDelete}
              className="p-1 text-gray-500 hover:text-[#FF8282] transition-colors"
              title="Sil"
            >
              <Trash2 size={18} />
            </button>
            <button 
              onClick={toggleExpand}
              className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              title={isExpanded ? "Daralt" : "Genişlet"}
            >
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
        </div>
        
        {/* Description if available */}
        {task.description && (
          <p className={`mt-2 text-gray-700 ${task.status === 'completed' ? 'text-gray-400' : ''}`}>
            {task.description}
          </p>
        )}
        
        {/* Completion note if completed */}
        {task.status === 'completed' && task.completionNote && (
          <div className="mt-3 p-2 bg-[#BEE4D0] bg-opacity-20 rounded">
            <p className="text-sm text-gray-600">
              <strong>Tamamlanma Notu:</strong> {task.completionNote}
            </p>
          </div>
        )}
        
        {/* Completion form */}
        {showCompletionForm && (
          <div className="mt-4 p-3 border border-gray-200 rounded-md animate-fadeIn">
            <h4 className="text-sm font-medium mb-2">Tamamlanma Notu</h4>
            <textarea
              value={completionNote}
              onChange={(e) => setCompletionNote(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DBFFCB] transition-all mb-2"
              placeholder="Tamamlanma detaylarını girin (opsiyonel)"
              rows={2}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCompletionForm(false)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={submitCompletion}
                className="px-3 py-1 text-sm bg-[#BEE4D0] text-[#232323] rounded-md hover:bg-[#DBFFCB] transition-colors"
              >
                Tamamla
              </button>
            </div>
          </div>
        )}
        
        {/* Note count badge */}
        {task.notes.length > 0 && !isExpanded && (
          <div className="mt-3 inline-flex items-center text-xs text-gray-500">
            <MessageSquare size={14} className="mr-1" />
            <span>{task.notes.length} not</span>
          </div>
        )}
      </div>
      
      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4 animate-fadeIn">
          <TaskNotes taskId={taskId} />
        </div>
      )}
    </div>
  );
};

export default TaskItem;