import React, { useState, useEffect, useMemo } from 'react';
import {
  Download,
  Share2,
  FileText,
  ArrowLeft,
  Trash2,
  Loader2,
  Send,
  MessageSquare
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { useDocuments } from '../../context/DocumentContext';
import { getDocExt, getDocDate, getDocSize } from '../../utils/format';
import { documentService } from '../../api/documentService';
import { API_ORIGIN } from '../../api/apiClient';

const Viewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDocumentById, deleteDocument, documents } = useDocuments();
  const [deleting, setDeleting] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [asking, setAsking] = useState(false);
  const [shareStatus, setShareStatus] = useState('');

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

  const handleShare = async () => {
    if (!doc) return;
    setShareStatus('Creating link...');
    try {
      const share = await documentService.createShareLink(doc.id, 7);
      await navigator.clipboard?.writeText(share.url);
      setShareStatus('Share link copied. It expires in 7 days.');
    } catch (err) {
      setShareStatus(err.message || 'Failed to create share link.');
    }
  };

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setAsking(true);
    setAnswer('');
    try {
      const response = await documentService.askQuestion(doc.id, question);
      setAnswer(response.answer);
    } catch (err) {
      setAnswer(err.message || 'Could not answer this question.');
    } finally {
      setAsking(false);
    }
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
            <p className="text-xs text-app-muted">{type} • {getDocSize(doc)} • Uploaded on {getDocDate(doc)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50" onClick={handleDelete} disabled={deleting}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="sm" className="gap-2" onClick={handleShare}>
            <Share2 className="h-4 w-4" /> Share
          </Button>
          <Button size="sm" className="gap-2" onClick={handleDownload}>
            <Download className="h-4 w-4" /> Download
          </Button>
        </div>
      </div>

      {doc.ai_summary ? (
        <div className="p-4 rounded-2xl bg-app-surface border border-app-border shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-3">
            <h2 className="text-lg font-semibold">AI Summary</h2>
            <span className="text-xs uppercase tracking-[0.18em] text-app-muted">Auto-generated</span>
          </div>
          <p className="text-sm leading-6 text-app-text whitespace-pre-line">
            {doc.ai_summary}
          </p>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-app-surface border border-app-border shadow-sm">
          <h2 className="text-lg font-semibold mb-2">AI Summary</h2>
          <p className="text-sm text-app-muted">No summary available yet. Upload the document to generate a summary automatically.</p>
        </div>
      )}

<div className="p-4 rounded-2xl bg-app-surface border border-app-border shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary-600" />
              Ask This Document
            </h2>
            {shareStatus && <span className="text-xs text-app-muted">{shareStatus}</span>}
          </div>
          <form onSubmit={handleAsk} className="flex flex-col sm:flex-row gap-2">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about the purpose, sections, numbers, or key points..."
              className="flex-1 rounded-lg border border-app-border bg-app-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Button type="submit" disabled={asking || !question.trim()} className="gap-2">
              {asking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Ask
            </Button>
          </form>
          {answer && (
            <p className="mt-4 text-sm leading-6 text-app-text whitespace-pre-line">
            {answer}
          </p>
        )}
      </div>

      <div className="flex-1 bg-app-surface-muted rounded-xl overflow-hidden flex flex-col relative border border-app-border shadow-sm">
        {type === 'PDF' && fileUrl ? (
          <iframe
            src={`${fileUrl}#toolbar=0&navpanes=0`}
            title={doc.title}
            className="w-full h-full border-none"
            style={{ backgroundColor: 'white' }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full space-y-4 p-12 text-center">
            <FileText className="h-20 w-20 text-app-muted" />
            <h2 className="text-xl font-bold">Preview not available for {type} files</h2>
            <p className="text-app-muted max-w-md">The online viewer currently only supports direct PDF previews. You can download the file to view it on your device.</p>
            <Button variant="secondary" onClick={handleDownload}>Download {type}</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Viewer;
