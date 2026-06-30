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
  const summary = doc.ai_summary || doc.description || "";
  const tags = Array.isArray(doc.tags) ? doc.tags.slice(0, 3) : [];

  const getTypeColor = (type) => {
    switch (type) {
      case 'PDF': return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      case 'DOCX': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'PPTX': return 'text-orange-500 bg-orange-50 dark:bg-orange-900/20';
      default: return 'text-slate-500 bg-slate-50 dark:bg-slate-900/20';
    }
  };

  if (!isGrid) {
    return (
      <Link to={`/dashboard/viewer/${doc.id}`} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:shadow-md transition-shadow">
        <div className={cn("p-2 rounded-lg shrink-0", getTypeColor(type))}>
          <FileText className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-900 dark:text-white truncate">{doc.title}</h4>
          {summary ? (
            <p className="text-sm text-slate-500 mb-2 overflow-hidden text-ellipsis" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {summary}
            </p>
          ) : null}
          <div className="flex items-center gap-4 mt-1">
            <span className="text-xs text-slate-500 flex items-center gap-1"><Calendar className="h-3 w-3" /> {date}</span>
            <span className="text-xs text-slate-500 flex items-center gap-1"><HardDrive className="h-3 w-3" /> {size}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
              {type}
            </span>
            {tags.map((tag) => (
              <span key={tag} className="hidden md:inline-flex text-[10px] px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full" onClick={(e) => e.preventDefault()}>
          <MoreVertical className="h-5 w-5 text-slate-400" />
        </button>
      </Link>
    );
  }

  return (
    <Link to={`/dashboard/viewer/${doc.id}`}>
      <Card className="group hover:shadow-lg transition-all overflow-hidden border-slate-200 dark:border-slate-800">
        <div className="aspect-4/3 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center relative border-b border-slate-100 dark:border-slate-800">
          <div className={cn("p-4 rounded-xl", getTypeColor(type))}>
            <FileText className="h-12 w-12" />
          </div>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1.5 bg-white dark:bg-slate-700 shadow-sm rounded-md border border-slate-200 dark:border-slate-600" onClick={(e) => e.preventDefault()}>
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="p-4">
          <h4 className="font-semibold text-slate-900 dark:text-white truncate mb-1">{doc.title}</h4>
          {summary ? (
            <p className="text-sm text-slate-500 overflow-hidden text-ellipsis mb-2" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', whiteSpace: 'normal' }}>
              {summary}
            </p>
          ) : null}
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">{date}</span>
            <span className="text-xs font-medium text-slate-400 uppercase">{type}</span>
          </div>
          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
};

export default DocumentCard;
