import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const SupabaseTest = () => {
  const [status, setStatus] = useState('Testing...');
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      console.log('🔍 Testing Supabase connection...');
      console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
      
      // Test basic connection
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .limit(5);

      if (error) {
        console.error('❌ Supabase Error:', error);
        setError(error.message);
        setStatus('Connection Failed');
      } else {
        console.log('✅ Supabase Success:', data);
        setCampaigns(data || []);
        setStatus(`Connected! Found ${data?.length || 0} campaigns`);
      }
    } catch (err) {
      console.error('❌ Connection Error:', err);
      setError(err.message);
      setStatus('Connection Error');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg m-4">
      <h2 className="text-xl font-bold mb-4">Supabase Connection Test</h2>
      
      <div className="space-y-4">
        <div>
          <strong>Status:</strong> {status}
        </div>
        
        <div>
          <strong>Environment:</strong>
          <ul className="ml-4">
            <li>URL: {import.meta.env.VITE_SUPABASE_URL || 'NOT SET'}</li>
            <li>Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'}</li>
          </ul>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}

        {campaigns.length > 0 && (
          <div>
            <strong>Campaigns Found:</strong>
            <ul className="ml-4">
              {campaigns.map((campaign, index) => (
                <li key={index}>{campaign.title || 'Untitled Campaign'}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={testConnection}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Test Again
        </button>
      </div>
    </div>
  );
};

export default SupabaseTest;