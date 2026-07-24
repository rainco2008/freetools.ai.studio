import React, { useState } from 'react';
import { CopyButton } from '../components/CopyButton';

export const ChmodCalculator: React.FC = () => {
  const [owner, setOwner] = useState({ r: true, w: true, x: true });
  const [group, setGroup] = useState({ r: true, w: false, x: true });
  const [others, setOthers] = useState({ r: true, w: false, x: true });

  const calcDigit = (p: { r: boolean; w: boolean; x: boolean }) =>
    (p.r ? 4 : 0) + (p.w ? 2 : 0) + (p.x ? 1 : 0);

  const calcSymbolic = (p: { r: boolean; w: boolean; x: boolean }) =>
    `${p.r ? 'r' : '-'}${p.w ? 'w' : '-'}${p.x ? 'x' : '-'}`;

  const octal = `${calcDigit(owner)}${calcDigit(group)}${calcDigit(others)}`;
  const symbolic = `${calcSymbolic(owner)}${calcSymbolic(group)}${calcSymbolic(others)}`;
  const command = `chmod ${octal} filename`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Owner */}
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Owner (User)</h4>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={owner.r}
              onChange={(e) => setOwner({ ...owner, r: e.target.checked })}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            Read (4)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={owner.w}
              onChange={(e) => setOwner({ ...owner, w: e.target.checked })}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            Write (2)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={owner.x}
              onChange={(e) => setOwner({ ...owner, x: e.target.checked })}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            Execute (1)
          </label>
        </div>

        {/* Group */}
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Group</h4>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={group.r}
              onChange={(e) => setGroup({ ...group, r: e.target.checked })}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            Read (4)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={group.w}
              onChange={(e) => setGroup({ ...group, w: e.target.checked })}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            Write (2)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={group.x}
              onChange={(e) => setGroup({ ...group, x: e.target.checked })}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            Execute (1)
          </label>
        </div>

        {/* Others */}
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Others</h4>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={others.r}
              onChange={(e) => setOthers({ ...others, r: e.target.checked })}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            Read (4)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={others.w}
              onChange={(e) => setOthers({ ...others, w: e.target.checked })}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            Write (2)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={others.x}
              onChange={(e) => setOthers({ ...others, x: e.target.checked })}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            Execute (1)
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">Octal Notation</span>
            <CopyButton text={octal} />
          </div>
          <p className="font-mono text-xl font-bold text-emerald-600 dark:text-emerald-400">{octal}</p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">Symbolic Notation</span>
            <CopyButton text={symbolic} />
          </div>
          <p className="font-mono text-xl font-bold text-blue-600 dark:text-blue-400">{symbolic}</p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">Chmod Command</span>
            <CopyButton text={command} />
          </div>
          <p className="font-mono text-sm font-semibold text-slate-800 dark:text-slate-100">{command}</p>
        </div>
      </div>
    </div>
  );
};
