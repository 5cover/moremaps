export interface DefaultMap<TKey, TValue> extends Map<TKey, TValue> {
    get(key: TKey): TValue
}
