export const hasTailwindMarginClasses = (
  classNameValue: string,
): Array<string> => {
  const marginPrefixes = [
    'm-',
    'mt-',
    'mr-',
    'mb-',
    'ml-',
    'mx-',
    'my-',
    '-m-',
    '-mt-',
    '-mr-',
    '-mb-',
    '-ml-',
    '-mx-',
    '-my-',
  ];

  const classes = classNameValue.split(/\s+/).filter(Boolean);
  const violatingClasses: Array<string> = [];
  for (const className of classes) {
    for (const prefix of marginPrefixes) {
      if (className.startsWith(prefix)) {
        violatingClasses.push(className);
        break;
      }
    }
  }
  return violatingClasses;
};
