import React, { useState } from 'react';
import { Base64 } from 'js-base64';
import { CopyButton } from '../components/CopyButton';

export const Base64StringConverter: React.FC = () => {
  const [text, setText] = useState('Hello World!');
  const [urlSafe, setUrlSafe] = useState(false);

  let encoded = '';
  let decoded = '';

  try {
    encoded = urlSafe ? Base64.encodeURI(text) : Base64.encode(text);
  } catch {}

  try {
    decoded = Base64.decode(text);
  } catch {}

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="urlSafe"
          checked={urlSafe}
          onChange={(e) => setUrlSafe(e.target.checked)}
          className="rounded text-emerald-600 focus:ring-emerald-500"
        />
        <label htmlFor="urlSafe" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          URL-Safe Base64 Encoding
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
          Input Text / Base64
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="Type or paste text..."
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Encoded */}
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Encoded Base64
            </span>
            <CopyButton text={encoded} />
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded font-mono text-xs break-all text-slate-800 dark:text-slate-200 min-h-24 select-all">
            {encoded}
          </div>
        </div>

        {/* Decoded */}
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Decoded Plaintext
            </span>
            <CopyButton text={decoded} />
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded font-mono text-xs break-all text-slate-800 dark:text-slate-200 min-h-24 select-all">
            {decoded || <span className="italic text-slate-400">(Not a valid base64 input)</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
