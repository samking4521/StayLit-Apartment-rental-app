import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Image, ScrollView, Pressable, StyleSheet, ImageBackground, ActivityIndicator, KeyboardAvoidingView, Keyboard, Modal} from 'react-native';
import { AntDesign, FontAwesome6, Ionicons, MaterialIcons, Feather } from '@expo/vector-icons'
import { MaskedTextInput } from "react-native-mask-text";
import RNPaystack from 'react-native-paystack';
import { DataStore } from 'aws-amplify/datastore';
import { CardDetails, Payment, PaymentHistory, ObservePayment} from '../../models';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Receipt from '../Receipt';
import { useUserAuthContext } from '../../Context/userContext';
import { StatusBar } from 'expo-status-bar';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserCardSuccess } from '../../Redux/userCardFound/userCardFoundActions';
import { fetchPaidApartments } from '../../Redux/paymentHistory/paymentActions';

RNPaystack.init({publicKey: 'pk_test_82cc4bc2961c68a65cbc3085eb9d12623d93fcba'});

const cardImageBackground = require('../../../assets/cardBackground.jpeg')


const CardInfo = ()=>{
  const dbUser = useSelector(state => state.user.dbUser)
  const userCardFound = useSelector( state => state.card.userCardFound)
  const dispatch = useDispatch()
  const { setTheObservePayment} = useUserAuthContext() // Destructure context values and setters from the useUserAuthContext 
  const cardNo = userCardFound?.cardNumber.replace(/\s/g, ''); // Remove all spaces from the card number if userCardFound exists
  const [cardNumber, setCardNumber] = useState(cardNo) // stores card number
  const cleaned = userCardFound?.cardNumber.replace(/\D/g, ''); // Remove all non-digit characters from the card number if userCardFound exists
  const match = cleaned?.match(/.{1,4}/g); // Match the cleaned card number into chunks of 4 digits each
  const [cardNumberFormatted, setCardNumberFormatted] = useState( match ? match?.join(' ') : '' ); // stores card formatted number
  const [cardName, setCardName] = useState(userCardFound?.cardOwnerName) // stores card owner name
  const [cardExpMonth, cardExpYear] = userCardFound? userCardFound?.cardExpiryDate.split('/') : '00/00'; // Destructure the expiration month and year from the cardExpiryDate or fallback to '00/00'
  const [expiryDate, setExpiryDate] = useState(userCardFound?.cardExpiryDate); // stores card expiry date
  const [expiryMonth, setExpiryMonth] = useState(cardExpMonth); // stores card expiry month
  const [expiryYear, setExpiryYear] = useState(cardExpYear); // stores card expiry year
  const [cvc, setCvc] = useState(userCardFound?.cardCVV); // stores card cvv
  const [email, setEmail] = useState(dbUser.email); // stores user email
  const [editTrue, setEditTrue] = useState(false) // Controls whether the card data is editable or not (true = editable, false = not editable)
  const [btnDisabled, setBtnDisabled] = useState(true) // Controls 
  const [processing, setProcessing] = useState(null) // controls visibility of the loading indicator (true = visible, null = hidden)
  const navigation = useNavigation() // navigation object for transition between screens
  const [showReceipt, setShowReceipt] = useState(false) // controls visibility of the receipt (true = visible, false = hidden)
  const [payment, setPayment] = useState(null) // stores payment object
  const [cardInfoTrue, setCardInfoTrue] = useState(true) // stores cardInfoTrue object as an identifier for the card details component
  const [chargeCardErrorAlert, setChargeCardErrorAlert] = useState(null) // controls visibility of charge card error alerts (true = visible, null = hidden)
  const [deleteCardAlert, setDeleteCardAlert] = useState(false) // controls visibility of delete card confirmation alert (true = visible, false = hidden) 

// Checks to validate card details and enable/disable the charge card button
  useEffect(()=>{
      // Check if any of the card details do not meet validation requirements
      if(!cardNumberFormatted || expiryMonth?.length !== 2 || expiryYear?.length !== 2 || cvc?.length !== 3 || !cardName){
         // Disable the charge card button if any validation fails
        setBtnDisabled(true)
      }else{
        // Enable the charge card button if all validations are met
        setBtnDisabled(false)
      }
   }, [cardNumberFormatted, expiryMonth, expiryYear, cvc, cardName])

   // Function to format card number by grouping digits in chunks of 4
    const formatCardNumber = (value) => {
        // Remove all non-digit characters
        const cleaned = value.replace(/\D/g, '');
      
        // Group digits in chunks of 4
        const match = cleaned.match(/.{1,4}/g);
      
        // Join chunks with a space
        return match ? match.join(' ') : '';
      };

      // Handles removing all spaces from a card number string
      const getCardNumberWithoutSpaces = (text) => {
        // Remove all spaces from the card number
        return text.replace(/\s/g, '');
      };

      //Handle card number input field changes
      const handleInputChange = (text) => {
        // Remove all spaces from the input text to get a clean card number
        const cardNumberWithoutSpaces = getCardNumberWithoutSpaces(text);
         // Format the input text to group digits in chunks of 4
        const formattedCardNumber = formatCardNumber(text);
        // Update the state with the card number without spaces
        setCardNumber(cardNumberWithoutSpaces)
        // Update the state with the formatted card number (with spaces)
        setCardNumberFormatted(formattedCardNumber); 
      };
       

      // Delete the user's card details from the database
      const deleteUserCard = async ()=>{
         // Query the database to get the card details with the current user ID
          const getCardDetails = await DataStore.query(CardDetails, (c)=> c.userID.eq(dbUser.id))
          console.log('getCardDetails : ', getCardDetails[0])
          // Delete the retrieved card details from the database
          const delCard = await DataStore.delete(getCardDetails[0])
          console.log('delCard : ', delCard)
          // Query the database again to ensure the card details were deleted
          const checkCard = await DataStore.query(CardDetails, (c)=> c.userID.eq(dbUser.id))
          console.log('checkCard : ', checkCard[0])
          // Update the state to reflect that no card details are found
          dispatch(fetchUserCardSuccess(checkCard[0]))
          // disable deleting indicator
          setProcessing(null)
          // Navigate back to the previous screen
          navigation.goBack()
      }

      // Handles showing the delete card confirmation alert
      const deleteCard = ()=>{
        // shows the delete card confirmation alert
        setDeleteCardAlert(true)
      }
     

      // Handles adding a card
      const addCard = ()=>{
       // Dismiss the on-screen keyboard
        Keyboard.dismiss()
        // If the button is disabled, exit the function
        if(btnDisabled){
            return
        }else{
           // Set the processing state to 'update' indicating that a card charge process is starting
            setProcessing('update')
            // Call the function to handle the card charging process
            handleChargeCard()
        }
      }

      //Handles transaction initialization with Paystack
      const initializeTransaction = async ()=>{
        // Paystack URL endpoint for initializing a transaction
        const url = "https://api.paystack.co/transaction/initialize";
        // Data to be sent to the Paystack API for transaction initialization
        const data = {
          email: email, // email associated with the transaction
          amount: 50 * 100 // The amount to be charged (converted to kobo)
        };
         // Secret key for authenticating with the Paystack API
        const secretKey = 'sk_test_dae21acb196f91cc0b08cae228f347bf241aa7e6'
    
        // Send a POST request to the Paystack API to initialize the transaction
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
          console.log('Initialize Success:', data);
          // Clear the processing state indicating the end of the transaction initialization
          setProcessing(null)
          chargeTheCard(data.data.access_code) // Proceed to charge the card using the access code received
        })
        .catch((error) => {
          console.error('Error Initializing:', error);
          setChargeCardErrorAlert('Initialize') // Set an error alert for initialization failure
        });
       }


    // Handles update and save card details in the database
        const saveCardDetails = async (authorization_obj)=>{
          try{
            // Query the database to retrieve the current card details associated with the user's ID
            const getCard = await DataStore.query(CardDetails, (c)=> c.userID.eq(dbUser.id))
            console.log('getCard : ', getCard[0])
            // Use DataStore to save the updated card details to the database
            const card = await DataStore.save(CardDetails.copyOf(getCard[0], (updated)=>{
                updated.cardOwnerName = cardName, 
                updated.cardNumber = String(cardNumber),
                updated.cardExpiryDate = expiryDate,
                updated.cardCVV = cvc,
                updated.userID = dbUser.id,
                updated.authorization = authorization_obj
            }))
            console.log('Card saved successfully : ', card)
            dispatch(fetchUserCardSuccess(card)) // Update the state to reflect that the card is saved and available for use
          }catch(e){
            console.log('Error saving card : ', e)
          }
           
        }
    
        // Save payment details to the database
        const SavePayment = async (paymentDate, reference, authorization)=>{
          // Save a new payment record to the database using DataStore
          const paymentObj = await DataStore.save(new Payment({
                price : 50,
                userID : dbUser.id,
                LeotServiceFee : 50,
                date : paymentDate,
                status : 'SUCCESS',
                type : 'CARD',
                reference : reference
            }))
            console.log('Card authorization payment successful : ', paymentObj)
            // Save the payment details to payment history
            SavePaymentHistory(paymentDate, reference, authorization)
            
          }

          // Save payment history details to the database
          const SavePaymentHistory = async (paymentDate, reference, authorization)=>{
            // Save a new payment history record to the database using DataStore
            const paymentObj = await DataStore.save(new PaymentHistory({
              price: 50,
              userID: dbUser.id,
              LeotServiceFee: 50, // Calculate and store the service fee deducted from the payment
              date: paymentDate,
              status: 'SUCCESS',
              type: 'CARD',
              reference: reference
            }))
            console.log('Card authorization payment successful : ', paymentObj)
            // Query the database to retrieve all payment history records for the current user
            const getAllPaidApt = await DataStore.query(PaymentHistory, (p)=> p.userID.eq(dbUser.id))
            console.log('getAllPaidApt : ', getAllPaidApt)

             // Update the edit state to false
            setEditTrue(false);

            // Update the list of paid apartments with the retrieved payment history records
            dispatch(fetchPaidApartments(getAllPaidApt))

            // Save the observed payment details
            saveObservePayment();

            // Update the payment state with the newly saved payment history record
            setPayment(paymentObj);

            // Show the receipt to the user
            setShowReceipt(true);

            // Save the card details with the authorization and payment history
            saveCardDetails(authorization, getAllPaidApt);
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
          setChargeCardErrorAlert('Verify')
        });
       }
    
       /* - Updates the ObservePayment model in the backend database via datastore
          - if updated, discount on user next apartment payment on the app and payment notification badge is set to true
       */
       const saveObservePayment = async ()=>{
        // Query the DataStore to retrieve the ObservePayment object associated with the current user
          const getObservePaymentObj = await DataStore.query(ObservePayment, (o)=> o.userID.eq(dbUser.id))
          console.log('getObservePaymentObj : ', getObservePaymentObj[0])
          // Update the ObservePayment Model by setting the discount and newPayment keys to true
          const observePaymentObj = await DataStore.save(ObservePayment.copyOf(getObservePaymentObj[0], (updated)=>{
                updated.discount = true, // Apply discount
                updated.newPayment = true // Mark as a new payment
         }))
         console.log('observePaymentObj updated : ', observePaymentObj)
          // Update the state to set discount and payment notification badge true
         setTheObservePayment(observePaymentObj)
       }
    
       // Handles the card charging process
      const handleChargeCard = async () => {
           // Start the transaction initialization process
            initializeTransaction()
      };
    
      // Charges the user's card using Paystack's access code
      const chargeTheCard = (access_code)=>{
        // Set up the card parameters required for the payment
          const cardParams = {
            cardNumber: cardNumber, // card number
            expiryMonth: expiryMonth, // card expiry month
            expiryYear: expiryYear, // card expiry year
            cvc: cvc, // card cvc
            accessCode: access_code, // Access code provided by Paystack for the transaction
            email: email, // User's email
            amountInKobo: 50 * 100  // Payment amount in kobo
          }
          
          // Charge the card using Paystack's SDK
          RNPaystack.chargeCardWithAccessCode(cardParams).then((res)=>{
            // If the card is successfully charged, log the response
              console.log('Card Charged : ', res)
              // Verify the charge by passing the transaction reference
              verifyCardCharge(res.reference)
          }).catch((e)=>{
             // If an error occurs during charging, log the error
             console.log('Error charging card : ', e)
             // Handle different error messages and set appropriate alert messages
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
    return(
        <View style={styles.container}>
           <StatusBar style="dark" backgroundColor="white"/>
                <View style={styles.headerContainer}>
                            <Ionicons onPress={()=>{navigation.goBack()}} name="chevron-back-outline" size={24} color="#4C4C4C" style={{marginRight: 20}}/>
                            <Text style={{fontSize: 20, fontWeight:'500', color:'#4C4C4C'}}>{editTrue? 'ADD CARD' : 'CARD DETAILS'}</Text>
                            <AntDesign name="edit" size={24} color={editTrue? 'blue':'#4C4C4C'} onPress={()=>{setEditTrue(!editTrue)}}/>
                </View>
           <KeyboardAvoidingView behavior='padding' style={{flex: 1}}>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always' contentContainerStyle={{flexGrow: 1}} >
     <View style={styles.cardDetailsContainer}>
        <View style={styles.cardImageContainer}>
            <ImageBackground source={cardImageBackground} style={styles.ImageBackgroundCont} imageStyle={{borderRadius: 10}}>
           <View style={styles.cardDetailsFormContainer}>
           <View>
                  {userCardFound?.authorization.card_type == 'mastercard ' && <Image source={require('../../../assets/mastercard.png')} style={styles.cardImage}/>}
                  {userCardFound?.authorization.card_type == 'visa ' && <Image source={require('../../../assets/visa.png')} style={{...styles.cardImage, marginHorizontal: 10}}/>}
                  {userCardFound?.authorization.card_type == 'verve ' && <Image source={require('../../../assets/verve.png')} style={styles.cardImage}/>}
                </View>
                 <View>
                   <Text style={styles.cardNumberText}>CARD NUMBER</Text> 
                   <View style={styles.alignContainer}>
                      <Text style={styles.cardImageText}>****</Text>
                      <Text style={{...styles.cardImageText, marginHorizontal: 15}}>****</Text>
                      <Text style={{...styles.cardImageText, marginRight: 15}}>****</Text>
                      <Text style={styles.cardImageText}>{userCardFound?.authorization.last4}</Text>
                   </View>
                   
                 </View>
                 <View>
                   <Text style={styles.cardImageTextDate}>VALID THROUGH</Text>
                   <Text style={styles.cardImageTextDate}>{`${userCardFound?.authorization.exp_month}/${userCardFound?.authorization.exp_year[2]}${userCardFound?.authorization.exp_year[3]}`}</Text>
                 </View>
           </View>
           
            </ImageBackground>
               
        </View>
        <View style={{marginBottom: 50}}>
            <View style={styles.cardInfoLabelCont}> 
                <Text style={styles.cardInfoText}>Card number</Text>
                <TextInput  editable={editTrue} keyboardType='numeric' value={cardNumberFormatted} onChangeText={handleInputChange} style={{fontSize: 17, width: '100%', color:editTrue? 'black' : '#4C4C4C'}}/>
            </View>

            <View style={{...styles.cardInfoLabelCont, marginVertical: 20}}> 
                <Text style={styles.cardInfoText}>Name on card</Text>
                <TextInput editable={editTrue} autoCapitalize='characters' keyboardType='default' value={cardName} onChangeText={setCardName} style={{fontSize: 17, width: '100%', color:editTrue? 'black' : '#4C4C4C'}}/>
            </View>

            <View style={{...styles.alignContainer, width: '100%'}}>
            <View style={{...styles.cardInfoLabelCont, width: '40%', marginRight:'auto'}}> 
                <Text style={styles.cardInfoText}>Expiry date</Text>
                <MaskedTextInput mask='99/99'
                   type="date"
                    placeholder={'MM/YY'}
                    options={{
                      dateFormat: 'MM/YY'
                    }}
                    value={`${userCardFound?.authorization.exp_month}/${userCardFound?.authorization.exp_year[2]}${userCardFound?.authorization.exp_year[3]}`}
                    editable={editTrue}
                    onChangeText={(text, rawText)=>{
                        const [inputMonth, inputYear] = text.split('/');
                        console.log('inputMonth : ', inputMonth , 'inputYear : ', inputYear)
                        setExpiryDate(text)
                        setExpiryMonth(inputMonth)
                        setExpiryYear(inputYear)
                    }}
                    placeholderTextColor={'black'}
                    style={{fontSize: 17, color:editTrue? 'black' : '#4C4C4C'}}
                    keyboardType='numeric'
              />
            </View>

            <View style={{...styles.cardInfoLabelCont,  width: '40%'}}> 
                <Text style={styles.cardInfoText}>Cvv</Text>
                <TextInput  editable={editTrue} keyboardType='numeric' value={cvc} onChangeText={setCvc} maxLength={3} style={{...styles.cvvTextInput, color: editTrue? 'black' : '#4C4C4C'}}/>
            </View>
        </View>
        </View>
        {!editTrue && <Pressable onPress={deleteCard} style={{...styles.alignContainer, justifyContent:'center'}}>
                <AntDesign name="delete" size={20} color="#FF0000" style={{marginRight: 5}}/>
                <Text style={styles.deleteCardText}>Delete card</Text>
            </Pressable>}
        {editTrue && <View>
            <View style={{marginBottom: 20}}>
                <Text style={styles.chargeText}>To add a card, there will be a deduction of <FontAwesome6 name="naira-sign" size={12} color="#4C4C4C"/>50 Naira from your card. This amount will be discounted from your next payment on the app.</Text>
            </View>
            
            <Pressable onPress={addCard} style={{...styles.addCardBtn, backgroundColor: btnDisabled? 'gray':'#8B0000'}}>
                <Text style={{...styles.payText, marginRight: 5}}>Pay</Text>
                <View style={styles.alignContainer}>
                    <FontAwesome6 name="naira-sign" size={13} color="white" />
                    <Text style={styles.payText}>50</Text>
                </View>
            </Pressable>
        </View>}
         
    </View>     
        </ScrollView>
       
        </KeyboardAvoidingView>
        {showReceipt && <Receipt setShowReceipt={setShowReceipt} showReceipt={showReceipt} dbUser={dbUser} payment={payment} cardInfoTrue={cardInfoTrue}/>}

        {(processing == 'update' || processing == 'delete') && <View style={{...StyleSheet.absoluteFillObject, ...styles.processingContainer}}>
            <StatusBar style="light" backgroundColor="rgba(0,0,0,0.5)"/>
             <View>
                <ActivityIndicator size='large' color='red'/>
                <Text style={styles.processingText}>{processing == 'update'? 'processing' : 'deleting card'}</Text>
             </View>
        </View>}
        <Modal visible={chargeCardErrorAlert !== null? true : null} onRequestClose={()=>{setChargeCardErrorAlert(null)}} presentationStyle='overFullScreen' transparent={true}>
             <StatusBar style="light" backgroundColor="rgba(0,0,0,0.5)"/>
              <View style={{ flex: 1, ...styles.userProfileAlertContainer}}>
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
            
              <Modal visible={deleteCardAlert} onRequestClose={()=>{setDeleteCardAlert(false)}} presentationStyle='overFullScreen' transparent={true}>
                <StatusBar style="light" backgroundColor="rgba(0,0,0,0.5)"/>
                  <View style={{ flex: 1, ...styles.userProfileAlertContainer}}>
                        <View style={styles.userProfileSuccessAlert}>
                        <Feather name="alert-circle" size={40} color="gold" />
                                <Text style={styles.delCardConfirmText}>Are you sure you want to delete this card</Text>
                                <Text style={styles.errorAlertDescText}>This action cannot be undone. If you proceed, this card will be permanently removed.</Text>
                              <View style={styles.delCardAlertBtns}>
                                <Pressable onPress={()=>{ setDeleteCardAlert(false); setProcessing('delete'); deleteUserCard() }} style={styles.confirmDelBtn}>
                                    <Text style={styles.cardDelBtnText}>CONFIRM</Text>
                                </Pressable>
                                <Pressable onPress={()=>{setDeleteCardAlert(false)}} style={styles.cancelDelBtn}>
                                    <Text style={styles.cardDelBtnText}>CANCEL</Text>
                                </Pressable>
                              </View>
                            </View>
                  </View>
              </Modal>
              
        </View>
      
    )
}

export default CardInfo

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor:'white'
  },
  headerContainer: {
    paddingHorizontal: 25, 
    paddingVertical: 20, 
    flexDirection:'row', 
    alignItems:'center', 
    justifyContent:'space-between'
  },
  cardDetailsContainer: {
    flex: 1, 
    paddingHorizontal: 25
  },
  cardImageContainer: {
    width: '100%', 
    height: '30%', 
    marginBottom: 30
  },
  ImageBackgroundCont: {
    width: '100%', 
    height: '100%'
  },
  cardDetailsFormContainer: {
    flex: 1, 
    padding: 20, 
    justifyContent:'space-between'
  },
  cardImage: {
      width: 60, 
      height: 60, 
      resizeMode:'contain'
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
      paddingVertical: 10, 
      paddingHorizontal: 15,
      borderRadius: 5
  },
  closeAlertText: {
      color:'white', 
      fontWeight: '600', 
      fontSize: 14
  },
  cardNumberText:{
    color: 'white', 
    fontSize: 16, 
    fontWeight: '500'
  }, 
  alignContainer: {
    flexDirection:'row', 
    alignItems:'center'
  },
  cardImageText: {
    color: 'white', 
    fontSize: 20, 
    fontWeight: '500'
  },
  cardImageTextDate: {
    color: 'white',
     fontSize: 16,
      fontWeight: '500'
  },
  cardInfoLabelCont: {
    borderBottomWidth: 1, 
    borderBottomColor:'lightgray', 
    padding: 10
  },
  cardInfoText: {
    color:'#4C4C4C', 
    marginBottom: 5
  },
  cvvTextInput: {
    fontSize: 17
  },
  deleteCardText: {
    fontSize: 14, 
    fontWeight:'500', 
    color:'#4C4C4C'
  },
  chargeText: {
    textAlign:'center', 
    fontWeight:'500', 
    color:'#4C4C4C'
  },
  addCardBtn: {
    flexDirection:'row', 
    alignItems:'center', 
    justifyContent:'center', 
    marginHorizontal: 20, 
    borderRadius: 10,
    paddingVertical: 15
  },
  payText: {
    color:'white',
     fontWeight:'500',
      fontSize:16
  },
  processingContainer: {
    backgroundColor:'rgba(0,0,0,0.5)', 
    justifyContent:'center', 
    alignItems:'center'
  },
  processingText: {
    color:'white', 
    textAlign:'center'
  },
  delCardConfirmText: {
    color:'black', 
    fontWeight: '600', 
    fontSize: 16, 
    marginBottom: 10, 
    textAlign:'center'
  },
  delCardAlertBtns: {
    flexDirection:'row', 
    alignItems:'center', 
    justifyContent:'flex-end', 
    width: '100%'
  },
  confirmDelBtn: {
    backgroundColor: 'black', 
    paddingHorizontal: 10,
    paddingVertical: 5, 
    borderRadius: 5
  },
  cancelDelBtn: {
    backgroundColor: 'red', 
    paddingHorizontal: 10,
    paddingVertical: 5, 
    borderRadius: 5, 
    marginLeft: 5
  },
  cardDelBtnText: {
    color:'white', 
    fontWeight: '600', 
    fontSize: 12
  }

})