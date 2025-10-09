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
      setError(null);
      console.log('🔍 Starting campaign fetch...');
      
      // Start with a simple query first
      let query = supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      // Add filters if provided
      if (filters?.category && filters.category !== 'All') {
        query = query.eq('category', filters.category);
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      console.log('🚀 Executing query...');
      const { data, error: queryError } = await query;

      console.log('📊 Query result:', { data: data?.length || 0, error: queryError });

      if (queryError) {
        console.error('❌ Query error:', queryError);
        throw queryError;
      }

      console.log('✅ Campaigns fetched successfully:', data?.length || 0);
      setCampaigns(data || []);
    } catch (err) {
      console.error('💥 Fetch error:', err);
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
      console.log('🔍 Fetching single campaign:', id);
      
      const { data, error: queryError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single();

      if (queryError) {
        console.error('❌ Single campaign query error:', queryError);
        throw queryError;
      }

      console.log('✅ Single campaign fetched:', data);
      setCampaign(data);
    } catch (err) {
      console.error('💥 Single campaign fetch error:', err);
      setError(err instanceof Error ? err.message : 'Campaign not found');
    } finally {
      setLoading(false);
    }
  };

  return { campaign, loading, error, refetch: fetchCampaign };
};