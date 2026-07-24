import React, { useState } from 'react';
import { Netmask } from 'netmask';
import { CopyButton } from '../components/CopyButton';

export const Ipv4SubnetCalculator: React.FC = () => {
  const [cidr, setCidr] = useState('192.168.1.1/24');

  let block: Netmask | null = null;
  let error = '';

  try {
    block = new Netmask(cidr.trim());
  } catch (e: any) {
    error = 'Invalid IP or CIDR block format (e.g. 10.0.0.1/16)';
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
          IP Address & CIDR Mask
        </label>
        <input
          type="text"
          value={cidr}
          onChange={(e) => setCidr(e.target.value)}
          placeholder="192.168.1.1/24"
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-sm"
        />
      </div>

      {error ? (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-sm rounded-lg">
          {error}
        </div>
      ) : block ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: 'Subnet Mask', val: block.mask },
            { label: 'Network Address', val: block.base },
            { label: 'Broadcast Address', val: block.broadcast },
            { label: 'First Host IP', val: block.first },
            { label: 'Last Host IP', val: block.last },
            { label: 'Total Usable Hosts', val: block.size.toLocaleString() },
            { label: 'Bitmask Prefix', val: `/${block.bitmask}` },
          ].map((item) => (
            <div key={item.label} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {item.label}
                </span>
                <CopyButton text={item.val.toString()} />
              </div>
              <div className="font-mono text-sm text-slate-800 dark:text-slate-100 font-medium">
                {item.val}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};
