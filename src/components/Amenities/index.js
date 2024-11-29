import {View, Text, StyleSheet} from 'react-native'
import { Fontisto, MaterialCommunityIcons, Entypo, AntDesign } from '@expo/vector-icons'

const Amenities = ({amenities})=>{
    return(
    <View>
        { amenities?.water && <View style={styles.amenitiesLabelCont}>
        <Entypo name="water" size={25} color="black" style={styles.iconStyle}/>  
        <Text style={styles.amenitiesText}>{amenities.water}</Text>
         </View>}
        {  amenities?.electricity && <View style={styles.amenitiesLabelCont}>
            <Fontisto name="lightbulb" size={25} color="black" style={styles.iconStyle}/>
            <Text style={styles.amenitiesText}>{ amenities.electricity}</Text>
         </View>}
         { amenities?.security && <View style={styles.amenitiesLabelCont}>
            <MaterialCommunityIcons name="door-sliding-lock" size={25} color="black" style={styles.iconStyle} />
            <Text style={styles.amenitiesText}>{amenities.security}</Text>
         </View>}
         { amenities?.wardrobe && <View style={styles.amenitiesLabelCont}>
         <MaterialCommunityIcons name="wardrobe-outline" size={25} color="black" style={styles.iconStyle} />
            <Text style={styles.amenitiesText}>{amenities.wardrobe}</Text>
         </View>}
         { amenities?.pop && <View style={styles.amenitiesLabelCont}>
         <Entypo name="popup" size={25} color="black" style={styles.iconStyle}/>    
            <Text style={styles.amenitiesText}>{amenities.pop}</Text>
         </View>}
         { amenities?.parkingSpace && <View style={styles.amenitiesLabelCont}>
            <AntDesign name="car" size={25} color='black' style={styles.iconStyle}/>
            <Text style={styles.amenitiesText}>{amenities.parkingSpace}</Text>
         </View>}
         </View>
    )
}
export default Amenities

const styles = StyleSheet.create({
   amenitiesLabelCont: {
      flexDirection:'row', 
      alignItems:"center", 
      marginBottom: 8
   },
   iconStyle: {
      color:'#4C4C4C', 
      width: 40,
      marginRight: 5
   },
   amenitiesText: {
      fontSize: 15, 
      fontWeight:'500', 
      color:'#4C4C4C'
   }
})