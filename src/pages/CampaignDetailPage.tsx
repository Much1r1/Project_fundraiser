import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Calendar, Users, MapPin, Verified, Share2, Heart, 
  MessageCircle, Flag, ChevronRight, Download, Upload 
} from 'lucide-react';
import DonationModal from '../components/donations/DonationModal';
import ShareButtons from '../components/social/ShareButtons';
import DonorWall from '../components/campaigns/DonorWall';
import CommentSection from '../components/campaigns/CommentSection';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useCampaign } from '../hooks/useCampaigns';
import { useDonations } from '../hooks/useDonations';

const CampaignDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'story' | 'updates' | 'donors' | 'comments'>('story');

  const { campaign, loading, error } = useCampaign(id!);
  const { donations } = useDonations(id);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Campaign Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = (campaign.current_amount / campaign.goal_amount) * 100;
  const donorCount = donations.length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getDaysLeft = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const daysLeft = getDaysLeft(campaign.end_date);

  const tabs = [
    { id: 'story', label: 'Story', icon: MessageCircle },
    { id: 'updates', label: 'Updates', icon: Upload },
    { id: 'donors', label: 'Donors', icon: Users },
    { id: 'comments', label: 'Comments', icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 mb-6">
          <span>Campaigns</span>
          <ChevronRight className="h-4 w-4" />
          <span>{campaign.category}</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 dark:text-white">{campaign.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Image */}
            <div className="relative mb-6">
              <img
                src={campaign.image_url || 'https://images.pexels.com/photos/6995242/pexels-photo-6995242.jpeg?auto=compress&cs=tinysrgb&w=1200'}
                alt={campaign.title}
                className="w-full h-64 md:h-80 object-cover rounded-lg"
              />
              <div className="absolute top-4 left-4 flex space-x-2">
                <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                  {campaign.category}
                </span>
                {campaign.verification_status === 'verified' && (
                  <div className="bg-blue-600 rounded-full p-1">
                    <Verified className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* Campaign Title and Meta */}
            <div className="mb-6">
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {campaign.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-300 mb-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{campaign.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{daysLeft} days left</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{donorCount} donors</span>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={campaign.users.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(campaign.users.full_name)}&background=10b981&color=fff`}
                  alt={campaign.users.full_name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {campaign.users.full_name}
                    </span>
                    {campaign.users.verification_status === 'verified' && (
                      <Verified className="h-4 w-4 text-blue-600 ml-1" />
                    )}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Campaign Organizer
                  </span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
              <nav className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center pb-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <tab.icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              {activeTab === 'story' && (
                <div className="prose dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                    {campaign.story}
                  </div>
                </div>
              )}

              {activeTab === 'updates' && (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-300">
                    No updates yet. Check back later for campaign updates!
                  </p>
                </div>
              )}

              {activeTab === 'donors' && <DonorWall campaignId={campaign.id} />}
              {activeTab === 'comments' && <CommentSection campaignId={campaign.id} />}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Donation Card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <span>Raised</span>
                    <span>{Math.round(progressPercentage)}% of goal</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatCurrency(campaign.current_amount)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        raised of {formatCurrency(campaign.goal_amount)} goal
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {donorCount}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        donors
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowDonationModal(true)}
                  className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors font-semibold text-lg mb-4"
                >
                  Donate Now
                </button>

                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mb-4">
                  <Heart className="h-4 w-4 mr-2" />
                  Save Campaign
                </button>

                <ShareButtons title={campaign.title} url={window.location.href} />
              </div>

              {/* Report Card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <button className="w-full flex items-center justify-center px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors">
                  <Flag className="h-4 w-4 mr-2" />
                  Report Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDonationModal && (
        <DonationModal
          campaign={campaign}
          onClose={() => setShowDonationModal(false)}
        />
      )}
    </div>
  );
};

export default CampaignDetailPage;