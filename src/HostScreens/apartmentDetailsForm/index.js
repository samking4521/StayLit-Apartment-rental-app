import { useState, useEffect } from 'react'
import {View, Text, Pressable, ScrollView, StyleSheet } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { MaterialCommunityIcons, Feather} from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'


const ApartmentDetailsForm = ()=>{
    const route = useRoute()
    const { mode, apartment } = route.params
    const [apartmentShareStatus, setApartmentShareStatus] = useState(apartment?.shareStatus || null)
    const [placeType, setPlaceType] = useState(apartment?.placeType || null)
    const [bedroomNo, setBedRoomNo] = useState(apartment?.bedroom || 1)
    const [bathroomNo, setBathRoomNo] = useState(apartment?.bathroom || 1)
    const navigation = useNavigation()
    const [disableNextBtn, setDisableNextBtn] = useState(true)
   
    
    useEffect(()=>{
        if (apartmentShareStatus && placeType) {
            setDisableNextBtn(false)
        }
    }, [apartmentShareStatus, placeType])

     const navigateToApartmentAmenities = ()=>{
        if (apartmentShareStatus==null || placeType==null) {
            return
        }
        navigation.navigate('apartmentAmenitiesForm', { 'apartmentShareStatusStorage' : apartmentShareStatus, 'placeTypeStorage' : placeType, 'bedroomNoStorage': bedroomNo, 'bathroomNoStorage': bathroomNo, apartment, mode })
      
    }
    return(
     <View style={styles.container}>
        <ScrollView  showsVerticalScrollIndicator={false}>
        <StatusBar style='dark' backgroundColor='white'/>
         <View style={styles.contentContainer}>
          <View style={{marginBottom: 20}}>
                   <View>
                        <Text style={styles.headerText}>Tell us about {'\n'}your place</Text>
                        <Text style={styles.headerDescText}>In this step, specify the type of property you have, whether renters will rent an entire apartment or shared apartment</Text>
                    </View>
                    <View style={styles.apartmentShareCont}>
                    <Pressable onPress={()=>{setApartmentShareStatus('Entire')}} style={{ ...styles.aptShareTab, borderWidth: 1, backgroundColor:apartmentShareStatus == 'Entire'? 'rgba(0,0,0,0.5)' : 'white'}}>
                            <MaterialCommunityIcons name="home" size={40} color={apartmentShareStatus == 'Entire'? 'white' : 'black'} />
                            <Text style={{fontSize: 14, color: apartmentShareStatus == 'Entire'? 'white':'black'}}>Entire Apartment</Text>
                    </Pressable>
                        <Pressable onPress={()=>{setApartmentShareStatus('Shared')}} style={{ ...styles.aptShareTab, borderWidth: 1, backgroundColor:apartmentShareStatus == 'Shared'? 'rgba(0,0,0,0.5)' : 'white'}}>
                            <MaterialCommunityIcons name="home-group" size={40} color={apartmentShareStatus == 'Shared'? 'white':'black'}/>
                            <Text style={{fontSize: 14, color: apartmentShareStatus =='Shared'? 'white' : 'black' }}>Shared Apartment</Text>
                        </Pressable>

                    </View>
          </View>
          <View style={{marginBottom: 20}}>
                    <View>
                        <Text style={styles.headerText}>Type of place</Text>
                        <Text style={styles.headerDescText}>in this step, specify the type of apartment you are leasing</Text>
                    </View>

            <View style={styles.roomTypeCont}>
             
                    <Pressable onPress={()=>{setPlaceType('Room')}} style={{ ...styles.roomTab, borderWidth : 1, backgroundColor: placeType == 'Room'? 'rgba(0,0,0,0.5)' : 'white'}}>
                        <Text style={{color: placeType == 'Room'? 'white':'black' }}>Room</Text>
                    </Pressable>
                    <Pressable  onPress={()=>{setPlaceType('Room & P')}}  style={{ ...styles.roomTab, borderWidth: 1, backgroundColor: placeType == 'Room & P'? 'rgba(0,0,0,0.5)':'white'}}>
                        <Text style={{color: placeType == 'Room & P'? 'white':'black' }}>Room & P</Text>
                    </Pressable>
                    <Pressable onPress={()=>{setPlaceType('Self-Con')}} style={{ ...styles.roomTab,borderWidth: 1, backgroundColor: placeType == 'Self-Con'? 'rgba(0,0,0,0.5)':'white' }}> 
                        <Text style={{color: placeType == 'Self-Con'? 'white':'black'  }}>Self-Con</Text>
                    </Pressable>
             </View>

             <View style={styles.secondRoomTabCont}>
        
                <Pressable onPress={()=>{setPlaceType('Flat')}} style={{ ...styles.roomBTab, borderWidth: 1, backgroundColor: placeType == 'Flat'? 'rgba(0,0,0,0.5)':'white' }}>
                    <Text style={{color: placeType == 'Flat'? 'white':'black'  }}>Flat</Text>
                </Pressable>
                <Pressable  onPress={()=>{setPlaceType('Duplex')}} style={{ ...styles.roomBTab,  borderWidth: 1, backgroundColor: placeType == 'Duplex'? 'rgba(0,0,0,0.5)':'white' }}>
                    <Text style={{color : placeType == 'Duplex'? 'white':'black'  }}>Duplex</Text>
                </Pressable>
             </View>

             <Pressable onPress={()=>{setPlaceType('Commercial-Space')}} style={{ marginTop: 10, padding: 15, borderRadius:10, borderWidth: 1, justifyContent:'center', alignItems:'center', backgroundColor: placeType == 'Commercial-Space'? 'rgba(0,0,0,0.5)':'white' }}>
                    <Text style={{color: placeType == 'Commercial-Space'? 'white':'black'  }}>Retail/Office Spaces</Text>
                </Pressable>
         </View> 
          
        <View style={{marginBottom: 30}}>
            <View>
                <Text style={styles.headerText}>No Of Rooms</Text>
                <Text style={styles.headerDescText}>Specify the Number of bedrooms and bathrooms</Text>
            </View>
            <View style={styles.selectRmNoCont}>
                <Text style={styles.roomText}>Bedrooms</Text>
                <View style={styles.buttonCont}>
                <Feather name="plus-circle" size={25} color="#4C4C4C" onPress={()=>{setBedRoomNo(bedroomNo + 1)}}/>                            
                    <Text style={styles.roomNoText}>{bedroomNo}</Text>
                <Feather name="minus-circle" size={25} color="#4C4C4C" onPress={()=>{if(bedroomNo == 0){ return}; setBedRoomNo(bedroomNo - 1)}}/> 
               </View>
            </View>

            <View style={styles.selectRmNoCont}>
                <Text style={styles.roomText}>Bathrooms</Text>
                <View style={styles.buttonCont}>
                <Feather name="plus-circle" size={25} color="#4C4C4C" onPress={()=>{setBathRoomNo(bathroomNo + 1)}}/>                            
                    <Text style={styles.roomNoText}>{bathroomNo}</Text>
                <Feather name="minus-circle" size={25} color="#4C4C4C" onPress={()=>{if(bathroomNo == 0){ return}; setBathRoomNo(bathroomNo - 1)}} /> 
               </View>
            </View>
        </View>
         
        </View>
       
      </ScrollView>
     
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
                <Pressable onPress={navigateToApartmentAmenities} style={{ ...styles.nextBtn, backgroundColor: disableNextBtn ? 'rgba(0,0,0,0.3)' : 'black' }}>
                    <Text style={styles.nextText}>Next</Text>
                </Pressable>
            </View>
     </View>
      
   
    )
}

