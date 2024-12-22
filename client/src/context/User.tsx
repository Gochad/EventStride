import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserContextType {
  userRole: string | null;
  setUserRole: (role: string | null) => void;
}

const User = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userRole, setUserRoleState] = useState<string | null>(null);

  const updateRole = () => {
    const role = localStorage.getItem("user_role");
    setUserRoleState(role);
  };

  const setUserRole = (role: string | null) => {
    if (role) {
      localStorage.setItem("user_role", role);
    } else {
      localStorage.removeItem("user_role");
    }
    const event = new Event("localStorageUpdate");
    window.dispatchEvent(event);
    setUserRoleState(role);
  };

  useEffect(() => {
    updateRole();

    window.addEventListener("localStorageUpdate", updateRole);

    return () => {
      window.removeEventListener("localStorageUpdate", updateRole);
    };
  }, []);

  return (
    <User.Provider value={{ userRole, setUserRole }}>
      {children}
    </User.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(User);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
