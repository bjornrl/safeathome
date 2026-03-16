'use client';

import { useRef, useState, useCallback } from 'react';

const ACCEPTED_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
  'application/pdf',
  'audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/x-m4a',
];

const ACCEPT_STRING = '.jpg,.jpeg,.png,.webp,.gif,.pdf,.mp3,.m4a,.wav';

const MAX_FILES = 5;

interface FileWithPreview {
  file: File;
  previewUrl: string | null;
}

interface FileUploadProps {
  files: FileWithPreview[];
  setFiles: (files: FileWithPreview[]) => void;
}

function getFileIcon(type: string) {
  if (type.startsWith('audio/')) return '♫';
  if (type === 'application/pdf') return '📄';
  return '📎';
}

export type { FileWithPreview };

export function FileUpload({ files, setFiles }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const newFiles: FileWithPreview[] = [];
    const existing = files.length;
    const remaining = MAX_FILES - existing;
    const toProcess = Array.from(incoming).slice(0, remaining);

    for (const file of toProcess) {
      if (!ACCEPTED_TYPES.includes(file.type)) continue;
      const previewUrl = file.type.startsWith('image/')
        ? URL.createObjectURL(file)
        : null;
      newFiles.push({ file, previewUrl });
    }

    if (newFiles.length > 0) {
      setFiles([...files, ...newFiles]);
    }
  }, [files, setFiles]);

  const removeFile = (index: number) => {
    const updated = [...files];
    const removed = updated.splice(index, 1);
    if (removed[0]?.previewUrl) URL.revokeObjectURL(removed[0].previewUrl);
    setFiles(updated);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-text">
        Attachments <span className="text-text-light font-normal">({files.length}/{MAX_FILES})</span>
      </label>

      {files.length < MAX_FILES && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={() => setDragOver(false)}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-[var(--radius-md)] p-6 text-center cursor-pointer transition-colors ${
            dragOver
              ? 'border-accent bg-accent/5'
              : 'border-border-light hover:border-border'
          }`}
        >
          <p className="text-sm text-text-muted">
            Drop files here or <span className="text-accent font-medium">browse</span>
          </p>
          <p className="text-xs text-text-light mt-1">
            Images, PDFs, or audio files (max {MAX_FILES})
          </p>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT_STRING}
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
              e.target.value = '';
            }}
          />
        </div>
      )}

      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((f, i) => (
            <div
              key={i}
              className="relative group border border-border-light rounded-[var(--radius-sm)] overflow-hidden"
            >
              {f.previewUrl ? (
                <img
                  src={f.previewUrl}
                  alt={f.file.name}
                  className="w-20 h-20 object-cover"
                />
              ) : (
                <div className="w-20 h-20 flex flex-col items-center justify-center bg-surface-alt">
                  <span className="text-lg">{getFileIcon(f.file.type)}</span>
                  <span className="text-[10px] text-text-muted mt-1 px-1 truncate max-w-full">
                    {f.file.name.split('.').pop()?.toUpperCase()}
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                &times;
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-1 py-0.5">
                <p className="text-[9px] text-white truncate">{formatSize(f.file.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
