import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  getStoredMockApiUrl,
  setStoredMockApiUrl,
  formatMockApiResourceUrl,
  seedMockApiData,
  fetchDocDataForVersion,
  SUPPORTED_VERSIONS,
  VersionDocData
} from '../services/api';

interface MockApiModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVersion: string;
  onDataUpdated: () => void;
}

export const MockApiModal: React.FC<MockApiModalProps> = ({
  isOpen,
  onClose,
  selectedVersion,
  onDataUpdated,
}) => {
  const [apiUrl, setApiUrl] = useState<string>('');
  const [formattedUrl, setFormattedUrl] = useState<string>('');
  const [isSeeding, setIsSeeding] = useState<boolean>(false);
  const [seedMessage, setSeedMessage] = useState<{ text: string; isError?: boolean } | null>(null);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ status: 'idle' | 'success' | 'error'; message: string; rawData?: any }>({
    status: 'idle',
    message: '',
  });

  useEffect(() => {
    if (isOpen) {
      const current = getStoredMockApiUrl();
      setApiUrl(current);
      if (current) {
        setFormattedUrl(formatMockApiResourceUrl(current));
        testConnection(current);
      } else {
        setTestResult({
          status: 'idle',
          message: 'No MockAPI URL configured yet. Enter your mockapi.io endpoint below to start sync.',
        });
      }
    }
  }, [isOpen]);

  const handleUrlChange = (val: string) => {
    setApiUrl(val);
    setFormattedUrl(formatMockApiResourceUrl(val));
  };

  const handleSave = () => {
    setStoredMockApiUrl(apiUrl);
    onDataUpdated();
    if (apiUrl.trim()) {
      testConnection(apiUrl);
    }
  };

  const testConnection = async (urlToTest?: string) => {
    const url = urlToTest || apiUrl;
    if (!url.trim()) {
      setTestResult({ status: 'error', message: 'Please enter a valid MockAPI URL.' });
      return;
    }

    setIsTesting(true);
    setTestResult({ status: 'idle', message: 'Connecting to MockAPI endpoint...' });

    const result = await fetchDocDataForVersion(selectedVersion, url);
    setIsTesting(false);

    if (result.isFromMockApi && !result.error) {
      setTestResult({
        status: 'success',
        message: `Successfully connected to MockAPI! Version "${selectedVersion}" data loaded.`,
        rawData: result.data,
      });
    } else if (result.error) {
      setTestResult({
        status: 'error',
        message: result.error,
        rawData: result.data,
      });
    } else {
      setTestResult({
        status: 'error',
        message: 'Could not connect to MockAPI. Using default offline fallback schema.',
      });
    }
  };

  const handleSeed = async () => {
    if (!apiUrl.trim()) {
      setSeedMessage({ text: 'Please enter your MockAPI endpoint URL first!', isError: true });
      return;
    }

    setIsSeeding(true);
    setSeedMessage({ text: 'Seeding MockAPI resource with v1.0, v1.5, and v2.0 data schemas...' });

    const seedRes = await seedMockApiData(apiUrl);
    setIsSeeding(false);

    if (seedRes.success) {
      setSeedMessage({ text: seedRes.message, isError: false });
      setStoredMockApiUrl(apiUrl);
      onDataUpdated();
      testConnection(apiUrl);
    } else {
      setSeedMessage({ text: seedRes.message, isError: true });
    }
  };

  const handleClear = () => {
    setApiUrl('');
    setStoredMockApiUrl('');
    setTestResult({ status: 'idle', message: 'Cleared custom MockAPI URL. Reverted to built-in fallback dataset.' });
    setSeedMessage(null);
    onDataUpdated();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080d1a]/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#131b2e] border border-[#334155] rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl space-y-6 text-[#f8fafc] max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#334155]/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ffb690]/10 border border-[#ffb690]/30 flex items-center justify-center text-[#ffb690]">
                <span className="material-symbols-outlined text-[24px]">cloud_sync</span>
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">MockAPI.io Data Integration</h2>
                <p className="text-xs text-[#94a3b8]">
                  Connect your mockapi.io resource to dynamically fetch versioned documentation
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1e293b] rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Info Banner */}
          <div className="bg-[#1e293b]/70 border border-[#334155] p-4 rounded-xl text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#ffb95f]">
              <span className="material-symbols-outlined text-[18px]">info</span>
              <span>How MockAPI Versioning Works</span>
            </div>
            <p className="text-[#94a3b8] leading-relaxed">
              When you select different versions (<strong>1.0.0</strong>, <strong>1.5.0</strong>, or <strong>2.0.0</strong>) in the application selector, data is dynamically requested from your <code>mockapi.io</code> project. If your resources are currently empty, click <strong>"Seed MockAPI Resource"</strong> below to automatically populate them!
            </p>
          </div>

          {/* Endpoint Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
              Your MockAPI Project Base URL (no resource name at the end)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://6789abc.mockapi.io/api/v1"
                className="flex-1 bg-[#0b1326] border border-[#334155] focus:border-[#ffb690] text-[#f8fafc] text-sm font-code rounded-lg px-3.5 py-2.5 outline-none transition-colors"
              />
              <button
                onClick={handleSave}
                className="bg-[#ffb690] text-[#552100] hover:bg-[#ffa370] font-bold text-xs px-4 py-2.5 rounded-lg transition-all"
              >
                Save & Connect
              </button>
            </div>
            {formattedUrl && (
              <p className="text-[11px] font-code text-[#7bd0ff]">
                Main resource target: <span className="underline">{formattedUrl}</span>
              </p>
            )}
          </div>

          {/* Actions & Seed Button */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleSeed}
              disabled={isSeeding || !apiUrl.trim()}
              className="flex items-center justify-center gap-2 bg-[#ffb95f]/10 border border-[#ffb95f]/40 hover:bg-[#ffb95f]/20 disabled:opacity-50 text-[#ffb95f] font-bold text-xs py-3 px-4 rounded-xl transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isSeeding ? 'sync' : 'database'}
              </span>
              <span>{isSeeding ? 'Seeding MockAPI...' : 'Seed MockAPI Resource'}</span>
            </button>

            <button
              onClick={() => testConnection()}
              disabled={isTesting || !apiUrl.trim()}
              className="flex items-center justify-center gap-2 bg-[#222a3d] border border-[#334155] hover:border-[#ffb690]/50 text-[#f8fafc] font-bold text-xs py-3 px-4 rounded-xl transition-all disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isTesting ? 'sync' : 'network_check'}
              </span>
              <span>Test Fetching Active Version ({selectedVersion})</span>
            </button>
          </div>

          {/* Seed Feedback Message */}
          {seedMessage && (
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
                seedMessage.isError
                  ? 'bg-[#ef4444]/10 border-[#ef4444]/30 text-[#f87171]'
                  : 'bg-[#10b981]/10 border-[#10b981]/30 text-[#34d399]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {seedMessage.isError ? 'error' : 'check_circle'}
              </span>
              <span>{seedMessage.text}</span>
            </div>
          )}

          {/* Test Connection Status & Raw JSON Preview */}
          <div className="space-y-2 pt-2 border-t border-[#334155]/60">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#94a3b8] uppercase tracking-wider">
                Connection & Data Status
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold font-code ${
                  testResult.status === 'success'
                    ? 'bg-[#10b981]/20 text-[#34d399]'
                    : testResult.status === 'error'
                    ? 'bg-[#ef4444]/20 text-[#f87171]'
                    : 'bg-[#334155] text-[#94a3b8]'
                }`}
              >
                {testResult.status === 'success'
                  ? 'MockAPI Active'
                  : testResult.status === 'error'
                  ? 'Fallback Mode'
                  : 'Standby'}
              </span>
            </div>

            <p className="text-xs text-[#94a3b8]">{testResult.message}</p>

            {testResult.rawData && (
              <div className="bg-[#0b0f19] p-3 rounded-xl border border-[#334155] overflow-x-auto max-h-40 font-code text-[11px] text-[#7bd0ff]">
                <pre>{JSON.stringify({
                  version: testResult.rawData.version,
                  releaseName: testResult.rawData.releaseName,
                  phpRequirement: testResult.rawData.phpRequirement,
                  navGroupsCount: testResult.rawData.navGroups?.length,
                  envVariablesCount: testResult.rawData.envVariables?.length,
                  searchResultsCount: testResult.rawData.searchResults?.length,
                }, null, 2)}</pre>
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-[#334155]/60">
            {apiUrl ? (
              <button
                onClick={handleClear}
                className="text-xs text-[#ef4444] hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">delete</span>
                <span>Disconnect MockAPI</span>
              </button>
            ) : <div />}

            <button
              onClick={onClose}
              className="bg-[#1e293b] hover:bg-[#334155] text-[#f8fafc] font-bold text-xs px-5 py-2.5 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
