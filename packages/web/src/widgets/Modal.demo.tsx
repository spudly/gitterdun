/* eslint-disable jsx-a11y/label-has-associated-control */
import {FC, useState} from 'react';
import {Modal} from './Modal.js';
import {Button} from './Button.js';
import {TextInput} from './TextInput.js';

const ModalDemo: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalSize, setModalSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [modalTitle, setModalTitle] = useState('Sample Modal');
  const [showCloseButton, setShowCloseButton] = useState(true);
  const [closeOnOverlayClick, setCloseOnOverlayClick] = useState(true);

  const openModal = (size: 'sm' | 'md' | 'lg' | 'xl' = 'md') => {
    setModalSize(size);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold">Modal Component</h2>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Modal</h3>
        <Button onClick={() => openModal()}>Open Basic Modal</Button>

        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          title={modalTitle}
          size={modalSize}
          showCloseButton={showCloseButton}
          closeOnOverlayClick={closeOnOverlayClick}
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              This is a basic modal with customizable content. You can put any
              React components inside.
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button onClick={closeModal}>Confirm</Button>
            </div>
          </div>
        </Modal>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Different Sizes</h3>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => openModal('sm')} variant="secondary">
            Small Modal
          </Button>
          <Button onClick={() => openModal('md')} variant="secondary">
            Medium Modal
          </Button>
          <Button onClick={() => openModal('lg')} variant="secondary">
            Large Modal
          </Button>
          <Button onClick={() => openModal('xl')} variant="secondary">
            Extra Large Modal
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Form Modal</h3>
        <Button onClick={() => openModal('lg')} variant="primary">
          Open Form Modal
        </Button>

        <Modal
          isOpen={isOpen && modalSize === 'lg'}
          onClose={closeModal}
          title="User Registration Form"
          size="lg"
        >
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <label htmlFor="first-name" className="sr-only">
                First Name
              </label>
              <TextInput
                id="first-name"
                placeholder="Enter first name"
                required
              />
              <label htmlFor="last-name" className="sr-only">
                Last Name
              </label>
              <TextInput
                id="last-name"
                placeholder="Enter last name"
                required
              />
            </div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <TextInput
              id="email"
              type="email"
              placeholder="Enter email address"
              required
            />
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <TextInput
              id="password"
              type="password"
              placeholder="Enter password"
              required
            />
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button onClick={closeModal}>Register</Button>
            </div>
          </form>
        </Modal>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Modal Configuration</h3>
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="flex items-center space-x-4">
            <label htmlFor="show-close-button" className="flex items-center">
              <input
                type="checkbox"
                checked={showCloseButton}
                onChange={e => setShowCloseButton(e.target.checked)}
                className="mr-2"
                id="show-close-button"
              />
              Show Close Button
            </label>
            <label htmlFor="close-on-overlay" className="flex items-center">
              <input
                type="checkbox"
                checked={closeOnOverlayClick}
                onChange={e => setCloseOnOverlayClick(e.target.checked)}
                className="mr-2"
                id="close-on-overlay"
              />
              Close on Overlay Click
            </label>
          </div>

          <div>
            <label
              htmlFor="modal-title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Modal Title
            </label>
            <input
              type="text"
              id="modal-title"
              value={modalTitle}
              onChange={e => setModalTitle(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Enter modal title"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Alert Modal</h3>
        <Button onClick={() => openModal('sm')} variant="danger">
          Show Alert
        </Button>

        <Modal
          isOpen={isOpen && modalSize === 'sm'}
          onClose={closeModal}
          title="Confirmation Required"
          size="sm"
        >
          <div className="text-center space-y-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this item? This action cannot be
              undone.
            </p>
            <div className="flex justify-center space-x-2">
              <Button variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button variant="danger" onClick={closeModal}>
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Custom Styling</h3>
        <Button onClick={() => openModal('md')} variant="primary">
          Custom Styled Modal
        </Button>

        <Modal
          isOpen={isOpen && modalSize === 'md'}
          onClose={closeModal}
          title="Custom Styled Modal"
          size="md"
          className="border-4 border-blue-500"
        >
          <div className="text-center space-y-4">
            <p className="text-blue-600 font-medium">
              This modal has custom styling applied!
            </p>
            <Button onClick={closeModal}>Close</Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ModalDemo;
