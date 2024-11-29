import {View, StyleSheet, StatusBar, LogBox, Modal} from 'react-native'
import {Provider} from 'react-redux'
import store from './src/Redux/store';
import Navigation from './src/navigation/navigation';
import HostingNavigation from './src/navigation/hosting_navigation';
import { useState, useEffect } from 'react';
import AuthNavigation from './src/navigation/Auth_navigation';
import '@azure/core-asynciterator-polyfill';
import { Amplify } from 'aws-amplify';
import amplifyconfig from './src/amplifyconfiguration.json'
Amplify.configure(amplifyconfig);
import AuthContextProvider from './src/Context/hostContext'
import AuthUserContextProvider from './src/Context/userContext';
import { DataStore } from 'aws-amplify/datastore';
import { UserAuth, AppStatus } from './src/models';
import { getCurrentUser } from 'aws-amplify/auth'
import {MaterialIcons} from '@expo/vector-icons'


const App = ()=>{
  const [userSignInStatus, setUserSignInStatus] = useState(false)
  const [userAuth, setUserAuth] = useState(null)
  const [Leasing, setLeasing] = useState(null)
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(true)

 
  LogBox.ignoreAllLogs(); // Ignores all log notifications

  
  useEffect(()=>{
      (async()=>{
      try{
          const { userId } = await getCurrentUser();
          console.log('the authenticated  user', userId) 
           setUserAuth(userId)
        
      }catch(e){
          console.log('Error getting current authenticated user : ', e.message )
          setIsUserAuthenticated(false)
      }
      })()
  }, [])

  const CheckSignInStatus = async ()=>{
    try{
      const signedIn = await DataStore.query(UserAuth, (u)=> u.sub.eq(userAuth))
      console.log('userAuth Obj : ', signedIn)
      const signInStatus = signedIn[0].signInStatus
      const appScreen = signedIn[0].userAppType
      console.log('signedIn : ', signInStatus, 'signInStatus : ', signInStatus)
      setUserSignInStatus(signInStatus)
      setLeasing(appScreen)
    }catch(e){
        console.log('Error checking sign in status: ', e)
    }
      
  }

      useEffect(()=>{
      if(!userAuth){
          return
      }
      CheckSignInStatus()
      }, [userAuth])
     
      if(!userSignInStatus && isUserAuthenticated){
        return(
          <Modal visible={true} onRequestClose={()=>{}} presentationStyle={'overFullScreen'}>
                  <View style={styles.modalContainer}>
                      <View style={styles.leotIcon}>
                      <MaterialIcons name="real-estate-agent" size={100} color="white" />
                      </View> 
                  </View>
          </Modal>
        )
      }
  return (
    <View style={{flex : 1, paddingTop: userSignInStatus == 'true'? StatusBar.currentHeight : null}}>
         {
          userSignInStatus == 'true'?  <>
            {Leasing == AppStatus.USER?
                       <Provider store={store}>
                            <AuthUserContextProvider>
                              <AuthContextProvider>
                                <Navigation setLeasing={setLeasing} setUserSignInStatus={setUserSignInStatus}/> 
                              </AuthContextProvider>
                              </AuthUserContextProvider>
                       </Provider>
                         
                           : 
                           <Provider store={store}>
                           <AuthUserContextProvider> 
                            <AuthContextProvider>
                              <HostingNavigation setLeasing={setLeasing} setUserSignInStatus={setUserSignInStatus}/>
                             </AuthContextProvider>
                             </AuthUserContextProvider>
                             </Provider>
            }
                </> : 
                        <AuthNavigation setLeasing={setLeasing} setUserSignInStatus={setUserSignInStatus}/>
         }
        
   </View>
       
  );
}

export default App

const styles = StyleSheet.create({
  modalContainer : {
    flex: 1, 
    backgroundColor:'white', 
    justifyContent:'center', 
    alignItems:'center'
  },
  leotIcon: {
    backgroundColor:'#8B0000', 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 20
  }
})