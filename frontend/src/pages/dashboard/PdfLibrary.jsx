import { useMemo, useState } from 'react';
import { useDocuments } from '../../context/DocumentContext';
import DocumentCard from '../../components/DocumentCard';
import Button from '../../components/Button';
import { LayoutGrid, List, Search, Filter, FileText, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDocExt } from '../../utils/format';

const PdfLibrary = () => {
  const { documents, loading } = useDocuments();
  const [view, setView] = useState('grid');
  const [sortBy, setSortBy] = useState('date');
  const [searchQuery, setSearchQuery] = useState('');

  const pdfDocuments = useMemo(() => {
    return documents.filter((doc) => getDocExt(doc) === 'PDF');
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    let result = [...pdfDocuments];

    if (searchQuery) {
      result = result.filter((doc) =>
        (doc.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.description || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'date') return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === 'name') return (a.title || '').localeCompare(b.title || '');
      if (sortBy === 'size') return (b.file_size || 0) - (a.file_size || 0);
      return 0;
    });

    return result;
  }, [pdfDocuments, sortBy, searchQuery]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-rose-500/10 p-3 text-rose-600 dark:text-rose-400 shrink-0 border border-rose-500/20">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-app-text tracking-tight">PDF Repository</h1>
            <p className="text-xs text-app-muted mt-0.5">Filter view for all PDF formatted documents.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/dashboard/library">
            <Button variant="secondary" size="sm" className="text-xs">
              All Files ({documents.length})
            </Button>
          </Link>
          <Link to="/dashboard/upload">
            <Button size="sm" className="gap-1.5 text-xs font-bold shadow-xs">
              <Plus className="h-4 w-4" /> Upload PDF
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center py-3 border-b border-app-border">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-app-muted" />
          <input
            type="text"
            placeholder="Search PDF files..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-app-border bg-app-surface text-app-text focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2 text-xs text-app-muted">
            <span>Sort:</span>
            <select
              className="bg-app-surface-muted border border-app-border px-3 py-1 rounded-xl outline-none cursor-pointer text-app-text font-medium text-xs"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Newest First</option>
              <option value="name">Name (A-Z)</option>
              <option value="size">Largest Size</option>
            </select>
          </div>

          <div className="flex border border-app-border rounded-xl overflow-hidden bg-app-surface p-1 shadow-2xs">
            <button
              onClick={() => setView('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                view === 'grid' ? 'bg-app-surface-muted text-primary-600 font-bold' : 'text-app-muted hover:text-app-text'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                view === 'list' ? 'bg-app-surface-muted text-primary-600 font-bold' : 'text-app-muted hover:text-app-text'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-app-muted text-sm">Loading PDF documents...</div>
      ) : filteredDocuments.length > 0 ? (
        <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5' : 'flex flex-col gap-3'}>
          {filteredDocuments.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} view={view} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center rounded-3xl border border-dashed border-app-border bg-app-surface-muted/30">
          <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <FileText className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-app-text">No PDF documents found</h3>
          <p className="text-xs text-app-muted mt-1">Upload a PDF document to view it here.</p>
        </div>
      )}

      <div className="flex items-center justify-between pt-6 border-t border-app-border text-xs text-app-muted">
        <p>Showing <span className="font-bold text-app-text">{filteredDocuments.length}</span> PDF documents</p>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" className="text-xs" disabled>Previous</Button>
          <Button variant="secondary" size="sm" className="text-xs" disabled={filteredDocuments.length < 10}>Next</Button>
        </div>
      </div>
    </div>
  );
};

export default PdfLibrary;
