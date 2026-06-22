// Shared helpers to normalize document fields coming from the backend
// Backend returns: file_type (mime), created_at, file_size (bytes), title, description

export const getDocExt = (doc) => {
  if (doc.file_name) {
    const parts = doc.file_name.split('.');
    if (parts.length > 1) return parts.pop().toUpperCase();
  }
  if (doc.file_type) {
    if (doc.file_type.includes('pdf')) return 'PDF';
    if (doc.file_type.includes('word') || doc.file_type.includes('docx')) return 'DOCX';
    if (doc.file_type.includes('presentation') || doc.file_type.includes('pptx')) return 'PPTX';
    if (doc.file_type.includes('text')) return 'TXT';
  }
  return 'FILE';
};

export const getDocDate = (doc) => {
  if (!doc.created_at) return '';
  return new Date(doc.created_at).toISOString().split('T')[0];
};

export const getDocSize = (doc) => {
  if (!doc.file_size) return '0 KB';
  const mb = doc.file_size / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  return `${(doc.file_size / 1024).toFixed(1)} KB`;
};

export const getDocSizeMB = (doc) => (doc.file_size || 0) / (1024 * 1024);
