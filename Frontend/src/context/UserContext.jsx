import { createContext } from "react";

export const UserDataContext = createContext();

function UserContext({ children }) {

  const serverUrl = "http://localhost:8000";

  return (
    <UserDataContext.Provider value={{ serverUrl }}>
      {children}
    </UserDataContext.Provider>
  );
}

export default UserContext;