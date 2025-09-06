import {describe, expect, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {Text} from './Text.js';

describe('text', () => {
  test('renders with variants', () => {
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
    expect(screen.getByText('Heading')).toHaveTextContent('Heading');
    expect(screen.getByText('Muted Upper')).toHaveTextContent('Muted Upper');
    expect(screen.getByText('cap words')).toHaveTextContent('cap words');
  });
});
