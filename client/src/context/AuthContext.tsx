import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { UserDto } from "@/types/auth.ts";

interface AuthContextType {
  user: UserDto | null;
  setUser: React.Dispatch<React.SetStateAction<UserDto | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let updateUserState: ((user: UserDto | null) => void) | null = null;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserDto | null>(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error parsing user from localStorage", error);
      return null;
    }
  });

  useEffect(() => {
    updateUserState = setUser;
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", user.token);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const updateUserStatus = (user: UserDto | null) => {
  console.log("updateUserStatus received user:", user);

  if (updateUserState) {
    updateUserState(user);
  } else {
    console.error(
      "AuthProvider is not initialized yet, updateUserStatus cannot update state."
    );
  }

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", user.token);
  } else {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used in AuthProvider.");
  }
  return context;
};
