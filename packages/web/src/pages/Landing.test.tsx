import {describe, expect, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {createWrapper} from '../test/createWrapper';
import Landing from './Landing';

describe('landing page', () => {
  test('shows welcome copy and CTA links', () => {
    const Wrapper = createWrapper({
      i18n: true,
      router: {initialEntries: ['/landing']},
    });
    render(<Landing />, {wrapper: Wrapper});
    expect(
      screen.getByRole('heading', {name: /welcome to gitterdun/i}),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /organize chores\. motivate your family\. have fun together\./i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', {name: /login/i})).toHaveAttribute(
      'href',
      '/login',
    );
    expect(screen.getByRole('link', {name: /register/i})).toHaveAttribute(
      'href',
      '/register',
    );
  });
});
