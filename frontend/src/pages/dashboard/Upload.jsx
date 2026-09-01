import React, { useState } from 'react';
import { CloudUpload, X, FileText, CheckCircle2, AlertCircle, FileCheck, ShieldAlert } from 'lucide-react';
import { Card } from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useDocuments } from '../../context/DocumentContext';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
  const { addDocument } = useDocuments();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [isDragOver, setIsDragOver] = useState(false);
  const [formError, setFormError] = useState('');
  const [feedback, setFeedback] = useState('');

  const processFiles = (selectedFiles) => {
    const validFiles = selectedFiles.filter(f => {
      const ext = f.name.split('.').pop().toLowerCase();
      return ['pdf', 'docx', 'pptx', 'txt'].includes(ext);
    });

    if (validFiles.length < selectedFiles.length) {
      setFormError("Some files were skipped. Only PDF, DOCX, PPTX, and TXT format files are supported.");
    } else {
      setFormError("");
    }

    if (validFiles.length > 0 && !title) {
      const name = validFiles[0].name.replace(/\.[^.]+$/, '');
      setTitle(name);
    }

    setFiles(prev => [...prev, ...validFiles.map(f => ({ file: f, status: 'pending' }))]);
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const startUpload = async () => {
    if (files.length === 0) return;

    if (!title.trim()) {
      setFormError('Please enter a title for the document.');
      return;
    }
    if (!description.trim()) {
      setFormError('Please enter a description for the document.');
      return;
    }
    setFormError('');
    setFeedback('');

    setIsUploading(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) { clearInterval(progressInterval); return 90; }
        return prev + 10;
      });
    }, 150);

    try {
      await Promise.all(files.map(async (fileObj, index) => {
        try {
          const fileTitle = files.length > 1 ? `${title} (${index + 1})` : title;
          await addDocument(fileObj.file, fileTitle, description, visibility);
          setFiles(prev => {
            const newFiles = [...prev];
            newFiles[index] = { ...newFiles[index], status: 'completed' };
            return newFiles;
          });
        } catch (err) {
          setFiles(prev => {
            const newFiles = [...prev];
            newFiles[index] = { ...newFiles[index], status: 'error' };
            return newFiles;
          });
          throw err;
        }
      }));

      setProgress(100);
      clearInterval(progressInterval);
      setFeedback('Document submitted successfully! Pending admin approval before indexing.');

      setTimeout(() => {
        navigate('/dashboard/pdf-library');
      }, 1500);
    } catch (error) {
      console.error("Upload failed:", error);
      setFormError("Upload issue: " + (error.message || "Failed to process files."));
      setIsUploading(false);
      clearInterval(progressInterval);
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-app-text">Upload Documents</h1>
        <p className="text-xs text-app-muted mt-1">Upload and store PDF, DOCX, PPTX, or TXT documents in your library.</p>
      </div>

      {/* Drag & Drop Card Zone */}
      <div 
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`p-10 border-2 border-dashed rounded-3xl transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer ${
          isDragOver 
            ? 'border-primary-500 bg-primary-500/10 scale-[1.01]' 
            : 'border-app-border bg-app-surface hover:border-primary-500/40 hover:bg-app-surface-muted/50'
        }`}
      >
        <div className="w-14 h-14 bg-primary-500/10 text-primary-600 rounded-2xl flex items-center justify-center mb-4 shadow-xs">
          <CloudUpload className="h-7 w-7" />
        </div>
        <h3 className="text-base font-bold text-app-text mb-1">Drag & Drop files here</h3>
        <p className="text-xs text-app-muted mb-5">Supports PDF, Word (.docx), PowerPoint (.pptx) & Text (.txt) up to 50MB</p>
        <label className="cursor-pointer">
          <input type="file" multiple className="hidden" onChange={handleFileChange} accept=".pdf,.docx,.pptx,.txt" />
          <Button variant="secondary" size="sm" as="span" className="shadow-xs font-semibold text-xs pointer-events-none">
            Browse Computer
          </Button>
        </label>
      </div>

      {files.length > 0 && (
        <Card className="p-6 space-y-6 shadow-sm border-app-border">
          <div>
            <h3 className="font-bold text-base text-app-text mb-4 pb-2 border-b border-app-border">
              Document Metadata
            </h3>
            <div className="space-y-4">
              <Input
                label="Document Title"
                placeholder="Enter title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isUploading}
                required
              />
              <div className="w-full space-y-1.5">
                <label className="text-xs font-semibold text-app-text">Description</label>
                <textarea
                  className="flex w-full rounded-xl border border-app-border bg-app-surface px-3 py-2.5 text-xs text-app-text placeholder:text-app-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/20 focus-visible:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
                  rows={3}
                  placeholder="Provide a short description of the content..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isUploading}
                  required
                />
              </div>
              <div className="w-full space-y-1.5">
                <label className="text-xs font-semibold text-app-text">Visibility Level</label>
                <select
                  className="flex h-10 w-full rounded-xl border border-app-border bg-app-surface px-3 py-2 text-xs text-app-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/20"
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  disabled={isUploading}
                >
                  <option value="public">Public (Visible to team members)</option>
                  <option value="private">Private (Only visible to you)</option>
                </select>
              </div>
            </div>
          </div>

          {formError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {feedback && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-app-text">Selected Files ({files.length})</h3>
              {!isUploading && progress < 100 && (
                <Button size="sm" onClick={startUpload} className="text-xs font-bold gap-1.5">
                  <FileCheck className="h-3.5 w-3.5" /> Upload All Files
                </Button>
              )}
            </div>

            <div className="space-y-2.5">
              {files.map((fileObj, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-app-surface-muted/60 rounded-xl border border-app-border">
                  <div className="p-2 rounded-lg bg-primary-500/10 text-primary-600">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-app-text truncate">{fileObj.file.name}</p>
                    <p className="text-[10px] text-app-muted">{(fileObj.file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  {fileObj.status === 'completed' ? (
                    <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                      <CheckCircle2 className="h-4 w-4" /> Uploaded
                    </div>
                  ) : fileObj.status === 'error' ? (
                    <div className="flex items-center gap-1 text-rose-500 text-xs font-bold">
                      <AlertCircle className="h-4 w-4" /> Failed
                    </div>
                  ) : isUploading ? (
                    <div className="w-20 h-1.5 bg-app-surface rounded-full overflow-hidden border border-app-border">
                      <div className="h-full bg-primary-600 transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                  ) : (
                    <button onClick={() => removeFile(index)} className="p-1 hover:bg-app-surface rounded-md text-app-muted hover:text-rose-500 transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {isUploading && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs font-semibold text-app-muted">
                  <span>Uploading files to cloud...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-2 bg-app-surface-muted rounded-full overflow-hidden border border-app-border">
                  <div className="h-full bg-gradient-to-r from-primary-500 to-indigo-600 transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Upload;
