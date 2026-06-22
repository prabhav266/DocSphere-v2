import {
  Files,
  Share2,
  Clock,
  Plus,
  ArrowUpRight,
  FileText,
  FolderOpen,
} from "lucide-react";

import { Card } from "../../components/Card";
import Button from "../../components/Button";
import DocumentCard from "../../components/DocumentCard";
import { Link } from "react-router-dom";
import { useDocuments } from "../../context/DocumentContext";
import { useAuth } from "../../context/AuthContext";

const DashboardHome = () => {
  const { documents = [] } = useDocuments();
  const { user } = useAuth();

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

  const totalStorageMB = (
    totalStorageBytes /
    (1024 * 1024)
  ).toFixed(2);

  const uniqueCategories = new Set(
    documents
      .filter((doc) => doc.category_id)
      .map((doc) => doc.category_id)
  ).size;

  const stats = [
    {
      label: "Total Files",
      value: totalFiles.toString(),
      icon: <Files className="h-6 w-6" />,
      color:
        "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "Categories",
      value: uniqueCategories.toString(),
      icon: <FolderOpen className="h-6 w-6" />,
      color:
        "text-purple-600 bg-purple-50 dark:bg-purple-900/20",
    },
    {
      label: "Recent Uploads",
      value: recentUploads.toString(),
      icon: <Clock className="h-6 w-6" />,
      color:
        "text-orange-600 bg-orange-50 dark:bg-orange-900/20",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Welcome back,{" "}
            {user?.username || "User"}!
          </h1>

          <p className="text-slate-500 dark:text-slate-400">
            Here's an overview of your workspace today.
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
            <Button
              variant="secondary"
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              View My Uploads
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="p-6"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-xl ${stat.color}`}
              >
                {stat.icon}
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {stat.label}
                </p>

                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Documents */}

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">
            Recent Documents
          </h2>

          <Link
            to="/dashboard/library"
            className="text-sm text-primary-600 font-semibold flex items-center gap-1 hover:underline"
          >
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {documents.length > 0 ? (
            documents
              .slice(0, 4)
              .map((doc) => (
                <DocumentCard
                  key={doc.id}
                  doc={doc}
                />
              ))
          ) : (
            <p className="text-slate-500">
              No documents uploaded yet.
            </p>
          )}
        </div>
      </section>

      {/* Bottom Cards */}

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="font-bold mb-4">
            Storage Usage
          </h3>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Total Storage Used
              </p>

              <p className="text-3xl font-bold mt-2">
                {totalStorageMB} MB
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-500">
                Files Stored
              </p>

              <p className="text-xl font-semibold">
                {totalFiles}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 flex flex-col justify-center items-center text-center space-y-4">
          <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
            <FolderOpen className="h-8 w-8 text-primary-600" />
          </div>

          <div>
            <h3 className="font-bold text-lg">
              Categories
            </h3>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              You currently have{" "}
              {uniqueCategories} categories.
            </p>
          </div>

          <Button variant="secondary">
            Manage Categories
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;