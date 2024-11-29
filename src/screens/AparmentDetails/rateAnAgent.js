import { View, Text, StyleSheet } from 'react-native'
import ReviewStars from '../../components/reviewStars'

const RateAgent = ({ hostData, reviewStarLength, setReviewStarLength, setModalShow, apartment })=>{
    return(
        <View style={styles.margin}>
        <Text style={styles.rateUserText}>Rate {hostData.name}</Text>
        <Text style={styles.textColor}>Tell others what you think, information you share will help other make more better decisions</Text>
       <ReviewStars reviewStarLength={reviewStarLength} setReviewStarLength={setReviewStarLength} setModalShow={setModalShow}/>
      
        <Text onPress={()=>{setModalShow(true)}} style={styles.writeReviewText}>Write a review</Text>
        </View>
    )
}

export default RateAgent

const styles = StyleSheet.create({
    margin: {
        marginBottom: 20
    },
  rateUserText: {
    fontSize: 18, 
    fontWeight:'600', 
    letterSpacing:0.5
  },
  textColor: {
    color: '#4C4C4C'
  },
  writeReviewText: {
    fontSize: 14, 
    color: '#FF0000', 
    letterSpacing: 0.3
  }
})