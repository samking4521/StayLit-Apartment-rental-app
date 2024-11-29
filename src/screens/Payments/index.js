import { useCallback, useEffect, useState, useRef } from 'react'
import {View, Text, StyleSheet, Image, FlatList, Pressable, ActivityIndicator, Modal, Keyboard} from 'react-native'
import { Entypo, FontAwesome6, Ionicons, MaterialIcons, AntDesign } from '@expo/vector-icons'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { DataStore } from 'aws-amplify/datastore'
import { fetchPaidApartments } from '../../Redux/paymentHistory/paymentActions'
import { ObservePayment } from '../../models'
import BottomSheet from '@gorhom/bottom-sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import ChargeCard from '../PaymentScreens/chargeCard'
import { parse, compareDesc } from 'date-fns';
import { StatusBar } from 'expo-status-bar'
import { useSelector, useDispatch } from 'react-redux'
import { dontShowProfileAlert } from '../../Redux/showProfile/showProfileActions'
import { fetchObservePayment } from '../../Redux/observePayment/observePaymentActions.js'

const Payments = ()=>{
    const dbUser = useSelector( state => state.user.dbUser)
    const userCardFound = useSelector( state => state.card.userCardFound)
    const paidApartments = useSelector( state => state.payment.paidApartments)
    const showProfileAlert = useSelector( state => state.profile.showProfile)
    const dispatch = useDispatch()
    const navigation = useNavigation() // navigation object for transition between screens
    const [info, setInfo] = useState(null) // controls visibility of the bottomsheet (null = hidden, true = visible )
    const [processing, setProcessing] = useState(false) // controls the visibilty of the loading profile indicator (false= hidden, true = visible) 
    const [dontShowReceipt, setDontShowReceipt] = useState(true) // controls receipt visibility when card is first charged in the Payment screen (true= hidden, false = visible)
    const bottomSheetRef = useRef() // reference to bottomsheet component
    const [bottomSheetIndex, setBottomSheetIndex] = useState(false) // controls bottom sheet index position (true = index 1, false= index 0)
    const [chargeCardErrorAlert, setChargeCardErrorAlert] = useState(null) // controls the visibility of the charge card errors (null = hidden, true= visible)
    const [changeStatus, setChangeStatusBar] = useState(false)
    
    useFocusEffect(
        useCallback(() => {
          setChangeStatusBar(true)
          return () => setChangeStatusBar(false);
        }, [])
      );

  // useEffect hook to sort apartments by the latest date whenever `paidApartments` changes
    useEffect(()=>{
         // Helper function to parse date strings into Date objects
        const parseDate = dateString => parse(dateString, 'M/d/yyyy, h:mm:ss a', new Date());
        
        // Sort `paidApartments` based on parsed dates in descending(latest date) order
        const sortedApts = paidApartments?.sort((a, b) => compareDesc(parseDate(a.date), parseDate(b.date)));
        dispatch(fetchPaidApartments(sortedApts))
        
    }, [paidApartments])
   

  
   // Effect hook to update the bottom sheet position when the keyboard is shown
    useEffect(() => {
        // Add listener for keyboard showing event
        const keyboardDidShowListener = Keyboard.addListener(
          'keyboardDidShow',
          () => {
            // Set state to update bottom sheet position when keyboard is visible
            setBottomSheetIndex(true)
          }
        );
    
        // Cleanup the listener on component unmount
        return () => {
          keyboardDidShowListener.remove();
        };
      }, []);

      // Effect hook to update the bottom sheet when the keyboard is hidden
      useEffect(() => {
        // Add listener for keyboard hiding event
        const keyboardDidHideListener = Keyboard.addListener(
          'keyboardDidHide',
          () => {
             // Set state to update bottom sheet position when keyboard is hidden
            setBottomSheetIndex(false)
          }
        );
    
        // Cleanup the listener on component unmount
        return () => {
            keyboardDidHideListener.remove();
        };
      }, []);


// Function to update the observe payment status
    const updateObservePayment = async ()=>{
        // Query the ObservePayment table for records matching the current user's ID
        const obsPaymentObj = await DataStore.query(ObservePayment, (o)=> o.userID.eq(dbUser.id))
        console.log('obsPaymentObj : ', obsPaymentObj[0])
        if(obsPaymentObj[0]){
             // Update the `newPayment` to false
            const updateObsPaymentObj = await DataStore.save(ObservePayment.copyOf(obsPaymentObj[0], (updated)=>{
                updated.newPayment = false
            }))
            console.log('updateObsPaymentObj : ', updateObsPaymentObj)
            dispatch(fetchObservePayment(updateObsPaymentObj))
        }
    }

    // Effect hook to update observe payment status when the component is focused and dbUser is defined
    useFocusEffect(
        useCallback(() => {
            if (!dbUser) {
              return;
            }
            updateObservePayment();
          }, [dbUser])
    )

// Function to format price values with commas
const formatPriceToString = (val) => {
    // Convert val to a number if it's not already
    const numberVal = Number(val);

    // Check if numberVal is a valid number
    if (isNaN(numberVal)) {
        return val; // Return the original value if it's not a number
    }

    // Format numberVal with commas for every 3 digits
    const formattedVal = numberVal.toLocaleString('en-US');
    return formattedVal;
}  

console.log('paidAAPTS : ', paidApartments)

  if(!paidApartments || paidApartments.length == 0){
     return(
        <GestureHandlerRootView style={styles.container}>
            <View style={{flex: 1}}>
            <View style={{padding: 20}}>
                <Text style={styles.paymentLabel}>Payments</Text>
            </View>
            </View> 
            <BottomSheet ref={bottomSheetRef} index={0} snapPoints={bottomSheetIndex? ['90%'] : ['70%']} handleStyle={processing? styles.bottomSheetHandleStyle : null} handleIndicatorStyle={{display: 'none'}}  containerStyle={{backgroundColor: processing? null : 'rgba(0,0,0,0.5)'}}>
                {changeStatus && <StatusBar style="light" backgroundColor="rgba(0,0,0,0.5)"/>}
                  <View style={styles.chargeCardContainer}>
                        <ChargeCard setChargeCardErrorAlert={setChargeCardErrorAlert} setBottomSheetIndex={setBottomSheetIndex} closeBtn={true} dontShowReceipt={dontShowReceipt} setInfo={setInfo} setProcessing={setProcessing} processing={processing}/>
                  </View>
                       { processing && <View style={{...StyleSheet.absoluteFillObject, ...styles.processingContainer}}>
                            <View style={{alignItems:'center'}}>
                                <ActivityIndicator size='large' color='red'/>
                                <Text style={styles.processingText}>processing...</Text>
                            </View>
                        </View>}
            </BottomSheet>
            <Modal visible={chargeCardErrorAlert !== null? true : null} onRequestClose={()=>{setChargeCardErrorAlert(null)}} presentationStyle='overFullScreen' transparent={true}>
                   <StatusBar style="light" backgroundColor="rgba(0,0,0,0.5)"/>
                    <View style={{flex: 1, ...styles.userProfileAlertContainer}}>
                            <View style={styles.userProfileSuccessAlert}>
                                    <MaterialIcons name="error" size={40} color="red" style={{marginBottom: 10}}/>
                                    <Text style={{color:"red", ...styles.errorAlertLabel}}>{chargeCardErrorAlert == 'Declined'? 'Card Declined!' : chargeCardErrorAlert == 'Token Not Generated'? 'Token Not Generated!' : chargeCardErrorAlert == 'A transaction is currently processing, please wait till it concludes before attempting a new charge.'? 'Payment Timeout!' : chargeCardErrorAlert == 'Unknown server response'? 'Unknown error!': chargeCardErrorAlert == 'Insufficient funds'? 'Insufficient Funds' : chargeCardErrorAlert == 'Incorrect PIN'? 'Incorrect PIN' : chargeCardErrorAlert == 'Verify'? 'Error Verifying Card' : chargeCardErrorAlert == 'Initialize'? 'Error Initializing Card' : chargeCardErrorAlert == 'Enter Card Details'? 'Enter Card Details' : 'An Error occurred' }</Text>
                                    <Text style={styles.errorAlertDescText}>{chargeCardErrorAlert == 'Declined'? 'Your card was declined, please check the card information entered or contact your bank for assistance.' : chargeCardErrorAlert == 'Token Not Generated'? 'Unable to generate payment token at this time. Please try again later or contact your bank for assistance.' : chargeCardErrorAlert == 'A transaction is currently processing, please wait till it concludes before attempting a new charge.'? 'A transaction is currently processing, please wait till it concludes before attempting a new charge.' : chargeCardErrorAlert == 'Unknown server response'? 'Server does not support this functionality. Please try again later or contact support for assistance.': chargeCardErrorAlert == 'Insufficient funds'? 'Insufficient funds. Please ensure your account have enough funds and try again.' : chargeCardErrorAlert == 'Incorrect PIN'? 'Please verify the PIN entered and try again.' : chargeCardErrorAlert == 'Verify'? 'Please enter your correct card details to proceed and try again.' :  chargeCardErrorAlert == 'Initialize'? 'An unknown error occured while initializing your card, please check your internet connection and try again.' : chargeCardErrorAlert == 'Enter Card Details'? 'Enter your card details to proceed with payment.' : 'An unknown error occured, check your internet connection and try again later.'}</Text>
                                    <Pressable onPress={()=>{setChargeCardErrorAlert(null)}} style={{backgroundColor: 'black', ...styles.closeProfileAlert}}>
                                        <Text style={styles.closeAlertText}>OK</Text>
                                    </Pressable>
                                </View>
                    </View>
            </Modal>
           
              <Modal visible={showProfileAlert} onRequestClose={()=>{dispatch(dontShowProfileAlert())}} presentationStyle='overFullScreen' transparent={true}>
                   <StatusBar style="light" backgroundColor="rgba(0,0,0,0.5)"/>
                    <View style={{ flex: 1, ...styles.profileAlertContainer}}>
                    <View style={{backgroundColor:"white", padding: 20, borderRadius: 10}}>
                            <View style={{flexDirection:'row', alignItems:'center'}}>
                                    <AntDesign onPress={()=>{dispatch(dontShowProfileAlert())}} name="close" size={20} color="black"/>
                                    <Text style={{...styles.createProfileText, alignSelf:'center', flex: 1}}>Create your profile</Text>
                            </View>
                            <View style={{alignItems:'center', marginVertical: 10, paddingHorizontal: 30}}>
                                    <Image source={require('../../../assets/profile_pic.png')} style={styles.image}/>
                                        <View style={styles.alignContainer}> 
                                                        <Text style={styles.infoDescText}>Tell others about yourself</Text>
                                                        <Entypo name="edit" size={18} color="#F52F57" onPress={()=>{dispatch(dontShowProfileAlert()); navigation.navigate('Profile')}}/>
                                        </View>
                                    </View>
                           </View>
                    </View>
              </Modal>
            
        </GestureHandlerRootView>
     )
  }
    return(
        <GestureHandlerRootView style={styles.container}>
           { changeStatus && <StatusBar style="dark" backgroundColor="#F5F5F5" />}
            <View style={styles.paymentNotificationLabel}>
                <Text style={{...styles.paymentLabel, marginRight:'auto'}}>Payments</Text>
               {userCardFound? <Pressable onPress={()=>{navigation.navigate('cardInfo')}} style={styles.alignContainer}>
                    <Text style={styles.cardText}>My Card</Text> 
                    <FontAwesome6 name="credit-card" size={18} color="black"/>
                </Pressable> : <Pressable onPress={()=>{setInfo(true)}} style={styles.alignContainer}>
                    <Text style={styles.cardText}>Add Card</Text> 
                    <FontAwesome6 name="credit-card" size={18} color="black"/>
                </Pressable>}
            </View>
            <View style={styles.paymentNotificationListCont}>
                <FlatList showsVerticalScrollIndicator={false} data={paidApartments} renderItem={({item})=>{
                       if(item.type=='CARD'){
                            return(
                                <Pressable onPress={()=>{navigation.navigate('Receipt', { payment : item })}} style={styles.cardPaymentNotification} key={item.id}>
                                    <View style={styles.alignContainer}>
                                        <FontAwesome6 name="credit-card" size={18} color="#FF0000" style={{marginRight: 20}}/>
                                        <Text style={styles.paymentNotificationLabelText}>Card verification successful</Text>
                                    </View>
                                    <View style={{marginVertical: 10}}>
                                        <Text style={styles.paymentNotificationText}>You have completed your card verification at <FontAwesome6 name="naira-sign" size={12} color="black" /><Text style={{fontWeight:'600'}}>{item.price}</Text> charge. This fee will be discounted from your next payment on the App</Text>
                                    </View>
                                    <View style={styles.actionContainer}>
                                        <Text style={{color:'#4C4C4C'}}>{item.date}</Text>
                                        <View style={styles.alignContainer}>
                                            <Text style={{color:'#FF0000', fontSize: 12}}>View</Text>
                                            <Ionicons name="chevron-forward" size={14} color="#FF0000"/>
                                        </View>
                                    </View>
                                </Pressable>
                                
                            )
                       }else{
                        return(
                            <Pressable onPress={()=>{navigation.navigate('Receipt', { payment : item, dbUser : item.User, apartment: item.Apartment, hostData: item.Host})}} style={styles.cardPaymentNotification} key={item.id}>
                                   <View style={styles.alignContainer}>
                                        <MaterialIcons name="apartment" size={20} color="#FF0000" style={{marginRight:10}}/>
                                        <Text style={styles.paymentNotificationLabelText}>Apartment payment successful</Text>
                                   </View>
                                   <View style={{marginVertical: 10}}>
                                      <Text style={styles.paymentNotificationText}>Your apartment payment of <FontAwesome6 name="naira-sign" size={12} color="black" /><Text style={styles.apartmentPriceText}>{ formatPriceToString(item.price)}</Text> is successful. Enjoy your stay and thank you for choosing StayLit.</Text>
                                   </View>
                                   <View style={{...styles.alignContainer, justifyContent:'space-between'}}>
                                        <Text style={{color:'#4C4C4C'}}>{item.date}</Text>
                                        <Text onPress={()=>{navigation.navigate('ApartmentsDetails', {payment: item, apartment: item.Apartment, hostData: item.Host, mod : 'main'})}} style={styles.reviewText}>Review</Text>
                                        <View style={styles.alignContainer}>
                                            <Text style={{color:'#FF0000', fontSize: 12}}>View</Text>
                                            <Ionicons name="chevron-forward" size={14} color="#FF0000"/>
                                        </View>
                                    </View>
                                </Pressable>
                        )
                       }
                }}/>
            </View>
           {(!userCardFound && info) &&  <View style={{...StyleSheet.absoluteFillObject}}>
           <View style={{flex: 1, backgroundColor: processing? null : 'rgba(0,0,0,0.5)'}}></View>
            <BottomSheet ref={bottomSheetRef} index={0} snapPoints={bottomSheetIndex? ['90%'] : ['70%']} handleStyle={processing? styles.bottomSheetHandleStyle : null} handleIndicatorStyle={{display: 'none'}}>
                 {processing? <StatusBar style="dark" backgroundColor="#FAFAFA"/> : <StatusBar style="light" backgroundColor="rgba(0,0,0,0.5)"/> }
                  <View style={styles.chargeCardContainer}>
                        <ChargeCard paidApartments={paidApartments} setChargeCardErrorAlert={setChargeCardErrorAlert} setBottomSheetIndex={setBottomSheetIndex} closeBtn={true} dontShowReceipt={dontShowReceipt} setInfo={setInfo} setProcessing={setProcessing} processing={processing}/>
                  </View>
                       { processing && <View style={{...StyleSheet.absoluteFillObject, ...styles.processingContainer}}>
                            <View style={{alignItems:'center'}}>
                                <ActivityIndicator size='large' color='red'/>
                                <Text style={styles.processingText}>processing...</Text>
                            </View>
                        </View>}
            </BottomSheet>
            </View>}
           
            <Modal visible={chargeCardErrorAlert !== null? true : null} onRequestClose={()=>{setChargeCardErrorAlert(null)}} presentationStyle='overFullScreen' transparent={true}>
               { changeStatus && <StatusBar style="light" backgroundColor="rgba(0,0,0,0.5)"/>}
                <View style={{flex: 1, ...styles.userProfileAlertContainer}}>
                        <View style={styles.userProfileSuccessAlert}>
                                <MaterialIcons name="error" size={40} color="red" style={{marginBottom: 10}}/>
                                <Text style={{color:"red", ...styles.errorAlertLabel}}>{chargeCardErrorAlert == 'Declined'? 'Card Declined!' : chargeCardErrorAlert == 'Token Not Generated'? 'Token Not Generated!' : chargeCardErrorAlert == 'A transaction is currently processing, please wait till it concludes before attempting a new charge.'? 'Payment Timeout!' : chargeCardErrorAlert == 'Unknown server response'? 'Unknown error!': chargeCardErrorAlert == 'Insufficient funds'? 'Insufficient Funds' : chargeCardErrorAlert == 'Incorrect PIN'? 'Incorrect PIN' : chargeCardErrorAlert == 'Verify'? 'Error Verifying Card' : chargeCardErrorAlert == 'Initialize'? 'Error Initializing Card' : chargeCardErrorAlert == 'Enter Card Details'? 'Enter Card Details' : 'An Error occurred' }</Text>
                                <Text style={styles.errorAlertDescText}>{chargeCardErrorAlert == 'Declined'? 'Your card was declined, please check the card information entered or contact your bank for assistance.' : chargeCardErrorAlert == 'Token Not Generated'? 'Unable to generate payment token at this time. Please try again later or contact your bank for assistance.' : chargeCardErrorAlert == 'A transaction is currently processing, please wait till it concludes before attempting a new charge.'? 'A transaction is currently processing, please wait till it concludes before attempting a new charge.' : chargeCardErrorAlert == 'Unknown server response'? 'Server does not support this functionality. Please try again later or contact support for assistance.': chargeCardErrorAlert == 'Insufficient funds'? 'Insufficient funds. Please ensure your account have enough funds and try again.' : chargeCardErrorAlert == 'Incorrect PIN'? 'Please verify the PIN entered and try again.' : chargeCardErrorAlert == 'Verify'? 'Please enter your correct card details to proceed and try again.' :  chargeCardErrorAlert == 'Initialize'? 'An unknown error occured while initializing your card, please check your internet connection and try again.' : chargeCardErrorAlert == 'Enter Card Details'? 'Enter your card details to proceed with payment.' : 'An unknown error occured, check your internet connection and try again later.'}</Text>
                                <Pressable onPress={()=>{setChargeCardErrorAlert(null)}} style={{backgroundColor: 'black', ...styles.closeProfileAlert}}>
                                    <Text style={styles.closeAlertText}>OK</Text>
                                </Pressable>
                            </View>
                </View>
            </Modal>
        </GestureHandlerRootView>
    )
}

