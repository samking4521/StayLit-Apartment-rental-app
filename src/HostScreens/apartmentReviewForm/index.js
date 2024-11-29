import { useState, useEffect } from 'react'
import {StyleSheet, View, Text, ScrollView, useWindowDimensions, Pressable, ActivityIndicator, Image, Modal } from 'react-native'
import { FontAwesome6, Ionicons, Entypo, FontAwesome, Fontisto, MaterialCommunityIcons, MaterialIcons, AntDesign} from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import Carousel from 'react-native-reanimated-carousel';
import { DataStore } from 'aws-amplify/datastore';
import { Apartment, RentStatus } from '../../models';
import { uploadData, remove } from 'aws-amplify/storage'
import { StatusBar } from 'expo-status-bar';
import FastImage from 'react-native-fast-image';
import { Buffer } from 'buffer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
const URL = 'https://dr4jupy057c0c.cloudfront.net/'
const bucket = 'staylit-storage-1914deba97d11-staging'

const ApartmentReviewForm = ()=>{
    const dbHost = useSelector( state => state.host.dbHost)
    const route = useRoute()
    const { apartmentShareStatusStorage, placeTypeStorage, bedroomNoStorage, bathroomNoStorage, electricityStorage, waterStorage, securityStorage , wardrobeStorage , popStorage, apartmentImagesStorage, addressLatitudeStorage, addressLongitude, addressTextStorage, fullAddressStorage, cityAddressStorage, CountryStorage, StateStorage, title, desc, price, formattedPrice, duration, apartment, mode, newlyAddedImages, removedImages, parkingSpace, moveInPriceVal, moveInPriceValInt } = route.params
    const [index, setIndex] = useState(1);
    const [imageData, setImageData] = useState(null)
    const [errorUploadAlert, setErrorUploadAlert] = useState(false)
    const [uploadingIndicator, setUploadingIndicator] = useState(false)
    const { width, height } = useWindowDimensions()
    const navigation = useNavigation()

    function formatAddressString(input) {
        // Remove any leading or trailing spaces
        let formattedString = input.trim();
        
        // Add space after commas if not already present
        formattedString = formattedString.replace(/,(\S)/g, ', $1');
        
        // Capitalize the first letter of each word
        formattedString = formattedString.replace(/\b\w/g, (char) => char.toUpperCase());
      
        return formattedString
      }

    function formatString(input) {
        // Remove any leading or trailing spaces
        let formattedString = input.trim();
        
        // Replace hyphens with spaces
        formattedString = formattedString.replace(/-/g, ' ');
      
        // Remove any symbols (non-alphabetic characters except spaces)
        formattedString = formattedString.replace(/[^a-zA-Z\s]/g, '');
        
        // Capitalize each word
        formattedString = formattedString.replace(/\b\w/g, (char) => char.toUpperCase());
        
            return formattedString
      }

    const getHostStoragePicture = async ()=>{
        try{
            const hostStoragePicKey = dbHost.key
            getProfilePictureUrl(hostStoragePicKey)
        }catch(e){
            console.log('Error Host Pic Object : ', e.message)
        }
      }
    
     
        useEffect(() => {
          if(!dbHost){
            return 
         }
         getHostStoragePicture()  
        }, [dbHost])
     
    
    
    const getProfilePictureUrl = (imageUrl)=>{
        try{
            const imageRequest = JSON.stringify(
                {
                  "bucket": bucket,
                  "key": `public/${imageUrl}`,
                  "edits": {
                    "resize": {
                      "width": 60,
                      "height": 60,
                      "fit": "cover"
                    }
                  }
                }
              )
              const encoded = Buffer.from(imageRequest).toString('base64')
              setImageData(`${URL}${encoded}`)
        }catch(e){
            console.log(e.message)
        }
    }
   
    const formatDate = ()=>{
        const dates = new Date()
        const apartmentCreationDate = dates.toLocaleString('en-US', {
            hour12: true})
        return apartmentCreationDate
    }

   
    const delImages = async (img)=>{
        await remove({ 
            path: `public/${img}`
          });
        console.log('Image deleted successfully')
    }
    
    const removeApartmentImages = async (images)=>{
       
            try {
                images.forEach((img)=>{
                    delImages(img)
                })
              } catch (error) {
                console.log('Error ', error);
              }
        }

    const handleIndex = (snapIndex)=>{
        setIndex(snapIndex)
        }

        const removeAndUploadApartmentCoverPhoto = async ()=>{
            await remove({ 
                path: `public/apartmentCoverPhoto/${apartment.id}/coverPhoto.jpeg`
              });
            console.log('Cover image deleted successfully')
            uploadApartmentCoverPhoto(apartment.id)
        }

        const uploadApartmentCoverPhoto = async (id)=>{
            const coverImg = await fetch(apartmentImagesStorage[0].path)
            const theBlob = await coverImg.blob()

            const result = await uploadData({
            key: `apartmentCoverPhoto/${id}/coverPhoto.jpeg`,
            data: theBlob,
            options: {
                accessLevel: 'guest', // defaults to `guest` but can be 'private' | 'protected' | 'guest'
                contentType: theBlob._data.type
            }
            }).result;
            console.log('Cover Photo Upload Succeeded: ', result);
        }

        const uploadApartmentPhotos = async ()=>{
            
             try {
                if(mode){
                    
                   if(newlyAddedImages){
                    for (img of newlyAddedImages){
                        const getRealImg = await fetch(img.path)
                        const theBlob = await getRealImg.blob()
                        const result = await uploadData({
                        key: `apartmentPhotos/${dbHost.id}/${apartment.id}/${theBlob._data.name}`,
                        data: theBlob,
                        options: {
                            accessLevel: 'guest', // defaults to `guest` but can be 'private' | 'protected' | 'guest'
                            contentType: theBlob._data.type
                        }
                        }).result;
                        console.log('Succeeded: ', result);
                    }
                   
                   console.log('Images Uploaded Sucessfully to s3 bucket')

                   }  

                  if(removedImages){
                    await removeAndUploadApartmentCoverPhoto()
                    await removeApartmentImages(removedImages)
                  }
                 
                }else{
                    const apartment = await DataStore.query(Apartment, (apt)=> apt.hostID.eq(dbHost.id))
                    console.log('Apartment queried successfully : ', apartment)
                    const apartmentObj = apartment[apartment.length - 1]
                    const apartmentID = apartmentObj.id
                    const apartmentHostID = apartmentObj.hostID
                    console.log('apartmentID : ', apartmentID)
                    console.log('apartmentHostID : ', apartmentHostID)
                    await uploadApartmentCoverPhoto(apartmentID)
                    for (img of apartmentImagesStorage){
                        const getRealImg = await fetch(img.path)
                        const theBlob = await getRealImg.blob()
                        const result = await uploadData({
                        key: `apartmentPhotos/${apartmentHostID}/${apartmentID}/${theBlob._data.name}`,
                        data: theBlob,
                        options: {
                            accessLevel: 'guest', // defaults to `guest` but can be 'private' | 'protected' | 'guest'
                            contentType: theBlob._data.type
                        }
                        }).result;
                        console.log('Succeeded: ', result);
                    }
                   
                     console.log('Images Uploaded Sucessfully to s3 bucket')
                      const apartmentInDB = await DataStore.query(Apartment, (apt)=> apt.id.eq(apartmentObj.id))
                      console.log('ApartmentInDB received successfully : ', apartmentInDB)
    
                     const updateApartmentData = await DataStore.save(Apartment.copyOf(apartmentInDB[0], (updated)=>{
                        updated.key = `apartmentPhotos/${apartmentInDB[0].hostID}/${apartmentInDB[0].id}/`,
                        updated.coverPhotoKey = `apartmentCoverPhoto/${apartmentInDB[0].id}/coverPhoto.jpeg`
                     }))

                
                     console.log('updateApartmentData Success : ', updateApartmentData)
                     setUploadingIndicator(false)
                     navigation.navigate('Home')
                }
                }catch(e){
                    console.log('Error UploadApartmentPhotos : ', e.message)
                    setUploadingIndicator(false)
                    setErrorUploadAlert(true)

                }
        }

        const UploadFormData = async ()=>{
            try{
              if(mode){
                await uploadApartmentPhotos()
                const aptData = await DataStore.query(Apartment, (a)=> a.id.eq(apartment.id))
                console.log('aptData : ', aptData)
                const ApartmentData = await DataStore.save(
                       Apartment.copyOf(aptData[0], (updated)=>{
                        updated.shareStatus = apartmentShareStatusStorage,
                        updated.placeType = placeTypeStorage,
                        updated.bedroom = bedroomNoStorage,
                        updated.bathroom = bathroomNoStorage,
                        updated.electricity = electricityStorage,
                        updated.water = waterStorage,
                        updated.security = securityStorage,
                        updated.pop = popStorage,
                        updated.wardrobe = wardrobeStorage,
                        updated.lat = addressLatitudeStorage,
                        updated.lng  = addressLongitude,
                        updated.address = formatAddressString(addressTextStorage),
                        updated.city = formatString(cityAddressStorage),
                        updated.state = StateStorage,
                        updated.country = CountryStorage,
                        updated.apartmentTitle = title.trim(),
                        updated.apartmentDesc = desc.trim(),
                        updated.addressText = formatAddressString(addressTextStorage),
                        updated.price = price,
                        updated.formattedPrice = formattedPrice,
                        updated.leaseDuration = duration,
                        updated.date = formatDate(),
                        updated.parkingSpace = parkingSpace,
                        updated.moveInCost = moveInPriceVal,
                        updated.moveInCostInt = moveInPriceValInt,
                        updated.status = RentStatus.AVAILABLE,
                        updated.hostID = dbHost.id,
                        updated.key = `apartmentPhotos/${aptData[0].hostID}/${aptData[0].id}/`,
                        updated.coverPhotoKey = `apartmentCoverPhoto/${aptData[0].id}/coverPhoto.jpeg`
               }))
               console.log('Updated Apartment Data : ', ApartmentData)
               setUploadingIndicator(false)
               navigation.navigate('Listings')
              }
              else{
                const ApartmentData = await DataStore.save(new Apartment({
                    shareStatus : apartmentShareStatusStorage,
                    placeType: placeTypeStorage,
                    bedroom : bedroomNoStorage,
                    bathroom : bathroomNoStorage,
                    electricity : electricityStorage,
                    water : waterStorage,
                    security: securityStorage,
                    pop: popStorage,
                    wardrobe : wardrobeStorage,
                    lat: addressLatitudeStorage,
                    lng : addressLongitude,
                    address: formatAddressString(addressTextStorage),
                    city: formatString(cityAddressStorage),
                    state: StateStorage,
                    country: CountryStorage,
                    apartmentTitle: title.trim(),
                    apartmentDesc: desc.trim(),
                    addressText: formatAddressString(addressTextStorage),
                    price: price,
                    formattedPrice: formattedPrice,
                    moveInCost: moveInPriceVal,
                    moveInCostInt: moveInPriceValInt,
                    parkingSpace: parkingSpace,
                    leaseDuration: duration,
                    date: formatDate(),
                    status: RentStatus.AVAILABLE,
                    hostID: dbHost.id
               }))
               console.log('Apartment Saved Successfully : ', ApartmentData)
               uploadApartmentPhotos()
              }
           
        }catch(e){
            console.log('ApartmentData Upload Error : ', e.message)
            setUploadingIndicator(false)
            setErrorUploadAlert(true)
        }
    }
  
    return(
        <GestureHandlerRootView>
        <View style={styles.container}>
           <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.contentContainer}>
               <View style={{padding: 20}}>
                    <Text style={styles.headerText}>Review Your listing</Text>
                    <Text style={styles.headerDescText}>Here's what we'll show to renters. Make sure everything looks good.</Text>
               </View>
             <View style={{...styles.boxShadow, alignSelf:'center', width: 90/100 * width}}>
              <Carousel
                      loop
                      width={90/100 * width}
                      height={30/100 * height}
                      autoPlay={false}
                      panGestureHandlerProps={{
                          activeOffsetX: [-10, 10],
                      }}
                      data={apartmentImagesStorage}
                      scrollAnimationDuration={250}
                      onSnapToItem={(index)=>handleIndex(index + 1)}
                      renderItem={({ item, index } ) => (
                          <View style={styles.imageCont}>
                                <Image style={{ ...styles.image, height: 30/100 * height}} source={{uri : item.path}} key={index}/> 
                           </View>  
                      )}
                  />
                   <View style={{...styles.aptImageCont, top: 25/100 * height}}>
                        <Text style={styles.aptLengthText}>{index+" / "+apartmentImagesStorage?.length}</Text>
                   </View>
     
      <View style={styles.apartmentDetailsCont}> 
        <View style={styles.aptInfoACont}>
            <Text style={styles.titleText}>{title}</Text>
            <View style={styles.alignContainer}>
                <FontAwesome name="star" size={15} color="black" style={{marginRight: 5}}/>
                 <Text style={{fontSize:14}}>New</Text>
            </View>
        </View>
        <Text style={styles.locationText}>{cityAddressStorage} &#8226; {StateStorage} &#8226; {CountryStorage} </Text>
        <View style={{marginTop: 4, ...styles.alignContainer}}>
            <FontAwesome6 name="naira-sign" size={10} color="black" />
            <Text style={styles.priceText}>{formattedPrice} &#8226; </Text>
            <Text style={styles.durationText}>{duration}</Text>
        </View>
      </View>
  </View>
     <View>
   
     <View style={{paddingHorizontal: 20}}>
     <View style={styles.rentalInfoCont}>
                      <Text style={styles.rentalInfoText}>Entire rental unit hosted by {'\n'}{dbHost.name}</Text>
                      {imageData? <FastImage source={{uri : imageData, priority: FastImage.priority.high }}  style={styles.hostImg} resizeMode={FastImage.resizeMode.cover}/> : <View style={styles.placeHolderImgCont}>
                                                                                                                                                                                        <Text  style={styles.placeHolderText}>{dbHost.name[0]}</Text> 
                                                                                                                                                                                 </View>
                      }
           </View>

           <View style={styles.infoCont}>
                      <Text style={{fontSize: 15}}>{bedroomNoStorage} bedroom &#8226; {bathroomNoStorage} bathroom &#8226; {apartmentShareStatusStorage} apartment</Text>
           </View>
           <View style={styles.infoCont}>
                      <Text style={{fontSize: 15}}>{desc}</Text>
           </View>
        <View>
            <Text style={styles.amenitiesText}>Amenities</Text>
        </View>
          { electricityStorage && <View style={styles.amenitiesCont}>
                            <Text style={{fontSize: 15}}>Electricity</Text>
                              <Fontisto name="lightbulb" size={25} color="black" style={{ width: 30, height: 30}}/>
                             
              </View>}
             { waterStorage && <View style={styles.amenitiesCont}>              
                         <Text style={{fontSize: 15}}>Running Water</Text>
                              <Ionicons name="water-outline" size={25} color="black" style={{ width: 30, height: 30}}/>  
                             
              </View>}
             {  securityStorage && <View style={styles.amenitiesCont}>
                         
                          <Text style={{fontSize: 15}}>Security</Text>
                          <MaterialCommunityIcons name="door-sliding-lock" size={25} color="black" style={{ width: 30, height: 30}}/>
                  </View>}
                {  wardrobeStorage && <View style={styles.amenitiesCont}>   
                              <Text style={{fontSize: 15}}>Wardrobe</Text>
                              <MaterialCommunityIcons name="wardrobe-outline" size={25} color="black"  style={{ width: 30, height: 30}}/>
              </View>
              }
            { popStorage &&  <View style={styles.amenitiesCont}>
                                  <Text style={{fontSize: 15}}>POP</Text>
                                  <Entypo name="popup" size={25} color="black" style={{ marginRight: 10}}/>    
                </View>}
                { parkingSpace &&  <View style={styles.amenitiesCont}>
                                  <Text style={{fontSize: 15}}>Parking Space</Text>
                                  <AntDesign name="car" size={25} color='black' style={{marginBottom: 10}} />
                                  </View>}
                <View style={{ paddingVertical: 20}}>
                        <Text style={styles.locationHeaderText}>Location</Text>
                      <Text style={{fontSize: 15}}>{fullAddressStorage}</Text>
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
                    
                    <View style={styles.loadBarCa}></View>
                    <View style={styles.loadBarCb}></View>
                    <View style={styles.loadBarCc}></View>
            </View>
            <View style={styles.footerContainer}>
                <Text style={styles.backText} onPress={()=>{navigation.goBack()}}>Back</Text>
                <Pressable onPress={()=>{setUploadingIndicator(true); UploadFormData()}} style={styles.nextBtn}>
                    <Text style={styles.uploadText}>{mode? 'Update Apartment Data' : 'Upload'}</Text>
                </Pressable>
            </View>
            <Modal visible={uploadingIndicator} onRequestClose={()=>{}} presentationStyle='overFullScreen' transparent={true}>
            <StatusBar style="light" backgroundColor="rgba(0,0,0,0.5)" />
                    <View style={{ flex: 1, backgroundColor:'rgba(0,0,0,0.5)', justifyContent:"center", alignItems:"center"}}>
                            <View style={styles.profileCont}>
                                <ActivityIndicator color='red' size='large' style={{marginBottom: 10}}/>
                                <Text style={styles.updatingText}>{mode? 'Updating...' : 'Uploading...'}</Text>
                                <Text style={{textAlign:'center', marginTop: 5}}>Please wait, this might take a minute.</Text>
                            </View>
                     </View>
            </Modal>

            <Modal visible={errorUploadAlert} onRequestClose={()=>{setErrorUploadAlert(false)}} presentationStyle='overFullScreen' transparent={true}>
                              <StatusBar style="light" backgroundColor="rgba(0,0,0,0.5)" />
                              <View style={{ flex: 1, ...styles.userProfileAlertContainer}}>
                                      <View style={styles.userProfileSuccessAlert}>
                                              <MaterialIcons name="error" size={40} color="red" style={{marginBottom: 10}}/>
                                              <Text style={{color:"red", ...styles.errorAlertLabel}}>Error Uploading Apartment</Text>
                                              <Text style={styles.errorAlertDescText}>An unknown error occured! Please check your internet connection and try again</Text>
                                              <Pressable onPress={()=>{setErrorUploadAlert(false)}} style={{backgroundColor: 'black', ...styles.closeProfileAlert}}>
                                                  <Text style={styles.closeAlertText}>OK</Text>
                                              </Pressable>
                                          </View>
                              </View>
                        </Modal>
            
        </View>
        </GestureHandlerRootView>
        
    )
}

