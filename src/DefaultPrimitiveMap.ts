import { DefaultMap } from './DefaultMap.js'
import { PrimitiveType } from './types.js'

/**
 * @template TKey Key
 * @template TValue Value
 * @param key Key to add.
 * @param map The current map object
 */
export type Callback<TKey extends PrimitiveType, TValue> = (key: TKey, map: DefaultPrimitiveMap<TKey, TValue>) => TValue

export type Options = {
    /**
     * get: on key missing, return the default value from the default factory. Map unchanged. If the default factory function is not pure, this will make default values unstable.
     *
     * set: on key missing, add the default value from the default factory as an entry and return it. This avoids calling the factory again but changes the map which not be what you want.
     * @default 'set'
     */
    default?: 'get' | 'set'
}

/**
 * Primitive default map.
 * @template TKey Key
 * @template TValue Value
 */
export class DefaultPrimitiveMap<TKey extends PrimitiveType, TValue>
    extends Map<TKey, TValue>
    implements DefaultMap<TKey, TValue>
{
    readonly #defaultFactory
    readonly #setDefault: boolean
    /**
     * Creates an instance of default primitive map
     * @param defaultFactory Factory for the value
     * @param options Map options
     */
    constructor(defaultFactory: Callback<TKey, TValue>, options?: Options) {
        super()
        this.#defaultFactory = defaultFactory
        this.#setDefault = (options?.default ?? 'set') === 'set'
    }
    map(key: TKey, transform: (value: TValue) => TValue) {
        this.set(key, transform(this.get(key)))
    }
    override get(key: TKey) {
        const value = super.get(key)
        if (value !== undefined) {
            return value
        }
        const def = this.#defaultFactory(key, this)
        if (this.#setDefault) {
            this.set(key, def)
        }
        return def
    }
}
