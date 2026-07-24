import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { CopyButton } from '../components/CopyButton';

export const HashGenerator: React.FC = () => {
  const [text, setText] = useState('Hello, World!');

  const hashes = [
    { name: 'MD5', value: CryptoJS.MD5(text).toString() },
    { name: 'SHA-1', value: CryptoJS.SHA1(text).toString() },
    { name: 'SHA-256', value: CryptoJS.SHA256(text).toString() },
    { name: 'SHA-512', value: CryptoJS.SHA512(text).toString() },
    { name: 'SHA-224', value: CryptoJS.SHA224(text).toString() },
    { name: 'SHA-384', value: CryptoJS.SHA384(text).toString() },
    { name: 'SHA3 (512)', value: CryptoJS.SHA3(text, { outputLength: 512 }).toString() },
    { name: 'RIPEMD-160', value: CryptoJS.RIPEMD160(text).toString() },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
          Input String
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="Type or paste content to hash..."
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
        />
      </div>

      <div className="space-y-3">
        {hashes.map((h) => (
          <div key={h.name} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                {h.name}
              </span>
              <CopyButton text={h.value} />
            </div>
            <div className="font-mono text-xs break-all text-slate-800 dark:text-slate-200 select-all">
              {h.value || <span className="italic text-slate-400">Empty hash</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
