import { toast } from "sonner";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { USER_DEFAULT, PASSWORD_DEFAULT } from "../constants";

interface AuthContextType {
  user: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (credentials: {
    email: string;
    password: string;
  }) => Promise<boolean>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: false,
  signIn: async () => false,
  signOut: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const signIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    if (email !== USER_DEFAULT || password !== PASSWORD_DEFAULT) {
      toast.error("Usuário ou senha inválidos!", {
        position: "top-center",
        description: "Verifique suas credenciais e tente novamente.",
      });
      return false;
    }

    const session = { email };
    localStorage.setItem("__session", JSON.stringify(session));
    setUser(email);
    setIsAuthenticated(true);
    navigate("/dashboard");
    return true;
  };

  const signOut = () => {
    localStorage.removeItem("__session");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/");
  };

  useEffect(() => {
    const storedSession = localStorage.getItem("__session");
    if (storedSession) {
      const parsed = JSON.parse(storedSession);
      setUser(parsed.email);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
