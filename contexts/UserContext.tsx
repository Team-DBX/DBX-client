import {
  useState,
  createContext,
  useMemo,
  useCallback,
  ReactNode,
} from "react";

interface UserContextType {
  userToken: string | null;
  userEmail: string | null;
  categoryId: string | null;
  setUserCredentials: (token: string, email: string) => void;
  setCurCategoryId: (id: string) => void;
}

const UserContext = createContext<UserContextType>({
  userToken: null,
  userEmail: null,
  categoryId: null,
  setUserCredentials: () => {},
  setCurCategoryId: () => {},
});

interface UserContextProviderProps {
  children: ReactNode;
}

export function UserContextProvider({ children }: UserContextProviderProps) {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const setUserCredentials = useCallback((token: string, email: string) => {
    setUserToken(token);
    setUserEmail(email);
  }, []);

  const setCurCategoryId = useCallback((id: string) => {
    setCategoryId(id);
  }, []);

  const value = useMemo(
    () => ({
      userToken,
      userEmail,
      categoryId,
      setUserCredentials,
      setCurCategoryId,
    }),
    [userToken, userEmail, categoryId, setUserCredentials, setCurCategoryId]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default UserContext;
