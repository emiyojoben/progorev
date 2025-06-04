import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';
import { formatDateTime } from '../utils/dateUtils';

interface TaskNotesProps {
  taskId: string;
}

const TaskNotes: React.FC<TaskNotesProps> = ({ taskId }) => {
  const { tasks, addNote } = useTaskContext();
  const task = tasks.find(t => t.id === taskId);
  
  const [noteText, setNoteText] = useState('');
  
  if (!task) return null;
  
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (noteText.trim()) {
      addNote(taskId, noteText);
      setNoteText('');
    }
  };
  
  return (
    <div className="mt-2">
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Notlar</h4>
        
        {task.notes.length === 0 ? (
          <p className="text-sm text-gray-500 italic">Bu görev için henüz not eklenmemiş.</p>
        ) : (
          <div className="space-y-3">
            {task.notes.map((note) => (
              <div key={note.id} className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm mb-1">{note.text}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock size={12} className="mr-1" />
                  <span>{formatDateTime(note.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <form onSubmit={handleAddNote} className="mt-3">
        <div className="flex space-x-2">
          <input
            type="text"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DBFFCB] transition-all"
            placeholder="Yeni not ekle..."
          />
          <button
            type="submit"
            disabled={!noteText.trim()}
            className="px-3 py-2 bg-[#DBFFCB] text-[#232323] rounded-md hover:bg-[#BEE4D0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Ekle
          </button>
        </div>
      </form>
      
      {task.history.length > 0 && (
        <div className="mt-4">
          <h4 className="text-xs font-medium text-gray-500 mb-2">Geçmiş</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto text-xs">
            {task.history.map((item, index) => {
              let actionText = '';
              
              switch (item.action) {
                case 'created':
                  actionText = 'Görev oluşturuldu';
                  break;
                case 'updated':
                  actionText = 'Görev güncellendi';
                  break;
                case 'completed':
                  actionText = 'Görev tamamlandı';
                  break;
                case 'note_added':
                  actionText = 'Not eklendi';
                  break;
                case 'deleted':
                  actionText = 'Görev silindi';
                  break;
                default:
                  actionText = item.action;
              }
              
              return (
                <div key={index} className="flex items-center text-gray-500">
                  <span className="w-4 h-4 bg-gray-200 rounded-full mr-2"></span>
                  <span>{actionText} - {formatDateTime(item.timestamp)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskNotes;