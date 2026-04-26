import React, { useState, useCallback } from 'react';
import { cn } from '../../lib/utils';
import { Upload, FileSpreadsheet, X } from 'lucide-react';

const DropZone = ({ onFileDrop, accept = '.csv,.xlsx,.xls', className }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      onFileDrop?.(droppedFile);
    }
  }, [onFileDrop]);

  const handleFileInput = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      onFileDrop?.(selectedFile);
    }
  }, [onFileDrop]);

  const removeFile = () => {
    setFile(null);
    onFileDrop?.(null);
  };

  return (
    <div className={cn('w-full', className)}>
      {!file ? (
        <label
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'flex flex-col items-center justify-center w-full h-48 rounded-xl cursor-pointer transition-all duration-300',
            'border-2 border-dashed',
            isDragging
              ? 'border-ceylon-gold bg-ceylon-gold-50 scale-[1.01]'
              : 'border-gray-300 bg-gray-50/50 hover:border-ceylon-maroon/40 hover:bg-ceylon-maroon-50/30'
          )}
        >
          <div className="flex flex-col items-center gap-3 pointer-events-none">
            <div className={cn(
              'p-3 rounded-full transition-colors',
              isDragging ? 'bg-ceylon-gold-100' : 'bg-gray-100'
            )}>
              <Upload className={cn(
                'h-6 w-6 transition-colors',
                isDragging ? 'text-ceylon-gold-600' : 'text-gray-400'
              )} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">
                {isDragging ? 'Drop your file here' : 'Drag & drop your file here'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                or <span className="text-ceylon-maroon font-medium">browse</span> to upload
              </p>
              <p className="text-xs text-gray-400 mt-1">CSV, XLS, XLSX files supported</p>
            </div>
          </div>
          <input
            type="file"
            accept={accept}
            onChange={handleFileInput}
            className="hidden"
          />
        </label>
      ) : (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50">
          <div className="p-2 rounded-lg bg-emerald-50">
            <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
            <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
          <button
            onClick={removeFile}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export { DropZone };
