import React, { useRef, useState } from 'react';
import { UploadCloud, File, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';

interface FileUploadProps {
  label: string;
  helperText?: string;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
  files: File[];
  onChange: (files: File[]) => void;
  required?: boolean;
  error?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  helperText,
  accept = '.pdf,.jpg,.jpeg,.png',
  multiple = false,
  maxFiles = 5,
  maxSizeMB = 10,
  files,
  onChange,
  required = false,
  error,
}) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming || incoming.length === 0) return;
    setInternalError(null);

    const newFiles = Array.from(incoming);

    // Validate size
    for (const f of newFiles) {
      if (f.size > maxSizeMB * 1024 * 1024) {
        setInternalError(`File "${f.name}" exceeds the ${maxSizeMB}MB limit.`);
        return;
      }
    }

    if (multiple) {
      const combined = [...files, ...newFiles].slice(0, maxFiles);
      if (files.length + newFiles.length > maxFiles) {
        setInternalError(`Maximum ${maxFiles} files allowed.`);
      }
      onChange(combined);
    } else {
      onChange([newFiles[0]]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleRemove = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    onChange(updated);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-stone-800 dark:text-stone-200">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {helperText && (
          <span className="text-xs text-stone-500 dark:text-stone-400">
            {helperText}
          </span>
        )}
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          dragOver
            ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40'
            : error || internalError
            ? 'border-red-400 bg-red-50/50 dark:bg-red-950/20'
            : 'border-stone-300 dark:border-stone-700 hover:border-emerald-500 bg-stone-50/50 dark:bg-stone-900/40'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline">
              {t('upload.clickToUpload')}
            </span>{' '}
            {t('upload.dragDrop')}
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {t('upload.supported')} ({t('upload.max')}: {maxSizeMB}MB{multiple ? `, up to ${maxFiles} ${t('upload.files')}` : ''})
          </p>
        </div>
      </div>

      {(error || internalError) && (
        <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1.5 mt-1 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error || internalError}</span>
        </p>
      )}

      {/* Selected file list */}
      {files.length > 0 && (
        <div className="space-y-2 pt-2">
          {files.map((file, idx) => (
            <div
              key={`${file.name}-${idx}`}
              className="flex items-center justify-between p-3 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-xs"
            >
              <div className="flex items-center gap-2.5 truncate max-w-[80%]">
                <File className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-medium text-stone-800 dark:text-stone-200 truncate">
                  {file.name}
                </span>
                <span className="text-stone-400 shrink-0">
                  ({formatSize(file.size)})
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(idx);
                }}
                className="text-stone-400 hover:text-red-600 dark:hover:text-red-400 p-1 rounded transition-colors"
                aria-label={`Remove file ${file.name}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
