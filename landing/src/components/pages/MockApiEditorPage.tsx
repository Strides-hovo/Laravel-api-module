import React, { useState, useEffect } from 'react';
import { PageId } from '../../types';
import {
  fetchDocDataForVersion,
  saveDocDataForVersion,
  getStoredMockApiUrl,
  fetchGitHubStars,
  SUPPORTED_VERSIONS,
  VersionDocData,
} from '../../services/api';
import { CodeBlock } from '../CodeBlock';

interface MockApiEditorPageProps {
  onNavigate: (pageId: PageId) => void;
  onOpenMockApiModal: () => void;
  selectedVersion: string;
  onVersionChange: (ver: string) => void;
  onDataUpdated: () => void;
}

export const MockApiEditorPage: React.FC<MockApiEditorPageProps> = ({
  onNavigate,
  onOpenMockApiModal,
  selectedVersion,
  onVersionChange,
  onDataUpdated,
}) => {
  const [editingVersion, setEditingVersion] = useState<string>(selectedVersion);
  const [formData, setFormData] = useState<Partial<VersionDocData>>({
    releaseName: '',
    releaseDate: '',
    phpRequirement: '',
    laravelRequirement: '',
    description: '',
    installCommand: '',
    features: [],
    sampleCode: '',
    isReleased: true,
  });

  const [newFeatureText, setNewFeatureText] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingStars, setIsFetchingStars] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<{ isError: boolean; message: string } | null>(null);
  const [mockApiUrl, setMockApiUrl] = useState<string>('');

  useEffect(() => {
    setEditingVersion(selectedVersion);
  }, [selectedVersion]);

  useEffect(() => {
    loadVersionData(editingVersion);
    setMockApiUrl(getStoredMockApiUrl());
  }, [editingVersion]);

  const loadVersionData = async (version: string) => {
    setIsLoading(true);
    setSaveStatus(null);
    const res = await fetchDocDataForVersion(version);
    setIsLoading(false);
    if (res.data) {
      setFormData({
        releaseName: res.data.releaseName || '',
        releaseDate: res.data.releaseDate || '',
        phpRequirement: res.data.phpRequirement || '',
        laravelRequirement: res.data.laravelRequirement || '',
        description: res.data.description || '',
        installCommand: res.data.installCommand || '',
        features: Array.isArray(res.data.features) ? [...res.data.features] : [],
        sampleCode: res.data.sampleCode || '',
        githubRepo: res.data.githubRepo || 'laravel/framework',
        githubStars: typeof res.data.githubStars === 'number' ? res.data.githubStars : 1284,
        isReleased: res.data.isReleased !== undefined ? res.data.isReleased : true,
      });
    }
  };

  const handleFetchLiveGitHubStars = async () => {
    const repo = formData.githubRepo || 'laravel/framework';
    setIsFetchingStars(true);
    const stars = await fetchGitHubStars(repo);
    setIsFetchingStars(false);
    if (stars !== null) {
      setFormData((prev) => ({ ...prev, githubStars: stars }));
      setSaveStatus({
        isError: false,
        message: `Successfully fetched ${stars.toLocaleString()} live stars from GitHub repo "${repo}"!`,
      });
    } else {
      setSaveStatus({
        isError: true,
        message: `Could not fetch GitHub stars for "${repo}". Please verify the repository format (e.g. owner/repo).`,
      });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);

    const res = await saveDocDataForVersion(editingVersion, formData);
    setIsSaving(false);

    if (res.success) {
      setSaveStatus({
        isError: false,
        message: res.message,
      });
      onDataUpdated();
    } else {
      setSaveStatus({
        isError: true,
        message: res.message,
      });
    }
  };

  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    setFormData((prev) => ({
      ...prev,
      features: [...(prev.features || []), newFeatureText.trim()],
    }));
    setNewFeatureText('');
  };

  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== index),
    }));
  };

  const handleUpdateFeature = (index: number, val: string) => {
    setFormData((prev) => {
      const updated = [...(prev.features || [])];
      updated[index] = val;
      return { ...prev, features: updated };
    });
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-[#ffb690] font-code text-xs font-bold uppercase tracking-wider">
          <span className="material-symbols-outlined text-[16px]">edit_note</span>
          <span>MOCKAPI RESOURCE & VERSION MANAGER</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-[#f8fafc] tracking-tight">
              Resource Data Editor
            </h1>
            <p className="text-[#94a3b8] text-base md:text-lg max-w-3xl mt-2 leading-relaxed">
              Edit documentation metadata, features, and Artisan commands per version release (<strong>v1.0.0</strong>, <strong>v2.0.0</strong>) and sync updates directly to your MockAPI endpoint.
            </p>
          </div>

          <button
            onClick={onOpenMockApiModal}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold font-code transition-all shrink-0 shadow-lg ${
              mockApiUrl
                ? 'bg-[#10b981]/20 border border-[#10b981]/40 text-[#34d399] hover:bg-[#10b981]/30'
                : 'bg-[#ffb690] text-[#552100] hover:bg-[#ffa26b]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {mockApiUrl ? 'cloud_done' : 'cloud_sync'}
            </span>
            <span>{mockApiUrl ? 'MockAPI Endpoint Connected' : 'Connect MockAPI Endpoint'}</span>
          </button>
        </div>
      </section>

      {/* Endpoint Connection Banner */}
      <div className="bg-[#131b2e] border border-[#334155] rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#ffb690]/10 border border-[#ffb690]/20 flex items-center justify-center text-[#ffb690]">
            <span className="material-symbols-outlined text-[20px]">database</span>
          </div>
          <div>
            <div className="text-xs font-bold text-[#f8fafc]">
              Target MockAPI Resource Status:
            </div>
            <div className="text-xs text-[#94a3b8] font-code mt-0.5">
              {mockApiUrl ? (
                <span className="text-[#38bdf8] truncate block max-w-md">{mockApiUrl}</span>
              ) : (
                <span className="text-[#ffb95f]">
                  Offline / Local Memory Mode. (Edits save locally; connect MockAPI to sync with remote cloud).
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#ffb690] text-[#552100] hover:bg-[#ffa26b] px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 disabled:opacity-50 shrink-0 shadow-lg"
        >
          <span className="material-symbols-outlined text-[18px]">
            {isSaving ? 'sync' : 'save'}
          </span>
          <span>{isSaving ? 'Saving to MockAPI...' : 'Save Changes to MockAPI'}</span>
        </button>
      </div>

      {/* Save Feedback Banner */}
      {saveStatus && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center justify-between gap-3 ${
            saveStatus.isError
              ? 'bg-[#ef4444]/10 border-[#ef4444]/30 text-[#f87171]'
              : 'bg-[#10b981]/10 border-[#10b981]/30 text-[#34d399]'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">
              {saveStatus.isError ? 'error' : 'check_circle'}
            </span>
            <span className="font-medium">{saveStatus.message}</span>
          </div>
          <button
            onClick={() => setSaveStatus(null)}
            className="text-[#94a3b8] hover:text-[#f8fafc]"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Version Tabs */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-[#334155] pb-3 overflow-x-auto">
          <span className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider shrink-0 mr-2">
            Select Version to Edit:
          </span>
          {SUPPORTED_VERSIONS.map((ver) => (
            <button
              key={ver.value}
              onClick={() => {
                setEditingVersion(ver.value);
                onVersionChange(ver.value);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold font-code flex items-center gap-2 transition-all whitespace-nowrap ${
                editingVersion === ver.value
                  ? 'bg-[#ffb690] text-[#552100] shadow-md scale-105'
                  : 'bg-[#1e293b] text-[#94a3b8] hover:bg-[#334155] hover:text-[#f8fafc]'
              }`}
            >
              <span>v{ver.value}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-sans ${
                  editingVersion === ver.value ? 'bg-[#552100]/20 text-[#552100]' : 'bg-[#0b0f19] text-[#7bd0ff]'
                }`}
              >
                {ver.tag}
              </span>
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="bg-[#131b2e] border border-[#334155] rounded-xl p-12 text-center text-[#94a3b8] space-y-3">
            <span className="material-symbols-outlined text-[36px] text-[#ffb690] animate-spin">
              sync
            </span>
            <p className="text-sm font-bold">Loading Version {editingVersion} Data...</p>
          </div>
        ) : (
          /* Editor Form Layout */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Columns: Main Fields */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-[#131b2e] border border-[#334155] rounded-xl p-6 space-y-4 shadow-xl">
                <h3 className="text-base font-bold text-[#f8fafc] flex items-center gap-2 border-b border-[#334155] pb-3">
                  <span className="material-symbols-outlined text-[#ffb690] text-[20px]">info</span>
                  <span>General Version Metadata (v{editingVersion})</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[#94a3b8] font-bold mb-1">
                      Release Name / Tagline
                    </label>
                    <input
                      type="text"
                      value={formData.releaseName || ''}
                      onChange={(e) => setFormData({ ...formData, releaseName: e.target.value })}
                      placeholder="e.g. Automated Action & DTO Update"
                      className="w-full bg-[#0b0f19] border border-[#334155] focus:border-[#ffb690] rounded-lg px-3 py-2 text-[#f8fafc] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#94a3b8] font-bold mb-1">Release Date</label>
                    <input
                      type="text"
                      value={formData.releaseDate || ''}
                      onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                      placeholder="YYYY-MM-DD"
                      className="w-full bg-[#0b0f19] border border-[#334155] focus:border-[#ffb690] rounded-lg px-3 py-2 text-[#f8fafc] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#94a3b8] font-bold mb-1">PHP Requirement</label>
                    <input
                      type="text"
                      value={formData.phpRequirement || ''}
                      onChange={(e) => setFormData({ ...formData, phpRequirement: e.target.value })}
                      placeholder="e.g. 8.2+"
                      className="w-full bg-[#0b0f19] border border-[#334155] focus:border-[#ffb690] rounded-lg px-3 py-2 text-[#f8fafc] outline-none font-code"
                    />
                  </div>

                  <div>
                    <label className="block text-[#94a3b8] font-bold mb-1">Laravel Requirement</label>
                    <input
                      type="text"
                      value={formData.laravelRequirement || ''}
                      onChange={(e) => setFormData({ ...formData, laravelRequirement: e.target.value })}
                      placeholder="e.g. 10+ (10, 11, 12, 13+)"
                      className="w-full bg-[#0b0f19] border border-[#334155] focus:border-[#ffb690] rounded-lg px-3 py-2 text-[#f8fafc] outline-none font-code"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#94a3b8] font-bold text-xs mb-1">
                    Version Description & Summary
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Briefly describe what this version introduces..."
                    className="w-full bg-[#0b0f19] border border-[#334155] focus:border-[#ffb690] rounded-lg p-3 text-xs text-[#f8fafc] outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[#94a3b8] font-bold text-xs mb-1">
                    Composer Install Command
                  </label>
                  <input
                    type="text"
                    value={formData.installCommand || ''}
                    onChange={(e) => setFormData({ ...formData, installCommand: e.target.value })}
                    placeholder="composer require strides/laravel-api-module:^1.5"
                    className="w-full bg-[#0b0f19] border border-[#334155] focus:border-[#ffb690] rounded-lg px-3 py-2 text-xs text-[#7bd0ff] font-code outline-none"
                  />
                </div>

                <div className="bg-[#1e293b]/60 border border-[#334155] rounded-xl p-4 space-y-3 mt-4">
                  <label className="block text-[#f8fafc] font-bold text-xs">
                    Release Status (Released or Roadmap?):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className={`flex items-start gap-3 cursor-pointer p-3 rounded-xl border transition-all ${
                      formData.isReleased !== false
                        ? 'bg-[#10b981]/10 border-[#10b981] shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                        : 'bg-[#0b0f19] border-[#334155] hover:border-[#10b981]/50'
                    }`}>
                      <input
                        type="radio"
                        name="releaseStatus"
                        checked={formData.isReleased !== false}
                        onChange={() => setFormData({ ...formData, isReleased: true })}
                        className="mt-0.5 w-4 h-4 text-[#10b981] focus:ring-0 cursor-pointer accent-[#10b981]"
                      />
                      <div>
                        <div className="text-xs font-bold text-[#10b981] flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px]">verified</span>
                          Released (Ready for use)
                        </div>
                        <div className="text-[11px] text-[#94a3b8] mt-1 leading-normal">
                          The version is officially released, stable, and available for installation via Composer.
                        </div>
                      </div>
                    </label>

                    <label className={`flex items-start gap-3 cursor-pointer p-3 rounded-xl border transition-all ${
                      formData.isReleased === false
                        ? 'bg-[#f59e0b]/10 border-[#f59e0b] shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                        : 'bg-[#0b0f19] border-[#334155] hover:border-[#f59e0b]/50'
                    }`}>
                      <input
                        type="radio"
                        name="releaseStatus"
                        checked={formData.isReleased === false}
                        onChange={() => setFormData({ ...formData, isReleased: false })}
                        className="mt-0.5 w-4 h-4 text-[#f59e0b] focus:ring-0 cursor-pointer accent-[#f59e0b]"
                      />
                      <div>
                        <div className="text-xs font-bold text-[#f59e0b] flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px]">engineering</span>
                          Roadmap (Planned)
                        </div>
                        <div className="text-[11px] text-[#94a3b8] mt-1 leading-normal">
                          Planned features and concepts. Shows a warning banner indicating the feature is still in development.
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* GitHub Star Count & Repo Sync */}
              <div className="bg-[#131b2e] border border-[#334155] rounded-xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#334155] pb-3">
                  <h3 className="text-base font-bold text-[#f8fafc] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#ffb690] text-[20px]">
                      star
                    </span>
                    <span>GitHub Star Count & Repository Sync</span>
                  </h3>
                  <span className="text-[11px] font-code text-[#ffb690] bg-[#1e293b] px-2 py-0.5 rounded">
                    ★ {formData.githubStars || 0}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[#94a3b8] font-bold mb-1">
                      GitHub Repository (owner/repo)
                    </label>
                    <input
                      type="text"
                      value={formData.githubRepo || ''}
                      onChange={(e) => setFormData({ ...formData, githubRepo: e.target.value })}
                      placeholder="e.g. laravel/framework or owner/repo"
                      className="w-full bg-[#0b0f19] border border-[#334155] focus:border-[#ffb690] rounded-lg px-3 py-2 text-[#f8fafc] outline-none font-code"
                    />
                  </div>

                  <div>
                    <label className="block text-[#94a3b8] font-bold mb-1">
                      Displayed Star Count (Manual Override)
                    </label>
                    <input
                      type="number"
                      value={formData.githubStars ?? 1284}
                      onChange={(e) =>
                        setFormData({ ...formData, githubStars: parseInt(e.target.value, 10) || 0 })
                      }
                      className="w-full bg-[#0b0f19] border border-[#334155] focus:border-[#ffb690] rounded-lg px-3 py-2 text-[#f8fafc] outline-none font-code"
                    />
                  </div>
                </div>

                <div className="pt-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <p className="text-[11px] text-[#94a3b8]">
                    Click to query GitHub's public REST API and update the star count automatically:
                  </p>

                  <button
                    type="button"
                    onClick={handleFetchLiveGitHubStars}
                    disabled={isFetchingStars}
                    className="bg-[#1e293b] hover:bg-[#334155] border border-[#ffb690]/40 text-[#ffb690] px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shrink-0 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isFetchingStars ? 'sync' : 'cloud_download'}
                    </span>
                    <span>{isFetchingStars ? 'Fetching Stars...' : 'Fetch Live Stars via API'}</span>
                  </button>
                </div>
              </div>

              {/* Introduced Commands & Key Features List */}
              <div className="bg-[#131b2e] border border-[#334155] rounded-xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#334155] pb-3">
                  <h3 className="text-base font-bold text-[#f8fafc] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#38bdf8] text-[20px]">
                      terminal
                    </span>
                    <span>New Features & Artisan Commands Introduced in v{editingVersion}</span>
                  </h3>
                  <span className="text-[11px] font-code text-[#ffb690] bg-[#1e293b] px-2 py-0.5 rounded">
                    {formData.features?.length || 0} features
                  </span>
                </div>

                <p className="text-xs text-[#94a3b8]">
                  List specific features or Artisan commands that became available in this release (e.g. "PHP 8.2+ Readonly DTO Auto-mapping", "module:make-action generator"):
                </p>

                {/* Add New Feature */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeatureText}
                    onChange={(e) => setNewFeatureText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddFeature()}
                    placeholder="Add a new command or capability (e.g. module:make-transformer)"
                    className="flex-1 bg-[#0b0f19] border border-[#334155] focus:border-[#ffb690] text-xs text-[#f8fafc] rounded-lg px-3 py-2 outline-none"
                  />
                  <button
                    onClick={handleAddFeature}
                    className="bg-[#38bdf8]/20 hover:bg-[#38bdf8]/30 border border-[#38bdf8]/40 text-[#38bdf8] px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    <span>Add Item</span>
                  </button>
                </div>

                {/* Feature List */}
                <div className="space-y-2 pt-2">
                  {formData.features && formData.features.length > 0 ? (
                    formData.features.map((feat, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-[#0b0f19] border border-[#334155] p-2.5 rounded-lg group"
                      >
                        <span className="material-symbols-outlined text-[16px] text-[#ffb690] shrink-0">
                          check_circle
                        </span>
                        <input
                          type="text"
                          value={feat}
                          onChange={(e) => handleUpdateFeature(index, e.target.value)}
                          className="flex-1 bg-transparent text-xs text-[#f8fafc] outline-none border-b border-transparent focus:border-[#ffb690]"
                        />
                        <button
                          onClick={() => handleRemoveFeature(index)}
                          className="p-1 text-[#94a3b8] hover:text-[#ef4444] transition-colors"
                          title="Remove item"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-xs text-[#64748b]">
                      No features listed for version {editingVersion} yet. Add one above!
                    </div>
                  )}
                </div>
              </div>

              {/* Sample Code Snippet */}
              <div className="bg-[#131b2e] border border-[#334155] rounded-xl p-6 space-y-3 shadow-xl">
                <h3 className="text-base font-bold text-[#f8fafc] flex items-center gap-2 border-b border-[#334155] pb-3">
                  <span className="material-symbols-outlined text-[#a78bfa] text-[20px]">
                    code
                  </span>
                  <span>Version Sample Code Snippet</span>
                </h3>

                <p className="text-xs text-[#94a3b8]">
                  Code example displayed on the version overview page:
                </p>

                <textarea
                  rows={8}
                  value={formData.sampleCode || ''}
                  onChange={(e) => setFormData({ ...formData, sampleCode: e.target.value })}
                  placeholder="// PHP / Laravel code snippet..."
                  className="w-full bg-[#0b0f19] border border-[#334155] focus:border-[#ffb690] rounded-lg p-3 text-xs text-[#7bd0ff] font-code outline-none leading-relaxed"
                />
              </div>
            </div>

            {/* Right Column: Live MockAPI Payload Preview */}
            <div className="space-y-6">
              <div className="bg-[#131b2e] border border-[#334155] rounded-xl p-6 space-y-4 shadow-xl sticky top-20">
                <div className="flex items-center justify-between border-b border-[#334155] pb-3">
                  <h3 className="text-sm font-bold text-[#f8fafc] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#10b981] text-[18px]">
                      preview
                    </span>
                    <span>Live MockAPI JSON Payload</span>
                  </h3>
                  <span className="text-[10px] font-code text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/20 px-2 py-0.5 rounded">
                    PUT /version_docs
                  </span>
                </div>

                <p className="text-xs text-[#94a3b8]">
                  This object is synchronized to your MockAPI endpoint upon saving:
                </p>

                <CodeBlock
                  title={`Payload (version: ${editingVersion})`}
                  code={JSON.stringify(
                    {
                      version: editingVersion,
                      releaseName: formData.releaseName,
                      releaseDate: formData.releaseDate,
                      phpRequirement: formData.phpRequirement,
                      laravelRequirement: formData.laravelRequirement,
                      description: formData.description,
                      installCommand: formData.installCommand,
                      githubRepo: formData.githubRepo,
                      githubStars: formData.githubStars,
                      isReleased: formData.isReleased !== undefined ? formData.isReleased : true,
                      featuresCount: formData.features?.length || 0,
                      features: formData.features,
                    },
                    null,
                    2
                  )}
                  showLineNumbers
                />

                <div className="pt-2">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full bg-[#ffb690] text-[#552100] hover:bg-[#ffa26b] py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isSaving ? 'sync' : 'cloud_upload'}
                    </span>
                    <span>
                      {isSaving ? 'Saving to MockAPI...' : `Sync Version ${editingVersion} to MockAPI`}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Footer Navigation */}
      <div className="pt-6 border-t border-[#334155] flex justify-between items-center">
        <button
          onClick={() => onNavigate('instructions')}
          className="flex items-center gap-2 text-xs font-bold text-[#94a3b8] hover:text-[#f8fafc] transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Documentation Home</span>
        </button>

        <button
          onClick={() => onNavigate('commands')}
          className="flex items-center gap-2 text-xs font-bold text-[#ffb690] hover:text-[#ffa26b] transition-colors"
        >
          <span>Artisan Commands</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
