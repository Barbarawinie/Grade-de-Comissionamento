import React, { useState, useEffect, useRef } from 'react';
import { Lock, Eye, EyeOff, X, KeyRound } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  expectedPassword: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  expectedPassword,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError(false);
      setShowPassword(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (password === expectedPassword) {
      setError(false);
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div
      id="login-modal-backdrop"
      className="fixed inset-0 bg-[#071B3A]/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150"
    >
      <div
        id="login-modal-card"
        className="bg-white rounded-2xl p-6 sm:p-7 w-full max-w-[360px] shadow-2xl border border-[#EFEAE0] relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#5E6B7E] hover:text-[#071B3A] p-1 rounded-lg hover:bg-[#F8F5EF] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-10 h-10 rounded-xl bg-[#4A86D9]/15 flex items-center justify-center text-[#4A86D9] mb-3">
          <KeyRound className="w-5 h-5" />
        </div>

        <h3 className="text-[17px] font-bold text-[#071B3A] font-display">
          Modo Edição
        </h3>
        <p className="text-[12.5px] text-[#5E6B7E] mt-1 mb-4 leading-relaxed">
          Digite a senha de administrador para alterar comissões, adicionar ou excluir operadoras.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="relative">
            <input
              ref={inputRef}
              id="admin-password-input"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(false);
              }}
              placeholder="Digite a senha..."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-[13px] font-medium bg-[#F8F5EF] text-[#071B3A] focus:outline-none transition-all pr-10 ${
                error
                  ? 'border-[#C64A3A] ring-2 ring-[#C64A3A]/20'
                  : 'border-[#EFEAE0] focus:border-[#4A86D9] focus:bg-white'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5E6B7E] hover:text-[#071B3A]"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <div className="text-[12px] text-[#C64A3A] font-semibold flex items-center gap-1.5">
              <span>Senha incorreta. Verifique e tente novamente.</span>
            </div>
          )}

          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl text-[13px] font-semibold text-[#5E6B7E] bg-[#F8F5EF] hover:bg-[#EFEAE0] transition-colors border border-[#EFEAE0]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="login-submit-btn"
              className="flex-1 py-2 rounded-xl text-[13px] font-semibold text-white bg-[#4A86D9] hover:bg-[#3B73C4] transition-colors shadow-xs"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
