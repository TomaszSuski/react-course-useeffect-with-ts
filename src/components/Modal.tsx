import React, { useEffect } from "react";
import { useRef } from "react";
import { createPortal } from "react-dom";

export interface ModalProps {
  open: boolean;
  children: React.ReactNode;
}

function Modal({ open, children }: ModalProps) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) {
      dialog.current?.showModal();
    } else {
      dialog.current?.close();
    }
  }, [open]);

  return createPortal(
    <dialog className="modal" ref={dialog}>
      {children}
    </dialog>,
    document.getElementById("modal")!
  );
}

export default Modal;
