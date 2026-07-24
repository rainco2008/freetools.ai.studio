import React from 'react';
import UAParser from 'ua-parser-js';
import { CopyButton } from '../components/CopyButton';

export const DeviceInformation: React.FC = () => {
  const ua = new UAParser().getResult();

  const info = [
    { label: 'Screen Resolution', val: `${window.screen.width} x ${window.screen.height}` },
    { label: 'Window Inner Size', val: `${window.innerWidth} x ${window.innerHeight}` },
    { label: 'Device Pixel Ratio', val: `${window.devicePixelRatio}x` },
    { label: 'Browser', val: `${ua.browser.name || 'Unknown'} ${ua.browser.version || ''}` },
    { label: 'Operating System', val: `${ua.os.name || 'Unknown'} ${ua.os.version || ''}` },
    { label: 'CPU Architecture', val: ua.cpu.architecture || 'Unknown' },
    { label: 'User Agent String', val: navigator.userAgent },
    { label: 'Language', val: navigator.language },
    { label: 'Online Status', val: navigator.onLine ? 'Online' : 'Offline' },
    { label: 'Timezone', val: Intl.DateTimeFormat().resolvedOptions().timeZone },
    { label: 'Hardware Concurrency (Cores)', val: navigator.hardwareConcurrency?.toString() || 'N/A' },
    { label: 'Max Touch Points', val: navigator.maxTouchPoints?.toString() || '0' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {info.map((item) => (
          <div key={item.label} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {item.label}
              </span>
              <CopyButton text={item.val} />
            </div>
            <div className="font-mono text-xs break-all text-slate-800 dark:text-slate-100 select-all font-medium">
              {item.val}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
