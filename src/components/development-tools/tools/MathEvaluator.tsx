import React, { useState } from 'react';
import { evaluate } from 'mathjs';
import { CopyButton } from '../components/CopyButton';

export const MathEvaluator: React.FC = () => {
  const [expr, setExpr] = useState('sqrt(16) + 5 * sin(pi / 2)');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleEval = () => {
    setError('');
    if (!expr.trim()) {
      setResult('');
      return;
    }
    try {
      const res = evaluate(expr);
      setResult(String(res));
    } catch (err: any) {
      setError(err.message || 'Error evaluating mathematical expression');
    }
  };

  React.useEffect(() => {
    handleEval();
  }, [expr]);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
          Math Expression (Supports functions, constants, unit conversions)
        </label>
        <input
          type="text"
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          placeholder="e.g. 12.5 cm to inch, cos(45 deg), log(100)"
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-sm"
        />
      </div>

      {error ? (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-sm rounded-lg">
          {error}
        </div>
      ) : result ? (
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Evaluation Result
            </span>
            <CopyButton text={result} />
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded font-mono text-lg font-bold text-slate-800 dark:text-slate-100 select-all">
            {result}
          </div>
        </div>
      ) : null}
    </div>
  );
};
