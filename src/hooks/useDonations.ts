import { useState, useEffect } from 'react';
import { supabase, Donation } from '../lib/supabase';

export const useDonations = (campaignId?: string) => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (campaignId) {
      fetchDonations();
    }
  }, [campaignId]);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('donations')
        .select(`
          *,
          users (
            full_name,
            avatar_url
          )
        `)
        .eq('payment_status', 'completed')
        .order('created_at', { ascending: false });

      if (campaignId) {
        query = query.eq('campaign_id', campaignId);
      }

      const { data, error } = await query;

      if (error) throw error;

      setDonations(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createDonation = async (donationData: {
    campaign_id: string;
    amount: number;
    payment_method: 'mpesa' | 'paypal' | 'card';
    is_anonymous: boolean;
    donor_message?: string;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('donations')
        .insert({
          ...donationData,
          donor_id: user?.id,
          payment_reference: `PAY_${Date.now()}`,
          payment_status: 'completed', // In real app, this would be 'pending' initially
        })
        .select()
        .single();

      if (error) throw error;

      // Update campaign current_amount
      const { error: updateError } = await supabase.rpc('increment_campaign_amount', {
        campaign_id: donationData.campaign_id,
        amount: donationData.amount
      });

      if (updateError) throw updateError;

      await fetchDonations();
      return data;
    } catch (err) {
      throw err;
    }
  };

  return { donations, loading, error, createDonation, refetch: fetchDonations };
};