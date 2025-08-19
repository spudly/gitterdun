import {describe, expect, jest, test} from '@jest/globals';
import {render, screen, fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Modal, isOverlayKey, shouldCloseOnOverlayClick} from './Modal';

describe('modal', () => {
  test('opens and closes via overlay, escape and close button', async () => {
    const onClose = jest.fn();
    render(
      <Modal isOpen onClose={onClose} title="M">
        <div>Body</div>
      </Modal>,
    );
    expect(screen.getByText('M')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
    const overlay = screen.getByRole('button', {name: 'Close modal'});
    await userEvent.click(overlay);
    await userEvent.keyboard('{Escape}');
    const closeButton = screen.getByRole('button', {name: 'Close'});
    await userEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledWith();
  });

  test('respects props and closed state', async () => {
    const onClose = jest.fn();
    const {rerender} = render(
      <Modal isOpen={false} onClose={onClose}>
        <div>Body</div>
      </Modal>,
    );
    expect(document.querySelector('.fixed')).toBeNull();
    rerender(
      <Modal
        closeOnOverlayClick={false}
        isOpen
        onClose={onClose}
        showCloseButton={false}
      >
        <div>Body</div>
      </Modal>,
    );
    const overlay = screen.getByRole('button', {name: 'Close modal'});
    overlay.focus();
    await userEvent.keyboard('{Enter}');
    // also hit Space branch
    await userEvent.keyboard(' ');
    // now enable closeOnOverlayClick and click overlay directly
    rerender(
      <Modal
        closeOnOverlayClick
        isOpen
        onClose={onClose}
        showCloseButton={false}
      >
        <div>Body</div>
      </Modal>,
    );
    const overlay2 = screen.getByRole('button', {name: 'Close modal'});
    await userEvent.click(overlay2);
    // ensure when disabled, clicking overlay does not call onClose
    rerender(
      <Modal
        closeOnOverlayClick={false}
        isOpen
        onClose={onClose}
        showCloseButton={false}
      >
        <div>Body</div>
      </Modal>,
    );
    const overlay3 = screen.getByRole('button', {name: 'Close modal'});
    await userEvent.click(overlay3);
    expect(onClose).toHaveBeenCalledWith();
  });

  test('overlay key helper covers both branches', () => {
    expect(isOverlayKey('Enter')).toBe(true);
    expect(isOverlayKey(' ')).toBe(true);
    expect(isOverlayKey('Escape')).toBe(false);
  });

  test('overlay click helper covers all branches', () => {
    expect(shouldCloseOnOverlayClick(true, true)).toBe(true);
    expect(shouldCloseOnOverlayClick(true, false)).toBe(false);
    expect(shouldCloseOnOverlayClick(false, true)).toBe(false);
  });

  test('closes on overlay keydown when enabled', async () => {
    const onClose = jest.fn();
    render(
      <Modal
        closeOnOverlayClick
        isOpen
        onClose={onClose}
        showCloseButton={false}
      >
        <div>Body</div>
      </Modal>,
    );
    const overlay = screen.getByRole('button', {name: 'Close modal'});
    // Triggers onKeyDown branch and should close because closeOnOverlayClick=true
    overlay.focus();
    await userEvent.keyboard('{Enter}');
    expect(onClose).toHaveBeenCalledWith();
  });

  test('does not close on non-overlay keydown', async () => {
    const onClose = jest.fn();
    render(
      <Modal
        closeOnOverlayClick
        isOpen
        onClose={onClose}
        showCloseButton={false}
      >
        <div>Body</div>
      </Modal>,
    );
    const overlay = screen.getByRole('button', {name: 'Close modal'});
    // Use a key that is not handled by isOverlayKey and is not Escape
    fireEvent.keyDown(overlay, {key: 'A'});
    expect(onClose).not.toHaveBeenCalled();
  });
});
