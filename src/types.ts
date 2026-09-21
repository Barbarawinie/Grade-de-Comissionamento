export interface Operator {
  id: string;
  name: string;
  ps: number[]; // 13 installments (index 0 = 1ª parcela, index 12 = 13ª parcela)
  obs?: string;
}

export type SectionType =
  | 'dashboard'
  | 'pf'
  | 'pme'
  | 'adesao'
  | 'auto'
  | 'consorcio'
  | 'vida'
  | 'demais'
  | 'regras';

export interface CommissionData {
  pf: Operator[];
  pme: Operator[];
  adesao: Operator[];
  auto: Operator[];
  consorcio: Operator[];
  vida: Operator[];
  demais: Operator[];
}

export interface AppSettings {
  emissao: string;
  referencia: string;
  brokerName: string;
  brokerCategory: string;
  brokerSubtitle: string;
  adminPassword: string;
}

