import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { User, Settings, Download, Heart, Calendar, Award, TrendingUp, DollarSign, FileText, Bell, Shield, Eye, EyeOff, Camera, CreditCard as Edit3, Save, X, Check, Target, Users, MapPin, Clock, Star, Trophy, CreditCard, Smartphone, Lock, Mail, Phone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import StreakTracker from '../components/gamification/StreakTracker';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  
  // Profile editing states
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: user?.full_name || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
  });
  
  // Password change states
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailCampaignUpdates: true,
    emailDonationReceipts: true,
    emailStreakReminders: true,
    emailMarketing: false,
    pushNotifications: true,
    smsNotifications: false,
  });

  useEffect(() => {
    if (user) {
      setEditForm({
        full_name: user.full_name,
        bio: user.bio || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  // Mock data - in real app, fetch from database
  const stats = {
    totalDonated: 47500,
    campaignsSupported: 8,
    campaignsCreated: 2,
    livesImpacted: 234,
    longestStreak: 28,
    currentStreak: 7,
    totalBadges: 12,
    verificationLevel: 'Gold',
  };

  const donationHistory = [
    {
      id: '1',
      campaignTitle: 'Help Build Clean Water Wells in Rural Kenya',
      amount: 15000,
      date: '2024-01-20',
      status: 'completed',
      receiptUrl: '#',
      campaignImage: 'https://images.pexels.com/photos/6995242/pexels-photo-6995242.jpeg?auto=compress&cs=tinysrgb&w=300',
    },
    {
      id: '2',
      campaignTitle: 'Emergency Surgery Fund for Baby Sarah',
      amount: 25000,
      date: '2024-01-18',
      status: 'completed',
      receiptUrl: '#',
      campaignImage: 'https://images.pexels.com/photos/339620/pexels-photo-339620.jpeg?auto=compress&cs=tinysrgb&w=300',
    },
    {
      id: '3',
      campaignTitle: 'School Books for Underprivileged Children',
      amount: 7500,
      date: '2024-01-15',
      status: 'completed',
      receiptUrl: '#',
      campaignImage: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300',
    },
  ];

  const myCampaigns = [
    {
      id: '1',
      title: 'Help My Family Rebuild After Fire',
      description: 'Our family home was destroyed in a fire and we need help rebuilding.',
      raised: 420000,
      goal: 800000,
      donors: 67,
      status: 'active',
      daysLeft: 18,
      image: 'https://images.pexels.com/photos/1684187/pexels-photo-1684187.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'Emergency',
    },
    {
      id: '2',
      title: 'Community Garden Project',
      description: 'Creating a sustainable garden for our local community.',
      raised: 180000,
      goal: 200000,
      donors: 34,
      status: 'completed',
      daysLeft: 0,
      image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'Community',
    },
  ];

  const achievements = [
    { name: 'First Donation', icon: '🎯', description: 'Made your first donation', earned: true, date: '2024-01-10' },
    { name: 'Week Streak', icon: '🔥', description: 'Donated for 7 consecutive days', earned: true, date: '2024-01-15' },
    { name: 'Helper', icon: '❤️', description: 'Supported 5 different campaigns', earned: true, date: '2024-01-18' },
    { name: 'Generous Giver', icon: '💎', description: 'Donated over KES 25,000', earned: true, date: '2024-01-20' },
    { name: 'Community Builder', icon: '🏗️', description: 'Created your first campaign', earned: true, date: '2024-01-12' },
    { name: 'Champion', icon: '🏆', description: 'Maintain a 30-day streak', earned: false },
    { name: 'Philanthropist', icon: '⭐', description: 'Donate over KES 100,000', earned: false },
    { name: 'Influencer', icon: '📢', description: 'Get 100 people to donate through your shares', earned: false },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleTabChange = (tab: string) => {
    setSearchParams({ tab });
  };

  const handleSaveProfile = async () => {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: editForm.full_name,
          bio: editForm.bio,
          phone: editForm.phone,
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) throw error;

      toast.success('Password updated successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Failed to update password');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'donations', label: 'My Donations', icon: Heart },
    { id: 'campaigns', label: 'My Campaigns', icon: TrendingUp },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
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
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-emerald-500 via-blue-600 to-purple-700 rounded-lg p-8 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <img
                src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=10b981&color=fff&size=120`}
                alt={user.full_name}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg"
              />
              <button className="absolute bottom-0 right-0 bg-white text-gray-700 rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{user.full_name}</h1>
                  <p className="text-blue-100 mb-2">{user.email}</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    {isAdmin && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-500 text-white">
                        <Shield className="h-4 w-4 mr-1" />
                        Admin
                      </span>
                    )}
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      user.verification_status === 'verified' 
                        ? 'bg-green-500 text-white'
                        : 'bg-yellow-500 text-white'
                    }`}>
                      {user.verification_status === 'verified' ? '✓ Verified' : '⏳ Pending Verification'}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500 text-white">
                      <Star className="h-4 w-4 mr-1" />
                      {stats.verificationLevel} Member
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{formatCurrency(stats.totalDonated)}</div>
                  <div className="text-sm text-blue-100">Total Donated</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.campaignsSupported}</div>
                  <div className="text-sm text-blue-100">Campaigns Supported</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.currentStreak}</div>
                  <div className="text-sm text-blue-100">Current Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.totalBadges}</div>
                  <div className="text-sm text-blue-100">Badges Earned</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-8">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <tab.icon className="h-5 w-5 mr-3" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Account Overview
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Impact Stats */}
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900 dark:to-emerald-800 p-6 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <Heart className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                          {stats.livesImpacted}
                        </span>
                      </div>
                      <h3 className="font-semibold text-emerald-800 dark:text-emerald-200">Lives Impacted</h3>
                      <p className="text-sm text-emerald-600 dark:text-emerald-400">Through your donations</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-6 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                          {stats.campaignsCreated}
                        </span>
                      </div>
                      <h3 className="font-semibold text-blue-800 dark:text-blue-200">Campaigns Created</h3>
                      <p className="text-sm text-blue-600 dark:text-blue-400">Your fundraising efforts</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 p-6 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <Trophy className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                        <span className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                          {stats.longestStreak}
                        </span>
                      </div>
                      <h3 className="font-semibold text-purple-800 dark:text-purple-200">Longest Streak</h3>
                      <p className="text-sm text-purple-600 dark:text-purple-400">Days of giving</p>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Recent Activity
                    </h3>
                    <div className="space-y-4">
                      {donationHistory.slice(0, 3).map((donation) => (
                        <div key={donation.id} className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <img
                            src={donation.campaignImage}
                            alt={donation.campaignTitle}
                            className="w-12 h-12 rounded-lg object-cover mr-4"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              Donated {formatCurrency(donation.amount)}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              to "{donation.campaignTitle}"
                            </p>
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(donation.date).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Streak Tracker */}
                  <StreakTracker />
                </div>
              )}

              {activeTab === 'donations' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Donation History
                    </h2>
                    <button className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                      <Download className="h-4 w-4 mr-2" />
                      Export All
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-emerald-50 dark:bg-emerald-900 p-6 rounded-lg text-center">
                      <DollarSign className="h-8 w-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                        {formatCurrency(stats.totalDonated)}
                      </div>
                      <div className="text-sm text-emerald-600 dark:text-emerald-400">Total Donated</div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg text-center">
                      <Target className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                        {stats.campaignsSupported}
                      </div>
                      <div className="text-sm text-blue-600 dark:text-blue-400">Campaigns Supported</div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900 p-6 rounded-lg text-center">
                      <Heart className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                        {stats.livesImpacted}
                      </div>
                      <div className="text-sm text-purple-600 dark:text-purple-400">Lives Impacted</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {donationHistory.map((donation) => (
                      <div key={donation.id} className="flex items-center p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
                        <img
                          src={donation.campaignImage}
                          alt={donation.campaignTitle}
                          className="w-16 h-16 rounded-lg object-cover mr-4"
                        />
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
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      My Campaigns
                    </h2>
                    <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                      Create New Campaign
                    </button>
                  </div>

                  <div className="space-y-6">
                    {myCampaigns.map((campaign) => (
                      <div key={campaign.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          <img
                            src={campaign.image}
                            alt={campaign.title}
                            className="w-full md:w-48 h-48 object-cover"
                          />
                          <div className="flex-1 p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <div className="flex items-center space-x-2 mb-2">
                                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {campaign.title}
                                  </h3>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    campaign.status === 'active' 
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                  }`}>
                                    {campaign.status}
                                  </span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                  {campaign.description}
                                </p>
                                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                                  <span className="flex items-center">
                                    <Users className="h-4 w-4 mr-1" />
                                    {campaign.donors} donors
                                  </span>
                                  <span className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {campaign.daysLeft > 0 ? `${campaign.daysLeft} days left` : 'Completed'}
                                  </span>
                                  <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-full text-xs">
                                    {campaign.category}
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
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'achievements' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Achievements & Badges
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                          achievement.earned
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900 shadow-lg'
                            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 opacity-60'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-4xl mb-3">{achievement.icon}</div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                            {achievement.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                            {achievement.description}
                          </p>
                          {achievement.earned ? (
                            <div className="flex items-center justify-center text-sm text-emerald-600 dark:text-emerald-400">
                              <Check className="h-4 w-4 mr-1" />
                              Earned {achievement.date && new Date(achievement.date).toLocaleDateString()}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Not yet earned
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Account Settings
                  </h2>
                  
                  <div className="space-y-8">
                    {/* Profile Information */}
                    <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Profile Information
                        </h3>
                        <button
                          onClick={() => setIsEditing(!isEditing)}
                          className="flex items-center px-3 py-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded-lg transition-colors"
                        >
                          {isEditing ? <X className="h-4 w-4 mr-1" /> : <Edit3 className="h-4 w-4 mr-1" />}
                          {isEditing ? 'Cancel' : 'Edit'}
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Full Name
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editForm.full_name}
                              onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                          ) : (
                            <p className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white">
                              {user.full_name}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email Address
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <p className="pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400">
                              {user.email}
                            </p>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Email cannot be changed
                          </p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Phone Number
                          </label>
                          {isEditing ? (
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                              <input
                                type="tel"
                                value={editForm.phone}
                                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                placeholder="+254 700 000 000"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                              />
                            </div>
                          ) : (
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                              <p className="pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white">
                                {user.phone || 'Not provided'}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Bio
                          </label>
                          {isEditing ? (
                            <textarea
                              value={editForm.bio}
                              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                              rows={4}
                              placeholder="Tell us about yourself..."
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                            />
                          ) : (
                            <p className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white min-h-[100px]">
                              {user.bio || 'No bio provided'}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {isEditing && (
                        <div className="flex justify-end space-x-3 mt-6">
                          <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveProfile}
                            className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Password Change */}
                    <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Change Password
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Current Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                              type={showPasswords.current ? 'text' : 'password'}
                              value={passwordForm.currentPassword}
                              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                              className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPasswords.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            New Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                              type={showPasswords.new ? 'text' : 'password'}
                              value={passwordForm.newPassword}
                              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                              className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                              type={showPasswords.confirm ? 'text' : 'password'}
                              value={passwordForm.confirmPassword}
                              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                              className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                        
                        <button
                          onClick={handleChangePassword}
                          disabled={!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                          className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Update Password
                        </button>
                      </div>
                    </div>

                    {/* Account Status */}
                    <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Account Status
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 dark:text-gray-300">Account Status</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            user.is_active 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          }`}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 dark:text-gray-300">Verification Status</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            user.verification_status === 'verified' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                          }`}>
                            {user.verification_status === 'verified' ? 'Verified' : 'Pending'}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 dark:text-gray-300">Member Since</span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {new Date(user.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Notification Preferences
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Email Notifications
                      </h3>
                      
                      <div className="space-y-4">
                        {Object.entries({
                          emailCampaignUpdates: 'Campaign updates from campaigns you support',
                          emailDonationReceipts: 'Donation receipts and confirmations',
                          emailStreakReminders: 'Daily streak reminders',
                          emailMarketing: 'Marketing emails and promotions',
                        }).map(([key, label]) => (
                          <label key={key} className="flex items-center justify-between">
                            <span className="text-gray-700 dark:text-gray-300">{label}</span>
                            <input
                              type="checkbox"
                              checked={notifications[key as keyof typeof notifications]}
                              onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                              className="text-emerald-600 focus:ring-emerald-500"
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Push Notifications
                      </h3>
                      
                      <div className="space-y-4">
                        <label className="flex items-center justify-between">
                          <span className="text-gray-700 dark:text-gray-300">Browser push notifications</span>
                          <input
                            type="checkbox"
                            checked={notifications.pushNotifications}
                            onChange={(e) => setNotifications({ ...notifications, pushNotifications: e.target.checked })}
                            className="text-emerald-600 focus:ring-emerald-500"
                          />
                        </label>
                        
                        <label className="flex items-center justify-between">
                          <span className="text-gray-700 dark:text-gray-300">SMS notifications</span>
                          <input
                            type="checkbox"
                            checked={notifications.smsNotifications}
                            onChange={(e) => setNotifications({ ...notifications, smsNotifications: e.target.checked })}
                            className="text-emerald-600 focus:ring-emerald-500"
                          />
                        </label>
                      </div>
                    </div>
                    
                    <button className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors">
                      Save Notification Preferences
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;