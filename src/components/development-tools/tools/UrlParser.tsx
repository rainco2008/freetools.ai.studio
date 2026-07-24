import React, { useState } from 'react';
import { CopyButton } from '../components/CopyButton';

export const UrlParser: React.FC = () => {
  const [urlInput, setUrlInput] = useState('https://user:pass@api.example.com:8080/v1/users?category=tech&page=2#section-comments');

  let parsed: URL | null = null;
  let error = '';

  try {
    parsed = new URL(urlInput);
  } catch (err) {
    error = 'Invalid URL format';
  }

  const queryParams: { key: string; value: string }[] = [];
  if (parsed) {
    parsed.searchParams.forEach((value, key) => {
      queryParams.push({ key, value });
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
          Enter Full URL
        </label>
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="https://..."
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-sm"
        />
      </div>

      {error ? (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-sm rounded-lg">
          {error}
        </div>
      ) : parsed ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-400">Protocol</span>
              <p className="font-mono text-sm text-slate-800 dark:text-slate-100">{parsed.protocol}</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-400">Hostname</span>
              <p className="font-mono text-sm text-slate-800 dark:text-slate-100">{parsed.hostname}</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-400">Port</span>
              <p className="font-mono text-sm text-slate-800 dark:text-slate-100">{parsed.port || '(Default)'}</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-400">Pathname</span>
              <p className="font-mono text-sm text-slate-800 dark:text-slate-100">{parsed.pathname}</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-400">Hash / Fragment</span>
              <p className="font-mono text-sm text-slate-800 dark:text-slate-100">{parsed.hash || '(None)'}</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-400">Origin</span>
              <p className="font-mono text-sm text-slate-800 dark:text-slate-100">{parsed.origin}</p>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Query Parameters ({queryParams.length})</h4>
            {queryParams.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No query parameters found in URL.</p>
            ) : (
              <div className="space-y-1.5">
                {queryParams.map((param, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-900 rounded font-mono text-xs">
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{param.key}</span>
                    <span className="text-slate-700 dark:text-slate-300">{param.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
