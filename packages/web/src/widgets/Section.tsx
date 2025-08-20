import type {FC, PropsWithChildren} from 'react';
import {createContext, useContext, useMemo} from 'react';
import {clsx} from 'clsx';
import {Heading} from './Heading.js';
import type {HeadingLevel} from './Heading.js';

const SectionContext = createContext<{level: number}>({level: 1});

type GapSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const isHeadingLevel = (level: number): level is HeadingLevel =>
  Number.isInteger(level) && level >= 1 && level <= 6;

export const Section: FC<
  PropsWithChildren<{
    header: string;
    headingLevel?: HeadingLevel;
    gap?: GapSize;
  }>
> = ({header, headingLevel, gap, children}) => {
  const {level: contextLevel} = useContext(SectionContext);

  const currentLevel = headingLevel ?? Math.min(contextLevel + 1, 6);

  if (!isHeadingLevel(currentLevel)) {
    throw new Error('Invalid heading level');
  }

  const newContextValue = useMemo(
    () => ({level: currentLevel}),
    [currentLevel],
  );

  // Generate gap classes
  const sectionClassName = clsx({
    'space-y-1': gap === 'xs',
    'space-y-2': gap === 'sm',
    'space-y-4': gap === 'md',
    'space-y-6': gap === 'lg',
    'space-y-8': gap === 'xl',
  });

  return (
    <section aria-label={header} className={sectionClassName}>
      <Heading level={currentLevel}>{header}</Heading>
      <SectionContext.Provider value={newContextValue}>
        {children}
      </SectionContext.Provider>
    </section>
  );
};