export default Payments

const styles = StyleSheet.create({
    container : {
        flex: 1, 
        backgroundColor:'#F5F5F5'
    },
    paymentLabel: {
        fontSize: 25, 
        fontWeight:'600'
    },
    paymentNotificationLabelText: {
        fontSize: 16, 
        fontWeight: '600'
    },
    bottomSheetHandleStyle: {
        backgroundColor: 'rgba(0,0,0,0.5)', 
        borderTopLeftRadius: 15, 
        borderTopRightRadius: 15
    },
    chargeCardContainer: {
        flex: 1, 
        paddingHorizontal: 20, 
        backgroundColor:'white'
    },
    processingContainer: {
        backgroundColor:'rgba(0,0,0,0.5)', 
        flex: 1, 
        alignItems:'center', 
        justifyContent:'center'
    },
    processingText: {
       color:'white', 
       fontWeight:'500'
    }, 
    paymentNotificationText: {
        fontSize: 14, 
        lineHeight: 22,
        textAlign:'auto'
    },
    profileAlertContainer: {
        backgroundColor: 'rgba(0,0,0,0.5)', 
        justifyContent:"center", 
        alignItems:'center'
    },
    profileAlertCont: {
        backgroundColor:"white", 
        padding: 50, 
        justifyContent:"center", 
        alignItems:'center', 
        borderRadius: 10
    },
    alignContainer: {
        flexDirection:'row', 
        alignItems:"center" 
    },
    actionContainer: {
        flexDirection:'row', 
        alignItems:'center', 
        justifyContent:'space-between'
    },
    createProfileText: {
        fontSize: 20, 
        fontWeight: '500', 
        marginLeft:10, 
        textAlign:'center'
    },
    cardPaymentNotification: {
        marginBottom: 20, 
        padding: 15, 
        backgroundColor:'white', 
        borderRadius: 10,
        width:'100%'
    },
    image: {
        width: 150, 
        height: 150, 
        borderRadius: 150, 
        marginVertical: 15
    },
    infoDescText: {
        fontWeight: '500', 
        color:'#4C4C4C', 
        fontSize: 16, 
        marginRight: 5
    },
    paymentNotificationLabel: {
        padding: 20, 
        flexDirection:'row', 
        alignItems:'center'
    },
    cardText: {
        marginRight: 5, 
        fontWeight:'500'
    },
    paymentNotificationListCont: {
        flex: 1, 
        padding: 20
    },
    apartmentPriceText: {
        fontSize: 14, 
        fontWeight: '500'
       },
       reviewText: {
        borderWidth: 2, 
        borderColor:'#FF0000', 
        padding: 2, 
        textAlign:'center', 
        borderRadius: 5,
        fontSize: 12
       },
    userProfileAlertContainer: {
        backgroundColor:'rgba(0,0,0,0.5)', 
        justifyContent:'center',
         alignItems:"center"
    },
    userProfileSuccessAlert: {
        padding: 20, 
        backgroundColor:'white', 
        borderRadius: 20, 
        elevation: 5, 
        alignItems: 'center',
        width:'70%'
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
    closeProfileAlert: {
        paddingHorizontal: 15,
        paddingVertical: 10, 
        borderRadius: 5
    },
    closeAlertText: {
        color:'white', 
        fontWeight: '600', 
        fontSize: 14
    }
   
})