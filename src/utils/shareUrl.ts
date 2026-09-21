import { CommissionData, AppSettings } from '../types';

/**
 * Compact representation for encoding in URL hash
 * This ensures that when the user edits the table or settings,
 * the entire state can be encoded directly into a shareable link/URL hash.
 * Anyone opening that link will see the exact edited data!
 */

interface EncodedPayload {
  v: number; // version
  s?: Partial<AppSettings>;
  d: {
    pf: Array<[string, string, number[], string?]>; // [id, name, ps, obs]
    pme: Array<[string, string, number[], string?]>;
    adesao: Array<[string, string, number[], string?]>;
    auto?: Array<[string, string, number[], string?]>;
    consorcio?: Array<[string, string, number[], string?]>;
    vida?: Array<[string, string, number[], string?]>;
    demais?: Array<[string, string, number[], string?]>;
  };
}

// Simple LZ-like string compression / base64 url-safe serialization
function toUrlSafeBase64(str: string): string {
  try {
    const bytes = new TextEncoder().encode(str);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  } catch (e) {
    console.error('Error encoding to url safe base64', e);
    return encodeURIComponent(str);
  }
}

function fromUrlSafeBase64(str: string): string {
  try {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch (e) {
    try {
      return decodeURIComponent(str);
    } catch (err) {
      console.error('Error decoding base64', e, err);
      return '';
    }
  }
}

export function encodeStateToUrl(data: CommissionData, settings: AppSettings): string {
  const payload: EncodedPayload = {
    v: 1,
    s: {
      emissao: settings.emissao,
      referencia: settings.referencia,
      brokerName: settings.brokerName,
      brokerCategory: settings.brokerCategory,
      brokerSubtitle: settings.brokerSubtitle,
    },
    d: {
      pf: (data.pf || []).map((op) => [op.id, op.name, op.ps, op.obs || '']),
      pme: (data.pme || []).map((op) => [op.id, op.name, op.ps, op.obs || '']),
      adesao: (data.adesao || []).map((op) => [op.id, op.name, op.ps, op.obs || '']),
      auto: (data.auto || []).map((op) => [op.id, op.name, op.ps, op.obs || '']),
      consorcio: (data.consorcio || []).map((op) => [op.id, op.name, op.ps, op.obs || '']),
      vida: (data.vida || []).map((op) => [op.id, op.name, op.ps, op.obs || '']),
      demais: (data.demais || []).map((op) => [op.id, op.name, op.ps, op.obs || '']),
    },
  };

  const json = JSON.stringify(payload);
  const hash = toUrlSafeBase64(json);
  return hash;
}

export function decodeStateFromUrl(hash: string): { data?: CommissionData; settings?: Partial<AppSettings> } | null {
  if (!hash || hash.trim() === '') return null;
  // Remove leading '#' or 'data=' if present
  let cleanHash = hash.replace(/^#/, '');
  if (cleanHash.startsWith('data=')) {
    cleanHash = cleanHash.slice(5);
  }
  if (!cleanHash) return null;

  try {
    const json = fromUrlSafeBase64(cleanHash);
    if (!json) return null;
    const payload: EncodedPayload = JSON.parse(json);
    if (!payload || !payload.d) return null;

    const data: CommissionData = {
      pf: (payload.d.pf || []).map(([id, name, ps, obs]) => ({
        id: id || `pf-${Math.random()}`,
        name: name || '',
        ps: Array.isArray(ps) ? ps : [],
        obs: obs || '',
      })),
      pme: (payload.d.pme || []).map(([id, name, ps, obs]) => ({
        id: id || `pme-${Math.random()}`,
        name: name || '',
        ps: Array.isArray(ps) ? ps : [],
        obs: obs || '',
      })),
      adesao: (payload.d.adesao || []).map(([id, name, ps, obs]) => ({
        id: id || `adesao-${Math.random()}`,
        name: name || '',
        ps: Array.isArray(ps) ? ps : [],
        obs: obs || '',
      })),
      auto: (payload.d.auto || []).map(([id, name, ps, obs]) => ({
        id: id || `auto-${Math.random()}`,
        name: name || '',
        ps: Array.isArray(ps) ? ps : [],
        obs: obs || '',
      })),
      consorcio: (payload.d.consorcio || []).map(([id, name, ps, obs]) => ({
        id: id || `consorcio-${Math.random()}`,
        name: name || '',
        ps: Array.isArray(ps) ? ps : [],
        obs: obs || '',
      })),
      vida: (payload.d.vida || []).map(([id, name, ps, obs]) => ({
        id: id || `vida-${Math.random()}`,
        name: name || '',
        ps: Array.isArray(ps) ? ps : [],
        obs: obs || '',
      })),
      demais: (payload.d.demais || []).map(([id, name, ps, obs]) => ({
        id: id || `demais-${Math.random()}`,
        name: name || '',
        ps: Array.isArray(ps) ? ps : [],
        obs: obs || '',
      })),
    };

    return {
      data,
      settings: payload.s,
    };
  } catch (e) {
    console.error('Failed to parse state from url hash', e);
    return null;
  }
}

/**
 * Updates window.location.hash smoothly without reloading
 */
export function syncUrlHash(data: CommissionData, settings: AppSettings) {
  try {
    const encoded = encodeStateToUrl(data, settings);
    const newUrl = `${window.location.pathname}${window.location.search}#data=${encoded}`;
    window.history.replaceState(null, '', newUrl);
  } catch (e) {
    console.error('Failed to sync URL hash', e);
  }
}

/**
 * Generates the full shareable URL
 */
export function getShareableUrl(data: CommissionData, settings: AppSettings): string {
  const encoded = encodeStateToUrl(data, settings);
  const base = `${window.location.origin}${window.location.pathname}${window.location.search}`;
  return `${base}#data=${encoded}`;
}
