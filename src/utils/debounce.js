export function createDebouncedFunc(func, delay = 200) {
  let timeout;

  return (...args) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(async () => {
      func(...args);
    }, delay);
  };
}
