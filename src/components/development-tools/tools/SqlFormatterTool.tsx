import React, { useState } from 'react';
import { format as formatSql } from 'sql-formatter';
import { CopyButton } from '../components/CopyButton';

export const SqlFormatterTool: React.FC = () => {
  const [sqlInput, setSqlInput] = useState('SELECT users.id, users.name, orders.amount FROM users INNER JOIN orders ON users.id = orders.user_id WHERE orders.status = "completed" AND orders.created_at >= "2024-01-01" ORDER BY orders.created_at DESC;');
  const [dialect, setDialect] = useState<any>('sql');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const processFormat = () => {
    setError('');
    if (!sqlInput.trim()) {
      setOutput('');
      return;
    }
    try {
      const formatted = formatSql(sqlInput, {
        language: dialect,
        keywordCase: 'upper',
      });
      setOutput(formatted);
    } catch (err: any) {
      setError(err.message || 'Error formatting SQL query');
    }
  };

  React.useEffect(() => {
    processFormat();
  }, [sqlInput, dialect]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <label className="text-xs font-medium text-slate-500">SQL Dialect:</label>
        <select
          value={dialect}
          onChange={(e) => setDialect(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-sm"
        >
          <option value="sql">Standard SQL</option>
          <option value="mysql">MySQL</option>
          <option value="postgresql">PostgreSQL</option>
          <option value="sqlite">SQLite</option>
          <option value="transactsql">T-SQL (SQL Server)</option>
          <option value="plsql">PL/SQL (Oracle)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Unformatted SQL Query</label>
          <textarea
            value={sqlInput}
            onChange={(e) => setSqlInput(e.target.value)}
            rows={12}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-xs text-slate-800 dark:text-slate-200"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-medium text-slate-500">Prettified SQL Output</label>
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
