import { useState, useRef, useEffect } from 'react'
import {View, Text, Pressable, Modal, StyleSheet, useWindowDimensions, TextInput} from 'react-native'
import { AntDesign, Entypo } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView from 'react-native-maps'

const ApartmentLocationForm = ()=>{
    const route = useRoute()
    const { apartmentShareStatusStorage, placeTypeStorage, bedroomNoStorage, bathroomNoStorage, electricityStorage, waterStorage, securityStorage , wardrobeStorage , popStorage, apartmentImagesStorage, apartment, mode, newlyAddedImages, removedImages, parkingSpace} = route.params
    const autocompleteRef = useRef()
    const [addressText, SetAddressText] = useState(apartment?.addressText || 'Enter apartment address')
    const [addressLatitude, setAddressLatitude] = useState(apartment?.lat || null)
    const [addressLongitude, setAddressLongitude] = useState(apartment?.lng || null)
    const [locationModal, setLocationModal] = useState(false)
    const [disableNextBtn, setDisableNextBtn] = useState(true)
    const navigation = useNavigation()
    const { width } = useWindowDimensions()
   
    useEffect(()=>{
            if(addressText && addressLatitude && addressLongitude){
                setDisableNextBtn(false)
            }
    }, [addressText, addressLatitude, addressLongitude])
    
    useEffect(() => {
        if(!locationModal){
            return
        }
        autocompleteRef.current?.focus()
       if (addressText && addressText!=='Enter apartment address'){
        autocompleteRef.current?.setAddressText(addressText);
       }
      }, [locationModal]);

      const clearAddressText = ()=>{
        autocompleteRef.current?.clear()
      }
    
    
        const API_KEY = 'AIzaSyCMHvsm1pHmyT3kopYOYJhUhPTZpikpX5M'
   

        const navigateToApartmentManualLocationForm = ()=>{
            if(addressText!=='Enter apartment address' && addressLatitude && addressLongitude){
                 navigation.navigate('apartmentManualLocationForm', {apartmentShareStatusStorage, placeTypeStorage, bedroomNoStorage, bathroomNoStorage, electricityStorage, waterStorage, securityStorage , wardrobeStorage , popStorage, apartmentImagesStorage, 'addressLatitudeStorage' : addressLatitude, 'addressLongitude' : addressLongitude, 'addressTextStorage' : addressText, apartment, mode, newlyAddedImages, removedImages, parkingSpace})
            }
        }

    return(
    <View style={styles.container}>
        
        <View style={{padding: 20}}>
          <Text style={styles.headerText}>Where's your place located?</Text>
          <Text  style={styles.headerDescText}>It is best to specify your apartment address in the format street, city, state, country. This approach help users locate properties accurately and make informed decisions using our mapping services</Text>
        </View>

        <View style={styles.contentContainer}>
            <MapView style={{width, height: '100%'}}></MapView>
           <Pressable  onPress={()=>{setLocationModal(true)}} style={styles.locationLabelCont}>
           <Entypo name="location-pin" size={30} color="black" />
           <TextInput editable={false} placeholder='Enter apartment address' value={addressText} style={styles.locationTextInput} autoCorrect={false}/>
           </Pressable>   
        </View>
        <View style={styles.footerCont}>
                    <View style={styles.loadBarAa}></View>
                    <View style={styles.loadBarAb}></View>
                    <View style={styles.loadBarAc}></View>
           
                    <View style={styles.loadBarBa}></View>
                    <View style={styles.loadBarBb}></View>
                    
                    <View style={styles.loadBarC}></View>
                    <View style={styles.loadBarC}></View>
                    <View style={styles.loadBarC}></View>
            </View>
            <View style={styles.footerContainer}>
                <Text style={styles.backBtn} onPress={()=>{navigation.goBack()}}>Back</Text>
                <Pressable onPress={navigateToApartmentManualLocationForm} style={{ ...styles.nextBtn, backgroundColor: disableNextBtn? 'rgba(0,0,0,0.3)' : 'black'}}>
                    <Text style={styles.nextText}>Next</Text>
                </Pressable>
            </View>

        <Modal visible={locationModal} onRequestClose={()=>{setLocationModal(false)}} presentationStyle='overFullScreen'>
                    <View style={styles.modalCont}>
                            <View style={styles.alignContainer}>
                                <AntDesign name="arrowleft" size={24} color="black" style={{marginRight: 20}} onPress={()=>{setLocationModal(false)}}/>
                                <Text style={styles.apartmentAddressText}>Enter apartment address</Text>
                                <Text onPress={clearAddressText} style={styles.clearText}>Clear</Text>
                            </View>
                        <View style={styles.locationDescTextCont}>
                            <Text style={styles.locationDescText}><Text style={{fontWeight:'600'}}>NOTE: </Text>Enter addresses in the format: street name, city, state, and country. If address is not available on search, specify a landmark close to actual address. This format is crucial for accurate listing and map services."</Text>
                        </View>
                        <View style={styles.googlePlacesCont}>
                        <View style={styles.googlePlacesMainCont}>    
                                <GooglePlacesAutocomplete
                                                ref={autocompleteRef}
                                                placeholder='Search'
                                                keepResultsAfterBlur={true}
                                                onPress={(data, details) => {
                                                    console.log('data : ', data, 'details', details)
                                                    console.log('Desc : ', data.description)
                                                    console.log('Lat : ', details.geometry.location.lat)
                                                    console.log('Lng : ',details.geometry.location.lng)
                                                    SetAddressText(data.description)
                                                    setAddressLatitude(details.geometry.location.lat)
                                                    setAddressLongitude(details.geometry.location.lng)
                                                    setLocationModal(false)
                                                }}
                                                query={{
                                                    key: API_KEY,
                                                    language: 'en',
                                                }}
                                                onFail={(err)=>{alert(err.message)}}
                                                minLength={2}
                                                fetchDetails={true}
                                                autoFillOnNotFound={true}
                                                enablePoweredByContainer={false}
                                                keyboardShouldPersistTaps={"always"}
                                                isRowScrollable={true}
                                                styles={{
                                                    textInput: styles.locationInput,
                                                    separator: styles.seperatorStyle,
                                                    listView: {
                                                        width: width - (15/100 * width)
                                                    },
                                                    description: styles.descriptionStyle,
                                                    row: {
                                                        backgroundColor:'white'
                                                    }
                                                }}
                                                
                                        />
                                
                            </View>
                            
                        </View>
                            
                    </View>
        </Modal>
</View>

    )
}

