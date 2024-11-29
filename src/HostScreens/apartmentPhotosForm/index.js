import { useState, useEffect } from 'react'
import {View, Text, Pressable, ScrollView, StyleSheet, Modal, Image, useWindowDimensions, TouchableOpacity, ActivityIndicator} from 'react-native'
import { MaterialIcons, AntDesign, Entypo } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import ImagePicker from 'react-native-image-crop-picker'
import Carousel from 'react-native-reanimated-carousel';
import { list } from 'aws-amplify/storage';
import { StatusBar } from 'expo-status-bar'
import { Buffer } from 'buffer';
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const URL = 'https://dr4jupy057c0c.cloudfront.net/'
const bucket = 'staylit-storage-1914deba97d11-staging'

const ApartmentPhotosForm = ()=>{
    const route = useRoute()
    const { apartmentShareStatusStorage, placeTypeStorage, bedroomNoStorage, bathroomNoStorage, electricityStorage, waterStorage, securityStorage , wardrobeStorage , popStorage, apartment, mode, parkingSpace} = route.params
    const [selectedImages, setSelectedImages] = useState([])
    const [createApartmentModal, setCreateApartmentModal] = useState(false)
    const [mediaMode, setMediaMode] = useState(apartment? 'gallery' : null)
    const [index, setIndex] = useState(1);
    const navigation = useNavigation()
    const { width, height} = useWindowDimensions()
    const [apartmentImages, setApartmentImages] = useState(false)
    const [disableNextBtn, setDisableNextBtn] = useState(true)
    const [newlyAddedImages, setNewlyAddedImages] = useState(null)
    const [removedImages, setRemovedImages] = useState(null)
    const [errorUploadAlert, setErrorUploadAlert] = useState(false) // controls visibility of the profile upload error alert (create = 'Error Creating Profile', update='Error Updating profile' null = hidden) 
    console.log('newlyAddedImages : ', newlyAddedImages?.length)
    console.log('removedImages : ', removedImages?.length)

    const getApartmentImages = async(imageKey)=>{
      try {
        const result = await list({
          prefix: imageKey,
          options:  {
            accessLevel: 'guest'
          }
        });
        console.log('Retrieved Image Result Success : ', result)
        const imageResultArr = result.items
        console.log('imageResultArr : ', imageResultArr)
        getImagesPath(imageResultArr)
      } catch (error) {
        console.log('Error Retrieving Images List : ', error.message);
        setErrorUploadAlert(true)
      }
  }

  const getImagesPath = (imagesArr)=>{
     const imagesUriArr = imagesArr.map((imgObj)=>{
           return(
              imgObj.key
           )
      })
    console.log('imagesUriArr Retrieved Successfully : ', imagesUriArr)
    getImagesUrl(imagesUriArr)
  }
  
  const getImagesUrl =  async (imageKeysArr)=>{
    try{
      let aptImages = []
       for(imgKey of imageKeysArr){
        const imageRequest = JSON.stringify(
          {
            "bucket": bucket,
            "key": `public/${imgKey}`,
            "edits": {
              "resize": {
                "width": width,
                "height": (35/100 * height),
                "fit": "cover"
              }
            }
          }
        )
        const encoded = Buffer.from(imageRequest).toString('base64')
        aptImages.push({path : `${URL}${encoded}`, key: imgKey})
       }
       console.log('Apartment Images Array Success')
         console.log('aptImages success')
         setApartmentImages(aptImages)
         setSelectedImages(aptImages)
    }catch(e){
      console.log('Error Retrieving Images Url : ', e.message)
    }
  }

 useEffect(()=>{
      if(!apartment){
          return
      }
      getApartmentImages(apartment.key)
      
 }, [apartment])

     useEffect(()=>{
          if(apartmentImages.length>=5){
            setDisableNextBtn(false)
          }
          else{
            setDisableNextBtn(true)
          }
     }, [apartmentImages])
    
    const handleIndex = (snapIndex)=>{
        setIndex(snapIndex)
}

    const onGallery = (mode, addMore) => {
          if (mode == 'gallery'){
            ImagePicker.openPicker({
              multiple: true,
              mediaType: 'photo'
            }).then(image => {
              console.log('gallery Image : ', image)
              console.log('image : ',image.length)
              console.log('selectedImages', selectedImages, selectedImages.length)
              if(addMore){
               if(!apartment){
                setSelectedImages([...selectedImages,...image])
               }
               else{
                if(newlyAddedImages){
                  setSelectedImages([...selectedImages,...image])
                  setNewlyAddedImages([...newlyAddedImages,...image])
                }
                else{
                  setSelectedImages([...selectedImages,...image])
                  setNewlyAddedImages(image)
                }
               
               }
   }
              else{
                setSelectedImages(image)
                setCreateApartmentModal(true)
                setMediaMode('gallery')
              }
             
            }).catch(err => console.log('gallery catch', err.message))
          }
          else {
            ImagePicker.openCamera({
              mediaType: 'photo'
            }).then(image => {
                console.log('camera Image : ', image)
                if (addMore){
                    setSelectedImages([...selectedImages, image ])
                  }
                  else{
                    setSelectedImages([image])
                    setCreateApartmentModal(true)
                    setMediaMode('camera')
                  }
            }).catch(err => console.log('camera catch', err.message))
          }
         
        }

        const delete_and_filterImages = (indexx, arr_images, key, path)=>{
           const deletedImgs = []
           const filteredImages = arr_images.filter((img, index)=>{
            if (mode){
              if(key){
                if(key == img.key){
                  deletedImgs.push(img.key)
                  console.log('removed image key : ', key)
                }
                    return(
                        index !== indexx
                    )
              }
              else{
               const newImgArr = newlyAddedImages.filter((newImg)=>{
                   return(
                    path !== newImg.path
                   )
                
                })
                console.log('newImgArr : ', newImgArr)
                setNewlyAddedImages(newImgArr)
                return(
                  index !== indexx
              )
              }
            }
            else {
              return(
                index !== indexx
            )
            }
           
              
           })
          
           setSelectedImages(filteredImages)
           if (removedImages){
             setRemovedImages([...removedImages, ...deletedImgs])
           }
           else{
            setRemovedImages(deletedImgs)
           }
        }

        const Save_And_Close_Modal = ()=>{
          setApartmentImages(selectedImages)
          setCreateApartmentModal(false)
        }

        const EditImages = ()=>{
            setCreateApartmentModal(true)
        }
 
        const navigateToApartmentLocationForm = ()=>{
            if (apartmentImages.length>=5){
                navigation.navigate('apartmentLocationForm', { apartmentShareStatusStorage, placeTypeStorage, bedroomNoStorage, bathroomNoStorage, electricityStorage, waterStorage, securityStorage , wardrobeStorage , popStorage, 'apartmentImagesStorage' : apartmentImages, apartment, mode, newlyAddedImages, removedImages, parkingSpace})
            }
        }

if(apartment && !apartmentImages){
    return(
      <>
       <Modal visible={true} onRequestClose={false} presentationStyle='overFullScreen' transparent={true}>
           <StatusBar style="light" backgroundColor="rgba(0,0,0,0.5)" />
           <View style={{flex: 1, backgroundColor:'rgba(0,0,0,0.5)', justifyContent:'center', alignItems:'center'}}>
                    <View style={{justifyContent:'center', alignItems:'center'}}>
                         <ActivityIndicator size='large' color='red'/>
                         <Text style={{color:'white', fontWeight:'600'}}>Loading Apartment Images</Text>
                      </View>
           </View>
       </Modal>
       <Modal visible={errorUploadAlert} onRequestClose={()=>{setErrorUploadAlert(false)}} presentationStyle='overFullScreen' transparent={true}>
            <StatusBar style="light" backgroundColor="rgba(0,0,0,0.5)" />
            <View style={{ flex: 1, ...styles.userProfileAlertContainer}}>
                    <View style={styles.userProfileSuccessAlert}>
                            <MaterialIcons name="error" size={40} color="red" style={{marginBottom: 10}}/>
                            <Text style={{color:"red", ...styles.errorAlertLabel}}>Network Error</Text>
                            <Text style={styles.errorAlertDescText}>An unknown error occured! Please check your internet connection and try again</Text>
                            <Pressable onPress={()=>{setErrorUploadAlert(false); navigation.goBack()}} style={{backgroundColor: 'black', ...styles.closeProfileAlert}}>
                                <Text style={styles.closeAlertText}>OK</Text>
                            </Pressable>
                        </View>
            </View>
      </Modal>
      </>
    )
}

    return(
    <GestureHandlerRootView style={styles.container}>
        <View style={styles.contentContainer}>
        <View style={{padding: 20}}>
          <Text style={styles.headerText}>Add photos of your apartment</Text>
          <Text style={styles.headerDescText}>You'll need at least 5 photos to get started. You can add more or make changes later. The first image selected is your cover photo</Text>
        </View>
        { !apartmentImages && <View style={{marginTop: 0, padding: 20}}>
         <Pressable onPress={()=>{onGallery('gallery')}} style={styles.addPhotoCont}>
              <AntDesign name="plus" size={30} color="black" style={{marginRight : 20}}/>
              <Text style={styles.addPhotoText}>Add Photos</Text>
         </Pressable>
         {/* <Pressable  onPress={()=>{onGallery('camera')}}  style={styles.addPhotoCont}>
              <Feather name="camera" size={30} color="black" style={{marginRight : 20}}/>
              <Text style={styles.addPhotoText}>Take New Photos</Text>
         </Pressable> */}
     </View>}
     
     { apartmentImages && <View  style={styles.editContainer}>
     <TouchableOpacity onPress={EditImages} style={styles.editCont}>
               <Text style={styles.editText}>Edit photos</Text>
     </TouchableOpacity>
              <Carousel
                      loop
                      width={width}
                      height={35/100 * height}
                      autoPlay={false}
                      panGestureHandlerProps={{
                          activeOffsetX: [-10, 10],
                      }}
                      data={apartmentImages}
                      scrollAnimationDuration={250}
                      onSnapToItem={(index)=>handleIndex(index + 1)}
                      renderItem={({ item, index }) => (
                      
                              <Image style={{width: width, height: 35/100 * height}} source={{uri : item.path}} key={index}/>
                      )}
                  />
                   <View style={{...styles.aptImageCont, top: 30/100 * height}}>
                        <Text style={styles.aptLengthText}>{index+" / "+apartmentImages?.length}</Text>
                   </View>
  </View>}
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
                <Pressable onPress={navigateToApartmentLocationForm} style={{ ...styles.nextBtn, backgroundColor: disableNextBtn? 'rgba(0,0,0,0.3)' : 'black'}}>
                    <Text style={styles.nextText}>Next</Text>
                </Pressable>
            </View>
            <Modal visible={createApartmentModal} onRequestClose={()=>{setCreateApartmentModal(false)}} presentationStyle='overFullScreen'>
             <View style={styles.modalCont}>
              <View style={styles.headerCont}> 
                 <Pressable onPress={Save_And_Close_Modal} style={styles.saveBtn}>
                    <Text style={styles.saveText}>Save & exit</Text>
                 </Pressable>
              </View>
              <View showsVerticalScrollIndicator={false} style={styles.mainCont}>
                <View style={styles.modalHeader}>
                       <Text style={styles.modalHeaderText}>Ta-da! How does this {'\n'} look?</Text>
                        <Pressable onPress={()=>{ onGallery(mediaMode, 'Add')}}  style={styles.addMoreBtn}>
                             <AntDesign name="plus" size={15} color="black" style={{marginRight: 10}}/>
                             <Text style={styles.addMoreText}>Add more</Text>
                        </Pressable>
                </View>
          
                <View>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 50}}>
                    <View style={styles.scrollViewContentContainer}>
                        {
                            selectedImages?.map((img, index)=>{
                                return(
                                    <View key={index} style={{ margin : 5 }}>
                                    <Image source={{uri : img.path}} style={ index==0 ? {...styles.coverPhotoImg, width: width} : {width: 70/100 * width, resizeMode:'cover', height: 200}}/>
                                    <View style={index==0? styles.coverPhotoContainer : {display: 'none'}}>
                                         <Text style={styles.coverPhotoText}>Cover Photo</Text>
                                    </View>
                                   <Pressable onPress={()=>{delete_and_filterImages(index, selectedImages, img.key, img.path)}} style={index==0? {...styles.deleteCoverImgIcon, left: 80/100 * width} : {...styles.deleteImgIcon, left: 60/100 * width}}>
                                          <Entypo name="cross" size={20} color="white"/>
                                    </Pressable>
                                </View>
                                )
                            })
                        }
                    </View>
                       
                    </ScrollView> 
                </View>
              </View>
             </View>
          </Modal> 
    </GestureHandlerRootView>

    )
}

