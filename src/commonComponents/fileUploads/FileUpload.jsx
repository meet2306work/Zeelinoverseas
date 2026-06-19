import React, { useRef, useState } from 'react';
import { FiUploadCloud, FiFile, FiTrash2 } from 'react-icons/fi';

export default function FileUpload({
  label,
  accept = '.pdf,.doc,.docx,.xls,.xlsx',
  maxSizeMB = 10,
  onFileSelect,
  selectedFile,
  onClear,
  error,
  required = false,
  className = '',
}) {
  const fileInputRef = useRef(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [localError, setLocalError] = useState('');

  const processFile = (file) => {
    setLocalError('');
    if (!file) return;

    // Check size limit
    if (file.size > maxSizeMB * 1024 * 1024) {
      setLocalError(`File exceeds maximum size of ${maxSizeMB}MB`);
      return;
    }

    if (onFileSelect) onFileSelect(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {!selectedFile ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 bg-white dark:bg-slate-900/40
            ${isDragActive 
              ? 'border-teal-500 bg-teal-50/20 dark:bg-teal-950/10' 
              : 'border-slate-300 hover:border-teal-500 dark:border-slate-800'
            }
          `}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={accept}
            className="hidden"
          />
          <FiUploadCloud className="h-9 w-9 text-slate-400 dark:text-slate-600 mb-2.5" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Click to upload or drag & drop
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500">
            Accepts {accept.replaceAll('.', '').toUpperCase()} up to {maxSizeMB}MB
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-4.5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg p-2 bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400">
              <FiFile className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px] sm:max-w-xs">
                {selectedFile.name}
              </p>
              <p className="text-xs text-slate-500">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClear}
            className="rounded-lg p-2 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <FiTrash2 className="h-5 w-5" />
          </button>
        </div>
      )}

      {(error || localError) && (
        <p className="text-xs text-red-500 font-medium">{error || localError}</p>
      )}
    </div>
  );
}
