import { useState, useEffect } from 'react'
import {View, Text, ScrollView, TextInput , Keyboard, KeyboardAvoidingView, StyleSheet, Pressable} from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'

const ApartmentTitleDescForm = ()=>{
    const route = useRoute()
    const { apartmentShareStatusStorage, placeTypeStorage, bedroomNoStorage, bathroomNoStorage, electricityStorage, waterStorage, securityStorage , wardrobeStorage , popStorage, apartmentImagesStorage, addressLatitudeStorage, addressLongitude, addressTextStorage, fullAddressStorage, cityAddressStorage, CountryStorage, StateStorage, apartment, mode, newlyAddedImages, removedImages, parkingSpace } = route.params
    const [wordLength, setWordLength] = useState(apartment? 32 - apartment?.apartmentTitle.length : 32)
    const [titleText, setTitleText] = useState(apartment?.apartmentTitle || '')
    const [BorderWidth, setBorderWidth] = useState('title')
    const [descText, setDescText] = useState(apartment?.apartmentDesc || '')
    const [descLength, setDescLength] = useState(apartment? 500 - apartment?.apartmentDesc.length : 500)
    const [keyboardAppear, setKeyBoardAppear] = useState(false)
    const [disableNextBtn, setDisableNextBtn] = useState(true)
    const navigation = useNavigation()
    
   useEffect(()=>{
    if( titleText && descText && titleText.length <= 32 && descText.length<=500){
      setDisableNextBtn(false)
    }
    else{
      setDisableNextBtn(true)
    }
   }, [titleText, descText])
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
          'keyboardDidShow',
          () => {
            console.log('Keyboard is shown');
            setKeyBoardAppear(true)
            // You can perform actions when the keyboard is shown here
          }
        );
    
        const keyboardDidHideListener = Keyboard.addListener(
          'keyboardDidHide',
          () => {
            console.log('Keyboard is hidden');
            setKeyBoardAppear(false)
            // You can perform actions when the keyboard is hidden here
          }
        );
    
        // Clean up listeners when the component unmounts
        return () => {
          keyboardDidShowListener.remove();
          keyboardDidHideListener.remove();
        };
      }, []);
   

    const setText = (text)=>{
            if (text.length < titleText.length){
                setTitleText(text)
                setWordLength(32 - text.length)
               
            }
            else{
                setTitleText(text)
                setWordLength( 32 - text.length)
            }
         }
         const updateDescText = (text)=>{
            if (text.length < descText.length){
                setDescText(text)
                setDescLength(500 - text.length)
               
            }
            else{
                setDescText(text)
                setDescLength(500 - text.length)
            }
         }
         
       
         const navigateToPriceForm = ()=>{
          if ( titleText && descText && titleText.length <= 32 && descText.length<=500){
            navigation.navigate('apartmentPriceForm', {apartmentShareStatusStorage, placeTypeStorage, bedroomNoStorage, bathroomNoStorage, electricityStorage, waterStorage, securityStorage , wardrobeStorage , popStorage, apartmentImagesStorage, addressLatitudeStorage, addressLongitude, addressTextStorage, fullAddressStorage, cityAddressStorage, CountryStorage, StateStorage, 'title' : titleText, 'desc' : descText, apartment, mode, newlyAddedImages, removedImages, parkingSpace})
          }
         }
    return(
        <KeyboardAvoidingView
        behavior='padding'
        style={styles.container}
      >
            <ScrollView style={{padding: 20}}>
                <View>
                    <Text style={styles.headerText}>Now, let's give your{'\n'} apartment a title</Text>
                    <Text style={styles.headerDescText}>Your title is the first thing renters see, so make it clear and appealing to draw in potential renters</Text>
                </View> 

                <View>
                    <TextInput autoFocus={true} onFocus={()=>{setBorderWidth('title')}} autocomplete={true} autocorrect={true} multiline value={titleText} onChangeText={setText} selectionColor={'rgba(0,0,0,0.5)'} style={{ ...styles.aptTitleTxtInput, borderWidth: BorderWidth == 'title'? 2 : 1, borderColor: (titleText.length> 32) == true? 'red' : 'black'}}/>
                   {titleText.length> 32? <View style={styles.errorTextCont}><FontAwesome5 name="exclamation-circle" size={16} color="red" style={{marginRight : 10}}/><Text style={styles.errorTextContB}><Text style={{fontWeight:'900'}}>{titleText.length - 32}</Text> characters over limit</Text></View>: titleText.length == 0? null : <Text style={styles.errorTextContB}><Text style={{fontWeight:'900'}}>{wordLength}</Text> characters are available</Text>}

                </View>

                <View style={{marginTop: 20}}>
                    <View>
                        <Text  style={styles.headerText}>Create your description</Text>
                        <Text style={styles.headerDescText}>Make your apartment stand out! Attract Renters with a great description</Text>
                    </View>
                    <View>
                    <TextInput  onFocus={()=>{setBorderWidth('description')}} autocomplete={true} autocorrect={true} multiline value={descText} onChangeText={updateDescText} selectionColor={'rgba(0,0,0,0.5)'} style={{ ...styles.aptDescTxtInput, textAlignVertical:'top', borderColor: (descText.length> 500) == true? 'red' : 'black', borderWidth: BorderWidth == 'description'? 2 : 1}}/>
                    {descText.length> 500? <View style={styles.errorTextCont}><FontAwesome5 name="exclamation-circle" size={16} color="red" style={{marginRight : 10}}/><Text style={styles.errorTextContB}><Text style={{fontWeight:'900'}}>{descText.length - 500}</Text> characters over limit</Text></View>: descText.length == 0? null : <Text style={styles.errorTextContB}><Text style={{fontWeight:'900'}}>{descLength}</Text> characters are available</Text>}

                    </View>
                </View>
                
            </ScrollView>
            { !keyboardAppear && <> 
              <View style={styles.footerCont}>
                    <View style={styles.loadBarAa}></View>
                    <View style={styles.loadBarAb}></View>
                    <View style={styles.loadBarAc}></View>
           
                    <View style={styles.loadBarBa}></View>
                    <View style={styles.loadBarBb}></View>
                    
                    <View style={styles.loadBarCa}></View>
                    <View style={styles.loadBarCb}></View>
                    <View style={styles.loadBarCc}></View>
            </View>
            <View style={styles.footerContainer}>
                                    <Text style={styles.backText} onPress={()=>{navigation.goBack()}}>Back</Text>
                                    <Pressable onPress={navigateToPriceForm} style={{ ...styles.nextBtn, backgroundColor: disableNextBtn? 'rgba(0,0,0,0.3)' : 'black'}}>
                                        <Text style={styles.nextText}>Next</Text>
                                    </Pressable>
            </View>
            </>}

    </KeyboardAvoidingView>
    )
}

