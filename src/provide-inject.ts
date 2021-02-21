import { getCurrentCtx, KeyType } from "./htsx";

export function provide<T>(key: KeyType, data: T) {
  const ctx = getCurrentCtx();
  console.log(ctx.provides);
  return Reflect.set(ctx.provides, key, data);
}

export function inject<T>(key: KeyType): T {
  const ctx = getCurrentCtx();
  return Reflect.get(ctx.provides, key) as T;
}

export function createProvideInject<D, K extends KeyType = symbol>(key?: K) {
  const _key = key || Symbol();
  return {
    provide(data: D) {
      provide(_key, data);
    },
    inject() {
      return inject(_key);
    },
  };
}

export class ProvideInject<D, K extends KeyType = symbol> {
  private _key: KeyType;
  constructor(public key?: K) {
    this._key = key || Symbol();
  }
  provide(data: D) {
    return provide(this._key, data);
  }
  inject() {
    return inject<D>(this._key);
  }
}
