import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageId } from '../types';
import { VersionDocData } from '../services/api';

interface PreArchitectedHeroCardProps {
  onOpenCli?: () => void;
  onNavigate?: (page: PageId) => void;
  docData?: VersionDocData | null;
}

export const PreArchitectedHeroCard: React.FC<PreArchitectedHeroCardProps> = ({
  onOpenCli,
  onNavigate,
  docData,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'blog' | 'order' | 'auth'>('blog');
  const [animKey, setAnimKey] = useState(0);

  const handleCopyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTabChange = (tab: 'blog' | 'order' | 'auth') => {
    setActiveTab(tab);
    setAnimKey((prev) => prev + 1);
  };

  const handleReplay = () => {
    setAnimKey((prev) => prev + 1);
  };

  const commandText = `php artisan module:make ${activeTab === 'blog' ? 'Blog' : activeTab === 'order' ? 'Order' : 'Auth'}`;

  const filesList = [
    { path: `Controllers/${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}Controller.php`, type: 'Controller' },
    { path: `Models/${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}.php`, type: 'Model' },
    { path: `Migrations/2026_07_24_create_${activeTab}s_table.php`, type: 'Migration' },
    { path: `Routes/api.php`, type: 'Routes' },
    { path: `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}ServiceProvider.php`, type: 'Provider' },
  ];

  return (
    <div className="relative rounded-2xl border border-[#334155]/80 bg-gradient-to-b from-[#131b2e] via-[#0b0f19] to-[#070b12] p-5 sm:p-7 shadow-2xl overflow-hidden group">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#ffb690]/10 blur-[60px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#38bdf8]/5 blur-[50px] pointer-events-none rounded-full" />

      {/* Optional Roadmap / Released badge at top right */}
      {docData && (
        <div className="flex justify-end mb-2 relative z-10">
          {docData.isReleased === false ? (
            <span className="px-2.5 py-0.5 rounded-full border border-[#f59e0b]/50 bg-[#f59e0b]/15 text-[#f59e0b] font-code text-[10px] font-bold flex items-center gap-1 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
              <span className="material-symbols-outlined text-[13px]">engineering</span>
              <span>Roadmap v{docData.version}</span>
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full border border-[#10b981]/40 bg-[#10b981]/10 text-[#34d399] font-code text-[10px] font-bold flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
              <span className="material-symbols-outlined text-[13px]">verified</span>
              <span>Released v{docData.version}</span>
            </span>
          )}
        </div>
      )}

      {/* Header title */}
      <div className="text-center space-y-3 relative z-10">
        <h3 className="text-2xl sm:text-3xl font-black font-code text-[#f8fafc] tracking-wide leading-tight uppercase">
          Pre-architected <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffb690] to-[#ffa06d]">for Laravel API</span><br />
          from the very first command
        </h3>
        <p className="text-xs sm:text-sm text-[#94a3b8] max-w-md mx-auto leading-relaxed">
          One toolkit for generating clean, isolated modules: controller, model, migration, and routes — with a single artisan command, no manual boilerplate.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-5 relative z-10">
        <button
          onClick={onOpenCli}
          className="px-4 py-2.5 rounded-xl bg-[#ffb690] hover:bg-[#ffa06d] text-[#0f172a] font-bold text-xs sm:text-sm transition-all shadow-[0_0_20px_rgba(255,182,144,0.25)] hover:shadow-[0_0_25px_rgba(255,182,144,0.4)] flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <span className="material-symbols-outlined text-[17px]">terminal</span>
          <span>Install via Composer</span>
        </button>

        <button
          onClick={() => onNavigate?.('requirements')}
          className="px-4 py-2.5 rounded-xl border border-[#334155] bg-[#1e293b]/60 hover:bg-[#1e293b] hover:border-[#7bd0ff]/50 text-[#cbd5e1] hover:text-white font-medium text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
        >
          <span className="material-symbols-outlined text-[17px]">menu_book</span>
          <span>Documentation</span>
        </button>
      </div>

      {/* Terminal Module Simulator */}
      <div className="mt-6 relative rounded-xl border border-[#334155]/80 bg-[#070b12] shadow-2xl overflow-hidden font-code text-xs">
        {/* Corner HUD framing brackets */}
        <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#7bd0ff]/60 rounded-tl pointer-events-none z-20"></span>
        <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#7bd0ff]/60 rounded-tr pointer-events-none z-20"></span>
        <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#7bd0ff]/60 rounded-bl pointer-events-none z-20"></span>
        <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#7bd0ff]/60 rounded-br pointer-events-none z-20"></span>

        {/* Window Title Bar */}
        <div className="bg-[#131b2e] px-3.5 py-2.5 border-b border-[#334155]/60 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]/80 inline-block"></span>
            <span className="text-[11px] text-[#7bd0ff] font-bold ml-2">module:make</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReplay}
              title="Replay generation animation"
              className="text-[#94a3b8] hover:text-[#7bd0ff] transition-colors p-1 rounded hover:bg-[#1e293b] flex items-center gap-1 text-[10px] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">refresh</span>
              <span className="hidden sm:inline">Replay</span>
            </button>

            {/* Interactive Module selector pills */}
            <div className="flex items-center gap-1 bg-[#0b0f19] p-0.5 rounded-lg border border-[#334155]/50">
              {(['blog', 'order', 'auth'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase transition-all cursor-pointer ${
                    activeTab === tab
                      ? 'bg-[#ffb690] text-[#0f172a] shadow-sm'
                      : 'text-[#64748b] hover:text-[#cbd5e1]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="p-4 space-y-3 relative z-10 text-[12px] sm:text-[13px] leading-relaxed">
          {/* Interactive Command Line */}
          <motion.div 
            key={`cmd-${activeTab}-${animKey}`}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => handleCopyCommand(commandText)}
            title="Click to copy the command"
            className="flex items-center justify-between bg-[#1e293b]/50 hover:bg-[#1e293b] px-3 py-2 rounded-lg border border-[#ffb690]/30 hover:border-[#ffb690] cursor-pointer transition-all group/cmd"
          >
            <div className="flex items-center gap-2 text-[#ffb690] font-bold font-mono truncate">
              <span className="text-[#38bdf8] font-normal select-none">$</span>
              <span>{commandText}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#94a3b8] group-hover/cmd:text-white transition-colors shrink-0 ml-2">
              <span className="material-symbols-outlined text-[15px]">
                {copied ? 'check_circle' : 'content_copy'}
              </span>
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
            </div>
          </motion.div>

          {/* Directory Tree Visualization with Staggered Animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`tree-${activeTab}-${animKey}`}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.08,
                    delayChildren: 0.1,
                  },
                },
              }}
              className="pl-1.5 space-y-1.5 text-[#e2e8f0] font-mono text-xs sm:text-[12.5px] pt-1"
            >
              {/* Root Modules directory (NO app folder!) */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: -10, filter: 'blur(4px)' },
                  visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.25 } }
                }}
                className="flex items-center gap-2 text-[#cbd5e1] hover:text-white transition-colors"
              >
                <span className="text-[#f59e0b] select-none">📁</span>
                <span className="font-bold text-[#ffb690]">Modules/</span>
              </motion.div>

              {/* Active Module directory */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: -10, filter: 'blur(4px)' },
                  visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.25 } }
                }}
                className="flex items-center gap-2 text-[#cbd5e1] pl-4 hover:text-white transition-colors"
              >
                <span className="text-[#38bdf8] select-none">📁</span>
                <span className="font-bold text-[#f8fafc] capitalize">{activeTab}/</span>
              </motion.div>

              {/* Generated files list */}
              {filesList.map((file) => (
                <motion.div
                  key={file.path}
                  variants={{
                    hidden: { opacity: 0, x: -12, filter: 'blur(4px)' },
                    visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.25 } }
                  }}
                  className="flex items-center justify-between pl-8 py-0.5 rounded hover:bg-white/5 transition-colors group/file"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[15px] text-[#34d399] select-none">check</span>
                    <span className="text-[#94a3b8] group-hover/file:text-[#e2e8f0] transition-colors">
                      {file.path}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#64748b] bg-[#1e293b]/60 px-1.5 py-0.5 rounded opacity-0 group-hover/file:opacity-100 transition-opacity">
                    {file.type}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

