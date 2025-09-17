import React from 'react';
import { Heart, Star, Award } from 'lucide-react';

interface Donor {
  id: string;
  name: string;
  amount: number;
  message?: string;
  avatar: string;
  isAnonymous: boolean;
  date: string;
  isTopDonor?: boolean;
}

const DonorWall = () => {
  const donors: Donor[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      amount: 500,
      message: 'This is such an important cause. Happy to help make a difference!',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
      isAnonymous: false,
      date: '2024-01-20',
      isTopDonor: true,
    },
    {
      id: '2',
      name: 'Michael Chen',
      amount: 250,
      message: 'Clean water is a basic human right. Keep up the great work!',
      avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=100',
      isAnonymous: false,
      date: '2024-01-19',
    },
    {
      id: '3',
      name: 'Anonymous',
      amount: 100,
      message: '',
      avatar: '',
      isAnonymous: true,
      date: '2024-01-19',
    },
    {
      id: '4',
      name: 'Emily Rodriguez',
      amount: 75,
      message: 'Every drop counts! 💧',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      isAnonymous: false,
      date: '2024-01-18',
    },
    {
      id: '5',
      name: 'David Thompson',
      amount: 200,
      message: 'Proud to support this initiative. Together we can make change happen.',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
      isAnonymous: false,
      date: '2024-01-18',
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getDonorBadge = (amount: number) => {
    if (amount >= 500) return { icon: Star, color: 'text-yellow-500', label: 'Champion' };
    if (amount >= 200) return { icon: Award, color: 'text-blue-500', label: 'Supporter' };
    return { icon: Heart, color: 'text-emerald-500', label: 'Helper' };
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Our Amazing Donors
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Thank you to everyone who has contributed to this campaign!
        </p>
      </div>

      <div className="space-y-4">
        {donors.map((donor) => {
          const badge = getDonorBadge(donor.amount);
          const BadgeIcon = badge.icon;

          return (
            <div
              key={donor.id}
              className={`p-6 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                donor.isTopDonor
                  ? 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {donor.isAnonymous ? (
                    <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 dark:text-gray-300 text-sm">?</span>
                    </div>
                  ) : (
                    <img
                      src={donor.avatar}
                      alt={donor.name}
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {donor.name}
                      </h4>
                      {donor.isTopDonor && (
                        <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded-full text-xs font-medium">
                          Top Donor
                        </div>
                      )}
                      <div className={`flex items-center ${badge.color}`}>
                        <BadgeIcon className="h-4 w-4 mr-1" />
                        <span className="text-xs font-medium">{badge.label}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {formatCurrency(donor.amount)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(donor.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  {donor.message && (
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                      <p className="text-gray-700 dark:text-gray-300 italic">
                        "{donor.message}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
        <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium">
          View All {donors.length + 45} Donors →
        </button>
      </div>
    </div>
  );
};

export default DonorWall;