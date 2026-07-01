import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import adminService from '../../api/adminService';
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
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingDocuments, setPendingDocuments] = useState([]);
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
      const [users, documents] = await Promise.all([
        adminService.getPendingUsers(),
        adminService.getPendingDocuments(),
      ]);
      setPendingUsers(users || []);
      setPendingDocuments(documents || []);
    } catch (error) {
      console.error(error);
      setNotice({ type: 'error', text: error.message || 'Unable to load moderation queue.' });
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
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-10 text-center text-amber-800">
        <ShieldAlert className="mx-auto mb-3 h-10 w-10" />
        <h2 className="text-xl font-semibold">Access restricted</h2>
        <p className="mt-2">Only administrators can review pending users and documents.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-app-border bg-app-surface p-8 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-600">Moderation Center</p>
            <h1 className="mt-2 text-3xl font-bold text-app-text">Admin Dashboard</h1>
            <p className="mt-2 max-w-2xl text-app-muted">
              Review new accounts, approve uploads, and keep the library safe before documents become visible.
            </p>
          </div>
          <div className="rounded-2xl bg-app-surface-muted p-4 text-app-muted">
            <ShieldAlert className="h-8 w-8" />
          </div>
        </div>

        {notice.text ? (
          <div className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${notice.type === 'error' ? 'border-app-border bg-app-surface-muted text-app-text' : 'border-app-border bg-app-surface-muted text-app-text'}`}>
            {notice.type === 'success' ? <CheckCircle2 className="mr-2 inline h-4 w-4" /> : <XCircle className="mr-2 inline h-4 w-4" />}
            {notice.text}
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-app-border bg-app-surface-muted p-5">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-app-muted">Pending Users</p>
            </div>
            <p className="mt-3 text-3xl font-semibold text-app-text">{stats.pendingUsers}</p>
          </div>
          <div className="rounded-2xl border border-app-border bg-app-surface-muted p-5">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-orange-600" />
              <p className="text-sm text-app-muted">Pending Documents</p>
            </div>
            <p className="mt-3 text-3xl font-semibold text-app-text">{stats.pendingDocuments}</p>
          </div>
          <div className="rounded-2xl border border-app-border bg-app-surface-muted p-5">
            <div className="flex items-center gap-3">
              <CheckCheck className="h-5 w-5 text-emerald-600" />
              <p className="text-sm text-app-muted">Items in Queue</p>
            </div>
            <p className="mt-3 text-3xl font-semibold text-app-text">{stats.totalQueue}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-app-border bg-app-surface p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-app-text">Pending Users</h2>
              <p className="text-sm text-app-muted">Approve or reject new account requests.</p>
            </div>
            <div className="rounded-full bg-app-surface-muted p-2 text-app-muted">
              <Users className="h-5 w-5" />
            </div>
          </div>

          {loading ? (
            <div className="mt-8 flex items-center justify-center py-10 text-app-muted">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading approvals...
            </div>
          ) : pendingUsers.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-app-border bg-app-surface-muted p-8 text-center text-app-muted">
              No pending user registrations.
            </div>
          ) : (
            <div className="mt-6 overflow-hidden rounded-2xl border border-app-border">
              <table className="min-w-full divide-y divide-app-border">
                <thead className="bg-app-surface-muted">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-app-muted">User</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-app-muted">Email</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-app-muted">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-app-border bg-app-surface">
                  {pendingUsers.map((userEntry) => (
                    <tr key={userEntry.id}>
                      <td className="px-4 py-3 text-sm font-medium text-app-text">{userEntry.username}</td>
                      <td className="px-4 py-3 text-sm text-app-muted">{userEntry.email}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleApproveUser(userEntry.id)}
                            disabled={busyId === userEntry.id}
                            className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {busyId === userEntry.id ? 'Working...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleRejectUser(userEntry.id)}
                            disabled={busyId === userEntry.id}
                            className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {busyId === userEntry.id ? 'Working...' : 'Reject'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-app-border bg-app-surface p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-app-text">Pending Documents</h2>
              <p className="text-sm text-app-muted">Review uploads before they are published.</p>
            </div>
            <div className="rounded-full bg-app-surface-muted p-2 text-app-muted">
              <FileText className="h-5 w-5" />
            </div>
          </div>

          {loading ? (
            <div className="mt-8 flex items-center justify-center py-10 text-app-muted">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading documents...
            </div>
          ) : pendingDocuments.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-app-border bg-app-surface-muted p-8 text-center text-app-muted">
              No documents awaiting review.
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {pendingDocuments.map((document) => (
                <div key={document.id} className="rounded-2xl border border-app-border bg-app-surface-muted p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-app-text">{document.title}</h3>
                        <span className="rounded-full bg-app-surface-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-app-muted">Pending</span>
                      </div>
                      <p className="mt-1 text-sm text-app-muted">{document.description}</p>
                      <p className="mt-2 text-xs text-app-muted">Uploaded by {document.username || 'Unknown user'}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedDocument(document)}
                        className="rounded-lg border border-app-border px-3 py-2 text-sm font-medium text-app-text transition hover:bg-app-surface-muted"
                      >
                        <Eye className="mr-2 inline h-4 w-4" /> Preview
                      </button>
                      <button
                        onClick={() => handleApproveDocument(document.id)}
                        disabled={busyDocId === document.id}
                        className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {busyDocId === document.id ? 'Working...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleRejectDocument(document.id)}
                        disabled={busyDocId === document.id}
                        className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {busyDocId === document.id ? 'Working...' : 'Reject'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedDocument ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-app-surface/70 px-4 py-8">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-3xl border border-app-border bg-app-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-app-border px-5 py-4">
              <div>
                <h3 className="text-lg font-semibold text-app-text">{selectedDocument.title}</h3>
                <p className="text-sm text-app-muted">Preview before approval</p>
              </div>
              <button onClick={() => setSelectedDocument(null)} className="rounded-full p-2 text-app-muted hover:bg-app-surface-muted">
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5">
              {selectedDocument.file_type?.includes('pdf') || selectedDocument.file_name?.toLowerCase().endsWith('.pdf') ? (
                <iframe
                  src={`${API_ORIGIN}${selectedDocument.file_url}`}
                  title={selectedDocument.title}
                  className="h-[70vh] w-full rounded-2xl border border-app-border"
                />
              ) : (
                <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-dashed border-app-border bg-app-surface-muted text-center text-app-muted">
                  <FileWarning className="mb-3 h-10 w-10" />
                  <p className="text-lg font-medium text-app-text">Preview is not available for this file type.</p>
                  <p className="mt-2 text-sm">You can still approve or reject the submission.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AdminDashboard;