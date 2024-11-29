import { View } from 'react-native'
import { Entypo } from '@expo/vector-icons'

const SharpRevStars = ({item, mode})=>{
    return(
        <View style={{flexDirection:'row'}}>
        {
            1<=item.starLength?   (<Entypo name="star" size={ mode=='vertical'? 14 : 12} color="black"/>) : 
            (<Entypo name="star-outlined" size={ mode=='vertical'? 14 : 12} color="black" /> )
        }
         {
            2<=item?.starLength?   (<Entypo name="star" size={ mode=='vertical'? 14 : 12} color="black" />) : 
            (<Entypo name="star-outlined" size={ mode=='vertical'? 14 : 12} color="black" /> )
        }
         {
            3<=item?.starLength?   (<Entypo name="star" size={ mode=='vertical'? 14 : 12} color="black" />) : 
            (<Entypo name="star-outlined" size={ mode=='vertical'? 14 : 12} color="black" /> )
        }
         {
            4<=item?.starLength?   (<Entypo name="star" size={ mode=='vertical'? 14 : 12} color="black" />) :
             (<Entypo name="star-outlined" size={ mode=='vertical'? 14 : 12} color="black"/> )
        }
         {
            5<=item?.starLength?   (<Entypo name="star" size={ mode=='vertical'? 14 : 12} color="black" />) : 
            (<Entypo name="star-outlined" size={ mode=='vertical'? 14 : 12} color="black" /> )
        }
      
    </View>
    )
}

export default SharpRevStars