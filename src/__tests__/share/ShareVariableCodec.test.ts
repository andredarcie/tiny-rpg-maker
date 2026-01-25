import { beforeAll, describe, expect, it } from 'vitest';
import { setupShareGlobals, ShareConstants, ShareVariableCodec } from './shareTestUtils';

describe('ShareVariableCodec', () => {
  beforeAll(() => {
    setupShareGlobals();
  });

  it('encodes and decodes variable states', () => {
    const ids = ShareConstants.VARIABLE_IDS;
    const variables = [
      { id: ids[0], value: true },
      { id: ids[1], value: false }
    ];

    const encoded = ShareVariableCodec.encodeVariables(variables);
    const decoded = ShareVariableCodec.decodeVariables(encoded);

    expect(decoded[0]).toBe(true);
    expect(decoded[1]).toBe(false);
  });

  it('maps variable ids to nibbles and back', () => {
    const id = ShareConstants.VARIABLE_IDS[0];
    const nibble = ShareVariableCodec.variableIdToNibble(id);

    expect(nibble).toBe(1);
    expect(ShareVariableCodec.nibbleToVariableId(nibble)).toBe(id);
  });

  it('roundtrips nibble arrays', () => {
    const values = [1, 0, 3, 4, 15];
    const encoded = ShareVariableCodec.encodeVariableNibbleArray(values);
    const decoded = ShareVariableCodec.decodeVariableNibbleArray(encoded, values.length);

    expect(decoded).toEqual(values);
  });

  it('builds variable entries from states', () => {
    const states = ShareConstants.VARIABLE_IDS.map((_, index) => index === 0);
    const entries = ShareVariableCodec.buildVariableEntries(states);

    expect(entries.length).toBe(ShareConstants.VARIABLE_IDS.length);
    expect(entries[0].value).toBe(true);
    expect(entries[0].name).toBeTruthy();
  });
});
