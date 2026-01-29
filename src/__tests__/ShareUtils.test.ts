import { describe, expect, it, vi } from 'vitest';
import { ShareUtils } from '../runtime/infra/share/ShareUtils';
import { ShareDecoder } from '../runtime/infra/share/ShareDecoder';
import { ShareEncoder } from '../runtime/infra/share/ShareEncoder';
import { ShareUrlHelper } from '../runtime/infra/share/ShareUrlHelper';

describe('ShareUtils', () => {
  it('delegates to share helpers', () => {
    const buildUrlSpy = vi.spyOn(ShareUrlHelper, 'buildShareUrl').mockReturnValue('url');
    const extractSpy = vi
      .spyOn(ShareUrlHelper, 'extractGameDataFromLocation')
      .mockReturnValue({ title: 'test' });
    const encodeSpy = vi.spyOn(ShareEncoder, 'buildShareCode').mockReturnValue('code');
    const decodeSpy = vi.spyOn(ShareDecoder, 'decodeShareCode').mockReturnValue({ title: 'decoded' });

    expect(ShareUtils.buildShareUrl({ title: 'test' })).toBe('url');
    expect(ShareUtils.extractGameDataFromLocation({} as Location)).toEqual({ title: 'test' });
    expect(ShareUtils.encode({ title: 'test' })).toBe('code');
    expect(ShareUtils.decode('code')).toEqual({ title: 'decoded' });

    expect(buildUrlSpy).toHaveBeenCalledTimes(1);
    expect(extractSpy).toHaveBeenCalledTimes(1);
    expect(encodeSpy).toHaveBeenCalledTimes(1);
    expect(decodeSpy).toHaveBeenCalledTimes(1);
  });
});
