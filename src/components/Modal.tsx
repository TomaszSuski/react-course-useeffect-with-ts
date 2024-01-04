import React from 'react';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { createPortal } from 'react-dom';

export interface ModalProps {
  children: React.ReactNode;
}

const Modal = forwardRef(function Modal({ children }: ModalProps, ref) {
  const dialog = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => {
    return {
      open: () => {
        dialog.current!.showModal();
      },
      close: () => {
        dialog.current!.close();
      },
    };
  });

  return createPortal(
    <dialog className="modal" ref={dialog}>
      {children}
    </dialog>,
    document.getElementById('modal')!
  );
});

export default Modal;
