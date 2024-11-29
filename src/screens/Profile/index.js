import { useState, useEffect  } from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet} from 'react-native'
import { Entypo , Ionicons, FontAwesome6 } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';
import { storeImageData } from '../../Redux/imageData/imageDataActions';
import FastImage from 'react-native-fast-image';
import { StatusBar } from 'expo-status-bar';
import { Buffer } from "buffer";
import { useSelector, useDispatch } from 'react-redux'

const URL = 'https://dr4jupy057c0c.cloudfront.net/'
const bucket = 'staylit-storage-1914deba97d11-staging'

// User placeholder image 
const placeholderProfileImage = require('../../../assets/profile_pic.png')

const Profile = ()=>{
  const dbUser = useSelector(state => state.user.dbUser)
  const imageData = useSelector( state => state.image.imageData)
  const dispatch = useDispatch()
  const [showText, setShowText] = useState(false) // controls visibilty of the profile purpose container (true = visible, false = hidden)
  const navigation = useNavigation() // navigation object for transition between screens
  // Handles navigation to ProfileView screen to create or edit profile
  const goToProfile = ()=>{
     navigation.navigate('ProfileView')
  }

  // Formats the user profile creation date to month, Year
  const getJoinDate = ()=>{
    const localeDateString = dbUser?.date; // Example localeDateString in MM/DD/YYYY format

    // Split the string by the slash ("/") to extract month, day, and year
    const [month, , yearTime] = localeDateString.split('/');
    // Extract the year by splitting the yearTime and taking the first part
    const [year] = yearTime.trim().split(',');  
    console.log(`Month: ${month}, Year: ${year}`); // Outputs: "Month: 8, Year: 2023"
    const theMonth = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return `${theMonth[month - 1]}, ${year}`
  }
      
   // Handles navigation to the settings screen
   const navigateToSettings = ()=>{
    // navigate to settings screen
    navigation.navigate('Settings', { showAlert: false})
  }

  

useEffect(()=>{
    if(dbUser){
      getProfilePictureUrl(dbUser.key)
    }
}, [dbUser])

const getProfilePictureUrl = async (imageUrl)=>{
  const imageRequest = JSON.stringify(
    {
      "bucket": bucket,
      "key": `public/${imageUrl}`,
      "edits": {
        "resize": {
          "width": 180,
          "height": 180,
          "fit": "cover"
        }
      }
    }
  )
    const encoded = Buffer.from(imageRequest).toString('base64')
    dispatch(storeImageData(`${URL}${encoded}`))
 }
 
     return(
      <View style={styles.container}>
         <StatusBar style="dark" backgroundColor="white" />
          <View style={styles.header}>
            <Text style={styles.profileText}>Profile</Text>
            <Ionicons name="settings-sharp" size={24} color="black" onPress={navigateToSettings}/>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContentContainer}>
          <View style={{...styles.profileOverviewContain, padding: dbUser? 30 : 20}}>
             <View style={styles.userImageCont}>
                 {dbUser? imageData? <FastImage source={{uri : imageData, priority: FastImage.priority.high}} style={styles.userImage} resizeMode={FastImage.resizeMode.cover}/> : <View style={{width: 200, height: 200, borderRadius: 200, backgroundColor:'white', justifyContent:'center', alignItems:'center'}}><Text style={{fontSize: 100, color:'#F52F57', fontWeight:'600'}}>{dbUser.name[0]}</Text></View>: <FastImage source={placeholderProfileImage} style={styles.userImage} resizeMode={FastImage.resizeMode.cover}/>}
             </View> 
             
              {!dbUser? <View style={styles.profileViewTextContainer}>
                    <Text style={styles.buildProfileText}>Build your profile</Text>
                    <View style={styles.infoTextContainer}> 
                        <Text style={styles.infoText}>Tell others about yourself</Text>
                        <Entypo name="edit" size={18} color="#4C4C4C" onPress={goToProfile}/>
                    </View>
              </View> : <View style={styles.profileViewTextContainer}>
                            <Text  style={styles.userName}>{dbUser.name}</Text>
                            <Text style={styles.infoText}>{dbUser.email}</Text>
                              <View style={styles.userBioDataContainer}>
                                     <Entypo name="location-pin" size={24} color="#4C4C4C" />
                                     <Text style={styles.infoText}>{dbUser.state}, {dbUser.country}</Text>
                              </View>
                              <Text style={styles.infoText}>Joined {getJoinDate()}</Text>
                        </View>
                  }
              
          </View>
          {!dbUser && <View style={styles.profilePurposeContainer}>
            <View>
            <Text style={{fontSize: 16}}>Create your profile today to unlock a more personalized and secure apartment rental experience. { !showText && <Text style={{fontSize: 14, fontWeight: '700'}} onPress={()=>{setShowText(true)}}>Show more <FontAwesome6 name="chevron-down" size={14} color="black" /></Text>}</Text>
           { showText && <View>
              <Text style={styles.profileHighlightDesc}>By setting up a profile, you'll be able to : </Text>
              <View style={styles.profileHighlight}>
              <Ionicons name="radio-button-on-sharp" size={18} color="black" style={{marginRight: 5}} />
              <Text style={{fontSize: 16}}>Build trust with hosts and other users on the platform</Text>
              </View>

              <View style={styles.profileHighlight}>
              <Ionicons name="radio-button-on-sharp" size={18} color="black" style={{marginRight: 5}}/>
              <Text style={{fontSize: 16}}>Save your search preferences</Text>
              </View>

              <View style={styles.profileHighlight}>
              <Ionicons name="radio-button-on-sharp" size={18} color="black" style={{marginRight: 5}}/>
              <Text style={{fontSize: 16}}>Book apartments</Text>
              </View>

              <View style={styles.profileHighlight}>
              <Ionicons name="radio-button-on-sharp" size={18} color="black" style={{marginRight: 5}}/>
              <Text style={{fontSize: 16}}>Review hosts and comment about your rental experience</Text>
              </View>

              <View style={styles.profileHighlight}>
              <Ionicons name="radio-button-on-sharp" size={18} color="black" style={{marginRight: 5}}/>
              <Text style={{fontSize: 16}}>Enjoy tailored recommendations and seamless communication</Text>
              </View>
              <Text style={{fontSize: 16}}>Create your profile now and enhance your apartment search journey</Text>
            </View>}
            </View>
          </View>}

           { showText && <Pressable onPress={()=>{setShowText(false)}} style={styles.showLessCont}>
              <Text style={styles.showLessText}>Show less <Entypo name="chevron-up" size={14} color="black" /></Text>
           </Pressable>}

          <Pressable onPress={goToProfile} style={{...styles.goToProfileBtn, marginTop: dbUser? 40 : 0}}>
            <Text style={styles.goToProfileText}>{dbUser? 'View profile' : 'Create profile'}</Text>
          </Pressable>

      </ScrollView>
      </View>
     )
}

