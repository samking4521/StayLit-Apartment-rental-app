import { useState, useEffect } from 'react'
import {View, Text, TextInput, Pressable, Modal, FlatList, ScrollView, Keyboard, KeyboardAvoidingView, StyleSheet} from 'react-native'
import { Entypo, FontAwesome5, SimpleLineIcons, FontAwesome6, AntDesign } from '@expo/vector-icons'
import CountryPicker from 'react-native-country-picker-modal';
import states from '../../../assets/data/states.json'
import { useNavigation, useRoute } from '@react-navigation/native';

const ApartmentManualLocationForm = ()=>{
    const route = useRoute()
    const { apartmentShareStatusStorage, placeTypeStorage, bedroomNoStorage, bathroomNoStorage, electricityStorage, waterStorage, securityStorage , wardrobeStorage , popStorage, apartmentImagesStorage, addressLatitudeStorage, addressLongitude, addressTextStorage, apartment, mode, newlyAddedImages, removedImages, parkingSpace} = route.params
    const [fullAddress, setFullAddress] = useState(apartment?.address || '')
    const [cityAddress, setCityAddress] = useState(apartment?.city || '')
    const [Country, setCountry] = useState(apartment?.country || 'Select Country')
    const [State, setState] = useState(apartment?.state || 'Select State')
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [selectedCountryNameCode, setSelectedCountryNameCode] = useState(null)
    const [isStateModalVisible, setIsStateModalVisible] = useState(false)
    const [BorderWidth, setBorderWidth] = useState(null)
    const [selectedCountryStates, setSelectedCountryStates] = useState(null)
    const [disableNextBtn, setDisableNextBtn] = useState(true)
    const navigation = useNavigation()
    const [keyboardAppear, setKeyBoardAppear] = useState(false)
   
   
    useEffect(()=>{
     if(fullAddress && cityAddress && Country && State!=='Select State'){
        setDisableNextBtn(false)
     }
     else{
        setDisableNextBtn(true)
     }
    }, [ fullAddress, cityAddress, Country, State ])

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
          'keyboardDidShow',
          () => {
            console.log('Keyboard is shown');
            setKeyBoardAppear(true)
            // You can perform actions when the keyboard is shown here
          }
        );
    
        const keyboardDidHideListener = Keyboard.addListener(
          'keyboardDidHide',
          () => {
            console.log('Keyboard is hidden');
            setKeyBoardAppear(false)
            // You can perform actions when the keyboard is hidden here
          }
        );
    
        // Clean up listeners when the component unmounts
        return () => {
          keyboardDidShowListener.remove();
          keyboardDidHideListener.remove();
        };
      }, []);

    useEffect(()=>{
        if(!selectedCountryNameCode){
         return
        }
        const country_states = states.filter((stat)=>{
         return(
            stat.country_code == selectedCountryNameCode
         )
         })
         console.log('c : ', country_states)
         if (country_states?.length !== 0) {
             setState('Select State')
           }
           if (country_states?.length == 0){
             setState('Null')
           }
          
     setSelectedCountryStates(country_states)
   }, [selectedCountryNameCode])

    const setAddress = (text)=>{
        setFullAddress(text)
    }

    const setCity = (text)=>{
        setCityAddress(text)
    }

    const navigateToApartmentPriceForm = ()=>{
        if (fullAddress && cityAddress && Country && State!=='Select State'){
            navigation.navigate('apartmentTitleDescForm', { apartmentShareStatusStorage, placeTypeStorage, bedroomNoStorage, bathroomNoStorage, electricityStorage, waterStorage, securityStorage , wardrobeStorage , popStorage, apartmentImagesStorage, addressLatitudeStorage, addressLongitude, addressTextStorage, 'fullAddressStorage' : fullAddress, 'cityAddressStorage': cityAddress, 'CountryStorage' : Country, 'StateStorage' : State, apartment, mode, newlyAddedImages, removedImages, parkingSpace})
        }
    }

    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      const originalWarn = console.error;
      // eslint-disable-next-line no-console
      console.error = (...args) => {
        if (
          args[0].includes(
            "Support for defaultProps will be removed from function components in a future major release.",
          )
        ) {
          return;
        }
        originalWarn(...args);
      };
    }

  
    return(
     <KeyboardAvoidingView behavior='padding' style={styles.container}>
        
        <ScrollView keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
            <View>
                <Text style={styles.headerText}>Manually Enter {'\n'}Apartment Address</Text>
                <Text style={styles.headerDescText}>It is best to specify your apartment address in the format street, city, state, country. The address specified will be displayed to renters.</Text>
            </View>
            <View style={{marginTop : 20}}>
                <Text style={styles.label}>Apartment Address</Text>
            <View style={{...styles.labelCont,  borderBottomWidth: BorderWidth=='address'? 2 : 1}}>
                    <Entypo name="location-pin" size={25} color="#4C4C4C" style={{width: 30}}/>
                    <TextInput value={fullAddress} onChangeText={setAddress} onFocus={()=>{setBorderWidth('address')}} placeholder='Enter Full Apartment Address' style={styles.textInput} autoCorrect={false}/>
            </View>
            </View> 
           

            <View style={{marginTop : 20}}>
                <Text style={styles.label}>Country</Text>
            <Pressable onPress={()=>{setBorderWidth('country'); setIsModalVisible(true)}} style={{ ...styles.labelContB, paddingVertical: 10, borderBottomWidth: BorderWidth == 'country'? 2 : 1}}>
            <Entypo name="flag" size={25} color="#4C4C4C" style={styles.countryIcon}/>
                     <CountryPicker
                    onSelect={(country) => {
                    // Handle country selection
                    console.log(country)
                    setIsModalVisible(false);
                    setCountry(country.name)
                    setSelectedCountryNameCode(country.cca2)
                    
                    // Close the modal after selection if needed
                    }}
                    withFlag
                    withFilter
                    withModal
                    visible={isModalVisible}
                    onClose={()=>{setIsModalVisible(false)}} // Close modal on outside press or close button
                    placeholder={<Text style={{fontSize: 15, color: Country == 'Select Country'? '#5D5D5D' :'black'}}>{Country}</Text>}
                    closeButtonImageStyle={styles.countryImg}
                            />
                        <SimpleLineIcons name="arrow-down" size={18} color="black" style={{ marginLeft:'auto'}}/>
            </Pressable>
            </View> 
            <View style={{marginTop : 20}}>
                <Text style={styles.label}>State</Text>
                <Pressable onPress={()=>{setBorderWidth('state'); setIsStateModalVisible(true)}} style={{ ...styles.labelContB,  borderBottomWidth: BorderWidth == 'state'? 2 : 1}}>
                <FontAwesome6 name="map-location-dot" size={20} color="#4C4C4C" style={{width: 30}}/>
                <TextInput editable={false} value={State}  style={{ ...styles.textInput, color: State == 'Select State'? '#5d5d5d' : 'black'}} autoCorrect={false}/>
                <SimpleLineIcons name="arrow-down" size={18} color="black" style={{ marginLeft:'auto'}}/>
                </Pressable>
            </View> 
            <View style={{marginTop : 20}}>
                <Text style={styles.label}>City</Text>
            <View style={{ ...styles.labelCont, paddingLeft: 10, borderBottomWidth: BorderWidth == 'city'? 2 : 1}}>
            <FontAwesome5 name="city" size={18} color="#4C4C4C" style={{width: 30}} />
            <TextInput value={cityAddress} onChangeText={setCity} onFocus={()=>{setBorderWidth('city')}} placeholder='Enter City here' style={styles.textInput} autoCapitalize='words' autoCorrect={false}/>
            </View>
            </View> 
            <Modal visible={isStateModalVisible} presentationStyle='overFullScreen' onRequestClose={()=>{setIsStateModalVisible(false)}}>
                       <View style={{flex: 1}}>
                        <View style={styles.statesHeader}>
                        <AntDesign name="close" size={20} color="black" onPress={()=>{setIsStateModalVisible(false)}}/>
                          <Text style={styles.statesText}>States</Text>
                        </View>
                        {selectedCountryStates? <FlatList data={selectedCountryStates.length !== 0? selectedCountryStates : ['Selected Country has no states']} showsVerticalScrollIndicator={false} contentContainerStyle={{flex: selectedCountryStates.length== 0? 1 : null, justifyContent : selectedCountryStates.length== 0? 'center': null, alignItems: selectedCountryStates.length == 0? 'center' : null }} renderItem={({item})=>{       
                                    return(
                                    <Pressable onPress={()=>{
                                        if(item == 'Selected Country has no states'){
                                              return null
                                    }
                                    else {
                                        setState(item.name); 
                                        setIsStateModalVisible(false)
                                    }
                                    }} key={item == 'Selected Country has no states'? 1 : item.id} style={{padding: 20, borderBottomWidth: item == 'Selected Country has no states'? 0 : 1, borderBottomColor: item == 'Selected Country has no states'? null : 'lightgray'}}>
                                   
                                        <Text style={{fontSize: 16, color: item == 'Selected Country has no states'? 'red' : null}}>{item == 'Selected Country has no states'? item : item.name}</Text>
                                    </Pressable>
                                    )
                                }}/> : <View style={styles.selectCountryFirstCont}>
                                      <Text style={styles.selectCountryFirstText}>Select Country First</Text>
                                    </View>}
                        
                       </View>
                     </Modal>
        </ScrollView>
       { !keyboardAppear && <> 
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
            </>}
            <View style={styles.footerContainer}>
                                    <Text style={styles.backText} onPress={()=>{navigation.goBack()}}>Back</Text>
                                    <Pressable onPress={navigateToApartmentPriceForm} style={{ ...styles.nextBtn, backgroundColor: disableNextBtn? 'rgba(0,0,0,0.3)' : 'black'}}>
                                        <Text style={styles.nextText}>Next</Text>
                                    </Pressable>
            </View>
        </KeyboardAvoidingView>
    )
}

