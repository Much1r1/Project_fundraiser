import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, Users, DollarSign, AlertTriangle, Eye, Ban, 
  CheckCircle, Download, Filter, Calendar, Search 
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'users' | 'analytics' | 'reports'>('overview');
  const [dateRange, setDateRange] = useState('30d');

  // Mock data
  const overviewStats = {
    totalRaised: 124567000,
    activeCampaigns: 234,
    totalUsers: 12890,
    successRate: 87,
    pendingReviews: 18,
    reportedCampaigns: 5,
  };

  const chartData = {
    daily: [
      { date: '2024-01-15', donations: 2400, campaigns: 12, users: 45 },
      { date: '2024-01-16', donations: 3200, campaigns: 18, users: 67 },
      { date: '2024-01-17', donations: 2800, campaigns: 15, users: 52 },
      { date: '2024-01-18', donations: 4100, campaigns: 22, users: 78 },
      { date: '2024-01-19', donations: 3600, campaigns: 19, users: 61 },
      { date: '2024-01-20', donations: 4500, campaigns: 25, users: 89 },
      { date: '2024-01-21', donations: 3800, campaigns: 20, users: 73 },
    ],
    categories: [
      { name: 'Medical', value: 35, amount: 435345 },
      { name: 'Education', value: 22, amount: 274068 },
      { name: 'Community', value: 18, amount: 224220 },
      { name: 'Emergency', value: 15, amount: 186851 },
      { name: 'Environment', value: 10, amount: 124567 },
    ],
  };

  const pendingCampaigns = [
    {
      id: '1',
      title: 'Medical Treatment for Sarah',
      creator: 'John Doe',
      category: 'Medical',
      goal: 1500000,
      submitted: '2024-01-20',
      status: 'pending',
    },
    {
      id: '2',
      title: 'School Library Renovation',
      creator: 'Jane Smith',
      category: 'Education',
      goal: 800000,
      submitted: '2024-01-19',
      status: 'pending',
    },
    {
      id: '3',
      title: 'Emergency Relief Fund',
      creator: 'Mike Johnson',
      category: 'Emergency',
      goal: 2500000,
      submitted: '2024-01-18',
      status: 'under_review',
    },
  ];

  const reportedContent = [
    {
      id: '1',
      type: 'campaign',
      title: 'Suspicious fundraiser with fake images',
      reporter: 'Anonymous',
      date: '2024-01-20',
      severity: 'high',
    },
    {
      id: '2',
      type: 'comment',
      title: 'Inappropriate comment on medical campaign',
      reporter: 'User123',
      date: '2024-01-19',
      severity: 'medium',
    },
  ];

  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'campaigns', label: 'Campaigns', icon: Eye },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart },
    { id: 'reports', label: 'Reports', icon: Download },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Admin Dashboard
          </h1>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Monitor and manage platform activities
            </p>
            <div className="flex items-center space-x-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                Export Data
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="flex space-x-8">
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

        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Total Raised
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(overviewStats.totalRaised)}
                    </p>
                  </div>
                  <div className="bg-emerald-100 dark:bg-emerald-900 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
                  +12.5% from last month
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Active Campaigns
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {overviewStats.activeCampaigns}
                    </p>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                    <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                  +8.3% from last month
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Total Users
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {overviewStats.totalUsers.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                    <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
                  +15.1% from last month
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Success Rate
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {overviewStats.successRate}%
                    </p>
                  </div>
                  <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-full">
                    <CheckCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                  +2.4% from last month
                </p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Daily Activity */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Daily Activity
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData.daily}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="donations" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="campaigns" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Campaign Categories */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Campaign Categories
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData.categories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.categories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Action Items */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pending Reviews */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Pending Reviews ({overviewStats.pendingReviews})
                  </h3>
                  <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {pendingCampaigns.slice(0, 3).map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {campaign.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          by {campaign.creator} • {formatCurrency(campaign.goal)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded">
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded">
                          <Ban className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reported Content */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Reported Content ({overviewStats.reportedCampaigns})
                  </h3>
                  <button className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {reportedContent.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                          <span className={`text-xs font-medium px-2 py-1 rounded ${
                            report.severity === 'high' 
                              ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200'
                              : 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200'
                          }`}>
                            {report.severity.toUpperCase()}
                          </span>
                        </div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {report.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Reported by {report.reporter}
                        </p>
                      </div>
                      <button className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Campaign Management
                </h3>
                <div className="flex space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search campaigns..."
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Pending</option>
                    <option>Completed</option>
                    <option>Suspended</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3">Campaign</th>
                      <th className="px-6 py-3">Creator</th>
                      <th className="px-6 py-3">Category</th>
                      <th className="px-6 py-3">Goal</th>
                      <th className="px-6 py-3">Raised</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingCampaigns.map((campaign, index) => (
                      <tr key={campaign.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                          {campaign.title}
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                          {campaign.creator}
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded">
                            {campaign.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                          {formatCurrency(campaign.goal)}
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                          {formatCurrency(Math.floor(campaign.goal * Math.random() * 0.8))}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                            campaign.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                              : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
                          }`}>
                            {campaign.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button className="text-green-600 hover:text-green-800">
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button className="text-blue-600 hover:text-blue-800">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-800">
                              <Ban className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Revenue Trend */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Revenue Trend
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData.daily}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="donations" stroke="#10B981" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* User Growth */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  User Growth
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.daily}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;