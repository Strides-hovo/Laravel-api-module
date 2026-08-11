import React, { useState } from 'react';
import { PageId } from '../../types';
import { CodeBlock } from '../CodeBlock';
import { generateModuleFiles } from '../../data/docData';
import { VersionDocData } from '../../services/api';
import { PreArchitectedHeroCard } from '../PreArchitectedHeroCard';
import TerminalDemo from "@/src/components/TerminalDemo.tsx";

interface InstructionsPageProps {
  onNavigate: (pageId: PageId) => void;
  onOpenCli: () => void;
  docData?: VersionDocData | null;
}

export const InstructionsPage: React.FC<InstructionsPageProps> = ({ onNavigate, onOpenCli, docData }) => {
  const [interactiveModuleName, setInteractiveModuleName] = useState('Blog');
  const generatedFiles = generateModuleFiles(interactiveModuleName);
  const [activeFileIndex, setActiveFileIndex] = useState(0);

  const activeFile = generatedFiles[activeFileIndex] || generatedFiles[0];

  const version = docData?.version || '1.0.0';
  const releaseName = docData?.releaseName || 'Genesis Release';
  const description = docData?.description || 'One toolkit for generating clean, isolated modules: controller, model, migration, and routes — with a single artisan command.';
  const installCmd = docData?.installCommand || `composer require strides/laravel-api-module:^${version}`;

  return (
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-xl bg-[#131b2e] p-8 md:p-10 border border-[#334155] shadow-2xl">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#ffb690]/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#7bd0ff]/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col items-start gap-6">
            <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full border border-[#ffb690]/30 bg-[#ffb690]/10 text-[#ffb690] font-code text-[11px] tracking-widest font-bold uppercase">
              VERSION {version} ACTIVE
            </span>
              <span className="px-3 py-1 rounded-full border border-[#7bd0ff]/30 bg-[#7bd0ff]/10 text-[#7bd0ff] font-code text-[11px] font-bold">
              {releaseName}
            </span>
              {docData?.isReleased === false ? (
                  <span className="px-3 py-1 rounded-full border border-[#f59e0b]/50 bg-[#f59e0b]/15 text-[#f59e0b] font-code text-[11px] font-bold flex items-center gap-1.5 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                <span className="material-symbols-outlined text-[15px]">engineering</span>
                <span>ROADMAP / NOT YET RELEASED</span>
              </span>
              ) : (
                  <span className="px-3 py-1 rounded-full border border-[#10b981]/40 bg-[#10b981]/10 text-[#34d399] font-code text-[11px] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                <span>RELEASED</span>
              </span>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-[#f8fafc] tracking-tight leading-tight">
              Laravel API Module
            </h1>

            <p className="text-base md:text-lg text-[#94a3b8] max-w-2xl leading-relaxed">
              {description}
            </p>

            {docData?.isReleased === false && (
                <div className="w-full bg-[#1e293b]/90 border border-[#f59e0b]/50 rounded-xl p-4 md:p-5 flex items-start gap-3.5 shadow-lg my-1">
                  <div className="p-2.5 bg-[#f59e0b]/15 rounded-xl text-[#f59e0b] shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[24px]">lightbulb</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm md:text-base font-bold text-[#f8fafc] flex items-center gap-2 flex-wrap">
                      <span>💡 Planned Features & Improvements (Roadmap)</span>
                      <span className="bg-[#f59e0b] text-[#0f172a] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider font-code">In Planning</span>
                    </h3>
                    <p className="text-xs md:text-sm text-[#cbd5e1] leading-relaxed">
                      Version <strong>{version} ({releaseName})</strong> is in the design stage. The features, commands, and architecture described below are our concept of what's planned for future releases. You can edit these plans in the Resource Editor.
                    </p>
                  </div>
                </div>
            )}

            <div className="w-full max-w-xl my-2">
              <CodeBlock title="Quick Installation" code={installCmd} />
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                  onClick={() => onNavigate('installation')}
                  className="px-6 py-3 bg-[#ffb690] text-[#552100] font-bold rounded-lg shadow-[0_4px_14px_rgba(255,182,144,0.4)] hover:shadow-[0_6px_20px_rgba(255,182,144,0.6)] hover:bg-[#ffb690]/90 transition-all active:scale-95"
              >
                Installation & Setup
              </button>

              <button
                  onClick={() => onNavigate('commands')}
                  className="px-6 py-3 bg-transparent border border-[#334155] text-[#7bd0ff] font-bold rounded-lg hover:bg-[#222a3d] hover:border-[#7bd0ff]/50 transition-all flex items-center gap-2"
              >
                <span>Artisan Commands</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="bg-[#131b2e] border border-[#334155] rounded-xl p-6 md:p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#10b981]/15 text-[#10b981] rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">balance</span>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-[#f8fafc]">Why Strides</h2>
              <p className="text-xs md:text-sm text-[#94a3b8] mt-0.5">
                Built API-first, from day one — not a generic module generator with API support bolted on.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto -mx-2 px-2">
            <table className="w-full border-collapse min-w-[560px]">
              <thead>
                <tr>
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-[#94a3b8] pb-3 pr-4 border-b border-[#334155]">
                    Feature
                  </th>
                  <th className="text-center text-xs font-bold uppercase tracking-wider text-[#ffb690] pb-3 px-4 border-b border-[#334155] w-[140px]">
                    Strides
                  </th>
                  <th className="text-center text-xs font-bold uppercase tracking-wider text-[#94a3b8] pb-3 pl-4 border-b border-[#334155] w-[140px]">
                    Other packages
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    label: 'Built exclusively for REST APIs (no web/views scaffolding)',
                    ours: true,
                    theirs: false,
                  },
                  {
                    label: 'Generated files ship pre-wired (Controller → Action → Repository)',
                    ours: true,
                    theirs: false,
                  },
                  {
                    label: 'Working CRUD endpoint in ~10 seconds',
                    ours: true,
                    theirs: false,
                  },
                  {
                    label: 'API versioning built into the module architecture',
                    ours: true,
                    theirs: false,
                  },
                  {
                    label: 'Idempotent generation — safe to re-run, nothing is silently overwritten',
                    ours: true,
                    theirs: false,
                  },
                  {
                    label: 'Enable/disable individual API versions via config, no code changes',
                    ours: true,
                    theirs: false,
                  },
                ].map((row, idx) => (
                    <tr key={idx} className="border-b border-[#334155]/60 last:border-b-0">
                      <td className="py-3 pr-4 text-sm text-[#e2e8f0]">{row.label}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="material-symbols-outlined text-[20px] text-[#10b981] align-middle">
                          check_circle
                        </span>
                      </td>
                      <td className="py-3 pl-4 text-center">
                        {row.theirs ? (
                            <span className="material-symbols-outlined text-[20px] text-[#10b981] align-middle">
                              check_circle
                            </span>
                        ) : (
                            <span className="material-symbols-outlined text-[20px] text-[#64748b] align-middle">
                              cancel
                            </span>
                        )}
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Dynamic Features & Commands from Resource Editor */}
        {docData?.features && docData.features.length > 0 && (
            <section className="bg-[#131b2e] border-2 border-[#38bdf8]/50 rounded-xl p-6 md:p-8 shadow-[0_0_30px_rgba(56,189,248,0.15)] space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#334155] pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#38bdf8]/20 text-[#38bdf8] rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">terminal</span>
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-[#f8fafc] flex items-center gap-2 flex-wrap">
                      <span>✨ What's new in v{version}: Commands and functions</span>

                    </h2>

                  </div>
                </div>
                <button
                    onClick={() => onNavigate('commands')}
                    className="px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-[#7bd0ff] font-bold rounded-lg text-xs transition-all flex items-center gap-1.5 border border-[#334155]"
                >
                  <span>See all Artisan commands</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                {docData.features.map((feat, idx) => {
                  const isCmd = feat.includes(':') || feat.toLowerCase().includes('command') || feat.startsWith('module') || feat.startsWith('php ') || feat.startsWith('make');
                  return (
                      <div key={idx} className="bg-[#0b0f19] border border-[#334155] hover:border-[#38bdf8]/60 p-4 rounded-xl transition-all flex items-start gap-3 group">
                  <span className={`material-symbols-outlined text-[20px] shrink-0 mt-0.5 ${isCmd ? 'text-[#38bdf8]' : 'text-[#10b981]'}`}>
                    {isCmd ? 'terminal' : 'check_circle'}
                  </span>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-[#f8fafc] font-code break-words">
                            {feat}
                          </div>
                          <div className="text-xs text-[#94a3b8] mt-1">
                            {isCmd ? 'Available in Artisan CLI' : 'Feature of v' + version}
                          </div>
                        </div>
                      </div>
                  );
                })}
              </div>


            </section>
        )}

        {/* Architectural Discipline Section */}
        <section className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-6 space-y-6">
              <h2 className="text-2xl font-bold text-[#f8fafc]">Architectural Discipline</h2>
              <p className="text-[#94a3b8] text-base leading-relaxed">
                Stop wasting time manually creating boilerplates. The Laravel API Module forces a domain-driven structure that keeps your codebase clean, searchable, and ready for enterprise growth.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full border border-[#ffb690]/40 bg-[#ffb690]/10 flex items-center justify-center text-[#ffb690] font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-[#f8fafc] text-base">Run the Command</h4>
                    <p className="text-[#94a3b8] text-sm">Execute the generator with your target module name.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full border border-[#334155] bg-[#171f33] flex items-center justify-center text-[#94a3b8] font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-[#f8fafc] text-base">Instant Isolation</h4>
                    <p className="text-[#94a3b8] text-sm">
                      Everything is generated inside <code className="bg-[#1e293b] text-[#ffb690] px-1.5 py-0.5 rounded font-code text-xs">Modules/ModuleName</code> (at project root).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-6">

              <TerminalDemo />
            </div>
          </div>

          {/* Terminal Code Visual & Directory Architecture Block */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CodeBlock
                title="1. Artisan Console Output"
                showCopy={false}
                code={`$ php artisan module:make-module Order

Creating module Order
INFO  [Route] created successfully.
INFO  [Controller] created successfully.
INFO  [Module] Order scaffolded successfully.`}
            />

            <CodeBlock
                title="2. Full Module Directory Architecture"
                showCopy={false}
                code={`Modules/
└── Order/
    ├── Actions/
    │   ├── OrderDestroyAction.php
    │   ├── OrderIndexAction.php
    │   ├── OrderShowAction.php
    │   ├── OrderStoreAction.php
    │   └── OrderUpdateAction.php
    ├── Casts/
    │   └── OrderCast.php
    ├── Config/
    │   └── config.php
    ├── Console/
    │   └── Commands/
    │       └── OrderCommand.php
    ├── Database/
    │   ├── Factories/
    │   │   └── OrderFactory.php
    │   ├── Migrations/
    │   │   └── 2026_07_24_124752_create_order_table.php
    │   └── Seeders/
    │       └── OrderSeeder.php
    ├── Dto/
    │   └── OrderDto.php
    ├── Entities/
    │   └── Order.php
    ├── Events/
    ├── Http/
    │   ├── Controllers/
    │   │   └── OrderController.php
    │   ├── Middleware/
    │   │   └── OrderMiddleware.php
    │   ├── Requests/
    │   │   └── OrderRequest.php
    │   ├── Resources/
    │   │   └── OrderResource.php
    │   ├── Rules/
    │   │   └── OrderRule.php
    │   └── Transformers/
    ├── Jobs/
    │   └── OrderJob.php
    ├── Listeners/
    │   └── OrderListener.php
    ├── Mail/
    │   └── OrderMail.php
    ├── Notification/
    │   └── OrderNotification.php
    ├── Policies/
    │   └── OrderPolicy.php
    ├── Providers/
    │   ├── OrderServiceProvider.php
    │   └── RouteServiceProvider.php
    ├── Repositories/
    │   └── OrderRepository.php
    ├── resources/
    │   └── views/
    │       └── mail/
    │           └── order-mail.blade.php
    ├── Routes/
    │   └── api.php
    ├── Services/
    │   └── OrderService.php
    ├── Tests/
    │   ├── Feature/
    │   │   └── OrderTest.php
    │   └── Unit/
    │       └── OrderTest.php
    └── Http.http`}
            />
          </div>

          {/* Configuration Notice Note */}
          <div className="bg-[#171f33] border border-[#ffb690]/30 rounded-xl p-4 flex items-center gap-3 text-xs text-[#94a3b8]">
            <span className="material-symbols-outlined text-[#ffb690] text-[22px] shrink-0">settings_suggest</span>
            <div>
              <span className="font-bold text-[#f8fafc]">Customizable via Package Config: </span>
              You can enable or disable specific generators (Actions, Dto, Jobs, Mail, Policies, etc.) by publishing the configuration file:
              <code className="ml-1 bg-[#0b0f19] text-[#7bd0ff] px-2 py-0.5 rounded font-code">php artisan vendor:publish --tag=module-config</code>
            </div>
          </div>
        </section>

        {/* Interactive Live Generator Section */}
        <section className="bg-[#131b2e] border border-[#334155] rounded-xl p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#334155] pb-4">
            <div>
              <div className="flex items-center gap-2 text-[#ffb690] text-xs font-code font-bold uppercase tracking-wider mb-1">
                <span className="material-symbols-outlined text-[16px]">terminal</span>
                <span>Interactive Scaffolding Playground</span>
              </div>
              <h3 className="text-xl font-bold text-[#f8fafc]">Test Scaffold Generation Live</h3>
            </div>

            <button
                onClick={onOpenCli}
                className="self-start sm:self-auto px-3.5 py-1.5 bg-[#ffb690] text-[#552100] font-bold text-xs rounded-lg hover:shadow-[0_0_15px_rgba(255,182,144,0.4)] transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              <span>Launch CLI Terminal</span>
            </button>
          </div>

          {/* Module Input */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch">
            <div className="flex-1 flex items-center bg-[#0b0f19] border border-[#334155] rounded-lg px-3 py-2 font-code text-sm">
              <span className="text-[#ffb690] font-bold mr-2">php artisan module:make-module</span>
              <input
                  type="text"
                  value={interactiveModuleName}
                  onChange={(e) => setInteractiveModuleName(e.target.value)}
                  placeholder="e.g. Order"
                  className="bg-transparent text-[#7bd0ff] font-bold focus:outline-none flex-1"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {['Order', 'Product'].map((name) => (
                  <button
                      key={name}
                      onClick={() => setInteractiveModuleName(name)}
                      className={`px-3 py-1.5 text-xs font-code rounded-lg border transition-colors ${
                          interactiveModuleName === name
                              ? 'bg-[#ffb690]/20 border-[#ffb690] text-[#ffb690]'
                              : 'bg-[#1e293b] border-[#334155] text-[#94a3b8] hover:text-[#f8fafc]'
                      }`}
                  >
                    {name}
                  </button>
              ))}
            </div>
          </div>

          {/* Tabbed Generated Code Viewer */}
          <div className="bg-[#0b0f19] rounded-lg border border-[#334155] overflow-hidden">
            <div className="bg-[#161b22] px-4 py-2 border-b border-[#334155] flex items-center gap-2 overflow-x-auto">
              {generatedFiles.map((file, idx) => (
                  <button
                      key={idx}
                      onClick={() => setActiveFileIndex(idx)}
                      className={`px-3 py-1 rounded text-xs font-code transition-colors whitespace-nowrap ${
                          activeFileIndex === idx
                              ? 'bg-[#ffb690] text-[#552100] font-bold'
                              : 'text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#222a3d]'
                      }`}
                  >
                    {file.path.replace(`Modules/${interactiveModuleName.trim().replace(/[^a-zA-Z0-9]/g, '') || 'Order'}/`, '')}
                  </button>
              ))}
            </div>

            <CodeBlock
                title={activeFile.path}
                code={activeFile.content}
                showLineNumbers
            />
          </div>
        </section>

        {/* Next Step Banner */}
        <section className="bg-[#171f33] border border-[#334155] rounded-xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-lg font-bold text-[#f8fafc] mb-1">Ready to install Laravel API Module?</h4>
            <p className="text-sm text-[#94a3b8]">Follow our step-by-step Composer installation guide.</p>
          </div>
          <button
              onClick={() => onNavigate('installation')}
              className="px-6 py-2.5 bg-[#ffb690] text-[#552100] font-bold rounded-lg hover:shadow-[0_0_15px_rgba(255,182,144,0.4)] transition-all shrink-0 flex items-center gap-2"
          >
            <span>Installation Guide</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </section>
      </div>
  );
};
