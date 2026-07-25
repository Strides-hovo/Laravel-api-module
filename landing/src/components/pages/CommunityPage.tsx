import React from 'react';
import { PageId } from '../../types';

interface CommunityPageProps {
  onNavigate: (pageId: PageId) => void;
  starCount: number;
  onStar: () => void;
  isStarred: boolean;
  initialTab?: 'issues' | 'discussions';
}

export const CommunityPage: React.FC<CommunityPageProps> = ({
  starCount,
  onStar,
  isStarred,
}) => {
  const GITHUB_REPO_URL = 'https://github.com/Strides-hovo/Laravel-api-module';
  const GITHUB_ISSUES_URL = 'https://github.com/Strides-hovo/Laravel-api-module/issues';
  const GITHUB_DISCUSSIONS_URL = 'https://github.com/Strides-hovo/Laravel-api-module/discussions';

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 text-[#7bd0ff] font-code text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">groups</span>
            <span>COMMUNITY & GITHUB REPOSITORY</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#1e293b] hover:bg-[#334155] text-[#f8fafc] px-3.5 py-2 rounded-lg text-xs font-bold border border-[#334155] transition-all"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub Repo</span>
            </a>

          </div>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-[#f8fafc] tracking-tight">
          Official Community & Issue Tracker
        </h1>
        <p className="text-[#94a3b8] text-base md:text-lg max-w-2xl leading-relaxed">
          Report bugs, request framework enhancements, or discuss module architecture directly on the official GitHub repository.
        </p>
      </section>

      {/* Main Direct Link Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* GitHub Issues Card */}
        <div className="bg-[#131b2e] border border-[#334155] rounded-xl p-6 md:p-8 space-y-5 shadow-xl flex flex-col justify-between hover:border-[#ffb690]/50 transition-all group">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#ef4444]/10 border border-[#ef4444]/30 flex items-center justify-center text-[#ef4444] group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[28px]">error_outline</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-[#f8fafc]">GitHub Issues</h3>
              <p className="text-sm text-[#94a3b8] leading-relaxed">
                Found a bug or need a specific stub enhancement? Submit official bug reports and track active issue resolutions directly on GitHub.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#334155]/60 flex flex-wrap items-center gap-3">
            <a
              href={GITHUB_ISSUES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#ef4444] text-white px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-[#dc2626] transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.25)]"
            >
              <span>Go to GitHub Issues</span>
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            </a>

            <a
              href={`${GITHUB_ISSUES_URL}/new/choose`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1e293b] hover:bg-[#334155] text-[#f8fafc] px-4 py-2.5 rounded-lg text-xs font-bold border border-[#334155] transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Create New Issue</span>
            </a>
          </div>
        </div>

        {/* GitHub Discussions Card */}
        <div className="bg-[#131b2e] border border-[#334155] rounded-xl p-6 md:p-8 space-y-5 shadow-xl flex flex-col justify-between hover:border-[#7bd0ff]/50 transition-all group">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#7bd0ff]/10 border border-[#7bd0ff]/30 flex items-center justify-center text-[#7bd0ff] group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[28px]">forum</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-[#f8fafc]">GitHub Discussions</h3>
              <p className="text-sm text-[#94a3b8] leading-relaxed">
                Ask architectural questions, share domain module design patterns, showcase your custom stubs, and connect with other Laravel developers.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#334155]/60 flex flex-wrap items-center gap-3">
            <a
              href={GITHUB_DISCUSSIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#7bd0ff] text-[#002a45] px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-[#38bdf8] transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(123,208,255,0.25)]"
            >
              <span>Go to GitHub Discussions</span>
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            </a>

            <a
              href={`${GITHUB_DISCUSSIONS_URL}/new`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1e293b] hover:bg-[#334155] text-[#f8fafc] px-4 py-2.5 rounded-lg text-xs font-bold border border-[#334155] transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">add_comment</span>
              <span>Start Discussion</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Repository Banner */}
      <section className="bg-gradient-to-r from-[#171f33] to-[#1e293b] border border-[#334155] rounded-xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-code text-[#ffb95f] bg-[#ffb95f]/10 px-2.5 py-0.5 rounded-full border border-[#ffb95f]/20 font-bold">
            <span className="material-symbols-outlined text-[14px]">code</span>
            Open Source Repository
          </div>
          <h3 className="text-2xl font-bold text-[#f8fafc]">Strides-hovo / Laravel-api-module</h3>
          <p className="text-sm text-[#94a3b8] leading-relaxed">
            Star the project, inspect the source code, review CI workflow pipelines, and contribute pull requests directly on GitHub.
          </p>
        </div>

        <a
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#ffb690] text-[#552100] px-6 py-3 rounded-lg text-xs font-extrabold hover:shadow-[0_0_20px_rgba(255,182,144,0.4)] transition-all shrink-0 flex items-center gap-2"
        >
          <span>View Main Repository</span>
          <span className="material-symbols-outlined text-[18px]">open_in_new</span>
        </a>
      </section>

      {/* Contribution Guidelines summary */}
      <section className="bg-[#131b2e] border border-[#334155] rounded-xl p-6 md:p-8 space-y-4 shadow-xl">
        <h3 className="text-xl font-bold text-[#f8fafc]">How to Contribute</h3>
        <p className="text-sm text-[#94a3b8] leading-relaxed">
          We welcome open-source contributions! Whether fixing bugs, updating documentation, or adding new module CLI features:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 font-code text-xs">
          <div className="bg-[#0b0f19] border border-[#334155] p-4 rounded-lg space-y-1">
            <div className="text-[#ffb690] font-bold">1. Fork & Clone</div>
            <p className="text-[#94a3b8]">Fork the repository on GitHub and clone it locally.</p>
          </div>
          <div className="bg-[#0b0f19] border border-[#334155] p-4 rounded-lg space-y-1">
            <div className="text-[#ffb690] font-bold">2. Run Tests</div>
            <p className="text-[#94a3b8]">Execute vendor/bin/phpunit to run automated CI test suites.</p>
          </div>
          <div className="bg-[#0b0f19] border border-[#334155] p-4 rounded-lg space-y-1">
            <div className="text-[#ffb690] font-bold">3. Submit Pull Request</div>
            <p className="text-[#94a3b8]">Open a detailed PR targeting the main branch.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
