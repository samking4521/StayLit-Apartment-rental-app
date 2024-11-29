import { useState, useEffect, useRef } from 'react'
import {StyleSheet, View, Text, ScrollView, TextInput , Keyboard, KeyboardAvoidingView, Pressable, Modal, TouchableOpacity} from 'react-native'
import { FontAwesome6, MaterialIcons, Ionicons, Entypo} from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'

const ApartmentPriceForm = ()=>{
    const route = useRoute()
    const {apartmentShareStatusStorage, placeTypeStorage, bedroomNoStorage, bathroomNoStorage, electricityStorage, waterStorage, securityStorage , wardrobeStorage , popStorage, apartmentImagesStorage, addressLatitudeStorage, addressLongitude, addressTextStorage, fullAddressStorage, cityAddressStorage, CountryStorage, StateStorage, title, desc, apartment, mode, newlyAddedImages, removedImages, parkingSpace} = route.params
    const [priceValue, setPriceValue] = useState(apartment?.formattedPrice || '200000')
    const [priceInteger, setPriceInteger] = useState(apartment?.price || 0);
    const [keyboardAppear, setKeyBoardAppear] = useState(false)
    const navigation = useNavigation()
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [ durationValue, setDurationValue] = useState(apartment?.leaseDuration || null)
    const [disableNextBtn, setDisableNextBtn] = useState(apartment?.leaseDuration? false : true)
    const [confirmClicked, setConfirmClicked] = useState(apartment?.leaseDuration || false)
    const [selectRadBtn , setSelectRadBtn] = useState(null)
    const [moveInPriceVal, setMoveInPriceValue] = useState(apartment?.moveInCost || '210000')
    const [moveInPriceValInt, setMoveInPriceValueInt] = useState(apartment?.moveInCostInt || 0)

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

    useEffect(() => {
        // Format the price input on initial load
        updatePriceValue(priceValue);
        updateMoveInPriceValue(moveInPriceVal)
      }, []); 

    const updatePriceValue = (inputValue) => {
        // Remove non-numeric characters
        const numericValue = inputValue.replace(/\D/g, '');
    
        if (!numericValue || numericValue === '0') {
            setPriceValue('0');
            setPriceInteger(0);
          }  else{
            // Remove leading zeros
            const trimmedValue = numericValue.replace(/^0+/, '');
          // Add commas after every 3 digits
            const formattedValue = trimmedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            setPriceValue(formattedValue);
             setPriceInteger(parseInt(trimmedValue, 10)); // Convert to integer and update state
          }
        }

        const updateMoveInPriceValue = (inputValue) => {
            // Remove non-numeric characters
            const numericValue = inputValue.replace(/\D/g, '');
        
            if (!numericValue || numericValue === '0') {
                setMoveInPriceValue('0');
                setMoveInPriceValueInt(0);
              }  else{
                // Remove leading zeros
                const trimmedValue = numericValue.replace(/^0+/, '');
              // Add commas after every 3 digits
                const formattedValue = trimmedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                setMoveInPriceValue(formattedValue);
                setMoveInPriceValueInt(parseInt(trimmedValue, 10)); // Convert to integer and update state
              }
            }
    
  const confirmBtnModal = ()=>{
    if(selectRadBtn){
         setDurationValue(selectRadBtn)
          setConfirmClicked(true)
          setIsModalVisible(false)
          setDisableNextBtn(false)
    }
  }

   const openDurationModal = ()=>{
        Keyboard.dismiss()
        if(durationValue){
            setIsModalVisible(true)
            setSelectRadBtn(durationValue)
        }
        else{
            setIsModalVisible(true)
        }

   }

  const closeDurationModal = ()=>{
     Keyboard.dismiss()
    if (selectRadBtn){
        setSelectRadBtn(null)
        setIsModalVisible(false)
    }
    else{
        setIsModalVisible(false)
    }
  }

    const navigateToAPartmentReviewForm = ()=>{
        if(durationValue){
            navigation.navigate('apartmentReviewForm', {apartmentShareStatusStorage, placeTypeStorage, bedroomNoStorage, bathroomNoStorage, electricityStorage, waterStorage, securityStorage , wardrobeStorage , popStorage, apartmentImagesStorage, addressLatitudeStorage, addressLongitude, addressTextStorage, fullAddressStorage, cityAddressStorage, CountryStorage, StateStorage, title, desc, 'price' : priceInteger, 'formattedPrice' : priceValue, 'duration' : durationValue, apartment, mode, newlyAddedImages, removedImages, parkingSpace, moveInPriceVal, moveInPriceValInt })
    }
}
  
    return(
        <KeyboardAvoidingView behavior={'padding'} style={styles.container}>
             <ScrollView keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
                <View style={{marginBottom: '20%'}}>
                    <Text style={styles.headerText}>Set your price</Text>
                    <Text style={styles.headerDescText}>You can change it anytime.</Text>
                 
                </View>
                 <View>
                    <Text style={{fontSize: 20}}>Move-in payment</Text>
                    <Text style={{color: '#4C4C4C'}}>Move-in fees cover initial costs for securing the apartment, including a security deposit, lease agreement fees, and agent commission</Text>
                    <View style={{flexDirection:'row', alignItems:'center', alignSelf:'center', marginVertical: 10}}>
                            <FontAwesome6 name="naira-sign" size={30} color="black" />
                            <TextInput value={moveInPriceVal} selectionColor={'rgba(0,0,0,0.4)'} onChangeText={updateMoveInPriceValue} autoCorrect={false} autoFocus={true} keyboardType='decimal-pad' style={styles.priceTxtInput} />
                    </View>
                 </View>
                 <View>
                    <Text style={{fontSize: 20}}>Rent</Text>
                    <Text style={{color: '#4C4C4C'}}>Rent is the recurring payment due every rental term end e.g yearly, monthly, weekly, or daily. Covering an occupancy period and granting tenants full access to amenities and services as per the lease agreement.</Text>
                    <View style={{flexDirection:'row', alignItems:'center', marginVertical: 10, justifyContent:'center'}}>
                              <View style={{flexDirection:"row", alignItems:'center', marginRight: 20}}>
                                    <FontAwesome6 name="naira-sign" size={30} color="black" />
                                    <TextInput  value={priceValue} selectionColor={'rgba(0,0,0,0.4)'} onChangeText={updatePriceValue} autoCorrect={false} keyboardType='decimal-pad' style={styles.priceTxtInput} />
                              </View>
                                    <Pressable onPress={openDurationModal} style={styles.durationCont}>
                                        <Text style={styles.durationText}>{confirmClicked? durationValue : 'Duration'}</Text>
                                    <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
                                    </Pressable>
                    </View>
                 </View>
              
            </ScrollView>
                   {!keyboardAppear  && <> 
                <View style={styles.footerCont}>
                    <View style={styles.loadBarAa}></View>
                    <View style={styles.loadBarAb}></View>
                    <View style={styles.loadBarAc}></View>
           
                    <View style={styles.loadBarBa}></View>
                    <View style={styles.loadBarBb}></View>
                    
                    <View style={styles.loadBarCa}></View>
                    <View style={styles.loadBarCb}></View>
                    <View style={styles.loadBarCc}></View>
            </View>
            <View style={styles.footerContainer}>
                                    <Text style={styles.backText} onPress={()=>{navigation.goBack()}}>Back</Text>
                                    <Pressable onPress={navigateToAPartmentReviewForm} style={{ ...styles.nextBtn, backgroundColor: disableNextBtn? 'rgba(0,0,0,0.5)' : 'black'}}>
                                        <Text style={styles.nextText}>Next</Text>
                                    </Pressable>
            </View>
            </>}
                <Modal visible={isModalVisible} onRequestClose={()=>{}} presentationStyle='overFullScreen' transparent={true}>
                 <StatusBar style='light' backgroundColor='rgba(0,0,0,0.5)'/>
                    <View style={{ flex: 1, ...styles.modalContainer}}>
                        <View style={styles.modalContentContainer}>
                            <View style={styles.modalHeader}>
                               <Text style={styles.selectDurationText}>Select Duration</Text>
                            <TouchableOpacity onPress={closeDurationModal}>
                                <Entypo name="cross" size={30} color="black" />
                            </TouchableOpacity>
                            </View>
                            <View>
                                <Pressable style={styles.durationValCont} onPress={()=>{setSelectRadBtn('Weekly')}}>
                                    <Text style={styles.durationValText}>Weekly</Text>
                                   { selectRadBtn == 'Weekly'? <Ionicons name="radio-button-on" size={28} color="black" /> : <Ionicons name="radio-button-off" size={28} color="black" />}
                                </Pressable>
                                <Pressable  style={styles.durationValCont} onPress={()=>{setSelectRadBtn('Monthly')}}>
                                    <Text style={styles.durationValText}>Monthly</Text>
                                    { selectRadBtn == 'Monthly'? <Ionicons name="radio-button-on" size={28} color="black" /> : <Ionicons name="radio-button-off" size={28} color="black" />}
                                </Pressable>
                                <Pressable  style={styles.durationValCont}  onPress={()=>{setSelectRadBtn('Yearly')}}>
                                    <Text style={styles.durationValText}>Yearly</Text>
                                    { selectRadBtn == 'Yearly'? <Ionicons name="radio-button-on" size={28} color="black" /> :  <Ionicons name="radio-button-off" size={28} color="black" />}
                                </Pressable>
                            </View>
                            <View style={{marginTop: 10}}>
                                <Pressable onPress={confirmBtnModal} style={styles.confirmBtn}>
                                    <Text style={styles.confirmText}>Confirm</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                   </Modal>
     </KeyboardAvoidingView>
    )
}

