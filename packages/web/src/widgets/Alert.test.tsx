import {render, screen, fireEvent} from '@testing-library/react';
import {Alert} from './Alert';

describe('Alert', () => {
  it('shows types, title and dismiss', () => {
    const onDismiss = jest.fn();
    const {rerender} = render(
      <Alert onDismiss={onDismiss} title="T" type="info">
        Body
      </Alert>,
    );
    expect(screen.getByText('T')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', {name: /dismiss/i}));
    expect(onDismiss).toHaveBeenCalled();
    rerender(<Alert type="success">S</Alert>);
    expect(screen.getByText('S')).toBeInTheDocument();
    rerender(<Alert type="error">E</Alert>);
    expect(screen.getByText('E')).toBeInTheDocument();
    rerender(<Alert type="warning">W</Alert>);
    expect(screen.getByText('W')).toBeInTheDocument();
    rerender(<Alert type="info">I</Alert>);
    expect(screen.getByText('I')).toBeInTheDocument();
  });

  it('defaults type to info when omitted', () => {
    render(<Alert>Default</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-blue-50', 'border-blue-200', 'text-blue-800');
  });
});
