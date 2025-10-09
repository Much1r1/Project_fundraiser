// src/pages/CampaignPage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useUser } from "../hooks/useUser";

type Campaign = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  goal_amount: number;
  current_amount: number;
  image_url?: string;
  visibility?: "public" | "members" | "admin"; // Add visibility field
  created_at: string;
};

export default function CampaignPage() {
  const { user, loading: userLoading } = useUser();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // For now, set isAdmin to false. You can add admin logic later when you have a profiles table
  const [isAdmin] = useState(false);
  const [hasMoreCampaigns, setHasMoreCampaigns] = useState(false);

  // pagination state
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);
  const [totalCount, setTotalCount] = useState(0);

  // search state
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCampaigns();
  }, [page, search, user?.id]);

  async function fetchCampaigns() {
    console.log('🔍 Fetching campaigns...', { user: user?.id, isAdmin, page, search });
    setLoading(true);
    setError(null);

    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from("campaigns")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });

      // TEMPORARILY DISABLED - Testing if visibility filtering is the issue
      // Apply visibility filters based on user status
      /*
      if (isAdmin) {
        // Admin sees all campaigns - no filter needed
      } else if (user) {
        // Logged-in users see public and members campaigns
        query = query.in("visibility", ["public", "members"]);
      } else {
        // Non-logged-in users see only public campaigns
        query = query.eq("visibility", "public");
      }
      */
      if (search.trim()) {
        query = query.ilike("title", `%${search.trim()}%`);
      }

      query = query.range(from, to);

      console.log('🚀 About to execute query...');
      const { data, error, count } = await query;

      console.log('📊 Query results:', { data, error, count, totalCampaigns: data?.length });

      if (error) throw error;

      setCampaigns(data || []);
      setTotalCount(count || 0);

      // Check if there are more campaigns available for logged-in users
      if (!user) {
        await checkForMoreCampaigns();
      } else {
        setHasMoreCampaigns(false);
      }
    } catch (err: any) {
      console.error('❌ Error fetching campaigns:', err);
      setError(err.message || "Failed to load campaigns.");
    } finally {
      console.log('✅ Fetch complete, loading set to false');
      setLoading(false);
    }
  }

  async function checkForMoreCampaigns() {
    try {
      // Check if there are members or admin campaigns
      const { count } = await supabase
        .from("campaigns")
        .select("*", { count: "exact", head: true })
        .in("visibility", ["members", "admin"]);

      setHasMoreCampaigns((count || 0) > 0);
    } catch (err) {
      console.error("Error checking for more campaigns:", err);
    }
  }

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          
          {isAdmin && (
            <span className="ml-2 text-sm font-normal text-gray-600">
              (Admin View)
            </span>
          )}
        </h1>
        {user && (
          <Link
            to="/create-campaign"
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            + Create Campaign
          </Link>
        )}
      </div>

      {/* Show login prompt for non-logged-in users */}
      {!user && hasMoreCampaigns && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 mb-2">
            You're viewing public campaigns only. Log in to see exclusive member campaigns!
          </p>
          <Link
            to="/login"
            className="inline-block px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
          >
            View More Campaigns →
          </Link>
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search campaigns..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      {/* Campaigns List */}
      {loading ? (
        <p>Loading campaigns...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No campaigns found.</p>
          {!user && (
            <Link
              to="/login"
              className="inline-block px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Login to See More
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((c) => (
            <div
              key={c.id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition"
            >
              {c.image_url && (
                <img
                  src={c.image_url}
                  alt={c.title}
                  className="w-full h-40 object-cover rounded mb-3"
                />
              )}
              
              {/* Visibility badge */}
              {(isAdmin || user?.id === c.user_id) && c.visibility && (
                <span className={`inline-block px-2 py-1 rounded text-xs mb-2 ${
                  c.visibility === "public" ? "bg-green-100 text-green-800" :
                  c.visibility === "members" ? "bg-blue-100 text-blue-800" :
                  "bg-purple-100 text-purple-800"
                }`}>
                  {c.visibility}
                </span>
              )}

              <h2 className="text-lg font-semibold">{c.title}</h2>
              <p className="text-sm text-gray-600 line-clamp-2">
                {c.description}
              </p>
              <p className="mt-2 text-sm">
                <span className="font-medium">Category:</span> {c.category}
              </p>
              <p className="text-sm">
                <span className="font-medium">Goal:</span> ${c.goal_amount}
              </p>
              <p className="text-sm">
                <span className="font-medium">Raised:</span> ${c.current_amount}
              </p>

              <div className="mt-3 flex gap-2">
                <Link
                  to={`/campaigns/${c.id}`}
                  className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
                >
                  View
                </Link>

                {/* Show edit if campaign belongs to logged-in user */}
                {user?.id === c.user_id && (
                  <Link
                    to={`/campaigns/edit/${c.id}`}
                    className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600 text-sm"
                  >
                    Edit
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}