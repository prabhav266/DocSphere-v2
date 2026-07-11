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
  const date = new Date(doc.created_at);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0];
};

export const getDocSize = (doc) => {
  const bytes = Number(doc.file_size) || 0;
  if (bytes <= 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;

  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  return `${(bytes / 1024).toFixed(1)} KB`;
};

export const getDocSizeMB = (doc) => (Number(doc.file_size) || 0) / (1024 * 1024);
