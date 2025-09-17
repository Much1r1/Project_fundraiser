import React from 'react';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  streak: number;
  donations: number;
  totalDonated: number;
}

const Leaderboard = () => {
  const topDonors: LeaderboardEntry[] = [
    {
      rank: 1,
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
      streak: 45,
      donations: 127,
      totalDonated: 5420,
    },
    {
      rank: 2,
      name: 'Michael Chen',
      avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=100',
      streak: 38,
      donations: 89,
      totalDonated: 4150,
    },
    {
      rank: 3,
      name: 'Emily Rodriguez',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      streak: 32,
      donations: 76,
      totalDonated: 3680,
    },
    {
      rank: 4,
      name: 'David Thompson',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
      streak: 28,
      donations: 54,
      totalDonated: 2890,
    },
    {
      rank: 5,
      name: 'Lisa Wang',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
      streak: 25,
      donations: 43,
      totalDonated: 2340,
    },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-orange-500" />;
      default:
        return <span className="text-gray-500 font-bold">#{rank}</span>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-full mr-4">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Top Donors This Month
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Our community champions
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {topDonors.map((donor) => (
          <div
            key={donor.rank}
            className={`flex items-center p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
              donor.rank <= 3
                ? 'border-gradient-to-r from-yellow-400 to-orange-500 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900'
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700'
            }`}
          >
            <div className="flex items-center mr-4">
              {getRankIcon(donor.rank)}
            </div>
            
            <img
              src={donor.avatar}
              alt={donor.name}
              className="w-12 h-12 rounded-full mr-4"
            />
            
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {donor.name}
              </h4>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                <span className="flex items-center">
                  🔥 {donor.streak} day streak
                </span>
                <span>{donor.donations} donations</span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {formatCurrency(donor.totalDonated)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                total donated
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium">
          View Full Leaderboard →
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;