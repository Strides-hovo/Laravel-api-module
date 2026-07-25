import React from 'react';
import { PageId } from '../../types';
import { CodeBlock } from '../CodeBlock';

interface InstallationPageProps {
  onNavigate: (pageId: PageId) => void;
}

export const InstallationPage: React.FC<InstallationPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[#94a3b8] font-code text-[11px] font-bold tracking-wider uppercase">
        <button onClick={() => onNavigate('instructions')} className="hover:text-[#ffb690] transition-colors">
          DOCS
        </button>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span>GET STARTED</span>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-[#ffb95f]">INSTALLATION & SETUP</span>
      </div>

      {/* Page Header */}
      <section className="space-y-4">
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#f8fafc] tracking-tight">
          Installation & Setup
        </h1>
        <p className="text-[#94a3b8] text-base md:text-lg max-w-2xl leading-relaxed">
          Get up and running with the Laravel API Module in minutes. Our streamlined installation process ensures you spend more time building and less time configuring boilerplate.
        </p>
      </section>

      {/* Hero Quick Start Card */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ffb690] to-[#7bd0ff] rounded-xl blur opacity-15 group-hover:opacity-25 transition duration-1000" />
        <div className="relative bg-[#1e293b] rounded-xl border border-[#334155] overflow-hidden shadow-2xl">
          <div className="grid md:grid-cols-2">
            <div className="p-8 flex flex-col justify-center space-y-4">
              <div className="flex items-center gap-2 text-[#ffb95f] font-code text-xs font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                <span>QUICK START</span>
              </div>
              <h3 className="text-2xl font-bold text-[#f8fafc] leading-tight">
                Master your API architecture today.
              </h3>
              <p className="text-sm text-[#94a3b8] leading-relaxed">
                Deploy robust, modular API structures with a single command. The Strides framework is built for performance and modularity.
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => onNavigate('commands')}
                  className="bg-[#ffb690] text-[#552100] px-6 py-2.5 rounded-lg font-bold hover:shadow-[0_0_20px_rgba(255,182,144,0.3)] transition-all text-sm"
                >
                  Commands List
                </button>
                <button
                  onClick={() => onNavigate('instructions')}
                  className="border border-[#334155] bg-white/5 text-[#f8fafc] px-6 py-2.5 rounded-lg font-bold hover:bg-white/10 transition-all text-sm"
                >
                  View Demo
                </button>
              </div>
            </div>

            <div className="relative p-6 bg-[#070b12] border-l border-[#334155]/80 flex flex-col justify-center font-code text-xs text-[#cbd5e1] space-y-3 overflow-hidden">
              <div className="flex items-center gap-2 pb-2 border-b border-[#334155]/60 text-[#7bd0ff] font-bold">
                <span className="material-symbols-outlined text-[16px]">terminal</span>
                <span>composer output</span>
              </div>
              <div className="space-y-1.5 font-mono text-[11px] sm:text-xs">
                <div className="text-[#38bdf8]">$ composer require strides/laravel-api-module</div>
                <div className="text-[#94a3b8]">./composer.json has been updated</div>
                <div className="text-[#34d399] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                  <span>Loading composer repositories with package information</span>
                </div>
                <div className="text-[#34d399] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                  <span>Updating dependencies</span>
                </div>
                <div className="text-[#ffb690] pl-4 font-bold">- Installing strides/laravel-api-module (v1.0.0)</div>
                <div className="text-[#94a3b8] pt-1">Generating optimized autoload files</div>
                <div className="text-[#10b981] font-bold">&gt; Package manifest generated successfully.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Installation Steps */}
      <div className="space-y-12 pl-2">
        {/* Step 1 */}
        <div className="relative flex gap-6 md:gap-8 group">
          <div className="absolute left-[15px] top-[32px] bottom-[-48px] w-0.5 bg-[#334155]" />
          <div className="relative z-10 shrink-0 w-8 h-8 rounded-full border-2 border-[#ffb690] bg-[#0b1326] flex items-center justify-center font-bold text-[#ffb690] text-sm">
            1
          </div>
          <div className="flex-1 space-y-3">
            <h4 className="text-xl font-bold text-[#f8fafc]">Install Package</h4>
            <p className="text-sm text-[#94a3b8]">Pull the module framework into your Laravel application using Composer.</p>
            <CodeBlock title="Terminal" code="composer require strides/laravel-api-module" />
          </div>
        </div>

        {/* Step 2 */}
        <div className="relative flex gap-6 md:gap-8 group">
          <div className="absolute left-[15px] top-[32px] bottom-[-48px] w-0.5 bg-[#334155]" />
          <div className="relative z-10 shrink-0 w-8 h-8 rounded-full border-2 border-[#ffb690] bg-[#0b1326] flex items-center justify-center font-bold text-[#ffb690] text-sm">
            2
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <h4 className="text-xl font-bold text-[#f8fafc]">Publish Configuration</h4>
              <span className="bg-[#2d3449] text-[#94a3b8] px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider font-code">
                Optional
              </span>
            </div>
            <p className="text-sm text-[#94a3b8]">Publish the service provider assets if you need to customize default paths or behaviors.</p>
            <CodeBlock title="Terminal" code='php artisan vendor:publish --provider="Strides\Module\Providers\ModuleServiceProvider"' />
          </div>
        </div>

        {/* Step 3 */}
        <div className="relative flex gap-6 md:gap-8 group">
          <div className="absolute left-[15px] top-[32px] bottom-[-48px] w-0.5 bg-[#334155]" />
          <div className="relative z-10 shrink-0 w-8 h-8 rounded-full border-2 border-[#ffb690] bg-[#0b1326] flex items-center justify-center font-bold text-[#ffb690] text-sm">
            3
          </div>
          <div className="flex-1 space-y-3">
            <h4 className="text-xl font-bold text-[#f8fafc]">Configure Autoloader</h4>
            <p className="text-sm text-[#94a3b8]">
              Add the Modules namespace to your <code className="bg-[#1e293b] px-1.5 py-0.5 rounded text-[#ffb690] font-code">composer.json</code> to enable PSR-4 autoloading for generated modules.
            </p>
            <CodeBlock
              title="composer.json"
              code={`{
    "autoload": {
        "psr-4": {
            "App\\\\": "app/",
            "Modules\\\\": "Modules/"
        }
    }
}`}
            />
            <div className="flex items-start gap-3 bg-[#ffb690]/5 border-l-4 border-[#ffb690] p-4 rounded-r-lg">
              <span className="material-symbols-outlined text-[#ffb690] text-[20px] mt-0.5">info</span>
              <p className="text-xs text-[#e0c0b1]">
                Remember to run <code className="text-[#ffb690] font-bold font-code">composer dump-autoload</code> after modifying this file.
              </p>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="relative flex gap-6 md:gap-8 group">
          <div className="absolute left-[15px] top-[32px] bottom-[-48px] w-0.5 bg-[#334155]" />
          <div className="relative z-10 shrink-0 w-8 h-8 rounded-full border-2 border-[#ffb690] bg-[#0b1326] flex items-center justify-center font-bold text-[#ffb690] text-sm">
            4
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <h4 className="text-xl font-bold text-[#f8fafc]">Add Modules Test Suite</h4>
              <span className="bg-[#2d3449] text-[#94a3b8] px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider font-code">
                Optional
              </span>
            </div>
            <p className="text-sm text-[#94a3b8]">
              Add the Modules test suite to <code className="bg-[#1e293b] px-1.5 py-0.5 rounded text-[#ffb690] font-code">phpunit.xml</code> so PHPUnit / Pest automatically discovers module unit & feature tests.
            </p>
            <CodeBlock
              title="phpunit.xml"
              code={`<testsuites>
    <testsuite name="Modules">
        <directory suffix="Test.php">Modules/*/Tests/*</directory>
    </testsuite>
</testsuites>`}
            />
          </div>
        </div>

        {/* Step 5 */}
        <div className="relative flex gap-6 md:gap-8 group">
          <div className="relative z-10 shrink-0 w-8 h-8 rounded-full border-2 border-[#ffb690] bg-[#0b1326] flex items-center justify-center font-bold text-[#ffb690] text-sm">
            5
          </div>
          <div className="flex-1 space-y-3">
            <h4 className="text-xl font-bold text-[#f8fafc]">Generate First Module</h4>
            <p className="text-sm text-[#94a3b8]">You're ready! Create your first API module and start building.</p>
            <CodeBlock title="Terminal" code="php artisan module:make Blog" />
          </div>
        </div>
      </div>

      {/* CTA Bottom Banner */}
      <div className="p-8 border border-[#334155] rounded-2xl bg-[#131b2e] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <h3 className="text-xl font-bold text-[#f8fafc] mb-1">Ready to explore commands?</h3>
          <p className="text-sm text-[#94a3b8]">Browse all available Artisan commands for generation, migrations, and management.</p>
        </div>
        <button
          onClick={() => onNavigate('commands')}
          className="flex items-center gap-2 bg-[#7bd0ff] text-[#00354a] px-8 py-3 rounded-lg font-bold hover:shadow-[0_0_20px_rgba(123,208,255,0.3)] transition-all shrink-0"
        >
          <span>Artisan Commands List</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
