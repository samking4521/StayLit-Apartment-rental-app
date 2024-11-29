import { useState } from 'react'
import {View, Text, Pressable, TextInput, ScrollView, StyleSheet, Keyboard, KeyboardAvoidingView} from 'react-native'
import { useNavigation } from '@react-navigation/native'

const SignUp = ()=>{
    const [email, setEmail] = useState('') // stores user email
    const [focus, setFocus] = useState(false) // Controls visibility of the email label (true = visible, false = hidden)
    const [chkEmailValid, setChkEmailValid] = useState(false) // Controls visibilty of feedback text if email validation returns false (true = visible, false = hidden)
    const navigation = useNavigation() // Navigation object for screen transition
    
    // Handles email update
    const onEmailChange = (val)=>{
        setEmail(val)
        if(val.includes('.') && val.includes('.com')){
            setChkEmailValid(false)
        }
    }
    
    /*
      * Handles onPress event on the continue btn
      * Navigate to password screen
      * @arguement {string} email - The user's email address.
    */
    const navigateToPasswordScreen  = ()=>{
        // Dismiss keyboard
        Keyboard.dismiss()
        // If email validation checks return true (i.e includes '@' and '.com')
            if(email.includes('@') && email.includes('.com')){
                // navigate to password screen
                navigation.navigate('EnterPwd', {
                    email
                })
            }
            // if email validation check returns false
            else{
                // shows invalid email as a feedback text to user
                setChkEmailValid(true)
            }
    }

  
  
    return(
        <KeyboardAvoidingView
        behavior={'padding'}
        style={{ flex : 1 }}
        >
        <ScrollView keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator={false} contentContainerStyle={{flexGrow: 1}}>
           <View style={styles.container}>
            <View style={styles.LeotLogoCont}>
                <Text style={styles.LeotLogo}>StayLit</Text>
            </View>
            <View>
            <Text style={styles.createAcc}>Create an account</Text>
                <View style={{marginTop: 15}}>
                {focus && <Text style={styles.emailText}>Email address</Text>}
                    <TextInput style={{...styles.emailInput, borderWidth: focus? 2 : 1, borderColor: focus ? '#FF0000' : 'gray' }} onFocus={()=>{setFocus(true)}} onBlur={()=>{setFocus(false)}} value={email} placeholder='Email address' onChangeText={onEmailChange} autoCapitalize='none' autoComplete='email' keyboardType='email-address' autoCorrect={false}/>
                    { chkEmailValid && <Text style={styles.emailInvalidText}>email not valid!</Text>}

                </View>
                <Pressable onPress={navigateToPasswordScreen} style={styles.continueBtn}>
                    <Text style={{textAlign: 'center', color:'white', fontWeight: '500', fontSize: 14}}>Continue</Text>
                </Pressable>
                <View>
                    <Text style={{textAlign:"center"}}>Already have an account?  <Text style={styles.loginText} onPress={()=>{navigation.navigate('SignIn')}}>Login</Text></Text>
                </View>
            </View>
           </View>
        </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default SignUp

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 40,
        backgroundColor:'white'
    },
    LeotLogoCont: {
        alignItems: 'center',
        marginBottom: 100,
        
    },
    LeotLogo: {
        fontSize: 70,
        fontWeight: '700',
        fontFamily:'cursive',
        color:'#FF0000'
    },
    createAcc: {
        textAlign:'center',
        fontSize: 20,
        fontWeight: '600'
    },
    emailText: {
        fontSize: 13,
        fontWeight: '400'
    },
    emailInput: {
        borderRadius: 5,
        marginTop: 5,
        padding: 10,
    },
    emailInvalidText: {
        color:'#FF0000',
        fontWeight: '500',
        fontSize: 14
    },
    continueBtn: {
        backgroundColor: '#8B0000',
        padding: 15,
        borderRadius: 5,
        marginTop: 25,
        marginBottom: 15
    },
    loginText: {
        color:'#FF0000',
        fontSize: 14,
        fontWeight:'500'
    }
})
