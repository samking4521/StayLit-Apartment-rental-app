import { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { FontAwesome} from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useUserAuthContext } from '../../Context/userContext';
import FastImage from 'react-native-fast-image';
import { Buffer } from 'buffer';
import dayjs from 'dayjs'
import { useSelector, useDispatch } from 'react-redux';
import { showProfileAlert } from '../../Redux/showProfile/showProfileActions';


const URL = 'https://dr4jupy057c0c.cloudfront.net/'
const bucket = 'staylit-storage-1914deba97d11-staging'

const AgentInfo = ({apartment, hostData, starReview, totalRevLength})=>{
  const dbUser = useSelector(state => state.user.dbUser)
  const dispatch = useDispatch()
  const [hostImage, setHostImage] = useState(null)
  const [yearJoined, setYearJoined] = useState(null)
  const [monthJoined, setMonthJoined] = useState(null)
  const navigation = useNavigation()

  const hostJoinDate = ()=>{
    const date = dayjs(hostData.date, 'M/D/YYYY, h:mm:ss A');
    const month = date.month()
    const year = date.year()
    const monthOfYrArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    return { year, monthOfYearName: monthOfYrArr[month] }
}


 const showHostContact = ()=>{
  if(dbUser){
    navigation.navigate('ChatAgentScreen', { hostData, starReview, apartment })
  }else{
    dispatch(showProfileAlert())
  }
 }

useEffect(()=>{
    if(hostData){
      const {year, monthOfYearName} = hostJoinDate()
      setYearJoined(year)
      setMonthJoined(monthOfYearName)
    }
}, [hostData])

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

   
    return(
      <View style={styles.container}>
        <View style={styles.hostInfoCont}>
          <View style={{marginRight: 'auto', width: '65%'}}>
              <Text style={styles.header}>{`Listed by ${hostData?.name}`}</Text>
              <Text style={styles.joinedDate}>{`Joined in ${monthJoined}, ${yearJoined}`}</Text>
          </View>
          <View style={{...styles.hostImageStyle, elevation: 5, backgroundColor:'white'}}>
                {
                  hostImage ? <FastImage source={{uri : hostImage,  priority: FastImage.priority.high}} style={styles.hostImageStyle} resizeMode={FastImage.resizeMode.cover}/> :
                   <View style={styles.placeHolderImage}>
                        <Text style={styles.placeHolderImageText}>{hostData?.name[0]}</Text>
                   </View> }
          </View>
        
        </View>
  
      <View style={{...styles.alignContainer, marginBottom: 10}}>
             <FontAwesome name="star" size={25} color="black" style={styles.starIcon}/>
             <Text style={styles.starIconText}>{totalRevLength.length>=2? Number(starReview).toFixed(1) : 'New'} &#8226; {totalRevLength.length} Reviews</Text>
      </View>
    
    <View>
      <Text style={styles.hostInfoDescText}>Agents are highly commited to ensure people secure nice apartments, in an environment where they desire to be</Text>
    </View>
     <Pressable onPress={showHostContact} style={styles.contactHostBtn}>
          <Text style={styles.contactHostText}>Contact Agent</Text>
      </Pressable>
     <View style={styles.lineTextCont}>
          <Text style={styles.line}>____________</Text>
          <Text  style={styles.lineText}>or</Text>
          <Text  style={styles.line}>____________</Text>
      </View>
    <Pressable onPress={()=>{navigation.navigate('AgentDetails', { apartment, hostData, totalRevLength, starReview})}} style={styles.seeAgentDetailsBtn}>
          <Text style={styles.seeAgentDetailsText}>See More Details and Listings from Agent</Text>
    </Pressable>
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
  },
  lineTextCont: {
    flexDirection:'row', 
    alignItems:'center', 
    justifyContent:'center', 
    marginVertical: 10
  },
  line: {
    paddingBottom: 10, 
    color: '#4C4C4C'
  },
  lineText: {
    fontSize: 14, 
    color: '#4C4C4C', 
    marginHorizontal: 10
  },
  seeAgentDetailsBtn: {
    borderWidth: 1, 
    paddingVertical: 10, 
    marginHorizontal: 10, 
    borderRadius: 10
  },
  seeAgentDetailsText: {
    textAlign:'center', 
    fontSize: 14, 
    fontWeight: '500', 
    letterSpacing: 0.5
  }
})