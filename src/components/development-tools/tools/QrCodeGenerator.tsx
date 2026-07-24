import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Download } from 'lucide-react';

export const QrCodeGenerator: React.FC = () => {
  const [text, setText] = useState('https://github.com/CorentinTh/it-tools');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');

  useEffect(() => {
    if (!text.trim()) {
      setQrDataUrl('');
      return;
    }
    QRCode.toDataURL(text, {
      width: 300,
      margin: 2,
      color: {
        dark: fgColor,
        light: bgColor,
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error(err));
  }, [text, fgColor, bgColor]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
            Text / URL Content
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="Type text or URL to encode into QR code..."
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Foreground Color</label>
            <input
              type="color"
              value={fgColor}
              onChange={(e) => setFgColor(e.target.value)}
              className="w-full h-10 rounded cursor-pointer border border-slate-300 dark:border-slate-700"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Background Color</label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-full h-10 rounded cursor-pointer border border-slate-300 dark:border-slate-700"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-4">
        {qrDataUrl ? (
          <>
            <img src={qrDataUrl} alt="Generated QR Code" className="w-56 h-56 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700" />
            <a
              href={qrDataUrl}
              download="qrcode.png"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" /> Download PNG
            </a>
          </>
        ) : (
          <p className="text-sm text-slate-400 italic">Enter text to generate QR code</p>
        )}
      </div>
    </div>
  );
};
