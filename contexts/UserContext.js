import React from "react";

const UserContext = React.createContext({
  userData: null,
  userEmail: null,
  isAdmin: false,
  categoriesId: [],
  handleGoogleLogin: () => {},
});

export default UserContext;
