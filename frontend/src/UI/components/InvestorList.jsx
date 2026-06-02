import React from 'react';
import { Users, TrendingUp, DollarSign } from 'lucide-react';

const InvestorList = ({ investors, totalCapital }) => {
  const getPercentage = (amount) => {
    if (!totalCapital || totalCapital === 0) return 0;
    return ((amount / totalCapital) * 100).toFixed(2);
  };

  if (!investors || investors.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <Users size={48} className="mx-auto text-gray-400 mb-3" />
        <p className="text-gray-500">No investors yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Investor Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount Invested
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Percentage of Capital
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {investors.map((investor, index) => (
            <tr key={investor.id || index} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {investor.name?.charAt(0) || 'I'}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {investor.name || `Investor ${index + 1}`}
                    </div>
                    <div className="text-sm text-gray-500">
                      {investor.email || 'investor@example.com'}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <DollarSign size={16} className="text-green-500 mr-1" />
                  <span className="text-sm font-semibold text-gray-900">
                    ${(investor.amountInvested || 0).toLocaleString()}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <TrendingUp size={16} className="text-blue-500 mr-1" />
                  <span className="text-sm text-gray-900">
                    {getPercentage(investor.amountInvested)}%
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Active
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvestorList;