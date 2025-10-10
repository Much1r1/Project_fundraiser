// src/pages/ProfilePage.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  User, Settings, Download, Heart, Calendar, Award, TrendingUp, 
  DollarSign, Bell, Shield, Eye, EyeOff, Camera, Save, X, 
  Target, Users, Clock, Star, Trophy, Lock, Mail, Phone, 
  LogOut, Edit3, CheckCircle, AlertCircle, Gift, Zap, Crown,
  Activity, BarChart3, Share2, Copy, ExternalLink, Trash2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useUser } from '../hooks/useUser';
import toast from 'react-hot-toast';

type Campaign = {
  id: string;
  title: string;
  description: string;
  goal_amount: number;
  current_amount: number;
  image_url?: string;
  category: string;
  status: 'active' | 'completed' | 'paused';
  created_at: string;
};

type Donation = {
  id: string;
  amount: number;
  campaign_title: string;
  campaign_image?: string;
  created_at: string;
  payment_method: string;
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  
  const { user, loading: userLoading } = useUser();

  // States
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState({
    totalDonated: 0,
    campaignsSupported: 0,
    campaignsCreated: 0,
    currentStreak: 0,
  });

  // Edit form
  const [editForm, setEditForm] = useState({
    full_name: '',
    phone: '',
    bio: '',
  });

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    emailReceipts: true,
    emailMarketing: false,
    pushNotifications: true,
  });

  useEffect(() => {
    if (user) {
      setEditForm({
        full_name: user.user_metadata?.full_name || user.email || '',
        phone: user.user_metadata?.phone || '',
        bio: user.user_metadata?.bio || '',
      });
      fetchUserData();
    }
  }, [user]);

  async function fetchUserData() {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch user's campaigns
      const { data: campaignsData, error: campaignsError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!campaignsError && campaignsData) {
        setCampaigns(campaignsData);
      }

      // Fetch user's donations
      const { data: donationsData, error: donationsError } = await supabase
        .from('donations')
        .select(`
          id,
          amount,
          created_at,
          payment_method,
          campaigns (
            title,
            image_url
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!donationsError && donationsData) {
        const formattedDonations = donationsData.map((d: any) => ({
          id: d.id,
          amount: d.amount,
          campaign_title: d.campaigns?.title || 'Unknown Campaign',
          campaign_image: d.campaigns?.image_url,
          created_at: d.created_at,
          payment_method: d.payment_method || 'M-Pesa',
        }));
        setDonations(formattedDonations);

        // Calculate stats
        const totalDonated = donationsData.reduce((sum: number, d: any) => sum + (d.amount || 0), 0);
        const uniqueCampaigns = new Set(donationsData.map((d: any) => d.campaign_id)).size;

        setStats({
          totalDonated,
          campaignsSupported: uniqueCampaigns,
          campaignsCreated: campaignsData?.length || 0,
          currentStreak: 0, // Implement streak logic
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveProfile() {
    if (!user) return;

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: editForm.full_name,
          phone: editForm.phone,
          bio: editForm.bio,
        }
      });

      if (error) throw error;

      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    }
  }

  async function handleChangePassword() {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
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
      setPasswordForm({ newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to update password');
    }
  }

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  }

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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'donations', label: 'My Donations', icon: Heart },
    { id: 'campaigns', label: 'My Campaigns', icon: TrendingUp },
    { id: 'rewards', label: 'Rewards', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Show loading state only briefly
  if (userLoading && !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if no user after timeout
  if (showLoginPrompt && !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please log in to view your profile
          </h2>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-emerald-500 via-blue-600 to-purple-700 rounded-lg p-8 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <img
                src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(editForm.full_name)}&background=10b981&color=fff&size=120`}
                alt={editForm.full_name}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg"
              />
              <button className="absolute bottom-0 right-0 bg-white text-gray-700 rounded-full p-2 shadow-lg hover:bg-gray-100">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{editForm.full_name}</h1>
              <p className="text-blue-100 mb-4">{user.email}</p>
              
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
                  <div className="text-2xl font-bold">{stats.campaignsCreated}</div>
                  <div className="text-sm text-blue-100">Campaigns Created</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.currentStreak}</div>
                  <div className="text-sm text-blue-100">Day Streak 🔥</div>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="md:self-start px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg flex items-center gap-2 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
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
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Account Overview
                  </h2>
                  
                  {/* Impact Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900 dark:to-emerald-800 p-6 rounded-lg">
                      <Heart className="h-8 w-8 text-emerald-600 dark:text-emerald-400 mb-4" />
                      <h3 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2">Total Impact</h3>
                      <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
                        {formatCurrency(stats.totalDonated)}
                      </p>
                      <p className="text-sm text-emerald-600 dark:text-emerald-400">Donated to {stats.campaignsSupported} campaigns</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-6 rounded-lg">
                      <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-4" />
                      <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">My Campaigns</h3>
                      <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                        {stats.campaignsCreated}
                      </p>
                      <p className="text-sm text-blue-600 dark:text-blue-400">Active fundraising campaigns</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 p-6 rounded-lg">
                      <Zap className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-4" />
                      <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Streak</h3>
                      <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                        {stats.currentStreak} 🔥
                      </p>
                      <p className="text-sm text-purple-600 dark:text-purple-400">Days of consistent giving</p>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Recent Activity
                    </h3>
                    {loading ? (
                      <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                    ) : donations.length === 0 ? (
                      <p className="text-gray-600 dark:text-gray-400">No recent activity</p>
                    ) : (
                      <div className="space-y-4">
                        {donations.slice(0, 5).map((donation) => (
                          <div key={donation.id} className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            {donation.campaign_image && (
                              <img
                                src={donation.campaign_image}
                                alt={donation.campaign_title}
                                className="w-12 h-12 rounded-lg object-cover mr-4"
                              />
                            )}
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                Donated {formatCurrency(donation.amount)}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                to "{donation.campaign_title}"
                              </p>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(donation.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Donations Tab */}
              {activeTab === 'donations' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Donation History
                    </h2>
                    <button className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </button>
                  </div>

                  {loading ? (
                    <p>Loading donations...</p>
                  ) : donations.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">No donations yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {donations.map((donation) => (
                        <div key={donation.id} className="flex items-center p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
                          {donation.campaign_image && (
                            <img
                              src={donation.campaign_image}
                              alt={donation.campaign_title}
                              className="w-16 h-16 rounded-lg object-cover mr-4"
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {donation.campaign_title}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                              <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(donation.created_at).toLocaleDateString()}
                              </span>
                              <span className="flex items-center">
                                <DollarSign className="h-4 w-4 mr-1" />
                                {formatCurrency(donation.amount)}
                              </span>
                              <span className="text-emerald-600 dark:text-emerald-400">
                                {donation.payment_method}
                              </span>
                            </div>
                          </div>
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Campaigns Tab */}
              {activeTab === 'campaigns' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      My Campaigns
                    </h2>
                    <button
                      onClick={() => navigate('/campaigns/create')}
                      className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
                    >
                      Create New Campaign
                    </button>
                  </div>

                  {loading ? (
                    <p>Loading campaigns...</p>
                  ) : campaigns.length === 0 ? (
                    <div className="text-center py-12">
                      <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 mb-4">No campaigns yet</p>
                      <button
                        onClick={() => navigate('/campaigns/create')}
                        className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700"
                      >
                        Create Your First Campaign
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {campaigns.map((campaign) => (
                        <div key={campaign.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            {campaign.image_url && (
                              <img
                                src={campaign.image_url}
                                alt={campaign.title}
                                className="w-full md:w-48 h-48 object-cover"
                              />
                            )}
                            <div className="flex-1 p-6">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    {campaign.title}
                                  </h3>
                                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    {campaign.description}
                                  </p>
                                </div>
                              </div>

                              <div className="mb-4">
                                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                                  <span>Progress</span>
                                  <span>{Math.round((campaign.current_amount / campaign.goal_amount) * 100)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div
                                    className="bg-gradient-to-r from-emerald-500 to-blue-600 h-2 rounded-full"
                                    style={{ width: `${Math.min((campaign.current_amount / campaign.goal_amount) * 100, 100)}%` }}
                                  />
                                </div>
                                <div className="flex justify-between mt-2">
                                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {formatCurrency(campaign.current_amount)}
                                  </span>
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
                                    of {formatCurrency(campaign.goal_amount)}
                                  </span>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <button
                                  onClick={() => navigate(`/campaigns/${campaign.id}`)}
                                  className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700"
                                >
                                  View Campaign
                                </button>
                                <button
                                  onClick={() => navigate(`/campaigns/edit/${campaign.id}`)}
                                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </button>
                                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                                  <Share2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Rewards Tab */}
              {activeTab === 'rewards' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Rewards & Achievements
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800 p-6 rounded-lg text-center">
                      <Crown className="h-12 w-12 text-yellow-600 dark:text-yellow-400 mx-auto mb-4" />
                      <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Level</h3>
                      <p className="text-4xl font-bold text-yellow-700 dark:text-yellow-300">5</p>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">Gold Member</p>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900 dark:to-emerald-800 p-6 rounded-lg text-center">
                      <Star className="h-12 w-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-4" />
                      <h3 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2">Points</h3>
                      <p className="text-4xl font-bold text-emerald-700 dark:text-emerald-300">2,450</p>
                      <p className="text-sm text-emerald-600 dark:text-emerald-400">550 to next level</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 p-6 rounded-lg text-center">
                      <Trophy className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                      <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Badges</h3>
                      <p className="text-4xl font-bold text-purple-700 dark:text-purple-300">12</p>
                      <p className="text-sm text-purple-600 dark:text-purple-400">Achievements unlocked</p>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Recent Achievements
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: 'First Donation', icon: '🎯', earned: true },
                      { name: 'Week Streak', icon: '🔥', earned: true },
                      { name: 'Generous Giver', icon: '💎', earned: true },
                      { name: 'Community Builder', icon: '🏗️', earned: true },
                    ].map((achievement, i) => (
                      <div
                        key={i}
                        className="p-4 border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-900 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-4xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {achievement.name}
                            </h4>
                            <p className="text-sm text-emerald-600 dark:text-emerald-400">
                              ✓ Earned
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Settings Tab */}
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
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                            />
                          ) : (
                            <p className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white">
                              {editForm.full_name}
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
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                              />
                            </div>
                          ) : (
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                              <p className="pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white">
                                {editForm.phone || 'Not provided'}
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
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 resize-none"
                            />
                          ) : (
                            <p className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white min-h-[100px]">
                              {editForm.bio || 'No bio provided'}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {isEditing && (
                        <div className="flex justify-end gap-3 mt-6">
                          <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveProfile}
                            className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
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
                            New Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                              type={showPasswords.new ? 'text' : 'password'}
                              value={passwordForm.newPassword}
                              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                              className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
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
                              className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
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
                          disabled={!passwordForm.newPassword || !passwordForm.confirmPassword}
                          className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Update Password
                        </button>
                      </div>
                    </div>

                    {/* Notification Settings */}
                    <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Notification Preferences
                      </h3>
                      
                      <div className="space-y-4">
                        <label className="flex items-center justify-between">
                          <span className="text-gray-700 dark:text-gray-300">Campaign updates</span>
                          <input
                            type="checkbox"
                            checked={notifications.emailUpdates}
                            onChange={(e) => setNotifications({ ...notifications, emailUpdates: e.target.checked })}
                            className="w-5 h-5 text-emerald-600 focus:ring-emerald-500 rounded"
                          />
                        </label>
                        
                        <label className="flex items-center justify-between">
                          <span className="text-gray-700 dark:text-gray-300">Donation receipts</span>
                          <input
                            type="checkbox"
                            checked={notifications.emailReceipts}
                            onChange={(e) => setNotifications({ ...notifications, emailReceipts: e.target.checked })}
                            className="w-5 h-5 text-emerald-600 focus:ring-emerald-500 rounded"
                          />
                        </label>
                        
                        <label className="flex items-center justify-between">
                          <span className="text-gray-700 dark:text-gray-300">Marketing emails</span>
                          <input
                            type="checkbox"
                            checked={notifications.emailMarketing}
                            onChange={(e) => setNotifications({ ...notifications, emailMarketing: e.target.checked })}
                            className="w-5 h-5 text-emerald-600 focus:ring-emerald-500 rounded"
                          />
                        </label>
                        
                        <label className="flex items-center justify-between">
                          <span className="text-gray-700 dark:text-gray-300">Push notifications</span>
                          <input
                            type="checkbox"
                            checked={notifications.pushNotifications}
                            onChange={(e) => setNotifications({ ...notifications, pushNotifications: e.target.checked })}
                            className="w-5 h-5 text-emerald-600 focus:ring-emerald-500 rounded"
                          />
                        </label>
                      </div>
                      
                      <button className="w-full mt-6 bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700">
                        Save Preferences
                      </button>
                    </div>

                    {/* Account Actions */}
                    <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Account Actions
                      </h3>
                      
                      <div className="space-y-3">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"
                        >
                          <LogOut className="h-5 w-5" />
                          Logout
                        </button>
                        
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800">
                          <Trash2 className="h-5 w-5" />
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}