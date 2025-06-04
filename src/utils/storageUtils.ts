import { Task } from '../types/task';

const STORAGE_KEY = 'task-management-app-tasks';

export const getTasks = (): Task[] => {
  const tasksJson = localStorage.getItem(STORAGE_KEY);
  if (!tasksJson) return [];
  
  try {
    return JSON.parse(tasksJson);
  } catch (error) {
    console.error('Error parsing tasks from localStorage:', error);
    return [];
  }
};

export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to localStorage:', error);
  }
};

export const clearTasks = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};