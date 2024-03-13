// Convert UTF-8 index to javascript's UTF-16 string index
export const utf8IndexToJavascriptIndex = (str, utf8Index) => {
  let utf8Counter = 0;
  let stringIndex = 0;
  while (utf8Counter < utf8Index) {
    const code = str.codePointAt(stringIndex);
    if (code >= 0x10000) {
      utf8Counter += 4;
      ++stringIndex;
    } else if (code >= 0x0800) {
      utf8Counter += 3;
    } else if (code >= 0x0080) {
      utf8Counter += 2;
    } else {
      ++utf8Counter;
    }
    ++stringIndex;
  }
  return stringIndex;
};
