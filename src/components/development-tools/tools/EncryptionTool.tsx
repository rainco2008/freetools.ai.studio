import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { CopyButton } from '../components/CopyButton';

type Algo = 'AES' | 'TripleDES' | 'RC4' | 'Rabbit';

export const EncryptionTool: React.FC = () => {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [algo, setAlgo] = useState<Algo>('AES');
  const [input, setInput] = useState('Secret text payload');
  const [secretKey, setSecretKey] = useState('my-secret-key-123');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleProcess = () => {
    setError('');
    if (!input || !secretKey) {
      setResult('');
      return;
    }

    try {
      if (mode === 'encrypt') {
        let ciphertext = '';
        if (algo === 'AES') ciphertext = CryptoJS.AES.encrypt(input, secretKey).toString();
        else if (algo === 'TripleDES') ciphertext = CryptoJS.TripleDES.encrypt(input, secretKey).toString();
        else if (algo === 'RC4') ciphertext = CryptoJS.RC4.encrypt(input, secretKey).toString();
        else if (algo === 'Rabbit') ciphertext = CryptoJS.Rabbit.encrypt(input, secretKey).toString();
        setResult(ciphertext);
      } else {
        let bytes;
        if (algo === 'AES') bytes = CryptoJS.AES.decrypt(input, secretKey);
        else if (algo === 'TripleDES') bytes = CryptoJS.TripleDES.decrypt(input, secretKey);
        else if (algo === 'RC4') bytes = CryptoJS.RC4.decrypt(input, secretKey);
        else if (algo === 'Rabbit') bytes = CryptoJS.Rabbit.decrypt(input, secretKey);

        const plaintext = bytes?.toString(CryptoJS.enc.Utf8);
        if (!plaintext && input.length > 0) {
          setError('Decryption failed. Invalid ciphertext or incorrect secret key.');
          setResult('');
        } else {
          setResult(plaintext || '');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Error executing operation');
      setResult('');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-4 border-b border-slate-200 dark:border-slate-700 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setMode('encrypt'); setResult(''); setError(''); }}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
              mode === 'encrypt'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            Encrypt
          </button>
          <button
            onClick={() => { setMode('decrypt'); setResult(''); setError(''); }}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
              mode === 'decrypt'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            Decrypt
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Algorithm:</label>
          <select
            value={algo}
            onChange={(e) => setAlgo(e.target.value as Algo)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-sm"
          >
            <option value="AES">AES</option>
            <option value="TripleDES">TripleDES</option>
            <option value="RC4">RC4</option>
            <option value="Rabbit">Rabbit</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
            {mode === 'encrypt' ? 'Plaintext Input' : 'Ciphertext Input'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
            Passphrase / Secret Key
          </label>
          <input
            type="text"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-sm mb-4"
          />
          <button
            onClick={handleProcess}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm transition-colors cursor-pointer"
          >
            {mode === 'encrypt' ? 'Encrypt Text' : 'Decrypt Text'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-sm rounded-lg">
          {error}
        </div>
      )}

      {result && (
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              {mode === 'encrypt' ? 'Encrypted Output (Base64)' : 'Decrypted Output'}
            </span>
            <CopyButton text={result} />
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded font-mono text-sm break-all select-all text-slate-800 dark:text-slate-200 max-h-60 overflow-y-auto">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};
