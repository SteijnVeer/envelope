import Storage from 'expo-sqlite/kv-store';
import { useCallback, useEffect, useState } from 'react';

// --- Types ---

type StoreKey = string;

type StoreValue = string | number | boolean | object | null;

type StoreRecord = Record<StoreKey, StoreValue>;

type StoredValue<SR extends StoreRecord, K extends StoreKey> = (K extends keyof SR ? SR[K] : StoreValue) | null;

type StoreChangeListener<SR extends StoreRecord = StoreRecord, K extends StoreKey = StoreKey> = (key: K, value: StoredValue<SR, K>) => void;

type StoreChangeUnsubscribe = () => void;

type Store<SR extends StoreRecord = StoreRecord> = {
  readonly $SR: SR;
  readonly $K: keyof SR;
  get<K extends StoreKey>(key: K): StoredValue<SR, K>;
  set<K extends StoreKey>(key: K, value: StoredValue<SR, K>): void;
  delete<K extends StoreKey>(key: K): void;
  clear(excludedKeys?: (keyof SR)[]): void;
  onValueChange<K extends StoreKey>(key: K, callback: StoreChangeListener<SR, K>): StoreChangeUnsubscribe;
  onValueChange(callback: StoreChangeListener<SR>): StoreChangeUnsubscribe;
};

// --- Internal ---

const changeListenersKey = new Map<StoreKey, Set<StoreChangeListener>>();
const changeListenersAny = new Set<StoreChangeListener>();

const callChangeListeners: StoreChangeListener = (key, value) => {
  const listenersForKey = changeListenersKey.get(key);
  if (listenersForKey)
    for (const listener of listenersForKey)
      listener(key, value);
  for (const listener of changeListenersAny)
    listener(key, value);
};

const store = {
  get(key) {
    const raw = Storage.getItemSync(key);
    if (raw === null)
      return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.warn(`Failed to parse stored value for key "${key}". Returning raw string.`, e);
      return raw;
    }
  },
  set(key, value) {
    const stringified = JSON.stringify(value);
    Storage.setItemSync(key, stringified);
    callChangeListeners(key, value);
  },
  delete(key) {
    Storage.removeItemSync(key);
    callChangeListeners(key, null);
  },
  clear(excludedKeys = []) {
    const allKeys = Storage.getAllKeysSync();
    if (excludedKeys.length === 0) {
      Storage.clearSync();
      for (const key of allKeys)
        callChangeListeners(key, null);
    } else
      for (const key of allKeys)
        if (!excludedKeys.includes(key))
          store.delete(key);
  },
  onValueChange(keyOrCallback, maybeCallback) {
    if (typeof keyOrCallback === 'function' && maybeCallback === undefined) {
      const callback = keyOrCallback as StoreChangeListener;
      changeListenersAny.add(callback);
      return () => {
        changeListenersAny.delete(callback);
      };
    } else if (typeof keyOrCallback === 'string' && typeof maybeCallback === 'function') {
      const key = keyOrCallback as StoreKey;
      const callback = maybeCallback as StoreChangeListener;
      if (!changeListenersKey.has(key))
        changeListenersKey.set(key, new Set());
      changeListenersKey.get(key)!.add(callback);
      return () => {
        const callbacks = changeListenersKey.get(key);
        if (callbacks) {
          callbacks.delete(callback);
          if (callbacks.size === 0)
            changeListenersKey.delete(key);
        }
      };
    } else
      throw new Error(`Invalid arguments for onValueChange. Expected (key: string, callback: function) or (callback: function). Received: (${typeof keyOrCallback}, ${typeof maybeCallback})`);
  },
} as Store<StoreRecord>; // todo add a way to globally extend the StoreRecord type with app-specific keys and types!

// --- Hooks ---

export function useStore(): typeof store {
  return store;
}

export function useStoreValue<K extends typeof store.$K>(key: K): [StoredValue<typeof store.$SR, K>, (value: StoredValue<typeof store.$SR, K>) => void] {
  const [value, setValue] = useState<StoredValue<typeof store.$SR, K>>(() => store.get(key));

  useEffect(() => {
    const unsubscribe = store.onValueChange(key, (_, newValue) => setValue(newValue));
    return unsubscribe;
  }, [key]);

  const setStoreValue = useCallback((newValue: StoredValue<typeof store.$SR, K>) => {
    store.set(key, newValue);
  }, [key]);

  return [value, setStoreValue];
}

export function useStoreValues<K extends typeof store.$K>(keys: K[]): [Record<K, StoredValue<typeof store.$SR, K>>, (values: Partial<Record<K, StoredValue<typeof store.$SR, K>>>) => void] {
  const [values, setValues] = useState<Record<K, StoredValue<typeof store.$SR, K>>>(() =>
    Object.fromEntries(keys.map((key) => [key, store.get(key)])) as Record<K, StoredValue<typeof store.$SR, K>>
  );

  useEffect(() => {
    const unsubscribe = store.onValueChange((key, newValue) => {
      if (!keys.includes(key as K))
        return;
      setValues((prev) => ({ ...prev, [key]: newValue }));
    });
    return unsubscribe;
  }, [keys]);

  const setStoreValues = useCallback((newValues: Partial<Record<K, StoredValue<typeof store.$SR, K>>>) => {
    for (const [key, value] of Object.entries(newValues) as [K, StoredValue<typeof store.$SR, K>][])
      if (keys.includes(key))
        store.set(key, value);
  }, [keys]);

  return [values, setStoreValues];
}
