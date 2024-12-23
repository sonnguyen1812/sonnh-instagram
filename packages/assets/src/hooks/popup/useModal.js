import React, {useRef, useState} from 'react';
import {Modal} from '@shopify/polaris';

export default function useModal({
  confirmAction,
  title = 'Are you sure to delete?',
  HtmlTitle = null,
  content = 'Please be careful because you cannot undo this action.',
  HtmlContent = null,
  buttonTitle = 'Confirm',
  closeTitle = 'Cancel',
  large = false,
  loading = false,
  disabled = false,
  destructive = false,
  sectioned = true,
  canCloseAfterFinished = true,
  successCallback = () => {},
  closeCallback = () => {},
  defaultCurrentInput = null,
  primaryAction = null // Thêm prop primaryAction
}) {
  const [open, setOpen] = useState(false);
  const input = useRef(null);

  const openModal = (currentInput = defaultCurrentInput) => {
    input.current = currentInput;
    setOpen(true);
  };

  const closeModal = () => {
    if (!loading) setOpen(false);
  };

  const handleClose = () => {
    closeModal();
    closeCallback();
  };

  const handleConfirm = () => {
    confirmAction(input.current).then(success => {
      if (!success) return;
      if (canCloseAfterFinished) handleClose();
      successCallback(success);
    });
  };

  // Tạo primaryAction object dựa trên props được truyền vào
  const modalPrimaryAction = primaryAction || {
    content: buttonTitle,
    loading,
    disabled,
    destructive,
    onAction: () => handleConfirm()
  };

  const modal = (
    <Modal
      sectioned={sectioned}
      open={open}
      large={large}
      onClose={() => handleClose()}
      title={HtmlTitle ? <HtmlTitle input={input} /> : title}
      primaryAction={modalPrimaryAction}
      secondaryActions={[
        {
          disabled: loading || modalPrimaryAction.loading, // Cập nhật disabled state dựa trên cả 2 loading
          content: closeTitle,
          onAction: () => handleClose()
        }
      ]}
    >
      {HtmlContent ? <HtmlContent {...{input}} /> : content}
    </Modal>
  );

  return {modal, open, closeModal, openModal};
}