export default ApartmentPhotosForm

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor:'white'
    },
    contentContainer: {
      flex: 1
    },
    editCont: {
      backgroundColor:'#4C4C4C',
      padding: 5,
      alignSelf:'flex-end'
    },
    editText: {
      color:'white', 
      fontWeight:'600', 
      fontSize: 12
    },
    headerText: {
      fontSize: 20, 
      fontWeight: '600', 
      marginBottom: 10
    },
    headerDescText: {
      fontSize: 14, 
      color:'#4C4C4C'
    },
    editBtn: {
      flexDirection:'row', 
      alignSelf:'flex-end',
      alignItems:'center', 
      paddingRight: 20
    },
    addPhotoCont: {
      borderRadius: 10, 
      flexDirection:'row', 
      borderWidth: 2, 
      borderColor:'gray', 
      padding: 20, 
      alignItems:'center'
    },
    nextBtn: {
      paddingVertical: 10, 
      paddingHorizontal: 20, 
      borderRadius:10
    },
    addPhotoText: {
      fontSize: 16, 
      fontWeight:'500'
    },
    editContainer: {
      marginTop: 20, 
      height: 260
    },
    nextText: {
      fontWeight: '600', 
      color:'white', 
      fontSize: 16, 
      letterSpacing: 0.5
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
    modalCont: {
      flex: 1, 
      backgroundColor:'white'
    },
    headerCont: {
      borderBottomWidth: 0.5, 
      borderColor:'#4C4C4C', 
      padding: 10, 
      flexDirection:'row'
    },
    saveBtn: {
      borderWidth: 0.5, 
      borderColor:'#4C4C4C', 
      paddingVertical: 10, 
      paddingHorizontal: 20, 
      borderRadius: 20
    },
    saveText: {
      fontSize: 14, 
      fontWeight: '500'
    },
    modalHeader: {
      flexDirection:'row', 
      alignItems:'center', 
      justifyContent:'space-between', 
      marginBottom: 20
    },
    modalHeaderText: {
      fontSize: 18, 
      fontWeight: '500'
    },
    addMoreBtn: {
      flexDirection:'row', 
      alignItems:'center', 
      borderWidth: 0.5, 
      borderColor:'#4C4C4C', 
      paddingVertical: 10, 
      paddingHorizontal: 15, 
      borderRadius: 20
    },
    addMoreText: {
      fontSize: 14, 
      fontWeight: '500'
    },
    scrollViewContentContainer: {
      alignItems:'center'
    },
    coverPhotoImg: {
      height: 250, 
      resizeMode: 'cover'
    },
    aptImageCont: {
      position: 'absolute',  
      left: '82%', 
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
    coverPhotoContainer: {
      position: 'absolute', 
      left: '10%', 
      backgroundColor: 'gray', 
      padding: 5
    },
    coverPhotoText: {
      fontSize: 14, 
      fontWeight:'600',
      color:'white'
    },
    deleteCoverImgIcon: {
      backgroundColor:'rgba(0,0,0,0.5)', 
      justifyContent:'center', 
      alignItems:'center', 
      position:'absolute', 
      top: 10, 
      width: 35, 
      height: 35, 
      borderRadius: 35
    },
    deleteImgIcon: {
      backgroundColor:'rgba(0,0,0,0.5)', 
      justifyContent:'center', 
      alignItems:'center', 
      position:'absolute', 
      top: 10, 
      width: 30, 
      height: 30, 
      borderRadius: 30
    },
    mainCont: {
      flex: 1, 
      padding: 20
    },
    userProfileAlertContainer: {
      backgroundColor:'rgba(0,0,0,0.5)', 
      justifyContent:'center',
      alignItems:"center"
    },
    errorAlertLabel: {
      fontWeight: '600', 
      fontSize: 16, 
      marginBottom: 15,
      textAlign:"center"
    },
    errorAlertDescText: {
      color:"#4C4C4C", 
      fontWeight: '500', 
      textAlign:'center', 
      marginBottom: 30, 
      fontSize: 14
    },
    userProfileSuccessAlert: {
      width: '70%',
      padding: 20, 
      backgroundColor:'white', 
      borderRadius: 20, 
      elevation: 5, 
      alignItems:'center'
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