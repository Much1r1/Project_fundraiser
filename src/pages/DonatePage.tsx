// src/pages/DonatePage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useUser } from "../hooks/useUser";

type Campaign = {
  id: string;
  title: string;
  goal_amount: number;
  current_amount: number;
};

export default function DonatePage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState<string>("mpesa");

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
        .select("id, title, goal_amount, current_amount")
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

  async function handleDonate(e: React.FormEvent) {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (amount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    // 🔹 Placeholder: later call Daraja, PayPal, Stripe APIs here
    alert(`Processing ${method.toUpperCase()} payment of $${amount}`);

    // Example: record a donation in your DB (optional)
    // await supabase.from("donations").insert({
    //   user_id: user.id,
    //   campaign_id: campaign?.id,
    //   amount,
    //   method,
    //   status: "pending",
    // });

    setAmount(0);
    navigate(`/campaigns/${id}`);
  }

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!campaign) return <p className="p-4">Campaign not found.</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link to={`/campaigns/${campaign.id}`} className="text-blue-600 hover:underline">
        ← Back to Campaign
      </Link>

      <h1 className="text-2xl font-bold mb-4">
        Donate to {campaign.title}
      </h1>

      <form onSubmit={handleDonate} className="space-y-4 bg-white shadow p-6 rounded-lg">
        <div>
          <label className="block mb-1 font-medium">Amount (USD)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full border rounded px-3 py-2"
            min="1"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Payment Method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="mpesa">M-Pesa</option>
            <option value="paypal">PayPal</option>
            <option value="card">Credit/Debit Card</option>
          </select>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Donate
        </button>
      </form>
    </div>
  );
}
