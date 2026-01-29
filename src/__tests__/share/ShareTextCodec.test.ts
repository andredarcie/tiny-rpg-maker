import { beforeAll, describe, expect, it } from 'vitest';
import { setupShareGlobals, ShareTextCodec } from './shareTestUtils';

describe('ShareTextCodec', () => {
  beforeAll(() => {
    setupShareGlobals();
  });

  it('roundtrips text encoding', () => {
    const encoded = ShareTextCodec.encodeText('ola mundo');
    const decoded = ShareTextCodec.decodeText(encoded, 'fallback');

    expect(decoded).toBe('ola mundo');
  });

  it('roundtrips text arrays', () => {
    const values = ['um', 'dois', 'tres'];
    const encoded = ShareTextCodec.encodeTextArray(values);
    const decoded = ShareTextCodec.decodeTextArray(encoded);

    expect(decoded).toEqual(values);
  });

  it('returns fallbacks for empty inputs', () => {
    expect(ShareTextCodec.decodeText('', 'fallback')).toBe('fallback');
    expect(ShareTextCodec.decodeTextArray('')).toEqual([]);
  });
});
