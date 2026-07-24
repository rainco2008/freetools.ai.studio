import React, { useState } from 'react';
import { CopyButton } from '../components/CopyButton';

export const HtmlEntitiesTool: React.FC = () => {
  const [text, setText] = useState('<div class="example">Hello & Welcome!</div>');

  const encodeHtml = (str: string) => {
    return str.replace(/[\u00A0-\u9999<>&"']/g, (i) => `&#${i.charCodeAt(0)};`);
  };

  const decodeHtml = (str: string) => {
    const doc = new DOMParser().parseFromString(str, 'text/html');
    return doc.documentElement.textContent || '';
  };

  const encoded = encodeHtml(text);
  const decoded = decodeHtml(text);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
          Input String
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="Type or paste HTML or entities..."
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Encoded HTML Entities
            </span>
            <CopyButton text={encoded} />
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded font-mono text-xs break-all text-slate-800 dark:text-slate-200 min-h-24 select-all">
            {encoded}
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Decoded Plain Text
            </span>
            <CopyButton text={decoded} />
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded font-mono text-xs break-all text-slate-800 dark:text-slate-200 min-h-24 select-all">
            {decoded}
          </div>
        </div>
      </div>
    </div>
  );
};
