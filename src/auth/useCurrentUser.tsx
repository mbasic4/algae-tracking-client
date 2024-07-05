import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, setToken } from "./tokenManager";
import { apiClient } from "../apiClient";
import { Location } from "../utils/swapLocationCoordinates";

type User = {
  firstName: string;
  lastName: string;
  email: string;
  citizenScientist?: {
    id: number;
    address: string;
    location: Location
  }
}

type Value = {
  token: string | null;
  currentUser?: User;
  login: (token: string) => void;
  logout: () => void;
}

const CurrentUserContext = createContext({} as Value);

export const CurrentUserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User>()
  const navigate = useNavigate();
  const token = getToken();

  useEffect(() => {
    fetchCurrentUser()
  }, [token])

  const fetchCurrentUser = async() => {
    try {
      const res = await apiClient.get("/me")
      setCurrentUser(res.data)
    } catch(err) {
      // we don't care about this error
    }
  }

  // call this function when you want to authenticate the user
  const login = (token: string) => {
    setToken(token);
    navigate("/account");
  };

  // call this function to sign out logged in user
  const logout = () => {
    setToken(null);
    navigate("/", { replace: true });
  };

  const value = useMemo(
    () => ({
      token,
      currentUser,
      login,
      logout,
    }),
    [token, currentUser]
  );

  return <CurrentUserContext.Provider value={value}>{children}</CurrentUserContext.Provider>;
};

export const useCurrentUser = () => {
  return useContext(CurrentUserContext);
};
