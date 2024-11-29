import { useState, useRef, useEffect } from 'react'
import { View, Text, Pressable, Image, ScrollView, StyleSheet, Keyboard, ActivityIndicator, Modal, useWindowDimensions } from 'react-native'
import { AntDesign, FontAwesome5, Ionicons, FontAwesome6, MaterialIcons, Entypo } from '@expo/vector-icons'
import { useRoute, useNavigation } from '@react-navigation/native'
import { GestureHandlerRootView, ScrollView as BottomSheetScrollView } from 'react-native-gesture-handler'
import { DataStore } from 'aws-amplify/datastore'
import { HostAccount, Payment, PaymentHistory, Apartment, RentStatus, ObservePayment, ObserveHostPayment, TotalViews } from '../../models';
import BottomSheet from '@gorhom/bottom-sheet'
import ChargeCard from './chargeCard'
import RNPaystack from 'react-native-paystack';
import Receipt from '../Receipt'
import { useUserAuthContext } from '../../Context/userContext'
import { StatusBar } from 'expo-status-bar'
import { useSelector, useDispatch } from 'react-redux'
import { fetchPaidApartments } from '../../Redux/paymentHistory/paymentActions'
import { fetchObservePayment } from '../../Redux/observePayment/observePaymentActions.js'
RNPaystack.init({ publicKey: 'pk_test_82cc4bc2961c68a65cbc3085eb9d12623d93fcba'});
   
