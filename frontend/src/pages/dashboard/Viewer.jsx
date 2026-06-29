import React, { useState, useEffect, useMemo } from 'react';
import {
  Download,
  Share2,
  FileText,
  ArrowLeft,
  Trash2,
  Loader2
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { useDocuments } from '../../context/DocumentContext';
import { getDocExt, getDocDate, getDocSize } from '../../utils/format';
import { documentService } from '../../api/documentService';

const API_ORIGIN = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, '');

const Viewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDocumentById, deleteDocument, documents } = useDocuments();
  const [deleting, setDeleting] = useState(false);

  const doc = useMemo(() => getDocumentById(id), [id, getDocumentById]);
  const loading = !doc && documents.length === 0;

  useEffect(() => {
    if (!doc && documents.length > 0) {
      navigate('/dashboard/library');
    }
  }, [doc, documents, navigate]);

  const handleDelete = async () => {
    if (!doc) return;
    if (window.confirm("Are you sure you want to delete this document?")) {
      setDeleting(true);
      try {
        await deleteDocument(doc.id);
        navigate('/dashboard/library');
      } catch (err) {
        alert('Failed to delete document: ' + (err.message || 'Unknown error'));
        setDeleting(false);
      }
    }
  };

  const handleDownload = () => {
    if (!doc) return;
    window.open(documentService.getDownloadUrl(doc.id), '_blank');
  };

  if (loading || !doc) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-primary-600 animate-spin" />
      </div>
    );
  }

  const type = getDocExt(doc);
  const fileUrl = doc.file_url ? `${API_ORIGIN}${doc.file_url}` : null;

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div className="min-w-0">
            <h1 className="text-xl font-bold truncate max-w-50 md:max-w-md">{doc.title}</h1>
            <p className="text-xs text-slate-500">{type} • {getDocSize(doc)} • Uploaded on {getDocDate(doc)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50" onClick={handleDelete} disabled={deleting}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="sm" className="gap-2" onClick={() => {
            navigator.clipboard?.writeText(window.location.href);
            alert('Link copied to clipboard');
          }}>
            <Share2 className="h-4 w-4" /> Share
          </Button>
          <Button size="sm" className="gap-2" onClick={handleDownload}>
            <Download className="h-4 w-4" /> Download
          </Button>
        </div>
      </div>

      {doc.ai_summary ? (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-3">
            <h2 className="text-lg font-semibold">AI Summary</h2>
            <span className="text-xs uppercase tracking-[0.18em] text-slate-400">Auto-generated</span>
          </div>
          <p className="text-sm leading-6 text-slate-700 dark:text-slate-300 whitespace-pre-line">
            {doc.ai_summary}
          </p>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">AI Summary</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">No summary available yet. Upload the document to generate a summary automatically.</p>
        </div>
      )}

      <div className="flex-1 bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden flex flex-col relative border border-slate-300 dark:border-slate-700 shadow-sm">
        {type === 'PDF' && fileUrl ? (
          <iframe
            src={`${fileUrl}#toolbar=0&navpanes=0`}
            title={doc.title}
            className="w-full h-full border-none"
            style={{ backgroundColor: 'white' }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full space-y-4 p-12 text-center">
            <FileText className="h-20 w-20 text-slate-300" />
            <h2 className="text-xl font-bold">Preview not available for {type} files</h2>
            <p className="text-slate-500 max-w-md">The online viewer currently only supports direct PDF previews. You can download the file to view it on your device.</p>
            <Button variant="secondary" onClick={handleDownload}>Download {type}</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Viewer;
