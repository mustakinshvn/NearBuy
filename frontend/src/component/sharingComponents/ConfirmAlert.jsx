import { useEffect } from "react";

export const ConfirmAlert = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <>
      <div
        className="fixed inset-0 bg-opacity-50 backdrop-blur-xs z-40"
        onClick={onClose}
      ></div>
      <div className="fixed inset-0 flex items-center justify-center z-50 rounded-lg">
        <div className="bg-yellow-50 p-6 rounded shadow-lg w-96">
          <h2 className="text-xl font-bold mb-4">{title}</h2>
          <p className="mb-6">{message}</p>
          <div className="flex justify-evenly gap-4">
            <button
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
