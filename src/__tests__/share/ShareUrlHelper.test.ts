import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { setupShareGlobals, ShareEncoder, ShareDecoder, ShareUrlHelper } from './shareTestUtils';

describe('ShareUrlHelper', () => {
  const originalHref = globalThis.location.href;

  beforeAll(() => {
    setupShareGlobals();
  });

  afterEach(() => {
    globalThis.history.replaceState({}, '', originalHref);
  });

  it('builds share urls using the current base url in localhost', () => {
    const spy = vi.spyOn(ShareEncoder, 'buildShareCode').mockReturnValue('abc');

    globalThis.history.replaceState({}, '', '/share');
    const url = ShareUrlHelper.buildShareUrl({});

    expect(url).toBe(`${globalThis.location.origin}/share#abc`);

    spy.mockRestore();
  });

  it('builds share urls using GitHub Pages URL in production', () => {
    const spy = vi.spyOn(ShareEncoder, 'buildShareCode').mockReturnValue('abc');
    const originalLocation = globalThis.location;

    delete (globalThis as { location?: Location }).location;
    globalThis.location = {
      ...originalLocation,
      hostname: 'andredarcie.github.io',
      origin: 'https://andredarcie.github.io',
      pathname: '/any-path/',
    } as Location;

    const url = ShareUrlHelper.buildShareUrl({});

    expect(url).toBe('https://andredarcie.github.io/tiny-rpg-studio/#abc');

    globalThis.location = originalLocation;

    spy.mockRestore();
  });

  it('extracts game data from a location hash', () => {
    const spy = vi.spyOn(ShareDecoder, 'decodeShareCode').mockReturnValue({ title: 'ok' });

    const data = ShareUrlHelper.extractGameDataFromLocation({ hash: '#code' } as Location);

    expect(data?.title).toBe('ok');
    expect(spy).toHaveBeenCalledWith('code');

    spy.mockRestore();
  });
});
