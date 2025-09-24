import React, { useState } from 'react';
import { 
  User, Settings, Download, Heart, Calendar, Award, 
  TrendingUp, DollarSign, FileText, Bell 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import StreakTracker from '../components/gamification/StreakTracker';

const ProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'donations' | 'campaigns' | 'receipts' | 'settings'>('donations');

  // Mock data
  const donationHistory = [
    {
      id: '1',
      campaignTitle: 'Help Build Clean Water Wells in Rural Kenya',
      amount: 5000,
      date: '2024-01-20',
      receiptUrl: '#',
      status: 'completed',
    },
    {
      id: '2',
      campaignTitle: 'Emergency Surgery Fund for Baby Sarah',
      amount: 10000,
      date: '2024-01-18',
      receiptUrl: '#',
      status: 'completed',
    },
    {
      id: '3',
      campaignTitle: 'School Books for Underprivileged Children',
      amount: 2500,
      date: '2024-01-15',
      receiptUrl: '#',
      status: 'completed',
    },
  ];

  const myCampaigns = [
    {
      id: '1',
      title: 'Help My Family Rebuild After Fire',
      raised: 320000,
      goal: 800000,
      donors: 42,
      status: 'active',
      daysLeft: 18,
    },
  ];

  const stats = {
    totalDonated: 17500,
    campaignsSupported: 3,
    livesImpacted: 127,
    longestStreak: 15,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const tabs = [
    { id: 'donations', label: 'My Donations', icon: Heart },
    { id: 'campaigns', label: 'My Campaigns', icon: TrendingUp },
    { id: 'receipts', label: 'Tax Receipts', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please log in to view your profile
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">
                      {user.full_name.charAt(0)}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-2">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {user.full_name}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {user.email}
                </p>
                
                {/* User Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.campaignsSupported}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Campaigns Supported
                    </div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(stats.totalDonated)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Total Donated
                    </div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.livesImpacted}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Lives Impacted
                    </div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      7
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Current Streak
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Your Badges
                  </h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['First Donation', 'Helper', 'Supporter'].map((badge, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Streak Tracker */}
            <StreakTracker />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-6">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
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

              <div className="p-6">
                {activeTab === 'donations' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Donation History
                      </h3>
                      <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
                        Export All
                      </button>
                    </div>

                    <div className="space-y-4">
                      {donationHistory.map((donation) => (
                        <div
                          key={donation.id}
                          className="flex justify-between items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                        >
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {donation.campaignTitle}
                            </h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                              <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(donation.date).toLocaleDateString()}
                              </span>
                              <span className="flex items-center">
                                <DollarSign className="h-4 w-4 mr-1" />
                                {formatCurrency(donation.amount)}
                              </span>
                              <span className="text-green-600 dark:text-green-400 capitalize">
                                {donation.status}
                              </span>
                            </div>
                          </div>
                          <button className="ml-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'campaigns' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        My Campaigns
                      </h3>
                      <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                        Create New Campaign
                      </button>
                    </div>

                    <div className="space-y-4">
                      {myCampaigns.map((campaign) => (
                        <div
                          key={campaign.id}
                          className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                {campaign.title}
                              </h4>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                                <span>{campaign.donors} donors</span>
                                <span>{campaign.daysLeft} days left</span>
                                <span className="text-green-600 dark:text-green-400 capitalize">
                                  {campaign.status}
                                </span>
                              </div>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                              <Settings className="h-5 w-5" />
                            </button>
                          </div>

                          <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                              <span>Progress</span>
                              <span>{Math.round((campaign.raised / campaign.goal) * 100)}% of goal</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-emerald-500 to-blue-600 h-2 rounded-full"
                                style={{ width: `${(campaign.raised / campaign.goal) * 100}%` }}
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

                          <div className="flex space-x-2">
                            <button className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors">
                              View Campaign
                            </button>
                            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                              Edit
                            </button>
                            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                              Share
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'receipts' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Tax Receipts
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Download official receipts for your donations. These can be used for tax deductions where applicable.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          2024 Tax Year
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          Total donations: {formatCurrency(stats.totalDonated)}
                        </p>
                        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                          Download Receipt
                        </button>
                      </div>
                      
                      <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg text-center opacity-50">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          2023 Tax Year
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          No donations recorded
                        </p>
                        <button
                          disabled
                          className="bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 px-4 py-2 rounded-lg cursor-not-allowed"
                        >
                          No Receipt Available
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                        Account Settings
                      </h3>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            defaultValue={user.name}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            defaultValue={user.email}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Bio
                          </label>
                          <textarea
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                            placeholder="Tell us a little about yourself..."
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                        Notification Preferences
                      </h3>
                      
                      <div className="space-y-4">
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="text-emerald-600" />
                          <span className="ml-3 text-gray-700 dark:text-gray-300">
                            Email notifications for campaign updates
                          </span>
                        </label>
                        
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="text-emerald-600" />
                          <span className="ml-3 text-gray-700 dark:text-gray-300">
                            Donation streak reminders
                          </span>
                        </label>
                        
                        <label className="flex items-center">
                          <input type="checkbox" className="text-emerald-600" />
                          <span className="ml-3 text-gray-700 dark:text-gray-300">
                            Marketing emails
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                      <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors mr-4">
                        Save Changes
                      </button>
                      <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;