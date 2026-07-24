import React, { useState } from 'react';
import { CopyButton } from '../components/CopyButton';

export const JsonFormatter: React.FC = () => {
  const [jsonInput, setJsonInput] = useState('{"name":"IT Tools","version":1,"features":["crypto","converters","formatters"],"active":true}');
  const [indent, setIndent] = useState(2);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const format = () => {
    setError('');
    if (!jsonInput.trim()) {
      setOutput('');
      return;
    }
    try {
      const parsed = JSON.parse(jsonInput);
      setOutput(JSON.stringify(parsed, null, indent));
    } catch (err: any) {
      setError(`JSON Parse Error: ${err.message}`);
      setOutput('');
    }
  };

  const minify = () => {
    setError('');
    if (!jsonInput.trim()) return;
    try {
      const parsed = JSON.parse(jsonInput);
      setOutput(JSON.stringify(parsed));
    } catch (err: any) {
      setError(`JSON Parse Error: ${err.message}`);
      setOutput('');
    }
  };

  React.useEffect(() => {
    format();
  }, [jsonInput, indent]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <label className="text-xs font-medium text-slate-500">Indent Spaces:</label>
          <select
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-sm"
          >
            <option value={2}>2 Spaces</option>
            <option value={4}>4 Spaces</option>
            <option value={8}>8 Spaces</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={format}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-md transition-colors cursor-pointer"
          >
            Prettify
          </button>
          <button
            onClick={minify}
            className="px-4 py-1.5 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white font-medium text-xs rounded-md transition-colors cursor-pointer"
          >
            Minify
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">JSON Input</label>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            rows={12}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-xs text-slate-800 dark:text-slate-200"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-medium text-slate-500">Formatted JSON Output</label>
            {output && <CopyButton text={output} />}
          </div>
          {error ? (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs rounded-lg font-mono">
              {error}
            </div>
          ) : (
            <textarea
              readOnly
              value={output}
              rows={12}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-xs text-slate-800 dark:text-slate-200 select-all"
            />
          )}
        </div>
      </div>
    </div>
  );
};
