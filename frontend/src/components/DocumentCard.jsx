import React from 'react';
import { FileText, MoreVertical, Calendar, HardDrive, ShieldCheck, Clock, XCircle, ArrowUpRight } from 'lucide-react';
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

  const getTypeStyles = (type) => {
    switch (type) {
      case 'PDF':
        return {
          bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/30',
          badge: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
          bannerGradient: 'from-rose-500/10 via-rose-500/5 to-transparent',
        };
      case 'DOCX':
        return {
          bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/30',
          badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300',
          bannerGradient: 'from-indigo-500/10 via-indigo-500/5 to-transparent',
        };
      case 'PPTX':
        return {
          bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/30',
          badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
          bannerGradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
        };
      case 'TXT':
        return {
          bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30',
          badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
          bannerGradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
        };
      default:
        return {
          bg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-900/30',
          badge: 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300',
          bannerGradient: 'from-sky-500/10 via-sky-500/5 to-transparent',
        };
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
            <ShieldCheck className="h-3 w-3" /> Approved
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
            <Clock className="h-3 w-3" /> Pending Review
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50">
            <XCircle className="h-3 w-3" /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const typeStyles = getTypeStyles(type);

  if (!isGrid) {
    const listContent = (
      <div className={cn(
        "flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-app-surface border border-app-border rounded-xl transition-all duration-200 group hover:border-primary-500/40 hover:shadow-md",
        !canOpen && "opacity-80"
      )}>
        <div className={cn('p-3 rounded-xl border shrink-0 flex items-center justify-center', typeStyles.bg)}>
          <FileText className="h-6 w-6" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-app-text group-hover:text-primary-600 transition-colors truncate">
              {doc.title}
            </h4>
            {getStatusBadge()}
          </div>
          {summary && (
            <p className="text-sm text-app-muted line-clamp-1 mb-2">
              {summary}
            </p>
          )}
          <div className="flex items-center gap-4 text-xs text-app-muted flex-wrap">
            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {date}</span>
            <span className="flex items-center gap-1"><HardDrive className="h-3.5 w-3.5" /> {size}</span>
            <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider', typeStyles.badge)}>
              {type}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          {canOpen && (
            <span className="text-xs text-primary-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
              View <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          )}
        </div>
      </div>
    );

    return canOpen ? (
      <Link to={`/dashboard/viewer/${doc.id}`} className="block">
        {listContent}
      </Link>
    ) : (
      <div>{listContent}</div>
    );
  }

  const cardBody = (
    <Card className={cn(
      'group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden border-app-border relative flex flex-col h-full bg-app-surface',
      !canOpen && 'opacity-85'
    )}>
      {/* Top Banner / Visual Header */}
      <div className={cn('aspect-16/9 bg-gradient-to-br flex items-center justify-center relative border-b border-app-border/80 overflow-hidden', typeStyles.bannerGradient)}>
        <div className={cn('p-4 rounded-2xl border backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 shadow-sm', typeStyles.bg)}>
          <FileText className="h-10 w-10" />
        </div>

        <div className="absolute top-3 left-3">
          <span className={cn('text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs', typeStyles.badge)}>
            {type}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          {getStatusBadge()}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h4 className="font-bold text-base text-app-text group-hover:text-primary-600 transition-colors line-clamp-1 mb-1.5">
            {doc.title}
          </h4>
          {summary ? (
            <p className="text-xs text-app-muted line-clamp-2 leading-relaxed">
              {summary}
            </p>
          ) : (
            <p className="text-xs text-app-muted/60 italic">No description available</p>
          )}
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {tags.map((tag) => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-app-surface-muted border border-app-border text-app-muted font-medium">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="pt-3 border-t border-app-border/60 flex items-center justify-between text-xs text-app-muted">
          <span className="flex items-center gap-1 font-medium">
            <Calendar className="h-3.5 w-3.5 text-app-muted/80" /> {date}
          </span>
          <span className="flex items-center gap-1 font-semibold">
            <HardDrive className="h-3.5 w-3.5 text-app-muted/80" /> {size}
          </span>
        </div>
      </div>
    </Card>
  );

  return canOpen ? (
    <Link to={`/dashboard/viewer/${doc.id}`} className="block h-full">
      {cardBody}
    </Link>
  ) : (
    <div className="h-full">{cardBody}</div>
  );
};

export default DocumentCard;
