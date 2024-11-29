import {View, Text,Pressable, FlatList, StyleSheet } from 'react-native'
import { FontAwesome , AntDesign} from '@expo/vector-icons'
import Reviews from '../../components/Reviews'
import {useNavigation} from '@react-navigation/native'
import { useEffect } from 'react'
import RateAgent from './rateAnAgent'
import SingleUserReview from './individualUserReview'
import ModalReviewScreen from './modalReviewScreen'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const AgentReviews = ({ setScrollToBottom, mode, getAverageReviewStarLength, starReview, totalRevLength, setTotalRevLength, setMode, dbUser, setReviewPresent, reviewPresent, payment, reviewText, isTextInputFocused, modalShow, hostData, reviewStarLength, setReviewStarLength, setModalShow, apartment, setIsTextInputFocused, setReviewText})=>{
  const navigation = useNavigation()
   
    useEffect(()=>{
      if(totalRevLength.length == 0){
        return
      }
      const recentReviews = totalRevLength.sort((a, b)=>{
        const dateA = dayjs(a.date, 'M/D/YYYY, h:mm:ss A')
        const dateB = dayjs(b.date, 'M/D/YYYY, h:mm:ss A')

        return(
        new Date(dateB) - new Date(dateA)
        )
      })
      setTotalRevLength(recentReviews)
  }, [totalRevLength])

 
    return(
        <View style={{marginVertical: 20}}>
       {(payment && reviewPresent) && <SingleUserReview setTotalRevLength={setTotalRevLength} setReviewPresent={setReviewPresent} hostData={hostData} apartment={apartment} setMode={setMode} reviewPresent={reviewPresent} dbUser={dbUser}  setModalShow={setModalShow} setReviewStarLength={setReviewStarLength} setIsTextInputFocused={setIsTextInputFocused} setReviewText={setReviewText} payment={payment}/>}
       {(payment && !reviewPresent && dbUser) && <RateAgent hostData={hostData} reviewStarLength={reviewStarLength} setReviewStarLength={setReviewStarLength} setModalShow={setModalShow} apartment={apartment}/>} 
      {totalRevLength.length>=1?  <><View style={styles.alignContainer}>
        <FontAwesome name="star" size={25} color="black" style={{marginRight: 10}}/>
            <Text style={styles.reviewData}>{totalRevLength.length>=2? Number(starReview).toFixed(1) : null}</Text>
            <Text style={styles.reviewData}> &#8226; {totalRevLength.length} reviews</Text>
        </View>
        { totalRevLength.length == 1 && <Text style={{color:"#4C4C4C"}}>The average review star rating for an agent is displayed once at least two reviews have been submitted. This ensures a more accurate representation of the agent's quality and service based on multiple renters experiences.</Text>}         
         <FlatList data={totalRevLength} renderItem={({item})=>{
           return(
            <Reviews mode={'horizontal'} item={item} averageReviewStar={starReview} Agent_Reviews={totalRevLength}/>
           )
        }}  horizontal showsHorizontalScrollIndicator={false} style={{marginVertical: 20}}/>
      {
        totalRevLength.length>=3 && (
            <Pressable onPress={()=>{navigation.navigate('FullReviewScreen', {avgRevStar: starReview, Agent_Reviews: totalRevLength})}} style={styles.seeReviewsBtn}>
            <Text style={styles.seeReviewsText}>Show all {totalRevLength?.length} Reviews</Text>
        </Pressable>
        )
      }
     <ModalReviewScreen setScrollToBottom={setScrollToBottom} getAverageReviewStarLength={getAverageReviewStarLength} mode={mode} hostData={hostData} modalShow={modalShow} setModalShow={setModalShow} reviewStarLength={reviewStarLength} setReviewStarLength={setReviewStarLength} apartment={apartment} reviewText={reviewText} setReviewText={setReviewText} isTextInputFocused={isTextInputFocused} setIsTextInputFocused={setIsTextInputFocused} setReviewPresent={setReviewPresent} payment={payment}/>
</> : <View style={styles.noReviewContainer}>
        <Text style={styles.noReviewContainerText}>No reviews (yet)</Text>
       <View style={styles.noReviewCont}>
           <Text style={{color:'#4C4C4C', width:'80%'}}>This Agent has no reviews yet. Reviews can only be made after payment. Be the first to share your experience!</Text>
           <AntDesign name="staro" size={35} color="#4C4C4C" />
        </View>
        <ModalReviewScreen setScrollToBottom={setScrollToBottom} getAverageReviewStarLength={getAverageReviewStarLength} mode={mode} hostData={hostData} modalShow={modalShow} setModalShow={setModalShow} reviewStarLength={reviewStarLength} setReviewStarLength={setReviewStarLength} apartment={apartment} reviewText={reviewText} setReviewText={setReviewText} isTextInputFocused={isTextInputFocused} setIsTextInputFocused={setIsTextInputFocused} setReviewPresent={setReviewPresent} payment={payment}/>
      </View>
  }
   </View>
    )
}

export default AgentReviews

const styles = StyleSheet.create({
  alignContainer: {
    flexDirection: 'row', 
    alignItems: 'center'
  },
  noReviewText: {
    fontSize: 16, 
    marginBottom: 10, 
    textAlign: 'center', 
    color: '#4C4C4C', 
    fontWeight: '600'
   },
  reviewData: {
    fontSize: 18, 
    fontWeight: '600'
  },
  seeReviewsBtn: {
    borderWidth: 1, 
    paddingVertical: 10, 
    marginHorizontal: 10, 
    borderRadius: 10, 
    marginTop: 8 
  },
  seeReviewsText: {
    textAlign: 'center', 
    fontSize: 16, 
    fontWeight: '500', 
    letterSpacing: 0.5
  },
  noReviewContainer: {
    paddingVertical : 10
  },
  noReviewContainerText: {
    fontSize: 18, 
    fontWeight: '600', 
    letterSpacing: 0.5
  },
  noReviewCont: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 10
  }
})