"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [query, setQuery] = useState('');
  const [games, setGames] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [activeGameId, setActiveGameId] = useState<number | null>(null);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  useEffect(() => {
    axios.get('/api/news').then(res => setNews(res.data)).catch(console.error);
  }, []);

  // NEW: Refactored search function to accept any game name directly
  const executeSearch = async (searchTerm: string) => {
    if (!searchTerm) return;
    
    setQuery(searchTerm); // Updates the search bar text to match the clicked game
    setLoading(true);
    setError('');
    setGames([]);
    setActiveGameId(null);
    setActiveVideoId(null);

    // Scroll back to the top when a new search triggers
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const res = await axios.post('/api/search', { query: searchTerm });
      setGames(res.data);
    } catch (err: any) {
      console.error("Search failed:", err);
      setError(err.response?.data?.error || 'Something went wrong. Check Vercel logs.');
    } finally {
      setLoading(false);
    }
  };

  const toggleGamePanel = (gameId: number) => {
    if (activeGameId === gameId) {
      setActiveGameId(null);
      setActiveVideoId(null);
    } else {
      setActiveGameId(gameId);
      setActiveVideoId(null); 
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-100 font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* HERO SECTION */}
      <div className="relative py-16 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />
        
        <h1 className="relative z-10 text-6xl font-black tracking-tighter mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
            ADAMNEXUS
          </span>{' '}
          DB
        </h1>
        <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
          The ultimate open-source database for game developers and players.
        </p>

        {/* SEARCH BAR */}
        <div className="relative max-w-2xl mx-auto group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
          <div className="relative flex">
            <input 
              type="text" 
              className="w-full bg-[#1e293b] text-white border border-gray-700 rounded-l-lg p-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder-gray-500" 
              placeholder="Search database (e.g. Cyberpunk 2077)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && executeSearch(query)} // Uses updated function
            />
            <button 
              onClick={() => executeSearch(query)} // Uses updated function
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-8 rounded-r-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'SEARCH'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-4xl mx-auto mb-8 bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-lg text-center backdrop-blur-sm">
          ⚠️ {error}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* GAME RESULTS */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="w-2 h-8 bg-cyan-400 rounded-full"></span>
              Search Results
            </h2>
          </div>

          <div className="grid gap-6">
            {games.map((game: any) => (
              <div key={game.id} className="group relative bg-[#1e293b]/50 border border-gray-800 rounded-xl overflow-hidden backdrop-blur-sm flex flex-col md:flex-row">
                
                {/* Game Cover */}
                <div className="w-full md:w-48 h-64 md:h-auto relative shrink-0">
                  {game.cover ? (
                    <img 
                      src={`https:${game.cover.url}`.replace('t_thumb', 't_cover_big')} 
                      alt={game.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-600 font-mono text-sm">NO SIGNAL</div>
                  )}
                </div>

                {/* Game Info */}
                <div className="p-6 flex flex-col justify-between w-full">
                  <div>
                    <div className="flex justify-between items-start">
                      
                      {/* Clickable Title for Media */}
                      <button 
                        onClick={() => toggleGamePanel(game.id)}
                        className="text-2xl font-bold text-white hover:text-cyan-400 transition-colors text-left flex items-center gap-2"
                        title="Click to view media"
                      >
                        {game.name}
                        {game.videos && game.videos.length > 0 && (
                          <svg className="w-6 h-6 text-purple-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                          </svg>
                        )}
                      </button>
                      
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

                  {/* MEDIA PANEL */}
                  {activeGameId === game.id && (
                    <div className="mt-4 border-t border-gray-700 pt-4">
                      {game.videos && game.videos.length > 0 ? (
                        <div className="space-y-4">
                          {activeVideoId && (
                            <div className="w-full aspect-video rounded-lg overflow-hidden border border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.2)] bg-black">
                              <iframe 
                                width="100%" 
                                height="100%" 
                                src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1`} 
                                title={`${game.name} Video`} 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                              ></iframe>
                            </div>
                          )}

                          <div>
                            <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider mb-2">Available Media Files:</p>
                            <div className="flex flex-wrap gap-2">
                              {game.videos.map((video: any, index: number) => (
                                <button
                                  key={video.video_id}
                                  onClick={() => setActiveVideoId(video.video_id)}
                                  className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-2 ${
                                    activeVideoId === video.video_id 
                                    ? 'bg-cyan-900/50 text-cyan-300 border-cyan-500' 
                                    : 'bg-gray-900/50 text-gray-400 border-gray-700 hover:border-gray-500 hover:text-gray-200'
                                  }`}
                                >
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                  </svg>
                                  {video.name || `Video ${index + 1}`}
                                </button>
                              ))}
                            </div>
                          </div>

                        </div>
                      ) : (
                        <div className="p-4 bg-gray-900/50 border border-gray-700 rounded-lg text-sm text-gray-500 text-center font-mono">
                          NO VIDEO DATA FOUND IN MAINFRAME
                        </div>
                      )}
                    </div>
                  )}

                  {/* CONNECTED GAMES ENGINE */}
                  {game.similar_games && (
                    <div className="mt-6 pt-4 border-t border-gray-800">
                      <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mb-2">Related Data Nodes:</p>
                      <div className="flex flex-wrap gap-2">
                        {game.similar_games.slice(0, 5).map((sim: any) => (
                          <button 
                            key={sim.id} 
                            onClick={() => executeSearch(sim.name)}
                            title={`Search database for ${sim.name}`}
                            className="text-xs bg-gray-900/50 hover:bg-purple-900/40 text-gray-300 hover:text-purple-300 px-3 py-1 rounded-full border border-gray-700 hover:border-purple-500/50 transition-all cursor-pointer text-left"
                          >
                            {sim.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NEWS SIDEBAR */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-8 bg-purple-500 rounded-full"></span>
            <h2 className="text-2xl font-bold">Latest Intel</h2>
          </div>

          <div className="space-y-4">
            {news.map((item, idx) => (
              <a href={item.link} key={idx} target="_blank" rel="noopener noreferrer" className="block bg-[#1e293b] p-5 rounded-xl border-l-4 border-purple-600 hover:bg-gray-800 transition">
                <h4 className="font-bold text-sm text-gray-100">{item.title}</h4>
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}