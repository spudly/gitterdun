module.exports = {
  plugins: ['prettier-plugin-embed', 'prettier-plugin-sql'],
  arrowParens: 'avoid',
  endOfLine: 'lf',
  printWidth: 80,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
  bracketSameLine: false,
  bracketSpacing: false,
  experimentalOperatorPosition: 'start',
  objectWrap: 'collapse',
  proseWrap: 'always',

  // prettier-plugin-embed:
  embeddedSqlTags: ['sql'],

  // prettier-plugin-sql:
  language: 'sqlite',
  keywordCase: 'upper',
  dataTypeCase: 'upper',
  functionCase: 'upper',
  identifierCase: 'lower',
  indentStyle: 'standard',
  logicalOperatorNewline: 'before',
  expressionWidth: 50,
  linesBetweenQueries: 1,
  denseOperators: false,
  newlineBeforeSemicolon: false,
};
