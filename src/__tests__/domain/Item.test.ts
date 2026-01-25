import { describe, expect, it } from 'vitest';
import { Item } from '../../runtime/domain/entities/Item';
import { ITEM_TYPES } from '../../runtime/domain/constants/itemTypes';

const createSprite = () => [[0]];

describe('Item', () => {
  it('defaults behavior when missing and returns empty tags', () => {
    const item = new Item({
      type: ITEM_TYPES.KEY,
      id: 'item-any',
      name: 'Any',
      nameKey: 'items.any',
      sprite: createSprite(),
    });

    expect(item.getTags()).toEqual([]);
    expect(item.hasTag('anything')).toBe(false);
  });

  it('returns a defensive copy of tags', () => {
    const item = new Item({
      type: ITEM_TYPES.SWITCH,
      id: 'item-tagged',
      name: 'Tagged',
      nameKey: 'items.tagged',
      behavior: { tags: ['alpha', 'beta'] },
      sprite: createSprite(),
    });

    const tags = item.getTags();
    tags.push('gamma');

    expect(item.getTags()).toEqual(['alpha', 'beta']);
    expect(item.hasTag('alpha')).toBe(true);
    expect(item.hasTag('gamma')).toBe(false);
  });

  it('uses fallback order when order is missing', () => {
    const item = new Item({
      type: ITEM_TYPES.DOOR,
      id: 'item-ordered',
      name: 'Ordered',
      nameKey: 'items.ordered',
      behavior: { tags: [] },
      sprite: createSprite(),
    });

    expect(item.getOrder(55)).toBe(55);
  });

  it('uses explicit order when provided', () => {
    const item = new Item({
      type: ITEM_TYPES.DOOR_VARIABLE,
      id: 'item-ordered',
      name: 'Ordered',
      nameKey: 'items.ordered',
      behavior: { order: 12 },
      sprite: createSprite(),
    });

    expect(item.getOrder(55)).toBe(12);
  });

  it('normalizes sword durability', () => {
    const missing = new Item({
      type: ITEM_TYPES.LIFE_POTION,
      id: 'item-none',
      name: 'None',
      nameKey: 'items.none',
      sprite: createSprite(),
    });

    const negative = new Item({
      type: ITEM_TYPES.SWORD,
      id: 'item-neg',
      name: 'Negative',
      nameKey: 'items.neg',
      behavior: { swordDurability: -2 },
      sprite: createSprite(),
    });

    const valid = new Item({
      type: ITEM_TYPES.SWORD_BRONZE,
      id: 'item-ok',
      name: 'Ok',
      nameKey: 'items.ok',
      behavior: { swordDurability: 3 },
      sprite: createSprite(),
    });

    expect(missing.getSwordDurability()).toBeNull();
    expect(negative.getSwordDurability()).toBe(0);
    expect(valid.getSwordDurability()).toBe(3);
  });
});
