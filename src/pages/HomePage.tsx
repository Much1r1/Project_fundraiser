import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, Target, Award, ArrowRight } from 'lucide-react';
import CampaignCard from '../components/campaigns/CampaignCard';
import StreakTracker from '../components/gamification/StreakTracker';
import Leaderboard from '../components/gamification/Leaderboard';

const HomePage = () => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const featuredCampaigns = [
    {
      id: '1',
      title: 'Help Build Clean Water Wells in Rural Kenya',
      description: 'Providing clean water access to over 500 families in remote villages.',
      imageUrl: 'https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=800',
      raised: 1542000,
      goal: 2500000,
      donorCount: 89,
      daysLeft: 12,
      category: 'Community',
      verified: true,
    },
    {
      id: '2',
      title: 'Emergency Surgery Fund for Baby Sarah',
      description: 'Help save baby Sarah who needs urgent heart surgery.',
      imageUrl: 'https://images.pexels.com/photos/3845457/pexels-photo-3845457.jpeg?auto=compress&cs=tinysrgb&w=800',
      raised: 895000,
      goal: 1200000,
      donorCount: 67,
      daysLeft: 5,
      category: 'Medical',
      verified: true,
    },
    {
      id: '3',
      title: 'School Books for Underprivileged Children',
      description: 'Providing educational resources to 200 children in underserved areas.',
      imageUrl: 'https://images.pexels.com/photos/159675/love-school-learn-book-159675.jpeg?auto=compress&cs=tinysrgb&w=800',
      raised: 320000,
      goal: 800000,
      donorCount: 42,
      daysLeft: 18,
      category: 'Education',
      verified: false,
    },
  ];

  const stats = [
    { icon: Target, label: 'Campaigns Funded', value: '12,547' },
    { icon: Users, label: 'Lives Impacted', value: '2.3M' },
    { icon: TrendingUp, label: 'Funds Raised', value: '$45.2M' },
    { icon: TrendingUp, label: 'Funds Raised', value: 'KES 4.5B' },
    { icon: Award, label: 'Success Rate', value: '87%' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-500 via-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Make a Difference,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                One Donation at a Time
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Join millions of people supporting causes they care about. Start a campaign or donate to existing ones.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/campaigns"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center justify-center"
              >
                Explore Campaigns
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/create-campaign"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Start Fundraising
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-r from-emerald-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Campaigns
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover inspiring stories and make a direct impact on causes that matter most.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/campaigns"
              className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              View All Campaigns
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Gamification Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Track Your Impact
              </h2>
              <StreakTracker />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Community Champions
              </h2>
              <Leaderboard />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Make a Change?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Whether you need support or want to help others, our platform makes it easy to create meaningful impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/create-campaign"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Start a Campaign
            </Link>
            <Link
              to="/register"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Join Our Community
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;