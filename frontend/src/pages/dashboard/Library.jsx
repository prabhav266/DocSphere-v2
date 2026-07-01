import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import DocumentCard from '../../components/DocumentCard';
import { LayoutGrid, List, Filter, Plus, Search } from 'lucide-react';
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
    { id: 'recent', label: 'Recent' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Library</h1>
          <p className="text-app-muted">Manage and organize all your uploaded documents.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/dashboard/upload">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Upload
            </Button>
          </Link>
          <div className="flex border border-app-border rounded-lg overflow-hidden bg-app-surface p-1">
            <button
              onClick={() => setView('grid')}
              className={`p-1.5 rounded-md transition-colors ${view === 'grid' ? 'bg-app-surface-muted text-primary-600' : 'text-app-muted'}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-1.5 rounded-md transition-colors ${view === 'list' ? 'bg-app-surface-muted text-primary-600' : 'text-app-muted'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center py-2 border-b border-app-border">
        <div className="flex items-center gap-4 overflow-x-auto w-full md:w-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-sm font-medium pb-2 px-1 whitespace-nowrap transition-colors ${activeTab === tab.id ? 'text-primary-600 border-b-2 border-primary-600' : 'text-app-muted hover:text-app-text'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-app-muted" />
          <input
            type="text"
            placeholder="Search library..."
            className="w-full pl-9 pr-4 py-1.5 text-sm rounded-lg border border-app-border bg-app-surface focus:ring-1 focus:ring-primary-500 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-app-muted" />
          <span className="text-sm font-medium text-app-text">Type:</span>
          <select
            className="text-xs bg-app-surface-muted px-3 py-1 rounded-full outline-none cursor-pointer border-none text-app-text"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="PDF">PDF</option>
            <option value="DOCX">Word</option>
            <option value="PPTX">PowerPoint</option>
            <option value="TXT">Text</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-app-muted">Sort:</span>
          <select
            className="bg-transparent text-sm font-semibold focus:ring-0 border-none p-0 pr-6 text-app-text cursor-pointer outline-none"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Newest First</option>
            <option value="name">Name (A-Z)</option>
            <option value="size">Largest Size</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-app-muted">Loading your documents...</div>
      ) : filteredDocuments.length > 0 ? (
        <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'flex flex-col gap-3'}>
          {filteredDocuments.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} view={view} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <div className="w-16 h-16 bg-app-surface-muted rounded-full flex items-center justify-center mx-auto mb-4 text-app-muted">
            <Filter className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold">No documents found</h3>
          <p className="text-app-muted">Try adjusting your filters or search query.</p>
        </div>
      )}

      <div className="flex items-center justify-between pt-8 border-t border-app-border">
        <p className="text-sm text-app-muted">Showing {filteredDocuments.length} of {documents.length} documents</p>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" disabled>Previous</Button>
          <Button variant="secondary" size="sm" disabled={filteredDocuments.length < 10}>Next</Button>
        </div>
      </div>
    </div>
  );
};

export default Library;
