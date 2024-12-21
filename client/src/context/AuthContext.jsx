import { createContext, useEffect, useState } from "react";
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from "../utils/localStorage";

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(() => {
    return getLocalStorageItem("user");
  });

  const handleLogin = (authenticatedUser) => {
    setUser(authenticatedUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const updateUser = ({ email, firstName, lastName }) => {
    setUser((prevUser) => {
      return {
        ...prevUser,
        firstName,
        email,
        lastName,
      };
    });
  };

  useEffect(() => {
    if (user) {
      setLocalStorageItem("user", user);
    } else {
      removeLocalStorageItem("user");
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ user, handleLogin, handleLogout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
