import React, { useState } from 'react';
import { Search } from 'lucide-react';

const STATUS_CODES = [
  { code: 100, name: 'Continue', desc: 'Initial response indicating that everything so far is OK and the client should continue.' },
  { code: 101, name: 'Switching Protocols', desc: 'Server agrees to switch protocols as requested by the client.' },
  { code: 200, name: 'OK', desc: 'The request has succeeded.' },
  { code: 201, name: 'Created', desc: 'The request succeeded and a new resource was created.' },
  { code: 202, name: 'Accepted', desc: 'The request was received but not yet acted upon.' },
  { code: 204, name: 'No Content', desc: 'There is no content to send for this request.' },
  { code: 301, name: 'Moved Permanently', desc: 'The URI of requested resource has been changed permanently.' },
  { code: 302, name: 'Found', desc: 'The URI of requested resource has been changed temporarily.' },
  { code: 304, name: 'Not Modified', desc: 'Caching response: Resource has not been modified.' },
  { code: 400, name: 'Bad Request', desc: 'The server could not understand the request due to invalid syntax.' },
  { code: 401, name: 'Unauthorized', desc: 'Authentication required to get requested response.' },
  { code: 403, name: 'Forbidden', desc: 'The client does not have access rights to the content.' },
  { code: 404, name: 'Not Found', desc: 'The server cannot find the requested resource.' },
  { code: 405, name: 'Method Not Allowed', desc: 'Request method is known by server but unsupported.' },
  { code: 409, name: 'Conflict', desc: 'Request conflicts with current state of server.' },
  { code: 422, name: 'Unprocessable Entity', desc: 'Well-formed request but unable to be followed due to semantic errors.' },
  { code: 429, name: 'Too Many Requests', desc: 'The user has sent too many requests in a given amount of time.' },
  { code: 500, name: 'Internal Server Error', desc: 'The server encountered a situation it does not know how to handle.' },
  { code: 502, name: 'Bad Gateway', desc: 'Server received an invalid response while acting as a gateway.' },
  { code: 503, name: 'Service Unavailable', desc: 'Server is not ready to handle the request.' },
  { code: 504, name: 'Gateway Timeout', desc: 'Server acting as gateway did not get response in time.' },
];

export const HttpStatusCode: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = STATUS_CODES.filter(
    (item) =>
      item.code.toString().includes(search) ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.desc.toLowerCase().includes(search.toLowerCase())
  );

  const getBadgeClass = (code: number) => {
    if (code >= 500) return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
    if (code >= 400) return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    if (code >= 300) return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    if (code >= 200) return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter status codes (e.g. 404, Not Found, gateway)..."
          className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((item) => (
          <div key={item.code} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-start gap-3">
            <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold border ${getBadgeClass(item.code)}`}>
              {item.code}
            </span>
            <div>
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.name}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
