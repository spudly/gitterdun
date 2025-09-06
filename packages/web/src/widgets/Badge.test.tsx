import {describe, expect, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {Badge} from './Badge.js';

describe('badge', () => {
  test('renders children', () => {
    render(<Badge variant="success">Yay</Badge>);
    expect(screen.getByText('Yay')).toHaveTextContent('Yay');
  });

  test('handles other variants', () => {
    const {rerender} = render(<Badge variant="info">A</Badge>);
    expect(screen.getByText('A')).toHaveTextContent('A');
    rerender(<Badge variant="warning">B</Badge>);
    expect(screen.getByText('B')).toHaveTextContent('B');
    rerender(<Badge variant="danger">C</Badge>);
    expect(screen.getByText('C')).toHaveTextContent('C');
    rerender(<Badge variant="purple">D</Badge>);
    expect(screen.getByText('D')).toHaveTextContent('D');
    rerender(<Badge>Neutral</Badge>);
    expect(screen.getByText('Neutral')).toHaveTextContent('Neutral');
  });
});
