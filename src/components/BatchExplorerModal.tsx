import React, { useState } from 'react';
import {
  X,
  ArrowLeft,
  ChevronRight,
  Play,
  FileText,
  ClipboardList,
  FolderOpen,
  Sparkles,
  BookOpen,
  Layers,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink
} from 'lucide-react';
import { BatchItem, BatchDetail, SubjectItem, TopicItem, ContentItem } from '../types';

interface BatchExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  batch: BatchItem | null;
  detail: BatchDetail | null;
  masterItems: Record<string, ContentItem[]>;
  onPlayVideo: (item: ContentItem, playlist: ContentItem[]) => void;
  onOpenPdf: (item: ContentItem) => void;
}

type NavLevel = 'subjects' | 'topics' | 'categories' | 'content';

export const BatchExplorerModal: React.FC<BatchExplorerModalProps> = ({
  isOpen,
  onClose,
  batch,
  detail,
  masterItems,
  onPlayVideo,
  onOpenPdf
}) => {
  const [activeTab, setActiveTab] = useState<'curriculum' | 'overview'>('curriculum');
  const [navLevel, setNavLevel] = useState<NavLevel>('subjects');
  const [selectedSubject, setSelectedSubject] = useState<SubjectItem | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<TopicItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'video' | 'note' | 'test'>('video');

  if (!isOpen || !batch) return null;

  // Extract subjects from content tile
  const tiles = detail?.tiles || [];
  const contentTile = tiles.find((t) => t.type === 'content') || tiles[0];
  const subjects: SubjectItem[] = contentTile?.meta?.list || [];

  // Overview description
  const overviewTile = tiles.find((t) => t.type === 'overview');
  const overviewHtml = overviewTile?.meta?.description?.data || detail?.course_detail?.description || '';

  // Get master items for current subject and topic
  const getTopicItems = (subj: SubjectItem | null, top: TopicItem | null) => {
    if (!subj || !batch) return [];
    const sId = String(subj.id);
    const topId = String(top?.topic_id || top?.id || sId);
    const key = `${batch.id}_${sId}_${topId}`;
    return masterItems[key] || [];
  };

  const currentTopicAllItems = getTopicItems(selectedSubject, selectedTopic);

  const videoItems = currentTopicAllItems.filter(
    (i) => !(i.file_type === '1' || String(i.file_url || '').toLowerCase().includes('.pdf')) &&
           !(i.test_series_name || i.test_code || i.total_questions)
  );

  const noteItems = currentTopicAllItems.filter(
    (i) => i.file_type === '1' || String(i.file_url || '').toLowerCase().includes('.pdf')
  );

  const testItems = currentTopicAllItems.filter(
    (i) => Boolean(i.test_series_name || i.test_code || i.total_questions)
  );

  const handleSelectSubject = (subj: SubjectItem) => {
    setSelectedSubject(subj);
    const topics = subj.list || [];
    if (topics.length > 0) {
      setNavLevel('topics');
    } else {
      // Direct topic
      setSelectedTopic({ id: subj.id, title: subj.title });
      setNavLevel('categories');
    }
  };

  const handleSelectTopic = (topic: TopicItem) => {
    setSelectedTopic(topic);
    setNavLevel('categories');
  };

  const handleSelectCategory = (cat: 'video' | 'note' | 'test') => {
    setSelectedCategory(cat);
    setNavLevel('content');
  };

  const handleBack = () => {
    if (navLevel === 'content') {
      setNavLevel('categories');
    } else if (navLevel === 'categories') {
      if (selectedSubject?.list && selectedSubject.list.length > 0) {
        setNavLevel('topics');
      } else {
        setNavLevel('subjects');
      }
    } else if (navLevel === 'topics') {
      setNavLevel('subjects');
    } else {
      onClose();
    }
  };

  const currentFilteredItems =
    selectedCategory === 'video'
      ? videoItems
      : selectedCategory === 'note'
      ? noteItems
      : testItems;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl h-[92vh] flex flex-col rounded-3xl bg-[#0c0c11] border border-pink-500/35 shadow-[0_0_80px_rgba(236,72,153,0.3)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 bg-zinc-950 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4 text-pink-400" />
              <span>{navLevel === 'subjects' ? 'Exit' : 'Back'}</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-pink-600 text-white text-[9px] font-black uppercase tracking-wider">
                  BATCH
                </span>
                <h2 className="text-sm sm:text-base md:text-lg font-black text-white truncate max-w-md">
                  {batch.title}
                </h2>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium">
                {batch.segment_information || 'Complete Free Sanskrit & Academic Batch'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {/* Tab switchers */}
            <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs font-bold">
              <button
                onClick={() => setActiveTab('curriculum')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'curriculum'
                    ? 'bg-pink-600 text-white shadow-md shadow-pink-500/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Curriculum
              </button>
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-pink-600 text-white shadow-md shadow-pink-500/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Overview
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Breadcrumbs Row (Only in curriculum tab) */}
        {activeTab === 'curriculum' && (
          <div className="flex items-center gap-2 px-4 sm:px-6 py-2.5 bg-zinc-900/50 border-b border-zinc-800/80 text-xs overflow-x-auto whitespace-nowrap">
            <button
              onClick={() => setNavLevel('subjects')}
              className={`font-bold transition-colors cursor-pointer ${
                navLevel === 'subjects' ? 'text-pink-400 font-extrabold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Subjects ({subjects.length})
            </button>

            {selectedSubject && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                <button
                  onClick={() => setNavLevel(selectedSubject.list?.length ? 'topics' : 'categories')}
                  className={`font-bold transition-colors cursor-pointer truncate max-w-[180px] ${
                    navLevel === 'topics' ? 'text-pink-400 font-extrabold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {selectedSubject.title}
                </button>
              </>
            )}

            {selectedTopic && navLevel !== 'subjects' && navLevel !== 'topics' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                <button
                  onClick={() => setNavLevel('categories')}
                  className={`font-bold transition-colors cursor-pointer truncate max-w-[180px] ${
                    navLevel === 'categories' ? 'text-pink-400 font-extrabold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {selectedTopic.title}
                </button>
              </>
            )}

            {navLevel === 'content' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                <span className="text-pink-400 font-black uppercase tracking-wider">
                  {selectedCategory === 'video' ? 'Video Lectures' : selectedCategory === 'note' ? 'Notes / PDFs' : 'Tests'}
                </span>
              </>
            )}
          </div>
        )}

        {/* Modal Main Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {activeTab === 'overview' ? (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-pink-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">{batch.title}</h3>
                    <p className="text-xs text-zinc-400">Official Curriculum & Batch Details</p>
                  </div>
                </div>

                <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
                  {overviewHtml ? (
                    <div
                      className="prose prose-invert prose-pink max-w-none text-zinc-300"
                      dangerouslySetInnerHTML={{ __html: overviewHtml }}
                    />
                  ) : (
                    <div>
                      <p>
                        Welcome to <strong>{batch.title}</strong> on GB STUDY. This batch provides full coverage of Class 10th Sanskrit (Shemushi / Manika) including all grammar concepts, chapter-by-chapter shloka explanations, NCERT abhyas, exam question patterns, and downloadable handwritten PDF notes.
                      </p>
                      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
                          <span className="text-2xl font-black text-pink-400">100%</span>
                          <p className="text-xs text-zinc-400 mt-1 font-semibold">Free Full Access</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
                          <span className="text-2xl font-black text-pink-400">{subjects.length}</span>
                          <p className="text-xs text-zinc-400 mt-1 font-semibold">Curriculum Chapters</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
                          <span className="text-2xl font-black text-pink-400">HD</span>
                          <p className="text-xs text-zinc-400 mt-1 font-semibold">Multi-Quality Lectures</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-zinc-800 flex justify-end">
                  <button
                    onClick={() => setActiveTab('curriculum')}
                    className="py-3 px-6 rounded-2xl bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-pink-500/30 flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <span>Explore Lectures & Notes</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Curriculum Step Navigator */
            <div>
              {/* Level 1: Subjects Grid */}
              {navLevel === 'subjects' && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <Layers className="w-5 h-5 text-pink-400" />
                      Select Subject or Chapter ({subjects.length})
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Choose any grammar topic or chapter to browse its video lectures and class notes.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subjects.map((subj, sIdx) => (
                      <div
                        key={`subj-${subj.id}-${sIdx}`}
                        onClick={() => handleSelectSubject(subj)}
                        className="glass-panel glass-panel-hover rounded-2xl p-5 cursor-pointer flex flex-col justify-between h-[160px] group border-pink-500/15"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/30 text-pink-400 flex items-center justify-center shrink-0 text-lg font-bold group-hover:scale-105 transition-transform">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-white font-extrabold text-sm sm:text-base leading-snug group-hover:text-pink-400 transition-colors line-clamp-2">
                              {subj.title}
                            </h4>
                            <p className="text-xs text-zinc-400 font-semibold mt-1">
                              {subj.list?.length ? `${subj.list.length} Topics` : 'Comprehensive Chapter'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80">
                          <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 group-hover:text-pink-400 transition-colors">
                            Explore Content
                          </span>
                          <span className="w-7 h-7 rounded-full bg-pink-500/10 text-pink-400 flex items-center justify-center group-hover:bg-pink-600 group-hover:text-white transition-all">
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Level 2: Topics Grid */}
              {navLevel === 'topics' && selectedSubject && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <FolderOpen className="w-5 h-5 text-pink-400" />
                      Topics under {selectedSubject.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">Select a topic to open video lectures and notes.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(selectedSubject.list || []).map((topic, tIdx) => (
                      <div
                        key={`topic-${topic.id || topic.topic_id || tIdx}-${tIdx}`}
                        onClick={() => handleSelectTopic(topic)}
                        className="glass-panel glass-panel-hover rounded-2xl p-5 cursor-pointer flex flex-col justify-between h-[150px] group border-pink-500/15"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-11 h-11 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 flex items-center justify-center shrink-0">
                            <FolderOpen className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-white font-extrabold text-sm sm:text-base leading-snug group-hover:text-pink-400 transition-colors line-clamp-2">
                              {topic.title}
                            </h4>
                            <p className="text-xs text-zinc-400 font-semibold mt-1">
                              {topic.count || 'Available'} Items
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80">
                          <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 group-hover:text-pink-400 transition-colors">
                            Open Topic
                          </span>
                          <span className="w-7 h-7 rounded-full bg-pink-500/10 text-pink-400 flex items-center justify-center group-hover:bg-pink-600 group-hover:text-white transition-all">
                            <Play className="w-3 h-3 fill-current ml-0.5" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Level 3: Three Category Folders (Videos, Notes, Tests) */}
              {navLevel === 'categories' && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-pink-400" />
                      Browse {selectedTopic?.title || selectedSubject?.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">Select content category to view.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {/* Video Lectures */}
                    <div
                      onClick={() => handleSelectCategory('video')}
                      className="glass-panel glass-panel-hover rounded-3xl p-6 cursor-pointer flex flex-col justify-between h-[200px] group border-pink-500/20 hover:border-pink-500/60"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-pink-600/15 border border-pink-500/30 text-pink-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                          <Play className="w-7 h-7 fill-pink-400" />
                        </div>
                        <div>
                          <h4 className="text-white font-extrabold text-lg group-hover:text-pink-400 transition-colors">
                            Video Lectures
                          </h4>
                          <p className="text-xs text-zinc-400 font-semibold mt-1">
                            {videoItems.length} Real Lecture{videoItems.length === 1 ? '' : 's'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                        <span className="text-xs font-bold text-pink-400">Watch Classes</span>
                        <span className="w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center group-hover:scale-110 shadow-md shadow-pink-500/30 transition-transform">
                          <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>

                    {/* Class Notes & PDFs */}
                    <div
                      onClick={() => handleSelectCategory('note')}
                      className="glass-panel glass-panel-hover rounded-3xl p-6 cursor-pointer flex flex-col justify-between h-[200px] group border-pink-500/20 hover:border-pink-500/60"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-pink-600/15 border border-pink-500/30 text-pink-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                          <FileText className="w-7 h-7 text-pink-400" />
                        </div>
                        <div>
                          <h4 className="text-white font-extrabold text-lg group-hover:text-pink-400 transition-colors">
                            Class Notes & PDFs
                          </h4>
                          <p className="text-xs text-zinc-400 font-semibold mt-1">
                            {noteItems.length} Notes / Document{noteItems.length === 1 ? '' : 's'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                        <span className="text-xs font-bold text-pink-400">View & Download</span>
                        <span className="w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center group-hover:scale-110 shadow-md shadow-pink-500/30 transition-transform">
                          <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>

                    {/* Tests & Practice */}
                    <div
                      onClick={() => handleSelectCategory('test')}
                      className="glass-panel glass-panel-hover rounded-3xl p-6 cursor-pointer flex flex-col justify-between h-[200px] group border-pink-500/20 hover:border-pink-500/60"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-pink-600/15 border border-pink-500/30 text-pink-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                          <ClipboardList className="w-7 h-7 text-pink-400" />
                        </div>
                        <div>
                          <h4 className="text-white font-extrabold text-lg group-hover:text-pink-400 transition-colors">
                            Practice Tests
                          </h4>
                          <p className="text-xs text-zinc-400 font-semibold mt-1">
                            {testItems.length} Test{testItems.length === 1 ? '' : 's'} Available
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                        <span className="text-xs font-bold text-pink-400">Take Test</span>
                        <span className="w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center group-hover:scale-110 shadow-md shadow-pink-500/30 transition-transform">
                          <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Level 4: Items Grid */}
              {navLevel === 'content' && (
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-black text-white flex items-center gap-2">
                        {selectedCategory === 'video' ? (
                          <Play className="w-5 h-5 fill-pink-400 text-pink-400" />
                        ) : selectedCategory === 'note' ? (
                          <FileText className="w-5 h-5 text-pink-400" />
                        ) : (
                          <ClipboardList className="w-5 h-5 text-pink-400" />
                        )}
                        <span>
                          {selectedCategory === 'video'
                            ? `Video Lectures (${videoItems.length})`
                            : selectedCategory === 'note'
                            ? `Class Notes (${noteItems.length})`
                            : `Tests (${testItems.length})`}
                        </span>
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1">
                        Topic: <strong className="text-zinc-200">{selectedTopic?.title || selectedSubject?.title}</strong>
                      </p>
                    </div>

                    <button
                      onClick={() => setNavLevel('categories')}
                      className="text-xs font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Change Category
                    </button>
                  </div>

                  {currentFilteredItems.length === 0 ? (
                    <div className="py-16 text-center glass-panel rounded-3xl p-8 border-dashed border-zinc-800">
                      <BookOpen className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                      <h4 className="text-base font-bold text-zinc-300">No items available in this category</h4>
                      <p className="text-xs text-zinc-500 mt-1">
                        Check the Video Lectures or Class Notes folder for this topic.
                      </p>
                      <button
                        onClick={() => setNavLevel('categories')}
                        className="mt-4 py-2 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300 hover:text-white"
                      >
                        Return to Folders
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {currentFilteredItems.map((item, index) => {
                        const isPdf = selectedCategory === 'note';
                        const isTest = selectedCategory === 'test';

                        return (
                          <div
                            key={`modal-item-${selectedCategory}-${item.id}-${index}`}
                            onClick={() => {
                              if (isPdf) {
                                onOpenPdf(item);
                              } else if (!isTest) {
                                onPlayVideo(item, videoItems);
                              }
                            }}
                            className="glass-panel glass-panel-hover rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between group border-pink-500/15"
                          >
                            <div className="p-4 sm:p-5">
                              <div className="flex items-center justify-between mb-3">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                                    isPdf
                                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                      : isTest
                                      ? 'bg-pink-600/20 text-pink-300 border border-pink-500/30'
                                      : 'bg-pink-600 text-white shadow-sm'
                                  }`}
                                >
                                  {isPdf ? (
                                    <>
                                      <FileText className="w-3 h-3" /> NOTES
                                    </>
                                  ) : isTest ? (
                                    <>
                                      <ClipboardList className="w-3 h-3" /> TEST
                                    </>
                                  ) : (
                                    <>
                                      <Play className="w-2.5 h-2.5 fill-white" /> LECTURE {index + 1}
                                    </>
                                  )}
                                </span>

                                <span className="text-[10px] text-zinc-500 font-mono font-semibold">
                                  ID: {item.id}
                                </span>
                              </div>

                              <h4 className="text-white font-extrabold text-sm sm:text-base leading-snug group-hover:text-pink-400 transition-colors line-clamp-2">
                                {item.title || item.test_series_name}
                              </h4>

                              <p className="text-[11px] text-zinc-400 mt-2 font-medium">
                                {selectedSubject?.title}
                              </p>
                            </div>

                            <div className="p-4 pt-3 bg-zinc-950/60 border-t border-zinc-800/80 flex items-center justify-between">
                              <span className="text-[11px] font-bold text-pink-400 uppercase tracking-wide">
                                {isPdf ? 'Open Document' : isTest ? 'Start Practice' : 'Watch Lecture'}
                              </span>

                              <button
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-black tracking-wide uppercase transition-all flex items-center gap-1.5 shadow-md ${
                                  isPdf
                                    ? 'bg-pink-600 hover:bg-pink-500 text-white shadow-pink-500/25'
                                    : 'bg-pink-600 hover:bg-pink-500 text-white shadow-pink-500/25'
                                }`}
                              >
                                {isPdf ? (
                                  <>
                                    <Download className="w-3 h-3" /> OPEN
                                  </>
                                ) : (
                                  <>
                                    <Play className="w-3 h-3 fill-white" /> PLAY
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
