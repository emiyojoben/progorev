import React, { useState, useEffect } from 'react';
import { X, Plus, Clock, Tags, Brain, Target, Sparkles } from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';
import { getCurrentDateString } from '../utils/dateUtils';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [priority, setPriority] = useState<number>(3);
  const [estimatedTime, setEstimatedTime] = useState<number>(30);
  const [category, setCategory] = useState<string>('Uncategorized');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>('');
  const [showAIsuggestions, setShowAIsuggestions] = useState<boolean>(false);
  
  const colors = ['#FF6363', '#FFB563', '#63FF8C', '#63B5FF', '#D463FF'];
  const categories = ['İş', 'Kişisel', 'Sağlık', 'Eğitim', 'Alışveriş', 'Uncategorized'];
  
  useEffect(() => {
    if (isEditing && taskId) {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        setTitle(task.title);
        setDescription(task.description);
        setStartDate(task.startDate);
        setEndDate(task.endDate || '');
        setColor(task.color);
        setPriority(task.metrics.priority);
        setEstimatedTime(task.metrics.estimatedTime || 30);
        setCategory(task.metrics.category);
        setTags(task.metrics.tags);
      }
    }
  }, [isEditing, taskId, tasks]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Görev başlığı zorunludur.');
      return;
    }
    
    const taskData = {
      title,
      description,
      startDate,
      endDate: endDate || null,
      color,
      metrics: {
        priority,
        estimatedTime,
        category,
        tags,
        actualTime: 0,
        streak: 0,
        completionRate: 0
      }
    };
    
    if (isEditing && taskId) {
      updateTaskItem(taskId, taskData);
      if (onClose) onClose();
    } else {
      addTask(
        title,
        description,
        startDate,
        endDate || null,
        color,
        priority,
        estimatedTime,
        category,
        tags
      );
      resetForm();
    }
  };
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartDate(getCurrentDateString());
    setEndDate('');
    setColor('#FF6363');
    setPriority(3);
    setEstimatedTime(30);
    setCategory('Uncategorized');
    setTags([]);
    setNewTag('');
    if (!isEditing) setIsExpanded(false);
  };
  
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const simulateAISuggestions = () => {
    setShowAIsuggestions(true);
    // Simüle edilmiş AI önerileri
    setTimeout(() => {
      if (title.toLowerCase().includes('toplantı')) {
        setPriority(4);
        setEstimatedTime(60);
        setCategory('İş');
        setTags(['meeting', 'important']);
      }
      setShowAIsuggestions(false);
    }, 1000);
  };
  
  if (!isExpanded && !isEditing) {
    return (
      <motion.div 
        className="bg-white rounded-lg shadow-md p-4 mb-4 cursor-pointer hover:shadow-lg transition-shadow duration-300"
        onClick={() => setIsExpanded(true)}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center text-gray-500">
          <Plus size={20} className="mr-2" />
          <span>Yeni Görev Ekle</span>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md p-4 mb-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[#232323]">
          {isEditing ? 'Görevi Düzenle' : 'Yeni Görev'}
        </h2>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={simulateAISuggestions}
            className="text-gray-500 hover:text-[#BEE4D0] transition-colors"
            disabled={!title || showAIsuggestions}
          >
            <Brain size={20} />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            onClick={() => isEditing && onClose ? onClose() : resetForm()}
            className="text-gray-500 hover:text-[#FF8282] transition-colors"
          >
            <X size={20} />
          </motion.button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Başlık <span className="text-[#FF8282]">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.length > 3) simulateAISuggestions();
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DBFFCB] transition-all"
              placeholder="Görev başlığı"
              required
            />
            <AnimatePresence>
              {showAIsuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-2 top-2"
                >
                  <Sparkles className="text-[#BEE4D0] animate-pulse" size={20} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Açıklama
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DBFFCB] transition-all"
            placeholder="Görev açıklaması"
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Başlangıç Tarihi
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DBFFCB] transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bitiş Tarihi
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DBFFCB] transition-all"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Öncelik
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((p) => (
                <motion.button
                  key={p}
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setPriority(p)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    priority === p
                      ? 'bg-[#BEE4D0] text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {p}
                </motion.button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tahmini Süre (dk)
            </label>
            <div className="flex items-center">
              <Clock size={20} className="text-gray-400 mr-2" />
              <input
                type="number"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(parseInt(e.target.value))}
                min="5"
                step="5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DBFFCB] transition-all"
              />
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kategori
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DBFFCB] transition-all"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Etiketler
          </label>
          <div className="flex items-center mb-2">
            <Tags size={20} className="text-gray-400 mr-2" />
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              placeholder="Yeni etiket ekle"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#DBFFCB] transition-all"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-[#DBFFCB] text-[#232323] rounded-r-md hover:bg-[#BEE4D0] transition-colors"
            >
              Ekle
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <motion.span
                key={tag}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-[#DBFFCB] text-[#232323]"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-[#FF8282] hover:text-[#FF6363]"
                >
                  <X size={14} />
                </button>
              </motion.span>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Renk
          </label>
          <div className="flex space-x-2">
            {colors.map((c) => (
              <motion.div
                key={c}
                whileHover={{ scale: 1.1 }}
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full cursor-pointer transition-transform ${
                  color === c ? 'ring-2 ring-offset-2 ring-gray-400 transform scale-110' : ''
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            onClick={() => isEditing && onClose ? onClose() : resetForm()}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            İptal
          </motion.button>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            className="px-4 py-2 bg-[#DBFFCB] text-[#232323] rounded-md hover:bg-[#BEE4D0] transition-colors"
          >
            {isEditing ? 'Güncelle' : 'Kaydet'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default TaskForm;