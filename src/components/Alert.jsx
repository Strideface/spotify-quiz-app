import ExclamationIcon from "../images/ExclamationIcon";

export default function Alert({ message, color }) {

  const textColor = color ? color : "danger"

  return (
    <div className={`flex justify-center w-fit m-auto mb-4 p-1 space-x-1 text-${textColor}`}>
      <ExclamationIcon />
      <p className=" text-mobile-1 sm:text-sm-screen-1">{message}</p>
    </div>
  );
}