export default Profile

const styles = StyleSheet.create({
    container : {
        flex: 1, 
        backgroundColor: 'white'
    },
    header: {
      flexDirection:'row', 
      justifyContent:'space-between', 
      alignItems:'center', 
      padding: 20
    },
    profileText: {
      fontSize: 25, 
      fontWeight:'600'
    },
    scrollViewContentContainer: {
      padding: 20
    },
    profileOverviewContain: {
      elevation: 5, 
      alignItems:'center', 
      backgroundColor:'white', 
      borderRadius: 10, 
      marginBottom: 30,
      width: '100%'
    },
    buildProfileText: {
      fontSize: 20, 
      fontWeight: '500', 
      marginTop: 10, 
      marginBottom: 5
    },
    infoTextContainer: {
      flexDirection:'row',
      alignItems: 'center'
    },
    infoText: {
      fontWeight: '500', 
      color:'#4C4C4C', 
      fontSize: 14, 
      textAlign: 'center'
    },
    profileViewTextContainer: {
      alignItems: 'center', 
      marginTop: 10
    },
    userName: {
      fontSize: 20, 
      fontWeight: '600', 
      marginTop: 10, 
      marginBottom: 5
    },
    userBioDataContainer: {
      flexDirection:'row', 
      alignItems:'center'
    },
    profilePurposeContainer: {
      padding: 20, 
      borderWidth: 2, 
      borderRadius: 10, 
      marginBottom: 20, 
      borderColor:'lightgray'
    },
    profileHighlightDesc: {
      marginVertical: 10, 
      fontSize: 16
    },
    profileHighlight: {
      flexDirection: 'row', 
      alignItems: 'center', 
      padding: 5
    },
    showLessCont: {
      alignSelf:'center', 
      marginBottom : 20
    },
    showLessText: {
      fontSize: 14, 
      fontWeight: '700'
    },
    goToProfileBtn: {
      width: '50%', 
      borderRadius: 5,  
      padding: 10, 
      backgroundColor: '#8B0000', 
      alignItems: 'center', 
      alignSelf: 'center'
    },
    goToProfileText: {
      color:'white', 
      fontSize: 16, 
      fontWeight:'500', 
      marginRight: 5
    },
    userImageCont: {
      width: 180, 
      height: 180, 
      borderRadius: 180, 
      elevation: 5,
      backgroundColor:'white'
    },
    userImage: {
      width: 180, 
      height: 180, 
      borderRadius: 180
    }
})