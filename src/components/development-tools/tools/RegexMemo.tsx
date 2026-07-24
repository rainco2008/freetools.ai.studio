import React, { useState } from 'react';
import { CopyButton } from '../components/CopyButton';

export const RegexMemo: React.FC = () => {
  const [pattern, setPattern] = useState('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [flags, setFlags] = useState('g');
  const [testText, setTestText] = useState('Contact us at support@example.com or sales@company.org!');

  let matches: string[] = [];
  let error = '';

  if (pattern) {
    try {
      const regex = new RegExp(pattern, flags);
      const m = testText.match(regex);
      if (m) matches = Array.from(m);
    } catch (e: any) {
      error = e.message;
    }
  }

  const cheatSheet = [
    { token: '.', desc: 'Any character except newline' },
    { token: '\\d', desc: 'Digit [0-9]' },
    { token: '\\w', desc: 'Word character [a-zA-Z0-9_]' },
    { token: '\\s', desc: 'Whitespace character' },
    { token: '^', desc: 'Start of string' },
    { token: '$', desc: 'End of string' },
    { token: '*', desc: '0 or more occurrences' },
    { token: '+', desc: '1 or more occurrences' },
    { token: '?', desc: '0 or 1 occurrence (optional)' },
    { token: '{n,m}', desc: 'Between n and m occurrences' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="md:col-span-3">
          <label className="block text-xs font-medium text-slate-500 mb-1">Regex Pattern</label>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Flags</label>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            placeholder="g, i, m..."
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
          Test String
        </label>
        <textarea
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
        />
      </div>

      {error ? (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-sm rounded-lg font-mono">
          Regex Error: {error}
        </div>
      ) : (
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Matches Found ({matches.length})
          </span>
          <div className="flex flex-wrap gap-2 pt-2">
            {matches.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No matches found.</p>
            ) : (
              matches.map((m, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded font-mono text-xs">
                  {m}
                </span>
              ))
            )}
          </div>
        </div>
      )}

      {/* Cheatsheet */}
      <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Regex Quick Cheatsheet</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {cheatSheet.map((item) => (
            <div key={item.token} className="p-2 bg-slate-50 dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-800 text-center">
              <span className="block font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">{item.token}</span>
              <span className="text-[10px] text-slate-500">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
