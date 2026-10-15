import React, { useState } from 'react';
import { FileText, Download, ExternalLink, Sparkles, BookOpen, ChevronRight } from 'lucide-react';
import { ContentItem } from '../types';

interface NotesSectionProps {
  notes: ContentItem[];
  onOpenPdf: (note: ContentItem) => void;
  onExploreBatches: () => void;
}

export const NotesSection: React.FC<NotesSectionProps> = ({ notes, onOpenPdf, onExploreBatches }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'anuvad' | 'sandhi' | 'chitra' | 'grammar'>('all');

  const pdfNotes = notes.filter(
    (i) => i.file_type === '1' || String(i.file_url || '').toLowerCase().includes('.pdf')
  );

  const filtered = pdfNotes.filter((item) => {
    if (activeFilter === 'all') return true;
    const title = (item.title + ' ' + (item.subjectTitle || '')).toLowerCase();
    if (activeFilter === 'anuvad') return title.includes('anuvad') || title.includes('अनुवाद');
    if (activeFilter === 'sandhi') return title.includes('sandhi') || title.includes('सन्धि');
    if (activeFilter === 'chitra') return title.includes('chitra') || title.includes('चित्र');
    if (activeFilter === 'grammar') {
      return (
        title.includes('vachya') ||
        title.includes('samas') ||
        title.includes('patra') ||
        title.includes('ghatika') ||
        title.includes('asudhi')
      );
    }
    return true;
  });

  return (
    <section id="notes-section" className="py-8 sm:py-16 border-b border-pink-950/40">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-bold uppercase tracking-wide mb-3">
              <FileText className="w-3.5 h-3.5 text-pink-400" />
              <span>Handwritten & Class Notes</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Class Notes & <span className="text-pink-400">PDF Materials</span>
            </h2>
            <p className="text-sm text-zinc-400 mt-2 font-medium max-w-xl">
              108+ official handwritten PDF documents, chapter worksheets, and board exam revision sheets.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-900 border border-zinc-800 overflow-x-auto text-xs font-bold">
            {[
              { id: 'all', label: 'All Notes' },
              { id: 'anuvad', label: 'Anuvad Notes' },
              { id: 'sandhi', label: 'Sandhi Notes' },
              { id: 'chitra', label: 'Chitra Varnan' },
              { id: 'grammar', label: 'Grammar Worksheets' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === tab.id
                    ? 'bg-pink-600 text-white shadow-md shadow-pink-500/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.slice(0, 9).map((item, index) => (
            <div
              key={`note-${item.batchId || 'b'}-${item.id}-${index}`}
              onClick={() => onOpenPdf(item)}
              className="glass-panel glass-panel-hover rounded-2xl p-5 cursor-pointer flex flex-col justify-between group border-pink-500/15"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                    <FileText className="w-3 h-3" /> PDF DOCUMENT
                  </span>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    ID: {item.id}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-extrabold text-white group-hover:text-pink-400 transition-colors line-clamp-2 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-zinc-400 font-medium mt-2 truncate">
                  {item.subjectTitle || 'GB STUDY Class Notes'}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between">
                <span className="text-xs font-bold text-pink-400">
                  Free Download
                </span>

                <button className="py-1.5 px-3.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-extrabold tracking-wide uppercase transition-all shadow-md shadow-pink-500/25 flex items-center gap-1.5 cursor-pointer">
                  <Download className="w-3 h-3" />
                  <span>Open PDF</span>
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
            <span>Access All 108+ PDF Notes inside Batches</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
