import React, { useState, useEffect } from 'react';
import { PageId, SearchResult } from '../types';
import { SEARCH_ITEMS } from '../data/docData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (pageId: PageId) => void;
  searchResults?: SearchResult[];
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectResult,
  searchResults = SEARCH_ITEMS,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          setQuery('');
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredResults = searchResults.filter((item) => {
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.codeSnippet && item.codeSnippet.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-2xl bg-[#171f33] border border-[#334155] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#334155] flex items-center gap-3 bg-[#131b2e]">
          <span className="material-symbols-outlined text-[#ffb690] text-[22px]">search</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documentation, commands, artisan snippets..."
            autoFocus
            className="w-full bg-transparent text-[#f8fafc] text-sm focus:outline-none placeholder:text-[#94a3b8]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#94a3b8] hover:text-[#f8fafc] text-xs font-code"
            >
              Clear
            </button>
          )}
          <kbd className="bg-[#2d3449] border border-[#334155] text-[#94a3b8] text-[10px] px-2 py-0.5 rounded font-code">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredResults.length === 0 ? (
            <div className="py-12 text-center text-[#94a3b8]">
              <span className="material-symbols-outlined text-4xl mb-2 text-[#334155]">search_off</span>
              <p className="text-sm">No results found for "{query}"</p>
              <p className="text-xs text-[#94a3b8]/60 mt-1">Try searching for "module", "composer", "migrate", "config"</p>
            </div>
          ) : (
            filteredResults.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectResult(item.pageId);
                  onClose();
                }}
                className="w-full text-left p-3 rounded-lg border border-[#334155]/40 hover:border-[#ffb690]/50 hover:bg-[#222a3d] transition-all group flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#ffb95f] uppercase font-code">
                    {item.category}
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-[#94a3b8] group-hover:text-[#ffb690] group-hover:translate-x-0.5 transition-all">
                    arrow_forward
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#f8fafc] group-hover:text-[#ffb690] transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-[#94a3b8] line-clamp-1">{item.description}</p>
                {item.codeSnippet && (
                  <div className="mt-1 bg-[#0b0f19] px-2.5 py-1 rounded border border-[#334155]/60 text-xs font-code text-[#7bd0ff]">
                    {item.codeSnippet}
                  </div>
                )}
              </button>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-[#0b0f19] border-t border-[#334155] flex items-center justify-between text-[11px] text-[#94a3b8]">
          <span>ProTip: Press <kbd className="text-[#ffb690]">⌘K</kbd> anytime to open search</span>
          <span>{filteredResults.length} topics available</span>
        </div>
      </div>
    </div>
  );
};
