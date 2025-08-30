import {describe, expect, jest, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {createWrapper} from '../test/createWrapper.js';
import Family from './Family.js';
import React from 'react';

jest.mock('../hooks/useUser.js', () => ({useUser: () => ({user: {id: 1}})}));

jest.mock('../lib/api.js', () => ({
  familiesApi: {
    myFamily: async () => ({success: true, data: null}),
    listMembers: async () => ({success: true, data: []}),
    create: async () => ({success: true}),
  },
}));

// Mock widgets to detect usage in the page
jest.mock('../widgets/TextInput.js', () => ({
  TextInput: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input aria-label="TextInput-widget" {...props} />
  ),
}));

jest.mock('../widgets/Button.js', () => ({
  Button: (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button aria-label="Button-widget" type="button" {...props} />
  ),
}));

describe('family page widget usage', () => {
  test('uses TextInput and Button widgets for new family creation', async () => {
    const Wrapper = createWrapper({i18n: true, queryClient: true});
    render(<Family />, {wrapper: Wrapper});

    // When there is no family, the page should render the create form using widgets
    await screen.findByText('Your Family');

    // Presence of mocked widget instances confirms usage
    await expect(
      screen.findByLabelText('TextInput-widget'),
    ).resolves.toBeInTheDocument();
    expect(screen.getByLabelText('Button-widget')).toBeVisible();

    // And the accessible hooks still work
    expect(screen.getByPlaceholderText('New family name')).toBeVisible();
    expect(screen.getByLabelText('Button-widget')).toBeVisible();
  });
});
