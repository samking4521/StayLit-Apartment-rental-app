import { View, Text, Image, Pressable, StyleSheet, Linking, ScrollView } from "react-native";
import Clipboard from '@react-native-clipboard/clipboard';
import {Ionicons, FontAwesome5, Foundation, SimpleLineIcons, Fontisto} from '@expo/vector-icons'
import { useRoute, useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useUserAuthContext } from "../../Context/userContext";
import { useEffect, useState } from "react";
import { Buffer } from "buffer";
import { useSelector } from "react-redux";

const URL = 'https://dr4jupy057c0c.cloudfront.net/'
const bucket = 'staylit-storage-1914deba97d11-staging'

const ContactScreen = ()=>{
    const dbUser = useSelector( state => state.user.dbUser)
    const route = useRoute() // route object for data transmission between screens
    const {hostData, starReview, apartment} = route.params // host data object, image, and no of host review stars destructured from the route object
    const navigation = useNavigation() // navigation object for transitions between screens
    const [hostImage, setHostImage] = useState(null)

    useEffect(()=>{
      if(hostData){
        getHostContactImage(hostData?.key)
      }
    }, [hostData])

    const getHostContactImage = (imageKey)=>{
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
      setHostImage(`${URL}${encoded}`)
   }
  

   function convertDate(dateString) {
    const months = [
      "January", "February", "March", "April", "May", "June", "July", "August", 
      "September", "October", "November", "December"
    ];
  
    // Split the date string into day, month, and year
    const [day, month, year] = dateString.split('/');
  
    // Function to get the ordinal suffix for the day
    function getOrdinalSuffix(day) {
      const j = day % 10;
      const k = day % 100;
      if (j === 1 && k !== 11) {
        return day + "st";
      }
      if (j === 2 && k !== 12) {
        return day + "nd";
      }
      if (j === 3 && k !== 13) {
        return day + "rd";
      }
      return day + "th";
    }
  
    // Format the date into the desired string
    const formattedDay = getOrdinalSuffix(parseInt(day));
    const formattedMonth = months[parseInt(month) - 1]; // months array is 0-based
    return `${formattedDay} of ${formattedMonth}, ${year}`;
  }

  
    const openWhatsApp = (phoneNumber, dbUser, apartment) => {
      const bullet = '\u2022';
      const dateOfBirth = convertDate(dbUser.dob)
      const message = `*Hello, I'm ${dbUser.name}, and I'm interested in the apartment you listed on StayLit.*
  
        ${bullet} *My Name*: ${dbUser.name}
        ${bullet} *Contact Number*: ${dbUser.telephone}
        ${bullet} *Date of Birth*: ${dateOfBirth}
        ${bullet} *State of origin*: ${dbUser.state}
        ${bullet} *Ethnicity*: ${dbUser.ethnicity}
        ${bullet} *Apartment Name*: ${apartment.apartmentTitle}
        ${bullet} *Apartment Address*: ${apartment.address}
        ${bullet} *Apartment Price*: N${apartment.formattedPrice} ${bullet} ${apartment.leaseDuration}
        ${bullet} *Apartment Move-In price (One-time initial deposit)*: N${apartment.moveInCost}

         _Please let me know if the apartment is available and if we can discuss further details. Thank you!_`;

          // URL encode the message
          const urlEncodedMessage = encodeURIComponent(message);

       // Construct the WhatsApp URL with the provided phone number
        let whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${urlEncodedMessage}`;
      // Open WhatsApp with the message
          Linking.canOpenURL(whatsappUrl)
          .then((supported) => {
            if (supported) {
              Linking.openURL(whatsappUrl);
            } else {
              Alert.alert("Error", "WhatsApp is not installed on your device");
            }
          })
          .catch((err) => console.error("An error occurred", err));
      };
      
       /**
             * Opens the phone dialer with the specified phone number and copies the number to the clipboard.
             * 
             * @param {string} phoneNumber - The phone number to dial. 
        */
    const openPhoneDialer = (phoneNumber) => {
      // Copy the phone number to the clipboard
        Clipboard.setString(phoneNumber);
        // Construct the tel URL with the provided phone number
        let url = `tel:${phoneNumber}`;
        // Attempt to open the URL using Linking
        Linking.openURL(url).catch((err) => {
           // Log an error message if the URL can't be opened
          console.error("Couldn't open dialer", err);
        });
      };

      /**
             * Opens the default email client with a new email draft addressed to the specified email address.
             * @param {string} email - The email address to which the email should be sent.
      */
      const openEmailClient = (email, dbUser, apartment) => {
        const bullet = '\u2022';
        const dateOfBirth = convertDate(dbUser.dob)
     
      // Prepare the email content
      const subject = "Inquiry for Apartment";
      const body = `Hello, I'm ${dbUser.name}, and I'm interested in the apartment you listed on StayLit.
  
        ${bullet} My Name: ${dbUser.name}
        ${bullet} Contact Number: ${dbUser.telephone}
        ${bullet} Date of Birth: ${dateOfBirth}
        ${bullet} State of origin: ${dbUser.state}
        ${bullet} Ethnicity: ${dbUser.ethnicity}
        ${bullet} Apartment Name: ${apartment.apartmentTitle}
        ${bullet} Apartment Address: ${apartment.address}
        ${bullet} Apartment Price: N${apartment.formattedPrice} ${bullet} ${apartment.leaseDuration}
        ${bullet} Apartment Move-In price (One-time initial deposit): N${apartment.moveInCost}

         Please let me know if the apartment is available and if we can discuss further details.
         
         Thanks,
         ${dbUser.name}`
         ;


          // Construct the mailto URL with the provided email address
          let url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
          // Attempt to open the URL using Linking
          Linking.openURL(url).catch((err) => {
            // Log an error message if the URL can't be opened
            alert("Couldn't open email client", err);
          });
            };
      
    return(
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
              <StatusBar style="dark" backgroundColor={'white'}/>
              <Ionicons onPress={()=>{ navigation.goBack() }} name="chevron-back-sharp" size={30} color="#4C4C4C" style={{ alignSelf:'flex-start' }}/>
              <View style={styles.contactInfoContainer}>
              <View style={styles.box}>
                    <View style={styles.imageCont}>
                               {hostImage? <Image source={{uri : hostImage}} style={styles.image}/> : <View style={{...styles.image, backgroundColor:'lightgray', justifyContent:'center', alignItems:'center'}}><Text style={{fontSize: 80, fontWeight:'800', color:'white'}}>{hostData.name[0]}</Text></View>}
                        </View>
                    <View>
                        <Text style={styles.name}>{hostData.name}</Text>
                        <Text style={styles.bioData}>{hostData.state}, {hostData.country}</Text>
                        <View style={styles.hostRevCont}>
                                        <Text style={styles.revText}>Agent &#8226;  </Text>
                                        <Fontisto name="star" size={16} color="#D4C63B" style={{marginRight: 2}} />
                                        <Text style={styles.starLength}>{starReview? starReview.toFixed(1) : 'New'}</Text>
                                </View>
                    </View>
              </View>

              <View style={{marginTop: 40}}>
                <View style={styles.contactCont}>
                    <View style={styles.contactIconCont}>
                            <FontAwesome5 name="whatsapp" size={50} color="green" />
                    </View>
                    <View style={{marginRight:"auto"}}>
                        <Text style={styles.contactType}>Whatsapp</Text>
                        <Text style={styles.contactInfo}>{`+${hostData.callingCode} ${hostData.whatsapp}`}</Text>
                    </View>
                    <Pressable onPress={()=>{openWhatsApp(`+${hostData.callingCode}${hostData.whatsapp}`, dbUser, apartment)}} style={styles.contactNavButton}>
                        <Ionicons name="chatbox-outline" size={20} color="#4C4C4C" />
                    </Pressable>
                </View>
                  
                <View style={{...styles.contactCont, marginVertical: 30}}>
                    <View style={styles.contactIconCont}>
                            <Image source={require('../../../assets/gmail.png')} style={styles.emailImg}/>
                    </View>
                    <View style={{marginRight:"auto", width: '60%'}}>
                        <Text style={styles.contactType}>Email</Text>
                        <Text style={styles.contactInfo}>{hostData.email.slice(0, hostData.email.indexOf('@'))+'...'}</Text>
                    </View>
                    <Pressable onPress={()=>{openEmailClient(hostData.email, dbUser, apartment)}} style={styles.contactNavButton}>
                    <FontAwesome5 name="telegram-plane" size={24} color="#4C4C4C" />
                    </Pressable>
                </View>

                <View style={styles.contactCont}>
                    <View style={styles.contactIconCont}>
                        <Foundation name="telephone" size={50} color="blue" />
                    </View>
                    <View style={{marginRight:"auto"}}>
                        <Text style={styles.contactType}>Telephone</Text>
                        <Text style={styles.contactInfo}>{`+${hostData.callingCode} ${hostData.telephone}`}</Text>
                    </View>
                    <Pressable onPress={()=>{openPhoneDialer(`+${hostData.callingCode}${hostData.telephone}`)}} style={styles.contactNavButton}>
                         <SimpleLineIcons name="call-out" size={20} color="#4C4C4C" />
                    </Pressable>
                </View>
              </View>
           </View>
        </ScrollView>
    )
}

export default ContactScreen

const styles = StyleSheet.create({
   container: {
      flex: 1, 
      backgroundColor:'white',
      padding : 20
   },
   contactInfoContainer: {
      flex: 1,
      marginTop: 20
   },
    box : {
      backgroundColor:'white',
      borderRadius: 10,
      padding: 10,
      alignItems:'center',
      elevation: 5
    },
    imageCont : {
      borderWidth: 2, 
      borderColor:'lightgray', 
      borderRadius: 190, 
      marginBottom: 10
    },
    image: {
      width: 190, 
      height: 190, 
      borderRadius: 190
    },
    name : {
      textAlign:"center", 
      fontSize: 18, 
      fontWeight:'600'
    },
    bioData: {
      textAlign:"center", 
      fontSize: 14, 
      fontWeight:"500", 
      color:'#4C4C4C'
    },
    hostRevCont: {
      flexDirection:'row', 
      alignItems:'center', 
      justifyContent:"center"
    },
    revText: {
      textAlign:"center", 
      fontSize: 14, 
      fontWeight:"500", 
      color:'#4C4C4C'
    },
    starLength: {
      fontWeight:"600", 
      fontSize: 14
    },
    contactCont: {
      flexDirection:'row',
       alignItems:"center"
    },
    contactIconCont: {
      marginRight: 20
    },
    emailImg: {
      width: 40, 
      height: 30
    },
    contactType: {
      fontSize: 14, 
      color:'#4C4C4C'
    },
    contactInfo: {
      fontWeight: '500', 
      fontSize: 16
    },
    contactNavButton: {
       width: 40, 
       height: 40, 
       borderRadius: 40, 
       backgroundColor:'#DEE2E6', 
       justifyContent:"center", 
       alignItems:"center"
    }
})


