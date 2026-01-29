import { describe, expect, it } from 'vitest';
import { StateDataManager } from '../../runtime/domain/state/StateDataManager';
import { StateVariableManager } from '../../runtime/domain/state/StateVariableManager';
import { StateSkillManager } from '../../runtime/domain/state/StateSkillManager';
import { StateItemManager } from '../../runtime/domain/state/StateItemManager';
import { StateDialogManager } from '../../runtime/domain/state/StateDialogManager';
import { GameStateLifecycle } from '../../runtime/domain/state/GameStateLifecycle';
import { GameStateWorldFacade } from '../../runtime/domain/state/GameStateWorldFacade';
import { GameStateDataFacade } from '../../runtime/domain/state/GameStateDataFacade';
import { GameStateScreenManager } from '../../runtime/domain/state/GameStateScreenManager';

describe('Core state classes', () => {
  it('StateDataManager exports a class', () => {
    expect(typeof StateDataManager).toBe('function');
  });

  it('StateVariableManager exports a class', () => {
    expect(typeof StateVariableManager).toBe('function');
  });

  it('StateSkillManager exports a class', () => {
    expect(typeof StateSkillManager).toBe('function');
  });

  it('StateItemManager exports a class', () => {
    expect(typeof StateItemManager).toBe('function');
  });

  it('StateDialogManager exports a class', () => {
    expect(typeof StateDialogManager).toBe('function');
  });

  it('GameStateLifecycle exports a class', () => {
    expect(typeof GameStateLifecycle).toBe('function');
  });

  it('GameStateWorldFacade exports a class', () => {
    expect(typeof GameStateWorldFacade).toBe('function');
  });

  it('GameStateDataFacade exports a class', () => {
    expect(typeof GameStateDataFacade).toBe('function');
  });

  it('GameStateScreenManager exports a class', () => {
    expect(typeof GameStateScreenManager).toBe('function');
  });

});
