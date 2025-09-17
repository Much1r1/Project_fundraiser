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

const CampaignDetailPage = () => {
  const { id } = useParams();
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'story' | 'updates' | 'donors' | 'comments'>('story');

  // Mock campaign data
  const campaign = {
    id: '1',
    title: 'Help Build Clean Water Wells in Rural Kenya',
    description: 'Providing clean water access to over 500 families in remote villages across Kenya.',
    fullStory: `
      <p>Access to clean water is a fundamental human right, yet millions of people in rural Kenya still lack this basic necessity. Our project aims to drill 5 new wells in remote villages, providing sustainable access to clean water for over 500 families.</p>
      
      <h3>The Challenge</h3>
      <p>Many communities in rural Kenya have to walk miles every day just to collect water from contaminated sources. This water often carries diseases and puts families at risk. Women and children bear the burden of water collection, preventing children from attending school and limiting economic opportunities for families.</p>
      
      <h3>Our Solution</h3>
      <p>We partner with local communities to identify the best locations for wells and provide training for ongoing maintenance. Each well will serve approximately 100 families and includes:</p>
      <ul>
        <li>Professional drilling and construction</li>
        <li>Water quality testing and treatment systems</li>
        <li>Community training for maintenance</li>
        <li>Long-term monitoring and support</li>
      </ul>
      
      <h3>Impact</h3>
      <p>Your donation will directly improve lives by:</p>
      <ul>
        <li>Reducing water-borne diseases by 80%</li>
        <li>Allowing children to attend school instead of collecting water</li>
        <li>Enabling women to pursue income-generating activities</li>
        <li>Building stronger, healthier communities</li>
      </ul>
    `,
    imageUrl: 'https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=1200',
    images: [
      'https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1146708/pexels-photo-1146708.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1108925/pexels-photo-1108925.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    raised: 15420,
    goal: 25000,
    donorCount: 89,
    daysLeft: 12,
    category: 'Community',
    location: 'Kenya',
    verified: true,
    creator: {
      name: 'Kenya Water Foundation',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
      verified: true,
    },
    createdAt: '2024-01-15',
  };

  const progressPercentage = (campaign.raised / campaign.goal) * 100;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const updates = [
    {
      id: '1',
      title: 'First Well Complete!',
      content: 'We\'re excited to announce that our first well is now operational and serving 98 families in Kibera village. The community celebration was incredible!',
      date: '2024-01-20',
      images: ['https://images.pexels.com/photos/1108925/pexels-photo-1108925.jpeg?auto=compress&cs=tinysrgb&w=400'],
    },
    {
      id: '2',
      title: 'Community Training Session',
      content: 'Local volunteers completed their well maintenance training. This ensures long-term sustainability of our water systems.',
      date: '2024-01-18',
      images: [],
    },
  ];

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
                src={campaign.imageUrl}
                alt={campaign.title}
                className="w-full h-64 md:h-80 object-cover rounded-lg"
              />
              <div className="absolute top-4 left-4 flex space-x-2">
                <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                  {campaign.category}
                </span>
                {campaign.verified && (
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
                  <span>{campaign.daysLeft} days left</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{campaign.donorCount} donors</span>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={campaign.creator.avatar}
                  alt={campaign.creator.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {campaign.creator.name}
                    </span>
                    {campaign.creator.verified && (
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
                  <div dangerouslySetInnerHTML={{ __html: campaign.fullStory }} />
                  
                  <div className="mt-8">
                    <h4 className="text-lg font-semibold mb-4">Campaign Images</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {campaign.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Campaign image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'updates' && (
                <div className="space-y-6">
                  {updates.map((update) => (
                    <div key={update.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {update.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        {new Date(update.date).toLocaleDateString()}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        {update.content}
                      </p>
                      {update.images.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {update.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Update image ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'donors' && <DonorWall />}
              {activeTab === 'comments' && <CommentSection />}
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
                        {formatCurrency(campaign.raised)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        raised of {formatCurrency(campaign.goal)} goal
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {campaign.donorCount}
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