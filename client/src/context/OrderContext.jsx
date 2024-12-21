import { createContext, useState, useEffect } from "react";
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from "../utils/localStorage";

export const OrderContext = createContext();

export function OrderContextProvider({ children }) {
  const [orderDetails, setOrderDetails] = useState(() => {
    return (
      getLocalStorageItem("order") || {
        eventId: null,
        eventTitle: "",
        eventDate: "",
        eventAddress: "",
        price: 0,
        quantity: 0,
      }
    );
  });

  const updateOrderDetails = (updatedFields) => {
    if (!updatedFields) {
      setOrderDetails(null);
      return;
    }

    setOrderDetails((prevOrder) => ({
      ...prevOrder,
      ...updatedFields,
    }));
  };

  useEffect(() => {
    if (orderDetails) {
      setLocalStorageItem("order", orderDetails);
    } else {
      removeLocalStorageItem("order");
    }
  }, [orderDetails]);

  return (
    <OrderContext.Provider value={{ orderDetails, updateOrderDetails }}>
      {children}
    </OrderContext.Provider>
  );
}
