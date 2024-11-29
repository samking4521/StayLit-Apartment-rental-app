import {View, Text, Pressable, Modal, TextInput, ScrollView, TouchableOpacity, StyleSheet} from 'react-native'
import { useState, useRef } from 'react'
import { FontAwesome6, AntDesign, Octicons } from '@expo/vector-icons'
import Checkbox from 'expo-checkbox';
import { StatusBar } from 'expo-status-bar';


const FilterScreen = ({allApartments, setPlaceValue, minPriceValue, maxPriceValue, typeOfPlace, setRunningWater, setElecricity, setPop, setWardrobe, setSecurity, setParkingSpace, setMinPriceValue, setMaxPriceValue, setTypeOfPlace, setAmenityFalseVal, setAmenityVal, setApartments, setArr, apartments, modalIsVisible, setModalVisible})=>{
    const [isPriceContClicked, setIsPriceContClicked] = useState(null)
    const minPriceTxtInputRef = useRef()
    const maxPriceTxtInputRef = useRef()
    const [isWaterChecked, setIsWaterChecked] = useState(false)
    const [isElectricityChecked, setisElectricityChecked] = useState(false)
    const [isSecurityChecked, setIsSecurityChecked] = useState(false)
    const [isPopChecked, setIsPopChecked] = useState(false)
    const [isWardrobeChecked, setIsWardrobeChecked] = useState(false)
    const [isParkingSpaceChecked, setIsParkingSpaceChecked] = useState(false)
    
    const closeFilterScreen = ()=>{
        setModalVisible(false)
        setTypeOfPlace('All')
        setMinPriceValue('All')
        setMaxPriceValue('All')
        minPriceTxtInputRef.current.blur()
        maxPriceTxtInputRef.current.blur()
        setIsPriceContClicked(null)
        setIsWaterChecked(false)
        setisElectricityChecked(false)
        setIsParkingSpaceChecked(false)
        setIsSecurityChecked(false)
        setRunningWater(null)
        setElecricity(null)
        setSecurity(null)
        setParkingSpace(null)
        setArr([])
    
    }
  
    const onMaxPriceInput = (val)=>{
        setMaxPriceValue(val)
    }

    const onMinPriceInput = (val)=>{
        setMinPriceValue(val)
    }

    const onClickMinPriceContainer = ()=>{
         setIsPriceContClicked('Minimum')
         minPriceTxtInputRef.current.focus()
         maxPriceTxtInputRef.current.blur()

    }

    const onClickMaxPriceContainer = ()=>{
        setIsPriceContClicked('Maximum')
        maxPriceTxtInputRef.current.focus()
        minPriceTxtInputRef.current.blur()
   }

   const tickWaterCheckBox = ()=>{
      if(isWaterChecked) {
        setIsWaterChecked(false)
        setRunningWater(null)
        setAmenityFalseVal('water')
      }
      else{
        setIsWaterChecked(true)
        setRunningWater('water')
        setAmenityVal('water')
      }

   }

   const tickParkingSpaceCheckBox = ()=>{
    if(isParkingSpaceChecked) {
      setIsParkingSpaceChecked(false)
      setParkingSpace(null)
      setAmenityFalseVal('parkingSpace')
    }
    else{
        setIsParkingSpaceChecked(true)
        setParkingSpace('parkingSpace')
      setAmenityVal('parkingSpace')
    }

 }
 
   const tickElectricityCheckBox = ()=>{
    if(isElectricityChecked) {
        setisElectricityChecked(false)
        setElecricity(null)
        setAmenityFalseVal('electricity')
      }
      else{
        setisElectricityChecked(true)
        setElecricity('electricity')
        setAmenityVal('electricity')
      }
 }
 
 const tickSecurityCheckBox = ()=>{
    if(isSecurityChecked) {
        setIsSecurityChecked(false)
        setSecurity(null)
        setAmenityFalseVal('security')
      }
      else{
        setIsSecurityChecked(true)
        setSecurity('security')
        setAmenityVal('security')
      }
 }

 const tickWardrobeCheckBox = ()=>{
    if(isWardrobeChecked) {
        setIsWardrobeChecked(false)
        setWardrobe(null)
        setAmenityFalseVal('wardrobe')
      }
      else{
        setIsWardrobeChecked(true)
        setWardrobe('wardrobe')
        setAmenityVal('wardrobe')
      }
 }

 const tickPopCheckBox = ()=>{
    if(isPopChecked) {
        setIsPopChecked(false)
        setPop(null)
        setAmenityFalseVal('pop')
      }
      else{
        setIsPopChecked(true)
        setPop('pop')
        setAmenityVal('pop')
      }
 }

  const clearAllFilterData = ()=>{
    setTypeOfPlace('All')
    setMinPriceValue('All')
    setMaxPriceValue('All')
    minPriceTxtInputRef.current.blur()
    maxPriceTxtInputRef.current.blur()
    setIsPriceContClicked(null)
    setIsWaterChecked(false)
    setisElectricityChecked(false)
    setIsSecurityChecked(false)
    setRunningWater(null)
    setElecricity(null)
    setSecurity(null)
    setParkingSpace(null)
    setWardrobe(null)
    setIsWardrobeChecked(false)
    setPop(null)
    setIsPopChecked(false)
    setIsParkingSpaceChecked(false)
    setArr([])
  }

 const showPlacesBtn = ()=>{
     setApartments(apartments)
     setModalVisible(false)
  }

  const showAllApartments = async ()=>{
    setApartments(allApartments)
    clearAllFilterData()
    setModalVisible(false)
    setPlaceValue(null)
  }

    return (
        <Modal visible={modalIsVisible} animationType="slide"  onRequestClose={() => setModalVisible(false)} presentationStyle='pageSheet' >
        <StatusBar style='light' backgroundColor='rgba(0,0,0,0.5)'/>
        <View showsVerticalScrollIndicator={false} style={styles.modalContainer}>
             <View style={styles.header}>
                     <Pressable onPress={closeFilterScreen} >
                        <AntDesign name="close" size={22} color="black" style={{marginRight: 20}}/>
                    </Pressable>
                     <Text style={styles.filterText}>Filters</Text>
                    <Text onPress={showAllApartments} style={styles.showAllPlaceText}>Show All Places</Text>
                
             </View>
         <ScrollView showsVerticalScrollIndicator={false}>
             <View style={styles.labelCont}>

               <View style={{marginBottom: 23}}>
                  <Text style={styles.labelText}>Type of place</Text>
                 <Text style={styles.labelDescText}>Filter places by Rooms, Flats, Office spaces, Retails space or any Type of Place</Text>
               </View>



               <View style={{...styles.alignContainer, marginBottom: 23}}>
                     <Pressable onPress={()=>{setTypeOfPlace('All')}} style={{ backgroundColor: typeOfPlace=='All'? 'black' : 'white' , ...styles.firstTab}}> 
                         <Text style={{color: typeOfPlace=='All'? 'white' : 'black' }}>Any Type</Text>
                     </Pressable>
                     <Pressable onPress={()=>{setTypeOfPlace('Room')}} style={{backgroundColor: typeOfPlace=='Room'? 'black' : 'white' , ...styles.secondTab}}>
                         <Text style={{color: typeOfPlace=='Room'? 'white' : 'black' }}>Room</Text>
                     </Pressable>
                     <Pressable onPress={()=>{setTypeOfPlace('Room & P')}} style={{backgroundColor: typeOfPlace=='Room & P'? 'black' : 'white' , ...styles.thirdTab}}>
                         <Text style={{color: typeOfPlace=='Room & P'? 'white' : 'black' }}>Room & P</Text>
                     </Pressable>
             </View>



                 <View style={styles.alignContainer}>
                 <Pressable onPress={()=>{setTypeOfPlace('Self-Con')}} style={{backgroundColor: typeOfPlace=='Self-Con'? 'black' : 'white', ...styles.firstTab}}> 
                         <Text style={{color: typeOfPlace=='Self-Con'? 'white' : 'black' }}>Self-Con</Text>
                     </Pressable>
                     <Pressable onPress={()=>{setTypeOfPlace('Flat')}} style={{backgroundColor: typeOfPlace=='Flat'? 'black' : 'white', ...styles.secondTab}}>
                         <Text style={{color: typeOfPlace=='Flat'? 'white' : 'black' }}>Flat</Text>
                     </Pressable>
                     <Pressable onPress={()=>{setTypeOfPlace('Duplex')}} style={{backgroundColor: typeOfPlace=='Duplex'? 'black' : 'white', ...styles.thirdTab}}>
                         <Text style={{color: typeOfPlace=='Duplex'? 'white' : 'black' }}>Duplex</Text>
                     </Pressable>
                    
                 </View>
                 <Pressable onPress={()=>{setTypeOfPlace('Commercial-Space')}} style={{backgroundColor: typeOfPlace=='Commercial-Space'? 'black' : 'white', borderWidth: 1, padding: 20, borderRadius: 10, marginTop: 15, borderColor:'gray'}}>
                         <Text style={{color: typeOfPlace=='Commercial-Space'? 'white' : 'black', alignSelf:'center'}}>Office/Retail Space</Text>
                     </Pressable>
               </View>
               <View style={styles.labelCont}>
                     <View style={{marginBottom: 23}}>
                         <Text style={styles.labelText}>Price Range</Text>
                         <Text style={styles.labelDescText}>Select price ranging from minimum to maximum</Text>
                     </View>
                 <View style={{...styles.alignContainer, justifyContent:'center'}}>
                    <Pressable onPress={onClickMinPriceContainer} style={{borderWidth:isPriceContClicked=='Minimum'? 2 : 1 , borderColor: isPriceContClicked=='Minimum'? 'black' : 'gray',  marginRight:'auto', ...styles.priceRangeCont}}>
                              <Text style={styles.priceRangeText}>Minimum</Text>
                              <View style={styles.alignContainer}>
                                 <FontAwesome6 name="naira-sign" size={15} color="black" />
                                 <TextInput ref={minPriceTxtInputRef} value={minPriceValue} autoFocus={false} onChangeText={onMinPriceInput} keyboardType='number-pad' style={styles.priceTextInput}/>
                              </View>
                        </Pressable>
                        <Octicons name="dash" size={28} color="gray" />
                        <Pressable onPress={onClickMaxPriceContainer} style={{borderWidth:isPriceContClicked=='Maximum'? 2 : 1 , borderColor: isPriceContClicked=='Maximum'? 'black' : 'gray' ,  marginLeft:'auto', ...styles.priceRangeCont}}>
                              <Text style={styles.priceRangeText}>Maximum</Text>
                              <View style={styles.alignContainer}>
                                 <FontAwesome6 name="naira-sign" size={15} color="black" />
                                 <TextInput value={maxPriceValue} ref={maxPriceTxtInputRef} autoFocus={false} onChangeText={onMaxPriceInput} keyboardType='number-pad' style={styles.priceTextInput}/>
                              </View>
                        </Pressable>
                    </View>
                 </View>
                 <View style={styles.labelCont}>
                     <Text style={styles.labelText}>Amenities</Text>
                     <View>
                         <View style={{...styles.alignContainer, marginBottom:20}}>
                             <Text style={styles.amenitiesText}>Running Water</Text>
                             <Checkbox style={styles.chkBoxStyle} color={isWaterChecked? 'black' : undefined} value={isWaterChecked} onValueChange={tickWaterCheckBox} />
                         </View>

                         <View style={styles.amenitiesLabel}>
                             <Text style={styles.amenitiesText}>Electricity</Text>
                             <Checkbox style={styles.chkBoxStyle} color={isElectricityChecked? 'black' : undefined} value={isElectricityChecked} onValueChange={tickElectricityCheckBox} />
                         </View>
                         <View style={styles.amenitiesLabel}>
                             <Text style={styles.amenitiesText}>Security</Text>
                             <Checkbox style={styles.chkBoxStyle} color={isSecurityChecked? 'black' : undefined} value={isSecurityChecked} onValueChange={tickSecurityCheckBox} />
                         </View>
                         <View style={styles.amenitiesLabel}>
                             <Text style={styles.amenitiesText}>Wardrobe</Text>
                             <Checkbox style={styles.chkBoxStyle} color={isWardrobeChecked? 'black' : undefined} value={isWardrobeChecked} onValueChange={tickWardrobeCheckBox} />
                         </View>
                         <View style={styles.amenitiesLabel}>
                             <Text style={styles.amenitiesText}>Pop</Text>
                             <Checkbox style={styles.chkBoxStyle} color={isPopChecked? 'black' : undefined} value={isPopChecked} onValueChange={tickPopCheckBox} />
                         </View>
                         <View style={styles.amenitiesLabel}>
                             <Text style={styles.amenitiesText}>Parking Space</Text>
                             <Checkbox style={styles.chkBoxStyle} color={isParkingSpaceChecked? 'black' : undefined} value={isParkingSpaceChecked} onValueChange={tickParkingSpaceCheckBox} />
                         </View>
                     </View>
                 </View>
             </ScrollView>
             <View style={styles.footerLabel}>
                 <TouchableOpacity onPress={clearAllFilterData} style={{marginRight: 'auto'}}>
                     <Text style={styles.clearText}>Clear all</Text>
                 </TouchableOpacity>
             <Pressable onPress={showPlacesBtn} style={styles.placesLengthBtn}>
                 <Text style={styles.placesLengthText}>{(!apartments || apartments?.length == 0)? 0 : apartments?.length} places</Text>
             </Pressable>
             </View>
        </View>
    </Modal>
    )
}

