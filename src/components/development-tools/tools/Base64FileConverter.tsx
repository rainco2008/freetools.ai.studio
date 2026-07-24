import React, { useState } from 'react';
import { Upload, File } from 'lucide-react';
import { CopyButton } from '../components/CopyButton';

export const Base64FileConverter: React.FC = () => {
  const [fileData, setFileData] = useState<{
    name: string;
    size: number;
    type: string;
    base64: string;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFileData({
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        base64: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors">
        <input
          type="file"
          id="fileInput"
          onChange={handleFileChange}
          className="hidden"
        />
        <label
          htmlFor="fileInput"
          className="flex flex-col items-center justify-center cursor-pointer gap-2"
        >
          <Upload className="w-8 h-8 text-emerald-500" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Click to upload a file or drag & drop
          </span>
          <span className="text-xs text-slate-400">Any file type (Images, PDF, Documents)</span>
        </label>
      </div>

      {fileData && (
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <File className="w-6 h-6 text-emerald-500" />
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{fileData.name}</p>
                <p className="text-xs text-slate-400">
                  {fileData.type} â€¢ {(fileData.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <CopyButton text={fileData.base64} label="Copy Data URI" />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Data URI / Base64 Output
            </label>
            <textarea
              readOnly
              value={fileData.base64}
              rows={5}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md font-mono text-xs break-all select-all text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>
      )}
    </div>
  );
};