export default ApartmentPriceForm

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: 'white'
    },
    contentContainer: {
        paddingTop: 20, 
        padding: 20,
        flexGrow: 1
    },
    headerText: {
        fontSize: 30, 
        fontWeight: '600', 
        letterSpacing: 0.5
    },
    headerDescText: {
        marginVertical: 5, 
        color: '#4C4C4C', 
        letterSpacing: 0.5, 
        fontSize: 16
    },
    durationCont: {
        
        flexDirection: 'row', 
        alignItems: 'center', 

    },
    durationText: {
        fontSize: 14, 
        fontWeight: '500'
    },
    alignContainer: {
        alignItems: 'center', 
        justifyContent: 'center'
    },
    alignCont: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center'
    },
    txtInputContainer: {
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    priceTxtInput: {
        fontSize: 30
    },
    iconCont: {
        height: 50, 
        justifyContent: 'flex-end'
    },
    iconPressable: {
        borderColor: 'gray', 
        borderWidth: 1, 
        width: 25, 
        height: 25, 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderRadius: 30
    },
    leotFeePrice: {
        fontSize: 14, 
        fontWeight: '400', 
        letterSpacing: 0.5, 
        marginRight: 5
    },
    basePriceCont: {
        padding: 20, 
        borderRadius: 10, 
        borderWidth: 2, 
        marginVertical: 20
    },
    innerBaseCont: {
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 5
    },
    basePriceText: {
        marginRight: 'auto', 
        fontSize: 16
    },
    priceInfoCont: {
        flexDirection: 'row', 
        alignItems: 'center',   
        marginBottom: 10
    },
    renterPriceInfoCont: {
        flexDirection: 'row', 
        alignItems: 'center', 
        borderTopWidth: 1, 
        borderColor: 'lightgray', 
        paddingTop: 10
    },
    renterPriceText: {
        marginRight: 'auto', 
        fontSize: 16,
        fontWeight: '600'
    },
    priceDetailsCont: {
        padding: 20, 
        borderWidth: 1, 
        borderColor: 'gray', 
        flexDirection: 'row', 
        alignItems:'center', 
        marginTop: 10, 
        borderRadius: 10
    },
    priceDetailsText: {
        marginRight: 'auto', 
        fontWeight: '600', 
        fontSize: 16, 
        letterSpacing: 0.5
    },
    showLessText: {
        marginRight: 5, 
        fontSize: 14
    },
    footerCont:{
        width: '100%', 
        flexDirection: 'row', 
        alignItems: 'center'
     }, 
     loadBarAa: {
        backgroundColor: 'black', 
        padding: 3, 
        width: '11%'
     },
     loadBarAb: {
        backgroundColor: 'black',
        padding: 3, 
        width: '11%'
     },
     loadBarAc: {
        backgroundColor: 'black', 
        padding: 3, 
        width: '11%', 
        marginRight: '1%'
     },
     loadBarBa: {
        backgroundColor: 'black', 
        padding: 3, 
        width: '16%'
     },
     loadBarBb: {
        backgroundColor: 'black', 
        padding: 3, 
        width: '16%', 
        marginRight: '1%'
     },
     loadBarCa: {
        backgroundColor: 'black', 
        padding: 3, 
        width: '11%'
     },
     loadBarCb: {
      backgroundColor: 'black', 
      padding: 3, 
      width: '11%'
    },
    loadBarCc: {
      backgroundColor: 'rgba(0,0,0,0.3)', 
      padding: 3, 
      width: '11%'
    },
    footerContainer: {
        flexDirection: 'row', 
        paddingVertical: 10, 
        paddingHorizontal: 20, 
        alignItems: "center", 
        justifyContent: 'space-between'
    },
    backText: {
        fontWeight: '600', 
        textDecorationLine: 'underline', 
        fontSize: 16
    },
    nextBtn: {
        paddingVertical: 10, 
        paddingHorizontal: 20, 
        borderRadius: 10
    },
    nextText: {
        fontWeight: '600', 
        color: 'white', 
        fontSize: 16, 
        letterSpacing: 0.5
    },
    modalContainer: {
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalContentContainer: {
        width: '80%', 
        backgroundColor: "white", 
        padding: 20, 
        borderRadius: 20
    },
    modalHeader: {
        borderBottomWidth: 1, 
        borderBottomColor: 'gray', 
        padding: 5, 
        flexDirection: 'row', 
        alignItems: 'center'
    },
    selectDurationText: {
        fontSize: 20, 
        fontWeight: '600', 
        letterSpacing: 0.5, 
        marginRight: 'auto'
    },
    durationValCont: {
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 10
    },
    durationValText: {
        fontSize: 16, 
        fontWeight: '500', 
        marginRight: 'auto'
    },
    confirmBtn: {
        backgroundColor: 'black', 
        paddingVertical: 10, 
        paddingHorizontal: 15, 
        borderRadius: 10
    },
    confirmText: {
        fontSize: 16, 
        color: 'white', 
        letterSpacing: 0.5, 
        textAlign: 'center', 
        fontWeight: '500'
    }
})
