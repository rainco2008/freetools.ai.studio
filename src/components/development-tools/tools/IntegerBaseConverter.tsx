import React, { useState } from 'react';
import { CopyButton } from '../components/CopyButton';

export const IntegerBaseConverter: React.FC = () => {
  const [val, setVal] = useState('255');
  const [fromBase, setFromBase] = useState<number>(10);

  let dec = NaN;
  try {
    dec = parseInt(val.trim(), fromBase);
  } catch {}

  const isValid = !isNaN(dec);

  const bases = [
    { name: 'Binary (Base 2)', base: 2 },
    { name: 'Octal (Base 8)', base: 8 },
    { name: 'Decimal (Base 10)', base: 10 },
    { name: 'Hexadecimal (Base 16)', base: 16 },
    { name: 'Base 32', base: 32 },
    { name: 'Base 36', base: 36 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Number Value
          </label>
          <input
            type="text"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Input Base
          </label>
          <select
            value={fromBase}
            onChange={(e) => setFromBase(Number(e.target.value))}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
          >
            {bases.map((b) => (
              <option key={b.base} value={b.base}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!isValid ? (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-sm rounded-lg">
          Invalid number for base {fromBase}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {bases.map((b) => {
            const converted = dec.toString(b.base);
            return (
              <div key={b.base} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {b.name}
                  </span>
                  <CopyButton text={converted} />
                </div>
                <div className="font-mono text-xs break-all text-slate-800 dark:text-slate-200 select-all">
                  {b.base === 16 ? converted.toUpperCase() : converted}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
