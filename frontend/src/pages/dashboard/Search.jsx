import React, { useEffect, useState } from 'react';
import { Search as SearchIcon, Filter, Clock, Loader2, Sparkles, FolderOpen } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useDocuments } from '../../context/DocumentContext';
import DocumentCard from '../../components/DocumentCard';
import { getDocExt } from '../../utils/format';
import { documentService } from '../../api/documentService';

const Search = () => {
  const { documents } = useDocuments();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [type, setType] = useState('All');
  const [visibility, setVisibility] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlQuery = searchParams.get('q');
    if (urlQuery !== null && urlQuery !== query) {
      setQuery(urlQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    const shouldSearch = query.trim().length > 1 || type !== 'All' || visibility !== 'all' || dateRange !== 'all';

    if (!shouldSearch) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await documentService.search({
          query,
          type,
          visibility,
          dateRange,
          mine: true,
        });
        setResults(data);
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [dateRange, query, type, visibility]);

  const hasSearch = query.trim().length > 0 || type !== 'All' || visibility !== 'all' || dateRange !== 'all';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Search Header Banner */}
      <div className="max-w-3xl mx-auto text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-bold">
          <Sparkles className="h-3.5 w-3.5" /> Full-Text AI Search
        </div>
        <h1 className="text-3xl font-extrabold text-app-text tracking-tight">Search Repository</h1>
        <p className="text-xs text-app-muted max-w-lg mx-auto">
          Find matching documents by title, description, generated tags, or indexed PDF text.
        </p>

        <div className="relative mt-6 shadow-md rounded-2xl">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-app-muted" />
          <input
            type="text"
            placeholder="Search keywords, topics, or document names..."
            className="w-full h-13 pl-12 pr-4 rounded-2xl border-2 border-app-border bg-app-surface text-app-text focus:border-primary-500 focus:ring-4 focus:ring-primary-500/15 transition-all outline-none text-sm font-medium"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8 pt-4">
        {/* Filters Sidebar */}
        <div className="space-y-5 bg-app-surface p-5 rounded-3xl border border-app-border h-fit">
          <div className="flex items-center gap-2 font-bold text-sm text-app-text pb-3 border-b border-app-border">
            <Filter className="h-4 w-4 text-primary-600" /> Filter Criteria
          </div>

          <FilterSelect label="File Format" value={type} onChange={setType} options={[
            ['All', `All Formats (${documents.length})`],
            ['pdf', `PDF (${documents.filter(d => getDocExt(d) === 'PDF').length})`],
            ['word', `Word (${documents.filter(d => getDocExt(d) === 'DOCX').length})`],
            ['presentation', `Presentations (${documents.filter(d => getDocExt(d) === 'PPTX').length})`],
            ['text', `Text (${documents.filter(d => getDocExt(d) === 'TXT').length})`],
          ]} />

          <FilterSelect label="Visibility" value={visibility} onChange={setVisibility} options={[
            ['all', 'All Visibilities'],
            ['public', 'Public Documents'],
            ['private', 'Private Documents'],
          ]} />

          <FilterSelect label="Upload Period" value={dateRange} onChange={setDateRange} options={[
            ['all', 'All Time'],
            ['7d', 'Last 7 days'],
            ['30d', 'Last 30 days'],
            ['year', 'This Year'],
          ]} />
        </div>

        {/* Results Container */}
        <div className="lg:col-span-3 space-y-6">
          {hasSearch ? (
            <>
              <div className="flex items-center justify-between pb-2 border-b border-app-border">
                <h2 className="text-sm font-bold text-app-text">
                  {loading ? 'Searching repository...' : `${results.length} document match${results.length === 1 ? '' : 'es'} found`}
                </h2>
                {loading && <Loader2 className="h-4 w-4 animate-spin text-primary-600" />}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {results.map(doc => (
                  <DocumentCard key={doc.id} doc={doc} />
                ))}
              </div>
              {!loading && results.length === 0 && (
                <div className="py-16 text-center rounded-3xl border border-dashed border-app-border bg-app-surface-muted/30">
                  <FolderOpen className="h-10 w-10 text-app-muted/60 mx-auto mb-2" />
                  <p className="font-bold text-app-text text-sm">No matching documents</p>
                  <p className="mt-1 text-xs text-app-muted">Try adjusting search query or clearing filter restrictions.</p>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-5">
              <h2 className="text-sm font-bold text-app-text flex items-center gap-2 pb-2 border-b border-app-border">
                <Clock className="h-4 w-4 text-app-muted" /> Recent Workspace Documents
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {documents.slice(0, 3).map(doc => (
                  <DocumentCard key={doc.id} doc={doc} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FilterSelect = ({ label, value, onChange, options }) => (
  <label className="block space-y-1.5">
    <span className="text-[11px] font-extrabold uppercase tracking-wider text-app-muted">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-app-border bg-app-surface-muted px-3 py-2 text-xs text-app-text outline-none focus:border-primary-500 font-medium"
    >
      {options.map(([optionValue, optionLabel]) => (
        <option key={optionValue} value={optionValue}>{optionLabel}</option>
      ))}
    </select>
  </label>
);

export default Search;
