import { useState, useEffect } from 'react'
import {View, Text, Pressable, StyleSheet} from 'react-native'
import { Ionicons, MaterialCommunityIcons, Fontisto, Entypo, AntDesign } from '@expo/vector-icons'
import { useNavigation, useRoute} from '@react-navigation/native'

const ApartmentAmenitiesForm = ()=>{
    const route = useRoute()
    const { apartmentShareStatusStorage, placeTypeStorage, bedroomNoStorage, bathroomNoStorage, apartment, mode } = route.params
    const [electricity, setElectricity] = useState(apartment?.electricity || null)
    const [water, setWater] = useState(apartment?.water || null)
    const [security, setSecurity] = useState(apartment?.security || null)
    const [wardrobe, setWardRobe] = useState(apartment?.wardrobe || null)
    const [pop, setPop] = useState(apartment?.pop || null)
    const [parkingSpace, setParkingSpace] = useState(apartment?.parkingSpace || null)
    const navigation = useNavigation()
    const [disableNextBtn, setDisableNextBtn] = useState(true)
    
    useEffect(()=>{
        if (electricity || water || security || wardrobe || pop){
            setDisableNextBtn(false)
        }else{
            setDisableNextBtn(true)
        }
    }, [electricity, water, security, wardrobe, pop ])

    const navigateToApartmentPhotos = ()=>{
        if (electricity || water || security || wardrobe || pop){
            navigation.navigate('apartmentPhotosForm', { apartmentShareStatusStorage, placeTypeStorage, bedroomNoStorage, bathroomNoStorage, 'electricityStorage' : electricity, 'waterStorage': water, 'securityStorage' : security, 'wardrobeStorage' : wardrobe, 'popStorage' : pop, apartment, mode, parkingSpace})
        }
    }
     
   return(
     <View style={styles.container}>
        <View style={styles.contentContainer}>
        <View>
              <Text style={styles.headerText}>Tell Renters What Your Place has to offer</Text>
              <Text style={styles.headerDescText}>Adding amenities helps renters understand the living environment and make informed decisions based on their preferences and lifestyle needs</Text>
          </View>
      
       <View>
              <View style={styles.amenitiesCont}>
                          <Pressable onPress={()=>{setElectricity(electricity? null : 'electricity')}} style={{ ...styles.amenitiesTab, borderWidth: 1,  backgroundColor: electricity? 'rgba(0,0,0,0.5)':'white'}}>
                              <Fontisto name="lightbulb" size={30} color={electricity? 'white':'#4C4C4C'} style={{marginBottom: 10}}/>
                              <Text style={{fontWeight:'500', color: electricity?'white':'black'}}>Electricity</Text>
                          </Pressable>
                          <Pressable onPress={()=>{setWater(water? null : 'water')}} style={{ ...styles.amenitiesTab,  borderWidth: 1,  backgroundColor: water? 'rgba(0,0,0,0.5)':'white'}}>
                              <Ionicons name="water-outline" size={30} color={ water? 'white':'#4C4C4C'} style={{marginBottom: 10}}/>  
                              <Text style={{fontWeight:'500', color: water?'white':'black'}}>Running Water</Text>
                          </Pressable>
              </View>
               <View style={styles.amenitiesCont}>
                          <Pressable onPress={()=>{setSecurity(security? null: 'security')}} style={{ ...styles.amenitiesTab, borderWidth: 1,  backgroundColor: security? 'rgba(0,0,0,0.5)':'white'}}>
                          <MaterialCommunityIcons name="door-sliding-lock" size={30} color={security? 'white' : '#4C4C4C'} style={{marginBottom: 10}}/>
                          <Text style={{fontWeight:'500',  color: security? 'white':'black'}}>Security</Text>
                          </Pressable>
                          <Pressable onPress={()=>{setWardRobe(wardrobe? null: 'wardrobe')}} style={{ ...styles.amenitiesTab, borderWidth: 1, backgroundColor: wardrobe? 'rgba(0,0,0,0.5)':'white' }}>
                              <MaterialCommunityIcons name="wardrobe-outline" size={30} color={ wardrobe? 'white' : '#4C4C4C'} style={{marginBottom: 10}} />
                              <Text style={{fontWeight:'500',  color: wardrobe? 'white':'black'}}>Wardrobe</Text>
                          </Pressable>
              </View>
              
              <View style={styles.amenitiesCont}>
                          <Pressable onPress={()=>{setPop(pop? null: 'pop')}} style={{ ...styles.amenitiesTab, borderWidth: 1, backgroundColor: pop? 'rgba(0,0,0,0.5)':'white'}}>
                                  <Entypo name="popup" size={30} color={pop? 'white':"#4C4C4C"} style={{marginBottom: 10}}/>    
                                  <Text style={{fontWeight:'500', color: pop?'white':'black'}}>POP</Text>
                          </Pressable>
                          <Pressable onPress={()=>{setParkingSpace(parkingSpace? null: 'parkingSpace')}} style={{ ...styles.amenitiesTab, borderWidth: 1, backgroundColor: parkingSpace? 'rgba(0,0,0,0.5)':'white' }}>
                              <AntDesign name="car" size={30} color={parkingSpace? 'white':"#4C4C4C"} style={{marginBottom: 10}} />
                              <Text style={{fontWeight:'500',  color: parkingSpace? 'white':'black'}}>Parking Space</Text>
                          </Pressable>
                          
              </View>
         
       </View>
        </View>
        <View style={styles.footerCont}>
                    <View style={styles.loadBarAa}></View>
                    <View style={styles.loadBarAb}></View>
                    <View style={styles.loadBarAc}></View>
           
                    <View style={styles.loadBarBa}></View>
                    <View style={styles.loadBarBb}></View>
                    
                    <View style={styles.loadBarC}></View>
                    <View style={styles.loadBarC}></View>
                    <View style={styles.loadBarC}></View>
            </View>
            <View style={styles.footerContainer}>
                <Text style={styles.backText} onPress={()=>{navigation.goBack()}}>Back</Text>
                <Pressable onPress={navigateToApartmentPhotos} style={{ ...styles.nextBtn, backgroundColor: disableNextBtn? 'rgba(0,0,0,0.3)' : 'black'}}>
                    <Text style={styles.nextText}>Next</Text>
                </Pressable>
            </View>
    </View>
    )
}