export default ApartmentLocationForm

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor:'white'
    },
    headerText: {
        fontSize: 20, 
        fontWeight: '600', 
        color:'black', 
        marginBottom: 10
    },
    headerDescText: {
        fontSize: 14, 
        color:'#4C4C4C', 
        fontWeight:'400'
    },
    contentContainer: {
        flex: 1,
        marginTop: 10
    },
    locationLabelCont: {
        flexDirection:'row', 
        alignItems:'center', 
        justifyContent:'center', 
        position:'absolute', 
        top: 20, 
        alignSelf:'center',
        width: '90%',
        padding: 8, 
        borderRadius: 30, 
        backgroundColor:'white'
    },
    locationTextInput: {
        width: '90%', 
        color:'black', 
        fontSize: 14, 
        fontWeight: '600'
    },
    footerCont:{
        width: '100%', 
        flexDirection: 'row', 
        alignItems: 'center'
     }, 
     loadBarAa: {
        backgroundColor:'black', 
        padding: 3, 
        width: '11%'
     },
     loadBarAb: {
        backgroundColor:'black', 
        padding: 3, 
        width: '11%'
     },
     loadBarAc: {
        backgroundColor:'black', 
        padding: 3, 
        width: '11%', 
        marginRight: '1%'
     },
     loadBarBa: {
        backgroundColor:'black', 
        padding: 3, 
        width: '16%'
     },
     loadBarBb: {
        backgroundColor:'rgba(0,0,0,0.3)', 
        padding: 3, 
        width: '16%', 
        marginRight: '1%'
     },
     loadBarC: {
        backgroundColor:'rgba(0,0,0,0.3)', 
        padding: 3, 
        width: '11%'
     },
     footerContainer: {
        flexDirection: 'row', 
        paddingVertical: 10, 
        paddingHorizontal: 20, 
        alignItems:"center", 
        justifyContent:'space-between'
     },
     apartmentAddressText: {
        fontWeight: '600', 
        fontSize: 16, 
        letterSpacing: 0.5, 
        marginRight: 'auto'
     },
     backBtn: {
        fontWeight: '600', 
        textDecorationLine:'underline', 
        fontSize: 16
     },
     nextBtn: {
        paddingVertical: 10, 
        paddingHorizontal: 20, 
        borderRadius: 10
     },
     nextText: {
        fontWeight: '600', 
        color:'white', 
        fontSize: 16, 
        letterSpacing: 0.5
     },
     modalCont: {
        flex: 1, 
        padding: 20
     },
     alignContainer: {
        flexDirection:'row', 
        alignItems:'center'
     },
     clearText: {
        fontWeight:'400', 
        fontSize: 14, 
        letterSpacing:0.5, 
        color:'red'
     },
     locationDescTextCont: {
        marginTop: 20, 
        marginBottom: 10
     },
     locationDescText: {
        color:'#4C4C4C', 
        fontSize: 14,
        textAlign:'justify'
     },
     googlePlacesCont: {
        width:'100%',
        padding: 5, 
        borderRadius: 30, 
        backgroundColor:'white', 
        borderWidth: 2,
        height: 50
     },
     googlePlacesMainCont: {
        width: '85%', 
        justifyContent:'center', 
        zIndex: 1, 
        position:'absolute', 
        left : 5, 
        top : 3
     },
     locationInput: {
            color: '#4C4C4C',
            fontSize: 15,
            backgroundColor:'white',
            height: 40,
            borderRadius: 15
     },
     seperatorStyle: {
        borderColor:'black',
        borderWidth: 0.5
     },
     descriptionStyle: {
        color:'black',
        fontSize: 15,
     }
})