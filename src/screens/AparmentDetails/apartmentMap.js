import {View, Text, Image, Pressable, StyleSheet } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import {useNavigation} from '@react-navigation/native'

const mapImage = require("../../../assets/mapMagnified.jpeg")

const ApartmentMap = ({apartment})=>{
    const navigation = useNavigation()
    
    const navigateToMapScreen = ()=>{
        navigation.navigate('UserApartmentMap', {apartment : apartment})
    }

    return(
        <View style={styles.container}>
        <View style={{marginBottom: 20}}>
          <Text style={styles.locationText}>Stay Area</Text>
          <Text style={styles.locationDescText}>See apartment location, landmarks and how to get there</Text>
        </View>
        <Pressable onPress={navigateToMapScreen} style={{justifyContent:'center', alignItems:"center"}}>
              <Image source={mapImage} style={styles.mapImageStyle}/>
              <View style={styles.mapIconContainer}>
              <View style={styles.mapIconCont}>
                  <Entypo name="home" size={30} color="white" /> 
              </View>
              </View> 
        </Pressable>
      </View>
    )
}

export default ApartmentMap

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20, 
    borderBottomColor: 'gray', 
    borderBottomWidth: 0.5
  },
  locationText: {
    fontSize : 18, 
    fontWeight: '600', 
    letterSpacing: 0.5
  },
  locationDescText: {
    fontSize: 14, 
    color:'#4C4C4C',
    fontWeight:'500'
  },
  mapImageStyle: {
    width: '100%', 
    height: 250, 
    borderRadius: 20
  },
  mapIconContainer: {
    position: 'absolute', 
    backgroundColor:'rgba(255,0,0,0.3)', 
    width: 100,
    height: 100,
    borderRadius: 100,
    justifyContent:'center',
    alignItems:'center'
  },
  mapIconCont: {
    backgroundColor: '#8B0000',
    paddingVertical: 5, 
    paddingHorizontal: 5, 
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent:'center',
    alignItems:'center'

  }
})