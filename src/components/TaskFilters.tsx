import React from 'react';
import { Search, Calendar, Filter, X } from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';

const TaskFilters: React.FC = () => {
  const { filters, setFilters, resetFilters } = useTaskContext();
  
  const colors = ['#FF6363', '#FFB563', '#63FF8C', '#63B5FF', '#D463FF'];
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ searchText: e.target.value });
  };
  
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ status: e.target.value as 'all' | 'active' | 'completed' });
  };
  
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ startDate: e.target.value || null });
  };
  
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ endDate: e.target.value || null });
  };
  
  const handleColorSelect = (color: string | null) => {
    setFilters({ color });
  };
  
  const hasActiveFilters = 
    filters.searchText || 
    filters.startDate || 
    filters.endDate || 
    filters.status !== 'all' || 
    filters.color;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#232323]">Filtreler</h2>
        
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-sm text-[#FF8282] hover:text-[#FF6363] flex items-center"
          >
            <X size={16} className="mr-1" />
            Filtreleri Temizle
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {/* Search filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={filters.searchText}
            onChange={handleSearchChange}
            placeholder="Görevlerde ara..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DBFFCB] transition-all"
          />
        </div>
        
        {/* Status filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Durum
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter size={18} className="text-gray-400" />
            </div>
            <select
              value={filters.status}
              onChange={handleStatusChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DBFFCB] transition-all appearance-none"
            >
              <option value="all">Tümü</option>
              <option value="active">Aktif</option>
              <option value="completed">Tamamlanmış</option>
            </select>
          </div>
        </div>
        
        {/* Date range filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Başlangıç Tarihi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={18} className="text-gray-400" />
              </div>
              <input
                type="date"
                value={filters.startDate || ''}
                onChange={handleStartDateChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DBFFCB] transition-all"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bitiş Tarihi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={18} className="text-gray-400" />
              </div>
              <input
                type="date"
                value={filters.endDate || ''}
                onChange={handleEndDateChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DBFFCB] transition-all"
              />
            </div>
          </div>
        </div>
        
        {/* Color filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Renk
          </label>
          <div className="flex space-x-3 items-center">
            {/* "All colors" option */}
            <div
              onClick={() => handleColorSelect(null)}
              className={`w-8 h-8 rounded-full cursor-pointer flex items-center justify-center border-2 ${
                filters.color === null
                  ? 'border-gray-500'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <X size={16} />
            </div>
            
            {colors.map((color) => (
              <div
                key={color}
                onClick={() => handleColorSelect(color)}
                className={`w-8 h-8 rounded-full cursor-pointer transition-all hover:scale-110 ${
                  filters.color === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;