import ExclamationIcon from "../images/ExclamationIcon";

export default function Alert({ message, color, isBordered }) {

  const textColor = color ? color : "danger"

  return (
    <div className={`flex justify-center w-fit m-auto mt-1 mb-4 p-1 space-x-1 text-${textColor}` + (isBordered ? ` border border-${textColor}` : " ")}>
      <ExclamationIcon />
      <p className=" text-mobile-1 sm:text-sm-screen-1">{message}</p>
    </div>
  );
}
