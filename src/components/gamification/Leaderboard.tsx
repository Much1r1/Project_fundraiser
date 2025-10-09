import { useEffect, useState } from 'react';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase'; // Adjusted the import path

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string | null;
  streak: number;
  donations: number;
  totalDonated: number;
}

const Leaderboard = () => {
  const [donors, setDonors] = useState<LeaderboardEntry[]>([]); // State to hold leaderboard data

  // Fetch leaderboard data from Supabase (this is a placeholder, replace with actual query)
  useEffect(() => {
    const fetchLeaderboard = async () => {
      // Get donation aggregates from Supabase
      const { data: donationsData, error } = await supabase
        .from('donations')
        .select('donor_id, amount, users(full_name, avatar_url)')
        .eq('payment_status', 'completed')
        .order('amount', { ascending: false });

      if (error) {
        console.error('Error fetching donations:', error);
        return;
      }

      // Aggregate donations by donor
      const userTotals: Record<string, {donations: number; totalDonated: number }> = {};
      donationsData?.forEach((donation: { donor_id: string; amount: number; users: { full_name: string; avatar_url: string | null }[] }) => {
        const user = donation.users[0]; // Assuming the first user in the array is the donor
        if (user) {
          if (!userTotals[donation.donor_id]) {
            userTotals[donation.donor_id] = { donations: 0, totalDonated: 0 };
          }
          userTotals[donation.donor_id].donations += 1;
          userTotals[donation.donor_id].totalDonated += donation.amount;
        }
      });

        //Fetch user details
        const { data: usersData } = await supabase
        .from('users')
        .select('id, full_name, avatar_url');

        //Optionally, fetch user streaks from a hypothetical 'user_streaks' table
        const { data: streaksData } = await supabase
        .from('donor_engagement')
        .select('donor_id, current_streak');

        const streakMap = streaksData?.reduce((acc: Record<string, number>, s: { donor_id: string; current_streak: number }) => {
          acc[s.donor_id] = s.current_streak;
          return acc;
        }, {} as Record<string, number>);

      // Combine data into leaderboard entries
      const leaderboard = usersData
      ?.filter((u: { id: string }) => userTotals[u.id])
      .map((u: { id: string; full_name: string; avatar_url: string | null }) => ({
        rank: 0, // Will set ranks later
        name: u.full_name,
        avatar: u.avatar_url || null,
        streak: streakMap?.[u.id] || 0,
        donations: userTotals[u.id].donations,
        totalDonated: userTotals[u.id].totalDonated,
      }))
      .sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.totalDonated - a.totalDonated)
      .map((d: LeaderboardEntry, idx: number) => ({ ...d, rank: idx + 1 })) // Assign ranks
      .slice(0, 5); // Top 5 donors

      setDonors(leaderboard || []);
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-orange-500" />;
      default:
        return <span className="text-gray-500 font-bold">#{rank}</span>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en- KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-full mr-4">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Top Donors This Month
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Our community champions
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {donors.map((donor) => (
          <div
            key={donor.rank}
            className={`flex items-center p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
              donor.rank <= 3
                ? 'border-gradient-to-r from-yellow-400 to-orange-500 bg-gradient-to-r dark:from-yellow-900 dark:to-orange-900'
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700'
            }`}
          >
            <div className="flex items-center mr-4">
              {getRankIcon(donor.rank)}
            </div>

            <img
              src={donor.avatar || 'https://ui-avatars.com/api/?name=Anonymous&background=10b981&color=fff'}
              alt={donor.name}
              className="w-12 h-12 rounded-full mr-4"
            />


            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {donor.name}
              </h4>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                <span className="flex items-center">
                  🔥 {donor.streak} day streak
                </span>
                <span>{donor.donations} donations</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {formatCurrency(donor.totalDonated)}
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-300">
                total donated
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium">
          View Full Leaderboard →
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;

        

