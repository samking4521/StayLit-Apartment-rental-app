import { useEffect, useState} from 'react'
import {View, Text, Pressable, StyleSheet} from 'react-native'
import Amenities from '../../components/Amenities';
import { useNavigation } from '@react-navigation/native'

const ApartmentAmenities = ({apartment})=>{
    const [realValAmenities, setRealValAmenities] = useState(null)
    const [amenities, setAmenities] = useState({})
    const aptAmenities = {
        electricity : apartment.electricity,
        water : apartment.water,
        security : apartment.security, 
        pop : apartment.pop, 
        wardrobe : apartment.wardrobe,
        parkingSpace : apartment.parkingSpace
    }
    useEffect(()=>{
        let trueAptAmenities = {}
        for (const [key, value] of Object.entries(aptAmenities)) {
            if (value){
                trueAptAmenities[key] = value
            }
         }
         console.log('trueAptAmenities : ', trueAptAmenities)
         sortAmenities(trueAptAmenities)
         setRealValAmenities(trueAptAmenities)
    }, [apartment])
    const navigation = useNavigation()
    const navigateToAmenitiesScreen = ()=>{
        navigation.navigate('Amenities', {amenities : aptAmenities})
    }
   
    const sortAmenities = (trueAmenities)=>{

        let amenities = {}
       
        for (const [key, value] of Object.entries(trueAmenities)) {
           if (value && Object.keys(amenities).length<3){
            amenities[key] = value
           }
        }
        if(!amenities){
            return
        }
        setAmenities(amenities)
    }

  if(!realValAmenities){
    return
  }
    return(
        <View style={styles.container}>
        <Text style={styles.header}>Offered Amenities</Text> 
         <Amenities amenities={amenities}/>
         {
            Object.keys(realValAmenities).length>3 ? (
            <Pressable onPress={navigateToAmenitiesScreen} style={styles.amenitiesBtn}>
                <Text style={styles.amenitiesText}>Show all {Object.keys(realValAmenities).length} Amenities</Text>
            </Pressable>
        ) : null
         }
        </View>
    )
}

export default ApartmentAmenities

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20, 
    borderBottomWidth: 0.5, 
    borderBottomColor: 'gray'
  },
  header: {
    fontSize: 18, 
    fontWeight: '600', 
    letterSpacing: 0.5, 
    marginBottom: 14
  },
  amenitiesBtn: {
    borderWidth: 1, 
    paddingVertical: 10, 
    marginHorizontal: 10, 
    borderRadius: 10 , 
    marginTop: 15
  },
  amenitiesText: {
    textAlign:'center', 
    fontSize: 16, 
    fontWeight: '500', 
    letterSpacing:0.5
  }
})