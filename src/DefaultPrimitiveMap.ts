import { DefaultMap } from './DefaultMap.js';
import { PrimitiveType } from './types.js';

export class DefaultPrimitiveMap<TKey extends PrimitiveType, TValue>
    extends Map<TKey, TValue>
    implements DefaultMap<TKey, TValue>
{
    readonly #defaultFactory;
    constructor(defaultFactory: (key: TKey, map: DefaultPrimitiveMap<TKey, TValue>) => TValue) {
        super();

        this.#defaultFactory = defaultFactory;
    }
    map(key: TKey, transform: (value: TValue) => TValue) {
        this.set(key, transform(this.get(key)));
    }
    override get(key: TKey) {
        const value = super.get(key);
        if (value !== undefined) {
            return value;
        }
        const def = this.#defaultFactory(key, this);
        this.set(key, def);
        return def;
    }
}