const PaymentDetails = () => {
    const userCardFound = useSelector(state => state.card.userCardFound)
    const theObservePayment = useSelector(state => state.observePayment.observePayment)
    const dispatch = useDispatch()
    const route = useRoute() // route object for data transmission between screens
    const { apartment, hostData, totalAptView, wishlistIcon, apartmentImages, starReview, totalRevLength, dbUser } = route.params // destructures data received from the route object
    const bottomSheetRef = useRef() // reference to the bottomsheet
    const [info, setInfo] = useState(null) // controls the bottomsheet visibility and content (null = hidden, true = visible)
    const navigation = useNavigation() // navigation object for transition between screens
    const [subAccount, setSubAccount] = useState(null) // stores apartment host subaccount
    const [processing, setProcessing] = useState(false) // controls visibility of the processing loading indicator (true = visible, false = hidden)
    const [chargingCard, setChargingCard] = useState(false) // controls visibility of the charging card loading indicator (true = visible, false = hidden)
    const [amount, setAmount] = useState((5/100 * apartment.moveInCostInt) + apartment.moveInCostInt + (((1.5/100 * apartment.moveInCostInt) + 100)>=2000? 2000 : (1.5/100 * apartment.moveInCostInt) + 100)) // stores apartment price
    const [showReceipt, setShowReceipt] = useState(false) // controls visibilty of the payment receipt once payment is successfully completed (true= visible, false = hidden)
    const [payment, setPayment] = useState(null) // stores payment object
    const [chargeCardErrorAlert, setChargeCardErrorAlert] = useState(null) // controls visibility of charge card error alerts (true = visible, null = hidden)
    const [bottomSheetIndex, setBottomSheetIndex] = useState(false) // controls bottom sheet index position (true = index 1, false= index 0)
    const [uniqueViews, setUniqueViews] = useState(null)
    const { width, height} = useWindowDimensions()
   
    useEffect(()=>{
      if(apartment){
        getUniqueViewsCount()
      }
    }, [apartment])

    const getUniqueViewsCount = async ()=>{
        const aprtment = await DataStore.query(Apartment, (a)=> a.id.eq(apartment.id))
        console.log('Unique Views : ', aprtment[0].uniqueViewCount)
        setUniqueViews(aprtment[0].uniqueViewCount)
    }
  
    // Call getHostSubAccount on component mount
    useEffect(()=>{
        getHostSubAccount()
    }, [])

   //  Retrieves and sets the sub-account ID for an apartment's host
  const getHostSubAccount = async ()=>{
    console.log('apartment HostId : ',  apartment.hostID) 
    // Query the backend database via datastore for the HostAccount model, filtering by the host ID of the apartment
    const getHostSubAccountId = await DataStore.query(HostAccount, (h)=> h.hostID.eq(apartment?.hostID))
    console.log('getHostSubAccountId Arr : ', getHostSubAccountId)
    // Log the sub-account ID from the host account result
    console.log('subAccountID : ', getHostSubAccountId[0]?.subaccountCode)
     // Set the sub-account ID of the apartment's host, to the state using setSubAccount
    setSubAccount(getHostSubAccountId[0]?.subaccountCode)
  }

  // Converts a numeric value to a string formatted with commas for every 3 digits.
    const formatPriceToString = (val) => {
        // Convert val to a number if it's not already
        const numberVal = Number(val);
    
        // Check if numberVal is a valid number
        if (isNaN(numberVal)) {
            return val; // Return the original value if it's not a number
        }
    
        // Format numberVal with commas for every 3 digits
        const formattedVal = numberVal.toLocaleString('en-US');
    
        return formattedVal;  // Return the formatted string
    }

    // Updates or creates ObserveHostPayment in the backend database via datastore
    const saveObserveHostPayment = async()=>{
      // Query the DataStore to find an ObserveHostPayment record matching the host ID
      const getObserveHostPaymentObj = await DataStore.query(ObserveHostPayment, (o)=> o.hostID.eq(hostData.id))
      console.log('getObserveHostPaymentObj : ', getObserveHostPaymentObj[0])
      // If a matching ObserveHostPayment object exists
      if(getObserveHostPaymentObj[0]){
        // Update the existing object, setting newPayment to true and updating the host ID
        const saveObserveHostPaymentObj = await DataStore.save(ObserveHostPayment.copyOf(getObserveHostPaymentObj[0], (updated)=>{
          updated.newPayment = true,
          updated.hostID = hostData.id
       }))
       console.log('saveObserveHostPaymentObj : ', saveObserveHostPaymentObj)
      }else{
        // If no matching object exists, create a new ObserveHostPayment object
        const saveObserveHostPaymentObj = await DataStore.save( new ObserveHostPayment({
          newPayment: true,
          hostID: hostData.id
       }))
       console.log('saveObserveHostPaymentObj : ', saveObserveHostPaymentObj)
      }
       
    }

    // Updates ObservePayment object associated with the current user.
    const saveObservePayment = async ()=>{
      // Query the database via DataStore to find an ObservePayment record matching the user's ID
        const getObservePaymentObj = await DataStore.query(ObservePayment, (o)=> o.userID.eq(dbUser.id))
        console.log('getObservePaymentObj : ', getObservePaymentObj[0])
        // If a matching ObservePayment object exists
        if(getObservePaymentObj[0]){
          // Update the existing object, setting newPayment to true and updating the host ID
            const observePaymentObj = await DataStore.save(ObservePayment.copyOf(getObservePaymentObj[0], (updated)=>{
              updated.discount = false,
              updated.newPayment = true
       }))
       console.log('observePaymentObj updated : ', observePaymentObj)
       // Update observePayment in state
       dispatch(fetchObservePayment(observePaymentObj))
        }
   }
  
   // Saves a payment for an apartment to PaymentHistory record in the database via datastore
   const SavePaymentHistory = async (paymentDate, reference)=>{
    // Save a new PaymentHistory record 
    const paymentObj = await DataStore.save(new PaymentHistory({
      price: theObservePayment.discount? ( amount - 50 ): amount,
      hostID: hostData.id,
      apartmentID: apartment.id,
      userID: dbUser.id,
      LeotServiceFee: theObservePayment.discount? ((5/100 * apartment.moveInCostInt) - 50) : (5/100 * apartment.moveInCostInt),
      HostIncome: apartment.moveInCostInt,
      date: paymentDate,
      status: 'SUCCESS',
      type: 'APARTMENT',
      reference: reference,
      User: dbUser,
      Host: hostData,
      Apartment: apartment,
      TotalViews: totalAptView,
      UniqueViews: uniqueViews
    }))
    console.log('Apartment payment successful : ', paymentObj)
    // Query all payment history records for the current user
    const getAllPaidApt = await DataStore.query(PaymentHistory, (p)=> p.userID.eq(dbUser.id))
    console.log('getAllPaidApt : ', getAllPaidApt)
    // Updates the state UI
    setChargingCard(false)
    dispatch(fetchPaidApartments(getAllPaidApt))
    saveObservePayment()
    saveObserveHostPayment()
    setPayment(paymentObj)
    setShowReceipt(true)
    updateAptStatusToPaid()
   }

// Save payment for an apartment to the Payment record in the database via datastore
    const SavePayment = async (paymentDate, reference)=>{
      // Save payment
      const paymentObj = await DataStore.save(new Payment({
        price: theObservePayment.discount? ( amount - 50 ): amount,
        hostID: hostData.id,
        apartmentID: apartment.id,
        userID: dbUser.id,
        LeotServiceFee: theObservePayment.discount? ((5/100 * apartment.moveInCostInt) - 50) : (5/100 * apartment.moveInCostInt),
        HostIncome: apartment.moveInCostInt,
        date: paymentDate,
        status: 'SUCCESS',
        type: 'APARTMENT',
        reference: reference,
        User: dbUser,
        Host: hostData,
        Apartment: apartment
      }))
      console.log('Apartment payment successful : ', paymentObj)
      // Save payment to payment history
      SavePaymentHistory(paymentDate, reference)
  }

  // Updates the status of a specific apartment to 'PAID' in the database via DataStore.
    const updateAptStatusToPaid = async()=>{
      // Query the database via datastore to find the apartment object by its ID
        const aptObj = await DataStore.query(Apartment, (a)=> a.id.eq(apartment.id))
        // Update the status of the apartment to 'PAID'
        const updateAptStatus = await DataStore.save(Apartment.copyOf(aptObj[0], (updated)=>{
            updated.status = RentStatus.PAID
        }))
        console.log('updateAptStatus : ', updateAptStatus)
    }

    // Charges a saved authorized card using the Paystack
    const chargeSavedAuthorizedCard = (card)=>{
    // Define parameters for charging the card
     const cardParams = {
      cardNumber: card.cardNumber, 
      expiryMonth: card.authorization.exp_month, 
      expiryYear: card.authorization.exp_year, 
      cvc: card.cardCVV,
      email: dbUser.email,
      amountInKobo: theObservePayment.discount? ( amount - 50 ) * 100 : amount * 100,
      subAccount: subAccount,
      transactionCharge: !(theObservePayment.discount)? ((5/100 * apartment.moveInCostInt) + (((1.5/100 * apartment.moveInCostInt) + 100)>=2000? 2000 : (1.5/100 * apartment.moveInCostInt) + 100)) * 100 : (((5/100 * apartment.moveInCostInt) + (((1.5/100 * apartment.moveInCostInt) + 100)>=2000? 2000 : (1.5/100 * apartment.moveInCostInt) + 100)) - 50 ) * 100
     }

    // Charge the card using RNPaystack chargeCard function
	RNPaystack.chargeCard(cardParams)
	.then(response => {
	  console.log('Card Charge Success', response); // card charged successfully, get reference here
    // Get the current date and time
    const date = new Date()
    const currentDate_time = date.toLocaleString('en-US', {
      hour12: true})
    console.log('date of transaction : ', currentDate_time)
     // Call SavePayment function with the current date and transaction reference
    SavePayment(currentDate_time, response.reference)
  })
	.catch(e => {
      // If an error occurs during charging, log the error
      console.log('Error charging card : ', e)
      setChargingCard(false)
      // Handle different error messages and set appropriate alert messages
     if(e.message.includes('Token Not Generated')){
       setChargeCardErrorAlert('Token Not Generated')
     }
     else if(e.message == 'A transaction is currently processing, please wait till it concludes before attempting a new charge.'){
       setChargeCardErrorAlert('A transaction is currently processing, please wait till it concludes before attempting a new charge.')
     }
     else if(e.message.includes('Unknown server response')){
       setChargeCardErrorAlert('Unknown server response')
     }
     else if(e.message.includes('Insufficient funds')){
       setChargeCardErrorAlert('Insufficient funds')
     }
     else if(e.message.includes('Incorrect PIN')){
       setChargeCardErrorAlert('Incorrect PIN')
     }
     else{
       setChargeCardErrorAlert(true)
     }
   })
 }

 // Handles card charging process
    const payForApartment = ()=>{
      // if card is not added
        if(!userCardFound){
          // alert to add card
          setChargeCardErrorAlert('Add Card')
        }else{
            
            setChargingCard(true) // shows charging card loading indicator
            // Charge card
            chargeSavedAuthorizedCard(userCardFound)
        }
    }

    // Navigates to cardInfo screen
    const navigateToCardDetails = ()=>{
        navigation.navigate('cardInfo', { apartment, hostData, apartmentImages, starReview, totalRevLength})
    }

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

   
    return (
     <GestureHandlerRootView style={styles.container}>
      <StatusBar style="dark" backgroundColor="white"/>
       <View style={{ ...styles.alignContainer, padding: 20}}>
                <AntDesign onPress={()=>{navigation.goBack()}} name="arrowleft" size={24} color="black" style={{ marginRight: 30 }} />
                <Text style={styles.confirmPayText}>Proceed with Payment</Text>
            </View>
        <ScrollView contentContainerStyle={{paddingHorizontal: 20}} showsVerticalScrollIndicator={false}>
       
          <View style={styles.apartmentData}>
            <View style={styles.alignContainer}>
                <Image source={{ uri: apartmentImages }} style={styles.apartmentImage} />
                <View>
                    <Text style={{...styles.apartmentTitle, width: 60/100 * width}}>{apartment.apartmentTitle}</Text>
                    <Text style={{ marginVertical: 5, color:'#4C4C4C', fontWeight:'500', }}>{apartment.shareStatus} apartment</Text>
                    <Text style={{color:'#4C4C4C', fontWeight:'500'}}>Listed by: </Text>
                    <View style={styles.alignContainer}>
                        <View style={{ ...styles.alignContainer, marginRight: 20 }}>
                            <FontAwesome5 name="house-user" size={16} color="#4C4C4C" style={{ marginRight: 5 }} />
                            <Text style={{color:'#4C4C4C', fontWeight:'500', width: 50/100 * width}}>{hostData?.name}</Text>
                        </View>
                    </View>
                </View>
            </View>
          </View>
          <View style={styles.seperatorContainer}></View>
           <View style={{paddingVertical: 20}}>
                <Text style={styles.labelHeader}>Price details</Text>
                <View style={styles.alignRentContainer}>
                    <View style={{width:'55%'}}>
                        <Text style={{fontSize: 15}}>Move-in fee</Text>
                        <Text style={{fontSize:14, color:'#4C4C4C'}}>Move-in cost includes the initial rent, security deposit, and fees needed to secure and begin your rental</Text>
                    </View>
                   <View style={styles.alignContainer}>
                   <FontAwesome6 name="naira-sign" size={12} color="black" />
                   <Text style={{fontSize: 15}}>{apartment.moveInCost} x (1st {apartment.leaseDuration.replace('ly', '')})</Text>
                   </View>
               
                  
                </View>
                <View style={styles.alignServiceFeeCont}>
                    <Text style={{fontSize: 15}}>StayLit Service Fee (5%)</Text>
                    <View style={styles.alignContainer}>
                        <FontAwesome6 name="naira-sign" size={12} color="black" />
                        <Text style={{fontSize: 15}}>{formatPriceToString((5/100 * apartment.moveInCostInt))}</Text>
                    </View>
                </View>
                <View style={styles.alignServiceFeeCont}>
                    <Text style={{fontSize: 15}}>Payment processing fee</Text>
                    <View style={styles.alignContainer}>
                        <FontAwesome6 name="naira-sign" size={12} color="black" />
                        <Text style={{fontSize: 15}}>{formatPriceToString(((1.5/100 * apartment.moveInCostInt) + 100)>=2000? 2000 : (1.5/100 * apartment.moveInCostInt) + 100)}</Text>
                    </View>
                </View>
                {theObservePayment?.discount && <View style={styles.alignServiceFeeCont}>
                   <Text style={{fontSize: 15}}>Discount</Text>
                   <View style={styles.alignContainer}>
                      <FontAwesome6 name="naira-sign" size={12} color="black" />
                      <Text style={{fontSize : 14}}>50</Text>
                   </View>
                </View>}
              <View style={styles.totalPriceContainer}>
                <Text style={styles.textSize}>Total (NGN)</Text>
                <View style={styles.alignContainer}>
                <FontAwesome6 name="naira-sign" size={12} color="black" />
                <Text style={styles.textSize}>{theObservePayment?.discount? formatPriceToString((apartment.moveInCostInt + ((5 * apartment.moveInCostInt)/100) + (((1.5/100 * apartment.moveInCostInt) + 100)>=2000? 2000 : ((1.5/100 * apartment.moveInCostInt) + 100)))  - 50) : formatPriceToString(apartment.moveInCostInt + ((5 * apartment.moveInCostInt)/100) + (((1.5/100 * apartment.moveInCostInt) + 100)>=2000? 2000 : ((1.5/100 * apartment.moveInCostInt) + 100)))}</Text>
                </View>
              </View>
              <Pressable onPress={()=>{setInfo('info')}} style={{alignSelf:'flex-end'}}>
              <Text style={{...styles.textSize, textDecorationLine:'underline'}}>More info</Text>
              </Pressable>
           </View>

           <View style={styles.seperatorContainer}></View>
           <View style={{paddingVertical: 20}}>
           
            {
            userCardFound?
            <View>
             <Text style={styles.labelHeader}>Your card</Text>
             <View style={styles.alignContainer}>
             <View style={{marginRight: 20}}>
                 {userCardFound?.authorization.card_type == 'mastercard ' && <Image source={require('../../../assets/mastercard.png')} style={styles.cardTypeImage}/>}
                  {userCardFound?.authorization.card_type == 'visa ' && <Image source={require('../../../assets/visa.png')} style={{...styles.cardTypeImage, marginHorizontal: 10}}/>}
                  {userCardFound?.authorization.card_type == 'verve ' && <Image source={require('../../../assets/verve.png')} style={styles.cardTypeImage}/>}
                </View>
                 <View style={{marginRight: 'auto'}}>
                   <Text style={{...styles.textSize, marginBottom: 5}}>{userCardFound?.cardOwnerName}</Text> 
                   <Text style={styles.textSize}>**** **** **** {userCardFound?.authorization.last4}</Text>
                   <Text style={styles.textSize}>{`${userCardFound?.authorization.exp_month}/${userCardFound?.authorization.exp_year[2]}${userCardFound?.authorization.exp_year[3]}`}</Text>
                 </View>
                 <Pressable onPress={navigateToCardDetails} style={styles.addCard}>
                        <AntDesign name="arrowright" size={25} color="#4C4C4C" />
                </Pressable>
             </View>
            </View>
               : <>
                <Text style={styles.labelHeader}>Pay With</Text>
               <View style={{...styles.alignContainer, justifyContent:'space-between'}}>
                <Text style={{fontSize: 15}}>Payment method</Text>
                <Text onPress={()=>{setInfo('add')}} style={styles.addText}>Add</Text>
               </View>
               <View style={styles.alignContainer}>
                  <Image source={require('../../../assets/mastercard.png')} style={styles.cardTypeImage}/>
                  <Image source={require('../../../assets/visa.png')} style={{...styles.cardTypeImage, marginHorizontal: 10}}/>
                  <Image source={require('../../../assets/verve.png')} style={styles.cardTypeImage}/>
               </View>
                </>
            }
           </View>
          <View style={styles.seperatorContainer}></View>
           <View style={{paddingVertical: 20}}>
              <Text style={styles.labelHeader}>Refund policy</Text>
              <Text style={{fontSize: 14, color:'#4C4C4C'}}>Please be advised that once payment has been made for an apartment on the app, no refunds will be issued under any circumstances. <Text style={{fontWeight: '600', textDecorationLine:'underline', color:'#4C4C4C'}} onPress={()=>{setInfo('learn_more')}}>Learn more</Text></Text>
           </View>
           <View style={styles.seperatorContainer}></View>
           <View style={{paddingVertical: 20}}>
              <Text style={{fontSize: 14, color:'#4C4C4C'}}>By clicking the "Pay" button, you agree to our <Text onPress={()=>{navigation.navigate('TermsAndConditions')}} style={{textDecorationLine:'underline', color:'#4C4C4C', fontWeight:'600'}}>Terms and Conditions</Text>, payment terms, including our refund policy.</Text>
             
           </View>
        </ScrollView>
        <Pressable onPress={payForApartment} style={styles.payBtn}>
                <Text style={styles.payBtnText}>Pay </Text>
                <FontAwesome6 name="naira-sign" size={14} color="white" />
                <Text style={styles.payBtnText}>{theObservePayment?.discount? formatPriceToString((apartment.moveInCostInt + ((5 * apartment.moveInCostInt)/100) + (((1.5/100 * apartment.moveInCostInt) + 100)>=2000? 2000 : ((1.5/100 * apartment.moveInCostInt) + 100)))  - 50) : formatPriceToString(apartment.moveInCostInt + ((5 * apartment.moveInCostInt)/100) + (((1.5/100 * apartment.moveInCostInt) + 100)>=2000? 2000 : ((1.5/100 * apartment.moveInCostInt) + 100)))}</Text>
              </Pressable>
        
              {showReceipt && <Receipt setShowReceipt={setShowReceipt} showReceipt={showReceipt} dbUser={dbUser} apartment={apartment} hostData={hostData} payment={payment} wishlistIcon={wishlistIcon}/>}

       { ((info=='info' || info == 'add' || info == 'learn_more') && !processing) && <Pressable onPress={()=>{setInfo(null)}} style={{...StyleSheet.absoluteFillObject, backgroundColor:'rgba(0,0,0,0.5)'}}></Pressable>}
       { (info == 'info' || info == 'add' || info == 'learn_more') && <BottomSheet ref={bottomSheetRef} index={0} snapPoints={bottomSheetIndex? ['90%'] : ['70%']} handleStyle={processing? styles.bottomSheetHandleStyle : null} handleIndicatorStyle={{display: 'none'}}>
                                    <StatusBar style="light" backgroundColor="rgba(0,0,0,0.5)"/>
                                   { info == 'info' || info == 'learn_more'? <View style={{flex: 1, paddingHorizontal: 20}}>
                                        { info == 'info'? <>
                                         <View style={styles.priceDetailsHeader}>
                                                <AntDesign name="close" size={20} color="black" style={{marginRight: 20}} onPress={()=>{setInfo(null)}}/>
                                                <Text style={styles.priceDetailsText}>Price Details</Text>
                                        </View>
                                    <View style={styles.priceDetailsInfoCont}>
                                            <View style={{...styles.alignContainer, justifyContent:"space-between"}}>
                                                    <View style={{width:'55%'}}>
                                                        <Text style={styles.textSize}>Move-in fee</Text>
                                                        <Text>Move-in cost includes the initial rent, security deposit, and fees needed to secure and begin your rental</Text>
                                                    </View>
                                                    <View style={styles.alignContainer}>
                                                        <FontAwesome6 name="naira-sign" size={14} color="black" />
                                                        <Text style={{fontSize: 16}}>{apartment.moveInCost} &#8226; 1st {apartment.leaseDuration.replace('ly', '')}</Text>
                                                    </View>
                                                
                                                </View>
                                                <View style={{...styles.alignContainer, justifyContent:'space-between'}}>
                                                    <View style={{width: '65%'}}>
                                                        <Text style={styles.textSize}>StayLit service fee(5%)</Text>
                                                        <Text style={styles.feeDescText}>This helps us run our platform and offer services like 24/7 support on the platform</Text>
                                                    </View>
                                                    <View style={styles.alignContainer}>
                                                        <FontAwesome6 name="naira-sign" size={14} color="black" />
                                                        <Text style={{fontSize: 16}}>{formatPriceToString((5 * apartment.moveInCostInt)/100)}</Text>
                                                    </View>
                                                
                                                </View>

                                                <View style={{...styles.alignContainer, justifyContent:'space-between'}}>
                                                    <View style={{width: '65%'}}>
                                                        <Text style={styles.textSize}>Payment processing fee</Text>
                                                        <Text style={styles.feeDescText}>A processing fee ensures secure, reliable payment handling, covering verification and security costs.</Text>
                                                    </View>
                                                    <View style={styles.alignContainer}>
                                                        <FontAwesome6 name="naira-sign" size={14} color="black" />
                                                        <Text style={{fontSize: 16}}>{formatPriceToString(((1.5/100 * apartment.moveInCostInt) + 100)>=2000? 2000 : (1.5/100 * apartment.moveInCostInt) + 100)}</Text>
                                                    </View>
                                                
                                                </View>
                                               {theObservePayment?.discount && <View style={styles.alignServiceFeeCont}>
                                                  <Text style={{fontSize: 16}}>Discount</Text>
                                                  <View style={styles.alignContainer}>
                                                      <FontAwesome6 name="naira-sign" size={12} color="black" />
                                                      <Text>50</Text>
                                                  </View>
                                                </View>}
                                                
                                                <View style={styles.totalPriceContainer}>
                                                <View>
                                                        <Text style={styles.textSize}>Total</Text>
                                                    </View>   
                                                    <View style={styles.alignContainer}>
                                                        <FontAwesome6 name="naira-sign" size={14} color="black" />
                                                        <Text  style={styles.textSize}>{theObservePayment?.discount? formatPriceToString((apartment.moveInCostInt + ((5 * apartment.moveInCostInt)/100) + (((1.5/100 * apartment.moveInCostInt) + 100)>=2000? 2000 : ((1.5/100 * apartment.moveInCostInt) + 100)))  - 50) : formatPriceToString(apartment.moveInCostInt + ((5 * apartment.moveInCostInt)/100) + (((1.5/100 * apartment.moveInCostInt) + 100)>=2000? 2000 : ((1.5/100 * apartment.moveInCostInt) + 100)))}</Text>
                                                    </View>  
                                                    </View>
                                    </View>
                                    </> : <View style={{flex: 1}}>
                                            <View style={styles.priceDetailsHeader}>
                                                <AntDesign onPress={()=>{setInfo(null)}} name="close" size={24} color="black" style={{marginRight: 20}}/>
                                                <Text style={styles.refundPolicyText}>Refund Policy</Text>
                                            </View>
                                            <BottomSheetScrollView showsVerticalScrollIndicator={false}>
                                            <View style={{marginVertical: 15}}>
                                                <Text style={{fontSize: 15, color:'#4C4C4C', lineHeight: 25}}>Please be advised that once payment has been made for an apartment on the app, no refunds will be issued under any circumstances. Funds are immediately disbursed to the host upon payment.</Text>
                                              </View>
                                              <View style={{marginVertical: 15}}>
                                                <Text style={{fontSize: 15, color:'#4C4C4C', lineHeight: 25}}>We strongly recommend that you personally visit and inspect the apartment to ensure it meets your expectations and requirements before proceeding with any payment.</Text>
                                              </View>
                                              <View style={{marginVertical: 15}}>
                                                <Text style={{fontSize: 15, color:'#4C4C4C', lineHeight: 25}}>Your satisfaction is important to us, and verifying the property in person helps prevent any potential misunderstandings or discrepancies. Thank you for your understanding and cooperation.</Text>
                                              </View>
                                            </BottomSheetScrollView>
                                            
                                        </View>
                                    
                                   
                                
                                     }
                                     </View>
                                        : 
                                                              <View style={styles.chargeCardContainer}>
                                                                    <ChargeCard dbUser={dbUser} setInfo={setInfo} setProcessing={setProcessing} setBottomSheetIndex={setBottomSheetIndex} setChargeCardErrorAlert={setChargeCardErrorAlert}/>
                                                              </View> 
                                           
                                        }
                                  { processing && <View style={{ ...StyleSheet.absoluteFillObject, ...styles.processingContainer}}>
                                    { processing? <StatusBar style="dark" backgroundColor="white"/> : <StatusBar style="light" backgroundColor="rgba(0,0,0,0.5)"/>}
                                    <View style={{alignItems:'center'}}>
                                      <ActivityIndicator size='large' color='red'/>
                                      <Text style={styles.processingText}>processing...</Text>
                                    </View>
                                </View>}
                             
        </BottomSheet>}
        <Modal visible={chargeCardErrorAlert !== null? true : null} onRequestClose={()=>{setChargeCardErrorAlert(null)}} presentationStyle='overFullScreen' transparent={true}>
            <StatusBar style="light" backgroundColor="rgba(0,0,0,0.5)"/>
            <View style={{flex: 1, ...styles.userProfileAlertContainer}}>
                        <View style={styles.userProfileSuccessAlert}>
                                <MaterialIcons name="error" size={40} color="red" style={{marginBottom: 10}}/>
                                <Text style={{color:"red", ...styles.errorAlertLabel}}>{ chargeCardErrorAlert == 'Token Not Generated'? 'Token Not Generated!' : chargeCardErrorAlert == 'A transaction is currently processing, please wait till it concludes before attempting a new charge.'? 'Payment Timeout!' : chargeCardErrorAlert == 'Unknown server response'? 'Unknown error!': chargeCardErrorAlert == 'Insufficient funds'? 'Insufficient Funds' : chargeCardErrorAlert == 'Incorrect PIN'? 'Incorrect PIN' : chargeCardErrorAlert == 'Enter Card Details'? 'Enter Card Details' :  chargeCardErrorAlert == 'Add Card'? 'Add Card' : 'An Error occurred' }</Text>
                                <Text style={styles.errorAlertDescText}>{chargeCardErrorAlert == 'Token Not Generated'? 'Unable to generate payment token at this time. Please try again later or contact your bank for assistance.' : chargeCardErrorAlert == 'A transaction is currently processing, please wait till it concludes before attempting a new charge.'? 'A transaction is currently processing, please wait till it concludes before attempting a new charge.' : chargeCardErrorAlert == 'Unknown server response'? 'Server does not support this functionality. Please try again later or contact support for assistance.': chargeCardErrorAlert == 'Insufficient funds'? 'Insufficient funds. Please ensure your account have enough funds and try again.' : chargeCardErrorAlert == 'Incorrect PIN'? 'Please verify the PIN entered and try again.' : chargeCardErrorAlert == 'Enter Card Details'? 'Enter complete card details to proceed with your payment' : chargeCardErrorAlert == 'Add Card'? 'Add your card details to proceed with payment.' : 'An unknown error occured, check your internet connection and try again later.'}</Text>
                                <Pressable onPress={()=>{setChargeCardErrorAlert(null)}} style={{backgroundColor: 'black', ...styles.closeProfileAlert}}>
                                    <Text style={styles.closeAlertText}>OK</Text>
                                </Pressable>
                            </View>
              </View>
        </Modal>                              
       
              <Modal visible={chargingCard} onRequestClose={()=>{}} presentationStyle='overFullScreen' transparent={true}>
                    <StatusBar style="light" backgroundColor="rgba(0,0,0,0.5)"/>
                    <View style={{ flex: 1, ...styles.processingContainer}}>
                            <View style={{alignItems:'center'}}>
                              <ActivityIndicator size='large' color='red'/>
                              <Text style={styles.processingText}>charging card...</Text>
                            </View>
                  </View>
              </Modal>
              
            
    </GestureHandlerRootView>
    )
}

