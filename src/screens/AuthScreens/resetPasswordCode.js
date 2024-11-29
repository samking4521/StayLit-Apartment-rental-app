import { useState, useEffect, useRef } from 'react'
import {View, Text, Pressable, TextInput, KeyboardAvoidingView, Keyboard, ActivityIndicator, Modal, TouchableOpacity, StyleSheet, StatusBar} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { confirmResetPassword, resetPassword } from 'aws-amplify/auth'
import { UserAuth } from '../../models'
import { DataStore } from 'aws-amplify/datastore'
import { MaterialIcons, Entypo } from '@expo/vector-icons'
import { StatusBar as ExpoBar } from 'expo-status-bar'

const PasswordResetCode = ()=>{
    const route = useRoute() // route object for data transmission between screens
    const {email, password, navigateToHome} = route.params // user email and password data from route object
    const [confirmationCode, setConfirmationCode] = useState(null) // stores password reset code confirmation code
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
    const navigation = useNavigation() // navigation object for transitions between screens
    
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

    // Updates input field 2
    const onInput2Change = (val)=>{
       // if input field 2 is deleted
        if(val == ''){
            setInput2(val)
            // blurs input field 3
            input3ref.current.blur()
        }
         // if input field 2 is updated
        else{
            setInput2(val)
            // focuses input field 3
            input3ref.current.focus()
        }
    }

    // Updates input field 3
    const onInput3Change = (val)=>{
      // if input field 3 is deleted
        if(val == ''){
            setInput3(val)
            // blurs input field 4
            input4ref.current.blur()
        }
        // if input field 3 is updated
        else{
            setInput3(val)
            // focuses input field 4
            input4ref.current.focus()
        }
    }
 
    // Updates input field 4
    const onInput4Change = (val)=>{
      // if input field 4 is deleted
        if(val == ''){
            setInput4(val)
            // blurs input field 5
            input5ref.current.blur()
        }
        // if input field 4 is updated
        else{
            setInput4(val)
            // focuses input field 5
            input5ref.current.focus()
        }
    }

    // Updates input field 5
    const onInput5Change = (val)=>{
      // if input field 5 is deleted
        if(val == ''){
            setInput5(val)
            // blurs input field 6
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
  
    // Checks whether confirmation code length is equals to 6
     useEffect(()=>{
        if( input1 && input2 && input3 && input4 && input5 && input6){
               const code = `${input1}${input2}${input3}${input4}${input5}${input6}`
                setBlur(false)
                setConfirmationCode(code)
        }else{
            setBlur(true)
        }
     }, [input1, input2, input3, input4, input5, input6])

     // Handles user password reset update
      const updatePasswordInUserAuth = async ()=>{
         // Obseves the UserAuth model for any changes or updates related to the user with the matching email.
        DataStore.observeQuery( UserAuth, (u) => u.email.eq(email)).subscribe(snapshot => {
          // Destructure items and isSynced from the snapshot object.
            const { items, isSynced } = snapshot;

             // Log the number of items found and the synchronization status to the console.
            console.log(`[Snapshot] item count: items : length ${items.length}, isSynced: ${isSynced}`);
            
            // if the data is synchronized with the backend.
            if(isSynced){
              // Log the array of UserAuth items (contains a single object) 
                console.log('Items : ', items)
                const userAuthObj = items

                // Updates user new password in backend database using DataStore.
                const updateOldPasswordToNewPassword = DataStore.save(UserAuth.copyOf(userAuthObj[0], (updated)=>{
                    updated.password = password
                  }))

                // Log the result of the password update to the console.
                console.log('updateOldPasswordToNewPassword : ',  updateOldPasswordToNewPassword)
            }
        });
    }

   // Handles confirmation code error alerts
    const errorAlerts = (e)=>{
          if(e.name == 'CodeMismatchException'){
            setErrorUploadAlert('CodeMismatchException')
        }
          else if(e.name == 'ExpiredCodeException'){
            setErrorUploadAlert('ExpiredCodeException')
          }
          else if(e.name == 'LimitExceededException'){
            setErrorUploadAlert('LimitExceededException')
          }
          else{
            setErrorUploadAlert('true')
          }
   }
   

    // Handles onPress event of the Verify code button
     const confirmPasswordReset = async ({ email, password, confirmationCode }) => {
       try{
          // resets user password
            await confirmResetPassword({ username: email, newPassword : password, confirmationCode });
            console.log('Password reset successfully')
            // updates the new password in backend database
            await updatePasswordInUserAuth()
            setVerifying(false)
            setOnSignIn(false)
            if(navigateToHome){
                // navigates to explore screen
                navigation.navigate('Settings', { showAlert: true })
            }else{
               // navigates to sign in screen
                navigation.navigate('SignIn')
            }
          }
       // Error handling
       catch(e){
        console.log('Error verifying password reset code : ', e)
        // logs password reset error message to console
        setErrorUploadAlert('Verify')
        setVerifying(false)
        setOnSignIn(false)
        // handle error alerts
        errorAlerts(e)
      }
     }
    
     // Handles comfirmation code resend alert
      const showResentAlert = ()=>{
        Keyboard.dismiss()
        setSuccessAlert(true)
      }

    // Handles reset password error alerts
    const errorResetPasswordAlerts = ()=>{
          setErrorUploadAlert('Reset')
    }
    
    // Handles reset password
      const resendPasswordResetCode = async ({ email })=>{
        try{
          // resets user password 
            const result = await resetPassword({
                username: email // email is used as username
              });
              console.log('result : ', result)
              // destructure and logs detailed info of reset password result object
              const { attributeName, deliveryMedium, destination } = result.nextStep.codeDeliveryDetails;
              console.log('attributeName : ', attributeName, 'deliveryMedium : ', deliveryMedium, 'destination : ', destination )
        }catch(e){
            console.log('Error sending password reset code : ', e)
            // Handles password reset alerts
            errorResetPasswordAlerts()
        }
        
      }
    
      // Clears all input fields
      const clearAllInputs = ()=>{
        input1ref.current.focus()
        setInput1('')
        setInput2('')
        setInput3('')
        setInput4('')
        setInput5('')
        setInput6('')
      }

      const onPressVerifyButton = ()=>{
         // dismisses keyboard
         Keyboard.dismiss()
         // if verify code button is pressable and confirmation code is set
         if(!blur && confirmationCode){
          setVerifying(true); 
          confirmPasswordReset({email, password, confirmationCode})
         }
         else{
          return
         }

      }
    return(
        <KeyboardAvoidingView
        behavior='padding'
        style={{ flex : 1}}
      >
           <View style={styles.container}>
               <View style={{marginVertical: 20}}>
                    <Text style={styles.verifyText}>Verify It's You</Text>
                    <Text style={styles.codeDescText}>A 6 digit verification code has been sent to your email at {email}</Text>
               </View>
               <View style={styles.inputFieldCont}>
                    <TextInput ref={input1ref}   value={input1} selectionColor={'#FF0000'} maxLength={1} onChangeText={onInput1Change} keyboardType='decimal-pad' style={styles.inputField}/>
                    <TextInput ref={input2ref}   value={input2} selectionColor={'#FF0000'} maxLength={1} onChangeText={onInput2Change} keyboardType='decimal-pad' style={styles.inputField}/>
                    <TextInput ref={input3ref}  value={input3} selectionColor={'#FF0000'} maxLength={1} onChangeText={onInput3Change} keyboardType='decimal-pad' style={styles.inputField}/>
                    <TextInput ref={input4ref}   value={input4} selectionColor={'#FF0000'} maxLength={1} onChangeText={onInput4Change} keyboardType='decimal-pad' style={styles.inputField}/>
                    <TextInput ref={input5ref}   value={input5} selectionColor={'#FF0000'} maxLength={1} onChangeText={onInput5Change} keyboardType='decimal-pad' style={styles.inputField}/>
                    <TextInput ref={input6ref}  value={input6} selectionColor={'#FF0000'} maxLength={1} onChangeText={onInput6Change} keyboardType='decimal-pad' style={styles.inputField}/>
               </View>

               <TouchableOpacity onPress={()=>{showResentAlert(); resendPasswordResetCode({email})}}>
                <Text style={styles.clickableText}>Resend Code</Text>
               </TouchableOpacity>

               <TouchableOpacity onPress={clearAllInputs}>
                <Text style={styles.clickableText}>Clear Code</Text>
               </TouchableOpacity>

               <Pressable onPress={()=>{onPressVerifyButton(); setOnSignIn(true)}} style={{ ...styles.verifyCodeBtn, backgroundColor: blur? 'gray' : '#8B0000'}}>
                   {verifying? 
                   <>
                    <ActivityIndicator size='small' color='white' style={{marginRight: 10}}/>
                    <Text style={styles.verifyingText}>Verifying...</Text>
                  </>  
                      :
                      <>
                              <Text style={styles.verifyingText}>Verify Code </Text>
                      </>
                    }
               </Pressable>

           </View>
           <Modal visible={errorUploadAlert !== null? true : null} onRequestClose={()=>{setErrorUploadAlert(null)}} presentationStyle='overFullScreen' transparent={true}>
           <StatusBar style='light' backgroundColor='rgba(0,0,0,0.5)'/>
               <View style={{flex: 1, ...styles.userProfileAlertContainer}}>
                      <View style={styles.userProfileSuccessAlert}>
                              <MaterialIcons name="error" size={40} color="red" style={{marginBottom: 10}}/>
                              <Text style={{color:"red", ...styles.errorAlertLabel}}>{errorUploadAlert == 'CodeMismatchException'? 'Incorrect Code' : errorUploadAlert == 'ExpiredCodeException'? 'Code Expired' : errorUploadAlert == 'LimitExceededException'? 'Retry Limit Exceeded' :  errorUploadAlert == 'Verify'? 'Error Verifying Password' : errorUploadAlert == 'Reset'? 'Error resetting password' : 'Error Confirming Code'}</Text>
                              <Text style={styles.errorAlertDescText}>{errorUploadAlert == 'CodeMismatchException'? 'Invalid verification code provided, please try again.' : errorUploadAlert == 'ExpiredCodeException'? 'The code you received has expired; please request a new code.': errorUploadAlert == 'LimitExceededException'? 'Attempt limit exceeded, please try after some time.' :  errorUploadAlert == 'Verify'? 'An error occured while verifying your password, check your internet connrection or try again later.' : errorUploadAlert == 'Reset'? 'An unknown error occured! Pls check your internet connection and try again.' : 'An unknown error occured! Pls check your internet connection and try again.'}</Text>
                              <Pressable onPress={()=>{setErrorUploadAlert(null)}} style={{backgroundColor: 'black', ...styles.closeProfileAlert}}>
                                  <Text style={styles.closeAlertText}>OK</Text>
                              </Pressable>
                          </View>
                </View>
           </Modal>
          
          <Modal visible={successAlert} onRequestClose={()=>{setSuccessAlert(false)}} presentationStyle='overFullScreen' transparent={true}>
          <ExpoBar style='light' backgroundColor='rgba(0,0,0,0.5)'/>
              <View style={{flex: 1, ...styles.userProfileAlertContainer}}>
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

export default PasswordResetCode

const styles = StyleSheet.create({
      container : {
            flex: 1,
            padding: 10,
            paddingTop: StatusBar.currentHeight,
            backgroundColor:'white',
            alignItems:'center'
      },
      verifyText: {
            fontSize: 20,
            letterSpacing: 0.5,
            textAlign:'center'
      },
      codeDescText: {
            fontSize: 14,
            color:'#4C4C4C',
            textAlign:'center'
      },
      inputFieldCont: {
            flexDirection:'row',
            justifyContent:'space-around',
            marginVertical: 10,
            width: '100%'
      },
      inputField: {
            borderWidth: 1,
            borderRadius: 5, 
            padding: 15,
            fontSize: 18,
            borderColor: '#FF0000'
      },
      clickableText: {
            color: '#FF0000',
            fontSize: 14,
            marginTop: 10
      },
      verifyCodeBtn: {
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
      verifyingText: {
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
        width:'70%'
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
    successText: {
      color:"green", 
      fontWeight: '600', 
      fontSize: 16, 
      marginBottom: 5
  },
  profileSuccessText: {
      color:"#4C4C4C", 
      fontWeight: '500', 
      textAlign:'center', 
      marginBottom: 30, 
      fontSize: 14
  }

})
