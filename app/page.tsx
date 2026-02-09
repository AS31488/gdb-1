"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [query, setQuery] = useState('');
  const [games, setGames] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // Store error messages

  // Load news on startup (optional)
  useEffect(() => {
    axios.get('/api/news').then(res => setNews(res.data)).catch(console.error);
  }, []);

  const handleSearch = async () => {
    // 1. Input Validation
    if (!query) return;
    
    // 2. Reset State
    setLoading(true);
    setError('');
    setGames([]);

    try {
      // 3. Perform Search
      const res = await axios.post('/api/search', { query });
      setGames(res.data);
    } catch (err: any) {
      // 4. Handle Errors Gracefully
      console.error("Search failed:", err);
      setError(err.response?.data?.error || 'Something went wrong. Please check your Vercel logs.');
    } finally {
      // 5. CRITICAL FIX: Always turn off loading, even if it crashed
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-purple-500">GameNexus DB</h1>
      
      {/* Search Input */}
      <div className="flex justify-center mb-12">
        <input 
          type="text" 
          className="p-3 rounded-l-lg text-black w-96" 
          placeholder="Search for a game (e.g., Elden Ring)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()} // Allow pressing Enter
        />
        <button 
          onClick={handleSearch}
          disabled={loading}
          className="bg-purple-600 p-3 rounded-r-lg hover:bg-purple-700 font-bold disabled:opacity-50"
        >
          {loading ? 'Scanning...' : 'Search'}
        </button>
      </div>

      {/* Error Message Display */}
      {error && (
        <div className="bg-red-600 text-white p-4 rounded-lg mb-8 text-center max-w-2xl mx-auto">
          ⚠️ {error}
        </div>
      )}

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Game Database</h2>
          
          {games.length === 0 && !loading && !error && (
            <p className="text-gray-500">No games found. Try searching above.</p>
          )}

          <div className="grid grid-cols-1 gap-6">
            {games.map((game: any) => (
              <div key={game.id} className="bg-gray-800 p-4 rounded-xl flex gap-4">
                {game.cover ? (
                  <img 
                    src={`https:${game.cover.url}`.replace('t_thumb', 't_cover_big')} 
                    alt={game.name} 
                    className="w-32 h-48 object-cover rounded shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-48 bg-gray-700 rounded flex items-center justify-center text-gray-500 text-xs">No Image</div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-white">{game.name}</h3>
                  <p className="text-gray-400 text-sm mt-2 line-clamp-3">{game.summary || "No description available."}</p>
                  
                  {/* Related Games Tag Cloud */}
                  {game.similar_games && (
                    <div className="mt-4">
                      <p className="text-xs text-purple-400 font-bold uppercase mb-2">You might also like:</p>
                      <div className="flex flex-wrap gap-2">
                        {game.similar_games.slice(0, 3).map((sim: any) => (
                          <span key={sim.id} className="text-xs bg-gray-700 hover:bg-purple-900 px-2 py-1 rounded cursor-pointer transition">
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

        {/* News Feed */}
        <div className="md:col-span-1">
          <h2 className="text-2xl font-bold mb-4">Industry News</h2>
          <div className="space-y-4">
            {news.map((item, idx) => (
              <a href={item.link} key={idx} target="_blank" rel="noopener noreferrer" className="block bg-gray-800 p-4 rounded-xl hover:bg-gray-700 transition border-l-4 border-purple-500">
                <h4 className="font-bold text-sm text-purple-300">{item.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{item.pubDate ? new Date(item.pubDate).toLocaleDateString() : 'Recent'}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}