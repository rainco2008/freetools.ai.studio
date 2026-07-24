import React, { useState } from 'react';

export const PercentageCalculator: React.FC = () => {
  // Case 1: What is X% of Y?
  const [percent1, setPercent1] = useState(15);
  const [value1, setValue1] = useState(200);
  const result1 = (percent1 / 100) * value1;

  // Case 2: X is what percent of Y?
  const [value2a, setValue2a] = useState(30);
  const [value2b, setValue2b] = useState(150);
  const result2 = value2b !== 0 ? (value2a / value2b) * 100 : 0;

  // Case 3: Percentage change from X to Y
  const [fromVal, setFromVal] = useState(100);
  const [toVal, setToVal] = useState(125);
  const result3 = fromVal !== 0 ? ((toVal - fromVal) / fromVal) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Case 1 */}
      <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">What is X% of Y?</h4>
        <div className="flex flex-wrap items-center gap-3">
          <span>What is</span>
          <input
            type="number"
            value={percent1}
            onChange={(e) => setPercent1(Number(e.target.value))}
            className="w-24 px-2 py-1 bg-slate-50 dark:bg-slate-900 border rounded font-mono text-sm"
          />
          <span>% of</span>
          <input
            type="number"
            value={value1}
            onChange={(e) => setValue1(Number(e.target.value))}
            className="w-28 px-2 py-1 bg-slate-50 dark:bg-slate-900 border rounded font-mono text-sm"
          />
          <span>=</span>
          <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400 text-base">{result1}</span>
        </div>
      </div>

      {/* Case 2 */}
      <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">X is what percent of Y?</h4>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="number"
            value={value2a}
            onChange={(e) => setValue2a(Number(e.target.value))}
            className="w-28 px-2 py-1 bg-slate-50 dark:bg-slate-900 border rounded font-mono text-sm"
          />
          <span>is what % of</span>
          <input
            type="number"
            value={value2b}
            onChange={(e) => setValue2b(Number(e.target.value))}
            className="w-28 px-2 py-1 bg-slate-50 dark:bg-slate-900 border rounded font-mono text-sm"
          />
          <span>=</span>
          <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400 text-base">{result2.toFixed(2)}%</span>
        </div>
      </div>

      {/* Case 3 */}
      <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Percentage increase/decrease from X to Y</h4>
        <div className="flex flex-wrap items-center gap-3">
          <span>From</span>
          <input
            type="number"
            value={fromVal}
            onChange={(e) => setFromVal(Number(e.target.value))}
            className="w-28 px-2 py-1 bg-slate-50 dark:bg-slate-900 border rounded font-mono text-sm"
          />
          <span>to</span>
          <input
            type="number"
            value={toVal}
            onChange={(e) => setToVal(Number(e.target.value))}
            className="w-28 px-2 py-1 bg-slate-50 dark:bg-slate-900 border rounded font-mono text-sm"
          />
          <span>=</span>
          <span className={`font-bold font-mono text-base ${result3 >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {result3 >= 0 ? `+${result3.toFixed(2)}%` : `${result3.toFixed(2)}%`}
          </span>
        </div>
      </div>
    </div>
  );
};
