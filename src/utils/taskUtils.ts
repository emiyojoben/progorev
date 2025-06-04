import { Task, TaskFilters, Note, HistoryItem } from '../types/task';
import { getCurrentDateString, getCurrentTimestamp } from './dateUtils';
import { v4 as uuidv4 } from 'uuid';

export const generateId = (): string => {
  return uuidv4();
};

export const createTask = (
  title: string,
  description: string = '',
  startDate: string = getCurrentDateString(),
  endDate: string | null = null,
  color: string = '#FF6363'
): Task => {
  const timestamp = getCurrentTimestamp();
  
  return {
    id: generateId(),
    title,
    description,
    startDate,
    endDate,
    color,
    status: 'active',
    createdAt: timestamp,
    completedAt: null,
    completionNote: null,
    notes: [],
    history: [
      {
        action: 'created',
        timestamp,
        details: { title, description, startDate, endDate, color }
      }
    ]
  };
};

export const addNoteToTask = (task: Task, noteText: string): Task => {
  const timestamp = getCurrentTimestamp();
  const newNote: Note = {
    id: generateId(),
    text: noteText,
    timestamp
  };
  
  const updatedHistory: HistoryItem[] = [
    ...task.history,
    {
      action: 'note_added',
      timestamp,
      details: { noteId: newNote.id, text: noteText }
    }
  ];
  
  return {
    ...task,
    notes: [...task.notes, newNote],
    history: updatedHistory
  };
};

export const completeTask = (task: Task, completionNote: string = ''): Task => {
  const timestamp = getCurrentTimestamp();
  
  const updatedHistory: HistoryItem[] = [
    ...task.history,
    {
      action: 'completed',
      timestamp,
      details: { completionNote }
    }
  ];
  
  return {
    ...task,
    status: 'completed',
    completedAt: timestamp,
    completionNote: completionNote || null,
    history: updatedHistory
  };
};

export const updateTask = (
  task: Task,
  updates: Partial<Task>
): Task => {
  const timestamp = getCurrentTimestamp();
  
  const updatedHistory: HistoryItem[] = [
    ...task.history,
    {
      action: 'updated',
      timestamp,
      details: { ...updates }
    }
  ];
  
  return {
    ...task,
    ...updates,
    history: updatedHistory
  };
};

export const filterTasks = (tasks: Task[], filters: TaskFilters): Task[] => {
  return tasks.filter(task => {
    // Text search filter
    const textMatches = !filters.searchText || 
      task.title.toLowerCase().includes(filters.searchText.toLowerCase()) ||
      task.description.toLowerCase().includes(filters.searchText.toLowerCase());
    
    // Status filter
    const statusMatches = filters.status === 'all' || task.status === filters.status;
    
    // Date range filter
    const startDateMatches = !filters.startDate || task.startDate >= filters.startDate;
    const endDateMatches = !filters.endDate || 
      (task.endDate && task.endDate <= filters.endDate);
    
    // Color filter
    const colorMatches = !filters.color || task.color === filters.color;
    
    return textMatches && statusMatches && startDateMatches && endDateMatches && colorMatches;
  });
};