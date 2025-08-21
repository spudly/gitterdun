import pirate from './pirate.js';
import piglatin from './piglatin.js';

const supportedLocales = ['en', 'pirate', 'piglatin'] as const;

type SupportedLocales = typeof supportedLocales;
export type SupportedLocale = SupportedLocales[number];

export const isSupportedLocale = (locale: string): locale is SupportedLocale =>
  supportedLocales.some(supportedLocale => supportedLocale === locale);

export const getMessagesForLocale = (locale: SupportedLocale) => {
  switch (locale) {
    case 'pirate':
      return pirate;
    case 'piglatin':
      return piglatin;
    case 'en':
    default:
      // For English, rely on defaultMessage strings inline in source files
      return {} as Record<string, string>;
  }
};
