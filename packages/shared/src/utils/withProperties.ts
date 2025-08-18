import {pick} from './pick';

export const withProperties = <FN extends () => Promise<void> | void>(
  obj: object,
  props: object,
  fn: FN,
): ReturnType<FN> extends Promise<unknown> ? Promise<void> : undefined => {
  // Store Original Values
  // @ts-expect-error -- we know the keys are valid
  const originalValues = pick(obj, Object.keys(props));
  const restore = () => {
    Object.assign(obj, originalValues);
  };

  // Set New Values
  Object.assign(obj, props);

  // Run the function
  const result = fn();

  if (result instanceof Promise) {
    // @ts-expect-error -- we know the return type is void
    return result.then(() => {}).finally(restore);
  }
  restore();
  // @ts-expect-error -- we know the return type is void
  return undefined;
};
