import { useState , useEffect} from 'react'
import {ActivityIndicator, View, Text, useWindowDimensions, Pressable, StyleSheet, Modal} from 'react-native'
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps'
import * as Location from 'expo-location'
import {Entypo, Ionicons, FontAwesome5, AntDesign, MaterialIcons} from '@expo/vector-icons'
import {useRoute, useNavigation} from '@react-navigation/native'
import MapViewDirections from 'react-native-maps-directions';

const UserApartmentMapScreen = ()=>{
   const {width, height} = useWindowDimensions()
   const [userLocation, setUserLocation] = useState(null)
   const [totalKm, setTotalKm] = useState(0)
   const [totalMin, setTotalMin] = useState(0) 
   const [errorMsg, setErrorMsg] = useState(null)
   const route = useRoute()
   const [modalState, setModalState] = useState(true)
   const {apartment} = route.params
   const navigation = useNavigation()
   
   const API_KEY = `AIzaSyCMHvsm1pHmyT3kopYOYJhUhPTZpikpX5M`
   
   useEffect(() => {
     (async () => {
       let { status } = await Location.requestForegroundPermissionsAsync()
       if (status !== 'granted') {
         setErrorMsg(true)
         return
       }
 
       let location = await Location.getCurrentPositionAsync({})
       setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
       })

       const foregroundSubscription = Location.watchPositionAsync(
        {
            accuracy: Location.Accuracy.High,
            distanceInterval: 200
       }, (updatedLocation)=>{
           setUserLocation({
                  latitude : updatedLocation.coords.latitude,
                  longitude : updatedLocation.coords.longitude
         })
       }
    )
    return ()=> foregroundSubscription
     })()
   }, [])

  if(!userLocation){
    return (
      <Modal visible={modalState} onRequestClose={()=>{setModalState(false); navigation.goBack()}} presentationStyle='overFullScreen'>
          <View style={styles.locationNullContainer}>
            <View style={{width: '70%', borderRadius:10, justifyContent:'center', alignItems:'center', padding: 20, backgroundColor:'white'}}>
                   <ActivityIndicator color='red' size='large'/>
                    <Text style={{color:'black', fontWeight:'500', textAlign:'center'}}>Loading apartment location on the map. Please wait...</Text>
            </View>
          
        </View>  
        { errorMsg && <View style={{...StyleSheet.absoluteFillObject, ...styles.userProfileAlertContainer}}>
                    <View style={styles.userProfileSuccessAlert}>
                            <MaterialIcons name="error" size={40} color="red" style={{marginBottom: 10}}/>
                            <Text style={{color:"red", ...styles.errorAlertLabel}}>Location access denied</Text>
                            <Text style={styles.errorAlertDescText}>Permission to access location was denied, maps won't function properly</Text>
                            <Pressable onPress={()=>{setModalState(false); navigation.goBack()}} style={{backgroundColor: 'black', ...styles.closeProfileAlert}}>
                                <Text style={styles.closeAlertText}>Close</Text>
                            </Pressable>
                        </View>
              </View>}
       </Modal>
    )
  }
   
    return(
    <View style={{flex: 1}}>
      <MapView
       style={{width, height}}
       provider={PROVIDER_GOOGLE}
       showsUserLocation 
       followsUserLocation
       initialRegion={{
        latitude: userLocation?.latitude,
        longitude: userLocation?.longitude,
        latitudeDelta : 0.07,
        longitudeDelta: 0.07
      }}>

       <MapViewDirections
    origin={{latitude: userLocation?.latitude, 
         longitude: userLocation?.longitude}}
    destination={{latitude: apartment.lat, longitude: apartment.lng}}
    strokeColor={'blue'}
    strokeWidth={5}
    mode={'DRIVING'}
    onReady={(results)=>{
          setTotalKm(results.distance)
          setTotalMin(results.duration)
    }}
    apikey={API_KEY}
  />

    <Marker tracksViewChanges={false} description={apartment.address} title={`₦${apartment.formattedPrice} - ${apartment.apartmentTitle}`} coordinate={{
            latitude: apartment.lat,
            longitude: apartment.lng
        }}>

                    <View style={styles.apartmentIcon}>
                        <Entypo name="home" size={25} color="white" /> 
                    </View>
     
    </Marker>
    <Marker tracksViewChanges={false} title='me' coordinate={{
        latitude : userLocation?.latitude,
        longitude: userLocation?.longitude
    }}>
        <View>
        <Ionicons name="location-sharp" size={35} color="red" />
        </View>
        </Marker>
    </MapView>
    <View style={styles.locationInfoContainer}>
          <Text style={styles.locationDescText}>{totalKm.toFixed(2)} Km</Text>
          <FontAwesome5 name="car" size={30} color="gold"  style={{marginHorizontal : 20}}/>
          <Text style={styles.locationDescText}>{ totalMin>=60? (totalMin/60).toFixed(2) : totalMin.toFixed(2)} {totalMin>=60? 'Hr' : 'Min'}</Text>
      </View>
      <Pressable onPress={()=>{navigation.goBack()}} style={styles.navigateBackBtn}>
     <AntDesign name="arrowleft" size={24} color="white"/>
     </Pressable>
    </View>
    )
}

export default UserApartmentMapScreen

const styles = StyleSheet.create({
locationNullContainer: {
  flex: 1, 
  justifyContent:"center", 
  alignItems:'center',
  backgroundColor:'rgba(0,0,0,0.5)'
  },
  userProfileAlertContainer: {
    backgroundColor:'rgba(0,0,0,0.5)', 
    justifyContent:'center',
     alignItems:"center"
},
userProfileSuccessAlert: {
    width:'70%',
    padding: 20, 
    backgroundColor:'white', 
    borderRadius: 20, 
    elevation: 5, 
    alignItems: 'center'
},
  closeProfileAlert: {
    paddingVertical: 5,
    paddingHorizontal: 15, 
    borderRadius: 5
},
closeAlertText: {
    color:'white', 
    fontWeight: '600', 
    fontSize: 14
},
errorAlertLabel: {
    fontWeight: '600', 
    fontSize: 16, 
    marginBottom: 15
},
errorAlertDescText: {
    color:"#4C4C4C", 
    fontWeight: '500', 
    textAlign:'center', 
    marginBottom: 30, 
    fontSize: 14
},
apartmentIcon : {
      backgroundColor:'rgba(255,0,0,0.8)', 
      width: 40, 
      height: 40, 
      borderRadius: 40, 
      justifyContent:"center", 
      alignItems:'center'
    },
    locationInfoContainer: {
      borderTopLeftRadius: 20, 
      borderTopRightRadius: 20, 
      width: '100%', 
      marginTop:'auto',
      zIndex: 1,
      flexDirection: 'row', 
      alignItems:'center', 
      justifyContent:'center', 
      padding: 20, 
      backgroundColor: 'rgba(0,0,0,0.5)'
    },
    locationDescText: {
      fontSize: 25, 
      color:'white', 
      fontWeight: '600'
    },
    navigateBackBtn: {
      position: 'absolute', 
      top: '2%', 
      marginLeft: 10, 
      backgroundColor:'rgba(0,0,0,0.5)', 
      width: 40,
      height:40,
      borderRadius: 40,
      justifyContent:'center',
      alignItems:'center'
    }
})