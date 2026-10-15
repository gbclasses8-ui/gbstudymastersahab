import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  ArrowRight,
  Video,
  FileText,
  Folder,
  Heart,
  Users,
  X
} from 'lucide-react';
import { BatchItem } from '../types';
import { LOGO_URL } from './TelegramModal';

interface BatchesSectionProps {
  batches: BatchItem[];
  favorites: string[];
  onToggleFavorite: (batchId: string) => void;
  onSelectBatch: (batch: BatchItem) => void;
}

interface BatchCardMeta {
  classTag: string;
  enrolled: string;
  videos: number;
  notes: number;
  folders: number;
  titleOverride?: string;
  image?: string;
}

// Pre-calculated batch statistics & metadata reflecting the rich curriculum
const BATCH_METADATA: Record<string, BatchCardMeta> = {
  '44743': {
    classTag: 'PRO COMBO',
    enrolled: '28.5k',
    videos: 156,
    notes: 108,
    folders: 64,
    titleOverride: 'PRO BATCH 2.0 - 2027 (Shemushi + Manika)',
    image: 'https://i.ibb.co/0R7qc34v/1093.jpg'
  },
  '45307': {
    classTag: '10TH',
    enrolled: '25.8k',
    videos: 510,
    notes: 542,
    folders: 185,
    titleOverride: 'टॉपर बैच - Class 10th Batch 2026-27 (Shemushi)',
    image: 'https://i.ibb.co/0R7qc34v/1093.jpg'
  },
  '45306': {
    classTag: '12TH',
    enrolled: '27.7k',
    videos: 844,
    notes: 903,
    folders: 180,
    titleOverride: 'वरदान बैच - 12th Science & Sanskrit Batch 2026-27 (Manika)',
    image: 'https://i.ibb.co/0R7qc34v/1093.jpg'
  },
  '49799': {
    classTag: '10TH 2.0',
    enrolled: '18.6k',
    videos: 212,
    notes: 198,
    folders: 45,
    titleOverride: 'SHEMUSHI 2.0 - Fast Track Batch 2026-27'
  },
  '49853': {
    classTag: '10TH 2.0',
    enrolled: '17.9k',
    videos: 204,
    notes: 192,
    folders: 42,
    titleOverride: 'MANIKA 2.0 - Fast Track Batch 2026-27'
  }
};

