export const sql = (
  strings: TemplateStringsArray,
  ...values: Array<unknown>
): string => {
  let result = '';
  for (let index = 0; index < strings.length; index++) {
    result += strings[index];
    if (index < values.length) {
      result += String(values[index]);
    }
  }
  return result;
};
