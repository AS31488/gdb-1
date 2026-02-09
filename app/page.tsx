"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [query, setQuery] = useState('');
  const [games, setGames] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // <--- ADD THIS LINE
  // Load news on startup
  useEffect(() => {
    axios.get('/api/news').then(res => setNews(res.data));
  }, []);

  // Search function
  const handleSearch = async () => {
    setLoading(true);
    const res = await axios.post('/api/search', { query });
    setError(''); // Clear previous errors
    setGames([]); // Clear previous results

    try {
    const res = await axios.post('/api/search', { query });
    setGames(res.data);
  } catch (err: any) {
    console.error("Search failed:", err);
    // This will show the real error from the backend on your screen
    setError(err.response?.data?.error || 'Something went wrong. Check Vercel Logs.');
  } finally {
    setLoading(false); // <--- THIS FIXES THE "STUCK" ISSUE
  }
};

return (
  <div className="min-h-screen bg-gray-900 text-white p-8">
    {/* Inside the return(), above the Game Database section */}
    {error && (
      <div className="bg-red-500 text-white p-4 rounded mb-4 font-bold">
        ERROR: {error}
      </div>
    )}
      {/* Header & Search */}
      <h1 className="text-4xl font-bold mb-8 text-center text-purple-500">GameNexus DB</h1>
      
      <div className="flex justify-center mb-12">
        <input 
          type="text" 
          className="p-3 rounded-l-lg text-black w-96" 
          placeholder="Search for a game (e.g., Elden Ring)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button 
          onClick={handleSearch}
          className="bg-purple-600 p-3 rounded-r-lg hover:bg-purple-700 font-bold"
        >
          Search
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Col: Search Results */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Game Database</h2>
          {loading ? <p>Scanning database...</p> : null}
          
          <div className="grid grid-cols-1 gap-6">
            {games.map((game: any) => (
              <div key={game.id} className="bg-gray-800 p-4 rounded-xl flex gap-4">
                {game.cover && (
                  <img 
                    src={`https:${game.cover.url}`.replace('t_thumb', 't_cover_big')} 
                    alt={game.name} 
                    className="w-32 h-48 object-cover rounded"
                  />
                )}
                <div>
                  <h3 className="text-xl font-bold">{game.name}</h3>
                  <p className="text-gray-400 text-sm mt-2">{game.summary?.substring(0, 150)}...</p>
                  
                  {/* The "Connected" Engine Feature */}
                  {game.similar_games && (
                    <div className="mt-4">
                      <p className="text-xs text-purple-400 font-bold uppercase mb-1">Related Games:</p>
                      <div className="flex gap-2">
                        {game.similar_games.slice(0, 3).map((sim: any) => (
                          <span key={sim.id} className="text-xs bg-gray-700 px-2 py-1 rounded">
                            {sim.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Live News Feed */}
        <div className="md:col-span-1">
          <h2 className="text-2xl font-bold mb-4">Industry News</h2>
          <div className="space-y-4">
            {news.map((item, idx) => (
              <a href={item.link} key={idx} target="_blank" className="block bg-gray-800 p-4 rounded-xl hover:bg-gray-700 transition">
                <h4 className="font-bold text-sm text-purple-300">{item.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{new Date(item.pubDate).toLocaleDateString()}</p>
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}