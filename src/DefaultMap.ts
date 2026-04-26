export type DefaultMap<TKey, TValue> = Map<TKey, TValue> & {
    get(key: TKey): TValue
}
