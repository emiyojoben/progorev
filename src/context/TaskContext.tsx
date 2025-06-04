import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, TaskFilters } from '../types/task';
import { getTasks, saveTasks } from '../utils/storageUtils';
import { 
  createTask, 
  updateTask, 
  completeTask, 
  addNoteToTask, 
  filterTasks 
} from '../utils/taskUtils';

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  filters: TaskFilters;
  selectedTaskId: string | null;
  addTask: (title: string, description: string, startDate: string, endDate: string | null, color: string) => void;
  deleteTask: (id: string) => void;
  updateTaskItem: (id: string, updates: Partial<Task>) => void;
  markTaskComplete: (id: string, completionNote: string) => void;
  addNote: (taskId: string, noteText: string) => void;
  setFilters: (filters: Partial<TaskFilters>) => void;
  resetFilters: () => void;
  selectTask: (id: string | null) => void;
}

const defaultFilters: TaskFilters = {
  searchText: '',
  startDate: null,
  endDate: null,
  status: 'all',
  color: null
};

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFilters>(defaultFilters);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const loadedTasks = getTasks();
    setTasks(loadedTasks);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Update filtered tasks whenever tasks or filters change
  useEffect(() => {
    setFilteredTasks(filterTasks(tasks, filters));
  }, [tasks, filters]);

  const addTask = (
    title: string,
    description: string = '',
    startDate: string,
    endDate: string | null = null,
    color: string = '#FF6363'
  ) => {
    const newTask = createTask(title, description, startDate, endDate, color);
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    if (selectedTaskId === id) {
      setSelectedTaskId(null);
    }
  };

  const updateTaskItem = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === id ? updateTask(task, updates) : task
    ));
  };

  const markTaskComplete = (id: string, completionNote: string = '') => {
    setTasks(tasks.map(task => 
      task.id === id ? completeTask(task, completionNote) : task
    ));
  };

  const addNote = (taskId: string, noteText: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? addNoteToTask(task, noteText) : task
    ));
  };

  const updateFilters = (newFilters: Partial<TaskFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const selectTask = (id: string | null) => {
    setSelectedTaskId(id);
  };

  const value: TaskContextType = {
    tasks,
    filteredTasks,
    filters,
    selectedTaskId,
    addTask,
    deleteTask,
    updateTaskItem,
    markTaskComplete,
    addNote,
    setFilters: updateFilters,
    resetFilters,
    selectTask
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};