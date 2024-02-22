export const insertLS = (key, value) => {
  if (global.localStorage) {
    global.localStorage.setItem(key, JSON.stringify(value));
  }
};

export const getLS = (key) => {
  let value = null;
  if (global.localStorage) {
    try {
      value = JSON.parse(global.localStorage.getItem(key));
    } catch {
      // Ignore parse error and not found
    }
  }
  return value;
};

