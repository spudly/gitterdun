import {beforeEach, describe, expect, jest, test} from '@jest/globals';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {AdminFamilyCreation} from './AdminFamilyCreation';
import * as apiModule from '../../lib/api';
import {createWrapper} from '../../test/createWrapper';

jest.mock('../../lib/api', () => ({
  familiesApi: {create: jest.fn(async () => ({success: true}))},
}));

describe('<AdminFamilyCreation />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('renders placeholder and button label', () => {
    const onMessageChange = jest.fn();
    const Wrapper = createWrapper({i18n: true, router: true});
    render(<AdminFamilyCreation onMessageChange={onMessageChange} />, {
      wrapper: Wrapper,
    });

    expect(screen.getByPlaceholderText('Family name')).toBeInTheDocument();
    expect(
      screen.getByRole('button', {name: 'Create Family'}),
    ).toBeInTheDocument();
  });

  test('submits and shows success message', async () => {
    const onMessageChange = jest.fn();
    const Wrapper = createWrapper({i18n: true, router: true});
    render(<AdminFamilyCreation onMessageChange={onMessageChange} />, {
      wrapper: Wrapper,
    });

    fireEvent.change(screen.getByPlaceholderText('Family name'), {
      target: {value: 'The Jetsons'},
    });
    fireEvent.click(screen.getByRole('button', {name: 'Create Family'}));

    await waitFor(() => {
      expect(onMessageChange).toHaveBeenCalledWith(
        'Family created. Redirecting...',
        'success',
      );
    });
  });

  test('does not submit when empty', async () => {
    const onMessageChange = jest.fn();
    const mocked = jest.mocked(apiModule);
    const Wrapper2 = createWrapper({i18n: true, router: true});
    render(<AdminFamilyCreation onMessageChange={onMessageChange} />, {
      wrapper: Wrapper2,
    });

    fireEvent.click(screen.getByRole('button', {name: 'Create Family'}));

    await waitFor(() => {
      expect(onMessageChange).not.toHaveBeenCalled();
    });
    expect(mocked.familiesApi.create).not.toHaveBeenCalled();
  });

  test('handles thrown error with fallback message', async () => {
    const onMessageChange = jest.fn();
    const mocked = jest.mocked(apiModule);
    mocked.familiesApi.create.mockRejectedValueOnce(new Error('nope'));

    const Wrapper3 = createWrapper({i18n: true, router: true});
    render(<AdminFamilyCreation onMessageChange={onMessageChange} />, {
      wrapper: Wrapper3,
    });

    fireEvent.change(screen.getByPlaceholderText('Family name'), {
      target: {value: 'The Jetsons'},
    });
    fireEvent.click(screen.getByRole('button', {name: 'Create Family'}));

    await waitFor(() => {
      expect(onMessageChange).toHaveBeenCalledWith(
        'Failed to create family',
        'error',
      );
    });
  });
});
