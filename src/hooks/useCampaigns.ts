import { useState, useEffect } from 'react';
import { supabase, Campaign } from '../lib/supabase';

export const useCampaigns = (filters?: {
  category?: string;
  search?: string;
  status?: string;
  limit?: number;
}) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCampaigns();
  }, [filters]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      console.log('Fetching campaigns...');
      
      let query = supabase
        .from('campaigns')
        .select(`
          *,
          users (
            full_name,
            avatar_url,
            verification_status
          )
        `)
        .eq('campaign_status', 'active')
        .eq('verification_status', 'verified')
        .order('created_at', { ascending: false });

      if (filters?.category && filters.category !== 'All') {
        query = query.eq('category', filters.category);
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      console.log('Executing query...');
      const { data, error } = await query;

      if (error) throw error;

      console.log('Campaigns fetched:', data?.length || 0);
      setCampaigns(data || []);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  return { campaigns, loading, error, refetch: fetchCampaigns };
};

export const useCampaign = (id: string) => {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchCampaign();
    }
  }, [id]);

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('campaigns')
        .select(`
          *,
          users (
            full_name,
            avatar_url,
            verification_status
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      setCampaign(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Campaign not found');
    } finally {
      setLoading(false);
    }
  };

  return { campaign, loading, error, refetch: fetchCampaign };
};