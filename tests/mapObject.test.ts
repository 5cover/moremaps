import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import * as mapObject from '../src/mapObject.js';

await describe('mapObject', async () => {
    await it('should have no prototype', () => {
        const o = mapObject.create();
        assert.equal(Object.getPrototypeOf(o), null);
    })
    await it('should create empty object', () => {
        const o = mapObject.create<string, number>();
        assert.deepEqual(Object.entries(o), []);
    })
    await it('should assign properties', () => {
        const o = mapObject.assign({a: 1, b: 2});
        assert.deepEqual(Object.entries(o), [['a', 1], ['b', 2]]);
    })
});