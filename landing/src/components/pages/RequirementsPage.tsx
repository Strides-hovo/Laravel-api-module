import React from 'react';
import { PageId } from '../../types';
import { VersionDocData } from '../../services/api';

interface RequirementsPageProps {
  onNavigate: (pageId: PageId) => void;
  docData?: VersionDocData | null;
}

export const RequirementsPage: React.FC<RequirementsPageProps> = ({ onNavigate, docData }) => {
  const phpVer = docData?.phpRequirement || '8.2+';
  const laravelVer = docData?.laravelRequirement || '10+ (10, 11, 12, 13+)';
  const version = docData?.version || '1.0.0';

  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-[#7bd0ff] font-code text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>SYSTEM REQUIREMENTS — VERSION {version}</span>
          </div>
          {docData?.isReleased === false ? (
            <span className="px-2.5 py-0.5 rounded-full border border-[#f59e0b]/50 bg-[#f59e0b]/15 text-[#f59e0b] font-code text-[10px] font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">engineering</span>
              <span>ROADMAP</span>
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full border border-[#10b981]/40 bg-[#10b981]/10 text-[#34d399] font-code text-[10px] font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">verified</span>
              <span>RELEASED</span>
            </span>
          )}
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#f8fafc] tracking-tight">
          Requirements ({version})
        </h1>
        <p className="text-[#94a3b8] text-base md:text-lg max-w-2xl leading-relaxed">
          Ensure your server environment meets the minimum runtime requirements before installing the Laravel API Module v{version} package.
        </p>

        {docData?.isReleased === false && (
          <div className="w-full bg-[#1e293b]/90 border border-[#f59e0b]/50 rounded-xl p-4 flex items-start gap-3 shadow-md my-2">
            <div className="p-2 bg-[#f59e0b]/15 rounded-lg text-[#f59e0b] shrink-0">
              <span className="material-symbols-outlined text-[20px]">lightbulb</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#f8fafc]">💡 Preliminary Requirements (Roadmap)</h4>
              <p className="text-xs text-[#cbd5e1] mt-0.5">
                Requirements for version <strong>{version}</strong> are tentative, since this version hasn't been released yet (in development).
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Grid of Core Requirements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#171f33] border border-[#334155] rounded-xl p-6 shadow-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#ffb690]/10 flex items-center justify-center text-[#ffb690]">
            <span className="material-symbols-outlined text-[24px]">code</span>
          </div>
          <h3 className="text-lg font-bold text-[#f8fafc]">PHP Version</h3>
          <p className="text-sm text-[#94a3b8]">Requires PHP {phpVer}. Utilizes modern PHP attributes, readonly classes, and typed properties.</p>
          <div className="font-code text-xs text-[#10b981] font-bold">✓ PHP {phpVer} Required</div>
        </div>

        <div className="bg-[#171f33] border border-[#334155] rounded-xl p-6 shadow-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#7bd0ff]/10 flex items-center justify-center text-[#7bd0ff]">
            <span className="material-symbols-outlined text-[24px]">layers</span>
          </div>
          <h3 className="text-lg font-bold text-[#f8fafc]">Laravel Framework</h3>
          <p className="text-sm text-[#94a3b8]">Fully compatible with Laravel 10+ (including 10.x, 11.x, 12.x, 13.x and future releases).</p>
          <div className="font-code text-xs text-[#10b981] font-bold">✓ Laravel 10+ (10, 11, 12, 13+)</div>
        </div>

        <div className="bg-[#171f33] border border-[#334155] rounded-xl p-6 shadow-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#ffb95f]/10 flex items-center justify-center text-[#ffb95f]">
            <span className="material-symbols-outlined text-[24px]">package</span>
          </div>
          <h3 className="text-lg font-bold text-[#f8fafc]">Composer</h3>
          <p className="text-sm text-[#94a3b8]">Composer 2.2+ is required to manage dependency resolution and PSR-4 namespace autoloading.</p>
          <div className="font-code text-xs text-[#10b981] font-bold">✓ Composer 2.x Required</div>
        </div>
      </div>

      {/* CI/CD Pipeline & Automated Testing Assurance */}
      <section className="bg-gradient-to-r from-[#171f33] to-[#1e293b] border border-[#334155] rounded-xl p-6 md:p-8 space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#10b981]/10 border border-[#10b981]/30 flex items-center justify-center text-[#10b981]">
            <span className="material-symbols-outlined text-[24px]">fact_check</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#f8fafc]">Automated CI Pipeline Tests</h3>
            <span className="inline-flex items-center gap-1.5 text-xs font-code font-bold text-[#10b981] bg-[#10b981]/10 px-2.5 py-0.5 rounded-full mt-1 border border-[#10b981]/20">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
              CI/CD Pipeline Always Passing
            </span>
          </div>
        </div>
        <p className="text-sm text-[#94a3b8] leading-relaxed max-w-3xl">
          The package includes pre-configured GitHub Actions & CI pipeline tests. Automated unit and integration tests run continuously across all supported PHP ({phpVer}) and Laravel versions (10, 11, 12, 13+), ensuring that every commit and build remains 100% stable and fully operational.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-code text-xs">
          <div className="bg-[#0b0f19] border border-[#334155] p-3 rounded-lg flex items-center gap-2 text-[#7bd0ff]">
            <span className="material-symbols-outlined text-[18px] text-[#10b981]">task_alt</span>
            <span>PHPUnit / Pest Suites</span>
          </div>
          <div className="bg-[#0b0f19] border border-[#334155] p-3 rounded-lg flex items-center gap-2 text-[#7bd0ff]">
            <span className="material-symbols-outlined text-[18px] text-[#10b981]">task_alt</span>
            <span>Laravel 10–13 Compatibility</span>
          </div>
          <div className="bg-[#0b0f19] border border-[#334155] p-3 rounded-lg flex items-center gap-2 text-[#7bd0ff]">
            <span className="material-symbols-outlined text-[18px] text-[#10b981]">task_alt</span>
            <span>Automated Static Analysis</span>
          </div>
        </div>
      </section>

      {/* PHP Extension Matrix */}
      <section className="bg-[#131b2e] border border-[#334155] rounded-xl p-6 md:p-8 space-y-6 shadow-xl">
        <h3 className="text-xl font-bold text-[#f8fafc]">Required PHP Extensions</h3>
        <p className="text-sm text-[#94a3b8]">The following extensions must be enabled in your php.ini configuration:</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-code text-xs">
          {[
            'ext-pdo',
            'ext-openssl',
            'ext-mbstring',
            'ext-[#tokenizer]',
            'ext-xml',
            'ext-ctype',
            'ext-json',
            'ext-bcmath',
          ].map((ext, idx) => (
            <div
              key={idx}
              className="bg-[#0b0f19] border border-[#334155] p-3 rounded-lg flex items-center justify-between"
            >
              <span className="text-[#f8fafc] font-bold">{ext.replace('#', '')}</span>
              <span className="material-symbols-outlined text-[#10b981] text-[18px]">check_circle</span>
            </div>
          ))}
        </div>
      </section>

      {/* Pagination Navigation */}
      <section className="flex justify-between items-center pt-6">
        <button
          onClick={() => onNavigate('instructions')}
          className="group p-6 bg-[#131b2e] border border-[#334155] rounded-xl hover:border-[#ffb690] transition-all text-left shadow-lg"
        >
          <p className="font-code text-[11px] text-[#94a3b8] mb-1 uppercase tracking-wider font-bold">Previous</p>
          <h4 className="text-lg font-bold text-[#f8fafc] group-hover:text-[#ffb690] transition-colors">
            Instructions
          </h4>
        </button>

        <button
          onClick={() => onNavigate('installation')}
          className="group p-6 bg-[#131b2e] border border-[#334155] rounded-xl hover:border-[#ffb690] transition-all text-right shadow-lg"
        >
          <p className="font-code text-[11px] text-[#94a3b8] mb-1 uppercase tracking-wider font-bold">Next Up</p>
          <h4 className="text-lg font-bold text-[#f8fafc] group-hover:text-[#ffb690] transition-colors">
            Installation & Setup
          </h4>
        </button>
      </section>
    </div>
  );
};
