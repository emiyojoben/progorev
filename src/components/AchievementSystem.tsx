import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Target, Zap, Award, Flame, Brain, Coffee } from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';
import { Achievement } from '../types/task';

const AchievementSystem: React.FC = () => {
  const { tasks } = useTaskContext();
  
  const calculateStreak = (): number => {
    const sortedTasks = [...tasks]
      .filter(t => t.status === 'completed')
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());
    
    let streak = 0;
    let currentDate = new Date();
    
    for (const task of sortedTasks) {
      const taskDate = new Date(task.completedAt!);
      if (taskDate.toDateString() === currentDate.toDateString()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };
  
  const achievements: Achievement[] = [
    {
      id: 'first_task',
      title: 'İlk Görev',
      description: 'İlk görevini tamamladın!',
      icon: Trophy,
      progress: tasks.length > 0 ? 100 : 0,
      target: 1,
      unlockedAt: tasks.length > 0 ? tasks[0].createdAt : undefined
    },
    {
      id: 'task_master',
      title: 'Görev Ustası',
      description: '10 görev tamamla',
      icon: Star,
      progress: Math.min(tasks.filter(t => t.status === 'completed').length * 10, 100),
      target: 10,
      unlockedAt: tasks.filter(t => t.status === 'completed').length >= 10 
        ? tasks.find(t => t.status === 'completed')?.completedAt 
        : undefined
    },
    {
      id: 'streak_warrior',
      title: 'Streak Savaşçısı',
      description: '5 gün üst üste görev tamamla',
      icon: Flame,
      progress: (calculateStreak() / 5) * 100,
      target: 5,
      unlockedAt: calculateStreak() >= 5 
        ? new Date().toISOString()
        : undefined
    },
    {
      id: 'efficiency_expert',
      title: 'Verimlilik Uzmanı',
      description: 'Bir görevi tahmin edilen süreden önce tamamla',
      icon: Brain,
      progress: tasks.some(t => 
        t.status === 'completed' && 
        t.metrics.actualTime! < t.metrics.estimatedTime!
      ) ? 100 : 0,
      target: 1,
      unlockedAt: tasks.find(t => 
        t.status === 'completed' && 
        t.metrics.actualTime! < t.metrics.estimatedTime!
      )?.completedAt
    },
    {
      id: 'category_master',
      title: 'Kategori Ustası',
      description: 'Her kategoriden görev tamamla',
      icon: Coffee,
      progress: 40,
      target: 5,
      unlockedAt: undefined
    },
  ];
  
  const unlockedCount = achievements.filter(a => a.unlockedAt).length;
  const totalAchievements = achievements.length;
  
  return (
    <motion.div
      className="bg-white backdrop-blur-md bg-opacity-80 rounded-lg shadow-md p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Başarımlar</h2>
          <p className="text-sm text-gray-500 mt-1">
            {unlockedCount} / {totalAchievements} tamamlandı
          </p>
        </div>
        <Award className="text-[#BEE4D0]" size={24} />
      </div>
      
      <div className="grid gap-4">
        <AnimatePresence>
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              className={`p-4 rounded-lg ${
                achievement.unlockedAt
                  ? 'bg-[#DBFFCB] bg-opacity-20'
                  : 'bg-gray-50'
              }`}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${
                  achievement.unlockedAt
                    ? 'bg-[#BEE4D0] text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  <achievement.icon size={20} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{achievement.title}</h3>
                    <span className="text-sm text-gray-500">
                      {Math.round(achievement.progress)}%
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
                  
                  {achievement.unlockedAt && (
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(achievement.unlockedAt).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })} tarihinde kazanıldı
                    </p>
                  )}
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