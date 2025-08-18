export const pick = <OBJ extends object, KEY extends keyof OBJ>(
  obj: OBJ,
  keys: Array<KEY>,
): Pick<OBJ, KEY> =>
  keys.reduce(
    (acc, key) => {
      acc[key] = obj[key];
      return acc;
    },
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion -- this is the type it will be when reduce is finished
    {} as Pick<OBJ, KEY>,
  );
