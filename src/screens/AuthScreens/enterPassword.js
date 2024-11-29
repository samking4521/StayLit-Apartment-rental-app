import { useState, useEffect, useRef } from 'react'
import {View, Text, Pressable, TextInput, ScrollView, KeyboardAvoidingView, Keyboard, ActivityIndicator, Modal, StyleSheet} from 'react-native'
import { Feather, Entypo, MaterialIcons } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { signUp } from 'aws-amplify/auth';
import { StatusBar } from 'expo-status-bar';

const EnterPassword = ()=>{
    const [blur, setBlur] = useState(true) // Controls whether the Sign in button is pressable or not (true = not pressable, color : gray, false = pressable, color: red)
    const [password, setPassword] = useState('') // stores user password
    const [passwordFocus, setPasswordFocus] = useState(false) // Tracks whether the password input field is focused or not (true = sets borderColor: red, borderWidth: 2, false = sets borderColor: gray, borderWidth: 1)
    const [dontShowPassword, setDontShowShowpassword] = useState(true) // Controls visibility of the password (true = hidden, false = visible)
    const [showPasswordInstruction, setShowPasswordInstruction] = useState(false) // Controls visibilty of the password validation feedback prompts (true = visible, false = hidden)
    const [chkPasswordLength, setChkPasswordLength] = useState(false) // Tracks whether the password length is >= 8 (true = >=8, false = <=8 )
    const [chkPwdCorrect, setChkPwdCorrect] = useState(false) // Tracks whether password character includes alphabets, numbers and symbols (true = present, false = absent)
    const [confirming, setConfirming] = useState(false) // Controls Confirm button text value (true = Confirming... , false = Confirm)
    const navigation = useNavigation() // navigation object for transitions between screens
    const route = useRoute() // route object for data transfer between screens
    const { email } = route.params // user email gotten from the route object on component mount
    const textInputRef = useRef() // reference to the password input field for focus management
    const [errorUploadAlert, setErrorUploadAlert] = useState(null) // controls visibility of the profile upload error alert (create = 'Error Creating Profile', update='Error Updating profile', null = hidden) 
    const [onSignIn, setOnSignIn] = useState(false)
    
    // Checks if password entered meets validation requirements
    useEffect(()=>{
       // Password regular expresion (checks if characters include alphabets, numbers and symbols)
        const chkPwd = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).+$/

      if(chkPwd.test(password) && password.length>=8){
        setBlur(false)
      }
      else{
        setBlur(true)
      }
    }, [email, password])
    
   // Handles password update
    const onPasswordChange = (val)=>{

      // Password regular expresion (checks if characters include alphabets, numbers and symbols)
       const chkPwd = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).+$/

        setPassword(val)
       
        if(val.length >=1 ){
            setShowPasswordInstruction(true)
            if(chkPwd.test(val)){
                setChkPwdCorrect(true)
            }else{
                setChkPwdCorrect(false)
            }
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

    // gives focus to the password input field
    const focusTextInput = ()=>{
        textInputRef.current.focus()
    }

    // handles user sign up error alerts
    const errorAlerts = (error)=>{
      // Handles error if user already exists
      if(error.name ==  "UsernameExistsException"){
        setErrorUploadAlert('UsernameExistsException')
      }
      // Handles other errors that are not explicitly handled
      else{
        setErrorUploadAlert('true')
      }
    }
    
    // Handles user Sign up
    const onPressConfirm = async ({ password, email })=>{
       
        try {
            // If password meets validation requirements
             if(!blur){
                Keyboard.dismiss()
                // Sign up user
                const { isSignUpComplete, userId, nextStep } = await signUp({
                    username: email, // Use email as the username
                        password,
                        attributes: {
                            email
                        },
                        autoSignIn: { // optional - enables auto sign-in after sign-up
                            enabled: true,
                        }
                                    });
              
                  console.log('userId : ',userId, 'isSignUpComplete : ', isSignUpComplete, 'nextStep : ', nextStep);
                  // If the sign-up is successful
                  if(!isSignUpComplete){
                      setConfirming(false)
                      setOnSignIn(false)
                      navigation.navigate('ConfirmCode', { email, password, userId })
                  }
             }
             // if password does not meet validation requirements
             else{
                return
             }
           
          }
          // Error Handling
          catch (error) {
            // logs sign-up error message
            console.log('error signing up:', error);
            setConfirming(false)
            setOnSignIn(false)
            // Handles error alerts
            errorAlerts(error)
          }  
    }

    // Handles onPress event of the Confirm button
    const confirmSignUp = ()=>{
        // password meets validation checks or not
        if(password.length>=8 && chkPwdCorrect){
            setConfirming(true);
        }else{
            setConfirming(false);
        }
        // Handles user sign up
        onPressConfirm({ password, email })
      }
    
    return(
        <KeyboardAvoidingView
        behavior={'padding'}
        style={{ flex : 1 }}
      >
        <ScrollView keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator={false} contentContainerStyle={{flexGrow: 1}}>
         <View style={styles.container}>
            <View style={styles.leotLogoCont}>
                <Text style={styles.leotLogo}>StayLit</Text>
            </View>
            <View>
            <Text style={styles.createYourAcc}>Create your{'\n'}account</Text>
                <View style={{marginTop: 15}}>
                <View style={styles.emailInputCont}> 
                    <TextInput editable={false} style={styles.emailInput} value={email}/>
                    <Text onPress={()=>{navigation.goBack()}} style={styles.emailEditBtn}>Edit</Text>
                </View>
                </View>
                <Pressable onPress={focusTextInput} style={{...styles.passwordInput, borderWidth: passwordFocus? 2 : 1, borderColor: passwordFocus ? '#FF0000' : 'gray' }}> 
                    <TextInput ref={textInputRef} style={{marginRight: 'auto'}} onFocus={()=>{setPasswordFocus(true)}} value={password} placeholder='Password' keyboardType={dontShowPassword? null : 'visible-password'} onChangeText={onPasswordChange} autoCapitalize='none' autoComplete='email' autoCorrect={false} secureTextEntry={dontShowPassword}/>
                    {(password.length >= 1) && <>{dontShowPassword? <Feather name="eye" onPress={()=>{setDontShowShowpassword(false)}} size={22} color="#4C4C4C" /> : <Feather name="eye-off" onPress={()=>{setDontShowShowpassword(true)}} size={22} color="#4C4C4C"/>}</>}
                </Pressable>
              
              { showPasswordInstruction && <View style={styles.passwordFeedback}>
                   <Text style={{marginBottom: 10}}>Your password must contain: </Text>
                <View style={styles.passwordCheckCont}>
                        <Entypo name={chkPasswordLength? "check" : "dot-single"} size={24} color={chkPasswordLength? "green" : "black"} />
                        <Text style={{color: chkPasswordLength? 'green' : 'black'}}>At least 8 characters</Text>               
                </View>
                <View style={styles.passwordCheckCont}>
                        <Entypo name={chkPwdCorrect? "check" : "dot-single"} size={24} color={chkPwdCorrect? 'green' : "black"}/>
                        <Text style={{color: chkPwdCorrect? 'green' : 'black'}}>alphabets, numbers, and symbols</Text>
                </View>
               </View>}
                <Pressable onPress={()=>{confirmSignUp(); setOnSignIn(true)}} style={{backgroundColor: blur? 'gray' : '#8B0000', ...styles.confirmBtn}}>
                   { confirming? <View style={styles.confirmingTextCont}>
                    <ActivityIndicator size='small' color='white' style={{marginRight: 10}}/>
                    <Text style={styles.confirmingText}>Confirming...</Text>
                    </View>:
                    <Text style={styles.confirmText}>Confirm</Text>
                    }
                </Pressable>
                <View>
                    <Text style={styles.alreadyHAccText}>Already have an account?  <Text style={styles.loginText} onPress={()=>{navigation.navigate('SignIn')}}>Login</Text></Text>
                </View>
            </View>
          </View>
        </ScrollView>
        <Modal visible={errorUploadAlert !== null? true : null} onRequestClose={()=>{setErrorUploadAlert(null)}} presentationStyle='overFullScreen' transparent={true}>
            <StatusBar style='light' backgroundColor='rgba(0,0,0,0.5)'/>
            <View style={{ flex: 1, ...styles.userProfileAlertContainer}}>
                        <View style={styles.userProfileSuccessAlert}>
                                <MaterialIcons name="error" size={40} color="red" style={{marginBottom: 10}}/>
                                <Text style={{color:"red", ...styles.errorAlertLabel}}>{errorUploadAlert == 'UsernameExistsException'? 'User Exists' : 'Error Signing up'}</Text>
                                <Text style={styles.errorAlertDescText}>{errorUploadAlert == 'UsernameExistsException'? 'The user already exists; Sign in or use a different email to sign up.' : 'An unknown error occured! Pls check your internet connection and try again.'}</Text>
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

export default EnterPassword

const styles = StyleSheet.create({
  container : {
    flex: 1,
    padding: 40,
    backgroundColor:'white'
  },
  leotLogoCont: {
    alignItems: 'center',
    marginBottom: 80
  },
  leotLogo: {
    fontSize: 70,
    fontWeight: '700',
    fontFamily:'cursive',
    color:'#FF0000'
  },
  createYourAcc: {
    textAlign:'center',
    fontWeight: '600',
    fontSize: 25
  },
  emailInputCont: {
    flexDirection:'row',
    alignItems:'center',
    borderRadius: 5,
    marginTop: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray' 
  },
  emailInput:{
    marginRight: 'auto',
    color:'black'  
  },
  emailEditBtn: {
    fontSize: 14,
    color:'#FF0000',
    fontWeight:'500'
  },
  passwordInput: {
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
  passwordCheckCont: {
    flexDirection:'row',
     alignItems:"center"
  },
  confirmBtn: {
    padding: 15, 
    borderRadius: 5,
    marginBottom: 15,
    marginTop: 25
  },
  confirmingTextCont: {
    flexDirection:'row', 
    alignItems:"center",
    justifyContent:'center'
  },
  confirmingText: {
    textAlign: 'center',
    color:'white',
    fontWeight: '500',
    fontSize: 14
  },
  confirmText: {
    textAlign: 'center', 
    color:'white',
    fontWeight: '500',
    fontSize: 14
  },
  alreadyHAccText: {
    textAlign:"center", 
    fontSize: 14
  },
  loginText: {
    color:'#FF0000',
    fontSize: 14, 
    fontWeight:'500'
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
    width: '70%',
    padding: 20, 
    backgroundColor:'white', 
    borderRadius: 20, 
    elevation: 5, 
    alignItems: 'center'
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