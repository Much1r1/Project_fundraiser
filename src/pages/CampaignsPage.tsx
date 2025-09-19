import React, { useState } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import CampaignCard from '../components/campaigns/CampaignCard';

const CampaignsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('trending');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const categories = [
    'All', 'Medical', 'Education', 'Community', 'Emergency', 'Environment', 'Animals'
  ];

  const sortOptions = [
    { value: 'trending', label: 'Trending' },
    { value: 'newest', label: 'Newest' },
    { value: 'ending-soon', label: 'Ending Soon' },
    { value: 'most-funded', label: 'Most Funded' },
    { value: 'goal-amount', label: 'Goal Amount' },
  ];

  const campaigns = [
    {
      id: '1',
      title: 'Help Build Clean Water Wells in Rural Kenya',
      description: 'Providing clean water access to over 500 families in remote villages across Kenya. This project will drill 5 new wells and provide maintenance training to local communities.',
      imageUrl: 'https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=800',
      raised: 1542000,
      goal: 2500000,
      donorCount: 89,
      daysLeft: 12,
      category: 'Community',
      verified: true,
      location: 'Kenya',
    },
    {
      id: '2',
      title: 'Emergency Surgery Fund for Baby Sarah',
      description: 'Help save baby Sarah who needs urgent heart surgery. She was born with a congenital heart defect and needs immediate medical intervention.',
      imageUrl: 'https://images.pexels.com/photos/3845457/pexels-photo-3845457.jpeg?auto=compress&cs=tinysrgb&w=800',
      raised: 895000,
      goal: 1200000,
      donorCount: 67,
      daysLeft: 5,
      category: 'Medical',
      verified: true,
      location: 'USA',
    },
    {
      id: '3',
      title: 'School Books for Underprivileged Children',
      description: 'Providing educational resources to 200 children in underserved areas. Books, supplies, and learning materials for a better future.',
      imageUrl: 'https://images.pexels.com/photos/159675/love-school-learn-book-159675.jpeg?auto=compress&cs=tinysrgb&w=800',
      raised: 320000,
      goal: 800000,
      donorCount: 42,
      daysLeft: 18,
      category: 'Education',
      verified: false,
      location: 'Philippines',
    },
    {
      id: '4',
      title: 'Wildfire Relief for Displaced Families',
      description: 'Supporting families who lost their homes in recent wildfires. Providing temporary housing, food, and essential supplies.',
      imageUrl: 'https://images.pexels.com/photos/1112080/pexels-photo-1112080.jpeg?auto=compress&cs=tinysrgb&w=800',
      raised: 2250000,
      goal: 3500000,
      donorCount: 156,
      daysLeft: 8,
      category: 'Emergency',
      verified: true,
      location: 'Australia',
    },
    {
      id: '5',
      title: 'Save the Coral Reef Initiative',
      description: 'Marine conservation project to restore coral reefs and protect marine biodiversity for future generations.',
      imageUrl: 'https://images.pexels.com/photos/1022923/pexels-photo-1022923.jpeg?auto=compress&cs=tinysrgb&w=800',
      raised: 780000,
      goal: 2000000,
      donorCount: 98,
      daysLeft: 25,
      category: 'Environment',
      verified: true,
      location: 'Maldives',
    },
    {
      id: '6',
      title: 'Animal Shelter Expansion Project',
      description: 'Help us expand our animal shelter to accommodate more rescued animals and provide better care facilities.',
      imageUrl: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=800',
      raised: 1230000,
      goal: 1800000,
      donorCount: 134,
      daysLeft: 15,
      category: 'Animals',
      verified: false,
      location: 'Canada',
    },
  ];

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || campaign.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Discover Campaigns
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Find causes you care about and make a difference today.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 px-4 py-3 flex items-center justify-center transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 px-4 py-3 flex items-center justify-center transition-colors ${
                  viewMode === 'list'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            Showing {filteredCampaigns.length} campaigns
          </p>
        </div>

        {/* Campaign Grid/List */}
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
            : 'space-y-6'
        }>
          {filteredCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-600 text-6xl mb-4">
              🔍
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No campaigns found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignsPage;