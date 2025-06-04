import React from 'react';
import { Line, Pie } from 'react-chartjs-2';
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
} from 'chart.js';
import { motion } from 'framer-motion';
import { useTaskContext } from '../context/TaskContext';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { tr } from 'date-fns/locale';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
  
  return (
    <motion.div
      className="bg-white backdrop-blur-md bg-opacity-80 rounded-lg shadow-md p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold mb-4">Görev Analizi</h2>
      
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