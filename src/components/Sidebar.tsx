import React from 'react';
import {
  LayoutDashboard,
  User,
  Users,
  Grid,
  BookOpen,
  Car,
  Landmark,
  HeartPulse,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { SectionType, AppSettings } from '../types';

interface SidebarProps {
  currentSection: SectionType;
  onSelectSection: (section: SectionType) => void;
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  isEditMode: boolean;
  onOpenLogin: () => void;
  onToggleLock: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSelectSection,
  settings,
  onUpdateSettings,
  isEditMode,
}) => {
  const navGroups = [
    {
      title: 'Principal',
      items: [
        { id: 'dashboard' as SectionType, label: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Saúde & Benefícios',
      items: [
        { id: 'pf' as SectionType, label: 'Saúde / PF', icon: User },
        { id: 'pme' as SectionType, label: 'Saúde / PME', icon: Users },
        { id: 'adesao' as SectionType, label: 'Planos por Adesão', icon: Grid },
      ],
    },
    {
      title: 'Seguros & Ramos',
      items: [
        { id: 'auto' as SectionType, label: 'Seguro Auto', icon: Car },
        { id: 'consorcio' as SectionType, label: 'Consórcio', icon: Landmark },
        { id: 'vida' as SectionType, label: 'Vida & Previdência', icon: HeartPulse },
        { id: 'demais' as SectionType, label: 'Demais Ramos', icon: ShieldCheck },
      ],
    },
    {
      title: 'Políticas',
      items: [
        { id: 'regras' as SectionType, label: 'Regras e Observações', icon: BookOpen },
      ],
    },
  ];

  return (
    <aside
      id="app-sidebar"
      className="hidden md:flex flex-col w-[248px] min-w-[248px] bg-[#071B3A] text-white flex-shrink-0 select-none border-r border-white/5"
    >
      {/* Brand Header */}
      <div className="p-[16px_16px_12px] border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="text-[22px] font-extrabold tracking-tight text-white font-display flex items-center">
            <span>ArKos</span>
            <span className="text-[#E96F5F] text-[24px] font-black leading-none ml-0.5">+</span>
          </div>
          <span className="px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider bg-white/10 text-white/70 rounded">
            Grade
          </span>
        </div>
        <div className="text-[10px] text-white/40 tracking-[0.14em] uppercase mt-1 font-medium">
          {settings.brokerCategory || 'Benefícios Corporativos & Seguros'}
        </div>
      </div>

      {/* Broker Profile Card */}
      <div className="p-[10px_14px] border-b border-white/10">
        <div className="bg-[#4A86D9]/15 border border-[#4A86D9]/20 rounded-xl p-[8px_12px]">
          <div className="text-[9px] text-white/50 uppercase tracking-[0.1em] font-semibold mb-0.5">
            Corretora
          </div>
          <div className="text-[13px] font-bold text-white tracking-tight truncate">
            {settings.brokerName || 'ARKOS Benefícios'}
          </div>
          <div className="text-[10.5px] text-white/60 truncate">
            {settings.brokerSubtitle || 'Consultoria de Saúde & Seguros'}
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 p-2.5 flex flex-col gap-3 overflow-y-auto custom-scrollbar">
        {navGroups.map((group) => (
          <div key={group.title} className="flex flex-col gap-0.5">
            <div className="text-[9.5px] text-white/35 uppercase tracking-[0.14em] px-2.5 py-1 font-semibold">
              {group.title}
            </div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => onSelectSection(item.id)}
                  className={`flex items-center gap-2.5 w-full px-2.5 py-2 rounded-xl text-[12.5px] font-medium transition-all text-left ${
                    isActive
                      ? 'bg-[#4A86D9] text-white shadow-sm font-semibold'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-white/60'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer / Validity Information */}
      <div className="p-[14px_16px] border-t border-white/10 bg-[#05142B]/40">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2F9E73] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2F9E73]"></span>
            </span>
            <span className="text-[11px] text-white/70 font-semibold tracking-wide">Grade Vigente</span>
          </div>
          {isEditMode && (
            <span className="text-[9.5px] px-1.5 py-0.5 rounded bg-[#2F9E73]/20 text-[#2F9E73] font-bold uppercase tracking-wider">
              Editável
            </span>
          )}
        </div>

        <div className="space-y-2">
          <div>
            <label className="block text-[9.5px] text-white/40 uppercase tracking-[0.08em] mb-1 font-medium">
              Data de Emissão
            </label>
            <input
              id="sidebar-emissao-input"
              type="text"
              value={settings.emissao}
              onChange={(e) => isEditMode && onUpdateSettings({ emissao: e.target.value })}
              disabled={!isEditMode}
              placeholder="DD/MM/AAAA"
              className={`w-full text-[11px] px-2 py-1 rounded bg-white/5 border border-white/10 text-white/90 font-medium ${
                isEditMode
                  ? 'focus:bg-white/10 focus:border-[#4A86D9] focus:outline-none cursor-text'
                  : 'cursor-default opacity-80'
              }`}
            />
          </div>

          <div>
            <label className="block text-[9.5px] text-white/40 uppercase tracking-[0.08em] mb-1 font-medium">
              Referência Vigência
            </label>
            <input
              id="sidebar-referencia-input"
              type="text"
              value={settings.referencia}
              onChange={(e) => isEditMode && onUpdateSettings({ referencia: e.target.value })}
              disabled={!isEditMode}
              placeholder="DD/MM/AAAA"
              className={`w-full text-[11px] px-2 py-1 rounded bg-white/5 border border-white/10 text-white/90 font-medium ${
                isEditMode
                  ? 'focus:bg-white/10 focus:border-[#4A86D9] focus:outline-none cursor-text'
                  : 'cursor-default opacity-80'
              }`}
            />
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-white/5 text-[10px] text-white/35 flex items-center justify-between">
          <span>Versão 2025/2026</span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#E96F5F]" /> Oficial
          </span>
        </div>
      </div>
    </aside>
  );
};
