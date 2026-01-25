import { afterAll, vi } from 'vitest';
import { EnemyDefinitions } from '../../core/EnemyDefinitions';
import { OBJECT_TYPES } from '../../core/ObjectDefinitions';
import { StateObjectManager } from '../../core/state/StateObjectManager';
import { ShareBase64 } from '../../core/share/ShareBase64';
import { ShareConstants } from '../../core/share/ShareConstants';
import { ShareDataNormalizer } from '../../core/share/ShareDataNormalizer';
import { ShareDecoder } from '../../core/share/ShareDecoder';
import { ShareEncoder } from '../../core/share/ShareEncoder';
import { ShareMath } from '../../core/share/ShareMath';
import { ShareMatrixCodec } from '../../core/share/ShareMatrixCodec';
import { SharePositionCodec } from '../../core/share/SharePositionCodec';
import { ShareTextCodec } from '../../core/share/ShareTextCodec';
import { ShareUrlHelper } from '../../core/share/ShareUrlHelper';
import { ShareVariableCodec } from '../../core/share/ShareVariableCodec';

type SetupOptions = {
  npcDefinitions?: Array<{ id?: string; type: string; name?: string; defaultText?: string; defaultTextKey?: string }>;
  enemyDefinitions?: Array<{ type: string }>;
  objectTypes?: Record<string, string>;
  enemyNormalize?: (type?: string) => string;
  playerEndTextLimit?: number;
};

export function setupShareGlobals(options: SetupOptions = {}) {
  const originalObjectTypes = { ...OBJECT_TYPES };
  const originalNpcDefinitions = (ShareConstants as ShareConstantsHack)._npcDefinitions;
  const originalEnemyDefinitions = (ShareConstants as ShareConstantsHack)._enemyDefinitions;

  if (options.npcDefinitions) {
    (ShareConstants as ShareConstantsHack)._npcDefinitions = options.npcDefinitions;
  }
  if (options.enemyDefinitions) {
    (ShareConstants as ShareConstantsHack)._enemyDefinitions = options.enemyDefinitions;
  }
  if (options.objectTypes) {
    Object.assign(OBJECT_TYPES, options.objectTypes);
  }
  if (options.enemyNormalize) {
    vi.spyOn(EnemyDefinitions, 'normalizeType').mockImplementation(options.enemyNormalize);
  }
  if (typeof options.playerEndTextLimit === 'number') {
    vi.spyOn(StateObjectManager, 'PLAYER_END_TEXT_LIMIT', 'get').mockReturnValue(options.playerEndTextLimit);
  }

  afterAll(() => {
    Object.keys(OBJECT_TYPES).forEach((key) => {
      if (!(key in originalObjectTypes)) {
        delete (OBJECT_TYPES as Record<string, string>)[key];
      }
    });
    Object.assign(OBJECT_TYPES, originalObjectTypes);
    (ShareConstants as ShareConstantsHack)._npcDefinitions = originalNpcDefinitions;
    (ShareConstants as ShareConstantsHack)._enemyDefinitions = originalEnemyDefinitions;
    vi.restoreAllMocks();
  });
}

export { ShareBase64, ShareConstants, ShareDataNormalizer, ShareDecoder, ShareEncoder, ShareMath, ShareMatrixCodec, SharePositionCodec, ShareTextCodec, ShareUrlHelper, ShareVariableCodec };

type ShareConstantsHack = {
  _npcDefinitions?: Array<{ id?: string; type: string; name?: string; defaultText?: string; defaultTextKey?: string }>;
  _enemyDefinitions?: Array<{ type: string }>;
};
