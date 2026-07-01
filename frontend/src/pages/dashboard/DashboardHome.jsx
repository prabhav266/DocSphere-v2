import {
  Files,
  Clock,
  Plus,
  ArrowUpRight,
  FileText,
  FolderOpen,
  HardDrive,
} from "lucide-react";

import { Card } from "../../components/Card";
import Button from "../../components/Button";
import DocumentCard from "../../components/DocumentCard";
import { Link } from "react-router-dom";
import { useDocuments } from "../../context/DocumentContext";
import { useAuth } from "../../context/AuthContext";

const DashboardHome = () => {
  const { documents = [], loading } = useDocuments();
  const { user } = useAuth();

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

  const uniqueCategories = new Set(
    documents
      .filter((doc) => doc.category_id)
      .map((doc) => doc.category_id)
  ).size;

  const stats = [
    {
      label: "Total Files",
      value: totalFiles.toString(),
      icon: <Files className="h-6 w-6 text-app-muted" />,
      color: "bg-app-surface-muted text-app-text",
    },
    {
      label: "Categories",
      value: uniqueCategories.toString(),
      icon: <FolderOpen className="h-6 w-6 text-app-muted" />,
      color: "bg-app-surface-muted text-app-text",
    },
    {
      label: "Recent Uploads",
      value: recentUploads.toString(),
      icon: <Clock className="h-6 w-6 text-app-muted" />,
      color: "bg-app-surface-muted text-app-text",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-app-text">
            Welcome back, {displayName}!
          </h1>

          <p className="text-app-muted">
            Here&apos;s an overview of your workspace today.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Link to="/dashboard/upload">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Upload Document
            </Button>
          </Link>

          <Link to="/dashboard/pdf-library">
            <Button variant="secondary" className="gap-2">
              <FileText className="h-4 w-4" />
              View My Uploads
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                {stat.icon}
              </div>

              <div>
                <p className="text-sm text-app-muted font-medium">
                  {stat.label}
                </p>

                <p className="text-xl font-bold text-app-text">
                  {stat.value}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Recent Documents</h2>

          <Link
            to="/dashboard/library"
            className="text-sm text-primary-600 font-semibold flex items-center gap-1 hover:underline"
          >
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <p className="text-app-muted">Loading your documents...</p>
        ) : documents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {documents.slice(0, 4).map((doc) => (
              <DocumentCard key={doc.id} doc={doc} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-app-border p-8 text-center">
            <p className="font-semibold text-app-text">No documents uploaded yet.</p>
            <p className="mt-2 text-sm text-app-muted">
              Start by uploading your first document to see it appear here.
            </p>
          </div>
        )}
      </section>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <HardDrive className="h-5 w-5 text-primary-600" />
            <h3 className="font-bold">Storage Usage</h3>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-app-muted">Total Storage Used</p>
              <p className="text-3xl font-bold mt-2">{totalStorageMB} MB</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-app-muted">
                <span>Current usage</span>
                <span>{storageProgress}%</span>
              </div>
              <div className="h-2 rounded-full bg-app-surface-muted overflow-hidden">
                <div className="h-full rounded-full bg-primary-600" style={{ width: `${storageProgress}%` }} />
              </div>
            </div>

            <div className="pt-4 border-t border-app-border">
              <p className="text-sm text-app-muted">Files Stored</p>
              <p className="text-xl font-semibold">{totalFiles}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 flex flex-col justify-center items-center text-center space-y-4">
<div className="w-16 h-16 bg-app-surface-muted rounded-full flex items-center justify-center">
              <FolderOpen className="h-8 w-8 text-app-muted" />
          </div>

          <div>
            <h3 className="font-bold text-lg">Categories</h3>
            <p className="text-sm text-app-muted">
              You currently have {uniqueCategories} categories.
            </p>
          </div>

          <Button variant="secondary" className="w-full sm:w-auto" disabled>
            Manage Categories
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;