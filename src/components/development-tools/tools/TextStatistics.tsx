import React, { useState } from 'react';
import { CopyButton } from '../components/CopyButton';

export const TextStatistics: React.FC = () => {
  const [text, setText] = useState('Type or paste your text here to analyze characters, words, sentences, reading time, and byte size.');

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const sentenceCount = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0;
  const lineCount = text ? text.split('\n').length : 0;
  const byteSize = new Blob([text]).size;
  const readingTimeMin = Math.ceil(wordCount / 200);

  const stats = [
    { label: 'Characters', val: charCount.toLocaleString() },
    { label: 'Words', val: wordCount.toLocaleString() },
    { label: 'Sentences', val: sentenceCount.toLocaleString() },
    { label: 'Lines', val: lineCount.toLocaleString() },
    { label: 'Byte Size', val: `${byteSize.toLocaleString()} Bytes` },
    { label: 'Est. Reading Time', val: `~${readingTimeMin} min` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
          Source Text
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder="Type or paste text..."
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              {s.label}
            </span>
            <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
              {s.val}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
