import React from 'react';
import { FiDownload, FiExternalLink } from 'react-icons/fi';
import Button from '../buttons/Button';

export default function PDFViewer({
  fileUrl,
  title = 'Document Viewer',
  className = '',
}) {
  return (
    <div className={`flex flex-col border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm ${className}`}>
      {/* Viewer Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
        <h4 className="text-sm font-bold text-slate-800 dark:text-white truncate">
          {title}
        </h4>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(fileUrl, '_blank')}
            icon={FiExternalLink}
          >
            Open External
          </Button>
          <a href={fileUrl} download className="no-underline">
            <Button
              variant="primary"
              size="sm"
              icon={FiDownload}
            >
              Download
            </Button>
          </a>
        </div>
      </div>

      {/* Viewer Frame */}
      <div className="flex-1 w-full bg-slate-100 dark:bg-slate-950 aspect-[4/3] md:aspect-[16/10]">
        {fileUrl ? (
          <iframe
            src={`${fileUrl}#view=FitH`}
            title={title}
            className="w-full h-full border-none"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm">No document URL provided</span>
          </div>
        )}
      </div>
    </div>
  );
}
