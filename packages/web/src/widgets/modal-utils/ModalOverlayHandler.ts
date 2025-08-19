export const isOverlayKey = (key: string): boolean =>
  key === 'Enter' || key === ' ';

export const shouldCloseOnOverlayClick = (
  closeOnOverlayClick: boolean,
  isSelfTarget: boolean,
): boolean => closeOnOverlayClick && isSelfTarget;

export const createOverlayClickHandler = (
  closeOnOverlayClick: boolean,
  onClose: () => void,
) => {
  return (event: React.MouseEvent | React.KeyboardEvent) => {
    if (
      shouldCloseOnOverlayClick(
        closeOnOverlayClick,
        event.target === event.currentTarget,
      )
    ) {
      onClose();
    }
  };
};

export const createOverlayKeyHandler = (
  closeOnOverlayClick: boolean,
  onClose: () => void,
) => {
  return (event: React.KeyboardEvent) => {
    if (isOverlayKey(event.key)) {
      createOverlayClickHandler(closeOnOverlayClick, onClose)(event);
    }
  };
};
