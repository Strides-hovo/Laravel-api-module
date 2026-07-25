import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageId } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { InteractiveCliModal } from './components/InteractiveCliModal';
import { MockApiModal } from './components/MockApiModal';
import { fetchDocDataForVersion, getStoredMockApiUrl, fetchGitHubStars, VersionDocData } from './services/api';

// Pages
import { InstructionsPage } from './components/pages/InstructionsPage';
import { InstallationPage } from './components/pages/InstallationPage';
import { CommandsPage } from './components/pages/CommandsPage';
import { MigrationsPage } from './components/pages/MigrationsPage';
import { RequirementsPage } from './components/pages/RequirementsPage';
import { CreateModulePage } from './components/pages/CreateModulePage';
import { TransformerPage } from './components/pages/TransformerPage';
import { MockApiEditorPage } from './components/pages/MockApiEditorPage';
import { CommunityPage } from './components/pages/CommunityPage';
import { AdminAuthModal } from './components/AdminAuthModal';

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('instructions');
  const [selectedVersion, setSelectedVersion] = useState<string>('1.0.0');
  const [starCount, setStarCount] = useState<number>(1284);
  const [isStarred, setIsStarred] = useState<boolean>(false);

  // Admin Auth State
  const [isAdminAuthorized, setIsAdminAuthorized] = useState<boolean>(() => {
    return sessionStorage.getItem('isAdminAuthorized') === 'true';
  });
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState<boolean>(false);

  // Dynamic Version Data State from MockAPI / Fallback
  const [docData, setDocData] = useState<VersionDocData | null>(null);
  const [isLoadingDoc, setIsLoadingDoc] = useState<boolean>(false);
  const [isMockApiActive, setIsMockApiActive] = useState<boolean>(false);
  const [docFetchNotice, setDocFetchNotice] = useState<string | null>(null);

  // Modals & Drawers
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isCliOpen, setIsCliOpen] = useState<boolean>(false);
  const [isMockApiOpen, setIsMockApiOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Load documentation data whenever version or MockAPI settings change
  const loadVersionData = useCallback(async (version: string) => {
    setIsLoadingDoc(true);
    const mockUrl = getStoredMockApiUrl();
    setIsMockApiActive(Boolean(mockUrl));

    const result = await fetchDocDataForVersion(version);
    setDocData(result.data);
    setIsLoadingDoc(false);

    if (result.data?.githubStars !== undefined) {
      setStarCount(result.data.githubStars);
    }

    // Try live fetch from GitHub API if repository path is specified
    if (result.data?.githubRepo) {
      fetchGitHubStars(result.data.githubRepo).then((liveStars) => {
        if (liveStars !== null) {
          setStarCount(liveStars);
        }
      });
    }


    // Auto-hide notice after 4 seconds
    setTimeout(() => setDocFetchNotice(null), 4000);
  }, []);

  useEffect(() => {
    loadVersionData(selectedVersion);
  }, [selectedVersion, loadVersionData]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  const handleStar = () => {
    setIsStarred((prev) => {
      if (prev) {
        setStarCount((c) => c - 1);
        return false;
      } else {
        setStarCount((c) => c + 1);
        return true;
      }
    });
  };

  const handleAuthorizeAdmin = () => {
    setIsAdminAuthorized(true);
    sessionStorage.setItem('isAdminAuthorized', 'true');
  };

  const handleLogoutAdmin = () => {
    setIsAdminAuthorized(false);
    sessionStorage.removeItem('isAdminAuthorized');
    if (activePage === 'mockapi-editor') {
      setActivePage('instructions');
    }
  };

  const combinedSearchResults = useMemo(() => {
    const base = docData?.searchResults || [];
    if (!docData?.features || docData.features.length === 0) return base;
    const extra = docData.features.map((feat, idx) => ({
      id: `custom-feat-${idx}`,
      title: feat,
      category: feat.includes(':') || feat.toLowerCase().includes('command') || feat.startsWith('module') ? 'Artisan Commands' : 'New Features',
      pageId: (feat.includes(':') || feat.toLowerCase().includes('command') || feat.startsWith('module') ? 'commands' : 'instructions') as PageId,
      description: `Элемент из панели администратора (v${docData.version})`,
    }));
    return [...extra, ...base];
  }, [docData]);

  const renderPage = () => {
    switch (activePage) {
      case 'instructions':
        return (
            <InstructionsPage
                onNavigate={setActivePage}
                onOpenCli={() => setIsCliOpen(true)}
                docData={docData}
            />
        );
      case 'installation':
        return <InstallationPage onNavigate={setActivePage} />;
      case 'commands':
        return <CommandsPage onNavigate={setActivePage} onOpenCli={() => setIsCliOpen(true)} docData={docData} />;
      case 'migrations':
        return <MigrationsPage onNavigate={setActivePage} />;
      case 'requirements':
        return <RequirementsPage onNavigate={setActivePage} docData={docData} />;
      case 'create-module':
        return (
            <CreateModulePage
                onNavigate={setActivePage}
                onOpenCli={() => setIsCliOpen(true)}
                docData={docData}
            />
        );
      case 'transformer':
        return (
            <TransformerPage
                onNavigate={setActivePage}
                onOpenCli={() => setIsCliOpen(true)}
            />
        );
      case 'mockapi-editor':
        if (!isAdminAuthorized) {
          return (
              <InstructionsPage
                  onNavigate={setActivePage}
                  onOpenCli={() => setIsCliOpen(true)}
                  docData={docData}
              />
          );
        }
        return (
            <MockApiEditorPage
                onNavigate={setActivePage}
                onOpenMockApiModal={() => setIsMockApiOpen(true)}
                selectedVersion={selectedVersion}
                onVersionChange={setSelectedVersion}
                onDataUpdated={() => loadVersionData(selectedVersion)}
            />
        );

      case "github":
      case 'issues':
        return (
            <CommunityPage
                onNavigate={setActivePage}
                starCount={starCount}
                onStar={handleStar}
                isStarred={isStarred}
                initialTab="issues"
            />
        );
      case 'discussions':
        return (
            <CommunityPage
                onNavigate={setActivePage}
                starCount={starCount}
                onStar={handleStar}
                isStarred={isStarred}
                initialTab="discussions"
            />
        );
      default:
        return (
            <InstructionsPage
                onNavigate={setActivePage}
                onOpenCli={() => setIsCliOpen(true)}
                docData={docData}
            />
        );
    }
  };

  return (
      <div className="min-h-screen bg-[#0b1326] text-[#f8fafc] font-sans selection:bg-[#ffb690]/30 selection:text-[#ffb690] flex flex-col">
        {/* Top Header Navbar */}
        <Header
            activePage={activePage}
            onNavigate={setActivePage}
            selectedVersion={selectedVersion}
            onVersionChange={setSelectedVersion}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenCli={() => setIsCliOpen(true)}
            onOpenMockApi={() => setIsMockApiOpen(true)}
            isMockApiActive={isMockApiActive}
            onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
            starCount={starCount}
            onStar={handleStar}
            isStarred={isStarred}
            isAdminAuthorized={isAdminAuthorized}
            onOpenAdminAuth={() => setIsAdminAuthOpen(true)}
        />

        {/* Dynamic Data Fetching Notice Toast */}
        <AnimatePresence>
          {docFetchNotice && (
              <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="fixed top-[72px] right-4 z-30 bg-[#171f33] border border-[#ffb690]/40 text-[#ffb690] px-4 py-2 rounded-xl text-xs font-code font-bold shadow-xl flex items-center gap-2 pointer-events-none"
              >
            <span className="material-symbols-outlined text-[16px]">
              {isLoadingDoc ? 'sync' : 'cloud_download'}
            </span>
                <span>{docFetchNotice}</span>
              </motion.div>
          )}
        </AnimatePresence>

        {/* Main Layout Body */}
        <div className="flex-1 pt-[64px] flex">
          {/* Left Sidebar */}
          <Sidebar
              activePage={activePage}
              onNavigate={setActivePage}
              selectedVersion={selectedVersion}
              onVersionChange={setSelectedVersion}
              navGroups={docData?.navGroups}
              starCount={starCount}
              onStar={handleStar}
              isStarred={isStarred}
              isOpenMobile={isMobileMenuOpen}
              onCloseMobile={() => setIsMobileMenuOpen(false)}
              isAdminAuthorized={isAdminAuthorized}
          />

          {/* Content Area */}
          <main className="flex-1 lg:pl-[280px] w-full min-w-0">
            <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
              <AnimatePresence mode="wait">
                <motion.div
                    key={`${activePage}-${selectedVersion}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  {renderPage()}
                </motion.div>
              </AnimatePresence>

              <Footer onNavigate={setActivePage} />
            </div>
          </main>
        </div>

        {/* Global Modals */}
        <SearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onSelectResult={(pageId) => setActivePage(pageId)}
            searchResults={combinedSearchResults}
        />

        <InteractiveCliModal
            isOpen={isCliOpen}
            onClose={() => setIsCliOpen(false)}
        />

        <MockApiModal
            isOpen={isMockApiOpen}
            onClose={() => setIsMockApiOpen(false)}
            selectedVersion={selectedVersion}
            onDataUpdated={() => loadVersionData(selectedVersion)}
        />

        <AdminAuthModal
            isOpen={isAdminAuthOpen}
            onClose={() => setIsAdminAuthOpen(false)}
            onAuthorize={handleAuthorizeAdmin}
            isAdminAuthorized={isAdminAuthorized}
            onLogout={handleLogoutAdmin}
        />
      </div>
  );
}
