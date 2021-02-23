import { getCurrentCtx } from "./htsx";

export function onResize(fn: () => void) {
  const ctx = getCurrentCtx();
  ctx.onResize.push(fn);
}

export function onConnected(fn: () => void) {
  const ctx = getCurrentCtx();
  ctx.onConnected.push(fn);
}

export function onDisonnected(fn: () => void) {
  const ctx = getCurrentCtx();
  ctx.onDisonnected.push(fn);
}
