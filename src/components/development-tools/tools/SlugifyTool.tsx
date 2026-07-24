import React, { useState } from 'react';
import slugify from '@sindresorhus/slugify';
import { CopyButton } from '../components/CopyButton';

export const SlugifyTool: React.FC = () => {
  const [text, setText] = useState('Hello World! This is an IT Tools Example ðŸš€');
  const [separator, setSeparator] = useState('-');
  const [lowercase, setLowercase] = useState(true);

  const slug = slugify(text, {
    separator,
    lowercase,
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
            Separator
          </label>
          <input
            type="text"
            value={separator}
            onChange={(e) => setSeparator(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-mono"
          />
        </div>

        <div className="flex items-center pt-6">
          <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={lowercase}
              onChange={(e) => setLowercase(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            Lowercase Output
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
          Source Text
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="Type or paste title to slugify..."
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
        />
      </div>

      <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Generated Slug
          </span>
          <CopyButton text={slug} />
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded font-mono text-sm break-all text-slate-800 dark:text-slate-200 select-all">
          {slug}
        </div>
      </div>
    </div>
  );
};
