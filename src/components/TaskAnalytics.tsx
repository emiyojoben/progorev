import React from 'react';
import { Line, Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import { motion } from 'framer-motion';
import { useTaskContext } from '../context/TaskContext';
import { format, subDays, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';
import { tr } from 'date-fns/locale';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const TaskAnalytics: React.FC = () => {
  const { tasks } = useTaskContext();
  
  // Prepare data for completion trend
  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date(),
  });
  
  const completionData = last7Days.map(date => {
    const dayStr = format(date, 'yyyy-MM-dd');
    return tasks.filter(task => 
      task.completedAt?.startsWith(dayStr)
    ).length;
  });
  
  const labels = last7Days.map(date => 
    format(date, 'd MMM', { locale: tr })
  );
  
  // Calculate category distribution
  const categoryData = tasks.reduce((acc, task) => {
    const category = task.metrics.category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Calculate priority distribution
  const priorityData = tasks.reduce((acc, task) => {
    const priority = task.metrics.priority;
    acc[priority] = (acc[priority] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  // Calculate completion time accuracy
  const timeAccuracyData = tasks
    .filter(task => task.status === 'completed' && task.metrics.actualTime && task.metrics.estimatedTime)
    .map(task => ({
      estimated: task.metrics.estimatedTime!,
      actual: task.metrics.actualTime!,
      accuracy: (task.metrics.estimatedTime! / task.metrics.actualTime!) * 100
    }));
  
  const averageAccuracy = timeAccuracyData.length > 0
    ? timeAccuracyData.reduce((acc, curr) => acc + curr.accuracy, 0) / timeAccuracyData.length
    : 0;
  
  const pieData = {
    labels: Object.keys(categoryData),
    datasets: [{
      data: Object.values(categoryData),
      backgroundColor: [
        '#FF6363',
        '#FFB563',
        '#63FF8C',
        '#63B5FF',
        '#D463FF',
      ],
    }],
  };
  
  const lineData = {
    labels,
    datasets: [{
      label: 'Tamamlanan Görevler',
      data: completionData,
      borderColor: '#BEE4D0',
      backgroundColor: 'rgba(190, 228, 208, 0.2)',
      tension: 0.4,
    }],
  };
  
  const priorityChartData = {
    labels: ['Çok Düşük', 'Düşük', 'Orta', 'Yüksek', 'Çok Yüksek'],
    datasets: [{
      label: 'Görev Sayısı',
      data: [
        priorityData[1] || 0,
        priorityData[2] || 0,
        priorityData[3] || 0,
        priorityData[4] || 0,
        priorityData[5] || 0,
      ],
      backgroundColor: [
        '#63FF8C',
        '#63B5FF',
        '#FFB563',
        '#FF6363',
        '#D463FF',
      ],
    }],
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };
  
  // Calculate productivity score
  const calculateProductivityScore = () => {
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    const onTimeCompletions = tasks.filter(t => 
      t.status === 'completed' && 
      t.metrics.actualTime! <= t.metrics.estimatedTime!
    ).length;
    
    const timeEfficiency = completedTasks > 0 ? (onTimeCompletions / completedTasks) * 100 : 0;
    
    return Math.round((completionRate + timeEfficiency) / 2);
  };
  
  const productivityScore = calculateProductivityScore();
  
  return (
    <motion.div
      className="bg-white backdrop-blur-md bg-opacity-80 rounded-lg shadow-md p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Görev Analizi</h2>
        <div className="flex items-center">
          <div className="text-right">
            <p className="text-sm text-gray-500">Üretkenlik Skoru</p>
            <p className="text-2xl font-bold text-[#BEE4D0]">{productivityScore}</p>
          </div>
          <div className="ml-3 w-12 h-12 rounded-full border-4 border-[#BEE4D0] flex items-center justify-center">
            <span className="text-sm font-semibold">/ 100</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium mb-2">Tamamlama Trendi</h3>
          <div className="h-64">
            <Line data={lineData} options={options} />
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Kategori Dağılımı</h3>
          <div className="h-64 flex items-center justify-center">
            <Pie data={pieData} />
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Öncelik Dağılımı</h3>
          <div className="h-64">
            <Bar data={priorityChartData} options={options} />
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Zaman Tahmini Doğruluğu</h3>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#BEE4D0]">
                {Math.round(averageAccuracy)}%
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Ortalama tahmin doğruluğu
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        <StatCard
          title="Toplam Görev"
          value={tasks.length}
          trend={"+5%"}
        />
        <StatCard
          title="Tamamlanan"
          value={tasks.filter(t => t.status === 'completed').length}
          trend={"+12%"}
        />
        <StatCard
          title="Ortalama/Gün"
          value={(completionData.reduce((a, b) => a + b, 0) / 7).toFixed(1)}
          trend={"-2%"}
        />
        <StatCard
          title="Başarı Oranı"
          value={`${Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100)}%`}
          trend={"+8%"}
        />
      </div>
    </motion.div>
  );
};

const StatCard: React.FC<{
  title: string;
  value: string | number;
  trend: string;
}> = ({ title, value, trend }) => {
  const isPositive = trend.startsWith('+');
  
  return (
    <motion.div
      className="bg-gray-50 rounded-lg p-4"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <h4 className="text-sm text-gray-600 mb-1">{title}</h4>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-semibold">{value}</span>
        <span className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {trend}
        </span>
      </div>
    </motion.div>
  );
};

export default TaskAnalytics;