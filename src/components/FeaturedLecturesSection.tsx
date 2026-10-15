import React, { useState } from 'react';
import { Play, Sparkles, Clock, ChevronRight, Layers } from 'lucide-react';
import { ContentItem } from '../types';

interface FeaturedLecturesSectionProps {
  lectures: ContentItem[];
  onPlayVideo: (video: ContentItem, playlist: ContentItem[]) => void;
  onExploreBatches: () => void;
}

export const FeaturedLecturesSection: React.FC<FeaturedLecturesSectionProps> = ({
  lectures,
  onPlayVideo,
  onExploreBatches
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const videoLectures = lectures.filter(
    (i) => !(i.file_type === '1' || String(i.file_url || '').toLowerCase().includes('.pdf'))
  );

  const tags = [
    { id: 'all', label: 'All Lectures' },
    { id: 'anuvad', label: 'Anuvad (अनुवाद)' },
    { id: 'sandhi', label: 'Sandhi (सन्धि)' },
    { id: 'vachya', label: 'Vachya (वाच्य)' },
    { id: 'chapter', label: 'Chapter Shlokas' }
  ];

  const filtered = videoLectures.filter((item) => {
    if (selectedTag === 'all') return true;
    const title = (item.title + ' ' + (item.subjectTitle || '')).toLowerCase();
    if (selectedTag === 'anuvad') return title.includes('anuvad') || title.includes('अनुवाद');
    if (selectedTag === 'sandhi') return title.includes('sandhi') || title.includes('सन्धि');
    if (selectedTag === 'vachya') return title.includes('vachya') || title.includes('वाच्य');
    if (selectedTag === 'chapter') return title.includes('chapter') || title.includes('पाठ');
    return true;
  });

  return (
    <section id="lectures-section" className="py-8 sm:py-16 border-b border-pink-950/40">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-bold uppercase tracking-wide mb-3">
              <Play className="w-3 h-3 fill-pink-400" />
              <span>Real Video Lectures</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Watch <span className="text-pink-400">Recorded Classes</span>
            </h2>
            <p className="text-sm text-zinc-400 mt-2 font-medium max-w-xl">
              156+ comprehensive Sanskrit lectures with live explanations, shloka meanings, and grammar tricks.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-900 border border-zinc-800 overflow-x-auto text-xs font-bold">
            {tags.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTag(tab.id)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  selectedTag === tab.id
                    ? 'bg-pink-600 text-white shadow-md shadow-pink-500/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lectures Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.slice(0, 9).map((item, index) => (
            <div
              key={`lec-${item.batchId || 'b'}-${item.id}-${index}`}
              onClick={() => onPlayVideo(item, filtered)}
              className="glass-panel glass-panel-hover rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between group border-pink-500/15"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-pink-600 text-white text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                    <Play className="w-2.5 h-2.5 fill-white" /> CLASS {index + 1}
                  </span>
                  <span className="text-[11px] text-pink-400 font-semibold truncate max-w-[140px]">
                    {item.subjectTitle || 'Grammar'}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-extrabold text-white group-hover:text-pink-400 transition-colors line-clamp-2 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-zinc-400 font-medium mt-2 truncate">
                  {item.batchTitle || 'Shemushi / Manika Batch'}
                </p>
              </div>

              <div className="p-4 bg-zinc-950/70 border-t border-zinc-800/80 flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-pink-400" />
                  Full Lecture
                </span>

                <button className="py-1.5 px-3.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-extrabold tracking-wide uppercase transition-all shadow-md shadow-pink-500/25 flex items-center gap-1.5 cursor-pointer">
                  <Play className="w-3 h-3 fill-white" />
                  <span>Watch</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={onExploreBatches}
            className="py-3 px-8 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-pink-500/30 hover:border-pink-500 text-pink-300 hover:text-white font-extrabold text-xs tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <span>Browse All 156+ Lectures in Batches</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
