import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Cpu, 
  ExternalLink, 
  Tv, 
  Video, 
  Bookmark as BookmarkIcon, 
  Trash2,
  Search,
  ListVideo,
  Activity,
  Grid,
  Binary,
  CircuitBoard,
  LineChart,
  Wifi,
  Clock,
  X,
  Zap,
  Sliders,
  Layers,
  Code,
  Box,
  Calculator
} from 'lucide-react';

export const SimulationToolsView: React.FC = () => {
  const { tools, toggleBookmark, isBookmarked } = useApp();
  const [filter, setFilter] = useState('');
  const [categoryTab, setCategoryTab] = useState<'all' | 'interactive' | 'industry'>('all');
  const [selectedTool, setSelectedTool] = useState<(typeof tools)[0] | null>(null);

  // Map iconName to icon component
  const getToolIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity':
        return <Activity className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      case 'Grid':
        return <Grid className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
      case 'Binary':
        return <Binary className="w-6 h-6 text-purple-600 dark:text-purple-400" />;
      case 'CircuitBoard':
        return <CircuitBoard className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
      case 'LineChart':
        return <LineChart className="w-6 h-6 text-amber-600 dark:text-amber-400" />;
      case 'Wifi':
        return <Wifi className="w-6 h-6 text-rose-600 dark:text-rose-400" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-amber-500 dark:text-amber-400" />;
      case 'Sliders':
        return <Sliders className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />;
      case 'Layers':
        return <Layers className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />;
      case 'Code':
        return <Code className="w-6 h-6 text-teal-600 dark:text-teal-400" />;
      case 'Box':
        return <Box className="w-6 h-6 text-sky-600 dark:text-sky-400" />;
      case 'Calculator':
        return <Calculator className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      default:
        return <Cpu className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
    }
  };

  // Safe URL validator
  const isValidUrl = (url?: string): boolean => {
    if (!url || typeof url !== 'string') return false;
    const trimmed = url.trim();
    if (trimmed.length === 0) return false;
    try {
      const parsed = new URL(trimmed);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const interactiveIds = ['tool-mosfet', 'tool-kmap', 'tool-logic-converter', 'tool-gate-builder', 'tool-signal-analyzer', 'tool-iot-guide', 'tool-maths-lab'];

  const tabFiltered = tools.filter(t => {
    if (categoryTab === 'interactive') return interactiveIds.includes(t.id);
    if (categoryTab === 'industry') return !interactiveIds.includes(t.id);
    return true;
  });

  const filtered = filter
    ? tabFiltered.filter(t => t.name.toLowerCase().includes(filter.toLowerCase()) || t.category.toLowerCase().includes(filter.toLowerCase()))
    : tabFiltered;

  const interactiveCount = tools.filter(t => interactiveIds.includes(t.id)).length;
  const industryCount = tools.filter(t => !interactiveIds.includes(t.id)).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center space-x-2">
            <Cpu className="w-6 h-6 text-blue-600" />
            <span>Simulation Software & Laboratory Tools</span>
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Complete ECE lab ecosystem: interactive custom analyzers, SPICE modeling engines, MCU co-simulators, and EDA suites.
          </p>
        </div>

        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter tools..."
          className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200/80 dark:border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setCategoryTab('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex-shrink-0 ${
            categoryTab === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700'
          }`}
        >
          All Tools ({tools.length})
        </button>
        <button
          onClick={() => setCategoryTab('interactive')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex-shrink-0 ${
            categoryTab === 'interactive'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700'
          }`}
        >
          Interactive Lab Simulators ({interactiveCount})
        </button>
        <button
          onClick={() => setCategoryTab('industry')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex-shrink-0 ${
            categoryTab === 'industry'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700'
          }`}
        >
          Industry EDA & Software ({industryCount})
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((tool) => {
          const hasValidUrl = isValidUrl(tool.url);

          return (
            <div
              key={tool.id}
              className="bg-white dark:bg-[#151945] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-2xs">
                    {getToolIcon(tool.iconName)}
                  </div>
                  <div className="flex items-center space-x-1.5">
                    {hasValidUrl ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                        Online
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-[10px] font-bold flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Coming soon</span>
                      </span>
                    )}

                    <button
                      onClick={() => toggleBookmark(tool.name, 'Simulation', tool.url)}
                      className={`p-2 rounded-xl transition ${
                        isBookmarked(tool.name) ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/50' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      title="Bookmark tool"
                    >
                      <BookmarkIcon className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider">
                  {tool.category}
                </span>
                <h3 className="text-base font-bold text-slate-800 dark:text-white mt-2 mb-1">{tool.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{tool.description}</p>

                {tool.linkedSubjects.length > 0 && (
                  <div className="mb-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Linked BOS Subjects:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {tool.linkedSubjects.map((subCode) => (
                        <span key={subCode} className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-cyan-400 text-[10px] font-mono rounded-md font-semibold border border-blue-100 dark:border-blue-900/60">
                          {subCode}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {hasValidUrl ? (
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition shadow-xs"
                >
                  <span>Launch Simulator</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => setSelectedTool(tool)}
                  className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition border border-slate-200/80 dark:border-slate-700 cursor-pointer"
                  title="Click to view tool details and integration status"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Coming soon (View Details)</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Simulation Tool Details Modal */}
      {selectedTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full border border-slate-200/80 shadow-2xl relative">
            <button
              onClick={() => setSelectedTool(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3.5 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                {getToolIcon(selectedTool.iconName)}
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                  {selectedTool.category}
                </span>
                <h2 className="text-xl font-bold text-slate-800 mt-1">{selectedTool.name}</h2>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {selectedTool.description}
            </p>

            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs mb-5">
              <div className="flex items-center space-x-2 text-amber-800 font-bold mb-1">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>TinyURL Integration Pending</span>
              </div>
              <p className="text-[11px] text-amber-700 leading-relaxed">
                This simulation engine is currently undergoing validation on our laboratory workstation. Once the TinyURL endpoint is configured, this tool will launch directly.
              </p>
            </div>

            {selectedTool.linkedSubjects.length > 0 && (
              <div className="mb-6">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Mapped ECE Curriculum Courses:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTool.linkedSubjects.map((subCode) => (
                    <span
                      key={subCode}
                      className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-mono rounded-lg font-semibold border border-blue-100"
                    >
                      {subCode}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => {
                  toggleBookmark(selectedTool.name, 'Simulation', selectedTool.url);
                }}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition border ${
                  isBookmarked(selectedTool.name)
                    ? 'bg-amber-50 border-amber-300 text-amber-700'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <BookmarkIcon className="w-3.5 h-3.5 fill-current" />
                <span>{isBookmarked(selectedTool.name) ? 'Bookmarked' : 'Bookmark Tool'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTool(null)}
                className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const NptelView: React.FC = () => {
  const { nptelList, toggleBookmark, isBookmarked } = useApp();
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');

  // Extract unique subjects
  const subjects = ['All', ...Array.from(new Set(nptelList.map(c => c.subject || 'Core ECE')))];

  const filtered = nptelList.filter(course => {
    const matchesSearch = search.trim() === '' ||
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.instructor.toLowerCase().includes(search.toLowerCase()) ||
      course.institute.toLowerCase().includes(search.toLowerCase()) ||
      (course.subjectCode && course.subjectCode.toLowerCase().includes(search.toLowerCase()));

    const matchesSubject = selectedSubject === 'All' || course.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight flex items-center space-x-2">
            <Tv className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <span>NPTEL ECE Video Courses</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Official Ministry of Education (SWAYAM/NPTEL) certified curricula taught by IIT and IISc faculty.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search NPTEL courses, IITs, topics..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
          />
        </div>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex flex-wrap gap-1.5 pb-1">
        {subjects.map(sub => (
          <button
            key={sub}
            onClick={() => setSelectedSubject(sub)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedSubject === sub
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-[#151945] rounded-3xl p-10 text-center border border-dashed border-slate-300 dark:border-slate-700">
          <Tv className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">No NPTEL courses found matching "{search}".</p>
          <button
            onClick={() => { setSearch(''); setSelectedSubject('All'); }}
            className="mt-3 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((course) => (
            <div
              key={course.id}
              className="bg-white dark:bg-[#151945] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-purple-200 dark:hover:border-purple-500/50 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                    <span className="px-2.5 py-0.5 rounded-lg bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 font-mono text-[11px] font-bold border border-purple-100 dark:border-purple-900/50">
                      {course.institute}
                    </span>
                    {course.subject && (
                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold">
                        {course.subject}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => toggleBookmark(course.title, 'NPTEL', course.url)}
                    className={`p-1.5 rounded-lg transition ${
                      isBookmarked(course.title) ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/50' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    title="Bookmark course"
                  >
                    <BookmarkIcon className="w-4 h-4 fill-current" />
                  </button>
                </div>

                <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-1">{course.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Instructor: {course.instructor}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">{course.lectureCount} Lectures</span>
                <a
                  href={course.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1 transition shadow-2xs"
                >
                  <span>Go to NPTEL</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const YouTubeView: React.FC = () => {
  const { ytList, toggleBookmark, isBookmarked } = useApp();
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');

  // Extract unique subjects for YouTube
  const subjects = ['All', ...Array.from(new Set(ytList.map(y => y.subject || 'Core ECE')))];

  const filtered = ytList.filter(yt => {
    const matchesSearch = search.trim() === '' ||
      yt.channelName.toLowerCase().includes(search.toLowerCase()) ||
      yt.title.toLowerCase().includes(search.toLowerCase()) ||
      yt.category.toLowerCase().includes(search.toLowerCase()) ||
      yt.recommendedFor.toLowerCase().includes(search.toLowerCase());

    const matchesSubject = selectedSubject === 'All' || yt.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight flex items-center space-x-2">
            <Video className="w-6 h-6 text-red-600 dark:text-red-400" />
            <span>Curated ECE YouTube Lectures & Playlists</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Organized subject playlists, lab hardware guides, practical circuits, and GATE preparation channels.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search channels, playlists, concepts..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500 shadow-2xs"
          />
        </div>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex flex-wrap gap-1.5 pb-1">
        {subjects.map(sub => (
          <button
            key={sub}
            onClick={() => setSelectedSubject(sub)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedSubject === sub
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-[#151945] rounded-3xl p-10 text-center border border-dashed border-slate-300 dark:border-slate-700">
          <Video className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">No YouTube resources found matching "{search}".</p>
          <button
            onClick={() => { setSearch(''); setSelectedSubject('All'); }}
            className="mt-3 text-xs font-bold text-red-600 dark:text-red-400 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((yt) => (
            <div
              key={yt.id}
              className="bg-white dark:bg-[#151945] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-red-200 dark:hover:border-red-500/50 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                    <span className="px-2.5 py-0.5 rounded-lg bg-red-50 dark:bg-red-950/70 text-red-700 dark:text-red-300 font-mono text-[11px] font-bold">
                      {yt.category}
                    </span>
                    {yt.isPlaylist && (
                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold flex items-center space-x-1">
                        <ListVideo className="w-3 h-3 text-red-500" />
                        <span>Playlist</span>
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => toggleBookmark(yt.channelName, 'YouTube', yt.url)}
                    className={`p-1.5 rounded-lg transition ${
                      isBookmarked(yt.channelName) ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/50' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    title="Bookmark channel"
                  >
                    <BookmarkIcon className="w-4 h-4 fill-current" />
                  </button>
                </div>

                <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-1">{yt.channelName}</h3>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">{yt.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{yt.recommendedFor}</p>
              </div>

              <a
                href={yt.url}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition shadow-2xs"
              >
                <span>Watch on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const BookmarksView: React.FC = () => {
  const { bookmarks, toggleBookmark } = useApp();

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight flex items-center space-x-2">
          <BookmarkIcon className="w-6 h-6 text-amber-500" />
          <span>Saved Bookmarks</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
          Quickly access your pinned PDFs, course modules, simulations, and exam resources.
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="bg-white dark:bg-[#151945] rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center">
          <BookmarkIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm">No bookmarks saved yet</h3>
          <p className="text-slate-400 text-xs mt-1">
            Click the bookmark ribbon on any resource, tool, or video to save it here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookmarks.map((bm) => (
            <div
              key={bm.id}
              className="bg-white dark:bg-[#151945] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between"
            >
              <div className="truncate pr-3">
                <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                  {bm.category}
                </span>
                <p className="font-bold text-slate-800 dark:text-white text-xs mt-1.5 truncate">{bm.title}</p>
                <p className="text-[10px] text-slate-400">Added on {bm.addedAt}</p>
              </div>

              <div className="flex items-center space-x-2">
                {bm.url && (
                  <a
                    href={bm.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-blue-600 dark:text-cyan-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg text-xs"
                    title="Open link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={() => toggleBookmark(bm.title, bm.category)}
                  className="p-2 text-slate-300 dark:text-slate-500 hover:text-rose-500 rounded-lg transition"
                  title="Remove bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const ProfileView: React.FC = () => {
  const { user, setCurrentView } = useApp();

  return (
    <div className="space-y-6 max-w-3xl animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Student Profile & Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Manage your academic credentials, personal learning records, and account access.</p>
      </div>

      <div className="bg-white dark:bg-[#151945] rounded-3xl p-6 md:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-800 text-white font-extrabold text-2xl flex items-center justify-center shadow-md shadow-blue-500/20">
              {user?.name?.charAt(0) || 'S'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">{user?.name}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{user?.branch}</p>
              <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                user?.role === 'admin' ? 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300' : 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300'
              }`}>
                {user?.role === 'admin' ? 'Verified Faculty Administrator' : 'Active Enrolled Student'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('welcome')}
            className="self-start sm:self-auto px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-cyan-400 rounded-xl text-xs font-semibold transition border border-slate-200/60 dark:border-slate-700"
          >
            View Welcome Page
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#181C4B] border border-slate-200/60 dark:border-slate-700">
            <span className="text-slate-400 dark:text-slate-400 block mb-0.5 font-medium">Email / Student ID</span>
            <span className="font-bold text-slate-800 dark:text-white break-all">{user?.email}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#181C4B] border border-slate-200/60 dark:border-slate-700">
            <span className="text-slate-400 dark:text-slate-400 block mb-0.5 font-medium">Current Academic Year</span>
            <span className="font-bold text-slate-800 dark:text-white">Year {user?.year} (B.Tech ECE)</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#181C4B] border border-slate-200/60 dark:border-slate-700">
            <span className="text-slate-400 dark:text-slate-400 block mb-0.5 font-medium">BOS Curriculum Progress</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400">
              {user?.completedBosSubjects || 0} of {user?.totalBosSubjects || 30} Subjects Completed
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#181C4B] border border-slate-200/60 dark:border-slate-700">
            <span className="text-slate-400 dark:text-slate-400 block mb-0.5 font-medium">GATE 2028 Topics Mastered</span>
            <span className="font-bold text-indigo-700 dark:text-indigo-400">
              {user?.completedGateTopics || 0} of {user?.totalGateTopics || 65} Topics Covered
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#181C4B] border border-slate-200/60 dark:border-slate-700">
            <span className="text-slate-400 dark:text-slate-400 block mb-0.5 font-medium">Continuous Study Streak</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">
              {user?.streakDays || 0} Consecutive Days (All-time Best: {user?.bestStreakDays || 0} Days)
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#181C4B] border border-slate-200/60 dark:border-slate-700">
            <span className="text-slate-400 dark:text-slate-400 block mb-0.5 font-medium">Assigned System Role</span>
            <span className={`font-bold uppercase tracking-wider ${
              user?.role === 'admin' ? 'text-rose-600 dark:text-rose-400' : 'text-blue-600 dark:text-cyan-400'
            }`}>
              {user?.role === 'admin' ? 'Faculty Administrator (Full Access)' : 'Student (Study Hub & Personal Planner)'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

