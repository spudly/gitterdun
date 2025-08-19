import type {FC} from 'react';
import {Button} from '../Button.js';
import {GridContainer} from '../GridContainer.js';

type ModalSizesDemoProps = {
  readonly onOpenModal: (size: 'sm' | 'md' | 'lg' | 'xl') => void;
};

export const ModalSizesDemo: FC<ModalSizesDemoProps> = ({onOpenModal}) => {
  return (
    <GridContainer cols={4}>
      <Button
        onClick={() => {
          onOpenModal('sm');
        }}
        variant="secondary"
      >
        Small Modal
      </Button>
      <Button
        onClick={() => {
          onOpenModal('md');
        }}
        variant="secondary"
      >
        Medium Modal
      </Button>
      <Button
        onClick={() => {
          onOpenModal('lg');
        }}
        variant="secondary"
      >
        Large Modal
      </Button>
      <Button
        onClick={() => {
          onOpenModal('xl');
        }}
        variant="secondary"
      >
        Extra Large Modal
      </Button>
    </GridContainer>
  );
};
