import {View, Text, StyleSheet } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import { useEffect, useState } from 'react'
import { DataStore } from 'aws-amplify/datastore'
import { AllReviews, User, Review, PaymentHistory} from '../../models'
import FastImage from 'react-native-fast-image';
import { Buffer } from 'buffer';

const URL = 'https://dr4jupy057c0c.cloudfront.net/'
const bucket = 'staylit-storage-1914deba97d11-staging'

const SingleUserReview = ({setTotalRevLength, setReviewPresent, hostData, apartment, reviewPresent, dbUser, mode, setModalShow, setReviewStarLength, setReviewText, setIsTextInputFocused, payment})=>{
    const [delReview, setDelReview] = useState(false)
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
  
    const onClickOfThreeDotBtn = ()=>{
        if (delReview){
            setDelReview(false)
        }
        else {
            setDelReview(true)
        }
    }

    useEffect(()=>{
        if(!reviewPresent){
            return
        }
        (async()=>{
            const getUserObj = await DataStore.query( User, (u)=> u.id.eq(reviewPresent.userID))
            setUserData(getUserObj[0])
        })()
    }, [reviewPresent])

    const deleteReviewFromPayment = async()=>{
        const PaymentHistoryObj = await DataStore.query(PaymentHistory, (p)=> p.id.eq(payment.id))
        console.log('PaymentHistoryObj : ', PaymentHistoryObj[0])
        const userReviewInPayment = await DataStore.save(PaymentHistory.copyOf(PaymentHistoryObj[0], (updated)=>{
            updated.Review = null
       }))
       console.log('Deleted Review in Payment : ', userReviewInPayment)
       const checkPaymentHistoryObj = await DataStore.query(PaymentHistory, (p)=> p.id.eq(payment.id))
       console.log('checkPaymentHistoryObj : ', checkPaymentHistoryObj[0])
       setReviewPresent(checkPaymentHistoryObj[0].Review)
    }
     
    const deleteAllReviews = async ()=>{
        const getAllReviewObj = await DataStore.query( AllReviews, (r)=> r.and(r => [
            r.userID.eq(dbUser.id),
            r.hostID.eq(hostData.id),
            r.apartmentID.eq(apartment.id)
          ])) 
        const deletedAllReviewObj = await DataStore.delete(getAllReviewObj[0])
        console.log('Deleted AllReview : ', deletedAllReviewObj)
        const getCurrentAllReviewObj = await DataStore.query( AllReviews, (r)=> r.and(r => [
            r.userID.eq(dbUser.id),
            r.hostID.eq(hostData.id),
            r.apartmentID.eq(apartment.id)
          ])) 
        console.log('getCurrentAllReviewObj : ', getCurrentAllReviewObj[0])
        
    }

    const deleteTheReview = async()=>{
        const getReviewObj = await DataStore.query( Review, (r)=> r.and(r => [
            r.userID.eq(dbUser.id),
            r.hostID.eq(hostData.id),
            r.apartmentID.eq(apartment.id)
          ])) 
        const deletedReviewObj = await DataStore.delete(getReviewObj[0])
        console.log('Deleted Review : ', deletedReviewObj)
    }
    console.log(reviewPresent)
    const getAllHostReviews = async ()=>{
        const allHostRevs = await DataStore.query(AllReviews, (r)=> r.hostID.eq(hostData.id))
        console.log('allHostRevs : ', allHostRevs)
        setTotalRevLength(allHostRevs)
    }

    const deleteReview = async ()=>{
        await deleteReviewFromPayment()
        await deleteAllReviews()
        await deleteTheReview()
        getAllHostReviews()
    }
   
    const formatDate = ()=>{
        const dates = new Date()
        const getDayOfMonth = dates.getDate(reviewPresent.date)
        const getMonth = dates.getMonth(reviewPresent.date)
        const getYear = dates.getFullYear(reviewPresent.date)
        return `${getDayOfMonth}/${getMonth + 1}/${getYear}`
    }
   
    return (
        <View style={styles.container}>
        <Text style={styles.header}>{ mode !== 'host'? 'Your review' : 'Occupant review'}</Text>
        <View style={{...styles.userReviewDataCont, marginVertical: mode!=='host'? 15 : 10}}>
        { imageData? <FastImage source={{uri : imageData,  priority: FastImage.priority.high}} style={styles.userImage} resizeMode={FastImage.resizeMode.cover}/> : <View style={styles.imageStyle}>
                                                                                                                                    <Text style={styles.imageText}>{dbUser?.name[0]}</Text>
                                                                                                                                </View> 
          }
            <View style={{flex: 1}}>
                <Text style={{fontSize: 15, fontWeight:'600'}}>{userData?.name}</Text>
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
                     { mode!=='host' && <Entypo name="dots-three-vertical" size={24} color="#4C4C4C" onPress={onClickOfThreeDotBtn}/>}
            </View>
            </View>
        </View>
       { delReview && <View style={styles.deleteReviewCont}>
            <Text style={styles.blueText} onPress={deleteReview}>Delete</Text>
        </View>}
{mode!=='host' && <Text style={styles.blueText} onPress={()=>{setModalShow(true)
                                            setReviewStarLength(reviewPresent.starLength)
                                            setReviewText(reviewPresent.reviewDesc)
                                            setIsTextInputFocused(true)
                                                    }}>Edit Your Review</Text>}
             {mode == 'host' && <View>
                <Text style={{fontSize: 16, color:'#4C4C4C'}}>{reviewPresent.reviewDesc}</Text>
                </View>    }                           
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
        color: '#FF0000'
    }
})