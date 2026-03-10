import { createContext } from "react";

export const userDataContext = createContext();

function UserContext({ children }) {
  const serverUrl = "http://localhost:8000";
  const [userData, setUserData] = useState(null);

  const handleCurrentUser = async() =>{
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true})
      setUserData(result.data)
      console.log(result.data)
    } catch (error) {
      console.error("Error fetching current user data:", error);
    }
  }

  useEffect(() => {
    handleCurrentUser()
  },[]);

  const value = { serverUrl, userData, setUserData };
  return (
    <userDataContext.Provider value={{ serverUrl, userData, setUserData }}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;