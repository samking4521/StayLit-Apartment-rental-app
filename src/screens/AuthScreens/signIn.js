import { useEffect, useRef, useState } from 'react'
import {View, Text, Pressable, TextInput, ScrollView, Keyboard, KeyboardAvoidingView, ActivityIndicator, Modal, StyleSheet, StatusBar} from 'react-native'
import { Feather, MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { signIn, signOut } from 'aws-amplify/auth';
import { UserAuth } from '../../models';
import { DataStore } from 'aws-amplify/datastore';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

const SignIn = ({setLeasing, setUserSignInStatus})=>{
    const [email, setEmail] = useState('') // stores user email
    const [password, setPassword] = useState('') // stores user password
    const [chkEmailValid, setChkEmailValid] = useState(false) // Controls visibilty of feedback text if email validation returns false (true = visible, false = hidden)
    const [focus, setFocus] = useState(false) // Controls visibility of the email label (true = visible, false = hidden)
    const [Pfocus, setPFocus] = useState(false) // Controls visibility of the password label (true = visible, false = hidden)
    const [blurSignInBtn, setBlurSigninBtn] = useState(true) // Controls whether the Sign in button is pressable or not (true = pressable, color: red, false = not pressable, color : gray)
    const [dontShowPassword, setDontShowShowpassword] = useState(true) // Controls visibility of the password (true = hidden, false = visible)
    const [loggingIn, setLoggingIn] = useState(false) // Controls Sign in button text value (true = Signing in... , false = Sign in)
    const pwdInputRef = useRef() // get access to the password input field, for focus management
    const navigation = useNavigation() // Navigation object for screen transition
    const [errorUploadAlert, setErrorUploadAlert] = useState(null) // controls visibility of the profile upload error alert (create = 'Error Creating Profile', update='Error Updating profile' null = hidden) 
    const [onSignIn, setOnSignIn] = useState(false)

    // handles email input update
    const onEmailChange = (val)=>{
        setEmail(val)
    }

    // handle password input update
    const onPasswordChange = (val)=>{
       setPassword(val)
   }
 
   // Handles user sign in error alerts
   const errorAlerts = (error)=>{
        // Handles error if user does not exist
        if(error.name == "UserNotFoundException"){
            setErrorUploadAlert('UserNotFoundException')
        }
        // Handles error if password entered is incorrect
        else if(error.name == "NotAuthorizedException") {
            setErrorUploadAlert('NotAuthorizedException')
        }
        // Handles all other possible errors that is not exclusively handled
        else{
            setErrorUploadAlert('true')
        }
   }

   // Handles user sign in 
    const SignIn = async ({ email, password })=>{
        /* 
            * @param {string} email - The user's email address.
            * @param {string} password - The user's password.
        */
        try {

            // Handles sign in, if all email and password meet validation requirements (email includes '@' and '.com' && password includes 'alphabets, numbers and symbol' and contains at least 8 characters)
            if(!blurSignInBtn){

                const { isSignedIn, nextStep } = await signIn({ username: email, password });

                 // Log the sign-in status and the next step for debugging purposes
                 console.log('isSignedIn', isSignedIn, 'nextStep', nextStep)

                 // If the sign-in is successful
                 if(isSignedIn){
                    // Observe changes in the UserAuth DataStore where the email matches the provided email
                    DataStore.observeQuery( UserAuth, (u) => u.email.eq(email)).subscribe(snapshot => {
                        const { items, isSynced } = snapshot;
                        console.log(`[Snapshot] item count: items : length ${items.length}, isSynced: ${isSynced}`);

                         // If the data is synced
                        if(isSynced){
                            // Log the items retrieved from the DataStore
                            console.log('Items : ', items)

                            // Extract the UserAuth object from the items
                            const userAuthObj = items

                            // Update the sign-in status to 'true' in the backend via datastore
                            const updateSignInStatusToTrue = DataStore.save(UserAuth.copyOf(userAuthObj[0], (updated)=>{
                                updated.signInStatus = 'true'
                             }))

                             // Log the result of the update operation
                            console.log('updateSignInStatusToTrue : ', updateSignInStatusToTrue)

                            // Retrieve the leasing status from the UserAuth object
                            const leasingStatus = userAuthObj[0].userAppType

                             // Log the leasing status for debugging
                            console.log('leasingStatus : ', leasingStatus)

                            // Update state variables to reflect the sign-in status and leasing status
                            setLoggingIn(false)
                            setOnSignIn(false)
                            setLeasing(leasingStatus)
                            setUserSignInStatus('true')
                        }
                    });
                 }
            }
            // Handles Sign in, if email and password does not meet validation requirements
            else{
                return
            }
          } 
          //Error handling
          catch (error) {
            // logs sign in error
            console.log('error signing in', error);
            setLoggingIn(false)
            setOnSignIn(false)
            // Handles error alerts
            errorAlerts(error)
        }
    }
   
    // Tracks Email and Password validation checks
     useEffect(()=>{
        if(!(email.includes('@') && email.includes('.com')) || !(password.length>=8)){
            // Sign in button made inactive
           setBlurSigninBtn(true)
        }
        else{
            // Sign in button made active
            setBlurSigninBtn(false)
            // removes email invalid text once email meet validation requirements
            if(chkEmailValid){
                setChkEmailValid(false)
            }
        }
     }, [email, password])

     //Handles onPress event of the Sign in button
    const onPressSignin = ()=>{
        Keyboard.dismiss()
        // if sign in button is active
        if(!blurSignInBtn){
            // show signing in text and log in user
            setLoggingIn(true);
            SignIn({ email, password })
        }
        // if sign in button is inactive
        else{
            // Show email invalid text
           if(!(email.includes('@') && email.includes('.com'))){
              setChkEmailValid(true)
           }
        }
    }
    
   // Handles onPress event of the reset password text
    const navigateToNewPasswordScreen = ()=>{
        //navigates to reset password screen
        navigation.navigate('ResetPassword', { email })
    }

    return(
        <KeyboardAvoidingView
        behavior={'padding'}
        style={{flex: 1}}>
           <ScrollView keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
           <StatusBar barStyle="dark-content" backgroundColor='white'/>
           <View style={styles.container}>
            <View style={styles.LeotLogoView}>
                <Text style={styles.LeotLogo}>StayLit</Text>
            </View>
            <View>
                <Text style={styles.welcomeText}>Welcome</Text>
                <View>
                {focus && <Text style={styles.label}>Email address</Text>}
                    <TextInput style={{...styles.emailInputField, borderWidth: focus? 2 : 1, borderColor: focus ? '#FF0000' : 'gray'}} onFocus={()=>{setFocus(true)}} onBlur={()=>{setFocus(false)}} value={email} placeholder='Email address' onChangeText={onEmailChange} autoCapitalize='none' autoComplete='email' autoCorrect={false} keyboardType='email-address' />
                   {chkEmailValid && <Text style={{color:'red'}}>email is not valid!</Text>}
                </View>
                <View style={{marginTop: 15}}>
                {Pfocus && <Text style={styles.label}>Password</Text>}
                   <Pressable onPress={()=>{ pwdInputRef.current.focus() }} style={{...styles.passwordPressable, borderWidth: Pfocus? 2 : 1, borderColor: Pfocus ? '#FF0000' : 'gray' }}>
                   <TextInput ref={pwdInputRef}  style={{marginRight:'auto'}} onFocus={()=>{setPFocus(true)}} onBlur={()=>{setPFocus(false)}} value={password} placeholder='Password (at least 8 characters)' onChangeText={onPasswordChange} secureTextEntry={dontShowPassword}/>
                   {(password.length >= 1) && <>{dontShowPassword? <Feather name="eye" onPress={()=>{setDontShowShowpassword(false)}} size={22} color="#4C4C4C" /> : <Feather name="eye-off" onPress={()=>{setDontShowShowpassword(true)}} size={22} color="#4C4C4C"/>}</>}
                   </Pressable>
                </View>

                <Pressable style={{alignSelf: 'flex-start'}} onPress={()=>{navigateToNewPasswordScreen({email})}}>
                    <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </Pressable>

                <Pressable onPress={()=>{onPressSignin(); setOnSignIn(true);}} style={{backgroundColor: blurSignInBtn? 'gray' : '#8B0000', ...styles.signInBtn}}>
                    {loggingIn? <View style={styles.signingInTextCont}>
                                    <ActivityIndicator size='small' color='white' style={{marginRight: 5}}/>
                                    <Text style={styles.signingInText}>Signing In...</Text>
                               </View> : <Text style={styles.signInText}>Sign In</Text>}
                </Pressable>
                <View>
                    <Text style={{textAlign:"center"}}>Don't have an account?  <Text style={styles.signUp} onPress={()=>{ navigation.navigate('SignUp')}}>Sign Up</Text></Text>
                </View>
            </View>
            </View>
            </ScrollView>
            <Modal visible={errorUploadAlert !== null? true : null} onRequestClose={()=>{setErrorUploadAlert(null)}} presentationStyle='overFullScreen' transparent={true}>
              <ExpoStatusBar style='light' backgroundColor='rgba(0,0,0,0.5)'/>
                   <View style={{ flex: 1, ...styles.userProfileAlertContainer}}>
                            <View style={styles.userProfileSuccessAlert}>
                                    <MaterialIcons name="error" size={40} color="red" style={{marginBottom: 10}}/>
                                    <Text style={{color:"red", ...styles.errorAlertLabel}}>{errorUploadAlert == 'UserNotFoundException'? 'User Not Found' : errorUploadAlert == 'NotAuthorizedException'? 'Incorrect Password' : 'Error signing in'}</Text>
                                    <Text style={styles.errorAlertDescText}>{errorUploadAlert == 'UserNotFoundException'? 'The user does not exist; please sign up using an email address that is already registered.' : errorUploadAlert == 'NotAuthorizedException'? 'The password you entered is incorrect; please try again or reset your password.': 'An unknown error occured! Pls check your internet connection and try again.'}</Text>
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

export default SignIn

const styles = StyleSheet.create({
    container: {
        flex : 1, 
        alignItems:'center',
        padding: 40,
        backgroundColor:'white',
        paddingTop: StatusBar.currentHeight
    },
    LeotLogoView: {
        marginBottom: 100
    },
    LeotLogo: {
        fontSize: 70, 
        fontWeight: '700', 
        fontFamily:'cursive',
        color:'#FF0000'
    },
    welcomeText: { 
        textAlign:'center', 
        fontWeight: '600',
        fontSize: 25,
        marginBottom: 15
    },
    label: {
        fontSize: 13,
        fontWeight: '400'
    },
    emailInputField: {
        borderRadius: 5,
        marginTop: 5,
        padding: 10, 
        width: '100%'
    },
    passwordPressable: {
        flexDirection:"row",
        borderRadius: 5,
        marginTop: 5,
        padding: 10,
        width: '100%'
    },
    forgotPassword: {
        color:"#FF0000",
        marginTop: 20,
        fontWeight:'500'
    },
    signInBtn: {
        padding: 15,
        borderRadius: 5,
        marginTop: 25,
        marginBottom: 15
    },
    signingInTextCont: {
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    signingInText: {
        color:'white',
        fontWeight: '500',
        fontSize: 14
    },
    signInText: {
        textAlign: 'center',
        color:'white',
        fontWeight: '500',
        fontSize: 14
    },
    signUp: {
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
        padding: 20, 
        backgroundColor:'white', 
        borderRadius: 20, 
        elevation: 5, 
        alignItems: 'center',
        width: '70%'
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
    })