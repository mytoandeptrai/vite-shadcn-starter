export const setLocalStorageItem = (key: string, value: string) => {
  const event = new Event('itemInserted');
  (event as any).key = key;
  (event as any).value = value;
  document.dispatchEvent(event);
  localStorage.setItem(key, value);
};

export const removeLocalStorageItem = (key: string) => {
  const event = new Event('itemRemoved');
  (event as any).key = key;
  document.dispatchEvent(event);
  localStorage.removeItem(key);
};

interface LocalStorageItem {
  value: string;
  expiry?: number;
}
export const setLocalStorageItemWithTtl = (key: string, value: string, ttl?: number) => {
  const item: LocalStorageItem = { value };
  if (ttl) {
    item.expiry = Date.now() + ttl;
  }

  const event = new Event('itemInserted');
  (event as any).key = key;
  (event as any).value = value;
  document.dispatchEvent(event);

  localStorage.setItem(key, JSON.stringify(item));
};
  