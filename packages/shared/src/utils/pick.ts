export const pick = <OBJ extends object, KEY extends keyof OBJ>(
  obj: OBJ,
  keys: Array<KEY>,
): Pick<OBJ, KEY> => {
  const result = Object.create(null) as Pick<OBJ, KEY>;
  for (const key of keys) {
    result[key] = obj[key];
  }
  return result;
};
