import React, { useState } from 'react';
import * as jwtDecodePkg from 'jwt-decode';
import { CopyButton } from '../components/CopyButton';

const jwtDecode: any = (jwtDecodePkg as any).default || jwtDecodePkg;

const SAMPLE_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjJ9.40P_k_Z0gLzQdZ68uG37jXyG2Lp01y5m0Q-s1O39H4Y";

export const JwtParserTool: React.FC = () => {
  const [token, setToken] = useState(SAMPLE_JWT);

  let headerObj: any = null;
  let payloadObj: any = null;
  let errorMsg = '';

  if (token.trim()) {
    try {
      headerObj = jwtDecode(token.trim(), { header: true });
      payloadObj = jwtDecode(token.trim());
    } catch (err: any) {
      errorMsg = 'Invalid JWT Token format';
    }
  }

  // Calculate expiration if present
  let expDate = '';
  let isExpired = false;
  if (payloadObj && payloadObj.exp) {
    const d = new Date(payloadObj.exp * 1000);
    expDate = d.toUTCString() + ` (${d.toLocaleString()})`;
    isExpired = d.getTime() < Date.now();
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
          Paste Encoded JWT Token
        </label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          rows={3}
          placeholder="eyJhbGciOi..."
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-xs break-all"
        />
      </div>

      {errorMsg ? (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-sm rounded-lg">
          {errorMsg}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Header */}
          <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-rose-500 uppercase tracking-wider">
                Header
              </span>
              {headerObj && <CopyButton text={JSON.stringify(headerObj, null, 2)} />}
            </div>
            <pre className="p-3 bg-slate-50 dark:bg-slate-900 rounded font-mono text-xs overflow-x-auto text-slate-800 dark:text-slate-200">
              {headerObj ? JSON.stringify(headerObj, null, 2) : 'No header decoded'}
            </pre>
          </div>

          {/* Payload */}
          <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-purple-500 uppercase tracking-wider">
                Payload
              </span>
              {payloadObj && <CopyButton text={JSON.stringify(payloadObj, null, 2)} />}
            </div>
            {expDate && (
              <div className={`p-2 rounded text-xs ${isExpired ? 'bg-rose-500/10 text-rose-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                {isExpired ? 'Token Expired' : 'Token Active'} - Expiration: {expDate}
              </div>
            )}
            <pre className="p-3 bg-slate-50 dark:bg-slate-900 rounded font-mono text-xs overflow-x-auto text-slate-800 dark:text-slate-200">
              {payloadObj ? JSON.stringify(payloadObj, null, 2) : 'No payload decoded'}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
