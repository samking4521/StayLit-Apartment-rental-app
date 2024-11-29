import { useState, useEffect, useRef } from 'react'
import {View, Text, Pressable, TextInput, ScrollView, KeyboardAvoidingView, Keyboard, ActivityIndicator, Modal, StyleSheet} from 'react-native'
import { Entypo, MaterialIcons, Feather } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { resetPassword } from 'aws-amplify/auth'
import { StatusBar } from 'expo-status-bar'

const ResetPassword = ()=>{
    const [password, setPassword] = useState('') // stores user password
    const [confirmPassword, setConfirmPassword] = useState('') // stores user confirm password
    const [passwordFocus, setPasswordFocus] = useState('') // Tracks whether the password input field is focused or not (true = sets borderColor: red, borderWidth: 2, false = sets borderColor: gray, borderWidth: 1)
    const [dontShowPassword, setDontShowShowpassword] = useState(true)  // Controls visibility of the password (true = hidden, false = visible)
    const [dontShowConfirmPassword, setDontShowConfirmpassword] = useState(true) // Controls visibility of the confirm password (true = hidden, false = visible)
    const [showPasswordInstruction, setShowPasswordInstruction] = useState(false) // Controls visibilty of the password validation feedback prompts (true = visible, false = hidden)
    const [chkPasswordLength, setChkPasswordLength] = useState(false) // Tracks whether the password length is >= 8 (true = >=8, false = <=8 )
    const [chkPwdCorrect, setChkPwdCorrect] = useState(false)  // Tracks whether password character includes alphabets, numbers and symbols (true = present, false = absent)
    const [chkPasswordMatch, setChkPasswordMatch] = useState(false)  // Tracks whether both password and confirmPassword matches (true = matches, false = dont match)
    const [reseting, setReseting] = useState(false) // Controls Reset button text value (true = Resetting... , false = Reset)
    const navigation = useNavigation() // navigation object for transitions between screens
    const route = useRoute() // route object for data transfer between screens
    const { email, navigateToHome } = route.params // user email gotten from the route object on component mount
    const textInputRef = useRef() // reference to the password input field for focus management
    const textInputConfirmRef = useRef() // reference to the confirmPassword input field for focus management
    const [resetBtnBlur, setResetBtnBlur] = useState(true) // Controls whether the Reset button is pressable or not (true = not pressable, color : gray, false = pressable, color: red)
    const [errorUploadAlert, setErrorUploadAlert] = useState(null) // controls visibility of the profile upload error alert (create = 'Error Creating Profile', update='Error Updating profile' null = hidden) 
    const [onSignIn, setOnSignIn] = useState(false)

   

    // Checks whether Reset button should be pressable or not
     useEffect(()=>{
        // if validation requirements are not met - it should not be pressable
        if(!email && !password && !confirmPassword){
            return
        }
        // if validation requirements are met - It should be pressable
        else{
            if(email && ((password.length>=8 && confirmPassword.length>=8) && (password == confirmPassword) && chkPwdCorrect)){
                setResetBtnBlur(false)
            }else{
                setResetBtnBlur(true)
            }
        }
     }, [email, password, confirmPassword])

     // checks if password meets validation requirement
     useEffect(()=>{
        if(password.length == 0 && confirmPassword.length == 0){
            return
        }else{
            // executes if both password and confirmPassword matches
            if(password == confirmPassword){
                setChkPasswordMatch(true)
            }else{
                setChkPasswordMatch(false)
            }
        }
        
     }, [password, confirmPassword])

    // Handles password update
    const onPasswordChange = (val)=>{
        /*
         - Password validation check
         * checks if password contains alphabets, numbers and symbols
        */
       const chkPwd = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).+$/

        setPassword(val)
       
        // If the password length is >=1
        if(val.length >=1 ){
            // shows the password validation user feedbacks
            setShowPasswordInstruction(true)

            // if password meets validation checks
            if(chkPwd.test(val)){
                setChkPwdCorrect(true)
            }else{
                setChkPwdCorrect(false)
            }

            // if password length is >= 8
            if(val.length >= 8){
                setChkPasswordLength(true)
            }
            else{
                setChkPasswordLength(false)
            }

        }
        else{
            setShowPasswordInstruction(false)
        }
    }

    // Handles confirmPassword update
     const onConfirmPasswordChange = (val)=>{
        // update confirm password
        setConfirmPassword(val)
     }

    // gives focus to the password input field
    const focusTextInput = ()=>{
        textInputRef.current.focus()
    }
   
    // gives focus to the confirmPasword input field
    const focusConfirmTextInput = ()=>{
        textInputConfirmRef.current.focus()
    }
   
    // Handles reset password error alerts
    const errorAlerts = (e)=>{
        // Handles error if user does not exist
        if(e.name == 'UserNotFoundException'){
            setErrorUploadAlert('UserNotFoundException')
        }
        // Handles other errors that are not explicitly handled
        else{
            setErrorUploadAlert('true')
        }
    }

    // Handles User password reset once Reset button is pressed
    const onPressReset = async ({ email }) => {
        try{
            // Resets user password
            const result = await resetPassword({
                username: email // Use email as the username
              });
              // logs reset password response object
              console.log('result : ', result)
              // destructure details of the result object properties
              const { attributeName, deliveryMedium, destination } = result.nextStep.codeDeliveryDetails;
              // log the details
              console.log('attributeName : ', attributeName, 'deliveryMedium : ', deliveryMedium, 'destination : ', destination )
              // If password reset is successful
              if(!(result.isPasswordReset)){
                setReseting(false)
                setOnSignIn(false)
                // navigates to the confirmation code screen
                navigation.navigate('ResetPasswordConfirmationCode', { email, password, navigateToHome})
              }
             // Error Handling
        }catch(e){
            // logs password reset errors
            console.log('Error sending password reset code : ', e)
            setReseting(false)
            setOnSignIn(false)
            // Handles error alerts
            errorAlerts(e)
        }
    }
      
    // Handles onPress event of the Reset Button
    const setNewPassword = ()=>{
        // Dismiss keyboard
        Keyboard.dismiss()
        
        // if Reset button is disabled ( not pressable, color: gray)
        if(resetBtnBlur){
            return
        }
            setReseting(true);
            // Handles user password reset
            onPressReset({email});
       
      }
    
    return(
        <KeyboardAvoidingView
        behavior={'padding'}
        style={{ flex : 1 }}
      >
        <ScrollView keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator={false} contentContainerStyle={{flexGrow: 1}}>
         <StatusBar style='dark' backgroundColor='white'/>
          <View style={styles.container}>
            <View style={styles.leotLogoCont}>
                <Text style={styles.leotLogo}>StayLit</Text>
            </View>
            <View>
            <Text style={styles.enterNewPwd}>Enter New {'\n'}Password</Text>
                <View style={{marginTop: 15}}>
                <View style={styles.emailCont}> 
                    <TextInput editable={false} style={styles.emailInput} value={email} placeholder='Email address'/>
                    <Text onPress={()=>{navigation.goBack()}} style={styles.editText}>Edit</Text>
                </View>
                </View>
                <Pressable onPress={focusTextInput} style={{...styles.passwordInput, borderWidth: passwordFocus == 'pwd'? 2 : 1, borderColor: passwordFocus=='pwd' ? '#FF0000' : 'gray' }}> 
                    <TextInput ref={textInputRef} style={{marginRight: 'auto'}} onFocus={()=>{setPasswordFocus('pwd')}} value={password} placeholder='Enter new password' keyboardType={dontShowPassword? null : 'visible-password'} onChangeText={onPasswordChange} autoCapitalize='none' autoComplete='email' autoCorrect={false} secureTextEntry={dontShowPassword}/>
                    {(password.length >= 1) && <>{dontShowPassword? <Feather name="eye" onPress={()=>{setDontShowShowpassword(false)}} size={22} color="#4C4C4C" /> : <Feather name="eye-off" onPress={()=>{setDontShowShowpassword(true)}} size={22} color="#4C4C4C"/>}</>}
               </Pressable>
               <Pressable onPress={focusConfirmTextInput} style={{...styles.confirmPasswordInput, borderWidth: passwordFocus == 'conPwd'? 2 : 1, borderColor: passwordFocus=='conPwd' ? '#FF0000' : 'gray' }}> 
                    <TextInput ref={textInputConfirmRef} style={{marginRight: 'auto'}} onFocus={()=>{setPasswordFocus('conPwd')}} value={confirmPassword} placeholder='Confirm new password' keyboardType={dontShowConfirmPassword? null : 'visible-password'} onChangeText={onConfirmPasswordChange} autoCapitalize='none' autoComplete='email' autoCorrect={false} secureTextEntry={dontShowConfirmPassword}/>
                    {(confirmPassword.length >= 1) &&<>{dontShowConfirmPassword? <Feather name="eye" onPress={()=>{setDontShowConfirmpassword(false)}} size={22} color="#4C4C4C" /> : <Feather name="eye-off" onPress={()=>{setDontShowConfirmpassword(true)}} size={22} color="#4C4C4C"/>}</>} 
               </Pressable>
              
              { showPasswordInstruction && <View style={styles.passwordFeedback}>
                   <Text style={{marginBottom: 10}}>Your password must contain: </Text>
                <View style={styles.checkValidation}>
                        <Entypo name={chkPasswordLength? "check" : "dot-single"} size={24} color={chkPasswordLength? "green" : "black"} />
                        <Text style={{color: chkPasswordLength? 'green' : 'black'}}>At least 8 characters</Text>
                </View>
                <View style={styles.checkValidation}>
                        <Entypo name={chkPwdCorrect? "check" : "dot-single"} size={24} color={chkPwdCorrect? 'green' : "black"}/>
                        <Text style={{color: chkPwdCorrect? 'green' : 'black'}}>alphabets, number, and symbol</Text>
                </View>
                <View style={styles.checkValidation}>
                    <Entypo name={chkPasswordMatch? "check" : "dot-single"} size={24} color={chkPasswordMatch? "green" : "black"} />
                    <Text style={{color: chkPasswordMatch? 'green' : 'black'}}>Both password matches</Text>
                </View>
               </View>}
                <Pressable onPress={()=>{setNewPassword(); setOnSignIn(true)}} style={{backgroundColor: resetBtnBlur? 'gray' : '#8B0000', ...styles.resetBtn}}>
                   { reseting? <View style={styles.resettingTextCont}>
                    <ActivityIndicator size='small' color='white' style={{marginRight: 10}}/>
                    <Text style={styles.resettingText}>Reseting...</Text>
                    </View> :
                    <Text style={styles.resetText}>Reset</Text>
                    }
                </Pressable>
            </View>
          </View>
        </ScrollView>
        <Modal visible={errorUploadAlert !== null? true : null} onRequestClose={()=>{setErrorUploadAlert(null)}} presentationStyle='overFullScreen' transparent={true}>
            <StatusBar style='light' backgroundColor='rgba(0,0,0,0.5)'/>
                <View style={{flex: 1, ...styles.userProfileAlertContainer}}>
                            <View style={styles.userProfileSuccessAlert}>
                                    <MaterialIcons name="error" size={40} color="red" style={{marginBottom: 10}}/>
                                    <Text style={{color:"red", ...styles.errorAlertLabel}}>{errorUploadAlert == 'UserNotFoundException'? 'User Not Found' : 'Error Resetting Password'}</Text>
                                    <Text style={styles.errorAlertDescText}>{errorUploadAlert == 'UserNotFoundException'? 'The user does not exist; please sign up using an email address that is already registered.' : 'An unknown error occured! Pls check your internet connection and try again.'}</Text>
                                    <Pressable onPress={()=>{setErrorUploadAlert(null)}} style={{backgroundColor: 'black', ...styles.closeProfileAlert}}>
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

export default ResetPassword

const styles = StyleSheet.create({
  container: {
        flex: 1,
        padding: 40,
        backgroundColor:'white'
  },
  leotLogoCont: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 80
  },
  leotLogo: {
        fontSize: 70,
        fontWeight: '700', 
        fontFamily:'cursive',
        color:'#FF0000'
  },
  enterNewPwd: {
        textAlign:'center',
        fontSize: 20,
        fontWeight: '600'
  },
  emailCont: {
        flexDirection:'row',
        alignItems:'center', 
        borderRadius: 5,
        marginTop: 5,
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray'
  }, 
  emailInput: {
        marginRight: 'auto', 
        color:'black'
  },
  editText: {
        fontSize: 14,
        color:'#FF0000',
        fontWeight:'500'
  },
  passwordInput: {
        flexDirection:'row',
        alignItems:'center',
        borderRadius: 5,
        marginTop: 10,
        padding: 10
  },
  confirmPasswordInput: {
        flexDirection:'row', 
        alignItems:'center',
        borderRadius: 5,
        marginTop: 10,
        padding: 10,
  },
  passwordFeedback: {
        borderWidth: 1,
        borderColor:'gray',
        borderRadius: 5,
        padding: 15,
        marginTop: 10
  },
  checkValidation: {
        flexDirection:'row', 
        alignItems:"center"
  },
  resetBtn: {
        padding: 15,
        borderRadius: 5, 
        marginBottom: 15,
        marginTop: 25
  },
  resettingTextCont: {
        flexDirection:'row',
        alignItems:"center",
        justifyContent:'center'
  },
  resettingText: {
        textAlign: 'center',
        color:'white',
        fontWeight: '500',
        fontSize: 14
  },
  resetText: {
        textAlign: 'center',
        color:'white',
        fontWeight: '500',
        fontSize: 14
  },
  errorAlertLabel: {
    fontWeight: '600', 
    fontSize: 16, 
    marginBottom: 16
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
}

})


