import React, { useState, useEffect, useMemo } from 'react';
import {
  Download,
  Share2,
  FileText,
  ArrowLeft,
  Trash2,
  Loader2,
  Send,
  MessageSquare,
  Sparkles,
  User,
  CheckCircle2,
  AlertCircle
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
  const { getDocumentById, deleteDocument, documents, loading: docsLoading } = useDocuments();
  
  const [deleting, setDeleting] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [asking, setAsking] = useState(false);
  const [shareStatus, setShareStatus] = useState('');

  const doc = useMemo(() => getDocumentById(id), [id, getDocumentById]);

  useEffect(() => {
    if (!doc && !docsLoading && documents.length > 0) {
      navigate('/dashboard/library');
    }
  }, [doc, docsLoading, documents, navigate]);

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
    setShareStatus('Generating shareable link...');
    try {
      const share = await documentService.createShareLink(doc.id, 7);
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(share.url);
        setShareStatus('Link copied to clipboard! (Valid for 7 days)');
      } else {
        setShareStatus(`Link: ${share.url}`);
      }
      setTimeout(() => setShareStatus(''), 4000);
    } catch (err) {
      setShareStatus(err.message || 'Failed to create share link.');
      setTimeout(() => setShareStatus(''), 4000);
    }
  };

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim() || asking) return;

    const userQuestion = question.trim();
    setQuestion('');
    setMessages(prev => [...prev, { sender: 'user', text: userQuestion }]);
    setAsking(true);

    try {
      const response = await documentService.askQuestion(doc.id, userQuestion);
      setMessages(prev => [...prev, { sender: 'ai', text: response.answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: err.message || 'Could not process question for this document.', isError: true }]);
    } finally {
      setAsking(false);
    }
  };

  if (docsLoading || (!doc && documents.length === 0)) {
    return (
      <div className="h-[calc(100vh-140px)] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="h-10 w-10 text-primary-600 animate-spin" />
        <p className="text-sm text-app-muted font-medium">Loading document viewer...</p>
      </div>
    );
  }

  if (!doc) return null;

  const type = getDocExt(doc);
  const fileUrl = doc.file_url ? `${API_ORIGIN}${doc.file_url}` : null;

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-app-surface border border-app-border shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="shrink-0">
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
          </Button>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-app-text truncate">{doc.title}</h1>
            <p className="text-xs text-app-muted flex items-center gap-2">
              <span className="font-semibold text-primary-600 uppercase">{type}</span> • {getDocSize(doc)} • Uploaded {getDocDate(doc)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30" 
            onClick={handleDelete} 
            disabled={deleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="sm" className="gap-2 text-xs" onClick={handleShare}>
            <Share2 className="h-3.5 w-3.5" /> Share
          </Button>
          <Button size="sm" className="gap-2 text-xs" onClick={handleDownload}>
            <Download className="h-3.5 w-3.5" /> Download
          </Button>
        </div>
      </div>

      {shareStatus && (
        <div className="p-3 rounded-xl bg-primary-500/10 border border-primary-500/30 text-primary-600 text-xs font-medium flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {shareStatus}
        </div>
      )}

      {/* Grid Layout: Left Document Viewer / Right AI Assistant & Details */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Document Preview Pane */}
        <div className="lg:col-span-7 bg-app-surface border border-app-border rounded-2xl overflow-hidden shadow-xs flex flex-col min-h-[500px] lg:min-h-[650px]">
          {type === 'PDF' && fileUrl ? (
            <iframe
              src={`${fileUrl}#toolbar=0&navpanes=0`}
              title={doc.title}
              className="w-full flex-1 border-none bg-white"
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-app-surface-muted/40">
              <div className="p-4 rounded-2xl bg-app-surface border border-app-border shadow-xs mb-4">
                <FileText className="h-16 w-16 text-app-muted" />
              </div>
              <h3 className="text-lg font-bold text-app-text">Online Viewer Preview</h3>
              <p className="text-xs text-app-muted max-w-sm mt-1 leading-relaxed">
                Direct in-browser preview is natively supported for PDF documents. Download the file to view full formatted content.
              </p>
              <Button variant="secondary" size="sm" className="mt-4 gap-2" onClick={handleDownload}>
                <Download className="h-4 w-4" /> Download {type} File
              </Button>
            </div>
          )}
        </div>

        {/* Right Pane: AI Summary & Interactive Q&A Assistant */}
        <div className="lg:col-span-5 space-y-6 flex flex-col">
          {/* AI Summary Card */}
          <div className="p-5 rounded-2xl bg-app-surface border border-app-border shadow-xs">
            <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-app-border/80">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary-600" />
                <h2 className="text-sm font-bold text-app-text">AI Document Summary</h2>
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-600">
                Indexed
              </span>
            </div>
            <p className="text-xs leading-relaxed text-app-text/90 whitespace-pre-line">
              {doc.ai_summary || doc.description || "No summary available for this document."}
            </p>
          </div>

          {/* Interactive AI Chat Box */}
          <div className="p-5 rounded-2xl bg-app-surface border border-app-border shadow-xs flex-1 flex flex-col justify-between space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-app-border/80">
              <MessageSquare className="h-4 w-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-app-text">Ask This Document</h2>
            </div>

            {/* Chat Messages Thread */}
            <div className="flex-1 max-h-72 overflow-y-auto space-y-3 pr-1">
              {messages.length === 0 ? (
                <div className="py-8 text-center text-app-muted text-xs">
                  <Sparkles className="h-6 w-6 text-primary-500/60 mx-auto mb-2" />
                  <p className="font-semibold text-app-text">Have a question about this file?</p>
                  <p className="mt-1 text-app-muted">Ask anything about key facts, numbers, or sections.</p>
                </div>
              ) : (
                messages.map((m, idx) => (
                  <div key={idx} className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {m.sender === 'ai' && (
                      <div className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles className="h-3.5 w-3.5" />
                      </div>
                    )}
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[85%] ${
                      m.sender === 'user' 
                        ? 'bg-primary-600 text-white rounded-br-none' 
                        : m.isError 
                        ? 'bg-rose-500/10 text-rose-600 border border-rose-200 dark:border-rose-900/40 rounded-bl-none'
                        : 'bg-app-surface-muted text-app-text border border-app-border rounded-bl-none'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                ))
              )}

              {asking && (
                <div className="flex gap-2.5 items-center text-xs text-app-muted">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  </div>
                  <span className="italic">Analyzing document...</span>
                </div>
              )}
            </div>

            {/* Question Input Form */}
            <form onSubmit={handleAsk} className="flex gap-2 pt-2 border-t border-app-border/80">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type your question..."
                disabled={asking}
                className="flex-1 rounded-xl border border-app-border bg-app-surface px-3 py-2 text-xs text-app-text outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
              <Button type="submit" size="sm" disabled={asking || !question.trim()} className="gap-1.5 shrink-0 text-xs">
                {asking ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                Ask
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Viewer;
