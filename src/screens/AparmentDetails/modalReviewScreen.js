import { useState, useEffect} from 'react'
import { View, Text, Modal, TextInput, Alert, StyleSheet, Pressable, ScrollView } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { useUserAuthContext } from '../../Context/userContext'
import { DataStore } from 'aws-amplify/datastore'
import { Review, AllReviews, PaymentHistory } from '../../models'
import ReviewStars from '../../components/reviewStars'
import FastImage from 'react-native-fast-image'
import { Buffer } from 'buffer';
import { useSelector } from 'react-redux'

const URL = 'https://dr4jupy057c0c.cloudfront.net/'
const bucket = 'staylit-storage-1914deba97d11-staging'

const ModalReviewScreen = ({setScrollToBottom, getAverageReviewStarLength, mode, setReviewPresent, hostData, modalShow, setModalShow, reviewStarLength, setReviewStarLength, apartment, isTextInputFocused, setIsTextInputFocused, reviewText, setReviewText, payment})=>{
  const dbUser = useSelector(state => state.user.dbUser)
  const [posting, setPosting] = useState(false)
  const [imageData, setImageData] = useState(false)

   const onUpdateReviewText = (text)=>{
          setReviewText(text)
   }

   const changeTextInputContainerBorderColor = ()=>{
     setIsTextInputFocused(true)
   }

  
   const formatDate = ()=>{
      const date = new Date()
      const reviewCreationDate = date.toLocaleString('en-US', {
        hour12: true})
      return reviewCreationDate
   }

   const showAlert = ()=>{
    Alert.alert(
        null,
        'Discard draft?',
        [
          { text: 'Keep', onPress: () => {}},
          { text: 'Discard', onPress: () => { 
            setReviewStarLength(0); 
            setReviewText(''); 
            setIsTextInputFocused(false)
            setModalShow(false);
        }}
        ]
      );
   }

   const getUserStoragePicture = async ()=>{
    try{
        getProfilePictureUrl(dbUser.key)
    }catch(e){
        console.log('Error User Pic Object : ', e.message)
    }
  }

useEffect(()=>{
    if(!dbUser){
       return 
    }
    getUserStoragePicture()  
}, [dbUser])

const getProfilePictureUrl = async (imageUrl)=>{
  const imageRequest = JSON.stringify(
    {
      "bucket": bucket,
      "key": `public/${imageUrl}`,
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

   const UpdateReview = async()=>{
    const getReviewObj = await DataStore.query( Review, (r)=> r.and(r => [
      r.userID.eq(dbUser.id),
      r.hostID.eq(hostData.id),
      r.apartmentID.eq(apartment.id)
    ]))
    console.log('getReviewObj : ', getReviewObj) 
   
    const reviewObj = await DataStore.save(
      Review.copyOf( getReviewObj[0], (updated)=>{
        updated.starLength = reviewStarLength,
        updated.reviewDesc = reviewText,
        updated.date = formatDate(),
        updated.userID = dbUser.id,
        updated.hostID = hostData.id,
        updated.apartmentID = apartment.id
  }))
    console.log('Review Update Success : ', reviewObj)
   }

   const updateAllReview = async ()=>{
    const getAllReviewObj = await DataStore.query( AllReviews, (r)=> r.and(r => [
      r.userID.eq(dbUser.id),
      r.hostID.eq(hostData.id),
      r.apartmentID.eq(apartment.id)
    ]))
    console.log('getAllReviewObj : ', getAllReviewObj)

    const AllReviewObj = await DataStore.save(
      AllReviews.copyOf( getAllReviewObj[0], (updated)=>{
        updated.starLength = reviewStarLength,
        updated.reviewDesc = reviewText,
        updated.date = formatDate(),
        updated.userID = dbUser.id,
        updated.hostID = hostData.id,
        updated.apartmentID = apartment.id
  }))

  console.log('AllReview Update Success : ', AllReviewObj) 
  savePaymentHistoryUserReview(AllReviewObj)
  await getAverageReviewStarLength()
   }

   const savePaymentHistoryUserReview = async (theReview)=>{
     const PaymentHistoryObj = await DataStore.query(PaymentHistory, (p)=> p.id.eq(payment.id))
     const userReviewInPayment = await DataStore.save(PaymentHistory.copyOf(PaymentHistoryObj[0], (updated)=>{
          updated.Review = theReview
     }))
     console.log('userReviewInPayment : ', userReviewInPayment)
     setReviewPresent(userReviewInPayment.Review)
   }

  const saveAllReview = async ()=>{
    try{
      const AllReviewObj = await DataStore.save( new AllReviews({
        starLength : reviewStarLength,
        reviewDesc : reviewText,
        date: formatDate(),
        userID: dbUser.id,
        hostID: hostData.id,
        apartmentID: apartment.id
    }))
    console.log('AllReview Upload Success : ', AllReviewObj)
    savePaymentHistoryUserReview(AllReviewObj)
    await getAverageReviewStarLength()
    }catch(e){
      console.log('AllReview error: ', e.message )
    }
    
}

   const saveTheReview = async()=>{
    try{
      const reviewObj = await DataStore.save( new Review({
        starLength : reviewStarLength,
        reviewDesc : reviewText,
        date: formatDate(),
        userID: dbUser.id,
        hostID: hostData.id,
        apartmentID: apartment.id
    }))
    console.log('Review Upload Success : ', reviewObj)
    }catch(e){
       console.log('Review error: ', e.message )
    }
   
   }

     const saveReview = ()=>{
      try{
           if(mode=='CreateReview'){
              saveAllReview()
              saveTheReview()
              setPosting(false)
              setReviewStarLength(0); 
              setReviewText(''); 
              setIsTextInputFocused(false)
              setModalShow(false);
              setScrollToBottom(true)
           }
          else{
              updateAllReview()
              UpdateReview()
              setPosting(false)
              setReviewStarLength(0); 
              setReviewText(''); 
              setIsTextInputFocused(false)
              setModalShow(false);
              setScrollToBottom(true)
           }

      }catch(e){
            console.log('Error Uploading Review Data : ', e.message)
            setPosting(false)
      }
        }

    return(
      <ScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>
        <Modal visible={modalShow} onRequestClose={showAlert} presentationStyle='formSheet' animationType='none'>
          <View style={styles.modalContainer}>
            <View style={styles.header}>
            <AntDesign name="close" size={20} color="black" onPress={showAlert}/>
            <Text style={styles.hostName}>Rate {hostData?.name}</Text>
            <Pressable onPress={()=>{setPosting(true); saveReview()}}>
            <Text style={styles.postText}>{posting? 'Posting...' : 'Post'}</Text>
            </Pressable>
         
            </View>
            <View style={styles.userDataCont}>
              { imageData? <FastImage source={{uri : imageData,  priority: FastImage.priority.high}} style={styles.userImage} resizeMode={FastImage.resizeMode.cover}/> : <View style={styles.userImage}>
                <Text style={styles.userName}>{dbUser?.name[0]}</Text>
              </View>}
               <View>
                  <Text style={{fontWeight: '600'}}>{dbUser?.name}</Text>
                  <Text style={styles.reviewDescText}>Reviews are public and include your account and device info.</Text>
               </View>
            </View>
          <ReviewStars reviewStarLength={reviewStarLength} setReviewStarLength={setReviewStarLength} setModalShow={setModalShow}/>
            <View style={{...styles.textInputCont, borderWidth: isTextInputFocused? 2 : 1, borderColor: 'black'}}>
                <TextInput style={styles.textInputStyle} multiline value={reviewText} placeholder='Describe Your Experience' onChangeText={onUpdateReviewText} autoCorrect={true} autoCapitalize='sentences' onFocus={changeTextInputContainerBorderColor} onBlur={()=>{setIsTextInputFocused(false)}} />
            </View>
            </View>
        </Modal> 
        </ScrollView>    
    )
}

export default ModalReviewScreen

const styles = StyleSheet.create({
   modalContainer: {
    flex: 1, 
    backgroundColor:'white', 
    padding: 20
   },
   header: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems:'center', 
    marginBottom: 20
   },
   hostName: {
    fontSize: 18, 
    fontWeight: '600'
   },
   postText: {
    fontSize: 18, 
    color:'#FF0000'
   },
   userDataCont: {
    flexDirection:'row', 
    justifyContent: 'center',
    alignItems:'center', 
    paddingHorizontal: 40,
    marginBottom: 20
   },
   userImage: {
    width: 70, 
    height: 70, 
    borderRadius: 70, 
    marginRight: 10,
    backgroundColor: 'lightgray',
    justifyContent:'center',
    alignItems:'center'
   },
   userName: {
      color:'white',
      fontWeight: '600',
      fontSize: 20
   },
   reviewDescText: {
    fontSize: 14, 
    color: '#4C4C4C'
   },
   textInputStyle: {
    height: 100, 
    fontSize: 16, 
    textAlignVertical: 'top', 
    paddingVertical: 10
   },
   textInputCont: {
    width: '100%', 
    height: 100, 
    borderRadius: 5, 
    justifyContent:'center', 
    paddingHorizontal: 10
   }
})