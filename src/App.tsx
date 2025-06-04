import React from 'react';
import { TaskProvider, useTaskContext } from './context/TaskContext';
import TaskForm from './components/TaskForm';
import TaskFilters from './components/TaskFilters';
import TaskList from './components/TaskList';
import TaskAnalytics from './components/TaskAnalytics';
import AchievementSystem from './components/AchievementSystem';
import { CheckCircle2, ListTodo } from 'lucide-react';
import ParticleBackground from './components/ParticleBackground';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  return (
    <TaskProvider>
      <div className="min-h-screen bg-[#ffffff] text-[#232323] relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none">
          <ParticleBackground />
        </div>
        
        <div className="relative z-10">
          <motion.header 
            className="bg-[#DBFFCB] backdrop-blur-lg bg-opacity-80 shadow-sm"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <ListTodo size={28} className="mr-2" />
                </motion.div>
                <h1 className="text-2xl font-bold">Görev Yönetimi</h1>
              </div>
            </div>
          </motion.header>
          
          <main className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left sidebar */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <TaskFilters />
                </motion.div>
                
                <motion.div 
                  className="mt-6 bg-white backdrop-blur-md bg-opacity-80 rounded-lg shadow-md p-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-[#232323]">Özet</h2>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <CheckCircle2 className="text-[#BEE4D0]" />
                    </motion.div>
                  </div>
                  
                  <TaskSummary />
                </motion.div>
                
                <motion.div
                  className="mt-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <AchievementSystem />
                </motion.div>
              </div>
              
              {/* Main content */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <TaskForm />
                </motion.div>
                
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <TaskAnalytics />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <TaskList />
                </motion.div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </TaskProvider>
  );
}

// Task Summary Component
const TaskSummary = () => {
  const { tasks } = useTaskContext();
  
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const activeTasks = totalTasks - completedTasks;
  
  const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  return (
    <div className="space-y-4">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between text-sm mb-1">
            <span>Toplam Görev</span>
            <motion.span 
              className="font-semibold"
              key={totalTasks}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {totalTasks}
            </motion.span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span>Aktif Görev</span>
            <motion.span 
              className="font-semibold"
              key={activeTasks}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {activeTasks}
            </motion.span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span>Tamamlanan</span>
            <motion.span 
              className="font-semibold"
              key={completedTasks}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {completedTasks}
            </motion.span>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {totalTasks > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between text-sm mb-1">
            <span>Tamamlanma Oranı</span>
            <motion.span 
              className="font-semibold"
              key={completionRate}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {completionRate}%
            </motion.span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <motion.div 
              className="bg-[#BEE4D0] h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionRate}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default App;