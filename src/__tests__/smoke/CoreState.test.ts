import { describe, expect, it } from 'vitest';
import { StateDataManager } from '../../core/state/StateDataManager';
import { StateVariableManager } from '../../core/state/StateVariableManager';
import { StateSkillManager } from '../../core/state/StateSkillManager';
import { StateItemManager } from '../../core/state/StateItemManager';
import { StateDialogManager } from '../../core/state/StateDialogManager';
import { GameStateLifecycle } from '../../core/state/GameStateLifecycle';
import { GameStateWorldFacade } from '../../core/state/GameStateWorldFacade';
import { GameStateDataFacade } from '../../core/state/GameStateDataFacade';
import { GameStateScreenManager } from '../../core/state/GameStateScreenManager';

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
