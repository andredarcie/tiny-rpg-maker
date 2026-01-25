import { beforeAll, describe, expect, it, vi } from 'vitest';
import { setupShareGlobals, ShareBase64 } from './shareTestUtils';

describe('ShareBase64', () => {
  beforeAll(() => {
    setupShareGlobals();
  });

  it('roundtrips base64 url encoding', () => {
    const bytes = Uint8Array.from([0, 1, 2, 254, 255]);
    const encoded = ShareBase64.toBase64Url(bytes);
    const decoded = ShareBase64.fromBase64Url(encoded);

    expect(Array.from(decoded)).toEqual(Array.from(bytes));
  });

  it('returns empty array for invalid input', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const decoded = ShareBase64.fromBase64Url('@@not-base64@@');

    expect(decoded.length).toBe(0);
    expect(warnSpy).toHaveBeenCalled();

    warnSpy.mockRestore();
  });
});
