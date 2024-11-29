import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import WishLists from '../screens/WishLists';
import Payments from '../screens/Payments';
import AparmentDetailsScreen from '../screens/AparmentDetails';
import AmenitiesScreen from '../screens/AmenitiesScreen';
import PrivacyPolicy from '../screens/SettingsScreen/privacy'
import TermsAndConditions from '../screens/SettingsScreen/terms';
import AboutUs from '../screens/SettingsScreen/about';
import ContactUs from '../screens/SettingsScreen/contact';
import UserApartmentMapScreen from '../screens/UserApartmentMapScreen'
import ContactScreen from '../screens/ContactScreen';
import AgentDetailsScreen from '../screens/AgentDetailsScreen'
import AgentListingsScreen from '../screens/AgentListingsScreen';
import ResetPassword from '../screens/AuthScreens/resetPassword'
import PasswordResetCode from '../screens/AuthScreens/resetPasswordCode';
import Profile from '../screens/Profile/index';
import ProfileView from '../screens/Profile/profileView'
import ReviewScreen from '../screens/ReviewScreen';
import SettingsScreen from '../screens/SettingsScreen';
import PaymentDetails from '../screens/PaymentScreens/paymentDetails';
import ReceiptStack from '../screens/Receipt/receiptStack';
import CardInfo from '../screens/PaymentScreens/cardDetails';
import { AntDesign } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

const Stack = createNativeStackNavigator()

const Navigation = ({setLeasing, setUserSignInStatus})=>{


  return(
    <NavigationContainer>
    <Stack.Navigator screenOptions={{
      headerShown: false
    }} initialRouteName='Home'>
      <Stack.Screen name={'Home'} component={ExploreScreen}/>
      <Stack.Screen name={'ApartmentsDetails'} component={AparmentDetailsScreen}/>
      <Stack.Screen name={'Amenities'} component={AmenitiesScreen}/>     
      <Stack.Screen name={'UserApartmentMap'} component={UserApartmentMapScreen}/>      
      <Stack.Screen name={'ChatAgentScreen'} component={ContactScreen}/>      
      <Stack.Screen name={'AgentDetails'} component={AgentDetailsScreen}/>   
      <Stack.Screen name={'AgentListings'} component={AgentListingsScreen}/>
      <Stack.Screen name={'FullReviewScreen'} component={ReviewScreen}/>
      <Stack.Screen name={'PaymentDetails'} component={PaymentDetails}/>
      <Stack.Screen name={'ProfileView'} component={ProfileView}/>
      <Stack.Screen name={'Settings'}>
        {()=><SettingsScreen setLeasing={setLeasing} setUserSignInStatus={setUserSignInStatus}/>}
      </Stack.Screen>
      <Stack.Screen name={'Receipt'} component={ReceiptStack}/>
      <Stack.Screen name={'cardInfo'} component={CardInfo}/>
      <Stack.Screen name={'resetPassword'} component={ResetPassword}/>
      <Stack.Screen name={'ResetPasswordConfirmationCode'} component={PasswordResetCode}/>
      <Stack.Screen name={'privacyPolicy'} component={PrivacyPolicy}/>
      <Stack.Screen name={'AboutUs'} component={AboutUs}/>
      <Stack.Screen name={'ContactUs'} component={ContactUs}/>
      <Stack.Screen name={'TermsAndConditions'} component={TermsAndConditions}/>
    </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigation

const Tab = createBottomTabNavigator();

function ExploreScreen() {
    const wishList = useSelector( state => state.wish.wishList)
    const theObservePayment = useSelector( state => state.observePayment.observePayment)

  return (
   <Tab.Navigator initialRouteName='HomeScreen' screenOptions={{
    headerShown: false,
    tabBarActiveTintColor: '#FF0000',
    tabBarInactiveTintColor: '#4C4C4C',
    tabBarLabelStyle: { fontWeight:'500', fontSize: 12},
    tabBarBadgeStyle: {backgroundColor: '#FF0000'}
   }}>
      <Tab.Screen name="Explore" component={HomeScreen} options={{
        tabBarIcon: ({color})=><AntDesign name="search1" size={24} color={color} />}}/>

      <Tab.Screen name="Wishlists" component={WishLists} options={{
        tabBarIcon: ({color})=><AntDesign name="hearto" size={24} color={color} />,
      tabBarBadge: wishList?.length == 0 ? null : wishList?.length}}/>

      <Tab.Screen name="Payments" component={Payments} options={{
        tabBarIcon: ({color})=><AntDesign name="creditcard" size={24} color={color} />,
        tabBarBadge: theObservePayment?.newPayment? <></> : null}} />

      <Tab.Screen name="Profile" component={Profile} options={{
       tabBarIcon: ({color})=><AntDesign name="user" size={24} color={color} />}}/>
    </Tab.Navigator>
   
  );
}
