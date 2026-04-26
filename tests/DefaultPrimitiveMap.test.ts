import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { DefaultPrimitiveMap } from '../src/DefaultPrimitiveMap.js'

await describe(DefaultPrimitiveMap.name, async () => {
    await it('returns default for missing key and caches it', () => {
        let calls = 0
        const m = new DefaultPrimitiveMap<string, number>(k => {
            calls++
            return k.length
        })

        assert.equal(m.get('abc'), 3)
        assert.equal(calls, 1)

        // cached
        assert.equal(m.get('abc'), 3)
        assert.equal(calls, 1)
    })

    await it('returns existing value without calling default factory', () => {
        let calls = 0
        const m = new DefaultPrimitiveMap<string, number>(() => {
            calls++
            return 99
        })

        m.set('x', 42)
        assert.equal(m.get('x'), 42)
        assert.equal(calls, 0)
    })

    await it('map transforms existing value', () => {
        let calls = 0
        const m = new DefaultPrimitiveMap<string, number>(() => {
            calls++
            return 0
        })

        m.set('k', 10)
        m.map('k', v => v + 5)
        assert.equal(m.get('k'), 15)
        assert.equal(calls, 0)
    })

    await it('map initializes missing key using default then transforms', () => {
        let calls = 0
        const m = new DefaultPrimitiveMap<string, number>(k => {
            calls++
            return k.length
        })

        m.map('abcd', v => v * 2)
        assert.equal(m.get('abcd'), 8)
        assert.equal(calls, 1)
    })

    await it('does not confuse falsy values (e.g., 0) with undefined', () => {
        let calls = 0
        const m = new DefaultPrimitiveMap<string, number>(() => {
            calls++
            return 123
        })

        m.set('zero', 0)
        assert.equal(m.get('zero'), 0)
        assert.equal(calls, 0)
    })

    await it('if default is undefined, factory is invoked on each get', () => {
        let calls = 0
        const m = new DefaultPrimitiveMap<string, number | undefined>(() => {
            calls++
            return undefined
        })

        assert.equal(m.get('u'), undefined)
        assert.equal(m.get('u'), undefined)
        assert.equal(calls, 2)
    })

    await it('can handle undefined default by transforming to defined value', () => {
        const m = new DefaultPrimitiveMap<string, number | undefined>(() => undefined)

        m.map('x', v => v ?? 1)
        assert.equal(m.get('x'), 1)
    })

    await it('passes itself to the default factory', () => {
        const m: DefaultPrimitiveMap<string, number> = new DefaultPrimitiveMap((_, map) => {
            assert.equal(map, m)
            return 3
        })
        assert.equal(m.get('a'), 3)
        assert.equal(m.get('b'), 3)
    })

    await it('materializes impure default factory results in set mode', () => {
        for (const options of [
            undefined,
            {},
            { default: undefined },
            { default: 'set' },
            {
                get default() {
                    return 'set' as const
                },
            },
            Object.create({ default: 'set' }),
        ] as const) {
            const m: DefaultPrimitiveMap<string, number> = new DefaultPrimitiveMap((_, map) => {
                assert.equal(map, m)
                return map.size
            }, options)
            assert.equal(m.size, 0)
            assert.equal(m.size, m.get('a'))
            assert.equal(m.size, 1)
            assert.equal(m.size, m.get('b'))
            assert.equal(m.size, 2)
            assert.equal(m.get('a'), 0)
            assert.equal(m.get('b'), 1)
        }
    })

    await it('calls default factory every time', () => {
        const m: DefaultPrimitiveMap<string, number> = new DefaultPrimitiveMap(
            (_, map) => {
                assert.equal(map, m)
                return map.size
            },
            {
                mode: 'get',
            },
        )
        assert.equal(m.size, 0)
        assert.equal(m.size, m.get('a'))
        assert.equal(m.size, 0)
        assert.equal(m.size, m.get('b'))
        assert.equal(m.size, 0)
        assert.equal(m.get('a'), 0)
        assert.equal(m.get('b'), 0)
    })
})
