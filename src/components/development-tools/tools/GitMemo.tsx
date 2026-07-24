import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { CopyButton } from '../components/CopyButton';

const GIT_COMMANDS = [
  { cat: 'Setup & Config', cmd: 'git config --global user.name "John Doe"', desc: 'Set global username' },
  { cat: 'Setup & Config', cmd: 'git config --global user.email "john@example.com"', desc: 'Set global email' },
  { cat: 'Create & Clone', cmd: 'git init', desc: 'Initialize git repo in current directory' },
  { cat: 'Create & Clone', cmd: 'git clone <url>', desc: 'Clone repository from remote URL' },
  { cat: 'Basic Snapshotting', cmd: 'git status', desc: 'View modified files and staged changes' },
  { cat: 'Basic Snapshotting', cmd: 'git add .', desc: 'Stage all modified and new files' },
  { cat: 'Basic Snapshotting', cmd: 'git commit -m "commit message"', desc: 'Commit staged changes with message' },
  { cat: 'Basic Snapshotting', cmd: 'git commit --amend -m "new message"', desc: 'Modify last commit message' },
  { cat: 'Branching & Merging', cmd: 'git branch', desc: 'List local branches' },
  { cat: 'Branching & Merging', cmd: 'git checkout -b <branch-name>', desc: 'Create and switch to new branch' },
  { cat: 'Branching & Merging', cmd: 'git switch -c <branch-name>', desc: 'Modern alternative to create & switch branch' },
  { cat: 'Branching & Merging', cmd: 'git merge <branch-name>', desc: 'Merge specified branch into current branch' },
  { cat: 'Remote Repos', cmd: 'git push origin <branch-name>', desc: 'Push local commits to remote branch' },
  { cat: 'Remote Repos', cmd: 'git pull origin <branch-name>', desc: 'Fetch and merge changes from remote' },
  { cat: 'Undo & Reset', cmd: 'git reset HEAD~1', desc: 'Undo last commit, keeping file changes in working dir' },
  { cat: 'Undo & Reset', cmd: 'git reset --hard HEAD~1', desc: 'Completely discard last commit and working changes' },
  { cat: 'Undo & Reset', cmd: 'git stash', desc: 'Temporarily save uncommitted working changes' },
  { cat: 'Undo & Reset', cmd: 'git stash pop', desc: 'Re-apply stashed changes' },
  { cat: 'Logs & Inspection', cmd: 'git log --oneline --graph --all', desc: 'Pretty compact visual commit history graph' },
  { cat: 'Logs & Inspection', cmd: 'git diff', desc: 'View uncommitted changes in working directory' },
];

export const GitMemo: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = GIT_COMMANDS.filter(
    (item) =>
      item.cmd.toLowerCase().includes(search.toLowerCase()) ||
      item.desc.toLowerCase().includes(search.toLowerCase()) ||
      item.cat.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Git commands (e.g. commit, branch, stash, reset)..."
          className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((item, index) => (
          <div key={index} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                {item.cat}
              </span>
              <p className="font-mono text-sm font-semibold text-slate-800 dark:text-slate-100">{item.cmd}</p>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
            <CopyButton text={item.cmd} />
          </div>
        ))}
      </div>
    </div>
  );
};
