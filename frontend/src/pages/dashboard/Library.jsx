import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import DocumentCard from '../../components/DocumentCard';
import { LayoutGrid, List, Filter, Plus, Search, FolderOpen, ArrowUpDown } from 'lucide-react';
import Button from '../../components/Button';
import { useDocuments } from '../../context/DocumentContext';
import { getDocExt } from '../../utils/format';

const Library = () => {
  const { documents = [], loading } = useDocuments();
  const [view, setView] = useState('grid');
  const [sortBy, setSortBy] = useState('date');
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredDocuments = useMemo(() => {
    let result = [...documents];

    if (activeTab === 'recent') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      result = result.filter((doc) => new Date(doc.created_at) >= thirtyDaysAgo);
    }

    if (filterType !== 'All') {
      result = result.filter((doc) => getDocExt(doc) === filterType);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((doc) => {
        const title = (doc.title || '').toLowerCase();
        const description = (doc.description || '').toLowerCase();
        return title.includes(query) || description.includes(query);
      });
    }

    result.sort((a, b) => {
      if (sortBy === 'date') return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === 'name') return (a.title || '').localeCompare(b.title || '');
      if (sortBy === 'size') return (b.file_size || 0) - (a.file_size || 0);
      return 0;
    });

    return result;
  }, [activeTab, documents, filterType, searchQuery, sortBy]);

  const tabs = [
    { id: 'all', label: 'All Files' },
    { id: 'recent', label: 'Recent (30 Days)' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-app-text tracking-tight">Document Library</h1>
          <p className="text-xs text-app-muted mt-1">Manage and organize all your repository files.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/dashboard/upload">
            <Button size="sm" className="gap-2 text-xs font-bold shadow-xs">
              <Plus className="h-4 w-4" /> Upload Document
            </Button>
          </Link>

          {/* View Toggle */}
          <div className="flex border border-app-border rounded-xl overflow-hidden bg-app-surface p-1 shadow-2xs">
            <button
              onClick={() => setView('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                view === 'grid' ? 'bg-app-surface-muted text-primary-600 font-bold' : 'text-app-muted hover:text-app-text'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                view === 'list' ? 'bg-app-surface-muted text-primary-600 font-bold' : 'text-app-muted hover:text-app-text'
              }`}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center pb-4 border-b border-app-border">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-xs font-bold py-2 px-3.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400' 
                  : 'text-app-muted hover:text-app-text hover:bg-app-surface-muted'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-app-muted" />
          <input
            type="text"
            placeholder="Filter files by title or description..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-app-border bg-app-surface text-app-text focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Secondary Controls: Type & Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-app-surface p-3 rounded-2xl border border-app-border text-xs">
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-app-muted" />
          <span className="font-semibold text-app-text">Type:</span>
          <select
            className="bg-app-surface-muted border border-app-border px-3 py-1 rounded-xl outline-none cursor-pointer text-app-text font-medium"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All Formats</option>
            <option value="PDF">PDF Documents</option>
            <option value="DOCX">Word (.docx)</option>
            <option value="PPTX">PowerPoint (.pptx)</option>
            <option value="TXT">Text (.txt)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-3.5 w-3.5 text-app-muted" />
          <span className="font-semibold text-app-text">Sort by:</span>
          <select
            className="bg-app-surface-muted border border-app-border px-3 py-1 rounded-xl outline-none cursor-pointer text-app-text font-medium"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Newest First</option>
            <option value="name">Name (A-Z)</option>
            <option value="size">File Size</option>
          </select>
        </div>
      </div>

      {/* Main Grid/List Container */}
      {loading ? (
        <div className="py-20 text-center text-app-muted text-sm">Fetching document library...</div>
      ) : filteredDocuments.length > 0 ? (
        <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5' : 'flex flex-col gap-3'}>
          {filteredDocuments.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} view={view} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center rounded-3xl border border-dashed border-app-border bg-app-surface-muted/30">
          <FolderOpen className="h-12 w-12 text-app-muted/60 mx-auto mb-3" />
          <h3 className="text-base font-bold text-app-text">No documents match your query</h3>
          <p className="text-xs text-app-muted mt-1">Try clearing filters or search for a different document title.</p>
        </div>
      )}

      {/* Footer Info */}
      <div className="flex items-center justify-between pt-6 border-t border-app-border text-xs text-app-muted">
        <p>Showing <span className="font-bold text-app-text">{filteredDocuments.length}</span> of <span className="font-bold text-app-text">{documents.length}</span> files</p>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" className="text-xs" disabled>Previous</Button>
          <Button variant="secondary" size="sm" className="text-xs" disabled={filteredDocuments.length < 12}>Next</Button>
        </div>
      </div>
    </div>
  );
};

export default Library;
