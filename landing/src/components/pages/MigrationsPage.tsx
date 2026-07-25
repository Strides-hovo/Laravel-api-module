import React from 'react';
import { PageId } from '../../types';
import { CodeBlock } from '../CodeBlock';

interface MigrationsPageProps {
  onNavigate: (pageId: PageId) => void;
}

export const MigrationsPage: React.FC<MigrationsPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12">
      {/* Header Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-[#ffb690] font-code text-xs font-bold uppercase tracking-wider">
          <span className="material-symbols-outlined text-[16px]">database</span>
          <span>DATABASE MANAGEMENT</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#f8fafc] tracking-tight">
          Module Migrations
        </h1>
        <p className="text-[#94a3b8] text-base md:text-lg max-w-2xl leading-relaxed">
          The Laravel API Module system utilizes a decentralized migration architecture. Each module maintains its own database schema, allowing for isolated updates and zero-dependency deployments.
        </p>
      </section>

      {/* Bento Grid for Core Database Concepts */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Automatic Discovery Card */}
        <div className="md:col-span-2 bg-[#131b2e] border border-[#334155] rounded-xl p-6 md:p-8 hover:border-[#ffb690]/50 transition-all duration-300 shadow-xl space-y-6">
          <h3 className="text-xl font-bold text-[#f8fafc] flex items-center gap-3">
            <span className="material-symbols-outlined text-[#ffb690]">schema</span>
            <span>Automatic Discovery</span>
          </h3>
          <p className="text-[#94a3b8] text-sm leading-relaxed">
            When you generate a module, a dedicated <code className="bg-[#2d3449] px-1.5 py-0.5 rounded text-[#7bd0ff] font-code text-xs">Database/Migrations</code> directory is created. The module loader automatically registers these paths into the Laravel migration repository during boot.
          </p>

          <div className="bg-[#0b0f19] border border-[#334155] rounded-lg overflow-hidden font-code text-xs">
            <div className="bg-[#161b22] px-4 py-2 border-b border-[#334155] flex items-center justify-between text-[#94a3b8]">
              <span>Project Structure</span>
              <span className="material-symbols-outlined text-[16px]">folder</span>
            </div>
            <div className="p-4 text-[#7bd0ff] space-y-1">
              <div className="flex gap-4">
                <span className="text-[#94a3b8]/50 select-none">1</span>
                <span>Modules/UserAuth/</span>
              </div>
              <div className="flex gap-4">
                <span className="text-[#94a3b8]/50 select-none">2</span>
                <span className="pl-4">├── Database/</span>
              </div>
              <div className="flex gap-4">
                <span className="text-[#94a3b8]/50 select-none">3</span>
                <span className="pl-8 text-[#ffb690]">└── Migrations/</span>
              </div>
              <div className="flex gap-4">
                <span className="text-[#94a3b8]/50 select-none">4</span>
                <span className="pl-12 text-[#94a3b8]">2024_01_01_000000_create_users_table.php</span>
              </div>
            </div>
          </div>
        </div>

        {/* Safety First Card */}
        <div className="bg-[#222a3d] border border-[#ffb690]/20 rounded-xl p-6 md:p-8 relative overflow-hidden flex flex-col justify-between shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffb690]/5 blur-[60px] -mr-16 -mt-16 pointer-events-none" />
          <div className="space-y-3">
            <span className="bg-[#ffb690]/20 text-[#ffb690] px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase inline-block font-code">
              Pro Feature
            </span>
            <h3 className="text-xl font-bold text-[#f8fafc]">Safety First</h3>
            <p className="text-[#94a3b8] text-xs leading-relaxed">
              Every destructive operation triggers an automated state capture. We ensure your production data is never more than 60 seconds away from recovery.
            </p>
          </div>

          <div className="mt-8 flex items-center gap-3 text-[#10b981] font-code text-xs font-bold">
            <span className="material-symbols-outlined">verified_user</span>
            <span>BACKUP ENABLED</span>
          </div>
        </div>
      </section>

      {/* Executing Operations */}
      <section className="space-y-8">
        <h2 className="text-2xl font-bold text-[#f8fafc]">Executing Operations</h2>

        <div className="space-y-8 pl-2">
          {/* Step 1 */}
          <div className="relative pl-10 md:pl-12 group">
            <div className="absolute left-0 top-0 w-8 h-8 rounded-full border-2 border-[#ffb690] bg-[#0b1326] flex items-center justify-center font-bold text-[#ffb690] text-sm">
              1
            </div>
            <div className="absolute left-[15px] top-[32px] bottom-[-32px] w-0.5 bg-[#334155]" />

            <div className="space-y-3">
              <h4 className="text-lg font-bold text-[#f8fafc]">Standard Migration</h4>
              <p className="text-sm text-[#94a3b8]">Run migrations for all active modules or specify a target module to isolate the update.</p>
              <CodeBlock title="Terminal" code="php artisan module:migrate UserAuth" />
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative pl-10 md:pl-12 group">
            <div className="absolute left-0 top-0 w-8 h-8 rounded-full border-2 border-[#ffb690] bg-[#0b1326] flex items-center justify-center font-bold text-[#ffb690] text-sm">
              2
            </div>

            <div className="space-y-3">
              <h4 className="text-lg font-bold text-[#f8fafc]">Rollback & Refresh</h4>
              <p className="text-sm text-[#94a3b8]">Revert specific module states without affecting the core application tables.</p>
              <CodeBlock title="Terminal" code="php artisan module:migrate-rollback UserAuth --step=1" />
            </div>
          </div>
        </div>
      </section>

      {/* Callout: Backup on Deletion */}
      <div className="bg-[#ffb690]/5 border-l-4 border-[#ffb690] p-6 rounded-r-xl flex gap-5 items-start shadow-lg">
        <div className="w-12 h-12 rounded-lg bg-[#ffb690]/10 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[#ffb690] text-[24px]">backup</span>
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-[#ffb690] text-base">State Preservation on Deletion</h4>
          <p className="text-sm text-[#94a3b8] leading-relaxed">
            When a module is deleted via the <code className="text-[#ffb690] font-code">module:delete</code> command, the system automatically exports a <code className="text-[#ffb95f] font-code">.sql</code> snapshot of all tables owned by that module to <code className="text-[#7bd0ff] font-code">storage/app/backups/modules/</code>. This ensures that you can restore data even after structural removal.
          </p>
        </div>
      </div>

      {/* Module Lifecycle Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-4">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#f8fafc]">Module Lifecycle</h2>
          <p className="text-[#94a3b8] text-sm leading-relaxed">
            Updating modules often involves schema shifts. Our intelligent resolver checks for "breaking changes" in table structures before applying new module versions.
          </p>

          <ul className="space-y-3 pt-2">
            <li className="flex items-center gap-3 text-sm text-[#f8fafc]">
              <span className="material-symbols-outlined text-[#10b981]">check_circle</span>
              <span>Automatic column existence checks</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-[#f8fafc]">
              <span className="material-symbols-outlined text-[#10b981]">check_circle</span>
              <span>Foreign key constraint resolution</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-[#f8fafc]">
              <span className="material-symbols-outlined text-[#10b981]">check_circle</span>
              <span>Post-migration seed injection</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-[#334155] bg-[#0b0f19] p-5 shadow-2xl flex flex-col justify-center h-full min-h-[260px] font-code text-xs relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#10b981]/10 blur-[40px] pointer-events-none rounded-full" />
          <div className="flex items-center justify-between border-b border-[#334155]/60 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#10b981] text-[18px]">table_chart</span>
              <span className="font-bold text-[#f8fafc]">create_blogs_table</span>
            </div>
            <span className="text-[10px] bg-[#10b981]/20 text-[#34d399] px-2 py-0.5 rounded font-bold">Migration Scaffold</span>
          </div>
          <div className="space-y-2 text-[#cbd5e1] font-mono">
            <div className="flex justify-between py-1.5 px-2.5 rounded bg-[#1e293b]/60 border-l-2 border-[#ffb690]">
              <span className="text-[#ffb690] font-bold">$table-&gt;id()</span>
              <span className="text-[#64748b]">PRIMARY KEY</span>
            </div>
            <div className="flex justify-between py-1.5 px-2.5 rounded bg-[#1e293b]/30 hover:bg-[#1e293b]/60 transition-colors border-l-2 border-[#38bdf8]">
              <span className="text-[#38bdf8] font-bold">$table-&gt;foreignId('user_id')</span>
              <span className="text-[#64748b]">CONSTRAINED CASCADE</span>
            </div>
            <div className="flex justify-between py-1.5 px-2.5 rounded bg-[#1e293b]/30 hover:bg-[#1e293b]/60 transition-colors border-l-2 border-[#38bdf8]">
              <span className="text-[#38bdf8] font-bold">$table-&gt;string('title')</span>
              <span className="text-[#64748b]">VARCHAR(255)</span>
            </div>
            <div className="flex justify-between py-1.5 px-2.5 rounded bg-[#1e293b]/30 hover:bg-[#1e293b]/60 transition-colors border-l-2 border-[#38bdf8]">
              <span className="text-[#38bdf8] font-bold">$table-&gt;text('content')</span>
              <span className="text-[#64748b]">TEXT</span>
            </div>
            <div className="flex justify-between py-1.5 px-2.5 rounded bg-[#1e293b]/30 hover:bg-[#1e293b]/60 transition-colors border-l-2 border-[#94a3b8]">
              <span className="text-[#94a3b8] font-bold">$table-&gt;timestamps()</span>
              <span className="text-[#64748b]">CREATED_AT, UPDATED_AT</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pagination Navigation */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        <button
          onClick={() => onNavigate('commands')}
          className="group p-6 bg-[#131b2e] border border-[#334155] rounded-xl hover:border-[#ffb690] transition-all text-left shadow-lg"
        >
          <p className="font-code text-[11px] text-[#94a3b8] mb-1 uppercase tracking-wider font-bold">Previous</p>
          <h4 className="text-lg font-bold text-[#f8fafc] group-hover:text-[#ffb690] transition-colors">
            Artisan Commands
          </h4>
        </button>

        <button
          onClick={() => onNavigate('create-module')}
          className="group p-6 bg-[#131b2e] border border-[#334155] rounded-xl hover:border-[#ffb690] transition-all text-right shadow-lg"
        >
          <p className="font-code text-[11px] text-[#94a3b8] mb-1 uppercase tracking-wider font-bold">Next Up</p>
          <h4 className="text-lg font-bold text-[#f8fafc] group-hover:text-[#ffb690] transition-colors">
            Create Module & CLI Reference
          </h4>
        </button>
      </section>
    </div>
  );
};
