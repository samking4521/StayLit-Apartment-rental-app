import { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
const AuthContext = createContext({});

const AuthContextProvider = ({ children }) => {
  const [hostAuth, setHostAuth] = useState(null);
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { userId } = await getCurrentUser();
        setHostAuth(userId);
      } catch (err) {
        console.log('Error getting current user:', err.message);
      }
    };

    fetchCurrentUser();
  }, []);
  return (
    <AuthContext.Provider value={{
      hostAuth, loading, setLoading
       }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

export const useAuthContext = () => useContext(AuthContext);
