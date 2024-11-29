import { useState } from 'react';
import {View, Text, TouchableOpacity, Image, ScrollView, Pressable, ActivityIndicator, StyleSheet, Modal} from 'react-native'
import { Entypo, Feather, FontAwesome, MaterialIcons, SimpleLineIcons, AntDesign} from '@expo/vector-icons'
import { signOut, getCurrentUser } from 'aws-amplify/auth';
import { DataStore } from 'aws-amplify/datastore'
import { useNavigation, useRoute } from '@react-navigation/native';
import { UserAuth, AppStatus} from '../../models';
import { useUserAuthContext } from '../../Context/userContext';
import { useSelector } from 'react-redux'
import { StatusBar } from 'expo-status-bar';

const SettingsScreen = ({setLeasing, setUserSignInStatus})=>{
    const dbUser = useSelector(state => state.user.dbUser)
    const userCardFound = useSelector( state => state.card.userCardFound)
    const {userAuth} = useUserAuthContext()
    const [loadingIndicator, setLoadingIndicator] = useState(false)
    const [switchLoader, setSwitchLoader] = useState(false)
    const navigation = useNavigation()
    const route = useRoute()
    const { showAlert } = route.params
    const [successMsg, setSuccessMsg] = useState(true)


    const switchToHosting = async ()=>{
        const userAuthObj = await DataStore.query(UserAuth, (u)=> u.sub.eq(userAuth))
        console.log('userAuthObj : ', userAuthObj)
        const setAppSwitch = await DataStore.save(UserAuth.copyOf(userAuthObj[0], (updated)=>{
            updated.userAppType = AppStatus.HOST
        }))
        console.log('setAppSwitch : ', setAppSwitch)
        setLeasing(AppStatus.HOST)
        setSwitchLoader(false)
    }

    const handleSignOut = async()=>{
        try {
            const getUserAuthObj = await DataStore.query(UserAuth, (u)=> u.sub.eq(userAuth))
            console.log('getUserAuthObj : ', getUserAuthObj)
            const updateSignInStatusToFalse = await DataStore.save(UserAuth.copyOf(getUserAuthObj[0], (updated)=>{
                    updated.signInStatus = 'false'
            }))
            console.log('updateSignInStatusToFalse : ', updateSignInStatusToFalse)
            await DataStore.clear();
            console.log('Cleared Successfully')
            await signOut()
            setLoadingIndicator(false)
            setUserSignInStatus(updateSignInStatusToFalse.signInStatus)
          } catch (error) {
            console.log('error signing out: ', error.message);
          }
    }
   
    const forgotPassword = async ()=>{
        const { userId } = await getCurrentUser()  
        const getUserAuthData = await DataStore.query(UserAuth, (u)=> u.sub.eq(userId))
        console.log('getUserAuthData : ', getUserAuthData[0])
        navigation.navigate('resetPassword', {email: getUserAuthData[0].email, navigateToHome: true})
    }
   
    return(
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
          <StatusBar style="dark" backgroundColor="#F5F5F5" />
         <View style={styles.header}>
            <TouchableOpacity style={{marginRight: 20}} >
            <Feather name="arrow-left" size={20} color="black" onPress={()=>{navigation.goBack()}}/>
            </TouchableOpacity>
            <Text style={styles.settingsText}>Settings</Text>
         </View>
          
            <Pressable onPress={()=>{setSwitchLoader(true); switchToHosting()}} style={styles.switchToHostingContainer}>
                <View style={styles.switchInnerContainer}>
                    <Text style={styles.hostApartment}>Host an apartment</Text>
                    <Text style={styles.hostDescText}>It's simple to get set up and start earning</Text>
                </View>
                <Image source={require('../../../assets/apartmentHostImage.jpeg')} style={{width: 100, height: 100, borderRadius: 20}}/>
            </Pressable>
            <View style={styles.accountSecurityContainer}>
                <Text style={styles.labelText}>Account and security</Text>
                <View style={{marginTop: 15}}>
                    <Pressable onPress={()=>{navigation.navigate('Profile')}} style={styles.securityOptions}>
                         <Feather name="user" size={25} color="#4C4C4C" style={{marginRight: 20}}/>
                         <Text style={styles.securityText}>{dbUser? 'Account Information' : 'Create profile'}</Text>
                         <Entypo name="chevron-right" size={24} color="#4C4C4C" />
                    </Pressable>
                     <Pressable onPress={()=>{userCardFound? navigation.navigate('cardInfo') : navigation.navigate('Payments')}} style={styles.securityOptions}>
                         <Feather name="credit-card" size={25} color="#4C4C4C" style={{marginRight: 20}}/>
                         <Text style={styles.securityText}>{userCardFound? 'Change debit card' : 'Add debit card'}</Text>
                         <Entypo name="chevron-right" size={24} color="#4C4C4C" />
                    </Pressable>
                    <Pressable onPress={forgotPassword} style={styles.securityOptions}>
                         <MaterialIcons name="password" size={25} color="#4C4C4C" style={{marginRight: 20}}/>
                         <Text style={styles.securityText}>forgot password</Text>
                         <Entypo name="chevron-right" size={24} color="#4C4C4C" />
                    </Pressable>
                    <Pressable onPress={()=>{ setLoadingIndicator(true); handleSignOut()}} style={styles.securityOptions}>
                    <FontAwesome name="sign-out" size={24} color="#4C4C4C" style={{marginRight: 20}}/>
                         <Text style={styles.securityText}>Sign out</Text>
                         <Entypo name="chevron-right" size={24} color="#4C4C4C" />
                    </Pressable>
                    
                </View>
            </View>

            <View style={styles.otherContainer}>
                <Text style={styles.labelText}>other</Text>
                <View style={{marginTop: 15}}>
                    <Pressable onPress={()=>{navigation.navigate('privacyPolicy')}} style={styles.securityOptions}>
                        <SimpleLineIcons name="lock" size={24} color="#4C4C4C" style={{marginRight: 20}}/>
                         <Text style={styles.securityText}>Privacy policy</Text>
                         <Entypo name="chevron-right" size={24} color="#4C4C4C" />
                    </Pressable>
                     <Pressable onPress={()=>{navigation.navigate('TermsAndConditions')}} style={styles.securityOptions}>
                         <AntDesign name="book" size={24} color="#4C4C4C" style={{marginRight: 20}}/>
                         <Text style={styles.securityText}>Terms and conditions</Text>
                         <Entypo name="chevron-right" size={24} color="#4C4C4C" />
                    </Pressable>
                    <Pressable onPress={()=>{navigation.navigate('ContactUs')}} style={styles.securityOptions}>
                    <MaterialIcons name="call-made" size={24} color="#4C4C4C" style={{marginRight: 20}}/>
                         <Text style={styles.securityText}>contact support</Text>
                         <Entypo name="chevron-right" size={24} color="#4C4C4C" />
                    </Pressable>
                    <Pressable onPress={()=>{navigation.navigate('AboutUs')}} style={styles.securityOptions}>
                         <Feather name="users" size={24} color="#4C4C4C" style={{marginRight: 20}}/>
                         <Text style={styles.securityText}>About us</Text>
                         <Entypo name="chevron-right" size={24} color="#4C4C4C" />
                    </Pressable>
                    <View style={styles.securityOptions}>
                         <Text style={styles.securityText}>App version</Text>
                         <Text>1.0.0</Text>
                    </View>  
                </View> 
        </View>
        
        <Modal visible={loadingIndicator} onRequestClose={()=>{}} presentationStyle='overFullScreen' transparent={true}>
        <StatusBar style="light" backgroundColor="rgba(0,0,0,0.5)"/>
            <View style={{ flex: 1, ...styles.loadingIndicatorContainer}}>
                    <View style={styles.loadingInnerContainer}>
                        <ActivityIndicator size='large' color='red' style={{marginBottom: 5}}/>
                        <Text style={{fontWeight: '600'}}>Signing out</Text>
                    </View>
            </View>
        </Modal>

        <Modal visible={switchLoader} onRequestClose={()=>{}} presentationStyle='overFullScreen' transparent={true}>
        <StatusBar style="light" backgroundColor="rgba(0,0,0,0.5)"/>
            <View style={{ flex: 1, ...styles.loadingIndicatorContainer}}>
                    <View style={styles.loadingInnerContainer}>
                        <ActivityIndicator size='large' color='red' style={{marginBottom: 5}}/>
                        <Text style={{fontWeight: '600'}}>Swiching To Hosting</Text>
                    </View>
            </View>
        </Modal>
        
        <Modal visible={showAlert && successMsg} onRequestClose={()=>{ setSuccessMsg(false) }} presentationStyle='overFullScreen' transparent={true}>
                <StatusBar style="light" backgroundColor="rgba(0,0,0,0.5)"/>
                <View style={{flex: 1, ...styles.userProfileAlertContainer}}>
                            <View style={styles.userProfileSuccessAlert}>
                                    <Entypo name="upload-to-cloud" size={60} color="rgba(0,0,0,0.5)" /> 
                                    <Text style={styles.successText}>Success</Text>
                                    <Text style={styles.profileSuccessText}>Password reset successful</Text>
                                    <Pressable onPress={()=>{ setSuccessMsg(false) }} style={{backgroundColor: 'black', ...styles.closeProfileAlert}}>
                                        <Text style={styles.closeAlertText}>OK</Text>
                                    </Pressable>
                                </View>
                </View>
        </Modal>
    </ScrollView>
    )
}

