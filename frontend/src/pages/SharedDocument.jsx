import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, Loader2, Shield } from 'lucide-react';
import Button from '../components/Button';
import { documentService } from '../api/documentService';
import { API_ORIGIN } from '../api/apiClient';
import { getDocExt, getDocDate, getDocSize } from '../utils/format';

const SharedDocument = () => {
  const { token } = useParams();
  const [doc, setDoc] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDocument = async () => {
      try {
        const data = await documentService.getShared(token);
        setDoc(data);
      } catch (err) {
        setError(err.message || 'Shared document not found.');
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <div className="max-w-md text-center space-y-4">
          <Shield className="h-12 w-12 mx-auto text-slate-400" />
          <h1 className="text-2xl font-bold">Link unavailable</h1>
          <p className="text-slate-500">{error || 'This share link may have expired.'}</p>
          <Link to="/">
            <Button>Go to DocSphere</Button>
          </Link>
        </div>
      </div>
    );
  }

  const type = getDocExt(doc);
  const fileUrl = doc.file_url ? `${API_ORIGIN}${doc.file_url}` : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 font-bold">
            <Shield className="h-6 w-6 text-primary-600" />
            DocSphere
          </Link>
          <span className="text-xs uppercase tracking-[0.18em] text-slate-400">Shared Document</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
        <section className="space-y-2">
          <h1 className="text-2xl font-bold">{doc.title}</h1>
          <p className="text-sm text-slate-500">{type} • {getDocSize(doc)} • Uploaded {getDocDate(doc)}</p>
          {doc.description && <p className="text-slate-600 dark:text-slate-300">{doc.description}</p>}
          {Array.isArray(doc.tags) && doc.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {doc.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </section>

        {doc.ai_summary && (
          <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
            <h2 className="font-semibold mb-2">AI Summary</h2>
            <p className="text-sm leading-6 text-slate-700 dark:text-slate-300 whitespace-pre-line">{doc.ai_summary}</p>
          </section>
        )}

        <section className="h-[70vh] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          {type === 'PDF' && fileUrl ? (
            <iframe src={`${fileUrl}#toolbar=0&navpanes=0`} title={doc.title} className="w-full h-full border-none" />
          ) : (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-center p-8">
              <FileText className="h-16 w-16 text-slate-300" />
              <p className="font-semibold">Preview not available for {type} files</p>
              <p className="text-sm text-slate-500">Ask the owner to share the file directly if you need the original.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default SharedDocument;
