import React, { useState } from 'react';
import { Base64 } from 'js-base64';
import { CopyButton } from '../components/CopyButton';

export const BasicAuthGenerator: React.FC = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('secret123');

  const credentials = `${username}:${password}`;
  const base64Encoded = Base64.encode(credentials);
  const headerValue = `Basic ${base64Encoded}`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
            Password
          </label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-sm"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Authorization Header Value
            </span>
            <CopyButton text={headerValue} />
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded font-mono text-sm break-all text-slate-800 dark:text-slate-200 select-all">
            {headerValue}
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Base64 Encoded (user:pass)
            </span>
            <CopyButton text={base64Encoded} />
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded font-mono text-sm break-all text-slate-800 dark:text-slate-200 select-all">
            {base64Encoded}
          </div>
        </div>
      </div>
    </div>
  );
};
