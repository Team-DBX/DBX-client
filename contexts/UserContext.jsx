import { useState, createContext, useMemo, useCallback } from "react";

const UserContext = createContext();

// eslint-disable-next-line react/prop-types
export function UserContextProvider({ children }) {
  const [userToken, setUserToken] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const setUserCredentials = useCallback((token, email) => {
    setUserToken(token);
    setUserEmail(email);
  }, []);

  const setCurCategoryId = useCallback(id => {
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