export default ApartmentManualLocationForm

const styles = StyleSheet.create({
  container: {
     flex: 1, 
     backgroundColor:'white'
  },
   headerText: {
    fontSize: 20, 
    fontWeight:'600', 
    letterSpacing:0.5
   },
   headerDescText: {
    fontSize: 14, 
    color:'#4C4C4C', 
    letterSpacing: 0.5, 
    marginVertical: 5
   },
   label : {
    fontSize: 16, 
    fontWeight: '500', 
    letterSpacing: 0.5, 
    marginBottom: 5
   },
   labelCont: {
    width: '100%', 
    flexDirection:'row', 
    alignItems:'center', 
    borderRadius: 10, 
    paddingLeft: 10
   },
   labelContB: {
    width: '100%', 
    flexDirection:'row', 
    alignItems:'center', 
    borderRadius: 10, 
    paddingHorizontal: 10
   },
   textInput: {
    flex: 1, 
    padding: 10, 
    borderRadius: 10, 
    fontSize: 15, 
    paddingLeft: 10
   },
   countryIcon: {
    width: 30, 
    marginRight: 10
   },
   countryImg: {
    width: 20, 
    height: 20
   },
   statesHeader: {
    flexDirection: 'row', 
    alignItems: "center", 
    padding: 20
   },
   statesText: {
    fontSize: 20, 
    fontWeight:'600', 
    marginLeft: 20
   },
   selectCountryFirstCont: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent:'center'
   },
   selectCountryFirstText: {
    color: '#F52F57', 
    fontSize: 16, 
    fontWeight:'600', 
    letterSpacing:0.5
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
    backgroundColor:'black', 
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
 backText: {
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
 }
})