export default ApartmentReviewForm

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor:'white'
    },
    contentContainer: {
        flex: 1
    },
    headerText: {
        fontSize: 25, 
        fontWeight: '600', 
        marginBottom: 2
    },
    headerDescText: {
        fontWeight: '400', 
        color: '#4C4C4C',
        fontSize: 14
    },
    boxShadow : {
        elevation: 2,
        shadowColor: 'black',
        borderRadius: 10,
        backgroundColor: 'white',
        marginBottom: 10     
    },
    imageCont: {
        marginHorizontal: 10, 
        marginTop: 10
    },
    image : {
        width: '100%',
        resizeMode:'cover', 
        borderRadius: 10
    },
    apartmentDetailsCont: {
        paddingHorizontal: 10, 
        paddingBottom: 10
    },
    aptInfoACont: {
        flexDirection: 'row', 
        alignItems:'center', 
        marginTop: 5
    },
    titleText: {
        fontSize:19, 
        fontWeight:'400', 
        marginRight: 'auto', 
        paddingRight: 30
    },
    alignContainer: {
        flexDirection: 'row', 
        alignItems:'center'
    },
    locationText: {
        fontSize: 14, 
        color: '#4C4C4C', 
        marginTop: 2
    },
    priceText: {
        color:"black", 
        fontWeight: '600', 
        fontSize: 12
    },
    durationText: {
        fontSize: 12, 
        color:'#4C4C4C'
    },
    rentalInfoCont: {
        borderBottomColor:'lightgray', 
        borderBottomWidth: 2, 
        paddingVertical: 10, 
        marginTop: 10, 
        flexDirection:'row', 
        alignItems:'center', 
        justifyContent:'space-between'
    },
    rentalInfoText: {
        fontSize: 16, 
        fontWeight:'500'
    },
    hostImg: {
        width: 60, 
        height: 60, 
        borderRadius: 60
    },
    placeHolderImgCont: {
        width: 60, 
        height: 60, 
        borderRadius: 60, 
        backgroundColor:'white', 
        justifyContent:'center', 
        alignItems:'center',
        elevation: 5
    },
    placeHolderText: {
        fontSize: 16, 
        fontWeight:'600', 
        color:'#F52F57'
    },
    infoCont: {
        borderBottomColor:'lightgray', 
        borderBottomWidth: 2, 
        paddingVertical: 20
    },
    amenitiesText: {
        fontWeight: '500', 
        fontSize: 16, 
        paddingVertical: 10
    },
    aptImageCont: {
        position: 'absolute',  
        left: '80%', 
        backgroundColor:'rgba(0,0,0,0.5)', 
        paddingVertical: 2, 
        paddingHorizontal: 10, 
        borderRadius: 5
       },
       aptLengthText: {
        textAlign: 'center', 
        color:'white', 
        fontWeight: '600', 
        letterSpacing: 1, 
        fontSize: 15
       },
      amenitiesCont: {
        flexDirection:'row', 
        justifyContent:'space-between', 
        alignItems:'center', 
        borderBottomColor:'lightgray', 
        borderBottomWidth: 2, 
        paddingVertical: 10
    },
    locationHeaderText: {
        fontWeight: '600', 
        fontSize: 16, 
        marginBottom: 18
    },
    footerCont:{
        width: '100%', 
        flexDirection: 'row', 
        alignItems: 'center'
     }, 
     loadBarAa: {
        backgroundColor: 'black', 
        padding: 3, 
        width: '11%'
     },
     loadBarAb: {
        backgroundColor: 'black',
        padding: 3, 
        width: '11%'
     },
     loadBarAc: {
        backgroundColor: 'black', 
        padding: 3, 
        width: '11%', 
        marginRight: '1%'
     },
     loadBarBa: {
        backgroundColor: 'black', 
        padding: 3, 
        width: '16%'
     },
     loadBarBb: {
        backgroundColor: 'black', 
        padding: 3, 
        width: '16%', 
        marginRight: '1%'
     },
     loadBarCa: {
        backgroundColor: 'black', 
        padding: 3, 
        width: '11%'
     },
     loadBarCb: {
      backgroundColor: 'black', 
      padding: 3, 
      width: '11%'
    },
    loadBarCc: {
      backgroundColor: 'black', 
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
        backgroundColor:'black', 
        borderRadius: 10
    },
    uploadText: {
        fontWeight: '600', 
        color:'white', 
        fontSize: 16, 
        letterSpacing: 0.5
    },
    profileCont: {
        justifyContent:'center', 
        alignItems:'center',
        backgroundColor: 'white',
        padding: 50, 
        borderRadius: 20,
        width: '70%'
    },
    updatingText: {
        fontWeight:'600', 
        fontSize: 14, 
        color:'black'
    },
    userProfileAlertContainer: {
        backgroundColor:'rgba(0,0,0,0.5)', 
        justifyContent:'center',
        alignItems:'center'
      },
      errorAlertLabel: {
        fontWeight: '600', 
        fontSize: 16, 
        marginBottom: 15,
        textAlign:'center'
      },
      errorAlertDescText: {
        color:"#4C4C4C", 
        fontWeight: '500', 
        textAlign:'center', 
        marginBottom: 30, 
        fontSize: 14
      },
      userProfileSuccessAlert: {
        padding: 20, 
        backgroundColor:'white', 
        borderRadius: 20, 
        elevation: 5, 
        alignItems: 'center',
        marginHorizontal: 20,
        width:'70%'
      },
      closeProfileAlert: {
        paddingVertical: 5, 
        paddingHorizontal: 15,
        borderRadius: 5
      },
      closeAlertText: {
        color:'white', 
        fontWeight: '600', 
        fontSize: 16
      }
})
