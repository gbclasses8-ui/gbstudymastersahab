import React, { useState, useMemo } from 'react';
import { Search, X, Play, FileText, Layers, ChevronRight, Sparkles } from 'lucide-react';
import { BatchItem, ContentItem } from '../types';

interface SearchResultItem {
  type: 'batch' | 'video' | 'note' | 'test';
  id: string;
  title: string;
  subTitle?: string;
  batchId?: string;
  batchItem?: BatchItem;
  contentItem?: ContentItem;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  batches: BatchItem[];
  allLectures: ContentItem[];
  onSelectBatch: (batch: BatchItem) => void;
  onPlayVideo: (video: ContentItem, playlist?: ContentItem[]) => void;
  onOpenPdf: (pdf: ContentItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  batches,
  allLectures,
  onSelectBatch,
  onPlayVideo,
  onOpenPdf
}) => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'batches' | 'videos' | 'notes'>('all');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const list: SearchResultItem[] = [];

    // Search batches
    if (activeFilter === 'all' || activeFilter === 'batches') {
      batches.forEach((b) => {
        if (b.title.toLowerCase().includes(q)) {
          list.push({
            type: 'batch',
            id: `batch-${b.id}`,
            title: b.title,
            subTitle: b.segment_information || 'Comprehensive Curriculum Batch',
            batchId: b.id,
            batchItem: b
          });
        }
      });
    }

    // Search lectures, notes & tests
    allLectures.forEach((item) => {
      const isPdf = item.file_type === '1' || String(item.file_url || '').toLowerCase().includes('.pdf');
      const itemType = isPdf ? 'note' : 'video';

      if (activeFilter === 'notes' && itemType !== 'note') return;
      if (activeFilter === 'videos' && itemType !== 'video') return;

      const titleMatch = item.title.toLowerCase().includes(q);
      const subjectMatch = (item.subjectTitle || '').toLowerCase().includes(q);
      const topicMatch = (item.topicTitle || '').toLowerCase().includes(q);
      const batchMatch = (item.batchTitle || '').toLowerCase().includes(q);

      if (titleMatch || subjectMatch || topicMatch || batchMatch) {
        list.push({
          type: itemType,
          id: `item-${item.batchId || 'b'}-${item.id}-${list.length}`,
          title: item.title,
          subTitle: [item.batchTitle, item.subjectTitle, item.topicTitle].filter(Boolean).join(' • '),
          contentItem: item
        });
      }
    });

    return list.slice(0, 30); // show top 30 matches
  }, [query, activeFilter, batches, allLectures]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:p-10 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl mt-4 sm:mt-12 rounded-3xl bg-[#121217] border border-pink-500/30 shadow-[0_0_80px_rgba(236,72,153,0.35)] overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 sm:px-6 py-4 border-b border-zinc-800 bg-zinc-950">
          <Search className="w-5 h-5 text-pink-400 shrink-0 mr-3" />
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search batches, lectures, chapters (e.g. Anuvad, Sandhi, Chapter 1)..."
            className="flex-1 bg-transparent border-0 text-sm sm:text-base text-white placeholder-zinc-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-zinc-400 hover:text-white mr-2 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-zinc-900/60 border-b border-zinc-800/80 overflow-x-auto">
          {[
            { id: 'all', label: 'All Results' },
            { id: 'batches', label: 'Batches' },
            { id: 'videos', label: 'Video Lectures' },
            { id: 'notes', label: 'Notes & PDFs' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === tab.id
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-500/25'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <span className="ml-auto text-[11px] text-zinc-500 hidden sm:inline">
            {results.length} found
          </span>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 divide-y divide-zinc-900 space-y-1">
          {query.trim() === '' ? (
            <div className="py-12 text-center text-zinc-500 text-sm">
              <Sparkles className="w-8 h-8 text-pink-400/50 mx-auto mb-2" />
              <p className="font-semibold text-zinc-300">Quick Search across GB STUDY</p>
              <p className="text-xs text-zinc-500 mt-1">
                Type topic names like <span className="text-pink-400">Anuvad</span>, <span className="text-pink-400">Sandhi</span>, <span className="text-pink-400">Vachya</span>, <span className="text-pink-400">Chapter 1</span>...
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 text-sm">
              No results found for &ldquo;<span className="text-pink-400">{query}</span>&rdquo;.
            </div>
          ) : (
            results.map((res, index) => {
              const isBatch = res.type === 'batch';
              const isVideo = res.type === 'video';
              const isNote = res.type === 'note';

              return (
                <div
                  key={`${res.id}-${index}`}
                  onClick={() => {
                    onClose();
                    if (isBatch && res.batchItem) {
                      onSelectBatch(res.batchItem);
                    } else if (isVideo && res.contentItem) {
                      onPlayVideo(res.contentItem);
                    } else if (isNote && res.contentItem) {
                      onOpenPdf(res.contentItem);
                    }
                  }}
                  className="p-3 rounded-2xl hover:bg-zinc-900/90 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isBatch
                          ? 'bg-pink-600/20 text-pink-400 border border-pink-500/30'
                          : isVideo
                          ? 'bg-pink-600/10 text-pink-400 border border-pink-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {isBatch && <Layers className="w-4 h-4" />}
                      {isVideo && <Play className="w-4 h-4 fill-pink-400" />}
                      {isNote && <FileText className="w-4 h-4" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white group-hover:text-pink-400 transition-colors truncate">
                          {res.title}
                        </h4>
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                            isBatch
                              ? 'bg-pink-600/20 text-pink-400'
                              : isVideo
                              ? 'bg-zinc-800 text-zinc-300'
                              : 'bg-rose-600/20 text-rose-400'
                          }`}
                        >
                          {res.type}
                        </span>
                      </div>
                      {res.subTitle && (
                        <p className="text-xs text-zinc-400 truncate mt-0.5 font-medium">
                          {res.subTitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-pink-400 group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-zinc-950 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
          <span>Search 250+ Sanskrit lectures & notes</span>
          <span className="font-mono text-pink-400">GB STUDY Portal</span>
        </div>
      </div>
    </div>
  );
};
