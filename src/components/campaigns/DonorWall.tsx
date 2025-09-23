import React from 'react';
import { Heart, Star, Award } from 'lucide-react';
import { useDonations } from '../../hooks/useDonations';
import LoadingSpinner from '../ui/LoadingSpinner';

interface DonorWallProps {
  campaignId: string;
}

const DonorWall: React.FC<DonorWallProps> = ({ campaignId }) => {
  const { donations, loading } = useDonations(campaignId);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getDonorBadge = (amount: number) => {
    if (amount >= 50000) return { icon: Star, color: 'text-yellow-500', label: 'Champion' };
    if (amount >= 20000) return { icon: Award, color: 'text-blue-500', label: 'Supporter' };
    return { icon: Heart, color: 'text-emerald-500', label: 'Helper' };
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (donations.length === 0) {
    return (
      <div className="text-center py-8">
        <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No donations yet
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Be the first to support this campaign!
        </p>
      </div>
    );
  }

  // Sort donations by amount (highest first)
  const sortedDonations = [...donations].sort((a, b) => b.amount - a.amount);
  const topDonor = sortedDonations[0];

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
        {sortedDonations.map((donation) => {
          const badge = getDonorBadge(donation.amount);
          const BadgeIcon = badge.icon;
          const isTopDonor = donation.id === topDonor.id;
          const donorName = donation.is_anonymous ? 'Anonymous' : donation.users?.full_name || 'Anonymous';

          return (
            <div
              key={donation.id}
              className={`p-6 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                isTopDonor
                  ? 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {donation.is_anonymous ? (
                    <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 dark:text-gray-300 text-sm">?</span>
                    </div>
                  ) : (
                    <img
                      src={donation.users?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(donorName)}&background=10b981&color=fff`}
                      alt={donorName}
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {donorName}
                      </h4>
                      {isTopDonor && (
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
                        {formatCurrency(donation.amount)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(donation.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  {donation.donor_message && (
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                      <p className="text-gray-700 dark:text-gray-300 italic">
                        "{donation.donor_message}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {donations.length > 10 && (
        <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
          <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium">
            View All {donations.length} Donors →
          </button>
        </div>
      )}
    </div>
  );
};

export default DonorWall;