import React, { useState } from 'react';
import { CopyButton } from '../components/CopyButton';

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
  'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'ut',
  'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris',
  'nisi', 'ut', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure',
  'dolor', 'in', 'reprehenderit', 'in', 'voluptate', 'velit', 'esse', 'cillum', 'dolore',
  'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non',
  'proident', 'sunt', 'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
];

export const LoremIpsumGenerator: React.FC = () => {
  const [type, setType] = useState<'paragraphs' | 'words' | 'sentences'>('paragraphs');
  const [count, setCount] = useState(3);
  const [asHtml, setAsHtml] = useState(false);

  const generateText = () => {
    if (type === 'words') {
      const result: string[] = [];
      for (let i = 0; i < count; i++) {
        result.push(LOREM_WORDS[i % LOREM_WORDS.length]);
      }
      return result.join(' ');
    }

    if (type === 'sentences') {
      const sentences: string[] = [];
      for (let s = 0; s < count; s++) {
        const sentenceLength = 8 + Math.floor(Math.random() * 8);
        const words: string[] = [];
        for (let w = 0; w < sentenceLength; w++) {
          words.push(LOREM_WORDS[(s * 10 + w) % LOREM_WORDS.length]);
        }
        let sentenceStr = words.join(' ');
        sentenceStr = sentenceStr.charAt(0).toUpperCase() + sentenceStr.slice(1) + '.';
        sentences.push(sentenceStr);
      }
      return sentences.join(' ');
    }

    // Paragraphs
    const paras: string[] = [];
    for (let p = 0; p < count; p++) {
      const numSentences = 4 + Math.floor(Math.random() * 3);
      const sentences: string[] = [];
      for (let s = 0; s < numSentences; s++) {
        const sentenceLength = 8 + Math.floor(Math.random() * 8);
        const words: string[] = [];
        for (let w = 0; w < sentenceLength; w++) {
          words.push(LOREM_WORDS[(p * 20 + s * 5 + w) % LOREM_WORDS.length]);
        }
        let sentenceStr = words.join(' ');
        sentenceStr = sentenceStr.charAt(0).toUpperCase() + sentenceStr.slice(1) + '.';
        sentences.push(sentenceStr);
      }
      paras.push(sentences.join(' '));
    }

    if (asHtml) {
      return paras.map((p) => `<p>${p}</p>`).join('\n\n');
    }
    return paras.join('\n\n');
  };

  const output = generateText();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Generate Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-sm"
          >
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Count ({count})</label>
          <input
            type="range"
            min={1}
            max={20}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="flex items-center">
          <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={asHtml}
              onChange={(e) => setAsHtml(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            Wrap in HTML Paragraph Tags (&lt;p&gt;)
          </label>
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Lorem Ipsum Output
          </span>
          <CopyButton text={output} label="Copy Output" />
        </div>
        <textarea
          readOnly
          value={output}
          rows={8}
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md font-sans text-sm text-slate-800 dark:text-slate-200 leading-relaxed"
        />
      </div>
    </div>
  );
};
