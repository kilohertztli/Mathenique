import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "../api/axios";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const validateSession = async () => {
      const token = localStorage.getItem("mathquest_token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await api.get("/me");
        setUser(res.data);
      } catch {
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();
  }, []);


  const login = async (email: string, password: string) => {
    const params = new URLSearchParams();
    params.append("username", email);
    params.append("password", password);

    const res = await api.post("/login", params);
    localStorage.setItem("mathquest_token", res.data.access_token);

    const me = await api.get("/me");
    setUser(me.data);

    return true;
  };


  const logout = () => {
    localStorage.removeItem("mathquest_token");
    setUser(null);
  };


  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      await api.post("/register", {
        name,
        email,
        password,
      });

      return true;
    } catch (err: any) {
      if (err.response?.status === 409) {
        return false;
      }
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