export default ApartmentDetailsForm

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor:'white'
    },
    contentContainer: {
        flex: 1, 
        padding: 20
    },
    headerText: {
        fontSize: 20, 
        fontWeight: '600', 
        marginBottom: 3
    },
    headerDescText: {
        fontSize: 14, 
        color:'#4C4C4C', 
        fontWeight:'400'
    },
    apartmentShareCont: {
        flexDirection:'row', 
        alignItems:'center', 
        justifyContent:'space-between', 
        marginTop: 20
    },
    aptShareTab: {
        justifyContent:'center', 
        alignItems:'center', 
        borderRadius: 10, 
        width: '47%', 
        height: 100
    },
    roomTypeCont: {
        flexDirection: 'row', 
        alignItems:'center', 
        marginVertical: 20,
        justifyContent:'space-between'
    },
    roomTab: {
        justifyContent: 'center', 
        alignItems:'center', 
        borderColor: 'black', 
        width: '32%',
        height: 50,
        borderRadius: 10
    },
    roomPTab: {
        marginHorizontal: 10, 
        flex: 1, 
        justifyContent: 'center', 
        alignItems:'center', 
        borderColor: 'black', 
        paddingVertical: 20, 
        paddingHorizontal: 20, 
        borderRadius : 10
    },
    selfConTab: {
        flex: 1, 
        borderColor: 'black',
        justifyContent: 'center', 
        alignItems:'center', 
        borderRadius: 10,  
        paddingVertical: 20, 
        paddingHorizontal: 20
    },
    secondRoomTabCont: {
        flexDirection: 'row', 
        alignItems:'center', 
        justifyContent:'space-between'
    },
    roomBTab: {
        width : '47%',
        height: 50,
        justifyContent: 'center', 
        alignItems:'center', 
        borderColor: 'black', 
        borderRadius: 10
    },
    selectRmNoCont: {
        flexDirection:'row', 
        justifyContent:'space-between', 
        alignItems:'center', 
        paddingVertical: 15, 
        borderBottomWidth: 1, 
        borderColor:'lightgray'
    },
    roomText: {
        fontSize: 16, 
        fontWeight:'400'
    },
    buttonCont: {
        flexDirection:'row', 
        justifyContent:'center', 
        alignItems:'center'
    },
    roomNoText: {
        marginHorizontal: 10, 
        fontWeight: '500', 
        fontSize: 16
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
        backgroundColor:'rgba(0,0,0,0.3)',
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
        textDecorationLine:'underline', 
        fontSize: 16
    },
    nextBtn: {
        paddingVertical: 10, 
        paddingHorizontal: 20, 
        borderRadius:10
    },
    nextText: {
        fontWeight: '600', 
        color:'white', 
        fontSize: 16, 
        letterSpacing: 0.5
    }
})