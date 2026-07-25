import React, { useState } from 'react';
import { PageId } from '../../types';
import { CodeBlock } from '../CodeBlock';
import { VersionDocData } from '../../services/api';

interface CreateModulePageProps {
  onNavigate: (pageId: PageId) => void;
  onOpenCli: () => void;
  docData?: VersionDocData | null;
}

export const CreateModulePage: React.FC<CreateModulePageProps> = ({ onNavigate, onOpenCli, docData }) => {
  const [moduleName, setModuleName] = useState('Order');
  const [flags, setFlags] = useState({
    all: true,
    controller: false,
    model: false,
    migration: false,
    action: false,
  });

  const toggleFlag = (key: keyof typeof flags) => {
    if (key === 'all') {
      const nextAll = !flags.all;
      setFlags({
        all: nextAll,
        controller: !nextAll,
        model: !nextAll,
        migration: !nextAll,
        action: !nextAll,
      });
    } else {
      setFlags((prev) => {
        const next = { ...prev, [key]: !prev[key], all: false };
        return next;
      });
    }
  };

  const constructCommand = () => {
    const clean = moduleName.trim().replace(/[^a-zA-Z0-9]/g, '') || 'Order';
    let cmd = `php artisan module:make-module ${clean}`;
    if (flags.all) {
      cmd += ' --all';
    } else {
      if (flags.controller) cmd += ' --controller';
      if (flags.model) cmd += ' --model';
      if (flags.migration) cmd += ' --migration';
      if (flags.action) cmd += ' --action';
    }
    return cmd;
  };

  return (
      <div className="space-y-12">
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-[#ffb690] font-code text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">terminal</span>
            <span>ARTISAN CLI REFERENCE</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#f8fafc] tracking-tight">
            Create Module & Commands
          </h1>
          <p className="text-[#94a3b8] text-base md:text-lg max-w-2xl leading-relaxed">
            Full reference guide for all Artisan CLI scaffolding commands provided by the Laravel API Module toolkit.
          </p>
        </section>

        {/* Interactive Command Generator Form */}
        <section className="bg-[#131b2e] border border-[#334155] rounded-xl p-6 md:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#334155] pb-4">
            <div>
              <h3 className="text-xl font-bold text-[#f8fafc]">Command Builder</h3>
              <p className="text-xs text-[#94a3b8]">Configure your flags to build the exact command you need</p>
            </div>
            <button
                onClick={onOpenCli}
                className="px-4 py-2 bg-[#ffb690] text-[#552100] font-bold text-xs rounded-lg hover:shadow-[0_0_15px_rgba(255,182,144,0.4)] transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">terminal</span>
              <span>Run in CLI Simulator</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-code font-bold text-[#94a3b8] mb-1">
                Module Name
              </label>
              <input
                  type="text"
                  value={moduleName}
                  onChange={(e) => setModuleName(e.target.value)}
                  className="w-full max-w-md bg-[#0b0f19] border border-[#334155] text-[#f8fafc] font-code text-sm px-3.5 py-2 rounded-lg focus:outline-none focus:border-[#ffb690]"
                  placeholder="e.g. UserManagement"
              />
            </div>

            <div>
              <label className="block text-xs font-code font-bold text-[#94a3b8] mb-2">
                Scaffolding Flags
              </label>
              <div className="flex flex-wrap gap-3">
                {[
                  { key: 'all' as const, label: '--all (Full Module)' },
                  { key: 'controller' as const, label: '--controller' },
                  { key: 'model' as const, label: '--model' },
                  { key: 'migration' as const, label: '--migration' },
                  { key: 'action' as const, label: '--action' },
                ].map(({ key, label }) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => toggleFlag(key)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-code font-bold border transition-all ${
                            flags[key]
                                ? 'bg-[#ffb690]/20 border-[#ffb690] text-[#ffb690]'
                                : 'bg-[#1e293b] border-[#334155] text-[#94a3b8] hover:text-[#f8fafc]'
                        }`}
                    >
                      {label}
                    </button>
                ))}
              </div>
            </div>

            <CodeBlock title="Generated Artisan Command" code={constructCommand()} />
          </div>
        </section>

        {/* Complete Command Table */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-[#f8fafc]">All Artisan Commands</h2>

          <div className="overflow-x-auto rounded-xl border border-[#334155] bg-[#131b2e] shadow-xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#161b22] border-b border-[#334155] font-code text-xs text-[#94a3b8] uppercase">
              <tr>
                <th className="px-6 py-3.5">Command</th>
                <th className="px-6 py-3.5">Description</th>
                <th className="px-6 py-3.5">Arguments / Options</th>
              </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]/60 font-code text-xs">

              <tr className="hover:bg-[#1e293b]/50">
                <td className="px-6 py-4 text-[#ffb690] font-bold">module:make</td>
                <td className="px-6 py-4 text-[#f8fafc]">Scaffold a new domain-driven API module</td>
                <td className="px-6 py-4 text-[#7bd0ff]">&lt;Name&gt; [--all] [--controller] [--model]</td>
              </tr>
              <tr className="hover:bg-[#1e293b]/50">
                <td className="px-6 py-4 text-[#ffb690] font-bold">module:migrate</td>
                <td className="px-6 py-4 text-[#f8fafc]">Execute database migrations for a specific module</td>
                <td className="px-6 py-4 text-[#7bd0ff]">&lt;Name&gt; [--force]</td>
              </tr>
              <tr className="hover:bg-[#1e293b]/50">
                <td className="px-6 py-4 text-[#ffb690] font-bold">module:migrate-rollback</td>
                <td className="px-6 py-4 text-[#f8fafc]">Rollback database migrations for a specific module</td>
                <td className="px-6 py-4 text-[#7bd0ff]">&lt;Name&gt; [--step=1]</td>
              </tr>
              <tr className="hover:bg-[#1e293b]/50">
                <td className="px-6 py-4 text-[#ffb690] font-bold">module:enable</td>
                <td className="px-6 py-4 text-[#f8fafc]">Enable a module in the manifest</td>
                <td className="px-6 py-4 text-[#7bd0ff]">&lt;Name&gt;</td>
              </tr>
              <tr className="hover:bg-[#1e293b]/50">
                <td className="px-6 py-4 text-[#ffb690] font-bold">module:disable</td>
                <td className="px-6 py-4 text-[#f8fafc]">Disable a module in the manifest</td>
                <td className="px-6 py-4 text-[#7bd0ff]">&lt;Name&gt;</td>
              </tr>
              <tr className="hover:bg-[#1e293b]/50">
                <td className="px-6 py-4 text-[#ffb690] font-bold">module:optimize</td>
                <td className="px-6 py-4 text-[#f8fafc]">Synchronize physical module directories with manifest and clear cache</td>
                <td className="px-6 py-4 text-[#94a3b8]">None</td>
              </tr>
              <tr className="hover:bg-[#1e293b]/50">
                <td className="px-6 py-4 text-[#ffb690] font-bold">module:delete</td>
                <td className="px-6 py-4 text-[#f8fafc]">Rollback migrations, export JSONL database backup, and delete directory</td>
                <td className="px-6 py-4 text-[#7bd0ff]">&lt;Name&gt; [--force]</td>
              </tr>
              <tr className="hover:bg-[#1e293b]/50">
                <td className="px-6 py-4 text-[#ffb690] font-bold">module:list</td>
                <td className="px-6 py-4 text-[#f8fafc]">List all installed modules, status, path existence, and directory paths</td>
                <td className="px-6 py-4 text-[#94a3b8]">None</td>
              </tr>
              <tr className="hover:bg-[#1e293b]/50">
                <td className="px-6 py-4 text-[#ffb690] font-bold">module:publish-stubs</td>
                <td className="px-6 py-4 text-[#f8fafc]">Publish editable stub template files to stubs/module/</td>
                <td className="px-6 py-4 text-[#94a3b8]">None</td>
              </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Pagination Navigation */}
        <section className="flex justify-between items-center pt-6">
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
              onClick={() => onNavigate('migrations')}
              className="group p-6 bg-[#131b2e] border border-[#334155] rounded-xl hover:border-[#ffb690] transition-all text-right shadow-lg"
          >
            <p className="font-code text-[11px] text-[#94a3b8] mb-1 uppercase tracking-wider font-bold">Next Up</p>
            <h4 className="text-lg font-bold text-[#f8fafc] group-hover:text-[#ffb690] transition-colors">
              Migrations & Schema
            </h4>
          </button>
        </section>
      </div>
  );
};
