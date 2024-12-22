import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserContextType {
  userRole: string | null;
  userId: string | null;
  setUserRole: (role: string | null) => void;
  setUserId: (id: string | null) => void;
  isAdmin: () => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<string | null>(localStorage.getItem("user_role"));
  const [userId, setUserId] = useState<string | null>(localStorage.getItem("user_id"));

  useEffect(() => {
    const handleStorageUpdate = () => {
      setUserRole(localStorage.getItem("user_role"));
      setUserId(localStorage.getItem("user_id"));
    };

    window.addEventListener("storage", handleStorageUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, []);

  const updateLocalStorage = (key: string, value: string | null) => {
    if (value) {
      localStorage.setItem(key, value);
    } else {
      localStorage.removeItem(key);
    }
  };

  const isAdmin = () => userRole === "admin";

  return (
    <UserContext.Provider
      value={{
        userRole,
        userId,
        setUserRole: (role) => {
          updateLocalStorage("user_role", role);
          setUserRole(role);
        },
        setUserId: (id) => {
          updateLocalStorage("user_id", id);
          setUserId(id);
        },
        isAdmin,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
