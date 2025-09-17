import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, MapPin, Verified } from 'lucide-react';

interface Campaign {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  raised: number;
  goal: number;
  donorCount: number;
  daysLeft: number;
  category: string;
  verified?: boolean;
  location?: string;
}

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const progressPercentage = (campaign.raised / campaign.goal) * 100;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Medical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      Education: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      Community: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      Emergency: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      Environment: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img
          src={campaign.imageUrl}
          alt={campaign.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(campaign.category)}`}>
            {campaign.category}
          </span>
        </div>
        {campaign.verified && (
          <div className="absolute top-4 right-4">
            <div className="bg-blue-600 rounded-full p-1">
              <Verified className="h-4 w-4 text-white" />
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {campaign.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {campaign.description}
        </p>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
            <span>Raised</span>
            <span>{Math.round(progressPercentage)}% of goal</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-emerald-500 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatCurrency(campaign.raised)}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              of {formatCurrency(campaign.goal)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{campaign.donorCount} donors</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{campaign.daysLeft} days left</span>
          </div>
        </div>

        <Link
          to={`/campaigns/${campaign.id}`}
          className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors font-medium text-center block"
        >
          View Campaign
        </Link>
      </div>
    </div>
  );
};

export default CampaignCard;