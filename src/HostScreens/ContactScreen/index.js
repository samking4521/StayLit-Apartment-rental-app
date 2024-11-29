import { useState, useEffect } from "react";
import { View, Text, Image, Pressable, StyleSheet, Linking, ScrollView } from "react-native";
import Clipboard from '@react-native-clipboard/clipboard';
import {Ionicons, FontAwesome5, Foundation, SimpleLineIcons} from '@expo/vector-icons'
import { useRoute, useNavigation } from "@react-navigation/native";
import { Buffer } from "buffer";
import { StatusBar } from "expo-status-bar";

const URL = 'https://dr4jupy057c0c.cloudfront.net/'
const bucket = 'staylit-storage-1914deba97d11-staging'


const ContactScreen = ()=>{
    const route = useRoute()
    const {userData, userType} = route.params
    const navigation = useNavigation()
    const [userImage, setUserImage] = useState(null)

    useEffect(()=>{
      if(userData){
        getUserContactImage(userData?.key)
      }
    }, [userData])

    const getUserContactImage = (imageKey)=>{
      const imageRequest = JSON.stringify(
        {
          "bucket": bucket,
          "key": `public/${imageKey}`,
          "edits": {
            "resize": {
              "width": 190,
              "height": 190,
              "fit": "cover"
            }
          }
        }
      )
      const encoded = Buffer.from(imageRequest).toString('base64')
      setUserImage(`${URL}${encoded}`)
   }
    
    const openWhatsApp = (phoneNumber) => {
        let url = `whatsapp://send?phone=${phoneNumber}`;
        Linking.openURL(url).catch((err) => {
          console.error("Couldn't open WhatsApp", err);
        });
      };
      
    const openPhoneDialer = (phoneNumber) => {
        Clipboard.setString(phoneNumber);
        let url = `tel:${phoneNumber}`;
        Linking.openURL(url).catch((err) => {
          console.error("Couldn't open dialer", err);
        });
      };

      const openEmailClient = (email) => {
        let url = `mailto:${email}`;
        Linking.openURL(url).catch((err) => {
          console.error("Couldn't open email client", err);
        });
      };
    
    return(
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <StatusBar style='dark' backgroundColor="white"/>
           <Pressable onPress={()=>{ navigation.goBack() }}>
              <Ionicons name="chevron-back-sharp" size={30} color="black" />
           </Pressable>
           <View style={styles.contentContainer}>
              <View style={styles.box}>
                    <View style={styles.imageContainer}>
                                {userImage? <Image source={{uri : userImage}} style={styles.imageStyle}/> : <View style={{...styles.imageStyle, justifyContent:'center', alignItems:'center'}}><Text style={{fontSize: 100, color:'#F52F57', fontWeight:'600'}}>{userData.name[0]}</Text></View>}
                        </View>
                    <View>
                        <Text style={styles.userName}>{userData.name}</Text>
                        <Text style={styles.userData}>{userData.state}, {userData.country}</Text>
                         <Text style={styles.userData}>Occupant</Text>
                    </View>
              </View>

              <View style={{marginTop: 40}}>
                <View style={styles.alignContainer}>
                    <View style={{marginRight: 20}}>
                            <FontAwesome5 name="whatsapp" size={50} color="green" />
                    </View>
                    <View style={{marginRight:"auto"}}>
                        <Text style={styles.contactLabel}>Whatsapp</Text>
                        <Text style={styles.contactData}>{`+${userData.callingCode} ${userData.whatsapp}`}</Text>
                    </View>
                  { userType == 'user' && <Pressable onPress={()=>{openWhatsApp(`+${userData.callingCode}${userData.whatsapp}`)}} style={styles.contactNavigate}>
                        <Ionicons name="chatbox-outline" size={20} color="#4C4C4C" />
                    </Pressable>}
                </View>
                  
                <View style={{...styles.alignContainer, marginVertical: 30}}>
                    <View style={{marginRight: 20}}>
                            <Image source={require('../../../assets/gmail.png')} style={styles.mailImg}/>
                    </View>
                    <View style={{marginRight:"auto", width: '60%'}}>
                        <Text style={styles.contactLabel}>Email</Text>
                        <Text style={styles.contactData}>{userData.email.slice(0, userData.email.indexOf('@'))+'...'}</Text>
                    </View>
                   { userType == 'user' && <Pressable onPress={()=>{openEmailClient(userData.email)}} style={styles.contactNavigate}>
                    <FontAwesome5 name="telegram-plane" size={24} color="#4C4C4C" />
                    </Pressable>}
                </View>

                <View style={styles.alignContainer}>
                    <View style={{marginRight: 20}}>
                        <Foundation name="telephone" size={50} color="blue" />
                    </View>
                    <View style={{marginRight:"auto"}}>
                        <Text style={styles.contactLabel}>Telephone</Text>
                        <Text style={styles.contactData}>{userData.telephone}</Text>
                    </View>
                   { userType == 'user' && <Pressable onPress={()=>{openPhoneDialer(`${userData.telephone}`)}} style={styles.contactNavigate}>
                         <SimpleLineIcons name="call-out" size={20} color="#4C4C4C" />
                    </Pressable>}
                </View>
              </View>
           </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor:'white', 
      padding : 20
    },
    contentContainer: {
      flex: 1, 
      justifyContent:'flex-start', 
      paddingTop: 20
    },
    box : {
          backgroundColor:'white',
          borderRadius: 10,
          padding: 10,
          alignItems:'center',
          elevation: 5
    },
    imageContainer: {
        borderWidth: 2, 
        borderColor:'lightgray', 
        borderRadius: 190, 
        marginBottom: 10
    },
    imageStyle: {
      width: 190, 
      height: 190, 
      borderRadius: 190
    },
    userName: {
      textAlign: "center", 
      fontSize: 18, 
      fontWeight: '600'
    },
    userData: {
      textAlign: "center", 
      fontSize: 14, 
      fontWeight: "500", 
      color: '#4C4C4C'
    },
    alignContainer: {
      flexDirection:'row', 
      alignItems:"center"
    },
    contactLabel: {
      fontSize: 14, 
      color:'#4C4C4C'
    },
    contactData: {
      fontWeight: '500', 
      fontSize: 16
    },
    contactNavigate: {
      width: 40, 
      height: 40, 
      borderRadius: 40, 
      backgroundColor:'#DEE2E6', 
      justifyContent:"center", 
      alignItems:"center"
    },
    mailImg: {
      width: 40, 
      height: 30
    }
})

export default ContactScreen

