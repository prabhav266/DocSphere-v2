import React, { useEffect, useState } from 'react';
import { Search as SearchIcon, Filter, Clock, Loader2 } from 'lucide-react';
import { useDocuments } from '../../context/DocumentContext';
import DocumentCard from '../../components/DocumentCard';
import { getDocExt } from '../../utils/format';
import { documentService } from '../../api/documentService';

const Search = () => {
  const { documents } = useDocuments();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [type, setType] = useState('All');
  const [visibility, setVisibility] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [loading, setLoading] = useState(false);

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
    <div className="space-y-8">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h1 className="text-3xl font-bold">Search Documents</h1>
        <p className="text-app-muted">Find content by title, description, generated tags, or extracted PDF text.</p>
        <div className="relative mt-8">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-app-muted" />
          <input
            type="text"
            placeholder="Search inside your documents..."
            className="w-full h-14 pl-12 pr-4 rounded-2xl border-2 border-app-border bg-app-surface focus:border-primary-500 focus:ring-0 transition-all outline-none text-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="space-y-6">
          <div className="flex items-center gap-2 font-bold">
            <Filter className="h-4 w-4" /> Filters
          </div>

          <FilterSelect label="File Type" value={type} onChange={setType} options={[
            ['All', `All Types (${documents.length})`],
            ['pdf', `PDF (${documents.filter(d => getDocExt(d) === 'PDF').length})`],
            ['word', `Word (${documents.filter(d => getDocExt(d) === 'DOCX').length})`],
            ['presentation', `Presentations (${documents.filter(d => getDocExt(d) === 'PPTX').length})`],
            ['text', `Text (${documents.filter(d => getDocExt(d) === 'TXT').length})`],
          ]} />

          <FilterSelect label="Visibility" value={visibility} onChange={setVisibility} options={[
            ['all', 'All Visibility'],
            ['public', 'Public'],
            ['private', 'Private'],
          ]} />

          <FilterSelect label="Date Range" value={dateRange} onChange={setDateRange} options={[
            ['all', 'All Time'],
            ['7d', 'Last 7 days'],
            ['30d', 'Last 30 days'],
            ['year', 'This Year'],
          ]} />
        </div>

        <div className="lg:col-span-3 space-y-6">
          {hasSearch ? (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">
                  {loading ? 'Searching...' : `${results.length} result${results.length === 1 ? '' : 's'}`}
                </h2>
                {loading && <Loader2 className="h-5 w-5 animate-spin text-primary-600" />}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {results.map(doc => (
                  <DocumentCard key={doc.id} doc={doc} />
                ))}
              </div>
              {!loading && results.length === 0 && (
                <div className="py-16 text-center rounded-2xl border border-dashed border-app-border">
                  <p className="font-semibold">No matching documents</p>
                  <p className="mt-2 text-sm text-app-muted">Try a broader query or fewer filters.</p>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Clock className="h-5 w-5 text-app-muted" /> Recent Documents
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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
  <label className="block space-y-2">
    <span className="text-sm font-semibold uppercase tracking-wider text-app-muted">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-app-border bg-app-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500"
    >
      {options.map(([optionValue, optionLabel]) => (
        <option key={optionValue} value={optionValue}>{optionLabel}</option>
      ))}
    </select>
  </label>
);

export default Search;
