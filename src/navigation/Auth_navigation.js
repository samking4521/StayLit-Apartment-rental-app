import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from '../screens/AuthScreens/signIn';
import SignUp from '../screens/AuthScreens/signUp';
import EnterPassword from '../screens/AuthScreens/enterPassword';
import ConfirmCode from '../screens/AuthScreens/confirmCode';
import ResetPassword from '../screens/AuthScreens/resetPassword';
import PasswordResetCode from '../screens/AuthScreens/resetPasswordCode';

const Stack = createNativeStackNavigator()

const AuthNavigation = ({setLeasing, setUserSignInStatus})=>{
  return(
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName='SignIn'>
          <Stack.Screen name={'ConfirmCode'}>{()=> <ConfirmCode setLeasing={setLeasing} setUserSignInStatus={setUserSignInStatus}/>}</Stack.Screen>
          <Stack.Screen name={'SignUp'} component={SignUp}/>
          <Stack.Screen name={'SignIn'}>{()=> <SignIn setLeasing={setLeasing} setUserSignInStatus={setUserSignInStatus}/>}</Stack.Screen>
          <Stack.Screen name={'EnterPwd'} component={EnterPassword}/>
          <Stack.Screen name={'ResetPassword'} component={ResetPassword}/>
          <Stack.Screen name={'ResetPasswordConfirmationCode'} component={PasswordResetCode}/>

      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AuthNavigation