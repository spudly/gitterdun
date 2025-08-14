import {render, screen} from '@testing-library/react';
import {Text} from './Text';

describe('Text', () => {
  it('renders with variants', () => {
    render(
      <>
        <Text as="h1" size="2xl" weight="bold">
          Heading
        </Text>
        <Text muted uppercase>
          Muted Upper
        </Text>
        <Text capitalize>cap words</Text>
      </>,
    );
    expect(screen.getByText('Heading')).toBeInTheDocument();
    expect(screen.getByText('Muted Upper')).toBeInTheDocument();
    expect(screen.getByText('cap words')).toBeInTheDocument();
  });
});
