// src/pages/CampaignDetailPage.tsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useUser } from "../hooks/useUser";

type Campaign = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  story: string;
  category: string;
  goal_amount: number;
  current_amount: number;
  image_url?: string;
  video_url?: string;
  created_at: string;
};

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: userLoading } = useUser();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchCampaign();
  }, [id]);

  async function fetchCampaign() {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setCampaign(data);
    } catch (err: any) {
      setError(err.message || "Failed to load campaign.");
    } finally {
      setLoading(false);
    }
  }

  if (loading || userLoading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!campaign) return <p className="p-4">Campaign not found.</p>;

  const isOwner = user?.id === campaign.user_id;
  const progress =
    campaign.goal_amount > 0
      ? Math.min(
          100,
          Math.round((campaign.current_amount / campaign.goal_amount) * 100)
        )
      : 0;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back
      </button>

      <div className="bg-white rounded-lg shadow p-6">
        {campaign.image_url && (
          <img
            src={campaign.image_url}
            alt={campaign.title}
            className="w-full h-64 object-cover rounded mb-4"
          />
        )}

        <h1 className="text-2xl font-bold mb-2">{campaign.title}</h1>
        <p className="text-gray-600 mb-4">{campaign.description}</p>

        {/* Video */}
        {campaign.video_url && (
          <div className="mb-4">
            <iframe
              src={campaign.video_url}
              title="Campaign Video"
              className="w-full h-64 rounded"
              allowFullScreen
            />
          </div>
        )}

        {/* Story */}
        <div className="prose max-w-none mb-6">
          <h2 className="text-xl font-semibold mb-2">Story</h2>
          <p>{campaign.story}</p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <p>
            <span className="font-medium">Raised:</span> $
            {campaign.current_amount.toLocaleString()} of $
            {campaign.goal_amount.toLocaleString()}
          </p>
          <div className="w-full bg-gray-200 h-3 rounded">
            <div
              className="h-3 bg-green-500 rounded"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-1">{progress}% funded</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {/* Donate */}
          {user ? (
            <Link
              to={`/campaigns/${campaign.id}/donate`}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Donate
            </Link>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Login to Donate
            </Link>
          )}

          {/* Edit if owner */}
          {isOwner && (
            <Link
              to={`/campaigns/edit/${campaign.id}`}
              className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600"
            >
              Edit
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
