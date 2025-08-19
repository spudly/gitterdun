import type {FC} from 'react';
import {Modal} from '../Modal.js';
import {Button} from '../Button.js';

type BasicModalDemoProps = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onOpen: () => void;
  readonly closeOnOverlayClick: boolean;
  readonly showCloseButton: boolean;
  readonly modalTitle: string;
};

export const BasicModalDemo: FC<BasicModalDemoProps> = ({
  isOpen,
  onClose,
  onOpen,
  closeOnOverlayClick,
  showCloseButton,
  modalTitle,
}) => {
  return (
    <>
      <Button onClick={onOpen}>Open Basic Modal</Button>
      <Modal
        closeOnOverlayClick={closeOnOverlayClick}
        isOpen={isOpen}
        onClose={onClose}
        showCloseButton={showCloseButton}
        title={modalTitle}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            This is a basic modal with customizable settings. You can configure
            the title, close button visibility, and overlay click behavior.
          </p>
          <div className="flex justify-end">
            <Button onClick={onClose}>Confirm</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
