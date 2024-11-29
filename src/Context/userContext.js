import { createContext, useState, useEffect, useContext} from 'react';
import { getCurrentUser } from 'aws-amplify/auth';

const AuthUserContext = createContext({});

const AuthUserContextProvider = ({ children }) => {
  const [userAuth, setUserAuth] = useState(null);
  
 
  // Fetch authenticated user data
  useEffect(() => {
    (async () => {
      try {
        const { userId } = await getCurrentUser();
        setUserAuth(userId);
      } catch (e) {
        console.log('Error getting current authenticated user:', e.message);
      }
    })();
  }, []);

  return (
    <AuthUserContext.Provider value={{userAuth}}>
      {children}
    </AuthUserContext.Provider>
  );
};

export default AuthUserContextProvider;

export const useUserAuthContext = () => useContext(AuthUserContext);
