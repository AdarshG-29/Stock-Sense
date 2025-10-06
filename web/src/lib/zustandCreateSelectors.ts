import {StoreApi, UseBoundStore} from 'zustand';

type WithSelector<S> = S extends {getState: () => infer T} 
 ? S & {use: {[K in keyof T]: () => T[K]}} 
 : never

export const createSelectors = <T extends UseBoundStore<StoreApi<object>>>(_store: T) => {
    const store = _store as WithSelector<typeof _store>;
    store.use = {};

    for(const k of Object.keys(store.getState())){
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
    }
    return store;
}
