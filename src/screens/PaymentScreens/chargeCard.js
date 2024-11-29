import React, { useState } from 'react';
import { View, TextInput, Text, Image, Pressable, Keyboard, StyleSheet} from 'react-native';
import { AntDesign, FontAwesome6 } from '@expo/vector-icons'
import { MaskedTextInput } from "react-native-mask-text";
import RNPaystack from 'react-native-paystack';
import { DataStore } from 'aws-amplify/datastore';
import { CardDetails, Payment, PaymentHistory, ObservePayment} from '../../models';
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';
import Receipt from '../Receipt';
import { useUserAuthContext } from '../../Context/userContext';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserCardSuccess } from '../../Redux/userCardFound/userCardFoundActions';
import { fetchPaidApartments } from '../../Redux/paymentHistory/paymentActions';
import { showProfileAlert } from '../../Redux/showProfile/showProfileActions';
import { fetchObservePayment } from '../../Redux/observePayment/observePaymentActions.js';

RNPaystack.init({publicKey: 'pk_test_82cc4bc2961c68a65cbc3085eb9d12623d93fcba'});

const ChargeCard = ({paidApartments, setChargeCardErrorAlert, setBottomSheetIndex, closeBtn, addNull, setInfo, setProcessing, dontShowReceipt}) => {
  const dbUser = useSelector( state => state.user.dbUser )
  const dispatch = useDispatch()
  const [cardNumberFormatted, setCardNumberFormatted] = useState(''); // stores formatted card number
  const [cardNumber, setCardNumber] = useState('')  // stores card number
  const [cardName, setCardName] = useState('') // stores cardowner name
  const [expiryDate, setExpiryDate] = useState(''); // stores card expirydate
  const [expiryMonth, setExpiryMonth] = useState(''); // stores card expiry month
  const [expiryYear, setExpiryYear] = useState(''); // stores card expiry year
  const [cvc, setCvc] = useState(''); // stores card cvc
  const [showReceipt, setShowReceipt] = useState(false) // controls visibility of payment receipt (true = visible, false = hidden)
  const [payment, setPayment] = useState(null) // stores payment object
  const [labelColor, setLabelColor] = useState(null)
  
  // Handles initializing a payment transaction with Paystack
   const initializeTransaction = async ()=>{
    const url = "https://api.paystack.co/transaction/initialize";
    const data = {
      email: dbUser.email,
      amount: 50 * 100  // Amount to be charged (in Kobo, hence multiplied by 100)
    };
    const secretKey = 'sk_test_dae21acb196f91cc0b08cae228f347bf241aa7e6' // Paystack secret key for authorization

     // Make a POST request to Paystack API to initialize the transaction
    fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Initialize Success:', data); // Log the success response
      setProcessing(false) // disable processing loading indicator
      chargeTheCard(data.data.access_code) // Call the function to charge the card with the access code received
    })
    .catch((error) => {
      console.log('Error Initializing:', error); // logs intialization error
      setChargeCardErrorAlert('Initialize') // Set an error alert for initialization failure
      setProcessing(false)
    });
   }

   // Handles saving card details to backend database via datastore
    const saveCardDetails = async (authorization_obj, allPayments)=>{
      try{
        // Save the new card details via DataStore to the backend database
        const card = await DataStore.save(new CardDetails({
          cardOwnerName: cardName,
          cardNumber: String(cardNumber),
          cardExpiryDate: expiryDate,
          cardCVV: cvc,
          userID: dbUser.id,
          authorization: authorization_obj
        }))
        console.log('Card saved successfully : ', card)
        // Update the state with the saved card details
        dispatch(fetchUserCardSuccess(card))
        // If card is charged from the payment screen and not cardDetails screen
        if(addNull){
          // close charge card bottomsheet 
          setInfo(null)
        }
        // Update the list of paid apartments
        dispatch(fetchPaidApartments(allPayments))
      }catch(e){
        // Log any errors that occur during the save operation
        console.log('Error saving card : ', e)
      }
    }

    // Handles saving payment to the paymentHistory model in the backend database and update the application state
    const SavePaymentHistory = async (paymentDate, reference, authorization)=>{
      try{
                // Save the payment history to the database via DataStore
                console.log('mealllll cool')
                const paymentObj = await DataStore.save(new PaymentHistory({
                  price: 50,
                  userID: dbUser.id,
                  LeotServiceFee: 50,
                  date: paymentDate,
                  status: 'SUCCESS',
                  type: 'CARD',
                  reference: reference
                }))
                console.log('Card authorization payment successful : ', paymentObj)
                // Query and retrieve all payment history for the user
                const getAllPaidApt = await DataStore.query(PaymentHistory, (p)=> p.userID.eq(dbUser.id))
                console.log('getAllPaidApt : ', getAllPaidApt)
                // Save or update observe payment details
                saveObservePayment()
                  // Update the payment state with the newly saved payment object
                setPayment(paymentObj)
                //if card is charged in other screens asides payment screen
                if(!dontShowReceipt){
                  // show receipt
                  setShowReceipt(true)
                  }
              // Save card details and update the list of paid apartments
              saveCardDetails(authorization, getAllPaidApt)
      }catch(e){
        console.log('Error saving PaymentHistory data', e.message)
      }
     
    }
    
    // Handles saving payment to the backend database via datastore
    const SavePayment = async (paymentDate, reference, authorization)=>{
       
                // Saves payment to database via datastore
                const paymentObj = await DataStore.save(new Payment({
                  price: 50,
                  userID: dbUser.id,
                  LeotServiceFee: 50,
                  date: paymentDate,
                  status: 'SUCCESS',
                  type: 'CARD',
                  reference: reference
                }))
                console.log('Card authorization payment successful : ', paymentObj)
                // save payment in paymentHistory 
                SavePaymentHistory(paymentDate, reference, authorization)
      }
   
    // Verify the card charge using the provided reference
   const verifyCardCharge = (reference)=>{
    
    // URL for verifying the transaction using the Paystack API
    const url = `https://api.paystack.co/transaction/verify/${reference}`;
    const token = 'sk_test_dae21acb196f91cc0b08cae228f347bf241aa7e6';
    
    // Make a GET request to the Paystack API to verify the transaction
    axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      console.log('Card verified successfully : ', response.data);
      // Check if the transaction status is 'success'
      if(response.data.data.status == 'success'){
        // Get the current date and time
          const date = new Date()
          const currentDate_time = date.toLocaleString('en-US', {
            hour12: true})
          console.log('date of transaction : ', currentDate_time)
          // Save the payment details to the backend database
          SavePayment(currentDate_time, response.data.data.reference, response.data.data.authorization)
      }
    })
    .catch(error => {
      console.log('Error verifying card : ', error.message)
       // Show an alert if the card verification failed
      setChargeCardErrorAlert('Verify')
    });
   }

   // Saves or update observe payment details
   const saveObservePayment = async ()=>{
     // Query DataStore to get observe payment object for the current user
      const getObservePaymentObj = await DataStore.query(ObservePayment, (o)=> o.userID.eq(dbUser.id))
      console.log('getObservePaymentObj : ', getObservePaymentObj[0])
      // If observe payment object exists, update it
      if(getObservePaymentObj[0]){
          const observePaymentObj = await DataStore.save(ObservePayment.copyOf(getObservePaymentObj[0], (updated)=>{
            updated.discount = true, // Set discount to true
            updated.newPayment = true // Set newPayment to true
     }))
     console.log('observePaymentObj updated : ', observePaymentObj)
     dispatch(fetchObservePayment(observePaymentObj))
    }
      else{
         // If no observe payment object exists, create a new one
        const observePaymentObj = await DataStore.save(new ObservePayment({
          discount: true,
          userID: dbUser.id,
          newPayment: true
         }))
        console.log('observePaymentObj : ', observePaymentObj)
        dispatch(fetchObservePayment(observePaymentObj))
      }
   }

   // Handles card charging process
  const handleChargeCard = async () => {
    
    try {
      // Check if any required card details is not provided
      if(!cardName || !expiryMonth || !expiryYear || !cvc || !cardNumber ){
      setChargeCardErrorAlert('Enter Card Details') // Set error alert if any card detail is missing
      }else{
        // show processing indicator
        setProcessing(true);
          // Initialize the transaction process
          initializeTransaction()
      }
    } catch (error) {
      console.log('Payment Error:', error);
      setProcessing(false)
      alert('Payment Failed');
    }
  };

  // Charge the card using Paystack with the provided access code
  const chargeTheCard = (access_code)=>{
    // Parameters for charging the card
      const cardParams = {
        cardNumber: cardNumber, 
        expiryMonth: expiryMonth, 
        expiryYear: expiryYear, 
        cvc: cvc,
        accessCode: access_code,
        email: dbUser.email,
        amountInKobo: 50 * 100
      }
       // Charge the card with the provided parameters
      RNPaystack.chargeCardWithAccessCode(cardParams).then((res)=>{
        // On successful card charge
          console.log('Card Charged : ', res) // Log the response from the charge
          verifyCardCharge(res.reference) // Verify the card charge using the response reference
      }).catch((e)=>{
         // On error during card charge
        console.log('Error charging card : ', e) // log error
         // Handle specific error messages and set appropriate error alerts
        if(e.message == 'Declined'){
          setChargeCardErrorAlert('Declined')
        }
        else if(e.message.includes('Token Not Generated')){
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
  
  //Handles formatting card number to chunks of 4 digits
  const formatCardNumber = (value) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
  
    // Group digits in chunks of 4
    const match = cleaned.match(/.{1,4}/g);
  
    // Join chunks with a space
    return match ? match.join(' ') : '';
  };

  // Handles removing spaces from formatted card number
  const getCardNumberWithoutSpaces = (text) => {
    // Remove all spaces from the card number
    return text.replace(/\s/g, '');
  };

  
  /**
 * Handles changes to the input field where the card number is entered.
 * 
 * This function processes the input text to remove any spaces and format it properly
 * before updating the state with the cleaned and formatted card number.
 * 
 * @param {string} text - The raw input text from the card number field.
 */
  const handleInputChange = (text) => {
    // Remove spaces from the card number input
    const cardNumberWithoutSpaces = getCardNumberWithoutSpaces(text);

    // Format the card number with spaces after every four digits
    const formattedCardNumber = formatCardNumber(text);

     // Update state with the cleaned card number (no spaces)
    setCardNumber(cardNumberWithoutSpaces)

    // Update state with the formatted card number (with spaces)
    setCardNumberFormatted(formattedCardNumber); 
  };

// Charges the user's card and manages UI state based on user authentication.
const chargeUserCard = ()=>{
   // Check if the user has not created a profile(i.e available in the database)
    if(!dbUser){
      // dismiss on-screen keyboard
        Keyboard.dismiss()
        // updates bottomsheet position
        setBottomSheetIndex(false)
        // show alert to add profile
        dispatch(showProfileAlert())
        return // exits function
    }
    else{
      Keyboard.dismiss()
      setBottomSheetIndex(false)
      // Proceed to handle the card charging process
      handleChargeCard()
    }
    
}
  return (
    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>
         <View style={styles.container}>
                                                {(!closeBtn || paidApartments) && <AntDesign onPress={()=>{setInfo(null)}} name="close" size={20} color="black" style={{marginRight: 20}}/>}
                                                <Text style={styles.addCardText}>Add card</Text>
         </View>

            <View style={styles.cardImageCont}>
                    <Image source={require('../../../assets/mastercard.png')} style={styles.cardImage}/>
                    <Image source={require('../../../assets/visa.png')} style={{...styles.cardImage, marginHorizontal: 10}}/>
                    <Image source={require('../../../assets/verve.png')} style={{...styles.cardImage, marginRight:'auto'}}/>
                    <Text style={styles.emailText}>{dbUser? dbUser.email : ''}</Text>
            </View>
            <View>
            <View  style={styles.cardDetailsContainer}>
                <Text style={{...styles.cardNumber, color: labelColor == 'cardNo'? '#FF0000' : 'gray'}}>Card number</Text>
                <View style={styles.alignContainer}>
                        <TextInput
                        placeholder="Card Number"
                        value={cardNumberFormatted}
                        style={styles.cardNumberTextInput}
                        onChangeText={handleInputChange}
                        keyboardType='numeric'
                        onFocus={()=>{setLabelColor('cardNo')}}

                    />
                    <AntDesign name="creditcard" size={24} color="black" />
                </View>
             
            </View>
            <View style={{...styles.alignContainer, justifyContent:'space-evenly'}}>
            <View style={styles.expiryDateCont}>
            <Text style={{...styles.cardInfoLabelText, color: labelColor== 'expiryDate'? '#FF0000' : 'gray'}}>Expiry date</Text>
            <MaskedTextInput mask='99/99'
                   type="date"
                    placeholder='MM/YY'
                    options={{
                      dateFormat: 'MM/YY',
                    }}
                    onFocus={()=>{setLabelColor('expiryDate')}}
                  
                    onChangeText={(text, rawText)=>{
                        const [inputMonth, inputYear] = text.split('/');
                        console.log('inputMonth : ', inputMonth , 'inputYear : ', inputYear)
                        setExpiryDate(text)
                        setExpiryMonth(inputMonth)
                        setExpiryYear(inputYear)
                    }}
                    style={{fontSize: 16}}
                    keyboardType='numeric'
              />
            </View>
            <View style={styles.cvvContainer}>
                <Text style={{...styles.cardInfoLabelText, color: labelColor == 'cvv'? '#FF0000': 'gray'}}>Cvv</Text>
                <TextInput
                        placeholder="CVV"
                        value={cvc}
                        style={{fontSize: 16}}
                        onChangeText={setCvc}
                        maxLength={3}
                        keyboardType='numeric'
                        onFocus={()=>{setLabelColor('cvv')}}
                    />
            </View>
                
              </View>
          </View>
        <View style={styles.cardNameContainer}>
             <Text style={{...styles.cardInfoLabelText, color: labelColor== 'cardName'? '#FF0000' : 'gray'}}>Name on card</Text>
             <TextInput placeholder='Name on card' autoCapitalize='characters'  onFocus={()=>{setLabelColor('cardName')}} autoCorrect={false} value={cardName} onChangeText={setCardName} autoComplete='off' style={styles.cardNameTextInput}/>
        </View>
        <Text style={styles.chargeText}>To add a card, there will be a deduction of <FontAwesome6 name="naira-sign" size={12} color="#4C4C4C" />50 Naira from your card. This amount will be discounted from your next payment on the app.</Text>
      <Pressable onPress={chargeUserCard} style={styles.payBtn}>
            <Text style={{...styles.payText, marginRight: 5}}>Pay</Text>
            <View style={styles.alignContainer}>
            <FontAwesome6 name="naira-sign" size={14} color="white" />
            <Text style={styles.payText}>50</Text>
            </View>
      </Pressable>  
      {showReceipt && <Receipt setShowReceipt={setShowReceipt} showReceipt={showReceipt} dbUser={dbUser} payment={payment} setInfo={setInfo}/>}
      
      </ScrollView>
  );
};

export default ChargeCard;

const styles = StyleSheet.create({
  container : {
    flexDirection:'row', 
    alignItems:'center', 
    paddingBottom: 20, 
    borderBottomWidth: 1, 
    borderBottomColor:'lightgray'
  },
  addCardText: {
    fontSize: 18, 
    fontWeight: 'bold'
  }, 
  cardImageCont: {
    flexDirection:'row', 
    alignItems:'center', 
    marginTop: 10
  },
  cardImage: {
    width: 30, 
    height: 30, 
    resizeMode:'contain'
  },
  emailText: {
    color:'gray', 
    fontWeight:'500' 
  },
  cardDetailsContainer: {
    marginTop: 10, 
    justifyContent:'center', 
    borderWidth: 1, 
    borderColor:'gray', 
    paddingVertical: 5, 
    borderTopLeftRadius: 10, 
    borderTopRightRadius: 10, 
    paddingHorizontal: 10, 
    height: 60
  },
  cardNumber: {
    fontSize: 12, 
    marginBottom: 5
  }, 
  alignContainer:{
    flexDirection:'row', 
    alignItems:'center'
  },
  expiryDateCont: {
    justifyContent:'center', 
    borderWidth: 1, 
    borderTopWidth: 0, 
    flex: 1, 
    borderColor: 'gray', 
    paddingVertical: 5, 
    paddingHorizontal: 10, 
    height: 60
  },
  expiryDateText: {
    color:'gray', 
    fontSize: 12, 
    marginBottom: 5
  },
  cvvContainer: {
    justifyContent:'center', 
    borderWidth: 1, 
    borderTopWidth: 0, 
    borderLeftWidth: 0, 
    flex: 1, 
    borderColor: 'gray', 
    paddingVertical: 5, 
    paddingHorizontal: 10, 
    height: 60
  },
  cardInfoLabelText: {
    color:'gray', 
    fontSize: 12, 
    marginBottom: 5
  },
  cardNameContainer: {
    borderWidth: 1, 
    borderRadius: 10, 
    borderColor:'gray', 
    height: 60, 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    marginTop: 15,
    marginBottom: 20
  },
  cardNumberTextInput: {
    fontSize: 16, 
    flex: 1
  },
  cardNameTextInput: {
    width: '100%', 
    fontSize: 16
  },
  chargeText: {
    textAlign:'center', 
    fontWeight:'500', 
    color:'#4C4C4C',
    fontSize: 13
  },
  payBtn: {
    flexDirection:'row', 
    alignItems:'center', 
    justifyContent:'center', 
    backgroundColor:'black', 
    borderRadius:10,
    marginHorizontal:'20%',
    marginVertical: '10%', 
    padding: 15
  },
  payText: {
    color:'white', 
    fontWeight:'500', 
    fontSize:16
  }
})