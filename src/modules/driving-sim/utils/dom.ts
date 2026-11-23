const written = new WeakMap<Element, Map<string, string>>();

/** True when `value` differs from what was last written to `el` under `key`. */
function changed(el: Element, key: string, value: string): boolean {
  let values = written.get(el);
  if (!values) {
    values = new Map();
    written.set(el, values);
  }
  if (values.get(key) === value) return false;
  values.set(key, value);
  return true;
}

/*
 * Per-frame HUD writes. A value that did not change is not written again, so a frame in which
 * nothing moved repaints nothing: without a GPU every repaint over the 3D canvas is costly.
 */

export function setText(el: Element | null, text: string): void {
  if (el && changed(el, 'text', text)) el.textContent = text;
}

export function setStyle(el: HTMLElement | SVGElement | null, property: string, value: string): void {
  if (el && changed(el, `style:${property}`, value)) el.style.setProperty(property, value);
}

export function setAttr(el: Element | null, name: string, value: string): void {
  if (el && changed(el, `attr:${name}`, value)) el.setAttribute(name, value);
}
