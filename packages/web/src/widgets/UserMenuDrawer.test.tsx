import {beforeEach, describe, expect, jest, test} from '@jest/globals';
import {act, render, screen} from '@testing-library/react';
import {createWrapper} from '../test/createWrapper';
import {UserMenuDrawer} from './UserMenuDrawer';

describe('userMenuDrawer animations', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  test('unmounts when closed', () => {
    const Wrapper = createWrapper({
      i18n: true,
      router: {initialEntries: ['/']},
    });
    const {rerender} = render(
      <UserMenuDrawer
        onClose={() => {}}
        onLogout={() => {}}
        open
        username="User"
      />,
      {wrapper: Wrapper},
    );

    expect(
      screen.getByRole('dialog', {name: /user menu/i}),
    ).toBeInTheDocument();

    rerender(
      <UserMenuDrawer
        onClose={() => {}}
        onLogout={() => {}}
        open={false}
        username="User"
      />,
    );

    // Closed should unmount immediately
    expect(
      screen.queryByRole('dialog', {name: /user menu/i}),
    ).not.toBeInTheDocument();
  });

  test('panel uses translate-x classes when opening', () => {
    const Wrapper = createWrapper({
      i18n: true,
      router: {initialEntries: ['/']},
    });
    render(
      <UserMenuDrawer
        onClose={() => {}}
        onLogout={() => {}}
        open
        username="User"
      />,
      {wrapper: Wrapper},
    );
    act(() => {
      jest.advanceTimersByTime(0);
    });
    const panelOpen = screen.getByTestId('user-menu-panel');
    expect(panelOpen.className).toMatch(/translate-x-0/);
  });

  test('hides identity section when logged out', () => {
    const Wrapper = createWrapper({
      i18n: true,
      router: {initialEntries: ['/']},
    });
    render(
      <UserMenuDrawer
        onClose={() => {}}
        onLogout={() => {}}
        open
        username={null}
      />,
      {wrapper: Wrapper},
    );

    expect(screen.queryByText(/signed in as/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^user$/i)).not.toBeInTheDocument();
    expect(screen.getByRole('link', {name: /login/i})).toBeInTheDocument();
  });

  test('shows Profile link above Settings when logged in', () => {
    const Wrapper = createWrapper({
      i18n: true,
      router: {initialEntries: ['/']},
    });
    render(
      <UserMenuDrawer
        onClose={() => {}}
        onLogout={() => {}}
        open
        username="User"
      />,
      {wrapper: Wrapper},
    );

    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAccessibleName(/profile/i);
    expect(links[1]).toHaveAccessibleName(/settings/i);
  });
});
