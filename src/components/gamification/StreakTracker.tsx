import React from 'react';
import { Flame, Calendar, Award, Target } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const StreakTracker = () => {
  const { user } = useAuth();
  
  const streakData = {
    current: user?.streakCount || 0,
    best: 15,
    thisMonth: 7,
    goal: 30,
  };

  const badges = [
    { name: 'First Donation', icon: '🎯', earned: true },
    { name: 'Week Streak', icon: '🔥', earned: true },
    { name: 'Helper', icon: '❤️', earned: true },
    { name: 'Champion', icon: '🏆', earned: false },
    { name: 'Philanthropist', icon: '⭐', earned: false },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex items-center mb-6">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-full mr-4">
          <Flame className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {streakData.current} Day Streak
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Keep up the amazing work!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {streakData.thisMonth}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">This Month</div>
        </div>
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <Award className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {streakData.best}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Best Streak</div>
        </div>
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <Target className="h-6 w-6 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {streakData.goal}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Monthly Goal</div>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Your Badges
        </h4>
        <div className="grid grid-cols-5 gap-3">
          {badges.map((badge, index) => (
            <div
              key={index}
              className={`text-center p-3 rounded-lg border-2 ${
                badge.earned
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900'
                  : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 opacity-50'
              }`}
            >
              <div className="text-2xl mb-1">{badge.icon}</div>
              <div className="text-xs font-medium text-gray-900 dark:text-white">
                {badge.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900 dark:to-blue-900 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          💡 <strong>Pro Tip:</strong> Donate regularly to maintain your streak and unlock exclusive badges!
        </p>
      </div>
    </div>
  );
};

export default StreakTracker;