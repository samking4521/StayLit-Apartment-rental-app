import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ListingsScreen from '../HostScreens/ListingsScreen';
import Payments from '../HostScreens/Payments'
import ResetPassword from '../screens/AuthScreens/resetPassword';
import PasswordResetCode from '../screens/AuthScreens/resetPasswordCode';
import HostProfile from '../HostScreens/Profile/ProfileView';
import Profile from '../HostScreens/Profile'
import AboutUs from '../HostScreens/HostSettings/about';
import PrivacyPolicy from '../HostScreens/HostSettings/privacy';
import TermsAndConditions from '../HostScreens/HostSettings/terms';
import ContactUs from '../HostScreens/HostSettings/contact';
import UserApartmentMapScreen from '../screens/UserApartmentMapScreen';
import { MaterialIcons, SimpleLineIcons, Octicons, FontAwesome6 } from '@expo/vector-icons'
import SettingsScreen from '../HostScreens/HostSettings'
import ContactScreen from '../HostScreens/ContactScreen';
import HostAcc from '../HostScreens/Payments/hostAccount';
import AmenitiesScreen from '../HostScreens/AmenitiesScreen';
import ApartmentDetailsForm from '../HostScreens/apartmentDetailsForm'
import ApartmentAmenitiesForm from '../HostScreens/apartmentAmenitiesForm'
import ApartmentPhotosForm from '../HostScreens/apartmentPhotosForm'
import ApartmentLocationForm from '../HostScreens/apartmentLocationForm'
import ApartmentManualLocationForm from '../HostScreens/apartmentManualLocationForm'
import ApartmentTitleDescForm from '../HostScreens/apartmentTitleDescForm'
import ApartmentPriceForm from '../HostScreens/apartmentPriceForm'
import ApartmentReviewForm from '../HostScreens/apartmentReviewForm'
import AparmentDetailsScreen from '../HostScreens/AparmentDetails';
import ReviewScreen from '../HostScreens/ReviewScreen';
import ReceiptStack from '../HostScreens/Receipt/receiptStack';
import { useSelector } from 'react-redux';

const Stack = createNativeStackNavigator()

const HostingNavigation = ({ setLeasing, setUserSignInStatus }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen name={'Home'} component={BottomTabNavigation} />
        <Stack.Screen name={'Settings'}>
          {() => <SettingsScreen setLeasing={setLeasing} setUserSignInStatus={setUserSignInStatus} />}
        </Stack.Screen>
        <Stack.Screen name={'ApartmentDetailsForm'} component={ApartmentDetailsForm} />
        <Stack.Screen name={'apartmentAmenitiesForm'} component={ApartmentAmenitiesForm} />
        <Stack.Screen name={'apartmentPhotosForm'} component={ApartmentPhotosForm} />
        <Stack.Screen name={'apartmentLocationForm'} component={ApartmentLocationForm} />
        <Stack.Screen name={'apartmentManualLocationForm'} component={ApartmentManualLocationForm} />
        <Stack.Screen name={'apartmentTitleDescForm'} component={ApartmentTitleDescForm} />
        <Stack.Screen name={'apartmentPriceForm'} component={ApartmentPriceForm} />
        <Stack.Screen name={'apartmentReviewForm'} component={ApartmentReviewForm} />
        <Stack.Screen name={'ApartmentsDetails'} component={AparmentDetailsScreen} />
        <Stack.Screen name={'Amenities'} component={AmenitiesScreen} />
        <Stack.Screen name={'Receipt'} component={ReceiptStack} />
        <Stack.Screen name={'Contact'} component={ContactScreen} />
        <Stack.Screen name={'ProfileView'} component={HostProfile} />
        <Stack.Screen name={'resetPassword'} component={ResetPassword}/>
        <Stack.Screen name={'ResetPasswordConfirmationCode'} component={PasswordResetCode}/>
        <Stack.Screen name={'privacyPolicy'} component={PrivacyPolicy}/>
        <Stack.Screen name={'AboutUs'} component={AboutUs}/>
        <Stack.Screen name={'ContactUs'} component={ContactUs}/>
        <Stack.Screen name={'HostAccount'} component={HostAcc}/>
        <Stack.Screen name={'TermsAndConditions'} component={TermsAndConditions}/>
        <Stack.Screen name={'UserApartmentMap'} component={UserApartmentMapScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default HostingNavigation

const Tab = createBottomTabNavigator();

function BottomTabNavigation() {
  const theObserveHostPayment = useSelector( state => state.observeHostPayment.observeHostPay)
  return (
    <Tab.Navigator initialRouteName='Listings' screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#FF0000',
      tabBarInactiveTintColor: '#4C4C4C',
      tabBarLabelStyle: { fontWeight:'500', fontSize: 12}
    }}>
      <Tab.Screen name="Listings" component={ListingsScreen} options={{
        tabBarIcon: ({ color }) => <SimpleLineIcons name="home" size={24} color={color} />
      }} />

      <Tab.Screen name="Payments" component={Payments} options={{
        tabBarIcon: ({ color }) => <MaterialIcons name="payment" size={28} color={color} />,
        tabBarBadge: theObserveHostPayment?.newPayment ? <></> : null
      }} />
      <Tab.Screen name="Reviews" component={ReviewScreen}  options={{
        tabBarIcon: ({ color }) => <FontAwesome6 name="grin-stars" size={24} color={color} />,
      }}/>
      <Tab.Screen name="Profile" component={Profile} options={{
        tabBarIcon: ({ color }) => <Octicons name="three-bars" size={24} color={color} />,
      }} />

    </Tab.Navigator>
  );
}
