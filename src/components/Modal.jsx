import { forwardRef, useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";

// A configurable dialog element that should be adjustable for any modal required to be shown in the app

const Modal = forwardRef(function Modal(
  { title, message, children, onSubmit, onClose },
  ref
) {
  const dialog = useRef();
  // means calling any method on this origin dialog (methods in this function), from an inheriting component, works as the commands are bound through ref
  useImperativeHandle(ref, () => {
    return {
      open() {
        dialog.current.showModal();
      },
    };
  });
  // onClose prop is only neccessarry when you need a function to trigger (in an inheriting component) upon a dialog being
  // closed via the escape key (onClose attribute), and/or when user clicks cancel (handleCancel).
  // E.g. trigger the same function as onSubmit if user presses cancel and/or escapes.
  const handleCancel = () => {
    // closing the dialog upon cancel button is standard
    dialog.current.close();
    // also call any onClose function if this prop is passed in
    if (onClose) {
      onClose();
    }
  };
  // portal inserts the dialog at the point in the DOM corresponding to its id, in this case
  // a div element with 'modal' as id, at the highest point in the DON (see index.html)
  return createPortal(
    <dialog ref={dialog} onClose={onClose} className=" border">
      <div>
        <h1>{title}</h1>
        <p>{message}</p>
      </div>
      <div>{children}</div>
      <form method="dialog" onSubmit={onSubmit}>
        <button type="reset" onClick={handleCancel}>
          Cancel
        </button>
        <button type="submit">Confirm</button>
      </form>
    </dialog>,
    document.getElementById("modal")
  );
});

export default Modal;
