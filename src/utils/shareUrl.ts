import { CommissionData, AppSettings, Operator } from '../types';
import { DEFAULT_COMMISSION_DATA, DEFAULT_SETTINGS } from '../data/defaultData';

/**
 * Robust, lightweight URL sharing and persistence system.
 * - Uses compact Delta Encoding (v2) to keep URLs short (~200-500 characters)
 *   so links are NEVER truncated by WhatsApp, email clients, GitHub, or proxies.
 * - Fully backwards-compatible with legacy full payloads (v1).
 * - Handles both hash (#data=...) and query string (?data=...) formats.
 * - Safely handles URI encoding, UTF-8 strings, and special characters.
 */

interface LegacyPayload {
  v?: number;
  s?: Partial<AppSettings>;
  d?: {
    pf?: Array<[string, string, number[], string?]>;
    pme?: Array<[string, string, number[], string?]>;
    adesao?: Array<[string, string, number[], string?]>;
    auto?: Array<[string, string, number[], string?]>;
    consorcio?: Array<[string, string, number[], string?]>;
    vida?: Array<[string, string, number[], string?]>;
    demais?: Array<[string, string, number[], string?]>;
  };
}

interface DeltaPayload {
  v: 2;
  s?: Partial<AppSettings>;
  d: {
    [key: string]: {
      c?: Array<[string, string, number[], string?]>; // changed or added operators: [id, name, trimmedPs, obs]
      r?: string[]; // removed operator IDs
    };
  };
}

// Convert string to URL-safe Base64 without padding
function toUrlSafeBase64(str: string): string {
  try {
    const bytes = new TextEncoder().encode(str);
    let binary = '';
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode.apply(null, Array.from(chunk));
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

// Decode URL-safe Base64 to UTF-8 string
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
    } catch {
      return '';
    }
  }
}

// Helper to trim trailing zeros from parcels array to save URL space
function trimPs(ps: number[]): number[] {
  const trimmed = [...ps];
  while (trimmed.length > 0 && trimmed[trimmed.length - 1] === 0) {
    trimmed.pop();
  }
  return trimmed;
}

// Helper to expand parcels array back to 13 items
function expandPs(ps: number[] | undefined): number[] {
  const full = Array.isArray(ps) ? [...ps] : [];
  while (full.length < 13) {
    full.push(0);
  }
  return full.slice(0, 13);
}

/**
 * Encodes the current commission data and settings into a compact URL-safe hash string.
 * Uses delta encoding against default values to keep links exceptionally short.
 */
export function encodeStateToUrl(data: CommissionData, settings: AppSettings): string {
  const sections: Array<keyof CommissionData> = ['pf', 'pme', 'adesao', 'auto', 'consorcio', 'vida', 'demais'];
  const deltaD: DeltaPayload['d'] = {};
  let hasDataDiff = false;

  for (const sec of sections) {
    const currentList = data[sec] || [];
    const defaultList = DEFAULT_COMMISSION_DATA[sec] || [];
    const defMap = new Map<string, Operator>(defaultList.map((o) => [o.id, o]));
    const curIds = new Set<string>(currentList.map((o) => o.id));

    // Identify removed default operators
    const removedIds = defaultList.filter((o) => !curIds.has(o.id)).map((o) => o.id);

    // Identify changed or newly added operators
    const changedOps: Array<[string, string, number[], string?]> = [];
    for (const op of currentList) {
      const def = defMap.get(op.id);
      if (!def) {
        // Newly added operator
        changedOps.push([op.id, op.name, trimPs(op.ps), op.obs || '']);
      } else {
        // Compare with default
        const isPsDiff = JSON.stringify(op.ps) !== JSON.stringify(def.ps);
        const isNameDiff = op.name !== def.name;
        const isObsDiff = (op.obs || '') !== (def.obs || '');
        if (isPsDiff || isNameDiff || isObsDiff) {
          changedOps.push([op.id, op.name, trimPs(op.ps), op.obs || '']);
        }
      }
    }

    if (changedOps.length > 0 || removedIds.length > 0) {
      deltaD[sec] = {
        ...(changedOps.length > 0 ? { c: changedOps } : {}),
        ...(removedIds.length > 0 ? { r: removedIds } : {}),
      };
      hasDataDiff = true;
    }
  }

  // Compare settings with default settings
  const changedSettings: Partial<AppSettings> = {};
  let hasSettingsDiff = false;
  const settingsKeys: Array<keyof AppSettings> = [
    'emissao',
    'referencia',
    'brokerName',
    'brokerCategory',
    'brokerSubtitle',
  ];

  for (const key of settingsKeys) {
    if (settings[key] !== DEFAULT_SETTINGS[key]) {
      changedSettings[key] = settings[key] as any;
      hasSettingsDiff = true;
    }
  }

  // If nothing differs from default, return empty
  if (!hasDataDiff && !hasSettingsDiff) {
    return '';
  }

  const payload: DeltaPayload = {
    v: 2,
    ...(hasSettingsDiff ? { s: changedSettings } : {}),
    d: deltaD,
  };

  return toUrlSafeBase64(JSON.stringify(payload));
}

