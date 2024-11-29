import { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { FontAwesome} from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import FastImage from 'react-native-fast-image';
import { Buffer } from 'buffer';
import dayjs from 'dayjs'

const URL = 'https://dr4jupy057c0c.cloudfront.net/'
const bucket = 'staylit-storage-1914deba97d11-staging'

const AgentInfo = ({payment, userData, hostData, starReview, totalRevLength})=>{
  const [hostImage, setHostImage] = useState(null)
  const [userImage, setUserImage] = useState(null)
  const [yearJoined, setYearJoined] = useState(null)
  const [monthJoined, setMonthJoined] = useState(null)
  const [hostYearJoined, setHostYearJoined] = useState(null)
  const [hostMonthJoined, setHostMonthJoined] = useState(null)
  const navigation = useNavigation()

  const userJoinDate = ()=>{
    const date = dayjs(userData.date, 'M/D/YYYY, h:mm:ss A');
    const month = date.month()
    const year = date.year()
    const monthOfYrArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    return { year, monthOfYearName: monthOfYrArr[month] }
}


const formatDate = ()=>{
  const date = dayjs(hostData.date, 'M/D/YYYY, h:mm:ss A');
  const month = date.month()
  const year = date.year()
  const monthOfYrArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
  return { year, monthOfYearName: monthOfYrArr[month] }
}


useEffect(()=>{
    if(hostData && !payment){
      const {year, monthOfYearName} = formatDate()
      setHostYearJoined(year)
      setHostMonthJoined(monthOfYearName)
    }
}, [hostData, payment])

useEffect(()=>{
  if(userData && payment){
    const {year, monthOfYearName} = userJoinDate()
    setYearJoined(year)
    setMonthJoined(monthOfYearName)
  }
}, [userData, payment])



   const getUserImageUrl = (imageKey)=>{
    const imageRequest = JSON.stringify(
      {
        "bucket": bucket,
        "key": `public/${imageKey}`,
        "edits": {
          "resize": {
            "width": 80,
            "height": 80,
            "fit": "cover"
          }
        }
      }
    )
    const encoded = Buffer.from(imageRequest).toString('base64')
    setUserImage(`${URL}${encoded}`)
   }

   const getHostImageUrl = (imageKey)=>{
    const imageRequest = JSON.stringify(
      {
        "bucket": bucket,
        "key": `public/${imageKey}`,
        "edits": {
          "resize": {
            "width": 80,
            "height": 80,
            "fit": "cover"
          }
        }
      }
    )
    const encoded = Buffer.from(imageRequest).toString('base64')
    setHostImage(`${URL}${encoded}`)
   }
   
    useEffect(()=>{
      if(hostData){
        getHostImageUrl(hostData?.key)
      }
   }, [hostData])

   useEffect(()=>{
      if(userData){
        getUserImageUrl(userData?.key)
      }
      
   }, [userData])
 
    return(
      <View style={styles.container}>
        <View style={styles.hostInfoCont}>
          <View style={{marginRight: 'auto', width: 300}}>
              <Text style={styles.header}>{ payment? `Occupied by ${userData?.name}` : 'Listed by you' }</Text>
              <Text style={styles.joinedDate}>{ payment? `Joined in ${monthJoined}, ${yearJoined}` : `Joined in ${hostMonthJoined}, ${hostYearJoined}`}</Text>
          </View>
          <View style={{...styles.hostImageStyle, elevation: 5, backgroundColor:'white'}}>
                {payment? userImage? <FastImage source={{uri : userImage,  priority: FastImage.priority.high}} style={styles.hostImageStyle} resizeMode={FastImage.resizeMode.cover}/> :
                 <View style={styles.placeHolderImage}>
                    <Text style={styles.placeHolderImageText}>{hostData?.name[0]}</Text>
                  </View> : 
                  hostImage ? <FastImage source={{uri : hostImage,  priority: FastImage.priority.high}} style={styles.hostImageStyle} resizeMode={FastImage.resizeMode.cover}/> :
                   <View style={styles.placeHolderImage}>
                        <Text style={styles.placeHolderImageText}>{hostData?.name[0]}</Text>
                    </View>
                     }
          </View>
        </View>
  
      {!payment && <View style={{...styles.alignContainer, marginBottom: 10}}>
             <FontAwesome name="star" size={24} color="black" style={styles.starIcon}/>
             <Text style={styles.starIconText}>{totalRevLength.length>=2? Number(starReview).toFixed(1) : 'New'} &#8226; {totalRevLength.length} Reviews</Text>
      </View>}
    
    <View>
      <Text style={styles.hostInfoDescText}>{ payment? `Congratulations, ${userData.name} has completed payment and is legally authorized to occupy the apartment. Please assist occupant with a smooth and welcoming settlement. Thank you!` : 'As a Host you should be highly commited to ensure people secure nice apartments, in an environment where they desire to be.'}</Text>
    </View>
     { payment? <Pressable onPress={()=>{navigation.navigate('Contact', { userData, userType: 'user' })}} style={styles.contactHostBtn}>
          <Text style={styles.contactHostText}>Contact Occupant</Text>
      </Pressable> :  <Pressable onPress={()=>{navigation.navigate('Contact', {userData: hostData, starReview, userType: 'host' })}} style={styles.contactHostBtn}>
          <Text style={styles.contactHostText}>Your Contact</Text>
      </Pressable>}
   </View>
    )
}

export default AgentInfo

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20, 
    borderBottomColor: 'gray', 
    borderBottomWidth: 0.5
  },
  hostInfoCont: {
    flexDirection:'row', 
    alignItems:'center', 
    marginBottom: 15
  },
  header: {
    marginBottom: 5, 
    fontSize: 18, 
    fontWeight:'600', 
    letterSpacing: 0.1,
    width: '70%'
  },
  joinedDate: {
    color: '#4C4C4C', 
    fontSize: 15,
    fontWeight:'500'
  },
  hostImageStyle: {
    width: 80, 
    height: 80, 
    borderRadius: 80, 
    marginRight: 20
  },
  placeHolderImage: {
    width: 80, 
    height: 80, 
    backgroundColor:'lightgray', 
    borderRadius: 80, 
    marginRight: 20, 
    justifyContent:'center', 
    alignItems:'center'
  },
  placeHolderImageText: {
    fontWeight: '600', 
    fontSize: 18, 
    color: 'white'
  },
  alignContainer: {
    flexDirection:'row', 
    alignItems:'center'
  },
  starIcon: {
    marginRight: 7
  },
  starIconText: {
    fontSize: 15, 
    fontWeight: '500', 
    color: '#4C4C4C'
  },
  hostInfoDescText: {
    fontSize: 15, 
    color:'#4C4C4C'
  },
  contactHostBtn: {
    borderWidth: 1, 
    padding: 10, 
    marginHorizontal: 10, 
    borderRadius: 10 , 
    marginTop: 15
  },
  contactHostText: {
    textAlign:'center', 
    fontSize: 14, 
    fontWeight: '500', 
    letterSpacing: 0.5
  }
})