export default ApartmentAmenitiesForm

const styles = StyleSheet.create({
     container: {
        flex: 1, 
        backgroundColor: 'white'
     },
     contentContainer: {
        flex: 1, 
        padding: 20
     },
     headerText: {
        fontSize: 20, 
        fontWeight: '600'
     },
     headerDescText: {
        fontSize: 14, 
        color:'#4C4C4C'
     },
     amenitiesCont: {
        flexDirection:'row', 
        justifyContent:'space-around', 
        marginTop: 20
     },
     amenitiesTab: {
        flexDirection:'column', 
        justifyContent:'center', 
        alignItems:'center', 
        width: '45%', 
        height: 100,
        borderRadius: 10
     },
     footerCont:{
        width: '100%', 
        flexDirection: 'row', 
        alignItems: 'center'
     }, 
     loadBarAa: {
        backgroundColor:'black', 
        padding: 3, 
        width: '11%'
     },
     loadBarAb: {
        backgroundColor:'black',
        padding: 3, 
        width: '11%'
     },
     loadBarAc: {
        backgroundColor:'rgba(0,0,0,0.3)', 
        padding: 3, 
        width: '11%', 
        marginRight: '1%'
     },
     loadBarBa: {
        backgroundColor:'rgba(0,0,0,0.3)', 
        padding: 3, 
        width: '16%'
     },
     loadBarBb: {
        backgroundColor:'rgba(0,0,0,0.3)', 
        padding: 3, 
        width: '16%', 
        marginRight: '1%'
     },
     loadBarC: {
        backgroundColor:'rgba(0,0,0,0.3)', 
        padding: 3, 
        width: '11%'
     },
     footerContainer: {
        flexDirection: 'row', 
        paddingVertical: 10, 
        paddingHorizontal: 20, 
        alignItems:"center", 
        justifyContent:'space-between'
     },
     backText: {
        fontWeight: '600', 
        textDecorationLine: 'underline', 
        fontSize: 16
     },
     nextBtn: {
        paddingVertical: 10,
        paddingHorizontal: 20, 
        borderRadius: 10
     },
     nextText: {
        fontWeight: '600', 
        color:'white', 
        fontSize: 16, 
        letterSpacing: 0.5
     }
})