export const BatchesSection: React.FC<BatchesSectionProps> = ({
  batches,
  favorites,
  onToggleFavorite,
  onSelectBatch
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | '10th' | '12th' | '2.0' | 'saved'>('all');

  const getMeta = (batchId: string): BatchCardMeta => {
    return BATCH_METADATA[batchId] || {
      classTag: '10TH',
      enrolled: '20.5k',
      videos: 120,
      notes: 85,
      folders: 30
    };
  };

  const getBatchImage = (batch: BatchItem) => {
    const meta = getMeta(batch.id);
    return (
      batch.desc_header_image ||
      batch.cover_image ||
      meta.image ||
      LOGO_URL
    );
  };

  const filteredBatches = batches.filter((b) => {
    const meta = getMeta(b.id);
    const title = (meta.titleOverride || b.title).toLowerCase();
    const query = searchQuery.trim().toLowerCase();

    // Text search query
    if (query && !title.includes(query) && !b.title.toLowerCase().includes(query)) {
      return false;
    }

    // Category / Filter tab
    if (filter === 'saved') return favorites.includes(b.id);
    if (filter === '10th') return meta.classTag.includes('10TH') || title.includes('10th') || title.includes('shemushi');
    if (filter === '12th') return meta.classTag.includes('12TH') || title.includes('12th') || title.includes('science');
    if (filter === '2.0') return meta.classTag.includes('2.0') || title.includes('2.0');
    return true;
  });

  return (
    <section id="batches-section" className="py-6 sm:py-12 border-b border-pink-950/40">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* Full-width Search / Filter Input (Matching Screenshot 2) */}
        <div className="relative w-full mb-4 sm:mb-6">
          <div className="relative flex items-center w-full">
            <Search className="absolute left-4 w-4 h-4 text-pink-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter batches..."
              className="w-full pl-11 pr-10 py-3 sm:py-3.5 bg-[#120815]/90 border border-pink-900/50 hover:border-pink-500/40 focus:border-pink-500 rounded-2xl text-xs sm:text-sm text-white placeholder-pink-300/40 focus:outline-none focus:ring-1 focus:ring-pink-500/30 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 p-1 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 mb-6 sm:mb-8 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', label: 'All Batches' },
            { id: '10th', label: 'Class 10th' },
            { id: '12th', label: 'Class 12th' },
            { id: '2.0', label: '2.0 Batches' },
            { id: 'saved', label: `Saved (${favorites.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                filter === tab.id
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-500/25'
                  : 'bg-[#150a18] border border-pink-900/30 text-zinc-400 hover:text-white hover:border-pink-500/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <span className="ml-auto text-[11px] text-zinc-500 hidden sm:inline whitespace-nowrap pl-2">
            {filteredBatches.length} Batches
          </span>
        </div>

        {/* Empty state */}
        {filteredBatches.length === 0 ? (
          <div className="py-16 text-center bg-[#130a16] border border-pink-900/40 rounded-3xl p-8 max-w-md mx-auto">
            <Heart className="w-12 h-12 text-pink-500/40 mx-auto mb-3" />
            <h3 className="text-base font-extrabold text-white">No batches found</h3>
            <p className="text-xs text-zinc-400 mt-1">
              {filter === 'saved'
                ? 'You have not saved any batches yet. Click the heart icon on any batch to save it.'
                : 'Try adjusting your search query or category filter.'}
            </p>
            <button
              onClick={() => {
                setFilter('all');
                setSearchQuery('');
              }}
              className="mt-4 py-2 px-4 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold"
            >
              Show All Batches
            </button>
          </div>
        ) : (
          /* Responsive Batches Grid */
          /* Mobile: 1 wide column (100% width) matching Screenshot 2 */
          /* Tablet: 2 columns */
          /* Laptop/Desktop: 3 to 4 columns */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 sm:gap-6 w-full">
            {filteredBatches.map((batch, index) => {
              const meta = getMeta(batch.id);
              const isFav = favorites.includes(batch.id);
              const displayTitle = meta.titleOverride || batch.title;

              return (
                <div
                  key={`batch-card-${batch.id}-${index}`}
                  className="w-full bg-[#130a16] border border-pink-900/40 hover:border-pink-500/50 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Top Image Banner (Aspect Ratio 16:9 for clean display matching Screenshot 2) */}
                  <div
                    onClick={() => onSelectBatch(batch)}
                    className="relative w-full aspect-[16/9] bg-zinc-950 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={getBatchImage(batch)}
                      alt={displayTitle}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = LOGO_URL;
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95 group-hover:opacity-100"
                    />

                    {/* Gradient overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#130a16] via-transparent to-black/30 pointer-events-none" />

                    {/* Top-Left Tag Badge (e.g. ✨ 12TH or ✨ 10TH) */}
                    <div className="absolute top-3 left-3 z-10">
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-pink-950/80 border border-pink-500/40 backdrop-blur-md text-pink-300 text-xs font-black uppercase tracking-wider shadow-sm">
                        <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                        <span>{meta.classTag}</span>
                      </div>
                    </div>

                    {/* Top-Right Favorite Heart Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(batch.id);
                      }}
                      title={isFav ? 'Remove from Saved' : 'Save Batch'}
                      className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-zinc-300 hover:text-pink-400 transition-all active:scale-90 cursor-pointer shadow-md"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          isFav ? 'fill-pink-500 text-pink-500' : 'text-zinc-300'
                        }`}
                      />
                    </button>

                    {/* Bottom-Left Enrolled Count Badge */}
                    <div className="absolute bottom-3 left-3 z-10">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-zinc-200 text-xs font-bold">
                        <Users className="w-3.5 h-3.5 text-pink-400" />
                        <span>{meta.enrolled} students enrolled</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body (Title, 3-column stats, and Let's Study button) */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3 sm:gap-4">
                    {/* Batch Title */}
                    <h3
                      onClick={() => onSelectBatch(batch)}
                      className="text-base sm:text-lg font-black text-white group-hover:text-pink-300 transition-colors leading-snug line-clamp-2 cursor-pointer"
                    >
                      {displayTitle}
                    </h3>

                    {/* 3-Column Stats Box (VIDEOS, NOTES, FOLDERS) */}
                    <div className="bg-[#1c0f20] border border-pink-900/40 rounded-2xl p-2.5 sm:p-3 grid grid-cols-3 divide-x divide-pink-900/30 text-center select-none">
                      {/* Column 1: VIDEOS */}
                      <div className="px-1 flex flex-col items-center justify-center">
                        <span className="text-sm sm:text-base font-black text-pink-300">
                          {meta.videos}
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-zinc-400 font-bold uppercase tracking-wider flex items-center justify-center gap-1 mt-0.5 whitespace-nowrap">
                          <Video className="w-3 h-3 text-pink-400" /> VIDEOS
                        </span>
                      </div>

                      {/* Column 2: NOTES */}
                      <div className="px-1 flex flex-col items-center justify-center">
                        <span className="text-sm sm:text-base font-black text-pink-300">
                          {meta.notes}
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-zinc-400 font-bold uppercase tracking-wider flex items-center justify-center gap-1 mt-0.5 whitespace-nowrap">
                          <FileText className="w-3 h-3 text-pink-400" /> NOTES
                        </span>
                      </div>

                      {/* Column 3: FOLDERS */}
                      <div className="px-1 flex flex-col items-center justify-center">
                        <span className="text-sm sm:text-base font-black text-pink-300">
                          {meta.folders}
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-zinc-400 font-bold uppercase tracking-wider flex items-center justify-center gap-1 mt-0.5 whitespace-nowrap">
                          <Folder className="w-3 h-3 text-pink-400" /> FOLDERS
                        </span>
                      </div>
                    </div>

                    {/* Full-width Let's Study Button (Matching Screenshot 2) */}
                    <button
                      onClick={() => onSelectBatch(batch)}
                      className="w-full py-3 sm:py-3.5 px-5 rounded-2xl bg-gradient-to-r from-pink-600 via-pink-500 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 transition-all duration-200 active:scale-[0.98] cursor-pointer"
                    >
                      <span>Let&apos;s Study</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
