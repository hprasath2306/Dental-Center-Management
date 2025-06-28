import React, { useRef } from 'react';
import { Button } from '../ui/Button';
import type { FileAttachment } from '../../types';
import { Upload, X, Download, Eye } from 'lucide-react';
import { createFileAttachment, formatFileSize, getFileIcon, isImageFile, downloadFile } from '../../utils/fileUtils';

interface FileUploadProps {
  files: FileAttachment[];
  onFilesChange: (files: FileAttachment[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

export const FileUpload: React.FC<FileUploadProps> = ({
  files,
  onFilesChange,
  maxFiles = 5,
  acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx', '.xls', '.xlsx']
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    
    if (files.length + selectedFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    try {
      const newFileAttachments = await Promise.all(
        selectedFiles.map(file => createFileAttachment(file))
      );
      
      onFilesChange([...files, ...newFileAttachments]);
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error uploading files. Please try again.');
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (fileId: string) => {
    onFilesChange(files.filter(f => f.id !== fileId));
  };

  const previewFile = (file: FileAttachment) => {
    if (isImageFile(file.type)) {
      window.open(file.url, '_blank');
    } else {
      downloadFile(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Button
          type="button"
          variant="secondary"
          icon={Upload}
          onClick={() => fileInputRef.current?.click()}
          disabled={files.length >= maxFiles}
        >
          Upload Files
        </Button>
        <span className="text-sm text-gray-500">
          {files.length} / {maxFiles} files
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={handleFileSelect}
        className="hidden"
      />

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map(file => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getFileIcon(file.type)}</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  icon={isImageFile(file.type) ? Eye : Download}
                  onClick={() => previewFile(file)}
                  title={isImageFile(file.type) ? 'Preview' : 'Download'}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  icon={X}
                  onClick={() => removeFile(file.id)}
                  className="text-red-600 hover:text-red-700"
                  title="Remove file"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-xs text-gray-500">
        Accepted file types: {acceptedTypes.join(', ')}
      </div>
    </div>
  );
};