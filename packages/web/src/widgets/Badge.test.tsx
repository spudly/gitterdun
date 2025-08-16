import {describe, expect, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {Badge} from './Badge';

describe('badge', () => {
  test('renders children', () => {
    render(<Badge variant="success">Yay</Badge>);
    expect(screen.getByText('Yay')).toBeInTheDocument();
  });

  test('handles other variants', () => {
    const {rerender} = render(<Badge variant="info">A</Badge>);
    expect(screen.getByText('A')).toBeInTheDocument();
    rerender(<Badge variant="warning">B</Badge>);
    expect(screen.getByText('B')).toBeInTheDocument();
    rerender(<Badge variant="danger">C</Badge>);
    expect(screen.getByText('C')).toBeInTheDocument();
    rerender(<Badge variant="purple">D</Badge>);
    expect(screen.getByText('D')).toBeInTheDocument();
    rerender(<Badge>Neutral</Badge>);
    expect(screen.getByText('Neutral')).toBeInTheDocument();
  });
});
