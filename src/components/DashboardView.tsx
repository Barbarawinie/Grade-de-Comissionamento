import React from 'react';
import { CommissionData, SectionType } from '../types';
import {
  Award,
  TrendingUp,
  Layers,
  ArrowRight,
  ShieldCheck,
  Car,
  Landmark,
  HeartPulse,
  Building2,
  Users,
  User,
  Grid,
} from 'lucide-react';

interface DashboardViewProps {
  data: CommissionData;
  onNavigate: (section: SectionType) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ data, onNavigate }) => {
  const allOps = [
    ...(data.pf || []),
    ...(data.pme || []),
    ...(data.adesao || []),
    ...(data.auto || []),
    ...(data.consorcio || []),
    ...(data.vida || []),
    ...(data.demais || []),
  ];

  const calcTotal = (ps: number[] = []) => ps.reduce((acc, curr) => acc + (Number(curr) || 0), 0);

  const allWithTotals = allOps.map((op) => ({
    ...op,
    total: calcTotal(op.ps),
  }));

  const maxTotal = allWithTotals.length ? Math.max(...allWithTotals.map((o) => o.total)) : 0;
  const topOperators = allWithTotals.filter((o) => o.total === maxTotal);
  const highestName = topOperators.length ? topOperators.map((o) => o.name).join(', ') : '—';

  const pmeTotals = (data.pme || []).map((o) => calcTotal(o.ps)).filter((t) => t > 0);
  const avgPME = pmeTotals.length
    ? Math.round(pmeTotals.reduce((a, b) => a + b, 0) / pmeTotals.length)
    : 0;

  const totalAll =
    (data.pf?.length || 0) +
    (data.pme?.length || 0) +
    (data.adesao?.length || 0) +
    (data.auto?.length || 0) +
    (data.consorcio?.length || 0) +
    (data.vida?.length || 0) +
    (data.demais?.length || 0);

  // Top ranked operators across the board
  const ranked = [...allWithTotals]
    .sort((a, b) => b.total - a.total)
    .slice(0, 6);

  const categories = [
    {
      id: 'pf' as SectionType,
      title: 'Saúde / PF',
      count: data.pf?.length || 0,
      sub: 'Pessoa Física e Familiar',
      icon: User,
      gradient: 'linear-gradient(135deg, #071B3A 0%, #0E2A52 50%, #4A86D9 100%)',
      textColor: 'text-[#7EBAFE]',
    },
    {
      id: 'pme' as SectionType,
      title: 'Saúde / PME',
      count: data.pme?.length || 0,
      sub: 'Empresariais & PME',
      icon: Users,
      gradient: 'linear-gradient(135deg, #163A6B 0%, #2D5BA3 50%, #7EBAFE 100%)',
      textColor: 'text-white',
    },
    {
      id: 'adesao' as SectionType,
      title: 'Planos por Adesão',
      count: data.adesao?.length || 0,
      sub: 'Entidades & Coletivos',
      icon: Grid,
      gradient: 'linear-gradient(135deg, #1F8A5B 0%, #2F9E73 100%)',
      textColor: 'text-white',
    },
    {
      id: 'auto' as SectionType,
      title: 'Seguro Auto',
      count: data.auto?.length || 0,
      sub: 'Veículos, Motos & Frotas',
      icon: Car,
      gradient: 'linear-gradient(135deg, #0C2340 0%, #1A4480 100%)',
      textColor: 'text-[#7EBAFE]',
    },
    {
      id: 'consorcio' as SectionType,
      title: 'Consórcios',
      count: data.consorcio?.length || 0,
      sub: 'Imóveis, Veículos & Pesados',
      icon: Landmark,
      gradient: 'linear-gradient(135deg, #134E3F 0%, #21836A 100%)',
      textColor: 'text-[#A7F3D0]',
    },
    {
      id: 'vida' as SectionType,
      title: 'Vida & Previdência',
      count: data.vida?.length || 0,
      sub: 'Individual, Coletivo & AP',
      icon: HeartPulse,
      gradient: 'linear-gradient(135deg, #7F1D1D 0%, #B91C1C 50%, #E96F5F 100%)',
      textColor: 'text-white',
    },
    {
      id: 'demais' as SectionType,
      title: 'Demais Ramos',
      count: data.demais?.length || 0,
      sub: 'Residencial, RE, RC & Garantia',
      icon: Building2,
      gradient: 'linear-gradient(135deg, #2D3748 0%, #4A5568 100%)',
      textColor: 'text-white',
    },
  ];

  return (
    <div id="dashboard-view" className="space-y-6 max-w-6xl mx-auto">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Total Operadoras / Seguradoras */}
        <div className="bg-white rounded-2xl p-5 border border-[#EFEAE0] shadow-xs">
          <div className="text-[11px] uppercase tracking-[0.1em] text-[#5E6B7E] font-bold mb-2 flex items-center justify-between">
            <span>Total de Cias / Operadoras</span>
            <Layers className="w-4 h-4 text-[#4A86D9]" />
          </div>
          <div className="text-[42px] font-extrabold font-display text-[#071B3A] tracking-tight leading-none">
            {totalAll}
          </div>
          <div className="text-[12px] text-[#5E6B7E] mt-2 font-medium">
            Saúde, Auto, Consórcio, Vida e Ramos Elementares
          </div>
        </div>

        {/* Maior Comissão Total */}
        <div className="bg-white rounded-2xl p-5 border border-[#EFEAE0] shadow-xs">
          <div className="text-[11px] uppercase tracking-[0.1em] text-[#5E6B7E] font-bold mb-2 flex items-center justify-between">
            <span>Maior Comissão Total</span>
            <Award className="w-4 h-4 text-[#E96F5F]" />
          </div>
          <div className="text-[42px] font-extrabold font-display text-[#E96F5F] tracking-tight leading-none">
            {maxTotal}%
          </div>
          <div className="text-[12px] text-[#5E6B7E] mt-2 truncate font-medium" title={highestName}>
            {highestName}
          </div>
        </div>

        {/* Ramos Disponíveis */}
        <div className="bg-white rounded-2xl p-5 border border-[#EFEAE0] shadow-xs">
          <div className="text-[11px] uppercase tracking-[0.1em] text-[#5E6B7E] font-bold mb-2 flex items-center justify-between">
            <span>Ramos Cadastrados</span>
            <TrendingUp className="w-4 h-4 text-[#4A86D9]" />
          </div>
          <div className="text-[42px] font-extrabold font-display text-[#4A86D9] tracking-tight leading-none">
            7
            <span className="text-[18px] text-[#5E6B7E] font-normal ml-1">categorias</span>
          </div>
          <div className="text-[12px] text-[#5E6B7E] mt-2 font-medium">
            Grade multissetorial completa
          </div>
        </div>
      </div>

      {/* Category Navigation Cards */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-[15px] font-bold text-[#071B3A] font-display">
            Acesso Rápido por Ramo & Segmento
          </h2>
          <span className="text-[12px] text-[#5E6B7E]">Selecione para ver tabelas</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                id={`dash-card-${cat.id}`}
                onClick={() => onNavigate(cat.id)}
                className="group relative text-left p-5 rounded-2xl border-none transition-all transform hover:-translate-y-0.5 hover:shadow-md cursor-pointer overflow-hidden flex flex-col justify-between"
                style={{
                  background: cat.gradient,
                  minHeight: '140px',
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[28px] font-black text-white font-display leading-none">
                      {cat.count}
                    </span>
                    <Icon className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                  </div>
                  <div className="text-[15px] font-bold text-white tracking-tight">
                    {cat.title}
                  </div>
                  <div className="text-[11.5px] text-white/70 mt-0.5 truncate">
                    {cat.sub}
                  </div>
                </div>
                <div className={`mt-3 flex items-center gap-1.5 text-[11.5px] font-semibold ${cat.textColor} group-hover:translate-x-1 transition-all`}>
                  <span>Ver e Imprimir</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Top Highlights Grid */}
      <div className="bg-white rounded-2xl p-5 border border-[#EFEAE0] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[15px] font-bold text-[#071B3A] font-display">
              Cias & Operadoras em Destaque (Maiores Comissões Acumuladas)
            </h2>
            <p className="text-[12px] text-[#5E6B7E]">
              Classificação com base no somatório total de todas as parcelas cadastradas
            </p>
          </div>
          <ShieldCheck className="w-5 h-5 text-[#2F9E73]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {ranked.map((op, idx) => (
            <div
              key={op.id || idx}
              className="p-3.5 rounded-xl bg-[#F8F5EF] border border-[#EFEAE0] flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5E6B7E] bg-white px-1.5 py-0.5 rounded border border-[#EFEAE0]">
                  Top #{idx + 1}
                </span>
                <div className="text-[13px] font-bold text-[#071B3A] mt-2 truncate" title={op.name}>
                  {op.name}
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-[#EFEAE0] flex items-baseline justify-between">
                <span className="text-[11px] text-[#5E6B7E]">Comissão Total</span>
                <span className="text-[15px] font-black font-display text-[#E96F5F]">
                  {op.total}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
