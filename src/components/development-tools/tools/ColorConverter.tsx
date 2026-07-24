import React, { useState } from 'react';
import { colord, extend } from 'colord';
import namesPlugin from 'colord/plugins/names';
import cmykPlugin from 'colord/plugins/cmyk';
import { CopyButton } from '../components/CopyButton';

extend([namesPlugin, cmykPlugin]);

export const ColorConverter: React.FC = () => {
  const [colorInput, setColorInput] = useState('#10b981');

  const c = colord(colorInput);
  const isValid = c.isValid();

  const colorFormats = isValid ? [
    { name: 'HEX', value: c.toHex() },
    { name: 'RGB', value: c.toRgbString() },
    { name: 'HSL', value: c.toHslString() },
    { name: 'CMYK', value: c.toCmykString() },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={isValid ? c.toHex() : '#000000'}
            onChange={(e) => setColorInput(e.target.value)}
            className="w-12 h-12 rounded cursor-pointer border-0 bg-transparent"
          />
          <div
            className="w-16 h-12 rounded-lg border border-slate-300 dark:border-slate-600 shadow-inner"
            style={{ backgroundColor: isValid ? c.toHex() : 'transparent' }}
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-slate-500 mb-1">Color Input (HEX, RGB, HSL, Name)</label>
          <input
            type="text"
            value={colorInput}
            onChange={(e) => setColorInput(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-mono"
          />
        </div>
      </div>

      {!isValid ? (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-sm rounded-lg">
          Invalid color format string.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {colorFormats.map((f) => (
            <div key={f.name} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {f.name}
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
