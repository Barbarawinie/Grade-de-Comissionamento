import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { CommissionTable } from './components/CommissionTable';
import { RulesView } from './components/RulesView';
import { LoginModal } from './components/LoginModal';
import { SettingsModal } from './components/SettingsModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { SectionType, CommissionData, AppSettings, Operator } from './types';
import { DEFAULT_COMMISSION_DATA, DEFAULT_SETTINGS } from './data/defaultData';
import { decodeStateFromUrl, syncUrlHash, getShareableUrl } from './utils/shareUrl';
import { Check, Link2 } from 'lucide-react';

const STORAGE_DATA_KEY = 'grade_comissao_data_v1';
const STORAGE_SETTINGS_KEY = 'grade_comissao_settings_v1';

export default function App() {
  const [currentSection, setCurrentSection] = useState<SectionType>('pme');
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [showShareToast, setShowShareToast] = useState<boolean>(false);

  // Parse initial state: Check URL hash first (#data=...), then localStorage, then defaults
  const [commissionData, setCommissionData] = useState<CommissionData>(() => {
    try {
      const fromUrl = decodeStateFromUrl(window.location.hash);
      if (fromUrl && fromUrl.data) {
        return {
          ...DEFAULT_COMMISSION_DATA,
          ...fromUrl.data,
          auto: fromUrl.data.auto && fromUrl.data.auto.length > 0 ? fromUrl.data.auto : DEFAULT_COMMISSION_DATA.auto,
          consorcio: fromUrl.data.consorcio && fromUrl.data.consorcio.length > 0 ? fromUrl.data.consorcio : DEFAULT_COMMISSION_DATA.consorcio,
          vida: fromUrl.data.vida && fromUrl.data.vida.length > 0 ? fromUrl.data.vida : DEFAULT_COMMISSION_DATA.vida,
          demais: fromUrl.data.demais && fromUrl.data.demais.length > 0 ? fromUrl.data.demais : DEFAULT_COMMISSION_DATA.demais,
        };
      }
      const saved = localStorage.getItem(STORAGE_DATA_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_COMMISSION_DATA,
          ...parsed,
          auto: parsed.auto && parsed.auto.length > 0 ? parsed.auto : DEFAULT_COMMISSION_DATA.auto,
          consorcio: parsed.consorcio && parsed.consorcio.length > 0 ? parsed.consorcio : DEFAULT_COMMISSION_DATA.consorcio,
          vida: parsed.vida && parsed.vida.length > 0 ? parsed.vida : DEFAULT_COMMISSION_DATA.vida,
          demais: parsed.demais && parsed.demais.length > 0 ? parsed.demais : DEFAULT_COMMISSION_DATA.demais,
        };
      }
    } catch (e) {
      console.error('Failed to parse saved commission data', e);
    }
    return DEFAULT_COMMISSION_DATA;
  });

  // Initialize settings: Check URL hash first, then localStorage, then defaults
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const fromUrl = decodeStateFromUrl(window.location.hash);
      if (fromUrl && fromUrl.settings) {
        return {
          ...DEFAULT_SETTINGS,
          ...fromUrl.settings,
        };
      }
      const saved = localStorage.getItem(STORAGE_SETTINGS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved settings', e);
    }
    return DEFAULT_SETTINGS;
  });

  // Persist commission data changes to localStorage and update URL hash so edits stay in the link!
  const isFirstRender = useRef(true);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_DATA_KEY, JSON.stringify(commissionData));
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));

      // Synchronize changes to the URL link/hash so sharing or bookmarking reflects exact state
      syncUrlHash(commissionData, settings);
    } catch (e) {
      console.warn('Failed to save commission data to localStorage', e);
    }
    isFirstRender.current = false;
  }, [commissionData, settings]);

  // Listen for browser navigation / hash change events to dynamically update if a new link is opened
  useEffect(() => {
    const handleUrlChange = () => {
      try {
        const decoded = decodeStateFromUrl();
        if (decoded) {
          if (decoded.data) {
            setCommissionData((prev) => ({
              ...prev,
              ...decoded.data,
            }));
          }
          if (decoded.settings) {
            setSettings((prev) => ({
              ...prev,
              ...decoded.settings,
            }));
          }
        }
      } catch (err) {
        console.warn('Could not decode URL on change', err);
      }
    };

    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  // Handle updating an operator row
  const handleUpdateOperator = (
    section: keyof CommissionData,
    index: number,
    updated: Partial<Operator>
  ) => {
    setCommissionData((prev) => {
      const currentList = prev[section] || [];
      const newList = currentList.map((op, i) => (i === index ? { ...op, ...updated } : op));
      return {
        ...prev,
        [section]: newList,
      };
    });
  };

  // Handle adding an operator row
  const handleAddOperator = (section: keyof CommissionData) => {
    const newOperator: Operator = {
      id: `${section}-${Date.now()}`,
      name: '',
      ps: Array(13).fill(0),
      obs: '',
    };
    setCommissionData((prev) => ({
      ...prev,
      [section]: [...(prev[section] || []), newOperator],
    }));
  };

  // Handle removing an operator row
  const handleRemoveOperator = (section: keyof CommissionData, index: number) => {
    setCommissionData((prev) => {
      const currentList = prev[section] || [];
      return {
        ...prev,
        [section]: currentList.filter((_, i) => i !== index),
      };
    });
  };

  // Handle updating app settings (emission date, reference, broker name)
  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Handle resetting back to original default data
  const handleResetToDefaults = () => {
    setCommissionData(DEFAULT_COMMISSION_DATA);
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.removeItem(STORAGE_DATA_KEY);
      localStorage.removeItem(STORAGE_SETTINGS_KEY);
      // Clear hash from URL
      const cleanBase = window.location.href.split('#')[0];
      window.history.replaceState(null, '', cleanBase);
    } catch (e) {
      console.warn(e);
    }
  };

  // Handle sharing the current modified link (with safe clipboard copy)
  const handleShareLink = async () => {
    const url = getShareableUrl(commissionData, settings);
    let copied = false;

    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        copied = true;
      } catch {
        copied = false;
      }
    }

    if (!copied) {
      try {
        const input = document.createElement('textarea');
        input.value = url;
        input.style.position = 'fixed';
        input.style.opacity = '0';
        input.style.left = '-9999px';
        document.body.appendChild(input);
        input.focus();
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        copied = true;
      } catch (err) {
        console.warn('Clipboard fallback failed', err);
      }
    }

    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3500);
  };

  // Handle Lock / Edit mode toggle
  const handleToggleLock = () => {
    if (isEditMode) {
      setIsEditMode(false);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  // Print current segment cleanly
  const handlePrint = () => {
    window.print();
  };

  // Export current table as CSV
  const handleExportCSV = () => {
    if (currentSection === 'dashboard' || currentSection === 'regras') {
      return;
    }

    const currentList = commissionData[currentSection] || [];
    const headers = ['Operadora', '1ª', '2ª', '3ª', '4ª', '5ª', '6ª', '7ª', '8ª', '9ª', '10ª', '11ª', '12ª', '13ª', 'TOTAL'];
    const rows = currentList.map((op) => {
      const total = op.ps.reduce((acc, curr) => acc + (Number(curr) || 0), 0);
      return [
        `"${op.name}"`,
        ...op.ps.map((p) => p || 0),
        `"${total}%"`,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `grade_comissao_${currentSection}_${settings.emissao.replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8F5EF] text-[#2A3A52]">
      {/* Left Sidebar on Desktop */}
      <Sidebar
        currentSection={currentSection}
        onSelectSection={setCurrentSection}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        isEditMode={isEditMode}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onToggleLock={handleToggleLock}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <Header
          currentSection={currentSection}
          isEditMode={isEditMode}
          onToggleLock={handleToggleLock}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onResetData={handleResetToDefaults}
          onPrintOrExport={handlePrint}
          onExportCSV={currentSection !== 'dashboard' && currentSection !== 'regras' ? handleExportCSV : undefined}
          onShareLink={handleShareLink}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-8">
          {currentSection === 'dashboard' && (
            <DashboardView
              data={commissionData}
              onNavigate={(sec) => setCurrentSection(sec)}
            />
          )}

          {currentSection !== 'dashboard' && currentSection !== 'regras' && (
            <CommissionTable
              section={currentSection}
              operators={commissionData[currentSection] || []}
              isEditMode={isEditMode}
              onUpdateOperator={(idx, updated) =>
                handleUpdateOperator(currentSection, idx, updated)
              }
              onAddOperator={() => handleAddOperator(currentSection)}
              onRemoveOperator={(idx) => handleRemoveOperator(currentSection, idx)}
              onOpenLogin={() => setIsLoginModalOpen(true)}
              settings={settings}
            />
          )}

          {currentSection === 'regras' && <RulesView />}
        </main>

        {/* Mobile Navigation Bar */}
        <MobileBottomNav
          currentSection={currentSection}
          onSelectSection={setCurrentSection}
        />
      </div>

      {/* Login / Auth Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          setIsEditMode(true);
          setIsLoginModalOpen(false);
        }}
        expectedPassword={settings.adminPassword}
      />

      {/* Settings Modal (available when logged in) */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSaveSettings={(newSettings) => setSettings(newSettings)}
        onResetToDefaults={handleResetToDefaults}
      />

      {/* Share Toast Notification */}
      {showShareToast && (
        <div
          id="share-success-toast"
          className="fixed bottom-20 md:bottom-6 right-6 z-50 bg-[#071B3A] text-white px-4 py-3 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          <div className="w-8 h-8 rounded-xl bg-[#2F9E73]/20 text-[#2F9E73] flex items-center justify-center">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[13px] font-bold text-white">Link copiado com sucesso!</div>
            <div className="text-[11.5px] text-white/70">
              Todas as edições feitas na grade estão salvas no link.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
