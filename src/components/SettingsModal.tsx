import React, { useState } from 'react';
import { X, Settings, Key, Building2, RotateCcw, Check, Eye, EyeOff } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  onResetToDefaults: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onResetToDefaults,
}) => {
  const [formData, setFormData] = useState<AppSettings>({ ...settings });
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div
      id="settings-modal-backdrop"
      className="fixed inset-0 bg-[#071B3A]/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150"
    >
      <div
        id="settings-modal-card"
        className="bg-white rounded-2xl p-6 sm:p-7 w-full max-w-[420px] shadow-2xl border border-[#EFEAE0] relative max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#5E6B7E] hover:text-[#071B3A] p-1 rounded-lg hover:bg-[#F8F5EF] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-10 h-10 rounded-xl bg-[#4A86D9]/15 flex items-center justify-center text-[#4A86D9] mb-3">
          <Settings className="w-5 h-5" />
        </div>

        <h3 className="text-[17px] font-bold text-[#071B3A] font-display">
          Configurações da Grade
        </h3>
        <p className="text-[12.5px] text-[#5E6B7E] mt-1 mb-4">
          Personalize as informações da corretora e a senha de administração.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11.5px] font-bold text-[#071B3A] mb-1">
              Nome da Corretora
            </label>
            <input
              type="text"
              value={formData.brokerName}
              onChange={(e) => setFormData({ ...formData, brokerName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#EFEAE0] bg-[#F8F5EF] text-[13px] text-[#071B3A] focus:bg-white focus:border-[#4A86D9] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11.5px] font-bold text-[#071B3A] mb-1">
              Subtítulo / Descrição
            </label>
            <input
              type="text"
              value={formData.brokerSubtitle}
              onChange={(e) => setFormData({ ...formData, brokerSubtitle: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#EFEAE0] bg-[#F8F5EF] text-[13px] text-[#071B3A] focus:bg-white focus:border-[#4A86D9] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11.5px] font-bold text-[#071B3A] mb-1">
              Senha de Edição (Admin)
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.adminPassword}
                onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                className="w-full px-3 py-2 pr-10 rounded-xl border border-[#EFEAE0] bg-[#F8F5EF] text-[13px] font-mono text-[#071B3A] focus:bg-white focus:border-[#4A86D9] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5E6B7E] hover:text-[#071B3A]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-[#EFEAE0] flex flex-col gap-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#4A86D9] hover:bg-[#3B73C4] text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Salvo com sucesso!</span>
                </>
              ) : (
                <span>Salvar Configurações</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                if (confirm('Tem certeza que deseja restaurar todas as operadoras e configurações para os valores originais da corretora?')) {
                  onResetToDefaults();
                  onClose();
                }
              }}
              className="w-full py-2 rounded-xl border border-[#C64A3A]/20 bg-[#C64A3A]/5 hover:bg-[#C64A3A]/15 text-[#C64A3A] text-[12px] font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Grade Padrão Original</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
