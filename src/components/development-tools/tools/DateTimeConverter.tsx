import React, { useState } from 'react';
import { CopyButton } from '../components/CopyButton';

export const DateTimeConverter: React.FC = () => {
  const [timestamp, setTimestamp] = useState<number>(Math.floor(Date.now() / 1000));

  const dateObj = new Date(timestamp * 1000);
  const isValid = !isNaN(dateObj.getTime());

  const nowSec = Math.floor(Date.now() / 1000);

  const formats = isValid ? [
    { label: 'Unix Timestamp (Seconds)', value: timestamp.toString() },
    { label: 'Unix Timestamp (Milliseconds)', value: (timestamp * 1000).toString() },
    { label: 'ISO 8601', value: dateObj.toISOString() },
    { label: 'UTC String', value: dateObj.toUTCString() },
    { label: 'Local String', value: dateObj.toString() },
    { label: 'Local Date String', value: dateObj.toLocaleDateString() },
    { label: 'Local Time String', value: dateObj.toLocaleTimeString() },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Unix Epoch Timestamp (Seconds)
          </label>
          <button
            onClick={() => setTimestamp(nowSec)}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded transition-colors cursor-pointer"
          >
            Set to Now
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="number"
            value={timestamp}
            onChange={(e) => setTimestamp(Number(e.target.value))}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-sm"
          />
          <input
            type="datetime-local"
            value={isValid ? new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
            onChange={(e) => {
              const val = e.target.value;
              if (val) {
                const parsed = new Date(val).getTime();
                if (!isNaN(parsed)) setTimestamp(Math.floor(parsed / 1000));
              }
            }}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
          />
        </div>
      </div>

      {isValid && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {formats.map((f) => (
            <div key={f.label} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {f.label}
                </span>
                <CopyButton text={f.value} />
              </div>
              <div className="font-mono text-xs break-all text-slate-800 dark:text-slate-200 select-all">
                {f.value}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
