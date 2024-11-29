import { View, StyleSheet } from 'react-native'
import { AntDesign } from '@expo/vector-icons'

const ReviewStars = ({reviewStarLength, setCloseReview, mode, setReviewStarLength, setModalShow})=>{
    return(
        <View style={styles.container}>
        {
            1<=reviewStarLength?   (<AntDesign name="star" size={40} color="black" onPress={()=>{setReviewStarLength(1)}}/>) : 
            (<AntDesign name="staro" size={40} color="black" onPress={()=>{
                if(mode){
                    setReviewStarLength(1); 
                    setTimeout(()=>{setModalShow(true), 500})
                    setCloseReview(true)
                }else{
                    setReviewStarLength(1); 
                    setTimeout(()=>{setModalShow(true), 500})
                }
                }}/> )
        }
         {
            2<=reviewStarLength?   (<AntDesign name="star" size={40} color="black" onPress={()=>{setReviewStarLength(2)}}/>) : 
            (<AntDesign name="staro" size={40} color="black" onPress={()=>{
                if(mode){
                    setReviewStarLength(2); 
                    setTimeout(()=>{setModalShow(true), 500})
                    setCloseReview(true)
                }else{
                    setReviewStarLength(2); 
                    setTimeout(()=>{setModalShow(true), 500})
                }
    }}/> )
        }
         {
            3<=reviewStarLength?   (<AntDesign name="star" size={40} color="black" onPress={()=>{setReviewStarLength(3)}}/>) : 
            (<AntDesign name="staro" size={40} color="black" onPress={()=>{
                if(mode){
                    setReviewStarLength(3); 
                    setTimeout(()=>{setModalShow(true), 500})
                    setCloseReview(true)
                }else{
                    setReviewStarLength(3); 
                    setTimeout(()=>{setModalShow(true), 500})
                }
               }}/> )
        }
         {
            4<=reviewStarLength?   (<AntDesign name="star" size={40} color="black" onPress={()=>{setReviewStarLength(4)}}/>) :
             (<AntDesign name="staro" size={40} color="black" onPress={()=>{
                if(mode){
                    setReviewStarLength(4); 
                    setTimeout(()=>{setModalShow(true), 500})
                    setCloseReview(true)
                }else{
                    setReviewStarLength(4); 
                    setTimeout(()=>{setModalShow(true), 500})
                }
               }}/> )
        }
         {
            5<=reviewStarLength?   (<AntDesign name="star" size={40} color="black" onPress={()=>{setReviewStarLength(5)}}/>) : 
            (<AntDesign name="staro" size={40} color="black" onPress={()=>{
                if(mode){
                    setReviewStarLength(5); 
                    setTimeout(()=>{setModalShow(true), 500})
                    setCloseReview(true)
                }else{
                    setReviewStarLength(5); 
                    setTimeout(()=>{setModalShow(true), 500})
                }
               }}/> )
        }
      
    </View>
    )
}

export default ReviewStars

const styles = StyleSheet.create({
   container: {
    flexDirection:'row', 
    justifyContent:'space-between', 
    marginVertical: 15
   }
})