// context/AuthContext.tsx
"use client"; // Ensure this runs only on client

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextProps {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user on mount from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
     
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsLoggedIn(true);
        console.log("[AuthContext] Loaded user from localStorage:", parsedUser);
      } catch (error) {
        console.error("[AuthContext] Failed to parse storedUser:", error);
      }
    } else {
      console.log("[AuthContext] No user found in localStorage.");
    }

    setLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem("user", JSON.stringify(userData));
    console.log("[AuthContext] User logged in:", userData);
  };

  const logout = () => {
    console.log("[AuthContext] logout called ✅"); 
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("user");
    console.log("[AuthContext] User logged out");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
