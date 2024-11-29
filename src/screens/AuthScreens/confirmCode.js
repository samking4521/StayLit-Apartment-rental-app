import { useState, useEffect, useRef } from 'react'
import {View, Text, Pressable, TextInput, KeyboardAvoidingView, ActivityIndicator, TouchableOpacity, StyleSheet, Keyboard, Modal} from 'react-native'
import { MaterialIcons, Entypo } from '@expo/vector-icons'
import { useRoute } from '@react-navigation/native'
import { signIn, resendSignUpCode } from 'aws-amplify/auth';
import { confirmSignUp } from 'aws-amplify/auth';
import { DataStore } from 'aws-amplify/datastore';
import { UserAuth, AppStatus } from '../../models';
import { StatusBar } from 'expo-status-bar';

const ConfirmCode = ({setLeasing, setUserSignInStatus})=>{
    const route = useRoute() // route object for data transmission between screens
    const {email, password, userId} = route.params // User email, password, and userId data from route object
    const [input1, setInput1] = useState('') // stores input 1
    const [input2, setInput2] = useState('') // stores input 2
    const [input3, setInput3] = useState('') // stores input 3
    const [input4, setInput4] = useState('') // stores input 4
    const [input5, setInput5] = useState('') // stores input 5
    const [input6, setInput6] = useState('') // stores input 6
    const [successAlert, setSuccessAlert] = useState(false) // controls visibility of the profile upload success alert (true = visible, false = hidden) 
    const [errorUploadAlert, setErrorUploadAlert] = useState(null) // controls visibility of the profile upload error alert (create = 'Error Creating Profile', update='Error Updating profile' null = hidden) 
    const [verifying, setVerifying] = useState(false) // Controls Verify code button text value (true = Verifying... , false = Verify)
    const [blur, setBlur] = useState(true) // Controls whether the Verify code button is pressable or not (true = not pressable, color : gray, false = pressable, color: red)
    const input1ref = useRef() // reference to input field 1
    const input2ref = useRef() // reference to input field 2
    const input3ref = useRef() // reference to input field 3
    const input4ref = useRef() // reference to input field 4
    const input5ref = useRef() // reference to input field 5
    const input6ref = useRef() // reference to input field 6
    const [onSignIn, setOnSignIn] = useState(false)

    // updates input field 1
    const onInput1Change = (val)=>{
       // if input field 1 is deleted
            if(val == ''){
                setInput1(val)
                // blur input field 2
                input2ref.current.blur()
            }
            // if input field 1 is updated
            else{
                setInput1(val)
                 // focuses input field 2
                input2ref.current.focus()
            }
    }

     // updates input field 2
    const onInput2Change = (val)=>{
        // if input field 2 is deleted
        if(val == ''){
            setInput2(val)
             // blur input field 3
            input3ref.current.blur()
        }
         // if input field 2 is updated
        else{
            setInput2(val)
             // focuses input field 3
            input3ref.current.focus()
        }
    }

     // updates input field 3
    const onInput3Change = (val)=>{
       // if input field 3 is deleted
        if(val == ''){
            setInput3(val)
             // blur input field 4
            input4ref.current.blur()
        }
          // if input field 3 is updated
        else{
            setInput3(val)
             // focuses input field 4
            input4ref.current.focus()
        }
    }
 
    // updates input field 4
    const onInput4Change = (val)=>{
       // if input field 4 is deleted
        if(val == ''){
            setInput4(val)
             // blur input field 5
            input5ref.current.blur()
        }
          // if input field 4 is updated
        else{
            setInput4(val)
             // focuses input field 5
            input5ref.current.focus()
        }
        
    }

    // updates input field 5
    const onInput5Change = (val)=>{
       // if input field 5 is deleted
        if(val == ''){
            setInput5(val)
             // blur input field 6
            input6ref.current.blur()
        }
        // if input field 5 is updated
        else{
            setInput5(val)
             // focuses input field 6
            input6ref.current.focus()
        }
        
    }

    // Updates input field 6
    const onInput6Change = (val)=>{
        setInput6(val)
    }

    // Clears all input field
    const clearAllInputs = ()=>{
        input1ref.current.focus()
        setInput1('')
        setInput2('')
        setInput3('')
        setInput4('')
        setInput5('')
        setInput6('')
    }
  
    // Checks whether confirmation code length is equals to 6
     useEffect(()=>{
        if( input1 && input2 && input3 && input4 && input5 && input6){
                setBlur(false)
        }else{
            setBlur(true)
        }
     }, [input1, input2, input3, input4, input5, input6])

    // Updates user sign in status in backend database
     const saveSignInStatus = async (userId, email, password)=>{
            const UserAuthObj = await DataStore.save(new UserAuth({
                email,
                password,
                sub : userId,
                signInStatus : 'true',
                userAppType: AppStatus.USER
            }))
            console.log('UserAuthObj saved successfully : ', UserAuthObj)
     }

      // Handles user sign-up error alerts
     const signUpErrorAlerts = (error)=>{
      if(error.name == 'CodeMismatchException'){
        setErrorUploadAlert('CodeMismatchException')
      }
      else{
        setErrorUploadAlert('true')
      }
     }

     // Handles user sign up
     const handleSignUpConfirmation = async ({ email, confirmationCode }) => {
        try {
          // destructure sign up infos from the confirmSignUp Auth module object
          const { isSignUpComplete, nextStep } = await confirmSignUp({
            username: email, // email used as username
            confirmationCode
          });
          // logs sign up infos result
          console.log('isSignUpComplete : ', isSignUpComplete, 'nextStep', nextStep)
          // if sign up is successful
          if(isSignUpComplete){
                // logs userId, email and password
                console.log('userId : ', userId, 'email : ', email, 'password : ', password)
                // Signs in user automatically on the app
                    // destructure sign in infos from the signIn Auth module object
                const { isSignedIn, nextStep } = await signIn({ username: email, password });
                 console.log('isSignedIn', isSignedIn, 'nextStep', nextStep)
                 // if user sign-in is successful
                 if(isSignedIn){
                   // updates user sign in status to true in the backend database
                    await saveSignInStatus(userId, email, password)
                    setVerifying(false)
                    setOnSignIn(false)
                    setLeasing(AppStatus.USER)
                    setUserSignInStatus('true')
                 }
          }
        }
        // Error handling
        catch (error) {
          // logs sign up error message
          console.log('error confirming sign up', error);
          setVerifying(false)
          setOnSignIn(false)
           // Handles sign-up error alerts
           signUpErrorAlerts(error)
        }
      }

      // Handles onPress event of verify code button
    const verifyEmail = ()=>{
            const confirmationCode = `${input1}${input2}${input3}${input4}${input5}${input6}`
            handleSignUpConfirmation({ email, confirmationCode})
    }

  // Handles confirmation code resend alert
  const showResentAlert = ()=>{
     Keyboard.dismiss()
      setSuccessAlert(true)
  }

    // Handle errors for resend sign up verification code
    const errorConfirmCodeAgain = ()=>{
      setErrorUploadAlert('errorResend')
    }
    // Handles sign up code resend alert
    const confirmCodeAgain = async ({ email })=>{
      try{
        // resends sign up confirmation code
        const {destination, deliveryMedium, attributeName } = await resendSignUpCode({ username: email });
        console.log('destination : ', destination, 'deliveryMedium : ', deliveryMedium, 'attributeName : ', attributeName)
        console.log('Verification code resent successfully')
      }
      //Error handling
      catch(e){
        console.log('Error resending code : ', e)
        errorConfirmCodeAgain()
      } 
    }

    const onPressVerifyBtn = ()=>{
       // dismisses Keyboard
       Keyboard.dismiss()
         if(blur){
             return
         }else{
            setVerifying(true);
            verifyEmail()
         }
    }

    return(
        <KeyboardAvoidingView
        behavior={'padding'}
        style={{ flex : 1}}
      >
           <View style={styles.container}>
       
               <View style={{marginVertical: 20}}>
                    <Text style={styles.verificationCodeText}>Enter Verification Code</Text>
                    <Text style={styles.verificationCodeDescText}>A 6 digit verification code has been sent to your email at {email}</Text>
               </View>

               <View style={styles.textInputCont}>
                    <TextInput ref={input1ref} value={input1} maxLength={1} onChangeText={onInput1Change} keyboardType='decimal-pad' style={styles.textInput}/>
                    <TextInput ref={input2ref}  value={input2} maxLength={1} onChangeText={onInput2Change} keyboardType='decimal-pad' style={styles.textInput}/>
                    <TextInput  ref={input3ref}  value={input3} maxLength={1} onChangeText={onInput3Change} keyboardType='decimal-pad' style={styles.textInput}/>
                    <TextInput ref={input4ref}   value={input4} maxLength={1} onChangeText={onInput4Change} keyboardType='decimal-pad' style={styles.textInput}/>
                    <TextInput ref={input5ref}   value={input5} maxLength={1} onChangeText={onInput5Change} keyboardType='decimal-pad' style={styles.textInput}/>
                    <TextInput  ref={input6ref}  value={input6} maxLength={1} onChangeText={onInput6Change} keyboardType='decimal-pad' style={styles.textInput}/>
               </View>

               <TouchableOpacity onPress={()=>{ showResentAlert(); confirmCodeAgain({password, email })}}>
                <Text style={styles.clickableText}>Resend Code</Text>
               </TouchableOpacity>

               <TouchableOpacity onPress={clearAllInputs}>
                <Text style={styles.clickableText}>Clear Code</Text>
               </TouchableOpacity>

               <Pressable onPress={()=>{onPressVerifyBtn(); setOnSignIn(true)}} style={{...styles.verifyEmailButton, backgroundColor: blur? 'gray' : '#8B0000'}}>
                   {verifying? 
                   <>
                    <ActivityIndicator size='small' color='white' style={{marginRight: 10}}/>
                    <Text style={styles.verifyingTextBtn}>Verifying...</Text>
                  </>  
                      :
                      <>
                              <Text style={styles.verifyEmail}>Verify your email</Text>
                              <MaterialIcons name="navigate-next" size={20} color="white" />
                      </>
                    }
               </Pressable>

           </View>
           <Modal visible={errorUploadAlert !== null? true : null} onRequestClose={()=>{setErrorUploadAlert(null)}} presentationStyle='overFullScreen' transparent={true}>
           <StatusBar style='light' backgroundColor='rgba(0,0,0,0.5)'/>
            <View style={{...StyleSheet.absoluteFillObject, ...styles.userProfileAlertContainer}}>
                      <View style={styles.userProfileSuccessAlert}>
                              <MaterialIcons name="error" size={40} color="red" style={{marginBottom: 10}}/>
                              <Text style={{color:"red", ...styles.errorAlertLabel}}>{errorUploadAlert == 'CodeMismatchException'? 'Incorrect Code' : errorUploadAlert == 'errorResend'? 'Error resending verification code' : 'Error Signing up'}</Text>
                              <Text style={styles.errorAlertDescText}>{errorUploadAlert == 'CodeMismatchException'? 'Invalid verification code provided, please try again.' : errorUploadAlert == 'errorResend'? 'An unknown error occured! Pls check your internet connection and try again.' : 'An unknown error occured! Pls check your internet connection and try again.'}</Text>
                              <Pressable onPress={()=>{setErrorUploadAlert(null)}} style={{backgroundColor: 'black', ...styles.closeProfileAlert}}>
                                  <Text style={styles.closeAlertText}>OK</Text>
                              </Pressable>
                          </View>
                </View>
           </Modal>
           <Modal visible={successAlert} onRequestClose={()=>{setSuccessAlert(false)}} presentationStyle='overFullScreen' transparent={true}>
              <StatusBar style='light' backgroundColor='rgba(0,0,0,0.5)'/>
              <View style={{ flex: 1, ...styles.userProfileAlertContainer}}>
                        <View style={styles.userProfileSuccessAlert}>
                                <Entypo name="upload-to-cloud" size={60} color="rgba(0,0,0,0.5)" /> 
                                <Text style={styles.successText}>Verification code resent</Text>
                                <Text style={styles.profileSuccessText}>{`A new verification code has been sent to your email at ${email}`}</Text>
                                <Pressable onPress={()=>{setSuccessAlert(false)}} style={{backgroundColor: 'black', ...styles.closeProfileAlert}}>
                                    <Text style={styles.closeAlertText}>OK</Text>
                                </Pressable>
                            </View>
                  </View>
            </Modal>
            <Modal visible={onSignIn} onRequestClose={()=>{}} presentationStyle='overFullScreen' transparent={true}>
                 <View style={{flex: 1}}>
                    
                 </View>
            </Modal>
        </KeyboardAvoidingView>
    )
}

