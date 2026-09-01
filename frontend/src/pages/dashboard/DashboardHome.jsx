import {
  Files,
  Clock,
  Plus,
  ArrowUpRight,
  FileText,
  FolderOpen,
  HardDrive,
  Sparkles,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import { Card } from "../../components/Card";
import Button from "../../components/Button";
import DocumentCard from "../../components/DocumentCard";
import { Link, useNavigate } from "react-router-dom";
import { useDocuments } from "../../context/DocumentContext";
import { useAuth } from "../../context/AuthContext";

const DashboardHome = () => {
  const { documents = [], loading } = useDocuments();
  const { user } = useAuth();
  const navigate = useNavigate();

  const displayName = user?.full_name || user?.name || user?.username || "User";
  const totalFiles = documents.length;

  const recentUploads = documents.filter((doc) => {
    if (!doc.created_at) return false;
    const uploadDate = new Date(doc.created_at);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return uploadDate >= sevenDaysAgo;
  }).length;

  const totalStorageBytes = documents.reduce(
    (sum, doc) => sum + (doc.file_size || 0),
    0
  );

  const totalStorageMB = (totalStorageBytes / (1024 * 1024)).toFixed(2);
  const storageProgress = totalFiles === 0 ? 0 : Math.min(100, Math.round((totalStorageBytes / (1024 * 1024 * 100)) * 100));

  const pdfCount = documents.filter((d) => d.file_type?.includes('pdf') || d.file_name?.toLowerCase().endsWith('.pdf')).length;
  const wordCount = documents.filter((d) => d.file_type?.includes('word') || d.file_name?.toLowerCase().endsWith('.docx')).length;

  const stats = [
    {
      label: "Total Documents",
      value: totalFiles.toString(),
      subtext: `${pdfCount} PDFs, ${wordCount} Word docs`,
      icon: <Files className="h-6 w-6" />,
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/30",
    },
    {
      label: "Recent Activity",
      value: recentUploads.toString(),
      subtext: "Uploaded in last 7 days",
      icon: <Clock className="h-6 w-6" />,
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30",
    },
    {
      label: "Cloud Storage",
      value: `${totalStorageMB} MB`,
      subtext: `${storageProgress}% of tier quota`,
      icon: <HardDrive className="h-6 w-6" />,
      color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/30",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-white/20 backdrop-blur-xs text-white">
              DocSphere Pro
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {displayName}!
          </h1>
          <p className="text-white/80 text-sm mt-1 max-w-xl leading-relaxed">
            Your personal document hub. Upload files, extract AI summaries, and perform instant full-text searches.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-3 relative z-10 shrink-0">
          <Link to="/dashboard/upload">
            <Button className="bg-white text-primary-700 hover:bg-slate-100 shadow-md font-bold text-sm gap-2">
              <Plus className="h-4 w-4" />
              Upload Document
            </Button>
          </Link>
          <Link to="/dashboard/pdf-library">
            <Button variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20 text-sm gap-2">
              <FileText className="h-4 w-4" />
              My PDFs
            </Button>
          </Link>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 border-app-border">
            <div className="flex items-center gap-4">
              <div className={`p-3.5 rounded-2xl border ${stat.color} shrink-0`}>
                {stat.icon}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-app-muted font-bold uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-2xl font-extrabold text-app-text mt-0.5 truncate">
                  {stat.value}
                </p>
                <p className="text-xs text-app-muted mt-1 font-medium truncate">
                  {stat.subtext}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Documents Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-app-text">Recent Documents</h2>
            <p className="text-xs text-app-muted">Recently uploaded or accessed files in your repository.</p>
          </div>

          <Link
            to="/dashboard/library"
            className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 hover:underline"
          >
            View All Library
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="py-16 text-center text-app-muted text-sm">Loading your workspace documents...</div>
        ) : documents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {documents.slice(0, 4).map((doc) => (
              <DocumentCard key={doc.id} doc={doc} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-app-border p-10 text-center bg-app-surface-muted/40">
            <FolderOpen className="h-12 w-12 text-app-muted/60 mx-auto mb-3" />
            <p className="font-bold text-app-text">No documents uploaded yet</p>
            <p className="mt-1 text-xs text-app-muted max-w-sm mx-auto">
              Start building your knowledge base by uploading PDF, DOCX, PPTX, or TXT documents.
            </p>
            <Link to="/dashboard/upload" className="inline-block mt-4">
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" /> Upload First Document
              </Button>
            </Link>
          </div>
        )}
      </section>

      {/* Usage & Overview Breakdown */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Storage Card */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-app-border/80 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-primary-500/10 text-primary-600">
                <HardDrive className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-app-text">Storage Quota</h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              Active Tier
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-xs text-app-muted font-medium">Used Space</p>
                <p className="text-3xl font-extrabold text-app-text mt-1">{totalStorageMB} <span className="text-base font-normal text-app-muted">MB</span></p>
              </div>
              <span className="text-xs font-bold text-primary-600">{storageProgress}% used</span>
            </div>

            <div className="w-full h-3 rounded-full bg-app-surface-muted border border-app-border overflow-hidden p-0.5">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-indigo-600 transition-all duration-500" 
                style={{ width: `${Math.max(storageProgress, 3)}%` }} 
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-app-border/80 text-xs">
              <div>
                <span className="text-app-muted">Total Files</span>
                <p className="font-bold text-app-text text-sm mt-0.5">{totalFiles}</p>
              </div>
              <div>
                <span className="text-app-muted">Max Limit</span>
                <p className="font-bold text-app-text text-sm mt-0.5">100 MB (Free)</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Filter & Explore Card */}
        <Card className="p-6 flex flex-col justify-between space-y-6">
          <div className="flex items-center gap-2.5 border-b border-app-border/80 pb-4">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <FolderOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-app-text">Quick Library Filters</h3>
            </div>
          </div>

          <p className="text-xs text-app-muted leading-relaxed">
            Quickly jump to targeted categories or search across AI document summaries.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" size="sm" onClick={() => navigate('/dashboard/pdf-library')} className="justify-center gap-2 text-xs">
              <FileText className="h-3.5 w-3.5 text-rose-500" /> Filter PDFs
            </Button>
            <Button variant="secondary" size="sm" onClick={() => navigate('/dashboard/search')} className="justify-center gap-2 text-xs">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" /> AI Search
            </Button>
          </div>

          <div className="p-3.5 rounded-2xl bg-app-surface-muted/60 border border-app-border flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
            <p className="text-[11px] text-app-muted leading-tight">
              All documents uploaded are secured and processed with automatic AI indexing.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;