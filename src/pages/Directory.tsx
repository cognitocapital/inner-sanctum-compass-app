import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, ExternalLink, CheckCircle2, Globe } from "lucide-react";
import { DIRECTORY_RESOURCES, DIRECTORY_CATEGORIES, DIRECTORY_REGIONS, type DirectoryResource } from "@/data/directoryData";

const Directory = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>("all");

  const filtered = DIRECTORY_RESOURCES.filter(r => {
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !selectedCategory || r.category === selectedCategory;
    const matchRegion = selectedRegion === 'all' || r.region === selectedRegion;
    return matchSearch && matchCategory && matchRegion;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-orange-950/10 text-white">
      <header className="sticky top-0 z-20 bg-gray-950/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <Button asChild variant="ghost" size="sm" className="text-white/60 hover:text-white">
            <Link to="/phoenix-path"><ArrowLeft className="w-4 h-4" /></Link>
          </Button>
          <h1 className="text-lg font-serif text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-orange-400" />
            Resource Directory
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl space-y-5">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search resources..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-orange-500/50"
          />
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              !selectedCategory ? 'bg-orange-500/20 border-orange-500/40 text-orange-300' : 'bg-white/5 border-white/10 text-white/50'
            }`}
          >
            All
          </button>
          {DIRECTORY_CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(selectedCategory === cat.key ? null : cat.key)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                selectedCategory === cat.key ? 'bg-orange-500/20 border-orange-500/40 text-orange-300' : 'bg-white/5 border-white/10 text-white/50'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Region filter */}
        <div className="flex gap-2">
          {DIRECTORY_REGIONS.map(r => (
            <button
              key={r.key}
              onClick={() => setSelectedRegion(r.key)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                selectedRegion === r.key ? 'bg-white/15 border-white/30 text-white' : 'bg-white/5 border-white/10 text-white/40'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Results */}
        <p className="text-xs text-white/30">{filtered.length} resources</p>

        <div className="space-y-3">
          {filtered.map((resource, idx) => (
            <motion.a
              key={`${resource.name}-${idx}`}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="block bg-white/5 rounded-xl p-4 border border-white/10 hover:border-orange-500/30 hover:bg-white/[0.07] transition-all group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-medium group-hover:text-orange-300 transition-colors truncate">{resource.name}</h3>
                    {resource.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-green-400/60 flex-shrink-0" />}
                  </div>
                  <p className="text-sm text-white/50 line-clamp-2">{resource.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/40 capitalize">{resource.category.replace('_', ' ')}</span>
                    <span className="text-xs text-white/30 capitalize">{resource.region}</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-orange-400 flex-shrink-0 mt-1 transition-colors" />
              </div>
            </motion.a>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-white/40">
            No resources found. Try adjusting your filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default Directory;
