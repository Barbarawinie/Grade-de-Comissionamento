import React, { useState } from 'react';
import { Operator, SectionType } from '../types';
import { Search, Plus, Trash2, AlertTriangle, FileText, Info } from 'lucide-react';

interface CommissionTableProps {
  section: SectionType;
  operators: Operator[];
  isEditMode: boolean;
  onUpdateOperator: (index: number, updated: Partial<Operator>) => void;
  onAddOperator: () => void;
  onRemoveOperator: (index: number) => void;
  onOpenLogin: () => void;
}

export const CommissionTable: React.FC<CommissionTableProps> = ({
  section,
  operators,
  isEditMode,
  onUpdateOperator,
  onAddOperator,
  onRemoveOperator,
  onOpenLogin,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const titles: Record<string, string> = {
    pf: 'SAÚDE / PF',
    pme: 'SAÚDE / PME',
    adesao: 'PLANOS POR ADESÃO',
    auto: 'SEGURO AUTO',
    consorcio: 'CONSÓRCIO',
    vida: 'VIDA & PREVIDÊNCIA',
    demais: 'DEMAIS RAMOS (RE / RC / GARANTIA)',
  };

  const title = titles[section] || 'GRADE DE COMISSÕES';

  const companyLabel =
    section === 'consorcio'
      ? 'Administradora'
      : section === 'auto' || section === 'vida' || section === 'demais'
      ? 'Seguradora'
      : 'Operadora';

  const parseVal = (v: number | string | undefined): number => {
    if (v === undefined || v === null || v === '') return 0;
    const n = parseFloat(String(v).replace(',', '.'));
    return isNaN(n) ? 0 : n;
  };

  const getTotalColor = (total: number) => {
    if (total >= 250) return 'text-[#E96F5F]';
    if (total >= 200) return 'text-[#2F9E73]';
    if (total >= 150) return 'text-[#4A86D9]';
    return 'text-[#5E6B7E]';
  };

  const getTotalBgColor = (total: number) => {
    if (total >= 250) return 'bg-[#E96F5F]/10 text-[#E96F5F]';
    if (total >= 200) return 'bg-[#2F9E73]/10 text-[#2F9E73]';
    if (total >= 150) return 'bg-[#4A86D9]/10 text-[#4A86D9]';
    return 'bg-[#5E6B7E]/10 text-[#5E6B7E]';
  };

  // Filter operators by search query
  const filteredOperators = operators.map((op, originalIndex) => ({
    op,
    originalIndex,
  })).filter(({ op }) => {
    if (!searchQuery.trim()) return true;
    return op.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (op.obs && op.obs.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <div id="commission-table-container" className="space-y-3.5">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-[17px] font-bold text-[#071B3A] font-display tracking-tight">
            {title}
          </h2>
          <span className="text-[12px] text-[#5E6B7E] bg-white px-2.5 py-0.5 rounded-full border border-[#EFEAE0] font-semibold">
            {operators.length} {companyLabel.toLowerCase()}s
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#5E6B7E] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="search-operator-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Buscar ${companyLabel.toLowerCase()}...`}
              className="text-[12px] pl-8 pr-3 py-1.5 rounded-xl border border-[#EFEAE0] bg-white focus:outline-none focus:border-[#4A86D9] text-[#071B3A] w-48 sm:w-60 shadow-2xs"
            />
          </div>

          {/* If edit mode, button to add operator */}
          {isEditMode ? (
            <button
              id="add-operator-top-btn"
              onClick={onAddOperator}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#4A86D9] text-white text-[12px] font-semibold hover:bg-[#3B73C4] transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar Linha</span>
            </button>
          ) : (
            <button
              id="request-edit-btn"
              onClick={onOpenLogin}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-medium text-[#4A86D9] bg-[#4A86D9]/10 hover:bg-[#4A86D9]/20 transition-colors"
            >
              Editar grade
            </button>
          )}
        </div>
      </div>

      {/* Section Specific Notice Banners */}
      {section === 'adesao' && (
        <div className="flex items-center gap-2.5 bg-[#E0A93B]/10 border border-[#E0A93B]/30 rounded-xl p-3 text-[#71541A] text-[12.5px] font-medium shadow-2xs">
          <AlertTriangle className="w-4 h-4 text-[#E0A93B] flex-shrink-0" />
          <span>
            <strong>IMPORTANTE:</strong> Todo contrato de adesão — a 1ª parcela é paga diretamente pelo cliente ao corretor.
          </span>
        </div>
      )}

      {section === 'auto' && (
        <div className="flex items-center gap-2.5 bg-[#4A86D9]/10 border border-[#4A86D9]/30 rounded-xl p-3 text-[#163A6B] text-[12.5px] font-medium shadow-2xs">
          <AlertTriangle className="w-4 h-4 text-[#4A86D9] flex-shrink-0" />
          <span>
            <strong>SEGURO AUTO:</strong> Comissões calculadas sobre o prêmio líquido com agenciamento na 1ª parcela e acompanhamento de renovações.
          </span>
        </div>
      )}

      {section === 'consorcio' && (
        <div className="flex items-center gap-2.5 bg-[#2F9E73]/10 border border-[#2F9E73]/30 rounded-xl p-3 text-[#135A3D] text-[12.5px] font-medium shadow-2xs">
          <AlertTriangle className="w-4 h-4 text-[#2F9E73] flex-shrink-0" />
          <span>
            <strong>CONSÓRCIO:</strong> Percentual incidente sobre o valor do crédito / cota comercializada. Liberação após confirmação de pagamento da 1ª parcela.
          </span>
        </div>
      )}

      {section === 'vida' && (
        <div className="flex items-center gap-2.5 bg-[#E96F5F]/10 border border-[#E96F5F]/30 rounded-xl p-3 text-[#7C2D22] text-[12.5px] font-medium shadow-2xs">
          <AlertTriangle className="w-4 h-4 text-[#E96F5F] flex-shrink-0" />
          <span>
            <strong>VIDA & PREVIDÊNCIA:</strong> Grade estruturada com comissão de agenciamento inicial e carteira vitalícia / manutenção conforme regras de cada seguradora.
          </span>
        </div>
      )}

      {section === 'demais' && (
        <div className="flex items-center gap-2.5 bg-[#071B3A]/5 border border-[#071B3A]/15 rounded-xl p-3 text-[#071B3A] text-[12.5px] font-medium shadow-2xs">
          <AlertTriangle className="w-4 h-4 text-[#071B3A] flex-shrink-0" />
          <span>
            <strong>DEMAIS RAMOS (PATRIMONIAIS & FINANCEIROS):</strong> Residencial, Condomínio, Empresarial, Fiança Locatícia, Responsabilidade Civil (RC) e Seguro Garantia.
          </span>
        </div>
      )}

      {/* Main Commission Table Card */}
      <div className="bg-white rounded-2xl border border-[#EFEAE0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          {/* Header Row */}
          <div className="grid grid-cols-[200px_repeat(13,52px)_72px_36px] min-w-[988px] bg-[#071B3A] text-white font-semibold text-[11px] select-none">
            <div className="p-[11px_14px] uppercase tracking-wider text-white/90">
              {companyLabel}
            </div>
            {Array.from({ length: 13 }).map((_, i) => (
              <div
                key={i}
                className="p-[11px_2px] text-center text-[#7EBAFE] tracking-tight"
                title={`${i + 1}ª Parcela`}
              >
                {i + 1}ª
              </div>
            ))}
            <div className="p-[11px_4px] text-center text-[#E96F5F] uppercase tracking-wider font-bold">
              TOTAL
            </div>
            <div className="p-[11px_2px]"></div>
          </div>

          {/* Body Rows */}
          <div className="divide-y divide-[#EFEAE0]">
            {filteredOperators.length === 0 ? (
              <div className="p-8 text-center text-[#5E6B7E] text-[13px]">
                Nenhuma operadora encontrada para &ldquo;{searchQuery}&rdquo;.
              </div>
            ) : (
              filteredOperators.map(({ op, originalIndex }) => {
                const total = op.ps.reduce((acc, curr) => acc + parseVal(curr), 0);
                const hasObs = Boolean(op.obs);

                return (
                  <div
                    key={op.id || originalIndex}
                    className={`grid grid-cols-[200px_repeat(13,52px)_72px_36px] min-w-[988px] items-center transition-colors group ${
                      originalIndex % 2 === 0 ? 'bg-white' : 'bg-[#FBF9F5]'
                    } hover:bg-[#4A86D9]/5`}
                  >
                    {/* Column: Operadora Name */}
                    <div className="px-2 py-1 flex items-center gap-1.5 relative">
                      <input
                        id={`operator-name-${originalIndex}`}
                        type="text"
                        value={op.name}
                        disabled={!isEditMode}
                        onChange={(e) =>
                          onUpdateOperator(originalIndex, { name: e.target.value })
                        }
                        placeholder="Nome da Operadora..."
                        className="ni font-semibold text-[#071B3A] truncate"
                        title={op.name}
                      />
                      {hasObs && (
                        <span
                          title={op.obs}
                          className="flex-shrink-0 cursor-help text-[#E96F5F] hover:text-[#C64A3A]"
                        >
                          <Info className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>

                    {/* Columns: 1ª to 13ª Parcelas */}
                    {Array.from({ length: 13 }).map((_, colIdx) => {
                      const val = op.ps[colIdx];
                      const displayVal =
                        val !== 0 && val !== undefined && val !== null ? String(val) : '';

                      return (
                        <div key={colIdx} className="px-0.5 py-1">
                          <input
                            id={`operator-${originalIndex}-p${colIdx}`}
                            type="text"
                            value={displayVal}
                            disabled={!isEditMode}
                            onChange={(e) => {
                              const newPs = [...op.ps];
                              newPs[colIdx] = parseVal(e.target.value);
                              onUpdateOperator(originalIndex, { ps: newPs });
                            }}
                            placeholder={isEditMode ? '0' : '—'}
                            className={`ci ${
                              val > 0 ? 'text-[#071B3A] font-semibold' : 'text-[#5E6B7E]/40'
                            }`}
                          />
                        </div>
                      );
                    })}

                    {/* Column: TOTAL */}
                    <div className="py-1 px-1 flex items-center justify-center">
                      <span
                        className={`text-[12px] font-extrabold px-1.5 py-0.5 rounded-md text-center block w-full ${getTotalBgColor(
                          total
                        )}`}
                      >
                        {total > 0 ? `${total}%` : op.obs || '0%'}
                      </span>
                    </div>

                    {/* Column: Delete / Options */}
                    <div className="py-1 px-1 flex items-center justify-center">
                      {isEditMode ? (
                        <button
                          id={`remove-operator-${originalIndex}`}
                          onClick={() => onRemoveOperator(originalIndex)}
                          title="Remover operadora"
                          className="w-7 h-7 flex items-center justify-center text-[#C64A3A]/40 hover:text-[#C64A3A] hover:bg-[#C64A3A]/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="w-7 h-7" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Add Row Section (Always visible when in Edit Mode, matching link!) */}
          {isEditMode && (
            <div className="p-3 bg-[#FAFAF9] border-t border-dashed border-[#EFEAE0] flex items-center justify-between min-w-[988px]">
              <button
                id="add-operator-bottom-btn"
                onClick={onAddOperator}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#4A86D9]/10 hover:bg-[#4A86D9]/20 border border-[#4A86D9]/30 rounded-xl text-[12px] font-bold text-[#4A86D9] transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Adicionar operadora como linha</span>
              </button>
              <span className="text-[11px] text-[#5E6B7E]">
                Clique no nome ou nos valores das parcelas para editar diretamente na tabela.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Legend & Notes Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-3 text-[11.5px] text-[#5E6B7E]">
          <span className="font-semibold text-[#071B3A]">LEGENDA TOTAL:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#5E6B7E] inline-block"></span>
            <span>Abaixo de 150%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#4A86D9] inline-block"></span>
            <span>150–199%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#2F9E73] inline-block"></span>
            <span>200–249%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#E96F5F] inline-block"></span>
            <span>250%+ (Super Destaque)</span>
          </div>
        </div>

        {isEditMode && (
          <div className="text-[11px] text-[#2F9E73] font-semibold bg-[#2F9E73]/10 px-2.5 py-1 rounded-md border border-[#2F9E73]/20 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2F9E73] animate-pulse"></span>
            <span>Alterações salvas automaticamente no navegador e no link</span>
          </div>
        )}
      </div>
    </div>
  );
};
