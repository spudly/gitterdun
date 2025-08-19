import type {FC} from 'react';
import {Modal} from '../Modal.js';
import {Button} from '../Button.js';
import {TextInput} from '../TextInput.js';
import {Stack} from '../Stack.js';
import {GridContainer} from '../GridContainer.js';
import {FormField} from '../FormField.js';
import {Checkbox} from '../Checkbox.js';

type FormModalDemoProps = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onOpen: () => void;
  readonly modalTitle: string;
  readonly onModalTitleChange: (title: string) => void;
  readonly showCloseButton: boolean;
  readonly onShowCloseButtonChange: (show: boolean) => void;
  readonly closeOnOverlayClick: boolean;
  readonly onCloseOnOverlayClickChange: (close: boolean) => void;
};

export const FormModalDemo: FC<FormModalDemoProps> = ({
  isOpen,
  onClose,
  onOpen,
  modalTitle,
  onModalTitleChange,
  showCloseButton,
  onShowCloseButtonChange,
  closeOnOverlayClick,
  onCloseOnOverlayClickChange,
}) => {
  return (
    <>
      <Button onClick={onOpen} variant="primary">
        Open Form Modal
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
        title="User Registration Form"
      >
        <form>
          <Stack>
            <GridContainer cols={2}>
              <FormField htmlFor="first-name" label="First Name" required>
                <TextInput
                  id="first-name"
                  placeholder="Enter first name"
                  required
                />
              </FormField>
              <FormField htmlFor="last-name" label="Last Name" required>
                <TextInput
                  id="last-name"
                  placeholder="Enter last name"
                  required
                />
              </FormField>
            </GridContainer>
            <FormField htmlFor="email" label="Email" required>
              <TextInput
                id="email"
                placeholder="Enter email address"
                required
                type="email"
              />
            </FormField>
            <FormField htmlFor="password" label="Password" required>
              <TextInput
                id="password"
                placeholder="Enter password"
                required
                type="password"
              />
            </FormField>
            <div>
              <Stack gap="sm">
                <Checkbox
                  checked={showCloseButton}
                  id="show-close-button"
                  label="Show Close Button"
                  onChange={onShowCloseButtonChange}
                />
                <Checkbox
                  checked={closeOnOverlayClick}
                  id="close-on-overlay"
                  label="Close on Overlay Click"
                  onChange={onCloseOnOverlayClickChange}
                />
              </Stack>
            </div>
            <FormField htmlFor="modal-title" label="Modal Title">
              <TextInput
                id="modal-title"
                onChange={onModalTitleChange}
                placeholder="Enter modal title"
                value={modalTitle}
              />
            </FormField>
            <div>
              <div className="flex justify-end gap-2 pt-4">
                <Button onClick={onClose} variant="secondary">
                  Cancel
                </Button>
                <Button onClick={onClose}>Register</Button>
              </div>
            </div>
          </Stack>
        </form>
      </Modal>
    </>
  );
};
