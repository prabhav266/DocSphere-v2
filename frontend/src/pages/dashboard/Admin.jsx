import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDocuments } from '../../context/DocumentContext';
import { Shield, FileText, Upload, Search, Sparkles } from 'lucide-react';
import Button from '../../components/Button';

const Admin = () => {
  const { user } = useAuth();
  const { documents } = useDocuments();

  const totalDocuments = documents.length;
  const pdfDocuments = documents.filter((doc) => doc.file_type === 'application/pdf').length;
  const publicDocuments = documents.filter((doc) => doc.visibility === 'public').length;
  const privateDocuments = totalDocuments - publicDocuments;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-primary-600 dark:text-primary-400 font-semibold">Admin</p>
            <h1 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">Admin Dashboard</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-2xl">
              Manage documents, review platform usage, and access admin tools from one page.
            </p>
          </div>
          <div className="rounded-3xl bg-primary-50 dark:bg-primary-900/20 p-4">
            <Shield className="h-10 w-10 text-primary-600 dark:text-primary-300" />
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5">
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Documents</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{totalDocuments}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5">
            <p className="text-sm text-slate-500 dark:text-slate-400">PDF Documents</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{pdfDocuments}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5">
            <p className="text-sm text-slate-500 dark:text-slate-400">Public Documents</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{publicDocuments}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5">
            <p className="text-sm text-slate-500 dark:text-slate-400">Private Documents</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{privateDocuments}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Welcome back{user?.first_name ? `, ${user.first_name}` : ''}</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Use this page to access important administration actions and high-level document metrics.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Button asChild>
                <Link to="/dashboard/library" className="w-full justify-center gap-2">
                  <FileText className="h-4 w-4" /> View Library
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to="/dashboard/upload" className="w-full justify-center gap-2">
                  <Upload className="h-4 w-4" /> Upload Document
                </Link>
              </Button>
            </div>
          </div>
          <div className="rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-primary-600 dark:text-primary-300" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Admin tools</h2>
            </div>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              This page can later be extended with document moderation, AI summary regeneration, and activity logs.
            </p>
            <div className="mt-5 space-y-3">
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
                <p className="text-sm font-medium text-slate-900 dark:text-white">Admin portal</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">A separate landing page for administrator actions and metrics.</p>
              </div>
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
                <p className="text-sm font-medium text-slate-900 dark:text-white">Document oversight</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Quickly navigate to library and upload workflows.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
