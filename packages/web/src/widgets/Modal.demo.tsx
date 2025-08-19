import type {FC} from 'react';
import {useState} from 'react';
import {PageContainer} from './PageContainer.js';
import {SectionHeader} from './SectionHeader.js';
import {Stack} from './Stack.js';
import {BasicModalDemo} from './demo-utils/BasicModalDemo.js';
import {ModalSizesDemo} from './demo-utils/ModalSizesDemo.js';
import {FormModalDemo} from './demo-utils/FormModalDemo.js';

const ModalDemo: FC = () => {
  const [isBasicOpen, setIsBasicOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('Sample Modal');
  const [showCloseButton, setShowCloseButton] = useState(true);
  const [closeOnOverlayClick, setCloseOnOverlayClick] = useState(true);

  const openBasicModal = () => {
    setIsBasicOpen(true);
  };
  const closeBasicModal = () => {
    setIsBasicOpen(false);
  };
  const openFormModal = () => {
    setIsFormOpen(true);
  };
  const closeFormModal = () => {
    setIsFormOpen(false);
  };
  return (
    <PageContainer variant="default">
      <SectionHeader title="Modal Component" />
      <Stack>
        <SectionHeader title="Basic Modal" variant="compact" />
        <BasicModalDemo
          closeOnOverlayClick={closeOnOverlayClick}
          isOpen={isBasicOpen}
          modalTitle={modalTitle}
          onClose={closeBasicModal}
          onOpen={openBasicModal}
          showCloseButton={showCloseButton}
        />
      </Stack>
      <Stack>
        <SectionHeader title="Different Sizes" variant="compact" />
        <ModalSizesDemo onOpenModal={openBasicModal} />
      </Stack>
      <Stack>
        <SectionHeader title="Form Modal" variant="compact" />
        <FormModalDemo
          closeOnOverlayClick={closeOnOverlayClick}
          isOpen={isFormOpen}
          modalTitle={modalTitle}
          onClose={closeFormModal}
          onCloseOnOverlayClickChange={setCloseOnOverlayClick}
          onModalTitleChange={setModalTitle}
          onOpen={openFormModal}
          onShowCloseButtonChange={setShowCloseButton}
          showCloseButton={showCloseButton}
        />
      </Stack>
    </PageContainer>
  );
};
export default ModalDemo;
