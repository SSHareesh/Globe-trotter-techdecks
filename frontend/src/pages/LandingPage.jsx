import { Search, Filter, Grid, Plus } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      {/* Banner */}
      <div className="relative h-64 md:h-[450px] rounded-3xl overflow-hidden shadow-2xl">
        <img 
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop" 
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
          <input type="text" placeholder="Search bar ......" className="w-full pl-10 p-2 border rounded-lg dark:bg-slate-700 dark:text-white dark:border-slate-600 focus:ring-2 focus:ring-teal-500 outline-none" />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none border px-4 py-2 rounded-lg dark:text-white flex items-center justify-center gap-2 hover:bg-teal-50"><Grid size={18}/> Group by</button>
          <button className="flex-1 md:flex-none border px-4 py-2 rounded-lg dark:text-white flex items-center justify-center gap-2 hover:bg-teal-50"><Filter size={18}/> Filter</button>
          <button className="flex-1 md:flex-none border px-4 py-2 rounded-lg dark:text-white hover:bg-teal-50">Sort by...</button>
        </div>
      </div>

      {/* Grid Sections */}
      <div>
        <h3 className="text-xl font-bold mb-4 dark:text-white border-l-4 border-teal-500 pl-3">Top Regional Selections</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[1,2,3,4,5].map(i => <div key={i} className="aspect-square bg-gray-200 dark:bg-slate-800 rounded-2xl hover:scale-105 transition cursor-pointer" />)}
        </div>
      </div>

      <button className="fixed bottom-8 right-8 bg-teal-600 text-white px-8 py-4 rounded-full shadow-lg flex items-center gap-2 hover:bg-teal-700 active:scale-95 transition-all">
        <Plus size={24} /> <span className="font-bold text-lg">Plan a trip</span>
      </button>
    </div>
  );
};

export default LandingPage;