export default FilterScreen

const styles = StyleSheet.create({
    modalContainer: {
        flex : 1, 
        backgroundColor: 'white'
    },
    header: {
        flexDirection: 'row', 
        paddingHorizontal: 20, 
        paddingVertical: 20, 
        borderBottomWidth: 1, 
        alignItems: 'center', 
        borderBottomColor: 'lightgray'
    },
    filterText: {
        fontSize: 18, 
        fontFamily: 'sans-serif', 
        letterSpacing: 0.5, 
        fontWeight: '700', 
        marginRight:'auto'
    },
    showAllPlaceText: {
        color : 'black', 
        fontWeight: '500', 
        fontSize: 14
    },
    labelCont: {
        borderBottomWidth: 1, 
        borderBottomColor: 'lightgray', 
        paddingHorizontal: 22, 
        paddingVertical: 30
    },
    labelText: {
        fontSize: 20, 
        fontWeight: '600', 
        marginBottom: 2
    },
    labelDescText: {
        fontSize: 14, 
        fontWeight: '400'
    },
    alignContainer: {
        flexDirection: 'row', 
        alignItems:'center'
    },
    firstTab: {
        borderWidth: 1, 
        flex: 1, 
        justifyContent: 'center', 
        alignItems:'center', 
        borderColor: 'gray', 
        borderTopLeftRadius: 10, 
        borderBottomLeftRadius: 10,  
        padding: 20
    },
    secondTab: {
        borderTopWidth: 1, 
        flex: 1, 
        justifyContent: 'center', 
        alignItems:'center', 
        borderBottomWidth: 1, 
        borderColor: 'gray', 
        padding: 20
    },
    thirdTab: {
        borderWidth: 1, 
        flex: 1, 
        justifyContent: 'center', 
        alignItems:'center', 
        borderColor: 'gray', 
        padding: 20, 
        borderTopRightRadius: 10, 
        borderBottomRightRadius: 10
    },
    priceRangeCont: {
        width: '40%', 
        borderRadius: 10, 
        paddingLeft: 10, 
        paddingVertical: 10
    },
    priceRangeText: {
        color: 'gray', 
        fontWeight: '400'
    },
    priceTextInput: {
        fontWeight: '600', 
        fontSize: 16
    },
    amenitiesText: {
        marginRight: 'auto', 
        fontSize: 16, 
        fontWeight:'400'
    },
    chkBoxStyle: {
        padding: 15, 
        borderRadius: 4, 
        borderColor: 'gray', 
        borderWidth: 1
    },
    amenitiesLabel: {
        flexDirection: 'row', 
        alignItems: 'center',  
        marginBottom: 20
    },
    footerLabel: {
        flexDirection: 'row', 
        paddingHorizontal: 20, 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderTopWidth: 1, 
        borderColor: 'gray', 
        paddingVertical: 12
    },
    clearText: {
        fontSize: 15, 
        fontWeight: '600'
    },
    placesLengthBtn: {
        backgroundColor: 'black', 
        color: 'white', 
        paddingHorizontal: 10, 
        paddingVertical: 15, 
        fontSize: 16, 
        fontWeight: '600', 
        borderRadius: 10
    },
    placesLengthText: {
        color: 'white', 
        fontSize: 16, 
        fontWeight:'600'
    }
})