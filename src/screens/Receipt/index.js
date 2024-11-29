import { useState, useEffect, useRef} from 'react'
import { View, Text, Pressable, Modal, Image, useWindowDimensions, StyleSheet} from 'react-native'
import { Ionicons, FontAwesome6, Feather, AntDesign} from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { User } from '../../models'
import { DataStore } from 'aws-amplify/datastore'
import BottomSheet from '@gorhom/bottom-sheet'
import ViewShot from "react-native-view-shot"
import Share from 'react-native-share'
import RNFS from 'react-native-fs';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const Receipt = ({ setShowReceipt, showReceipt, apartment, payment, setInfo, cardInfoTrue, hostData, wishlistIcon})=>{
    const navigation = useNavigation()
    const [userName, setUserName] = useState(null) // stores user name
    const [openBottomSheet, setOpenBottomSheet] = useState(false) // controls bottomsheet visibility (true= visible, false = hidden)
    const {w, h} = useWindowDimensions() // screen width and height gotten on component mount
    const viewShotRef = useRef() // reference for the ViewShot component
    
    // Converts view captured to pdf
    const captureAndConvertToPDF = () => {
      // Capture the current view using the reference to the ViewShot component
        viewShotRef.current.capture().then(uri => {
          // If capture is successful, pass the image URI to the PDF conversion function
          convertImageToPDF(uri);
        }).catch(err => console.log(err));
      };

      const convertImageToPDF = async (imageUri) => {
        try {
          // Fetch the image data from the URI
          const imageData = await RNFS.readFile(imageUri, 'base64');
    
          // Create an HTML string with the image
          const htmlContent = `
            <html>
              <head>
                <style>
                  body {
                    margin: 0;
                    padding: 0;
                  }
                  img {
                    width: ${100}%; /* Scale to fit width */
                    height: ${100}%; /* Scale to fit height */
                    display: block;
                  }
                </style>
              </head>
              <body>
                <img src="data:image/png;base64,${imageData}" />
              </body>
            </html>
          `;
    
          // Generate PDF from HTML content
          const options = {
            html: htmlContent,
            fileName: payment.type !== 'CARD'? 'Leot Apartment Receipt' : 'Leot Card Authorization Receipt',
            directory: 'Documents',
            height: h,
            width: w
          };
    
          const file = await RNHTMLtoPDF.convert(options);
    
          console.log('PDF created at:', file.filePath);
          Share.open({ url: `file://${file.filePath}` });
        } catch (error) {
          console.log('Error creating PDF:', error);
        }
      };
    
    
    const captureAndShare = () => {
      viewShotRef.current.capture().then(uri => {
        const shareOptions = {
          title: payment.type !== 'CARD'? 'Leot Apartment Receipt' : 'Leot Card Authorization Receipt',
          url: uri,
          type: 'image/png',
        };
        Share.open(shareOptions).catch(err => console.log(err));
      });
    };

    
    const getUserName = async ()=>{
        const userNam = await DataStore.query( User, (u)=> u.id.eq(payment.userID))
        console.log('userName : ', userNam[0].name)
          setUserName(userNam[0].name)
     }
  
     useEffect(()=>{
      getUserName()
     }, [payment])
  
    const formatPriceToString = (val) => {
        // Convert val to a number if it's not already
        const numberVal = Number(val);
    
        // Check if numberVal is a valid number
        if (isNaN(numberVal)) {
            return val; // Return the original value if it's not a number
        }
    
        // Format numberVal with commas for every 3 digits
        const formattedVal = numberVal.toLocaleString('en-US');
    
        return formattedVal;
    }

    // Function to handle the navigation logic after a payment receipt is generated.
    const receiptNavigation = ()=>{
       // Check if the payment type is 'CARD'
        if(payment.type == 'CARD'){
            if(cardInfoTrue){
                navigation.goBack()
            }
            else{
                setShowReceipt(false)
                setInfo(null)
            }
        }
        else{
            if(wishlistIcon){
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Home' }]
                })
            }else{
              navigation.navigate('Home')
            }
                
           
        }
    }

    if(!userName){
        return(
            <Modal visible={true} onRequestClose={()=>{}} presentationStyle='overFullScreen'>
              <StatusBar style="light" backgroundColor="rgba(0,0,0,0.5)"/>
              <View style={styles.loadingCont}>
                <View style={styles.alignCont}>
                  <View style={styles.loadingImgCont}>
                      <Image source={require('../../../assets/loadingGif.gif')} style={styles.loadingImage}/>
                  </View>
                   <Text style={styles.loadingText}>Generating receipt...</Text>
                </View>
           </View>
            </Modal>
        )
}

    return(
      <Modal visible={showReceipt} onRequestClose={()=>{receiptNavigation()}} presentationStyle='overFullScreen'>
         <GestureHandlerRootView style={{flex: 1}}>
      <StatusBar style="dark" backgroundColor="#F5F5F5"/>
        <ViewShot style={styles.viewShotContainer}  ref={viewShotRef} options={{ format: 'png', quality: 0.9 }}>
           <View style={styles.chargedPriceContainer}>
            <Text style={styles.transferText}>Transfer to StayLit</Text>
                <View style={{...styles.alignContainer, marginVertical: 15}}>
                    <FontAwesome6 name="naira-sign" size={30} color="black" />
                    <Text style={styles.priceText}>{formatPriceToString(payment.price)}</Text>
                </View>
                <View style={styles.alignContainer}>
                    <Ionicons name="checkmark-circle" size={24} color="#FF0000" style={{marginRight: 5}}/>
                    <Text style={styles.successText}>Successful</Text>
                </View>
           </View>
            <View style={styles.transactionDetailsCont}>
                <Text style={styles.detailsLabel}>Transaction Details</Text>
                <View style={styles.senderName}>
                    <Text style={styles.receiptTabLabel}>Sender Name</Text>
                            <View style={{width: '60%'}}>
                                <Text style={{...styles.receiptTabText, textAlign:'right'}}>{userName}</Text>
                                <Text  style={styles.receiptTabText}>StayLit | USER</Text>
                             </View>
                 </View>
                <View style={{...styles.alignContainer, justifyContent:'space-between'}}>
                    <Text style={styles.receiptTabLabel}>Recipent Name</Text>
                    {payment.type == 'CARD'? <View>
                                                    <Text style={styles.receiptTabText}>StayLit</Text>
                                             </View> : 
                            <View style={{width: '60%'}}> 
                                <Text style={{...styles.receiptTabText, textAlign:'right'}}>{hostData.name}</Text>
                                <Text style={styles.receiptTabText}>StayLit | Agent</Text>
                             </View>
                    }
                 </View>
                 {payment.type !== 'CARD' && <View style={styles.labelCont}>
                        <Text style={styles.receiptTabLabel}>Apartment Type</Text>
                        <Text style={{...styles.receiptTabText, width: '60%', textAlign:'right'}}>{apartment.apartmentTitle}</Text>
                 </View>}
                 {payment.type !== 'CARD' && <View style={styles.labelCont}>
                        <Text style={styles.receiptTabLabel}>Apartment Address</Text>
                        <Text style={{...styles.receiptTabText, width: '60%', textAlign:'right'}}>{apartment.addressText}</Text>
                 </View>}
                 <View style={styles.labelCont}>
                        <Text style={styles.receiptTabLabel}>Transaction Type</Text>
                        <Text style={styles.receiptTabText}>{payment.type == 'CARD'? 'Card authorization charge' : 'Apartment Rent Fee'}</Text>
                 </View>
                 <View style={{...styles.alignContainer, justifyContent:'space-between'}}>
                        <Text style={styles.receiptTabLabel}>Transaction Reference</Text>
                        <Text style={styles.receiptTabText}>{payment.reference}</Text>
                 </View>
                 <View style={styles.labelCont}>
                        <Text style={styles.receiptTabLabel}>Payment Method</Text>
                        <Text style={styles.receiptTabText}>CARD</Text>
                 </View>
                 <View style={{...styles.alignContainer, justifyContent:'space-between'}}>
                        <Text style={styles.receiptTabLabel}>Transaction Date</Text>
                        <Text style={styles.receiptTabText}>{payment.date}</Text>
                 </View>
            </View>
            </ViewShot>
     
            <View style={{alignItems:'center', backgroundColor:'#F5F5F5'}}>
                <Pressable onPress={()=>{setOpenBottomSheet(true)}} style={styles.shareReceiptBtn}>
                        <Text style={styles.shareReceiptText}>Share Receipt</Text>
                </Pressable>
            </View>
       
        {openBottomSheet && <Pressable onPress={()=>{setOpenBottomSheet(false)}} style={{...StyleSheet.absoluteFillObject, backgroundColor:'rgba(0,0,0,0.5)'}}></Pressable>}
        {openBottomSheet && <BottomSheet index={0} enablePanDownToClose={true} onClose={()=>{setOpenBottomSheet(false)}} snapPoints={['20%']} handleIndicatorStyle={{ display: 'none'}}>
        <StatusBar style="light" backgroundColor="rgba(0,0,0,0.5)"/>
            <View style={{flex: 1}}>
                    <View style={{...styles.alignContainer, paddingHorizontal: 20}}>
                        <AntDesign name="close" size={20} color="black" onPress={()=>{setOpenBottomSheet(false)}} style={{marginRight: 20}}/>
                        <Text style={styles.shareReceipt}>Share receipt as</Text>
                    </View>
                    <View style={styles.shareOptionsContainer}>
                        <Pressable onPress={()=>{captureAndConvertToPDF()}}>
                            <AntDesign name="pdffile1" size={40} color="#FF0000" style={{marginBottom: 10}} />
                            <Text style={styles.shareOptionText}>Pdf</Text>
                        </Pressable>
                        <Pressable onPress={()=>{captureAndShare()}}>
                            <Feather name="image" size={40} color="#FF0000" style={{marginBottom: 10}}/>
                            <Text style={styles.shareOptionText}>Image</Text>
                        </Pressable>
                    </View>
            </View>
            
            </BottomSheet>}
         </GestureHandlerRootView>
    </Modal>
)
}

