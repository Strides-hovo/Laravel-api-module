import React, { useState } from 'react';
import { generateModuleFiles } from '../data/docData';
import { GeneratedFile } from '../types';

interface InteractiveCliModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InteractiveCliModal: React.FC<InteractiveCliModalProps> = ({ isOpen, onClose }) => {
  const [commandInput, setCommandInput] = useState('php artisan module:make-module Order');
  const [outputLogs, setOutputLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'terminal' | 'generated-files'>('terminal');
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<GeneratedFile | null>(null);

  if (!isOpen) return null;

  const handleRunCommand = (cmdToRun?: string) => {
    const cmd = cmdToRun || commandInput;
    const trimmed = cmd.trim();

    if (!trimmed) return;

    let newLogs: string[] = [`$ ${trimmed}`];

    if (trimmed.includes('module:make') || trimmed.includes('make-module') || trimmed.includes('make:api-module')) {
      const parts = trimmed.split(/\s+/);
      const nameIndex = parts.findIndex(p => p.includes('module') || p.includes('make')) + 1;
      const modName = parts[nameIndex] || 'Order';

      const files = generateModuleFiles(modName);
      setGeneratedFiles(files);
      setSelectedFile(files[0]);

      newLogs = [
        ...newLogs,
        `Creating module ${modName}`,
        `INFO  [Route] created successfully.`,
        `INFO  [Config] created successfully.`,
        `INFO  [Route_service_provider] created successfully.`,
        `INFO  [Service_provider] created successfully.`,
        `INFO  [Model] created successfully.`,
        `INFO  [Migration] created successfully.`,
        `INFO  [Seeder] created successfully.`,
        `INFO  [Repository] created successfully.`,
        `INFO  [Transformer] created successfully.`,
        `INFO  [Controller] created successfully.`,
        `INFO  [Action] created successfully.`,
        `INFO  [Request] created successfully.`,
        `INFO  [Http] created successfully.`
      ];
      setActiveTab('generated-files');
    } else if (trimmed.includes('module:enable') || trimmed.includes('module enable')) {
      const parts = trimmed.split(/\s+/);
      const modName = parts[parts.length - 1] && !parts[parts.length - 1].includes('module') ? parts[parts.length - 1] : 'Order';
      newLogs = [
        ...newLogs,
        `INFO  Module [${modName}] has been enabled successfully.`
      ];
    } else if (trimmed.includes('module:disable') || trimmed.includes('module disable')) {
      const parts = trimmed.split(/\s+/);
      const modName = parts[parts.length - 1] && !parts[parts.length - 1].includes('module') ? parts[parts.length - 1] : 'Order';
      newLogs = [
        ...newLogs,
        `INFO  Module [${modName}] has been disabled successfully.`
      ];
    } else if (trimmed.includes('module:optimize') || trimmed.includes('module optimize')) {
      newLogs = [
        ...newLogs,
        `INFO  Checking and synchronizing physical module files with modules status manifest...`,
        `INFO  [Legacy] directory missing on disk. Removed stale record from modules manifest.`,
        `INFO  Synchronized [Order] and [Product] statuses with manifest.`,
        `INFO  Module routes, bindings, and class maps optimized successfully.`
      ];
    } else if (trimmed.includes('module:delete') || trimmed.includes('module delete')) {
      const parts = trimmed.split(/\s+/);
      const modName = parts[parts.length - 1] && !parts[parts.length - 1].includes('module') ? parts[parts.length - 1] : 'Order';
      const snakeName = modName.toLowerCase();
      newLogs = [
        ...newLogs,
        `INFO  Preparing to delete module [${modName}]...`,
        `INFO  Exporting database tables backup in JSONL format...`,
        `INFO  Backup saved to [storage/app/modules/backups/${snakeName}_2026_07_24_131700.jsonl].`,
        `INFO  Rolling back database migrations for module [${modName}]...`,
        `INFO  [2026_07_24_124752_create_${snakeName}_table] rolled back successfully.`,
        `INFO  Deleting module directory [Modules/${modName}]...`,
        `INFO  Module [${modName}] and database records deleted successfully.`
      ];
    } else if (trimmed.includes('module:list')) {
      newLogs = [
        ...newLogs,
        `+------------+-----------+--------------+----------------------------------+`,
        `| Module     | Status    | Path exists  | Path                             |`,
        `+------------+-----------+--------------+----------------------------------+`,
        `| Product    | Enabled   | ✓            | /var/www/Modules/Product         |`,
        `| Orders     | Disabled  | ✓            | /var/www/Modules/Orders          |`,
        `| Legacy     | Enabled   | ✗ Missing    | /var/www/Modules/Legacy          |`,
        `+------------+-----------+--------------+----------------------------------+`,
        ``,
        `Total: 3  Enabled: 2  Disabled: 1  Missing: 1`
      ];
    } else {
      newLogs = [
        ...newLogs,
        `Command executed: ${trimmed}`,
        `Process finished with exit code 0.`
      ];
    }

    setOutputLogs(newLogs);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-4xl bg-[#171f33] border border-[#334155] rounded-xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">
        {/* Modal Header */}
        <div className="bg-[#131b2e] px-6 py-4 border-b border-[#334155] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#ffb690]/10 border border-[#ffb690]/30 flex items-center justify-center text-[#ffb690]">
              <span className="material-symbols-outlined text-[20px]">terminal</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#f8fafc]">Artisan CLI Interactive Sandbox</h3>
              <p className="text-xs text-[#94a3b8]">Simulate Laravel API Module Artisan commands in real-time</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-[#0b0f19] p-1 rounded-lg border border-[#334155]">
              <button
                onClick={() => setActiveTab('terminal')}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  activeTab === 'terminal' ? 'bg-[#ffb690] text-[#552100]' : 'text-[#94a3b8] hover:text-[#f8fafc]'
                }`}
              >
                Terminal Log
              </button>
              <button
                onClick={() => setActiveTab('generated-files')}
                className={`px-3 py-1 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'generated-files' ? 'bg-[#ffb690] text-[#552100]' : 'text-[#94a3b8] hover:text-[#f8fafc]'
                }`}
              >
                <span>Generated Code</span>
                {generatedFiles.length > 0 && (
                  <span className="bg-[#552100]/20 px-1.5 py-0.2 rounded-full text-[10px]">
                    {generatedFiles.length}
                  </span>
                )}
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-[#94a3b8] hover:text-[#f8fafc] rounded-lg hover:bg-[#222a3d]"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Quick Command Selector Bar */}
        <div className="bg-[#0b0f19] px-6 py-2.5 border-b border-[#334155] flex items-center gap-2 overflow-x-auto text-xs font-code">
          <span className="text-[#94a3b8] whitespace-nowrap">Quick Presets:</span>
          <button
            onClick={() => {
              const cmd = 'php artisan module:make-module Order';
              setCommandInput(cmd);
              handleRunCommand(cmd);
            }}
            className="bg-[#1f293d] hover:bg-[#ffb690]/20 hover:text-[#ffb690] text-[#7bd0ff] px-2.5 py-1 rounded border border-[#334155] whitespace-nowrap transition-colors"
          >
            module:make-module Order
          </button>
          <button
            onClick={() => {
              const cmd = 'php artisan module:enable Order';
              setCommandInput(cmd);
              handleRunCommand(cmd);
            }}
            className="bg-[#1f293d] hover:bg-[#ffb690]/20 hover:text-[#ffb690] text-[#7bd0ff] px-2.5 py-1 rounded border border-[#334155] whitespace-nowrap transition-colors"
          >
            module:enable
          </button>
          <button
            onClick={() => {
              const cmd = 'php artisan module:disable Order';
              setCommandInput(cmd);
              handleRunCommand(cmd);
            }}
            className="bg-[#1f293d] hover:bg-[#ffb690]/20 hover:text-[#ffb690] text-[#7bd0ff] px-2.5 py-1 rounded border border-[#334155] whitespace-nowrap transition-colors"
          >
            module:disable
          </button>
          <button
            onClick={() => {
              const cmd = 'php artisan module:optimize';
              setCommandInput(cmd);
              handleRunCommand(cmd);
            }}
            className="bg-[#1f293d] hover:bg-[#ffb690]/20 hover:text-[#ffb690] text-[#7bd0ff] px-2.5 py-1 rounded border border-[#334155] whitespace-nowrap transition-colors"
          >
            module:optimize
          </button>
          <button
            onClick={() => {
              const cmd = 'php artisan module:delete Order';
              setCommandInput(cmd);
              handleRunCommand(cmd);
            }}
            className="bg-[#1f293d] hover:bg-[#ffb690]/20 hover:text-[#ffb690] text-[#7bd0ff] px-2.5 py-1 rounded border border-[#334155] whitespace-nowrap transition-colors"
          >
            module:delete
          </button>
          <button
            onClick={() => {
              const cmd = 'php artisan module:list';
              setCommandInput(cmd);
              handleRunCommand(cmd);
            }}
            className="bg-[#1f293d] hover:bg-[#ffb690]/20 hover:text-[#ffb690] text-[#7bd0ff] px-2.5 py-1 rounded border border-[#334155] whitespace-nowrap transition-colors"
          >
            module:list
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-hidden bg-[#0b0f19] p-6 flex flex-col">
          {activeTab === 'terminal' ? (
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              <div className="flex-1 overflow-y-auto font-code text-sm text-[#f8fafc] leading-relaxed space-y-1 pr-2">
                {outputLogs.length === 0 ? (
                  <div className="text-[#94a3b8] italic py-8 text-center">
                    Type a command below or click a quick preset to run Artisan module commands!
                  </div>
                ) : (
                  outputLogs.map((log, idx) => (
                    <div key={idx} className="whitespace-pre-wrap">
                      {log.startsWith('$') ? (
                        <span className="text-[#ffb690] font-bold">{log}</span>
                      ) : log.includes('scaffolding') ? (
                        <span className="text-[#7bd0ff]">{log}</span>
                      ) : (
                        log
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Command Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRunCommand();
                }}
                className="mt-4 flex items-center gap-3 bg-[#131b2e] border border-[#334155] p-2 rounded-lg"
              >
                <span className="font-code text-[#10b981] font-bold pl-2">$</span>
                <input
                  type="text"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  placeholder="php artisan module:make Order"
                  className="flex-1 bg-transparent text-[#f8fafc] font-code text-sm focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#ffb690] text-[#552100] font-bold px-4 py-1.5 rounded-md text-xs hover:shadow-[0_0_15px_rgba(255,182,144,0.4)] transition-all"
                >
                  Run Command
                </button>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex gap-4 overflow-hidden">
              {/* File Tree List */}
              <div className="w-64 bg-[#131b2e] border border-[#334155] rounded-lg p-3 overflow-y-auto space-y-1">
                <span className="text-xs font-code font-bold text-[#ffb95f] uppercase tracking-wider block mb-2 px-2">
                  Generated Structure
                </span>
                {generatedFiles.length === 0 ? (
                  <p className="text-xs text-[#94a3b8] px-2 italic">Run a generator command first</p>
                ) : (
                  generatedFiles.map((file, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedFile(file)}
                      className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-code truncate transition-colors flex items-center gap-2 ${
                        selectedFile?.path === file.path
                          ? 'bg-[#ffb690]/15 text-[#ffb690] border-l-2 border-[#ffb690]'
                          : 'text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1e293b]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {file.type === 'controller' ? 'description' : file.type === 'model' ? 'database' : 'schema'}
                      </span>
                      <span className="truncate">{file.path.split('/').slice(2).join('/') || file.path}</span>
                    </button>
                  ))
                )}
              </div>

              {/* Code Viewer */}
              <div className="flex-1 bg-[#131b2e] border border-[#334155] rounded-lg flex flex-col overflow-hidden">
                {selectedFile ? (
                  <>
                    <div className="bg-[#161b22] px-4 py-2 border-b border-[#334155] flex items-center justify-between">
                      <span className="font-code text-xs text-[#ffb690]">{selectedFile.path}</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(selectedFile.content)}
                        className="text-xs text-[#94a3b8] hover:text-[#ffb690] flex items-center gap-1 font-code"
                      >
                        <span className="material-symbols-outlined text-[16px]">content_copy</span>
                        Copy
                      </button>
                    </div>
                    <div className="p-4 flex-1 overflow-y-auto font-code text-xs leading-relaxed text-[#f8fafc] whitespace-pre">
                      {selectedFile.content}
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-xs text-[#94a3b8] italic">
                    Select a generated file from the left sidebar to preview code
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
