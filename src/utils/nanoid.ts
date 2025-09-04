export function nanoid(size = 10): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let id = '';
  const arr = new Uint32Array(size);
  crypto.getRandomValues(arr);
  for (let i = 0; i < size; i++) {
    id += chars[arr[i] % chars.length];
  }
  return id;
}
