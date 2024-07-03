import { forwardRef, useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";

// A configurable dialog element that should be adjustable for any modal required to be shown in the app

const Modal = forwardRef(function Modal(
  { title, message, children, onClose },
  ref
) {
  const dialog = useRef();
  // means calling any method on this origin dialog (methods in this function), from an inheriting component, works as the commands are bound through ref
  useImperativeHandle(ref, () => {
    return {
      open() {
        dialog.current.showModal();
      },
      close() {
        dialog.current.close()
      },
      // custom method to check if a modal is currently open
      isOpen() {
        return dialog.current.open
      }
    };
  });
  // onClose prop is only neccessarry when you need a function to trigger (in an inheriting component) upon a dialog being
  // closed via the escape key (onClose attribute) e.g. trigger the same function as onSubmit if user escapes.

  // portal inserts the dialog at the point in the DOM corresponding to its id, in this case
  // a div element with 'modal' as id, at the highest point in the DON (see index.html)
  return createPortal(
    <dialog ref={dialog} onClose={onClose} className=" border">
      <div className=" flex-col justify-center space-x-2">
        <h1>{title}</h1>
        <p>{message}</p>
      </div>
      {children}
    </dialog>,
    document.getElementById("modal")
  );
});

export default Modal;