export default PaymentDetails

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'white'
  },
  alignContainer: {
    flexDirection: 'row', 
    alignItems: 'center'
  },
  confirmPayText: {
    fontWeight: '500', 
    fontSize: 18, 
    letterSpacing: 0.5
  },
  apartmentData: {
    paddingVertical: 15
  },
  apartmentImage: {
    width: 100, 
    height: 100, 
    borderRadius: 10, 
    marginRight: 20
  },
  apartmentTitle: {
    fontWeight: '500', 
    fontSize: 18, 
    marginBottom: 5
    },
  seperatorContainer: {
    padding: 2, 
    backgroundColor:'lightgray'
  },
  labelHeader: {
    fontSize: 16, 
    fontWeight: '500', 
    marginBottom: 10
  },
  alignRentContainer: {
    flexDirection:'row', 
    alignItems:"center", 
    justifyContent:'space-between', 
    marginBottom: 5
  },
  alignServiceFeeCont: {
    flexDirection:'row',
     alignItems:'center',
      justifyContent:'space-between',
       marginBottom: 10
  },
  totalPriceContainer: {
    flexDirection:'row', 
    alignItems:'center', 
    justifyContent:'space-between', 
    paddingVertical: 20, 
    borderTopWidth: 1, 
    borderTopColor:'lightgray'
    
  },
  chargeCardContainer: {
    flex: 1, 
    paddingHorizontal: 20, 
    backgroundColor:'white'
},
  textSize: {
    fontWeight:'600', 
    fontSize: 15
  },
  cardTypeImage: {
    width: 40, 
    height: 40, 
    resizeMode:'contain'
  },
  addCard: {
    paddingRight: 20, 
    alignItems:'center'
  },
  addText: {
    fontSize: 15, 
    borderWidth: 2, 
    borderRadius: 5, 
    padding: 8, 
    marginRight: 5, 
    fontWeight: '500'
  },
  payBtn: {
    flexDirection:"row", 
    justifyContent:"center", 
    alignItems:"center", 
    padding: 15, 
    backgroundColor:'#8B0000', 
    borderRadius: 10, 
    marginHorizontal: 20, 
    marginBottom: 10
  },
  payBtnText: {
    color:'white', 
    fontWeight:'600', 
    fontSize: 16
  },
  bottomSheetHandleStyle: {
    backgroundColor: 'rgba(0,0,0,0.5)', 
    borderTopLeftRadius: 15, 
    borderTopRightRadius: 15
  },
  priceDetailsHeader: {
    flexDirection:'row', 
    alignItems:'center', 
    paddingBottom: 20, 
    borderBottomWidth: 1, 
    borderBottomColor:'lightgray'
  },
  priceDetailsText: {
    fontSize: 18, 
    fontWeight: 'bold'
  },
  priceDetailsInfoCont: {
    flex:1, 
    justifyContent:'space-around'
  },
  feeDescText: {
    color:'#4C4C4C', 
    fontSize: 15
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
  refundPolicyText: {
    fontSize: 18,
    fontWeight: '600'
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
      width: '70%'
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
      paddingVertical: 10, 
      paddingHorizontal: 15,
      borderRadius: 10
  },
  closeAlertText: {
      color:'white', 
      fontWeight: '600', 
      fontSize: 14
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
})