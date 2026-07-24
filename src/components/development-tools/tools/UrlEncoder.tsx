import React, { useState } from 'react';
import { CopyButton } from '../components/CopyButton';

export const UrlEncoder: React.FC = () => {
  const [text, setText] = useState('https://example.com/search?q=hello world & test=123');

  let encodedUri = '';
  let encodedComponent = '';
  let decoded = '';

  try {
    encodedUri = encodeURI(text);
    encodedComponent = encodeURIComponent(text);
  } catch {}

  try {
    decoded = decodeURIComponent(text);
  } catch {}

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
          Input URL / String
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="Paste URL to encode or decode..."
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-sm"
        />
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Encode Component (Full Escaping)
            </span>
            <CopyButton text={encodedComponent} />
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded font-mono text-xs break-all text-slate-800 dark:text-slate-200 select-all">
            {encodedComponent}
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Encode URI (Preserves URL structure)
            </span>
            <CopyButton text={encodedUri} />
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded font-mono text-xs break-all text-slate-800 dark:text-slate-200 select-all">
            {encodedUri}
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              Decoded URL / Plaintext
            </span>
            <CopyButton text={decoded} />
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded font-mono text-xs break-all text-slate-800 dark:text-slate-200 select-all">
            {decoded}
          </div>
        </div>
      </div>
    </div>
  );
};