export default SettingsScreen

const styles = StyleSheet.create({
    container: {
        padding : 20, 
        backgroundColor:'#F5F5F5'
    },
    header: {
        flexDirection:'row', 
        alignItems:'center'
    },
    settingsText: {
        fontSize: 20, 
        fontWeight: '600'
    },
    switchToHostingContainer: {
        flexDirection:"row", 
        alignItems:'center', 
        marginVertical: 20, 
        width: '100%', 
        padding: 20, 
        elevation: 5, 
        backgroundColor:'white', 
        borderRadius: 10
    },
    switchInnerContainer: {
        width: '55%',
        marginRight:'auto'
    },
    hostApartment: {
        fontSize: 18, 
        fontWeight:'600', 
        marginBottom: 5
    },
    hostDescText: {
        fontSize: 14,
        color:"#4C4C4C", 
        fontWeight: '500'
    },
    accountSecurityContainer: {
        marginBottom: 30, 
        backgroundColor:'white', 
        borderRadius: 10, 
        padding: 20
    },
    labelText: {
        fontSize: 18, 
        fontWeight:'600'
    },
    securityOptions: {
        flexDirection:'row', 
        alignItems:'center', 
        paddingVertical: 10, 
        borderBottomWidth: 2, 
        borderBottomColor:'lightgray'
    },
    securityText: {
        fontSize: 15, 
        marginRight:'auto'
    },
    otherContainer: {
        backgroundColor:'white', 
        borderRadius: 10, 
        padding: 20
    },
    loadingIndicatorContainer: {
        backgroundColor:'rgba(0,0,0,0.5)', 
        justifyContent:'center', 
        alignItems:'center'
    },
    loadingInnerContainer: {
        padding: 30, 
        backgroundColor:'white', 
        justifyContent:'center', 
        alignItems:'center', 
        borderRadius: 10
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
    successText: {
        color:"green", 
        fontWeight: '600', 
        fontSize: 16, 
        marginBottom: 0,

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
        borderRadius: 10
    },
    closeAlertText: {
        color:'white', 
        fontWeight: '600', 
        fontSize: 14
    }
})