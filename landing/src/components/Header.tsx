import React from 'react';
import { PageId } from '../types';

interface HeaderProps {
  activePage: PageId;
  onNavigate: (pageId: PageId) => void;
  selectedVersion: string;
  onVersionChange: (version: string) => void;
  onOpenSearch: () => void;
  onOpenCli: () => void;
  onOpenMockApi: () => void;
  isMockApiActive: boolean;
  onToggleMobileMenu: () => void;
  starCount: number;
  onStar: () => void;
  isStarred: boolean;
  isAdminAuthorized: boolean;
  onOpenAdminAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  onNavigate,
  selectedVersion,
  onVersionChange,
  onOpenSearch,
  onOpenCli,
  onOpenMockApi,
  isMockApiActive,
  onToggleMobileMenu,
  starCount,
  onStar,
  isStarred,
  isAdminAuthorized,
  onOpenAdminAuth,
}) => {
  return (
    <header className="fixed top-0 left-0 w-full z-40 h-[64px] bg-[#0b1326]/90 backdrop-blur-md border-b border-[#584237]/40 shadow-sm">
      <div className="flex items-center justify-between px-4 lg:px-8 max-w-[1400px] mx-auto h-full">
        {/* Left section: Logo & Version */}
        <div className="flex items-center gap-4 lg:gap-6">
          <button
            onClick={() => onNavigate('instructions')}
            className="flex items-center gap-2 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#ffb690]/10 border border-[#ffb690]/30 flex items-center justify-center text-[#ffb690] group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px]">extension</span>
            </div>
            <span className="font-extrabold text-lg text-[#f8fafc] tracking-tight group-hover:text-[#ffb690] transition-colors whitespace-nowrap">
              Laravel API Module
            </span>
          </button>

          {/* Desktop Version Selector */}
          <div className="hidden sm:block relative">
            <select
              value={selectedVersion}
              onChange={(e) => onVersionChange(e.target.value)}
              className="bg-[#2d3449] border border-[#334155] text-[#ffb95f] text-xs font-bold font-code rounded-lg px-3 py-1.5 pr-8 appearance-none cursor-pointer hover:border-[#ffb690]/50 transition-colors focus:outline-none focus:ring-1 focus:ring-[#ffb690]/50"
            >
              <option value="1.0.0">Version 1.0.0 (LTS)</option>
              <option value="1.5.0">Version 1.5.0</option>
              <option value="2.0.0">Version 2.0.0 (Next-Gen)</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[16px] pointer-events-none text-[#94a3b8]">
              expand_more
            </span>
          </div>
        </div>

        {/* Center: Search Trigger & Navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSearch}
            className="hidden md:flex items-center gap-3 bg-[#131b2e] border border-[#334155] hover:border-[#ffb690]/40 text-[#94a3b8] px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all group w-48 lg:w-64"
          >
            <span className="material-symbols-outlined text-[18px] group-hover:text-[#ffb690]">
              search
            </span>
            <span className="flex-1 text-left">Search docs...</span>
            <kbd className="bg-[#1e293b] border border-[#334155] text-[#94a3b8] px-1.5 py-0.5 rounded text-[10px] font-code">
              ⌘K
            </kbd>
          </button>

          <nav className="hidden lg:flex items-center gap-6 text-sm">
            <button
              onClick={() => onNavigate('issues')}
              className="text-[#94a3b8] hover:text-[#ffb690] transition-colors flex items-center gap-1.5 font-medium"
            >
              <span className="material-symbols-outlined text-[18px]">code</span>
              <span>GitHub</span>
            </button>

            {/* ONLY VISIBLE IF ADMIN IS AUTHORIZED */}
            {isAdminAuthorized && (
              <button
                onClick={() => onNavigate('mockapi-editor')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activePage === 'mockapi-editor'
                    ? 'bg-[#ffb690] text-[#552100]'
                    : 'bg-[#ffb690]/10 border border-[#ffb690]/30 text-[#ffb690] hover:bg-[#ffb690]/20'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">edit_note</span>
                <span>Resource Editor</span>
              </button>
            )}
          </nav>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* MockAPI Integration Trigger - ONLY VISIBLE WHEN AUTHORIZED */}
          {isAdminAuthorized && (
            <button
              onClick={onOpenMockApi}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-code transition-all ${
                isMockApiActive
                  ? 'bg-[#10b981]/20 border border-[#10b981]/40 text-[#34d399] hover:bg-[#10b981]/30'
                  : 'bg-[#171f33] border border-[#334155] text-[#94a3b8] hover:text-[#f8fafc] hover:border-[#ffb690]/40'
              }`}
              title="Configure MockAPI.io Data Source"
            >
              <span className="material-symbols-outlined text-[16px]">
                {isMockApiActive ? 'cloud_done' : 'cloud_sync'}
              </span>
              <span className="hidden sm:inline">
                {isMockApiActive ? 'MockAPI' : 'MockAPI'}
              </span>
            </button>
          )}

          {/* Admin Lock / Auth Button */}
          <button
            onClick={onOpenAdminAuth}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isAdminAuthorized
                ? 'bg-[#10b981]/20 border border-[#10b981]/40 text-[#34d399] hover:bg-[#10b981]/30'
                : 'bg-[#1e293b] border border-[#334155] text-[#94a3b8] hover:text-[#ffb690] hover:border-[#ffb690]/40'
            }`}
            title={isAdminAuthorized ? 'Admin Session Active' : 'Admin Login'}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isAdminAuthorized ? 'lock_open' : 'lock'}
            </span>
            <span className="hidden md:inline">
              {isAdminAuthorized ? 'Admin' : 'Admin'}
            </span>
          </button>

          <button
            onClick={onOpenSearch}
            className="md:hidden p-2 text-[#94a3b8] hover:text-[#f8fafc]"
            aria-label="Search"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>

          <button
            onClick={onOpenCli}
            className="hidden sm:flex items-center gap-1.5 bg-[#171f33] border border-[#ffb690]/40 hover:bg-[#222a3d] text-[#ffb690] px-3 py-1.5 rounded-lg text-xs font-semibold font-code transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">terminal</span>
            <span>CLI Simulator</span>
          </button>

          <button
            onClick={onStar}
            className={`flex items-center gap-1.5 text-xs font-bold py-1.5 px-3 rounded-lg transition-all ${
              isStarred
                ? 'bg-[#ffb690] text-[#552100] shadow-[0_0_15px_rgba(255,182,144,0.4)]'
                : 'bg-[#ffb690]/10 border border-[#ffb690]/30 text-[#ffb690] hover:bg-[#ffb690]/20'
            }`}
          >
            <span
              className="material-symbols-outlined text-[16px]"
              style={{ fontVariationSettings: isStarred ? "'FILL' 1" : "'FILL' 0" }}
            >
              star
            </span>
            <span className="hidden xs:inline">Star on GitHub</span>
            <span className="bg-[#0b1326]/40 px-1.5 py-0.5 rounded text-[10px]">
              {starCount.toLocaleString()}
            </span>
          </button>

          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 text-[#94a3b8] hover:text-[#f8fafc] rounded-lg hover:bg-[#1e293b]"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
        </div>
      </div>
    </header>
  );
};