export default ApartmentTitleDescForm

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor:'white'
  },
  headerText: {
    fontSize: 20, 
    fontWeight: '600', 
    letterSpacing: 0.5
  },
  headerDescText: {
    marginVertical: 10, 
    color:'#4C4C4C', 
    letterSpacing:0.5, 
    fontSize: 14
  },
  errorTextCont: {
    flexDirection:'row', 
    alignItems:'center', 
    marginTop: 3
  },
  errorTextContB: {
    fontSize: 14, 
    color:'black', 
    letterSpacing: 0.5
  },
  aptTitleTxtInput: {
    width:'100%', 
    fontSize: 15, 
    fontWeight: '400', 
    padding: 10,  
    borderRadius: 10, 
    height: 100, 
    textAlignVertical:'top'
  },
  aptDescTxtInput: {
    width:'100%', 
    fontSize: 15, 
    fontWeight: '400', 
    padding: 10, 
    borderRadius: 10, 
    height: 150
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
    backgroundColor:'black', 
    padding: 3, 
    width: '11%', 
    marginRight: '1%'
 },
 loadBarBa: {
    backgroundColor:'black', 
    padding: 3, 
    width: '16%'
 },
 loadBarBb: {
    backgroundColor:'black', 
    padding: 3, 
    width: '16%', 
    marginRight: '1%'
 },
 loadBarCa: {
    backgroundColor:'black', 
    padding: 3, 
    width: '11%'
 },
 loadBarCb: {
  backgroundColor:'rgba(0,0,0,0.3)', 
  padding: 3, 
  width: '11%'
},
loadBarCc: {
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
  borderRadius: 10
},
nextText: {
  fontWeight: '600', 
  color:'white', 
  fontSize: 16, 
  letterSpacing: 0.5
}
})