import {View, Text, StyleSheet } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import { useEffect, useState } from 'react'
import { DataStore } from 'aws-amplify/datastore'
import { User } from '../../models'
import FastImage from 'react-native-fast-image';
import { Buffer } from 'buffer';

const URL = 'https://dr4jupy057c0c.cloudfront.net/'
const bucket = 'staylit-storage-1914deba97d11-staging'

const SingleUserReview = ({ reviewPresent })=>{
    const [imageData, setImageData] = useState(null)
    const [userData, setUserData] = useState(null)

       const getUserImageUrl = async(imageKey)=>{
        const imageRequest = JSON.stringify(
            {
              "bucket": bucket,
              "key": `public/${imageKey}`,
              "edits": {
                "resize": {
                  "width": 70,
                  "height": 70,
                  "fit": "cover"
                }
              }
            }
          )
          const encoded = Buffer.from(imageRequest).toString('base64')
          setImageData(`${URL}${encoded}`)
       }
    
        useEffect(()=>{
            if(userData){
                getUserImageUrl(userData?.key)
            }
       }, [userData])
  
   

    useEffect(()=>{
        if(!reviewPresent){
            return
        }
        (async()=>{
            const getUserObj = await DataStore.query( User, (u)=> u.id.eq(reviewPresent.userID))
            setUserData(getUserObj[0])
        })()
    }, [reviewPresent])

    const formatDate = ()=>{
        const dates = new Date()
        const getDayOfMonth = dates.getDate(reviewPresent.date)
        const getMonth = dates.getMonth(reviewPresent.date)
        const getYear = dates.getFullYear(reviewPresent.date)
        return `${getDayOfMonth}/${getMonth + 1}/${getYear}`
    }
   
    return (
        <View style={styles.container}>
        <Text style={styles.header}>Occupant review</Text>
        <View style={{...styles.userReviewDataCont, marginVertical: 10}}>
        { imageData? <FastImage source={{uri : imageData,  priority: FastImage.priority.high}} style={styles.userImage} resizeMode={FastImage.resizeMode.cover}/> :
         <View style={styles.imageStyle}>
                        <Text style={styles.imageText}>{userData?.name[0]}</Text>                                                                                                                     
        </View> 
          }
            <View style={{flex: 1}}>
                <Text style={{fontSize: 16, fontWeight:'600'}}>{userData?.name}</Text>
            <View style={styles.alignContainer}>
                <View style={styles.alignCont}>
                    <View style={styles.reviewStarCont}>
                        {
                            1<=reviewPresent.starLength?   (<Entypo name="star" size={14} color="black"/>) : 
                            (<Entypo name="star-outlined" size={14} color="black" /> )
                        }
                        {
                            2<=reviewPresent.starLength?   (<Entypo name="star" size={14} color="black" />) : 
                            (<Entypo name="star-outlined" size={14} color="black" /> )
                        }
                        {
                            3<=reviewPresent.starLength?   (<Entypo name="star" size={14} color="black" />) : 
                            (<Entypo name="star-outlined" size={14} color="black" /> )
                        }
                        {
                            4<=reviewPresent.starLength?   (<Entypo name="star" size={14} color="black" />) :
                            (<Entypo name="star-outlined" size={14} color="black"/> )
                        }
                        {
                            5<=reviewPresent.starLength?   (<Entypo name="star" size={14} color="black" />) : 
                            (<Entypo name="star-outlined" size={14} color="black" /> )
                        }
    
                        </View>
                        <Text style={{fontWeight:'600', color:'#4C4C4C'}}>{formatDate()}</Text>
            </View>
            </View>
            </View>
        </View>
      
        <View>
                <Text style={{fontSize: 15, color:'#4C4C4C'}}>{reviewPresent.reviewDesc}</Text>
       </View>                          
    </View>

    )
}

export default SingleUserReview

const styles = StyleSheet.create({
    container: {
        marginBottom: 20, 
        paddingVertical: 10
    },
    header: {
        fontSize: 18, 
        fontWeight: '600', 
        letterSpacing: 0.5
    },
    userReviewDataCont: {
        flexDirection:'row', 
        alignItems:'center'
    },
    userImage: {
        width: 70, 
        height: 70, 
        borderRadius: 70, 
        marginRight: 10
    },
    imageStyle: {
        width: 70, 
        height: 70, 
        borderRadius: 70, 
        marginRight: 10,
        backgroundColor:'lightgray',
        justifyContent:'center',
        alignItems:'center'
    },
    alignContainer: {
        flexDirection:'row', 
        alignItems:'center'
    },
    alignCont: {
        flexDirection:'row', 
        alignItems:'center', 
        marginRight:'auto'
    },
    imageText: {
        color:'white', 
        fontWeight:"600"
    },
    reviewStarCont: {
        flexDirection:'row', 
        alignItems:'center', 
        marginRight: 10
    },
    deleteReviewCont: {
        width: '50%', 
        padding: 10,
        backgroundColor:'#FAFAFA', 
        alignSelf: 'flex-end', 
        bottom: 20, 
        right : 15
    },
    blueText: {
        color: 'blue', 
        fontWeight: '500'
    }
})