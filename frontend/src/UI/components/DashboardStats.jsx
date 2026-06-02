import React from 'react';
import { TrendingUp, FolderOpen, CheckCircle, DollarSign } from 'lucide-react';

const DashboardStats = ({ projects }) => {
  const totalProjects = projects?.length || 0;
  const openProjects = projects?.filter(p => p.status === 'open' || p.status === 'Open')?.length || 0;
  const closedProjects = projects?.filter(p => p.status === 'closed' || p.status === 'Closed')?.length || 0;
  const totalRaised = projects?.reduce((sum, p) => {
    const invested = p.investments?.reduce((s, inv) => s + (inv.amount || 0), 0) || p.currentCapital || p.investedCapital || 0;
    return sum + invested;
  }, 0) || 0;

  const stats = [
    {
      title: 'Total Projects',
      value: totalProjects,
      icon: FolderOpen,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      title: 'Open Projects',
      value: openProjects,
      icon: TrendingUp,
      color: 'bg-green-500',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      title: 'Closed Projects',
      value: closedProjects,
      icon: CheckCircle,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
    },
    {
      title: 'Total Raised',
      value: `${totalRaised.toLocaleString()} DH`,
      icon: DollarSign,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
            <div className={`${stat.bgColor} p-3 rounded-full`}>
              <stat.icon className={`${stat.textColor}`} size={24} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;