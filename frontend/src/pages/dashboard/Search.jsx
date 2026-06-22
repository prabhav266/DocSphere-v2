import React, { useState } from 'react';
import { Search as SearchIcon, Filter, Clock } from 'lucide-react';
import { useDocuments } from '../../context/DocumentContext';
import DocumentCard from '../../components/DocumentCard';
import { getDocExt } from '../../utils/format';

const Search = () => {
  const { documents } = useDocuments();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = (e) => {
    const val = typeof e === 'string' ? e : e.target.value;
    setQuery(val);
    if (val.length > 1) {
      const filtered = documents.filter(doc =>
        doc.title?.toLowerCase().includes(val.toLowerCase()) ||
        doc.description?.toLowerCase().includes(val.toLowerCase()) ||
        getDocExt(doc).toLowerCase().includes(val.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h1 className="text-3xl font-bold">Search Documents</h1>
        <p className="text-slate-500 dark:text-slate-400">Find what you need across all your folders and files.</p>
        <div className="relative mt-8">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, description, or type..."
            className="w-full h-14 pl-12 pr-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-primary-500 focus:ring-0 transition-all outline-none text-lg"
            value={query}
            onChange={handleSearch}
            autoFocus
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 font-bold mb-4">
            <Filter className="h-4 w-4" /> Filters
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold mb-2 uppercase tracking-wider text-slate-400">File Type</p>
              <div className="space-y-2">
                <FilterCheckbox label="PDF Documents" count={documents.filter(d => getDocExt(d) === 'PDF').length} />
                <FilterCheckbox label="Word Files" count={documents.filter(d => getDocExt(d) === 'DOCX').length} />
                <FilterCheckbox label="Presentations" count={documents.filter(d => getDocExt(d) === 'PPTX').length} />
                <FilterCheckbox label="Text Files" count={documents.filter(d => getDocExt(d) === 'TXT').length} />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <p className="text-sm font-semibold mb-2 uppercase tracking-wider text-slate-400">Date Range</p>
              <div className="space-y-2">
                <FilterRadio label="Last 7 days" />
                <FilterRadio label="Last 30 days" />
                <FilterRadio label="This Year" />
                <FilterRadio label="All Time" defaultChecked />
              </div>
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-3 space-y-6">
          {query.length > 0 ? (
            <>
              <h2 className="text-lg font-bold">
                {results.length > 0 ? `Results for "${query}"` : `No results found for "${query}"`}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {results.map(doc => (
                  <DocumentCard key={doc.id} doc={doc} />
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Clock className="h-5 w-5 text-slate-400" /> Recent Documents
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {documents.slice(0, 3).map(doc => (
                  <DocumentCard key={doc.id} doc={doc} />
                ))}
              </div>

              <div className="pt-8">
                <h2 className="text-lg font-bold mb-4">Quick Searches</h2>
                <div className="flex flex-wrap gap-2">
                  {['PDF', 'DOCX', 'PPTX', 'TXT'].map(s => (
                    <button key={s} onClick={() => handleSearch(s)} className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-sm hover:border-primary-500 transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FilterCheckbox = ({ label, count }) => (
  <label className="flex items-center justify-between text-sm group cursor-pointer">
    <div className="flex items-center gap-2">
      <input type="checkbox" className="rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
      <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{label}</span>
    </div>
    <span className="text-xs text-slate-400">{count}</span>
  </label>
);

const FilterRadio = ({ label, defaultChecked }) => (
  <label className="flex items-center gap-2 text-sm group cursor-pointer">
    <input type="radio" name="date-range" defaultChecked={defaultChecked} className="border-slate-300 text-primary-600 focus:ring-primary-500" />
    <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{label}</span>
  </label>
);

export default Search;
