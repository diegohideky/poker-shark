import { User } from "@entities/User";
import { getCurrent } from "@services/accounts";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

interface UserContextProps {
  user: User | null;
  token: string | null;
  setUserData: (user: User | null) => void;
  setTokenData: (token: string | null) => void;
  getCurrentUser: () => Promise<void>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Optionally, load the token and user data from localStorage or cookies
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const setUserData = (user: User | null) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const setTokenData = (token: string | null) => {
    setToken(token);
    localStorage.setItem("token", token);
  };

  const getCurrentUser = async () => {
    const current = await getCurrent();
    setUserData(current);
  };

  return (
    <UserContext.Provider
      value={{ user, token, setUserData, setTokenData, getCurrentUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
