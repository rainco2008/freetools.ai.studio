import React, { useState, useEffect } from 'react';

export const KeycodeInfo: React.FC = () => {
  const [keyInfo, setKeyInfo] = useState<KeyboardEvent | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      setKeyInfo(e);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="space-y-6 text-center">
      {!keyInfo ? (
        <div className="p-12 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900">
          <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">
            Press any key on your keyboard...
          </p>
          <p className="text-xs text-slate-400 mt-1">
            JavaScript keyboard event info will be displayed in real time
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 inline-block shadow-lg">
            <span className="text-xs text-slate-400 uppercase tracking-widest block mb-2">Key Pressed</span>
            <span className="text-6xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
              {keyInfo.key === ' ' ? 'Space' : keyInfo.key}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-400 block mb-1">event.key</span>
              <span className="font-mono text-base font-bold text-slate-800 dark:text-slate-100">{keyInfo.key}</span>
            </div>
            <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-400 block mb-1">event.code</span>
              <span className="font-mono text-base font-bold text-slate-800 dark:text-slate-100">{keyInfo.code}</span>
            </div>
            <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-400 block mb-1">event.keyCode</span>
              <span className="font-mono text-base font-bold text-slate-800 dark:text-slate-100">{keyInfo.keyCode}</span>
            </div>
            <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-400 block mb-1">Location</span>
              <span className="font-mono text-base font-bold text-slate-800 dark:text-slate-100">{keyInfo.location}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