/**
 * Decodes the commission data and settings from a URL string, hash, or search param.
 * Supports:
 *  - Version 2: Delta format (starts with defaults, applies user diffs)
 *  - Version 1: Legacy full format (full operator arrays)
 */
export function decodeStateFromUrl(inputUrlOrHash?: string): {
  data?: CommissionData;
  settings?: Partial<AppSettings>;
} | null {
  try {
    let raw = inputUrlOrHash;
    if (!raw && typeof window !== 'undefined') {
      raw = `${window.location.search}${window.location.hash}`;
    }

    if (!raw || raw.trim() === '') return null;

    // Extract the token after 'data=' or clean hash
    let token = '';

    // Check search params first
    if (typeof window !== 'undefined' && window.location.search) {
      try {
        const params = new URLSearchParams(window.location.search);
        const pData = params.get('data');
        if (pData) token = pData;
      } catch {}
    }

    if (!token) {
      const match = raw.match(/[#?&]data=([^&#]+)/);
      if (match && match[1]) {
        token = match[1];
      }
    }

    if (!token) {
      let clean = raw.replace(/^[#?]/, '').replace(/^\/?[#?]/, '');
      if (clean.startsWith('data=')) {
        clean = clean.slice(5);
      }
      token = clean;
    }

    if (token.includes('%')) {
      try {
        token = decodeURIComponent(token);
      } catch {}
    }

    if (!token || token.trim() === '') return null;

    const json = fromUrlSafeBase64(token);
    if (!json) return null;

    const payload = JSON.parse(json);
    if (!payload) return null;

    // Handle Version 2: Delta Encoding
    if (payload.v === 2 && payload.d) {
      const reconstructed: CommissionData = JSON.parse(JSON.stringify(DEFAULT_COMMISSION_DATA));
      const sections: Array<keyof CommissionData> = ['pf', 'pme', 'adesao', 'auto', 'consorcio', 'vida', 'demais'];

      for (const sec of sections) {
        const diff = payload.d[sec];
        if (!diff) continue;

        const removedSet = new Set<string>(diff.r || []);
        let list = (reconstructed[sec] || []).filter((o) => !removedSet.has(o.id));

        if (Array.isArray(diff.c)) {
          for (const [id, name, ps, obs] of diff.c) {
            const existingIdx = list.findIndex((o) => o.id === id);
            const opObj: Operator = {
              id: id || `${sec}-${Math.random()}`,
              name: name || '',
              ps: expandPs(ps),
              obs: obs || '',
            };
            if (existingIdx >= 0) {
              list[existingIdx] = opObj;
            } else {
              list.push(opObj);
            }
          }
        }
        reconstructed[sec] = list;
      }

      return {
        data: reconstructed,
        settings: payload.s ? { ...DEFAULT_SETTINGS, ...payload.s } : undefined,
      };
    }

    // Handle Version 1 or Legacy Full Payload
    if (payload.d) {
      const legacy = payload as LegacyPayload;
      const parseOpList = (list: Array<[string, string, number[], string?]> | undefined, prefix: string): Operator[] => {
        if (!Array.isArray(list)) return [];
        return list.map(([id, name, ps, obs]) => ({
          id: id || `${prefix}-${Math.random()}`,
          name: name || '',
          ps: expandPs(ps),
          obs: obs || '',
        }));
      };

      const data: CommissionData = {
        pf: parseOpList(legacy.d?.pf, 'pf'),
        pme: parseOpList(legacy.d?.pme, 'pme'),
        adesao: parseOpList(legacy.d?.adesao, 'adesao'),
        auto: parseOpList(legacy.d?.auto, 'auto'),
        consorcio: parseOpList(legacy.d?.consorcio, 'consorcio'),
        vida: parseOpList(legacy.d?.vida, 'vida'),
        demais: parseOpList(legacy.d?.demais, 'demais'),
      };

      return {
        data,
        settings: legacy.s,
      };
    }

    return null;
  } catch (e) {
    console.warn('Failed to parse state from URL', e);
    return null;
  }
}

/**
 * Updates window.location.hash smoothly without triggering a page reload.
 */
export function syncUrlHash(data: CommissionData, settings: AppSettings) {
  try {
    if (typeof window === 'undefined') return;
    const encoded = encodeStateToUrl(data, settings);
    const cleanBase = window.location.href.split('#')[0];
    const newUrl = encoded ? `${cleanBase}#data=${encoded}` : cleanBase;

    if (window.location.href !== newUrl) {
      window.history.replaceState(null, '', newUrl);
    }
  } catch (e) {
    console.warn('Failed to sync URL hash', e);
  }
}

/**
 * Generates the full shareable URL containing all changes.
 */
export function getShareableUrl(data: CommissionData, settings: AppSettings): string {
  if (typeof window === 'undefined') return '';
  const encoded = encodeStateToUrl(data, settings);
  const cleanBase = window.location.href.split('#')[0];
  return encoded ? `${cleanBase}#data=${encoded}` : cleanBase;
}
