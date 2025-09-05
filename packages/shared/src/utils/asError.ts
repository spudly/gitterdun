type AugmentedError = Error & {type?: string; status?: number; value?: unknown};

export const asError = (value: unknown): AugmentedError => {
  if (value instanceof Error) {
    return value;
  }

  return Object.assign(new Error(`Non-Error value thrown!`), {value});
};
