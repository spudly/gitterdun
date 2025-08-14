import {render} from '@testing-library/react';
import {
  DocIcon,
  ClockIcon,
  CheckCircleIcon,
  SparklesIcon,
  TrophyIcon,
  InfoCircleIcon,
} from './icons';

describe('icons', () => {
  it('render svgs', () => {
    render(
      <div>
        <DocIcon />
        <ClockIcon />
        <CheckCircleIcon />
        <SparklesIcon />
        <TrophyIcon />
        <InfoCircleIcon />
      </div>,
    );
    expect(document.querySelectorAll('svg').length).toBeGreaterThan(0);
  });
});
