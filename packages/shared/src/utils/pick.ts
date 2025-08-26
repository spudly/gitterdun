export const pick = <OBJ extends object, KEY extends keyof OBJ>(
  obj: OBJ,
  keys: Array<KEY>,
): Pick<OBJ, KEY> =>
  keys.reduce(
    (acc, key) => {
      acc[key] = obj[key];
      return acc;
    },
    {} as Pick<OBJ, KEY>,
  );
