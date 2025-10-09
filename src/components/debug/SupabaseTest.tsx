import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const SupabaseTest = () => {
  const [status, setStatus] = useState('Testing...');
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState(null);
  const [rawData, setRawData] = useState(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      console.log('🔍 Testing Supabase connection...');
      console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
      
      setStatus('Testing connection...');
      
      // Test 1: Simple table list
      console.log('📋 Step 1: Testing basic connection...');
      const { data: testData, error: testError } = await supabase
        .from('campaigns')
        .select('count', { count: 'exact', head: true });
      
      if (testError) {
        console.error('❌ Basic connection failed:', testError);
        setError(`Connection failed: ${testError.message}`);
        setStatus('Connection Failed');
        return;
      }
      
      console.log('✅ Basic connection successful, count:', testData);
      
      // Test 2: Fetch actual data
      console.log('📋 Step 2: Fetching campaign data...');
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .limit(5);

      console.log('📊 Raw query response:', { data, error });
      setRawData({ data, error });

      if (error) {
        console.error('❌ Data fetch error:', error);
        setError(`Data fetch failed: ${error.message}`);
        setStatus('Data Fetch Failed');
      } else {
        console.log('✅ Data fetch successful:', data?.length || 0, 'campaigns');
        setCampaigns(data || []);
        setStatus(`Connected! Found ${data?.length || 0} campaigns`);
      }
    } catch (err) {
      console.error('💥 Connection test error:', err);
      setError(`Connection error: ${err.message}`);
      setStatus('Connection Error');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg m-4 border-l-4 border-blue-500">
      <h2 className="text-xl font-bold mb-4 text-blue-600">🔧 Supabase Debug Panel</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <strong className="text-green-600">Status:</strong> 
            <span className={`ml-2 px-2 py-1 rounded text-sm ${
              status.includes('Connected') ? 'bg-green-100 text-green-800' : 
              status.includes('Failed') || status.includes('Error') ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {status}
            </span>
          </div>
          
          <div>
            <strong className="text-blue-600">Environment:</strong>
            <div className="text-sm mt-1">
              <div>URL: {import.meta.env.VITE_SUPABASE_URL ? '✅ SET' : '❌ NOT SET'}</div>
              <div>Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ SET' : '❌ NOT SET'}</div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <strong>❌ Error:</strong> {error}
          </div>
        )}

        {campaigns.length > 0 && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            <strong>✅ Campaigns Found ({campaigns.length}):</strong>
            <ul className="mt-2 space-y-1">
              {campaigns.slice(0, 3).map((campaign, index) => (
                <li key={index} className="text-sm">
                  • {campaign.title || 'Untitled'} ({campaign.category || 'No category'})
                </li>
              ))}
            </ul>
          </div>
        )}

        {rawData && (
          <details className="bg-gray-50 border border-gray-200 rounded p-3">
            <summary className="cursor-pointer font-medium">🔍 Raw Query Data</summary>
            <pre className="mt-2 text-xs overflow-auto bg-gray-100 p-2 rounded">
              {JSON.stringify(rawData, null, 2)}
            </pre>
          </details>
        )}

        <div className="flex space-x-2">
          <button
            onClick={testConnection}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            🔄 Test Again
          </button>
          
          <button
            onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            🚀 Open Supabase Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupabaseTest;