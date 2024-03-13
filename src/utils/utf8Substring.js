const encoder = new TextEncoder();
const decoder = new TextDecoder();

// Get substring from UTF-8 index
export const utf8Substring = (str, utf8From, utf8To) => {
  const utf8Bytes = encoder.encode(str);
  const slicedBytes = utf8Bytes.slice(utf8From, utf8To);
  return decoder.decode(slicedBytes);
};
