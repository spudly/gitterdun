import {describe, expect, jest, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Alert} from './Alert';
import {createWrapper} from '../test/createWrapper';

describe('alert', () => {
  test('shows types, title and dismiss', async () => {
    const onDismiss = jest.fn();
    const Wrapper = createWrapper({i18n: true});
    const {rerender} = render(
      <Alert onDismiss={onDismiss} title="T" type="info">
        Body
      </Alert>,
      {wrapper: Wrapper},
    );
    expect(screen.getByText('T')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {name: /dismiss/i}));
    expect(onDismiss).toHaveBeenCalledWith();
    rerender(<Alert type="success">S</Alert>);
    expect(screen.getByText('S')).toBeInTheDocument();
    rerender(<Alert type="error">E</Alert>);
    expect(screen.getByText('E')).toBeInTheDocument();
    rerender(<Alert type="warning">W</Alert>);
    expect(screen.getByText('W')).toBeInTheDocument();
    rerender(<Alert type="info">I</Alert>);
    expect(screen.getByText('I')).toBeInTheDocument();
  });

  test('defaults type to info when omitted', () => {
    const Wrapper = createWrapper({i18n: true});
    render(<Alert>Default</Alert>, {wrapper: Wrapper});
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-blue-50', 'border-blue-200', 'text-blue-800');
  });
});
