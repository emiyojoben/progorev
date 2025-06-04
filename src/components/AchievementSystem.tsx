import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Target, Zap, Award } from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';

const AchievementSystem: React.FC = () => {
  const { tasks } = useTaskContext();
  
  const achievements = [
    {
      id: 'first_task',
      title: 'İlk Görev',
      description: 'İlk görevini tamamladın!',
      icon: Trophy,
      progress: tasks.length > 0 ? 100 : 0,
      target: 1,
      unlocked: tasks.length > 0,
    },
    {
      id: 'task_master',
      title: 'Görev Ustası',
      description: '10 görev tamamla',
      icon: Star,
      progress: Math.min(tasks.filter(t => t.status === 'completed').length * 10, 100),
      target: 10,
      unlocked: tasks.filter(t => t.status === 'completed').length >= 10,
    },
    {
      id: 'streak_warrior',
      title: 'Streak Savaşçısı',
      description: '5 gün üst üste görev tamamla',
      icon: Zap,
      progress: 60, // This would normally be calculated from actual streak data
      target: 5,
      unlocked: false,
    },
    {
      id: 'category_master',
      title: 'Kategori Ustası',
      description: 'Her kategoriden görev tamamla',
      icon: Target,
      progress: 40, // This would be calculated from category completion data
      target: 5,
      unlocked: false,
    },
  ];
  
  return (
    <motion.div
      className="bg-white backdrop-blur-md bg-opacity-80 rounded-lg shadow-md p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Başarımlar</h2>
        <Award className="text-[#BEE4D0]" size={24} />
      </div>
      
      <div className="grid gap-4">
        <AnimatePresence>
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              className={`p-4 rounded-lg ${
                achievement.unlocked
                  ? 'bg-[#DBFFCB] bg-opacity-20'
                  : 'bg-gray-50'
              }`}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${
                  achievement.unlocked
                    ? 'bg-[#BEE4D0] text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  <achievement.icon size={20} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{achievement.title}</h3>
                    <span className="text-sm text-gray-500">
                      {achievement.progress}%
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-1">
                    {achievement.description}
                  </p>
                  
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                    <motion.div
                      className="bg-[#BEE4D0] h-1.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${achievement.progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AchievementSystem;