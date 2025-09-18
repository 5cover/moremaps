const brandMapObjectKey = Symbol('brandMapObjectKey');

type Branded<T> = T & { [brandMapObjectKey]: undefined };
type Key = string | number | symbol;

export type MapObject<K extends Key, V> = Branded<Record<K, V>>;
export type PartialMapObject<K extends Key, V> = Branded<Partial<Record<K, V>>>;

export function create<K extends Key, V>() {
    return Object.create(null) as PartialMapObject<K, V>;
}

export function assign<K extends Key, V>(source: Record<K, V>): MapObject<K, V> {
    return Object.assign(create(), source);
}
