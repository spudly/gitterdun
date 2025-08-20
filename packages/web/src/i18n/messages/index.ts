import en from './en.js';
import pirate from './pirate.js';
import piglatin from './piglatin.js';

export const supportedLocales = ['en', 'pirate', 'piglatin'] as const;
export type SupportedLocale = (typeof supportedLocales)[number];

export const getMessagesForLocale = (locale: string) => {
  switch (locale) {
    case 'pirate':
      return pirate;
    case 'piglatin':
      return piglatin;
    case 'en':
    default:
      return en;
  }
};

