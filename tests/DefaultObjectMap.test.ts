import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import DefaultObjectMap from '../src/DefaultObjectMap.js';

await describe(DefaultObjectMap.name, async () => {
    interface Key {
        id: number;
    }
    const createMap = () =>
        new DefaultObjectMap<Key, number, string>(
            () => 0,
            key => JSON.stringify(key),
            prim => JSON.parse(prim) as Key,
        );

    await it('constructor creates instance', () => {
        const map = createMap();
        assert(map instanceof DefaultObjectMap);
    });

    await it('get returns default for new key', () => {
        const map = createMap();
        assert.strictEqual(map.get({ id: 1 }), 0);
    });

    await it('get returns set value', () => {
        const map = createMap();
        map.set({ id: 1 }, 42);
        assert.strictEqual(map.get({ id: 1 }), 42);
    });

    await it('set stores value', () => {
        const map = createMap();
        map.set({ id: 1 }, 42);
        assert.strictEqual(map.get({ id: 1 }), 42);
    });

    await it('has returns true for set key', () => {
        const map = createMap();
        map.set({ id: 1 }, 42);
        assert(map.has({ id: 1 }));
    });

    await it('has returns false for unset key', () => {
        const map = createMap();
        assert(!map.has({ id: 1 }));
    });

    await it('delete removes existing key', () => {
        const map = createMap();
        map.set({ id: 1 }, 42);
        assert(map.delete({ id: 1 }));
        assert(!map.has({ id: 1 }));
    });

    await it('delete returns false for non-existing key', () => {
        const map = createMap();
        assert(!map.delete({ id: 1 }));
    });

    await it('clear removes all', () => {
        const map = createMap();
        map.set({ id: 1 }, 42);
        map.set({ id: 2 }, 24);
        map.clear();
        assert.strictEqual(map.size, 0);
        assert(!map.has({ id: 1 }));
        assert(!map.has({ id: 2 }));
    });

    await it('size reflects entries', () => {
        const map = createMap();
        assert.strictEqual(map.size, 0);
        map.set({ id: 1 }, 42);
        assert.strictEqual(map.size, 1);
        map.set({ id: 2 }, 24);
        assert.strictEqual(map.size, 2);
        map.delete({ id: 1 });
        assert.strictEqual(map.size, 1);
    });

    await it('forEach iterates correctly', () => {
        const map = createMap();
        map.set({ id: 1 }, 42);
        map.set({ id: 2 }, 24);
        const results: [number, { id: number }][] = [];
        map.forEach((v, k) => results.push([v, k]));
        assert.deepStrictEqual(results, [
            [42, { id: 1 }],
            [24, { id: 2 }],
        ]);
    });

    await it('entries iterates correctly', () => {
        const map = createMap();
        map.set({ id: 1 }, 42);
        map.set({ id: 2 }, 24);
        const results = Array.from(map.entries());
        assert.deepStrictEqual(results, [
            [{ id: 1 }, 42],
            [{ id: 2 }, 24],
        ]);
    });

    await it('keys iterates correctly', () => {
        const map = createMap();
        map.set({ id: 1 }, 42);
        map.set({ id: 2 }, 24);
        const results = Array.from(map.keys());
        assert.deepStrictEqual(results, [{ id: 1 }, { id: 2 }]);
    });

    await it('values iterates correctly', () => {
        const map = createMap();
        map.set({ id: 1 }, 42);
        map.set({ id: 2 }, 24);
        const results = Array.from(map.values());
        assert.deepStrictEqual(results, [42, 24]);
    });

    await it('[Symbol.iterator] works', () => {
        const map = createMap();
        map.set({ id: 1 }, 42);
        map.set({ id: 2 }, 24);
        const results = [];
        for (const [k, v] of map) {
            results.push([k, v]);
        }
        assert.deepStrictEqual(results, [
            [{ id: 1 }, 42],
            [{ id: 2 }, 24],
        ]);
    });

    await it('[Symbol.toStringTag] is Map', () => {
        const map = createMap();
        assert.strictEqual(map[Symbol.toStringTag], 'Map');
    });

    await it('map transforms value', () => {
        const map = createMap();
        map.set({ id: 1 }, 42);
        map.map({ id: 1 }, v => v * 2);
        assert.strictEqual(map.get({ id: 1 }), 84);
    });
});
