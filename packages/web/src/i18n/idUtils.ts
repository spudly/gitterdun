export const slugifyDefaultMessage = (defaultMessage: string): string => {
  return defaultMessage
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(?:^-|-$)/g, '')
    .slice(0, 30);
};

export const computeHumanReadableId = (
  sourceFilePath: string,
  defaultMessage: string,
): string => {
  const afterSrc = sourceFilePath.split('/src/')[1] ?? sourceFilePath;
  let relativeFromSrc = afterSrc.replace(/^\/+/, '');
  if (relativeFromSrc.startsWith('src/')) {
    relativeFromSrc = relativeFromSrc.slice(4);
  }
  const fileScope = relativeFromSrc
    .replace(/\.[tj]sx?$/, '')
    .replace(/\//g, '.');
  const slug = slugifyDefaultMessage(defaultMessage);
  return `${fileScope}.${slug}`;
};
