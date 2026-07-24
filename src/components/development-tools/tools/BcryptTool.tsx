import React, { useState } from 'react';
import bcrypt from 'bcryptjs';
import { CopyButton } from '../components/CopyButton';

if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
  try {
    bcrypt.setRandomFallback((len: number) => {
      const array = new Uint8Array(len);
      window.crypto.getRandomValues(array);
      return Array.from(array);
    });
  } catch {
    // Fallback already set or ignore
  }
}

export const BcryptTool: React.FC = () => {
  const [password, setPassword] = useState('mySecretPassword123');
  const [rounds, setRounds] = useState(10);
  const [hashedOutput, setHashedOutput] = useState('');

  // Verify section
  const [verifyPass, setVerifyPass] = useState('');
  const [verifyHash, setVerifyHash] = useState('');
  const [isMatch, setIsMatch] = useState<boolean | null>(null);

  const handleHash = () => {
    if (!password) return;
    const salt = bcrypt.genSaltSync(rounds);
    const hash = bcrypt.hashSync(password, salt);
    setHashedOutput(hash);
  };

  const handleVerify = () => {
    if (!verifyPass || !verifyHash) return;
    try {
      const match = bcrypt.compareSync(verifyPass, verifyHash);
      setIsMatch(match);
    } catch {
      setIsMatch(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Generate Hash */}
      <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-4">
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">Hash Password</h3>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
            Plain Text Password
          </label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
            Salt Rounds: {rounds}
          </label>
          <input
            type="range"
            min={4}
            max={14}
            value={rounds}
            onChange={(e) => setRounds(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <button
          onClick={handleHash}
          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md text-sm transition-colors cursor-pointer"
        >
          Generate Bcrypt Hash
        </button>

        {hashedOutput && (
          <div className="pt-2 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">Hash Output</span>
              <CopyButton text={hashedOutput} />
            </div>
            <div className="p-2.5 bg-slate-100 dark:bg-slate-900 rounded font-mono text-xs break-all select-all text-slate-800 dark:text-slate-200">
              {hashedOutput}
            </div>
          </div>
        )}
      </div>

      {/* Verify Hash */}
      <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-4">
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">Verify Password against Hash</h3>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
            Password to Check
          </label>
          <input
            type="text"
            value={verifyPass}
            onChange={(e) => setVerifyPass(e.target.value)}
            placeholder="e.g. mySecretPassword123"
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
            Bcrypt Hash
          </label>
          <input
            type="text"
            value={verifyHash}
            onChange={(e) => setVerifyHash(e.target.value)}
            placeholder="$2a$10$..."
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md font-mono text-sm"
          />
        </div>
        <button
          onClick={handleVerify}
          className="w-full py-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white font-medium rounded-md text-sm transition-colors cursor-pointer"
        >
          Check Match
        </button>

        {isMatch!== null && (
          <div className={`p-3 rounded-md text-sm font-medium text-center ${
            isMatch
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
          }`}>
            {isMatch? 'Ã¢Å“â€œ Password matches hash!' : 'Ã¢Å“â€¢ Password does NOT match hash.'}
          </div>
        )}
      </div>
    </div>
  );
};