export default Receipt

const styles = StyleSheet.create({
loadingCont: {
  flex: 1, 
  backgroundColor:'rgba(0,0,0,0.5)', 
  justifyContent:'center', 
  alignItems:'center'
},
alignCont: {
justifyContent:'center',
alignItems:'center'
},
loadingImage: {
width: 90, 
height: 90
},
receiptTabLabel: {
fontSize: 12, 
color:'#4C4C4C'
},
loadingText: {
textAlign:'center', 
fontSize: 16, 
fontWeight: '600', 
color:'white'
},
loadingImgCont: {
width: 110, 
height: 110, 
borderRadius: 20, 
backgroundColor:'white', 
justifyContent:'center', 
alignItems:'center', 
marginBottom: 10
},
container: {
flex: 1, 
backgroundColor:'#F5F5F5'
},
alignContainer: {
flexDirection:'row', 
alignItems:'center'
},
transactionText: {
fontSize: 20, 
fontWeight:'600'
},
viewShotContainer: {
flex: 1, 
padding: 20, 
justifyContent:'center', 
alignItems:'center',
backgroundColor:'#F5F5F5'
},
receiptTabText: {
textAlign:"right", 
fontSize: 13
},
chargedPriceContainer: {
backgroundColor:"white", 
padding: 30, 
width: '100%', 
justifyContent:'center', 
alignItems:'center', 
borderRadius: 5,
marginTop: 40
},
transferText: {
fontSize: 16, 
fontWeight: '500'
},
priceText: {
fontSize: 35, 
fontWeight:'600'
},
successText: {
color:'#FF0000', 
fontWeight:'500', 
fontSize: 14
},
transactionDetailsCont: {
backgroundColor:"white", 
padding: 30, 
width: '100%', 
justifyContent:'center', 
borderRadius: 5, 
marginVertical: 20
},
detailsLabel: {
fontWeight:'500', 
fontSize: 16, 
marginBottom: 10
},
senderName: {
flexDirection:'row', 
alignItems:'center', 
justifyContent:'space-between', 
marginVertical: 10
},
labelCont: {
flexDirection:'row', 
alignItems:'center', 
justifyContent:'space-between', 
marginVertical: 10
},
apartmentDataText: {
width: '60%',
textAlign:"right"
},
shareReceiptBtn: {
backgroundColor:'#8B0000', 
width: '70%', 
padding: 15, 
borderRadius: 10, 
marginVertical: 30
},
shareReceiptText: {
fontSize: 18, 
color:'white', 
fontWeight:'500', 
textAlign:'center'
},
shareReceipt: {
fontSize: 18, 
fontWeight: '600', 
color:'black'
},
shareOptionsContainer: {
flex: 1, 
flexDirection:'row', 
alignItems:'center', 
justifyContent: 'space-around'
},
shareOptionText: {
textAlign:"center", 
color:"black", 
fontWeight: '500', 
fontSize: 14
}
})