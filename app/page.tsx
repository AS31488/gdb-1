"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [query, setQuery] = useState('');
  const [games, setGames] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load news on startup
  useEffect(() => {
    axios.get('/api/news').then(res => setNews(res.data)).catch(console.error);
  }, []);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setError('');
    setGames([]);

    try {
      const res = await axios.post('/api/search', { query });
      setGames(res.data);
    } catch (err: any) {
      console.error("Search failed:", err);
      setError(err.response?.data?.error || 'Something went wrong. Check Vercel logs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-100 font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* 1. HERO SECTION WITH GRADIENT TEXT */}
      <div className="relative py-16 text-center overflow-hidden">
        {/* Background Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />
        
        <h1 className="relative z-10 text-6xl font-black tracking-tighter mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
            GAMENEXUS
          </span>{' '}
          DB
        </h1>
        <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
          The ultimate open-source database for game developers and players.
        </p>

        {/* 2. MODERN SEARCH BAR */}
        <div className="relative max-w-2xl mx-auto group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
          <div className="relative flex">
            <input 
              type="text" 
              className="w-full bg-[#1e293b] text-white border border-gray-700 rounded-l-lg p-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder-gray-500" 
              placeholder="Search database (e.g. Cyberpunk 2077)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              onClick={handleSearch}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-8 rounded-r-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                <>
                  <span>SEARCH</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="max-w-4xl mx-auto mb-8 bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-lg text-center backdrop-blur-sm">
          ⚠️ {error}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* 3. GAME RESULTS (Left Column) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="w-2 h-8 bg-cyan-400 rounded-full"></span>
              Search Results
            </h2>
            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">{games.length} RESULTS FOUND</span>
          </div>

          {games.length === 0 && !loading && !error && (
            <div className="text-center py-20 border-2 border-dashed border-gray-800 rounded-2xl">
              <p className="text-gray-500 text-xl">System Ready. Awaiting Input.</p>
            </div>
          )}

          <div className="grid gap-6">
            {games.map((game: any) => (
              <div key={game.id} className="group relative bg-[#1e293b]/50 border border-gray-800 hover:border-cyan-500/50 rounded-xl overflow-hidden backdrop-blur-sm transition-all hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] flex flex-col md:flex-row">
                
                {/* Game Cover */}
                <div className="w-full md:w-48 h-64 md:h-auto relative shrink-0 overflow-hidden">
                  {game.cover ? (
                    <img 
                      src={`https:${game.cover.url}`.replace('t_thumb', 't_cover_big')} 
                      alt={game.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-600 font-mono text-sm">NO SIGNAL</div>
                  )}
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] to-transparent opacity-60 md:hidden"></div>
                </div>

                {/* Game Info */}
                <div className="p-6 flex flex-col justify-between w-full">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">{game.name}</h3>
                      {game.first_release_date && (
                        <span className="text-xs font-mono bg-gray-900 text-gray-400 px-2 py-1 rounded border border-gray-700">
                          {new Date(game.first_release_date * 1000).getFullYear()}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mt-3 leading-relaxed line-clamp-3">
                      {game.summary || "No database entry available for this title."}
                    </p>
                  </div>

                  {/* Connected Games Logic */}
                  {game.similar_games && (
                    <div className="mt-6 pt-4 border-t border-gray-800">
                      <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mb-2">Related Data Nodes:</p>
                      <div className="flex flex-wrap gap-2">
                        {game.similar_games.slice(0, 3).map((sim: any) => (
                          <span key={sim.id} className="text-xs bg-gray-900/50 hover:bg-purple-900/30 text-gray-300 hover:text-purple-300 px-3 py-1 rounded-full border border-gray-700 hover:border-purple-500/50 transition cursor-default">
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

        {/* 4. NEWS SIDEBAR (Right Column) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-8 bg-purple-500 rounded-full"></span>
            <h2 className="text-2xl font-bold">Latest Intel</h2>
          </div>

          <div className="space-y-4">
            {news.map((item, idx) => (
              <a 
                href={item.link} 
                key={idx} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block bg-[#1e293b] p-5 rounded-xl border-l-4 border-purple-600 hover:bg-gray-800 transition hover:-translate-y-1 shadow-lg"
              >
                <h4 className="font-bold text-sm text-gray-100 hover:text-purple-300 transition-colors leading-snug">
                  {item.title}
                </h4>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-[10px] uppercase font-bold text-purple-400">NEWS UPDATE</span>
                  <span className="text-xs text-gray-500 font-mono">
                    {item.pubDate ? new Date(item.pubDate).toLocaleDateString() : 'LIVE'}
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* Decorative Panel */}
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-cyan-900/20 to-purple-900/20 border border-white/5 backdrop-blur-sm text-center">
            <p className="text-gray-400 text-sm font-mono">
              GAMENEXUS SYSTEM v1.0<br/>
              <span className="text-xs text-gray-600">CONNECTED TO IGDB API</span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}