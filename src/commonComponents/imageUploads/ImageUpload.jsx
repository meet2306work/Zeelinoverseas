import React, { useRef, useState } from 'react';
import { FiImage, FiPlus, FiTrash2 } from 'react-icons/fi';

export default function ImageUpload({
  label,
  onImagesSelect,
  images = [], // Array of File objects or URL strings
  onRemoveImage,
  multiple = true,
  maxFiles = 5,
  error,
  required = false,
  className = '',
}) {
  const fileInputRef = useRef(null);
  const [localError, setLocalError] = useState('');

  const handleFileChange = (e) => {
    setLocalError('');
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);

      // Check count bounds
      if (images.length + selectedFiles.length > maxFiles) {
        setLocalError(`Maximum of ${maxFiles} images allowed`);
        return;
      }

      // Check format
      const invalidFiles = selectedFiles.filter(file => !file.type.startsWith('image/'));
      if (invalidFiles.length > 0) {
        setLocalError('Only image files are allowed');
        return;
      }

      if (onImagesSelect) {
        if (multiple) {
          onImagesSelect([...images, ...selectedFiles]);
        } else {
          onImagesSelect([selectedFiles[0]]);
        }
      }
    }
  };

  const getObjectURL = (file) => {
    if (typeof file === 'string') return file;
    try {
      return URL.createObjectURL(file);
    } catch (e) {
      return '';
    }
  };

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {images.map((img, idx) => (
          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 group">
            <img
              src={getObjectURL(img)}
              alt={`preview-${idx}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => onRemoveImage && onRemoveImage(idx)}
              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white rounded-xl"
            >
              <FiTrash2 className="h-5 w-5" />
            </button>
          </div>
        ))}

        {(multiple || images.length === 0) && images.length < maxFiles && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-teal-500 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              multiple={multiple}
              className="hidden"
            />
            <FiPlus className="h-6 w-6 text-slate-400 mb-1" />
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Upload
            </span>
          </div>
        )}
      </div>

      {(error || localError) && (
        <p className="text-xs text-red-500 font-medium mt-1">{error || localError}</p>
      )}
    </div>
  );
}
