import React from 'react';
import { BookOpen, AlertCircle, FileCheck, ShieldAlert, Percent, HelpCircle } from 'lucide-react';

export const RulesView: React.FC = () => {
  return (
    <div id="rules-view" className="space-y-4 max-w-4xl mx-auto">
      {/* Regras Gerais */}
      <div className="bg-white rounded-2xl p-6 border border-[#EFEAE0] shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-[#4A86D9]" />
          <h2 className="text-[16px] font-bold text-[#071B3A] font-display">
            Regras Gerais de Comissionamento
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {/* Base de cálculo */}
          <div className="flex gap-3 p-3.5 bg-[#F8F5EF] rounded-xl">
            <div className="w-1 bg-[#4A86D9] rounded-full flex-shrink-0 my-0.5"></div>
            <div>
              <div className="text-[13px] font-bold text-[#071B3A] mb-1">
                Base de cálculo
              </div>
              <div className="text-[12.5px] text-[#2A3A52] leading-relaxed">
                A comissão é calculada sobre o valor da mensalidade/prêmio. Cada coluna de parcela
                representa o percentual a receber naquele mês específico sobre o valor contratado.
              </div>
            </div>
          </div>

          {/* Cancelamentos e chargebacks */}
          <div className="flex gap-3 p-3.5 bg-[#F8F5EF] rounded-xl">
            <div className="w-1 bg-[#4A86D9] rounded-full flex-shrink-0 my-0.5"></div>
            <div>
              <div className="text-[13px] font-bold text-[#071B3A] mb-1">
                Cancelamentos e chargebacks
              </div>
              <div className="text-[12.5px] text-[#2A3A52] leading-relaxed">
                Cancelamentos dentro da carência de 3 meses implicam estorno integral da comissão
                recebida. Após a carência, o estorno é proporcional ao período vigente.
              </div>
            </div>
          </div>

          {/* Planos por Adesão - Parcela 1 */}
          <div className="flex gap-3 p-3.5 bg-[#F8F5EF] rounded-xl">
            <div className="w-1 bg-[#4A86D9] rounded-full flex-shrink-0 my-0.5"></div>
            <div>
              <div className="text-[13px] font-bold text-[#071B3A] mb-1">
                Planos por Adesão — Parcela 1
              </div>
              <div className="text-[12.5px] text-[#2A3A52] leading-relaxed">
                Em contratos de adesão, a 1ª parcela é paga diretamente pelo cliente ao corretor.
                As demais parcelas seguem o fluxo normal de comissionamento repassado via corretora.
              </div>
            </div>
          </div>

          {/* Auto, Consórcios e Demais Ramos */}
          <div className="flex gap-3 p-3.5 bg-[#F8F5EF] rounded-xl">
            <div className="w-1 bg-[#2F9E73] rounded-full flex-shrink-0 my-0.5"></div>
            <div>
              <div className="text-[13px] font-bold text-[#071B3A] mb-1">
                Seguro Auto, Consórcios e Ramos Elementares
              </div>
              <div className="text-[12.5px] text-[#2A3A52] leading-relaxed">
                Em seguros de automóvel e patrimoniais, a comissão incide sobre o prêmio líquido (sem IOF e juros).
                Em consórcios, a remuneração é sobre o crédito faturado, com liberação após confirmação de pagamento da 1ª parcela.
                Vida e Previdência contemplam taxa de agenciamento inicial somada à remuneração de carteira / manutenção.
              </div>
            </div>
          </div>

          {/* GNDI Imposto */}
          <div className="flex gap-3 p-3.5 bg-[#F8F5EF] rounded-xl">
            <div className="w-1 bg-[#E96F5F] rounded-full flex-shrink-0 my-0.5"></div>
            <div>
              <div className="text-[13px] font-bold text-[#071B3A] mb-1 flex items-center gap-1.5">
                <span>GNDI — Imposto 6,65%</span>
                <span className="text-[10px] bg-[#E96F5F]/15 text-[#E96F5F] px-1.5 py-0.5 rounded font-bold uppercase">
                  Atenção
                </span>
              </div>
              <div className="text-[12.5px] text-[#2A3A52] leading-relaxed">
                Nas operadoras GNDI Notrelife (PF) e GNDI (PME), há incidência de imposto de 6,65%
                sobre a 3ª e 4ª parcela respectivamente. Verifique o valor líquido antes de
                repassar ao corretor ou fechar o fluxo financeiro.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tributação */}
      <div className="bg-white rounded-2xl p-6 border border-[#EFEAE0] shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <Percent className="w-5 h-5 text-[#2F9E73]" />
          <h2 className="text-[16px] font-bold text-[#071B3A] font-display">
            Tributação e Enquadramento Fiscal
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="p-4 bg-[#F8F5EF] rounded-xl border border-[#EFEAE0]">
            <div className="text-[11px] uppercase tracking-wider text-[#5E6B7E] font-bold mb-1">
              Planos de Saúde
            </div>
            <div className="text-[13.5px] font-bold text-[#071B3A] mb-1">
              ISS: 5% sobre a comissão
            </div>
            <div className="text-[12px] text-[#2A3A52] leading-relaxed">
              Retido na fonte pela operadora pagadora conforme legislação municipal. O valor
              apresentado nesta grade representa o montante bruto pré-retenção de ISS.
            </div>
          </div>

          <div className="p-4 bg-[#2F9E73]/10 rounded-xl border border-[#2F9E73]/20">
            <div className="text-[11px] uppercase tracking-wider text-[#2F9E73] font-bold mb-1">
              Importante — Corretores PJ
            </div>
            <div className="text-[13.5px] font-bold text-[#071B3A] mb-1">
              Emissão de Nota Fiscal
            </div>
            <div className="text-[12px] text-[#2A3A52] leading-relaxed">
              Corretores pessoa jurídica (PJ) estão sujeitos a IRPJ, CSLL, PIS e COFINS conforme o
              enquadramento tributário (Simples Nacional ou Lucro Presumido). Consulte sua assessoria
              contábil.
            </div>
          </div>
        </div>
      </div>

      {/* Dúvidas e Suporte da Corretora */}
      <div className="bg-white rounded-2xl p-5 border border-[#EFEAE0] shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#4A86D9]/15 flex items-center justify-center text-[#4A86D9]">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[13px] font-bold text-[#071B3A]">
              Dúvidas sobre comissões ou regras comerciais?
            </div>
            <div className="text-[12px] text-[#5E6B7E]">
              Entre em contato direto com a equipe operacional e financeira da corretora.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
