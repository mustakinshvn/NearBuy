import { useState, useRef, useEffect } from "react";
import { notificationAPI, orderAPI } from "../../services/api";
import { useTransition } from "react";
import { cn } from "../../lib/utils";
import { ConfirmAlert } from "../sharingComponents/ConfirmAlert";
const paymentStatusOptions = ["Pending", "Paid", "Refunded"];

export const PaymentStatusDropDown = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, startTransition] = useTransition(false);
  const [selectedStatus, setSelectedStatus] = useState(props.payment_status);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);

  const handleChange = (newStatus) => {
    startTransition(() => {
      orderAPI.updatePaymentStatus(props.order_id, newStatus);
      notificationAPI.createNotification({
        type: "Payment Status Update",
        title: "Payment Status Updated",
        message: `Payment status for order ${props.order_id} updated to ${newStatus}`,
        priority: "Medium",
        order_id: props.order_id,
        vendor_id: props.vendor_id,
        customer_id: props.customer_id,
      });
      setIsOpen(false);
      setSelectedStatus(newStatus);
    });
  };

  const handleConfirm = () => {
    if (pendingStatus) {
      handleChange(pendingStatus);
      setConfirmOpen(false);
      setPendingStatus(null);
    }
  };

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className={cn(
          "inline-block px-3 py-1 rounded-full text-sm font-medium cursor-pointer",
          selectedStatus === "Pending"
            ? "bg-yellow-100 text-yellow-800"
            : selectedStatus === "Paid"
              ? "bg-blue-100 text-blue-800"
              : "bg-green-100 text-green-800",
        )}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {loading ? "Updating..." : selectedStatus}
      </button>
      {isOpen ? (
        <div className="absolute bg-white border border-gray-400 transition-colors  font-semibold shadow-md mt-1 p-3 flex flex-col gap-2 rounded-2xl z-10 top-0">
          {paymentStatusOptions.map((option) => (
            <button
              key={option}
              onClick={() => {
                setPendingStatus(option);
                setConfirmOpen(true);
                setIsOpen(false);
              }}
              className={cn(
                "hover:text-gray-500 rounded-md px-2 py-1 cursor-pointer",
                option === selectedStatus
                  ? "text-gray-400 cursor-not-allowed hover:bg-transparent"
                  : "text-gray-700",
                option === "Paid"
                  ? "hover:bg-blue-100"
                  : option === "Refunded"
                    ? "hover:bg-green-100"
                    : "hover:bg-yellow-100",
              )}
              disabled={option === selectedStatus}
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}
      {confirmOpen && (
        <ConfirmAlert
          isOpen={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleConfirm}
          title="Confirm Payment Status Change"
          message={`Are you sure you want to change the payment status to ${pendingStatus}?`}
        />
      )}
    </div>
  );
};
