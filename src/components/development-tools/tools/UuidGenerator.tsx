import React, { useState } from 'react';
import { v4 as uuidv4, v1 as uuidv1 } from 'uuid';
import { CopyButton } from '../components/CopyButton';
import { RefreshCw } from 'lucide-react';

export const UuidGenerator: React.FC = () => {
  const [version, setVersion] = useState<'v4' | 'v1'>('v4');
  const [quantity, setQuantity] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [noHyphens, setNoHyphens] = useState(false);
  const [uuids, setUuids] = useState<string[]>([]);

  const generate = () => {
    const list: string[] = [];
    for (let i = 0; i < quantity; i++) {
      let id = version === 'v4' ? uuidv4() : uuidv1();
      if (noHyphens) id = id.replace(/-/g, '');
      if (uppercase) id = id.toUpperCase();
      list.push(id);
    }
    setUuids(list);
  };

  React.useEffect(() => {
    generate();
  }, [version, quantity, uppercase, noHyphens]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
            Version
          </label>
          <select
            value={version}
            onChange={(e) => setVersion(e.target.value as 'v4' | 'v1')}
            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-sm"
          >
            <option value="v4">UUID v4 (Random)</option>
            <option value="v1">UUID v1 (Timestamp)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
            Quantity ({quantity})
          </label>
          <input
            type="range"
            min={1}
            max={50}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="flex flex-col justify-center gap-1">
          <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            Uppercase
          </label>
          <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={noHyphens}
              onChange={(e) => setNoHyphens(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            Remove Hyphens
          </label>
        </div>

        <div className="flex items-end">
          <button
            onClick={generate}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" /> Regenerate
          </button>
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Generated UUIDs ({uuids.length})
          </span>
          <CopyButton text={uuids.join('\n')} label="Copy All" />
        </div>
        <div className="space-y-1.5 max-h-96 overflow-y-auto">
          {uuids.map((id, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 select-all"
            >
              <span>{id}</span>
              <CopyButton text={id} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
