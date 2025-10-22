import { useNavigate } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";

import { IUser } from "@/lib/types";
import { getCurrentUserId, getMe } from "@/lib/api/user";

// Initial states
export const INITIAL_USER = {
  _id: "",
  username: "",
  name: "",
  email: "",
  authentication: {
    password: "",
    salt: "",
    sessionToken: "",
  },
  bio: "",
  profilePicture: "",
  location: "",
  createdAt: "",
  recipes: [],
  following: [],
  followers: [],
  badges: [],
  purchasedCompendiums: [],
  posts: [],
  role: "user" as "user" | "admin", // Specify the type explicitly
  permissions: [],
  savedRecipes: [],
};


const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => { },
  setIsAuthenticated: () => { },
  checkAuthUser: async () => false as boolean,
  logoutUser: () => { }
};

type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
  logoutUser: () => void;
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
      const currentUserId = await getMe();
      if (currentUserId) {
        setUser({
          ...currentUserId,
        });
        setIsAuthenticated(true);

        return true;
      } else {
        navigate("/sign-in")
      }

      return false;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logoutUser = () => {
    setIsLoading(true);
    localStorage.removeItem("userId");
    localStorage.removeItem("expirationTime");
    setUser(INITIAL_USER);
    setIsAuthenticated(false);
    setIsLoading(false);
    navigate("/sign-in");
  }

  useEffect(() => {
    const cookieFallback = localStorage.getItem("userId");

    if (
      cookieFallback === "[]" ||
      cookieFallback === null ||
      cookieFallback === undefined
    ) {
      navigate("/sign-in");
    }

    checkAuthUser();
  }, []);

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
    logoutUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);
