import React, { useState } from 'react';
import cronstrue from 'cronstrue';
import { CopyButton } from '../components/CopyButton';

export const CrontabGenerator: React.FC = () => {
  const [minute, setMinute] = useState('*');
  const [hour, setHour] = useState('*');
  const [dayOfMonth, setDayOfMonth] = useState('*');
  const [month, setMonth] = useState('*');
  const [dayOfWeek, setDayOfWeek] = useState('*');

  const cronExpr = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`.trim();

  let humanText = '';
  let error = '';

  try {
    humanText = cronstrue.toString(cronExpr);
  } catch (err: any) {
    error = 'Invalid cron expression format';
  }

  const presets = [
    { label: 'Every minute', val: '* * * * *' },
    { label: 'Every 5 minutes', val: '*/5 * * * *' },
    { label: 'Every hour at :00', val: '0 * * * *' },
    { label: 'Every day at midnight', val: '0 0 * * *' },
    { label: 'Every Monday at 9am', val: '0 9 * * 1' },
    { label: '1st day of every month', val: '0 0 1 * *' },
  ];

  const applyPreset = (pVal: string) => {
    const parts = pVal.split(' ');
    if (parts.length === 5) {
      setMinute(parts[0]);
      setHour(parts[1]);
      setDayOfMonth(parts[2]);
      setMonth(parts[3]);
      setDayOfWeek(parts[4]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <span className="text-xs font-medium text-slate-500 self-center">Presets:</span>
        {presets.map((p) => (
          <button
            key={p.label}
            onClick={() => applyPreset(p.val)}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs text-slate-700 dark:text-slate-300 rounded cursor-pointer"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-3 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Minute</label>
          <input
            type="text"
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
            className="w-full text-center px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border rounded font-mono text-sm"
          />
          <span className="text-[10px] text-slate-400">0-59</span>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Hour</label>
          <input
            type="text"
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            className="w-full text-center px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border rounded font-mono text-sm"
          />
          <span className="text-[10px] text-slate-400">0-23</span>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Day of Month</label>
          <input
            type="text"
            value={dayOfMonth}
            onChange={(e) => setDayOfMonth(e.target.value)}
            className="w-full text-center px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border rounded font-mono text-sm"
          />
          <span className="text-[10px] text-slate-400">1-31</span>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Month</label>
          <input
            type="text"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full text-center px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border rounded font-mono text-sm"
          />
          <span className="text-[10px] text-slate-400">1-12</span>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Day of Week</label>
          <input
            type="text"
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(e.target.value)}
            className="w-full text-center px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border rounded font-mono text-sm"
          />
          <span className="text-[10px] text-slate-400">0-6 (Sun-Sat)</span>
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Generated Cron Expression
          </span>
          <CopyButton text={cronExpr} />
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded font-mono text-lg font-bold text-slate-800 dark:text-slate-100 select-all">
          {cronExpr}
        </div>
        {error ? (
          <p className="text-xs text-rose-500 font-medium">{error}</p>
        ) : (
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {humanText}
          </p>
        )}
      </div>
    </div>
  );
};
