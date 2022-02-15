import { derived, writable } from "svelte/store";

const _acitve = writable({ node: null, el: null, hoverd: null });

const _lock = writable(false);

export const active = {
  subscribe: _acitve.subscribe,
  set({ node, el, hoverd }) {
    _acitve.set({ node, el, hoverd });
  },
  unHoverd() {
    _acitve.update((v) => {
      return { ...v, hoverd: null };
    });
  },
  hoverd(el) {
    _acitve.update((v) => {
      return { ...v, hoverd: el };
    });
  },
};

export const hightlight = derived(_acitve, ($active) => {
  const el = $active.hoverd || $active.el;
  if (el) {
    return `top: ${el.offsetTop || 0}px; height: ${el.offsetHeight || 0}px`;
  }
  return "";
});

export const scrollLock = {
  subscribe: _lock.subscribe,
  set(v) {
    _lock.set(v);
  },
};
