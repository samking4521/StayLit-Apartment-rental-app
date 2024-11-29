import {View, Text, StyleSheet} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { DataStore } from 'aws-amplify/datastore'
import { User } from '../../models'
import SharpRevStars from '../sharpReviewStars'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { formatDistanceToNow } from 'date-fns';
import FastImage from 'react-native-fast-image'
import { Buffer } from 'buffer';

dayjs.extend(customParseFormat);

const URL = 'https://dr4jupy057c0c.cloudfront.net/'
const bucket = 'staylit-storage-1914deba97d11-staging'


const Reviews = ({item, averageReviewStar, Agent_Reviews, mode})=>{
    const navigation = useNavigation()
    const [userImage, setUserImage] = useState(null)
    const [userData, setUserData] = useState(null)

    const formatDate = ()=>{
      const date = dayjs(item.date, 'M/D/YYYY, h:mm:ss A')
      const timeElapsed = formatDistanceToNow(new Date(date), { addSuffix: true });
     return timeElapsed
    }
  
    const reviewDescText= ()=>{
        if(item.reviewDesc?.length>100 && mode=='horizontal'){
            const text = item.reviewDesc.slice(0, item.reviewDesc.lastIndexOf(' ', 100))+'...'
             return text
        }
        else{
            return item.reviewDesc
        }

    }
    useEffect(()=>{
       if(!item){
        return
       }
       (async ()=>{
        const userDataArr = await DataStore.query(User, (u)=>u.id.eq(item.userID))
        const userDataObj = userDataArr[0]
        setUserData(userDataObj)
        getUserReviewProfileUrl(userDataObj.key)
    })()
    }, [item])

    const getUserReviewProfileUrl = async (imageKey)=>{
      const imageRequest = JSON.stringify(
        {
          "bucket": bucket,
          "key": `public/${imageKey}`,
          "edits": {
            "resize": {
              "width": mode=='vertical'? 70 : 50,
              "height": mode=='vertical'? 70 : 50,
              "fit": "cover"
            }
          }
        }
      )
      const encoded = Buffer.from(imageRequest).toString('base64')
      setUserImage(`${URL}${encoded}`)
       
    }
   
    return(
        <View style={{flexDirection: mode == 'vertical'? 'column-reverse' : 'column',  borderWidth: mode=='vertical'? 0 : 1, width: mode=='vertical'? 'auto' : 250, paddingVertical:  mode=='vertical'? 0 : 20, paddingHorizontal: 20, borderRadius:  mode=='vertical'? 0 : 15, borderColor:  mode=='vertical'? null : 'lightgray', marginRight: mode=='vertical'? 0 : 10, justifyContent: mode =='vertical'? null : 'space-between' }}>
            <View style={{...styles.dateCont, marginTop: mode=='vertical'? 5 : 0}}>
                <SharpRevStars item={item} mode={mode}/>
                <Text style={{color: '#4C4C4C', fontSize: 12, fontWeight: '500'}}> {formatDate()}</Text>
            </View>
            <View>
                <Text style={{color:  mode=='vertical'? 'black' : '#4C4C4C', fontSize:  mode=='vertical'? 16 : 14, lineHeight:  mode=='vertical'? 20 : null, marginTop: mode == 'vertical'? 5 : 0}}>{reviewDescText()}</Text>
                {(item.reviewDesc?.length>100 && mode !=='vertical') && <Text onPress={()=>{navigation.navigate('FullReviewScreen', {avgRevStar: averageReviewStar, Agent_Reviews, averageReviewStar})}} style={styles.showMoreText}>Show more</Text>}
            </View>
 
            <View  style={styles.userDataCont}>
              {userImage?  <FastImage source={{uri : userImage}} style={{width: mode=='vertical'? 70 : 50, height: mode=='vertical'? 70 : 50, borderRadius: mode=='vertical'? 70 : 50, marginRight: 15}} resizeMode={FastImage.resizeMode.cover}/> : <View style={{...styles.userDataPlaceHolder, width: mode=='vertical'? 70 : 50, height: mode=='vertical'? 70 : 50}}>
                                                                                                                                                    <Text style={styles.userPlaceholderName}>{userData?.name[0]}</Text>
                                                                                                                                    </View>
                                                                                                }
                <View>
                    <Text style={{fontWeight: '600'}}>{userData?.name}</Text>
                    <Text style={{...styles.userDataLocation, fontSize: 12}}>{userData?.state}, {userData?.country}</Text>
                </View>
            </View>
        </View>
    )
}

export default Reviews

const styles = StyleSheet.create({
  dateCont: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 10
  },
  showMoreText: {
    fontWeight: '600', 
    textDecorationLine: 'underline', 
    marginTop: 10
  },
  userDataCont: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 18
  },
  userDataPlaceHolder: {
    borderRadius: 50, 
    marginRight: 15, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'gray'
  },
  userPlaceholderName: {
    fontSize: 18, 
    color: 'white', 
    fontWeight: 'bold'
  },
  userDataLocation: {
    fontWeight: '600', 
    color:'#4C4C4C'
  }
})