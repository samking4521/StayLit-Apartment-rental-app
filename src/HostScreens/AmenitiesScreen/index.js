import {View, Text, ScrollView, StyleSheet} from 'react-native'
import Amenities from '../../components/Amenities'
import {useRoute, useNavigation} from '@react-navigation/native'
import { AntDesign } from '@expo/vector-icons'

const AmenitiesScreen = ()=>{
    const route = useRoute()
    const navigation = useNavigation()
    const {amenities} = route.params

    return(
      <View style={styles.container}>
             <View style={styles.header}> 
                      <AntDesign name="arrowleft" size={24} color="black" style={{marginRight: 20}} onPress={()=>{navigation.goBack()}}/>
                     <Text style={styles.headerText}>Amenities</Text>
              </View>
             <ScrollView contentContainerStyle={{padding: 20}}>
                    <Text style={styles.labelDescText}>What this place offers</Text>
                    <Amenities amenities={amenities}/>
             </ScrollView>
             
      </View>
        
    )
}

export default AmenitiesScreen

const styles = StyleSheet.create({
       container: {
              flex : 1, 
              backgroundColor:'white'
       },
       header: {
              flexDirection:'row', 
              alignItems:'center', 
              borderBottomWidth: 0.5, 
              padding: 20, 
              borderBottomColor:"lightgray"
       },
       headerText: {
              fontSize: 20, 
              fontWeight:'600'
       },
       labelDescText: {
              fontSize: 25, 
              fontWeight:'600', 
              letterSpacing:0.5, 
              marginBottom: 20
       }
})

