import React, { useState } from 'react';
import { paramCase, camelCase, snakeCase, headerCase, constantCase, pathCase, dotCase } from 'change-case';
import { CopyButton } from '../components/CopyButton';

export const CaseConverter: React.FC = () => {
  const [text, setText] = useState('hello world example string');

  const cases = [
    { label: 'camelCase', value: camelCase(text) },
    { label: 'snake_case', value: snakeCase(text) },
    { label: 'kebab-case', value: paramCase(text) },
    { label: 'CONSTANT_CASE', value: constantCase(text) },
    { label: 'Header-Case', value: headerCase(text) },
    { label: 'path/case', value: pathCase(text) },
    { label: 'dot.case', value: dotCase(text) },
    { label: 'UPPERCASE', value: text.toUpperCase() },
    { label: 'lowercase', value: text.toLowerCase() },
  ];

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
          placeholder="Enter text to convert case..."
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {cases.map((c) => (
          <div key={c.label} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {c.label}
              </span>
              <CopyButton text={c.value} />
            </div>
            <div className="font-mono text-xs break-all text-slate-800 dark:text-slate-200 select-all">
              {c.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
