import React, { useState } from 'react';
import { PageId, NavGroup } from '../types';
import { NAV_GROUPS } from '../data/docData';

interface SidebarProps {
  activePage: PageId;
  onNavigate: (pageId: PageId) => void;
  selectedVersion: string;
  onVersionChange: (version: string) => void;
  navGroups?: NavGroup[];
  starCount: number;
  onStar: () => void;
  isStarred: boolean;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  isAdminAuthorized?: boolean;
}

const GITHUB_REPO_URL = 'https://github.com/Strides-hovo/Laravel-api-module';
export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  selectedVersion,
  onVersionChange,
  navGroups = NAV_GROUPS,
  starCount,
  onStar,
  isStarred,
  isOpenMobile = false,
  onCloseMobile,
  isAdminAuthorized = false,
}) => {
  // Track open state of accordions
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'getting-started': false,
    'core-concepts': false,
    database: false,
    community: false,
  });

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const content = (
    <div className="flex flex-col h-full py-6">
      {/* Version dropdown in sidebar */}
      <div className="px-4 mb-4 sm:hidden">
        <label className="block text-xs font-code text-[#94a3b8] mb-1">Documentation Version</label>
        <div className="relative">
          <select
            value={selectedVersion}
            onChange={(e) => onVersionChange(e.target.value)}
            className="w-full bg-[#171f33] border border-[#334155] text-[#f8fafc] text-xs font-code rounded-lg px-3 py-2 appearance-none"
          >
            <option value="2.0.0">Version 2.0.0 (Current)</option>
            <option value="1.0.0">Version 1.0.0 (Legacy)</option>
          </select>
          <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] pointer-events-none text-[#94a3b8]">
            expand_more
          </span>
        </div>
      </div>

      {/* Special Resource Editor Quick Link - ONLY IF AUTHORIZED */}
      {isAdminAuthorized && (
        <div className="px-3 mb-3">
          <button
            onClick={() => {
              onNavigate('mockapi-editor');
              if (onCloseMobile) onCloseMobile();
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all border ${
              activePage === 'mockapi-editor'
                ? 'bg-[#ffb690] text-[#552100] border-[#ffb690]'
                : 'bg-[#1e293b]/70 border-[#ffb690]/30 text-[#ffb690] hover:bg-[#ffb690]/20'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">edit_note</span>
            <span className="flex-1 text-left">Resource Data Editor</span>
            <span className="text-[10px] bg-[#ffb690]/20 text-[#ffb690] px-1.5 py-0.5 rounded font-code">
              Sync
            </span>
          </button>
        </div>
      )}

      {/* Accordion Navigation List */}
      <nav className="flex-1 space-y-3 px-3 overflow-y-auto">
        {navGroups.map((group) => {
          const isOpen = openGroups[group.id] ?? true;
          const hasActiveItem = group.items.some((i) => i.id === activePage);

          return (
            <div key={group.id} className="navigation-group">
              <button
                onClick={() => toggleGroup(group.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-bold rounded-lg transition-colors group ${
                  hasActiveItem ? 'text-[#ffb690]' : 'text-[#f8fafc] hover:bg-[#171f33]'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[20px] text-[#ffb690]">
                    {group.icon}
                  </span>
                  <span>{group.label}</span>
                </span>
                <span
                  className={`material-symbols-outlined text-[18px] text-[#94a3b8] transition-transform duration-200 ${
                    isOpen ? 'rotate-0' : '-rotate-90'
                  }`}
                >
                  expand_more
                </span>
              </button>

              {isOpen && (
                <div className="mt-1 flex flex-col space-y-0.5 pl-6 border-l border-[#334155]/60 ml-5">
                  {group.items.map((item) => {
                    const isActive = activePage === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onNavigate(item.id);
                          if (onCloseMobile) onCloseMobile();
                        }}
                        className={`relative text-left text-sm py-1.5 px-3 rounded-md transition-all flex items-center justify-between ${
                          isActive
                            ? 'text-[#ffb690] font-bold bg-[#ffb690]/10 border-l-2 border-[#ffb690] -ml-[1px]'
                            : 'text-[#94a3b8] hover:text-[#ffb690] hover:bg-[#171f33]/50'
                        }`}
                      >
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="text-[10px] bg-[#2d3449] text-[#7bd0ff] px-1.5 py-0.5 rounded font-code">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom Sidebar Action Cards */}
      <div className="mt-auto px-4 pt-4 border-t border-[#334155]/40 space-y-3">
        <a
          href={GITHUB_REPO_URL}
          target="_blank"
          className={`w-full font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 text-sm ${
            isStarred
              ? 'bg-[#ffb690] text-[#552100]'
              : 'bg-[#ffb690] text-[#552100] hover:shadow-[0_0_15px_rgba(255,182,144,0.4)] active:scale-95'
          }`}
        >
          <span
            className="material-symbols-outlined text-[18px]"
            style={{ fontVariationSettings: isStarred ? "'FILL' 1" : "'FILL' 0" }}
          >
            star
          </span>
          <span>{isStarred ? 'Starred on GitHub' : 'Star on GitHub'}</span>
          <span className="text-xs opacity-80">({starCount})</span>
        </a>

        <div className="flex items-center justify-between px-2 pt-1">
          <button
            onClick={() => {
              onNavigate('instructions');
              if (onCloseMobile) onCloseMobile();
            }}
            className="text-xs text-[#94a3b8] hover:text-[#ffb690] transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">description</span>
            <span>MIT License</span>
          </button>
          <span className="text-[10px] text-[#94a3b8]/60 font-code">v{selectedVersion}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="fixed left-0 top-[64px] w-[280px] h-[calc(100vh-64px)] bg-[#0b0f19] border-r border-[#584237]/40 hidden lg:block overflow-y-auto">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <aside className="relative z-10 w-[280px] max-w-[80vw] h-full bg-[#0b0f19] border-r border-[#334155] shadow-2xl flex flex-col">
            <div className="p-4 border-b border-[#334155] flex items-center justify-between">
              <span className="font-bold text-[#f8fafc] text-sm">Navigation</span>
              <button
                onClick={onCloseMobile}
                className="text-[#94a3b8] hover:text-[#f8fafc]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            {content}
          </aside>
        </div>
      )}
    </>
  );
};
