import type {FC} from 'react';
import {useState} from 'react';
import {Modal} from './Modal.js';
import {Button} from './Button.js';
import {TextInput} from './TextInput.js';
import {PageContainer} from './PageContainer.js';
import {SectionHeader} from './SectionHeader.js';
import {Card} from './Card.js';
import {Stack} from './Stack.js';
import {GridContainer} from './GridContainer.js';
import {FormField} from './FormField.js';
import {Checkbox} from './Checkbox.js';

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
    <PageContainer variant="default">
      <SectionHeader title="Modal Component" />

      <Stack>
        <SectionHeader title="Basic Modal" variant="compact" />

        <Button
          onClick={() => {
            openModal();
          }}
        >
          Open Basic Modal
        </Button>

        <Modal
          closeOnOverlayClick={closeOnOverlayClick}
          isOpen={isOpen}
          onClose={closeModal}
          showCloseButton={showCloseButton}
          size={modalSize}
          title={modalTitle}
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              This is a basic modal with customizable content. You can put any
              React components inside.
            </p>

            <div className="flex justify-end space-x-2">
              <Button onClick={closeModal} variant="secondary">
                Cancel
              </Button>

              <Button onClick={closeModal}>Confirm</Button>
            </div>
          </div>
        </Modal>
      </Stack>

      <Stack>
        <SectionHeader title="Different Sizes" variant="compact" />

        <GridContainer cols={4}>
          <Button
            onClick={() => {
              openModal('sm');
            }}
            variant="secondary"
          >
            Small Modal
          </Button>

          <Button
            onClick={() => {
              openModal('md');
            }}
            variant="secondary"
          >
            Medium Modal
          </Button>

          <Button
            onClick={() => {
              openModal('lg');
            }}
            variant="secondary"
          >
            Large Modal
          </Button>

          <Button
            onClick={() => {
              openModal('xl');
            }}
            variant="secondary"
          >
            Extra Large Modal
          </Button>
        </GridContainer>
      </Stack>

      <Stack>
        <SectionHeader title="Form Modal" variant="compact" />

        <Button
          onClick={() => {
            openModal('lg');
          }}
          variant="primary"
        >
          Open Form Modal
        </Button>

        <Modal
          isOpen={isOpen ? modalSize === 'lg' : false}
          onClose={closeModal}
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
                    onChange={value => {
                      setShowCloseButton(value);
                    }}
                  />
                  <Checkbox
                    checked={closeOnOverlayClick}
                    id="close-on-overlay"
                    label="Close on Overlay Click"
                    onChange={value => {
                      setCloseOnOverlayClick(value);
                    }}
                  />
                </Stack>
              </div>
              <FormField htmlFor="modal-title" label="Modal Title">
                <TextInput
                  id="modal-title"
                  onChange={value => {
                    setModalTitle(value);
                  }}
                  placeholder="Enter modal title"
                  value={modalTitle}
                />
              </FormField>
              <div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button onClick={closeModal} variant="secondary">
                    Cancel
                  </Button>
                  <Button onClick={closeModal}>Register</Button>
                </div>
              </div>
            </Stack>
          </form>
        </Modal>
      </Stack>

      <Stack>
        <SectionHeader title="Modal Configuration" variant="compact" />
        <Card>
          <Stack>
            <Stack>
              <Checkbox
                checked={showCloseButton}
                id="cfg-show-close-button"
                label="Show Close Button"
                onChange={value => {
                  setShowCloseButton(value);
                }}
              />
              <Checkbox
                checked={closeOnOverlayClick}
                id="cfg-close-on-overlay"
                label="Close on Overlay Click"
                onChange={value => {
                  setCloseOnOverlayClick(value);
                }}
              />
            </Stack>
            <FormField htmlFor="cfg-modal-title" label="Modal Title">
              <TextInput
                id="cfg-modal-title"
                onChange={value => {
                  setModalTitle(value);
                }}
                placeholder="Enter modal title"
                value={modalTitle}
              />
            </FormField>
          </Stack>
        </Card>
      </Stack>

      <Stack>
        <SectionHeader title="Alert Modal" variant="compact" />

        <Button
          onClick={() => {
            openModal('sm');
          }}
          variant="danger"
        >
          Show Alert
        </Button>

        <Modal
          isOpen={isOpen ? modalSize === 'sm' : false}
          onClose={closeModal}
          size="sm"
          title="Confirmation Required"
        >
          <div className="space-y-4 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-100">
              <svg
                className="size-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>

            <p className="text-sm text-gray-500">
              Are you sure you want to delete this item? This action cannot be
              undone.
            </p>

            <div className="flex justify-center space-x-2">
              <Button onClick={closeModal} variant="secondary">
                Cancel
              </Button>

              <Button onClick={closeModal} variant="danger">
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      </Stack>

      <Stack>
        <SectionHeader title="Custom Styling" variant="compact" />

        <Button
          onClick={() => {
            openModal('md');
          }}
          variant="primary"
        >
          Custom Styled Modal
        </Button>

        <Modal
          isOpen={isOpen ? modalSize === 'md' : false}
          onClose={closeModal}
          outlineColor="blue"
          outlined
          size="md"
          title="Custom Styled Modal"
        >
          <div className="space-y-4 text-center">
            <p className="font-medium text-blue-600">
              This modal has custom styling applied!
            </p>

            <Button onClick={closeModal}>Close</Button>
          </div>
        </Modal>
      </Stack>
    </PageContainer>
  );
};

export default ModalDemo;
