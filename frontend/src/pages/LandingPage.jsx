import { useEffect, useMemo, useState } from 'react';
import { Search, Filter, Grid, Plus, AlertCircle } from 'lucide-react';
import { fetchDestinations, fetchLandingBanner, fetchTrendingDestinations } from '@/api/landingApi';
import CreateTripModal from '@/components/CreateTripModal';

const LandingPage = () => {
  const [bannerUrl, setBannerUrl] = useState(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fallbackBanner = useMemo(
    () => 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop',
    [],
  );

  // Load banner on mount
  useEffect(() => {
    let cancelled = false;
    fetchLandingBanner()
      .then((data) => {
        if (cancelled) return;
        setBannerUrl(data?.banner?.image_url || null);
      })
      .catch(() => {
        // Keep UI usable even if banner provider fails
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Load default trending destinations on mount
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchTrendingDestinations(8)
      .then((data) => {
        if (cancelled) return;
        setResults(Array.isArray(data?.results) ? data.results : []);
      })
      .catch(() => {
        if (cancelled) return;
        setResults([]);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Handle search with smart ordering (searched city first)
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      // Reload trending when search is cleared
      setLoading(true);
      setError(null);
      fetchTrendingDestinations(8)
        .then((data) => {
          setResults(Array.isArray(data?.results) ? data.results : []);
        })
        .catch(() => {
          setResults([]);
        })
        .finally(() => {
          setLoading(false);
        });
      return;
    }

    let cancelled = false;
    const timer = setTimeout(() => {
      setLoading(true);
      setError(null);
      fetchDestinations(q, 8)
        .then((data) => {
          if (cancelled) return;
          const destinations = Array.isArray(data?.results) ? data.results : [];
          
          // Smart ordering: exact/close match first, then others
          const searchLower = q.toLowerCase();
          const sorted = destinations.sort((a, b) => {
            const aNameLower = a.name.toLowerCase();
            const bNameLower = b.name.toLowerCase();
            
            // Exact match first
            if (aNameLower === searchLower && bNameLower !== searchLower) return -1;
            if (bNameLower === searchLower && aNameLower !== searchLower) return 1;
            
            // Starts with search term
            const aStarts = aNameLower.startsWith(searchLower);
            const bStarts = bNameLower.startsWith(searchLower);
            if (aStarts && !bStarts) return -1;
            if (bStarts && !aStarts) return 1;
            
            // Contains search term
            const aContains = aNameLower.includes(searchLower);
            const bContains = bNameLower.includes(searchLower);
            if (aContains && !bContains) return -1;
            if (bContains && !aContains) return 1;
            
            return 0;
          });
          
          setResults(sorted);
          if (sorted.length === 0 && q) {
            setError(`No destinations found for "${q}". Try a different search.`);
          }
        })
        .catch((err) => {
          if (cancelled) return;
          setResults([]);
          setError(
            err.message || 
            'Unable to search destinations. Please check your connection and try again.'
          );
        })
        .finally(() => {
          if (cancelled) return;
          setLoading(false);
        });
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const handleDestinationClick = (destination) => {
    setSelectedDestination(destination);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDestination(null);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      {/* Banner */}
      <div className="relative h-64 md:h-[450px] rounded-3xl overflow-hidden shadow-2xl">
        <img 
          src={bannerUrl || fallbackBanner} 
          alt="Banner" className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-white p-4">
          <h2 className="text-4xl md:text-6xl font-bold text-center">Your Next Adventure Awaits</h2>
          <p className="mt-4 text-lg md:text-xl">Discover beautiful places around the globe</p>
        </div>
      </div>

      {/* Controls: Search, Filter, Sort */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-gray-50 dark:bg-slate-800 p-4 rounded-2xl">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search bar ......"
            className="w-full pl-10 p-2 border rounded-lg dark:bg-slate-700 dark:text-white dark:border-slate-600 focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none border px-4 py-2 rounded-lg dark:text-white flex items-center justify-center gap-2 hover:bg-teal-50"><Grid size={18}/> Group by</button>
          <button className="flex-1 md:flex-none border px-4 py-2 rounded-lg dark:text-white flex items-center justify-center gap-2 hover:bg-teal-50"><Filter size={18}/> Filter</button>
          <button className="flex-1 md:flex-none border px-4 py-2 rounded-lg dark:text-white hover:bg-teal-50">Sort by...</button>
        </div>
      </div>

      {/* Grid Sections */}
      <div>
        <h3 className="text-xl font-bold mb-4 dark:text-white border-l-4 border-teal-500 pl-3">
          {query ? 'Search Results' : 'Top Regional Selections'}
        </h3>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {results.length > 0
              ? results.slice(0, 8).map((r) => (
                  <div
                    key={r.provider_place_id}
                    onClick={() => handleDestinationClick(r)}
                    className="aspect-square rounded-2xl overflow-hidden bg-gray-200 dark:bg-slate-800 hover:scale-105 hover:shadow-xl transition-all cursor-pointer relative group"
                    title={`${r.name}${r.country ? `, ${r.country}` : ''} - Click to create trip`}
                  >
                    {r.image_url ? (
                      <>
                        <img 
                          src={r.image_url} 
                          alt={r.name} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                          <div>
                            <div className="text-white font-bold text-sm">{r.name}</div>
                            {r.country && (
                              <div className="text-white/80 text-xs">{r.country}</div>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-3 bg-gradient-to-br from-teal-100 to-teal-200 dark:from-slate-700 dark:to-slate-800">
                        <div className="text-center">
                          <div className="text-sm font-semibold text-slate-900 dark:text-white">
                            {r.name}
                          </div>
                          {r.country && (
                            <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                              {r.country}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              : [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-200 dark:bg-slate-800 rounded-2xl flex items-center justify-center animate-pulse"
                  >
                    <div className="text-gray-400 dark:text-slate-600 text-sm text-center px-2">
                      {i === 4 ? 'Loading...' : ''}
                    </div>
                  </div>
                ))}
          </div>
        )}
      </div>

      <button className="fixed bottom-8 right-8 bg-teal-600 text-white px-8 py-4 rounded-full shadow-lg flex items-center gap-2 hover:bg-teal-700 active:scale-95 transition-all">
        <Plus size={24} /> <span className="font-bold text-lg">Plan a trip</span>
      </button>

      {/* Trip Creation Modal */}
      <CreateTripModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        destination={selectedDestination}
      />
    </div>
  );
};

export default LandingPage;