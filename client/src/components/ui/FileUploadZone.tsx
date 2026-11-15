import React, { useRef, useState } from 'react'
import { UploadCloud, FileText, Image as ImageIcon, X } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface FileUploadZoneProps {
  label?: string
  accept?: string
  maxSizeMB?: number
  onFilesSelected: (files: File[]) => void
  helperText?: string
  error?: string
  multiple?: boolean
  className?: string
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  label,
  accept = 'image/*,.pdf',
  maxSizeMB = 10,
  onFilesSelected,
  helperText,
  error,
  multiple = false,
  className,
}) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    processFiles(files)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      processFiles(files)
    }
  }

  const processFiles = (files: File[]) => {
    const validFiles = files.filter((f) => f.size <= maxSizeMB * 1024 * 1024)
    setSelectedFiles((prev) => (multiple ? [...prev, ...validFiles] : validFiles))
    onFilesSelected(validFiles)
  }

  const removeFile = (index: number) => {
    const updated = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(updated)
    onFilesSelected(updated)
  }

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all cursor-pointer',
          isDragOver
            ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20'
            : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/50',
          error && 'border-rose-400 bg-rose-50/30'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-slate-800 dark:text-indigo-400">
          <UploadCloud className="h-6 w-6" />
        </div>

        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
          Click to upload <span className="font-normal text-slate-500">or drag and drop</span>
        </p>
        <p className="mt-1 text-2xs text-slate-400">
          PDF, JPG, PNG, WebP up to {maxSizeMB}MB
        </p>
      </div>

      {error && <p className="mt-1.5 text-xs font-medium text-rose-500">{error}</p>}
      {helperText && !error && <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>}

      {selectedFiles.length > 0 && (
        <div className="mt-3 space-y-2">
          {selectedFiles.map((file, idx) => (
            <div
              key={`${file.name}-${idx}`}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center gap-2.5 truncate">
                {file.type.includes('image') ? (
                  <ImageIcon className="h-4 w-4 text-indigo-500 shrink-0" />
                ) : (
                  <FileText className="h-4 w-4 text-indigo-500 shrink-0" />
                )}
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {file.name}
                </span>
                <span className="text-2xs text-slate-400">
                  ({(file.size / (1024 * 1024)).toFixed(1)} MB)
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(idx)
                }}
                className="text-slate-400 hover:text-rose-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
