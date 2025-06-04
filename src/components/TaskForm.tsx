import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';
import { getCurrentDateString } from '../utils/dateUtils';

interface TaskFormProps {
  isEditing?: boolean;
  taskId?: string;
  onClose?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ isEditing = false, taskId = '', onClose }) => {
  const { tasks, addTask, updateTaskItem } = useTaskContext();
  
  const [isExpanded, setIsExpanded] = useState<boolean>(isEditing);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(getCurrentDateString());
  const [endDate, setEndDate] = useState<string>('');
  const [color, setColor] = useState<string>('#FF6363');
  
  const colors = ['#FF6363', '#FFB563', '#63FF8C', '#63B5FF', '#D463FF'];
  
  // Initialize form with task data when editing
  useEffect(() => {
    if (isEditing && taskId) {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        setTitle(task.title);
        setDescription(task.description);
        setStartDate(task.startDate);
        setEndDate(task.endDate || '');
        setColor(task.color);
        setIsExpanded(true);
      }
    }
  }, [isEditing, taskId, tasks]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Görev başlığı zorunludur.');
      return;
    }
    
    if (isEditing && taskId) {
      updateTaskItem(taskId, {
        title,
        description,
        startDate,
        endDate: endDate || null,
        color
      });
      
      if (onClose) {
        onClose();
      }
    } else {
      addTask(title, description, startDate, endDate || null, color);
      
      // Reset form
      setTitle('');
      setDescription('');
      setStartDate(getCurrentDateString());
      setEndDate('');
      setColor('#FF6363');
      
      if (!isEditing) {
        setIsExpanded(false);
      }
    }
  };
  
  const handleCancel = () => {
    if (isEditing && onClose) {
      onClose();
    } else {
      setIsExpanded(false);
      setTitle('');
      setDescription('');
      setStartDate(getCurrentDateString());
      setEndDate('');
      setColor('#FF6363');
    }
  };
  
  if (!isExpanded && !isEditing) {
    return (
      <div 
        className="bg-white rounded-lg shadow-md p-4 mb-4 cursor-pointer hover:shadow-lg transition-shadow duration-300"
        onClick={() => setIsExpanded(true)}
      >
        <div className="flex items-center text-gray-500">
          <Plus size={20} className="mr-2" />
          <span>Yeni Görev Ekle</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[#232323]">
          {isEditing ? 'Görevi Düzenle' : 'Yeni Görev'}
        </h2>
        <button 
          onClick={handleCancel}
          className="text-gray-500 hover:text-[#FF8282] transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Başlık <span className="text-[#FF8282]">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DBFFCB] transition-all"
            placeholder="Görev başlığı"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Açıklama
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DBFFCB] transition-all"
            placeholder="Görev açıklaması"
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Başlangıç Tarihi
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DBFFCB] transition-all"
            />
          </div>
          
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              Bitiş Tarihi
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DBFFCB] transition-all"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Renk
          </label>
          <div className="flex space-x-2">
            {colors.map((c) => (
              <div
                key={c}
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full cursor-pointer transition-transform hover:scale-110 ${
                  color === c ? 'ring-2 ring-offset-2 ring-gray-400 transform scale-110' : ''
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            İptal
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#DBFFCB] text-[#232323] rounded-md hover:bg-[#BEE4D0] transition-colors"
          >
            {isEditing ? 'Güncelle' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;