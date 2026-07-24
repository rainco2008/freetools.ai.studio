import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { CopyButton } from '../components/CopyButton';

export const HmacGenerator: React.FC = () => {
  const [text, setText] = useState('Message to authenticate');
  const [secret, setSecret] = useState('secret-key');

  const hmacs = [
    { name: 'HMAC-MD5', value: CryptoJS.HmacMD5(text, secret).toString() },
    { name: 'HMAC-SHA1', value: CryptoJS.HmacSHA1(text, secret).toString() },
    { name: 'HMAC-SHA256', value: CryptoJS.HmacSHA256(text, secret).toString() },
    { name: 'HMAC-SHA512', value: CryptoJS.HmacSHA512(text, secret).toString() },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
            Plaintext Message
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
            Secret Key
          </label>
          <textarea
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-sm"
          />
        </div>
      </div>

      <div className="space-y-3">
        {hmacs.map((h) => (
          <div key={h.name} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                {h.name}
              </span>
              <CopyButton text={h.value} />
            </div>
            <div className="font-mono text-xs break-all text-slate-800 dark:text-slate-200 select-all">
              {h.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
