import { useMemo, useState } from 'react';
import { useDocuments } from '../../context/DocumentContext';
import DocumentCard from '../../components/DocumentCard';
import Button from '../../components/Button';
import { LayoutGrid, List, Search, Filter, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDocExt } from '../../utils/format';

const PdfLibrary = () => {
  const { documents } = useDocuments();
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
        doc.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'date') return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      if (sortBy === 'size') return (b.file_size || 0) - (a.file_size || 0);
      return 0;
    });

    return result;
  }, [pdfDocuments, sortBy, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-primary-50 dark:bg-primary-900/20 p-3 text-primary-600">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">My Uploads</h1>
            <p className="text-slate-500 dark:text-slate-400">All your uploaded PDF documents are collected here separately from other file types.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link to="/dashboard/library">
            <Button variant="secondary" className="gap-2">
              <FileText className="h-4 w-4" /> All Documents
            </Button>
          </Link>
          <Button className="gap-2" onClick={() => setView(view === 'grid' ? 'list' : 'grid')}>
            {view === 'grid' ? <List className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />} {view === 'grid' ? 'List View' : 'Grid View'}
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center py-2 border-b border-slate-200 dark:border-slate-800">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search PDFs..."
            className="w-full pl-9 pr-4 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-1 focus:ring-primary-500 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Sort:</span>
          <select
            className="bg-transparent text-sm font-semibold focus:ring-0 border-none p-0 pr-6 dark:text-white cursor-pointer outline-none"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Newest First</option>
            <option value="name">Name (A-Z)</option>
            <option value="size">Largest Size</option>
          </select>
        </div>
      </div>

      {filteredDocuments.length > 0 ? (
        <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'flex flex-col gap-3'}>
          {filteredDocuments.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} view={view} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Filter className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold">No PDFs uploaded yet</h3>
          <p className="text-slate-500">Upload PDF files from the Upload page to see them here.</p>
        </div>
      )}

      <div className="flex items-center justify-between pt-8 border-t border-slate-100 dark:border-slate-800">
        <p className="text-sm text-slate-500">Showing {filteredDocuments.length} PDF documents</p>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" disabled>
            Previous
          </Button>
          <Button variant="secondary" size="sm" disabled={filteredDocuments.length < 10}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PdfLibrary;
