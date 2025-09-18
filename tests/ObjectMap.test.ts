import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import { ObjectMap } from '../src/ObjectMap.js';

// Helper functions for key conversion
const keyToPrim = (key: { id: number }) => key.id;
const primToKey = (primKey: number) => ({ id: primKey });

await describe(ObjectMap.name, async () => {
    let map: ObjectMap<{ id: number }, string, number>;

    beforeEach(() => {
        map = new ObjectMap(keyToPrim, primToKey);
    });

    await it('set and get', () => {
        map.set({ id: 1 }, 'one');
        assert.equal(map.get({ id: 1 }), 'one');
        assert.equal(map.get({ id: 2 }), undefined);
    });

    await it('has', () => {
        map.set({ id: 2 }, 'two');
        assert(map.has({ id: 2 }));
        assert(!map.has({ id: 3 }));
    });

    await it('delete', () => {
        map.set({ id: 3 }, 'three');
        assert(map.delete({ id: 3 }));
        assert(!map.has({ id: 3 }));
        assert(!map.delete({ id: 3 }));
    });

    await it('size', () => {
        assert.equal(map.size, 0);
        map.set({ id: 1 }, 'one');
        map.set({ id: 2 }, 'two');
        assert.equal(map.size, 2);
        map.delete({ id: 1 });
        assert.equal(map.size, 1);
    });

    await it('clear', () => {
        map.set({ id: 1 }, 'one');
        map.set({ id: 2 }, 'two');
        map.clear();
        assert.equal(map.size, 0);
        assert.equal(map.get({ id: 1 }), undefined);
    });

    await it('forEach', () => {
        map.set({ id: 1 }, 'one');
        map.set({ id: 2 }, 'two');
        const keys: number[] = [];
        const values: string[] = [];
        map.forEach((value, key) => {
            keys.push(key.id);
            values.push(value);
        });
        assert.deepEqual(keys.sort(), [1, 2]);
        assert.deepEqual(values.sort(), ['one', 'two']);
    });

    await it('entries iterator', () => {
        map.set({ id: 1 }, 'one');
        map.set({ id: 2 }, 'two');
        const entries = Array.from(map.entries());
        assert.deepEqual(entries, [
            [{ id: 1 }, 'one'],
            [{ id: 2 }, 'two'],
        ]);
    });

    await it('keys iterator', () => {
        map.set({ id: 1 }, 'one');
        map.set({ id: 2 }, 'two');
        const keys = Array.from(map.keys()).map(k => k.id);
        assert.deepEqual(keys.sort(), [1, 2]);
    });

    await it('values iterator', () => {
        map.set({ id: 1 }, 'one');
        map.set({ id: 2 }, 'two');
        const values = Array.from(map.values());
        assert.deepEqual(values.sort(), ['one', 'two']);
    });

    await it('Symbol.iterator yields entries', () => {
        map.set({ id: 1 }, 'one');
        map.set({ id: 2 }, 'two');
        const entries = Array.from(map);
        assert.deepEqual(entries, [
            [{ id: 1 }, 'one'],
            [{ id: 2 }, 'two'],
        ]);
    });

    await it('Symbol.toStringTag', () => {
        assert.equal(Object.prototype.toString.call(map), '[object Map]');
    });
});
