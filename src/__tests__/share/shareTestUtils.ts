import { afterAll, vi } from 'vitest';
import { EnemyDefinitions } from '../../runtime/domain/definitions/EnemyDefinitions';
import { ITEM_TYPES } from '../../runtime/domain/definitions/ItemDefinitions';
import { StateObjectManager } from '../../runtime/domain/state/StateObjectManager';
import { ShareBase64 } from '../../runtime/infra/share/ShareBase64';
import { ShareConstants } from '../../runtime/infra/share/ShareConstants';
import { ShareDataNormalizer } from '../../runtime/infra/share/ShareDataNormalizer';
import { ShareDecoder } from '../../runtime/infra/share/ShareDecoder';
import { ShareEncoder } from '../../runtime/infra/share/ShareEncoder';
import { ShareMath } from '../../runtime/infra/share/ShareMath';
import { ShareMatrixCodec } from '../../runtime/infra/share/ShareMatrixCodec';
import { SharePositionCodec } from '../../runtime/infra/share/SharePositionCodec';
import { ShareTextCodec } from '../../runtime/infra/share/ShareTextCodec';
import { ShareUrlHelper } from '../../runtime/infra/share/ShareUrlHelper';
import { ShareVariableCodec } from '../../runtime/infra/share/ShareVariableCodec';

type SetupOptions = {
  npcDefinitions?: Array<{ id?: string; type: string; name?: string; defaultText?: string; defaultTextKey?: string }>;
  enemyDefinitions?: Array<{ type: string }>;
  objectTypes?: Record<string, string>;
  enemyNormalize?: (type?: string) => string;
  playerEndTextLimit?: number;
};

export function setupShareGlobals(options: SetupOptions = {}) {
  const originalObjectTypes = { ...ITEM_TYPES };
  const originalNpcDefinitions = (ShareConstants as ShareConstantsHack)._npcDefinitions;
  const originalEnemyDefinitions = (ShareConstants as ShareConstantsHack)._enemyDefinitions;

  if (options.npcDefinitions) {
    (ShareConstants as ShareConstantsHack)._npcDefinitions = options.npcDefinitions;
  }
  if (options.enemyDefinitions) {
    (ShareConstants as ShareConstantsHack)._enemyDefinitions = options.enemyDefinitions;
  }
  if (options.objectTypes) {
    Object.assign(ITEM_TYPES, options.objectTypes);
  }
  if (options.enemyNormalize) {
    vi.spyOn(EnemyDefinitions, 'normalizeType').mockImplementation(options.enemyNormalize);
  }
  if (typeof options.playerEndTextLimit === 'number') {
    vi.spyOn(StateObjectManager, 'PLAYER_END_TEXT_LIMIT', 'get').mockReturnValue(options.playerEndTextLimit);
  }

  afterAll(() => {
    Object.keys(ITEM_TYPES).forEach((key) => {
      if (!(key in originalObjectTypes)) {
        delete (ITEM_TYPES as Record<string, string>)[key];
      }
    });
    Object.assign(ITEM_TYPES, originalObjectTypes);
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