export default ConfirmCode

const styles = StyleSheet.create({
  container : {
      flex: 1, 
      padding: 10,
      backgroundColor:'white',
      alignItems:'center'
  },
  verificationCodeText: {
      fontSize: 20,
      letterSpacing: 0.5, 
      textAlign:'center'
  },
  verificationCodeDescText: {
      fontSize: 14,
      color:'#4C4C4C',
      textAlign:'center'
  },
  textInputCont: {
      flexDirection:'row', 
      justifyContent:'space-around', 
      marginVertical: 10,
      width: '100%'
  },
  textInput: {
      borderWidth: 1,
      borderRadius: 5,
      padding: 15,
      fontSize: 18,
      borderColor: '#FF0000'
  },
    clickableText: {
      color: '#FF0000',
      fontSize: 14,
      textAlign:'center',
      marginTop: 10
  },
  verifyEmailButton: {
      flexDirection:'row',
      alignItems:'center', 
      justifyContent:'center',
      padding: 10, 
      color:'white',
      fontWeight: '500',
      borderRadius: 5,
      width: '70%', 
      marginTop: 100
  },
  verifyingTextBtn: {
      fontWeight: '500',
      color:'white',
      fontSize: 14, 
      marginRight: 10
  },
   verifyEmail: {
      fontWeight: '500', 
      color:'white',
      fontSize: 14,
      marginRight: 10
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
  successText: {
    color:"green", 
    fontWeight: '600', 
    fontSize: 16, 
    textAlign:'center',
    marginBottom: 5
  },
  profileSuccessText: {
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
}
})