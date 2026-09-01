import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import adminService from '../../api/adminService';
import { documentService } from '../../api/documentService';
import { API_ORIGIN } from '../../api/apiClient';
import {
  Users,
  FileText,
  CheckCircle2,
  XCircle,
  Eye,
  Loader2,
  ShieldAlert,
  CheckCheck,
  FileWarning,
  BarChart3,
  HardDrive,
  Download,
  Sparkles,
  Shield,
} from 'lucide-react';
import Button from '../../components/Button';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('moderation'); // 'moderation' | 'analytics'
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingDocuments, setPendingDocuments] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [busyDocId, setBusyDocId] = useState(null);
  const [notice, setNotice] = useState({ type: 'info', text: '' });
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!notice.text) return undefined;
    const timer = window.setTimeout(() => setNotice({ type: 'info', text: '' }), 3500);
    return () => window.clearTimeout(timer);
  }, [notice.text]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [users, documents, analyticsData] = await Promise.all([
        adminService.getPendingUsers().catch(() => []),
        adminService.getPendingDocuments().catch(() => []),
        documentService.getAnalytics().catch(() => null),
      ]);
      setPendingUsers(users || []);
      setPendingDocuments(documents || []);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error(error);
      setNotice({ type: 'error', text: error.message || 'Unable to load admin data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (id) => {
    try {
      setBusyId(id);
      await adminService.approveUser(id);
      setNotice({ type: 'success', text: 'User approved successfully.' });
      await loadData();
    } catch (error) {
      console.error(error);
      setNotice({ type: 'error', text: error.message || 'Failed to approve user.' });
    } finally {
      setBusyId(null);
    }
  };

  const handleRejectUser = async (id) => {
    if (!window.confirm('Reject this user registration?')) return;

    try {
      setBusyId(id);
      await adminService.rejectUser(id);
      setNotice({ type: 'success', text: 'User request rejected.' });
      await loadData();
    } catch (error) {
      console.error(error);
      setNotice({ type: 'error', text: error.message || 'Failed to reject user.' });
    } finally {
      setBusyId(null);
    }
  };

  const handleApproveDocument = async (id) => {
    try {
      setBusyDocId(id);
      await adminService.approveDocument(id);
      setNotice({ type: 'success', text: 'Document approved and published.' });
      await loadData();
    } catch (error) {
      console.error(error);
      setNotice({ type: 'error', text: error.message || 'Failed to approve document.' });
    } finally {
      setBusyDocId(null);
    }
  };

  const handleRejectDocument = async (id) => {
    const confirmed = window.confirm('Reject this document submission?');
    if (!confirmed) return;

    const reason = window.prompt('Optional rejection reason', '') || '';
    try {
      setBusyDocId(id);
      await adminService.rejectDocument(id, reason);
      setNotice({ type: 'success', text: 'Document rejected.' });
      await loadData();
    } catch (error) {
      console.error(error);
      setNotice({ type: 'error', text: error.message || 'Failed to reject document.' });
    } finally {
      setBusyDocId(null);
    }
  };

  const stats = useMemo(() => ({
    pendingUsers: pendingUsers.length,
    pendingDocuments: pendingDocuments.length,
    totalQueue: pendingUsers.length + pendingDocuments.length,
  }), [pendingDocuments.length, pendingUsers.length]);

  if (user?.role !== 'admin') {
    return (
      <div className="rounded-3xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/40 p-10 text-center text-amber-800 dark:text-amber-300">
        <ShieldAlert className="mx-auto mb-3 h-10 w-10 text-amber-600" />
        <h2 className="text-xl font-bold">Access restricted</h2>
        <p className="mt-2 text-sm opacity-90">Only authorized administrators can access the DocSphere Moderation and Analytics Hub.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-app-border bg-app-surface p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-widest text-primary-600 bg-primary-500/10 px-2.5 py-1 rounded-full">
                Admin Control Center
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-app-text tracking-tight">System Administration</h1>
            <p className="mt-2 max-w-2xl text-app-muted text-sm leading-relaxed">
              Manage platform registrations, review document uploads, and monitor system-wide document analytics.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-app-surface-muted p-1.5 rounded-2xl border border-app-border">
            <button
              onClick={() => setActiveTab('moderation')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'moderation'
                  ? 'bg-app-surface text-primary-600 shadow-sm'
                  : 'text-app-muted hover:text-app-text'
              }`}
            >
              <Shield className="h-4 w-4" />
              <span>Moderation Queue</span>
              {stats.totalQueue > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-extrabold">
                  {stats.totalQueue}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-app-surface text-primary-600 shadow-sm'
                  : 'text-app-muted hover:text-app-text'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics & Metrics</span>
            </button>
          </div>
        </div>

        {notice.text && (
          <div className={`mt-6 rounded-2xl border px-4 py-3 text-sm flex items-center gap-2 ${
            notice.type === 'error'
              ? 'border-rose-200 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
              : 'border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
          }`}>
            {notice.type === 'success' ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <XCircle className="h-4 w-4 shrink-0" />}
            <span>{notice.text}</span>
          </div>
        )}
      </div>

      {/* Tab 1: Moderation Queue */}
      {activeTab === 'moderation' && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-app-border bg-app-surface p-5 flex items-center gap-4">
              <div className="p-3.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-app-muted uppercase">Pending Users</p>
                <p className="text-2xl font-bold text-app-text mt-0.5">{stats.pendingUsers}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-app-border bg-app-surface p-5 flex items-center gap-4">
              <div className="p-3.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-app-muted uppercase">Pending Documents</p>
                <p className="text-2xl font-bold text-app-text mt-0.5">{stats.pendingDocuments}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-app-border bg-app-surface p-5 flex items-center gap-4">
              <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-app-muted uppercase">Total Review Queue</p>
                <p className="text-2xl font-bold text-app-text mt-0.5">{stats.totalQueue}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            {/* User Moderation */}
            <div className="rounded-3xl border border-app-border bg-app-surface p-6 shadow-sm flex flex-col">
              <div className="flex items-center justify-between pb-4 border-b border-app-border">
                <div>
                  <h2 className="text-lg font-bold text-app-text">User Registrations</h2>
                  <p className="text-xs text-app-muted">Approve or reject new user account access.</p>
                </div>
                <div className="p-2 rounded-xl bg-app-surface-muted text-app-muted">
                  <Users className="h-5 w-5" />
                </div>
              </div>

              {loading ? (
                <div className="py-12 flex items-center justify-center text-app-muted text-sm">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary-600" />
                  Loading pending users...
                </div>
              ) : pendingUsers.length === 0 ? (
                <div className="my-auto py-12 text-center text-app-muted text-sm">
                  <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-emerald-500 opacity-60" />
                  <p className="font-semibold text-app-text">No pending registrations</p>
                  <p className="text-xs text-app-muted mt-1">All new user accounts are up to date.</p>
                </div>
              ) : (
                <div className="mt-4 overflow-hidden rounded-xl border border-app-border divide-y divide-app-border">
                  {pendingUsers.map((userEntry) => (
                    <div key={userEntry.id} className="p-4 flex items-center justify-between gap-4 bg-app-surface hover:bg-app-surface-muted/50 transition-colors">
                      <div>
                        <p className="text-sm font-bold text-app-text">{userEntry.username}</p>
                        <p className="text-xs text-app-muted">{userEntry.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproveUser(userEntry.id)}
                          disabled={busyId === userEntry.id}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                        >
                          {busyId === userEntry.id ? 'Working...' : 'Approve'}
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleRejectUser(userEntry.id)}
                          disabled={busyId === userEntry.id}
                          className="text-xs"
                        >
                          {busyId === userEntry.id ? 'Working...' : 'Reject'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Document Moderation */}
            <div className="rounded-3xl border border-app-border bg-app-surface p-6 shadow-sm flex flex-col">
              <div className="flex items-center justify-between pb-4 border-b border-app-border">
                <div>
                  <h2 className="text-lg font-bold text-app-text">Document Uploads</h2>
                  <p className="text-xs text-app-muted">Review document submissions before publication.</p>
                </div>
                <div className="p-2 rounded-xl bg-app-surface-muted text-app-muted">
                  <FileText className="h-5 w-5" />
                </div>
              </div>

              {loading ? (
                <div className="py-12 flex items-center justify-center text-app-muted text-sm">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary-600" />
                  Loading pending documents...
                </div>
              ) : pendingDocuments.length === 0 ? (
                <div className="my-auto py-12 text-center text-app-muted text-sm">
                  <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-emerald-500 opacity-60" />
                  <p className="font-semibold text-app-text">No pending uploads</p>
                  <p className="text-xs text-app-muted mt-1">All uploaded files have been reviewed.</p>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {pendingDocuments.map((document) => (
                    <div key={document.id} className="rounded-2xl border border-app-border bg-app-surface-muted/60 p-4">
                      <div className="flex flex-col gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm text-app-text truncate">{document.title}</h3>
                            <span className="rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 text-[10px] font-bold uppercase">
                              Pending
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-app-muted line-clamp-2">{document.description}</p>
                          <p className="mt-2 text-[10px] text-app-muted font-medium">Uploaded by: {document.username || 'User'}</p>
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-app-border/40">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setSelectedDocument(document)}
                            className="text-xs gap-1"
                          >
                            <Eye className="h-3.5 w-3.5" /> Preview
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApproveDocument(document.id)}
                            disabled={busyDocId === document.id}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                          >
                            {busyDocId === document.id ? 'Working...' : 'Approve'}
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleRejectDocument(document.id)}
                            disabled={busyDocId === document.id}
                            className="text-xs"
                          >
                            {busyDocId === document.id ? 'Working...' : 'Reject'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Analytics & Metrics */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-app-border bg-app-surface p-5">
              <p className="text-xs font-semibold text-app-muted uppercase">Total Documents</p>
              <p className="mt-2 text-3xl font-extrabold text-app-text">{analytics?.total_documents ?? 0}</p>
            </div>
            <div className="rounded-2xl border border-app-border bg-app-surface p-5">
              <p className="text-xs font-semibold text-app-muted uppercase">Public Files</p>
              <p className="mt-2 text-3xl font-extrabold text-app-text">{analytics?.public_documents ?? 0}</p>
            </div>
            <div className="rounded-2xl border border-app-border bg-app-surface p-5">
              <p className="text-xs font-semibold text-app-muted uppercase">Total Views</p>
              <p className="mt-2 text-3xl font-extrabold text-app-text">{analytics?.total_views ?? 0}</p>
            </div>
            <div className="rounded-2xl border border-app-border bg-app-surface p-5">
              <p className="text-xs font-semibold text-app-muted uppercase">Total Downloads</p>
              <p className="mt-2 text-3xl font-extrabold text-app-text">{analytics?.total_downloads ?? 0}</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-app-border bg-app-surface p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <HardDrive className="h-5 w-5 text-primary-600" />
                <h3 className="font-bold text-base text-app-text">Storage Summary</h3>
              </div>
              <div className="p-4 rounded-2xl bg-app-surface-muted border border-app-border space-y-4">
                <div>
                  <p className="text-xs text-app-muted font-semibold uppercase">Total Storage Consumed</p>
                  <p className="text-3xl font-extrabold text-app-text mt-1">
                    {((analytics?.total_storage_bytes || 0) / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <div className="w-full h-2.5 bg-app-surface rounded-full overflow-hidden border border-app-border">
                  <div className="h-full bg-gradient-to-r from-primary-500 to-indigo-600 rounded-full" style={{ width: '35%' }} />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-app-border bg-app-surface p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                <h3 className="font-bold text-base text-app-text">Top Document Activity</h3>
              </div>
              <div className="space-y-3">
                {(analytics?.top_documents || []).length > 0 ? (
                  analytics.top_documents.map((doc) => (
                    <div key={doc.id} className="p-3.5 rounded-xl border border-app-border bg-app-surface-muted flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-app-text truncate max-w-xs">{doc.title}</p>
                        <p className="text-xs text-app-muted mt-0.5">{(doc.total_views || 0)} views • {(doc.total_downloads || 0)} downloads</p>
                      </div>
                      <span className="text-xs font-semibold text-primary-600 bg-primary-500/10 px-2.5 py-1 rounded-full">
                        Active
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-app-muted text-center py-6">No activity stats available yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Document Preview */}
      {selectedDocument && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-xs px-4 py-8">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-3xl border border-app-border bg-app-surface shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-app-border px-6 py-4">
              <div>
                <h3 className="text-base font-bold text-app-text">{selectedDocument.title}</h3>
                <p className="text-xs text-app-muted">Moderation preview</p>
              </div>
              <button onClick={() => setSelectedDocument(null)} className="rounded-full p-2 text-app-muted hover:bg-app-surface-muted cursor-pointer">
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5">
              {selectedDocument.file_type?.includes('pdf') || selectedDocument.file_name?.toLowerCase().endsWith('.pdf') ? (
                <iframe
                  src={`${API_ORIGIN}${selectedDocument.file_url}`}
                  title={selectedDocument.title}
                  className="h-[70vh] w-full rounded-2xl border border-app-border bg-white"
                />
              ) : (
                <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-dashed border-app-border bg-app-surface-muted text-center text-app-muted p-8">
                  <FileWarning className="mb-3 h-10 w-10 text-amber-500" />
                  <p className="text-base font-bold text-app-text">Direct preview not available for this file format.</p>
                  <p className="mt-1 text-xs text-app-muted">You can safely approve or reject the submission based on the details.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;