import React, { useState } from 'react';
import { Lock, Unlock, LogIn, LogOut, Settings, Printer, Download, RotateCcw, Share2, Check } from 'lucide-react';
import { SectionType } from '../types';

interface HeaderProps {
  currentSection: SectionType;
  isEditMode: boolean;
  onToggleLock: () => void;
  onOpenSettings: () => void;
  onResetData: () => void;
  onPrintOrExport?: () => void;
  onShareLink?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentSection,
  isEditMode,
  onToggleLock,
  onOpenSettings,
  onResetData,
  onPrintOrExport,
  onShareLink,
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (onShareLink) {
      onShareLink();
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };
  const titles: Record<SectionType, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Visão geral — ARKOS Benefícios & Seguros',
    },
    pf: {
      title: 'Saúde / PF',
      subtitle: 'Grade de comissões — Pessoa Física',
    },
    pme: {
      title: 'Saúde / PME',
      subtitle: 'Grade de comissões — Pequenas e Médias Empresas (PME)',
    },
    adesao: {
      title: 'Planos por Adesão',
      subtitle: 'Grade de comissões — Entidades de Classe e Administradoras',
    },
    auto: {
      title: 'Seguro Auto',
      subtitle: 'Grade de comissões — Automóvel, Motos, Caminhões e Frotas',
    },
    consorcio: {
      title: 'Consórcios',
      subtitle: 'Grade de comissões — Imóveis, Auto, Pesados e Serviços',
    },
    vida: {
      title: 'Vida & Previdência',
      subtitle: 'Grade de comissões — Vida Individual, Coletivo e Previdência Privada',
    },
    demais: {
      title: 'Demais Ramos',
      subtitle: 'Grade de comissões — Residencial, Empresarial, Condomínio, RC e Garantia',
    },
    regras: {
      title: 'Regras e Observações',
      subtitle: 'Políticas, prazos, carência e regras de comissionamento',
    },
  };

  const { title, subtitle } = titles[currentSection] || titles.dashboard;

  return (
    <header
      id="app-header"
      className="h-16 bg-white border-b border-[#EFEAE0] flex items-center px-4 md:px-7 gap-3 md:gap-4 flex-shrink-0 shadow-xs z-10"
    >
      {/* Title & Subtitle */}
      <div className="flex-1 min-w-0">
        <h1 className="text-[15px] md:text-[17px] font-bold text-[#071B3A] font-display tracking-tight truncate leading-tight">
          {title}
        </h1>
        <p className="text-[11px] md:text-[12px] text-[#5E6B7E] truncate font-normal">
          {subtitle}
        </p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        {/* Status indicator */}
        <div
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
            isEditMode
              ? 'bg-[#2F9E73]/10 text-[#2F9E73] border border-[#2F9E73]/20'
              : 'bg-[#2F9E73]/10 text-[#2F9E73]'
          }`}
        >
          <span className="w-1.5 h-1.5 bg-[#2F9E73] rounded-full animate-pulse"></span>
          <span>{isEditMode ? 'Edição Liberada' : 'Atualizado'}</span>
        </div>

        {/* Quick Print/Export */}
        {onPrintOrExport && (
          <button
            id="header-export-btn"
            onClick={onPrintOrExport}
            title="Imprimir ou Exportar Grade"
            className="p-1.5 md:p-2 rounded-xl text-[#5E6B7E] hover:text-[#071B3A] hover:bg-[#071B3A]/5 transition-colors border border-[#EFEAE0]"
          >
            <Printer className="w-4 h-4" />
          </button>
        )}

        {/* Share Link Button */}
        {onShareLink && (
          <button
            id="header-share-btn"
            onClick={handleShare}
            title="Copiar link com todas as alterações salvas"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 md:py-2 rounded-xl text-[12px] font-semibold transition-all border shadow-2xs ${
              copied
                ? 'bg-[#2F9E73] text-white border-[#2F9E73]'
                : 'bg-white text-[#4A86D9] border-[#4A86D9]/30 hover:bg-[#4A86D9]/10'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Link Copiado!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copiar Link</span>
              </>
            )}
          </button>
        )}

        {/* If edit mode: settings & reset options */}
        {isEditMode && (
          <>
            <button
              id="header-reset-btn"
              onClick={onResetData}
              title="Restaurar tabela padrão"
              className="p-1.5 md:p-2 rounded-xl text-[#5E6B7E] hover:text-[#C64A3A] hover:bg-[#C64A3A]/10 transition-colors border border-[#EFEAE0]"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              id="header-settings-btn"
              onClick={onOpenSettings}
              title="Configurações e Senha"
              className="p-1.5 md:p-2 rounded-xl text-[#5E6B7E] hover:text-[#071B3A] hover:bg-[#071B3A]/5 transition-colors border border-[#EFEAE0]"
            >
              <Settings className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Main Lock / Login Button */}
        <button
          id="header-auth-toggle-btn"
          onClick={onToggleLock}
          title={isEditMode ? 'Sair do modo de edição (Bloquear)' : 'Login de Administrador (Editar comissões)'}
          className={`flex items-center gap-2 px-3 py-1.5 md:py-2 rounded-xl text-[12px] font-semibold transition-all border shadow-xs ${
            isEditMode
              ? 'bg-[#2F9E73]/15 border-[#2F9E73]/30 text-[#1F8A5B] hover:bg-[#2F9E73]/25'
              : 'bg-[#071B3A] border-[#071B3A] text-white hover:bg-[#0E2A52]'
          }`}
        >
          {isEditMode ? (
            <>
              <Unlock className="w-3.5 h-3.5 text-[#2F9E73]" />
              <span className="hidden sm:inline">Bloquear Edição</span>
              <span className="sm:hidden">Sair</span>
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5 text-[#7EBAFE]" />
              <span className="hidden sm:inline">Login / Editar</span>
              <span className="sm:hidden">Login</span>
            </>
          )}
        </button>

        {/* User avatar indicator */}
        <div className="hidden lg:flex w-8 h-8 rounded-full bg-gradient-to-br from-[#071B3A] to-[#4A86D9] items-center justify-center text-white text-[12px] font-bold shadow-xs">
          A
        </div>
      </div>
    </header>
  );
};
