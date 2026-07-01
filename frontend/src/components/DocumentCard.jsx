import React from 'react';
import { FileText, MoreVertical, Calendar, HardDrive } from 'lucide-react';
import { Card } from './Card';
import { cn } from '../utils/cn';
import { Link } from 'react-router-dom';
import { getDocExt, getDocDate, getDocSize } from '../utils/format';

const DocumentCard = ({ doc, view = 'grid' }) => {
  const isGrid = view === 'grid';
  const type = getDocExt(doc);
  const date = getDocDate(doc);
  const size = getDocSize(doc);
  const summary = doc.ai_summary || doc.description || '';
  const tags = Array.isArray(doc.tags) ? doc.tags.slice(0, 3) : [];
  const status = (doc.status || 'approved').toLowerCase();
  const canOpen = status === 'approved';

  const getTypeColor = (type) => {
    switch (type) {
      case 'PDF': return 'text-app-muted bg-app-surface-muted';
      case 'DOCX': return 'text-app-muted bg-app-surface-muted';
      case 'PPTX': return 'text-app-muted bg-app-surface-muted';
      default: return 'text-app-muted bg-app-surface-muted';
    }
  };

  const getStatusStyles = () => {
    switch (status) {
      case 'approved': return 'bg-app-surface-muted text-app-text border border-app-border';
      case 'pending': return 'bg-app-surface-muted text-app-text border border-app-border';
      case 'rejected': return 'bg-app-surface-muted text-app-text border border-app-border';
      default: return 'bg-app-surface-muted text-app-muted';
    }
  };

  const statusText = status === 'approved' ? 'Approved' : status === 'pending' ? 'Pending Review' : 'Rejected';
  const content = (
    <>
      <div className={cn('p-2 rounded-lg shrink-0', getTypeColor(type))}>
        <FileText className="h-6 w-6" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold text-app-text truncate">{doc.title}</h4>
          <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide', getStatusStyles())}>{statusText}</span>
        </div>
        {summary ? (
          <p className="text-sm text-app-muted mb-2 overflow-hidden text-ellipsis" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {summary}
          </p>
        ) : null}
        <div className="flex items-center gap-4 mt-1 flex-wrap">
          <span className="text-xs text-app-muted flex items-center gap-1"><Calendar className="h-3 w-3" /> {date}</span>
          <span className="text-xs text-app-muted flex items-center gap-1"><HardDrive className="h-3 w-3" /> {size}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-app-surface-muted text-app-muted font-medium">
            {type}
          </span>
          {tags.map((tag) => (
            <span key={tag} className="hidden md:inline-flex text-[10px] px-2 py-0.5 rounded-full bg-app-surface-muted text-app-muted">
              {tag}
            </span>
          ))}
        </div>
        {status === 'rejected' && doc.rejection_reason ? (
          <p className="mt-2 text-xs text-app-muted">Reason: {doc.rejection_reason}</p>
        ) : null}
      </div>
    </>
  );

  if (!isGrid) {
    if (canOpen) {
      return (
        <Link to={`/dashboard/viewer/${doc.id}`} className="flex items-center gap-4 p-4 bg-app-surface border border-app-border rounded-xl hover:shadow-md transition-shadow">
          {content}
          <button className="p-2 rounded-full hover:bg-app-surface-muted transition-colors" onClick={(e) => e.preventDefault()}>
            <MoreVertical className="h-5 w-5 text-app-muted" />
          </button>
        </Link>
      );
    }

    return (
      <div className="flex items-center gap-4 p-4 bg-app-surface border border-app-border rounded-xl opacity-80">
        {content}
        <span className="text-xs font-medium text-app-muted">Awaiting review</span>
      </div>
    );
  }

  const cardBody = (
    <Card className={cn('group hover:shadow-lg transition-all overflow-hidden border-app-border', !canOpen && 'opacity-80')}>
      <div className="aspect-4/3 bg-app-surface-muted flex items-center justify-center relative border-b border-app-border">
        <div className={cn('p-4 rounded-xl', getTypeColor(type))}>
          <FileText className="h-12 w-12" />
        </div>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 bg-app-surface rounded-md border border-app-border shadow-sm" onClick={(e) => e.preventDefault()}>
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h4 className="font-semibold text-app-text truncate">{doc.title}</h4>
          <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide', getStatusStyles())}>{statusText}</span>
        </div>
        {summary ? (
          <p className="text-sm text-app-muted overflow-hidden text-ellipsis mb-2" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', whiteSpace: 'normal' }}>
            {summary}
          </p>
        ) : null}
        <div className="flex items-center justify-between">
          <span className="text-xs text-app-muted">{date}</span>
          <span className="text-xs font-medium text-app-muted uppercase">{type}</span>
        </div>
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-app-surface-muted text-app-muted">
                {tag}
              </span>
            ))}
          </div>
        )}
        {status === 'rejected' && doc.rejection_reason ? (
          <p className="mt-2 text-xs text-app-muted">Reason: {doc.rejection_reason}</p>
        ) : null}
      </div>
    </Card>
  );

  return canOpen ? <Link to={`/dashboard/viewer/${doc.id}`}>{cardBody}</Link> : <div>{cardBody}</div>;
};

export default DocumentCard;
