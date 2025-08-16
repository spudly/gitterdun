export const sql = (
  strings: TemplateStringsArray,
  ...values: Array<unknown>
): string => {
  let result = '';
  for (let i = 0; i < strings.length; i++) {
    result += strings[i];
    if (i < values.length) {
      result += String(values[i]);
    }
  }
  return result;
};
