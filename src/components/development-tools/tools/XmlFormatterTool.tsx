import React, { useState } from 'react';
import xmlFormatter from 'xml-formatter';
import { CopyButton } from '../components/CopyButton';

export const XmlFormatterTool: React.FC = () => {
  const [xmlInput, setXmlInput] = useState('<root><user id="1"><name>John Doe</name><role>Admin</role></user><user id="2"><name>Jane Smith</name><role>User</role></user></root>');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const processFormat = () => {
    setError('');
    if (!xmlInput.trim()) {
      setOutput('');
      return;
    }
    try {
      const formatted = xmlFormatter(xmlInput, {
        indentation: '  ',
        collapseContent: true,
      });
      setOutput(formatted);
    } catch (err: any) {
      setError(err.message || 'Error formatting XML payload');
    }
  };

  React.useEffect(() => {
    processFormat();
  }, [xmlInput]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">XML Input Payload</label>
          <textarea
            value={xmlInput}
            onChange={(e) => setXmlInput(e.target.value)}
            rows={12}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-xs text-slate-800 dark:text-slate-200"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-medium text-slate-500">Prettified XML Output</label>
            {output && <CopyButton text={output} />}
          </div>
          {error ? (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs rounded-lg font-mono">
              {error}
            </div>
          ) : (
            <textarea
              readOnly
              value={output}
              rows={12}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-xs text-slate-800 dark:text-slate-200 select-all"
            />
          )}
        </div>
      </div>
    </div>
  );
};
