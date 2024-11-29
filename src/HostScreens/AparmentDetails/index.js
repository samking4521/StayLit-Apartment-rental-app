import { useEffect, useState, useCallback, useRef} from 'react'
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, useWindowDimensions, Alert, ActivityIndicator, Modal, Pressable} from 'react-native'
import { StatusBar } from 'expo-status-bar';
import {captureRef} from 'react-native-view-shot';
import { useRoute } from '@react-navigation/native'
import { Entypo, AntDesign, Ionicons, FontAwesome,  FontAwesome6, MaterialCommunityIcons, Feather, MaterialIcons} from '@expo/vector-icons'
import AgentInfo from './agentInfo';
import ApartmentMap from './apartmentMap';
import ApartmentAmenities from './aparmentAmenities';
import SingleUserReview from './individualUserReview';
import { useNavigation } from '@react-navigation/native';
import Carousel from 'react-native-reanimated-carousel';
import Share from 'react-native-share';
import { DataStore } from 'aws-amplify/datastore';
import { Apartment, Review, WishList, User, AllReviews, PaymentHistory, UniqueViews, TotalViews } from '../../models'
import { list, remove } from 'aws-amplify/storage';
import FastImage from 'react-native-fast-image';
import { Buffer } from 'buffer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const URL = 'https://dr4jupy057c0c.cloudfront.net/'
const bucket = 'staylit-storage-1914deba97d11-staging'

const AparmentDetailsScreen = ()=>{
    const {width, height } = useWindowDimensions()
    const route = useRoute()
    const { payment, views, apartment, dbHost } = route.params
    const [aptImages, setApartmentImages] = useState(null)
    const [index, setIndex] = useState(1);
    const navigation = useNavigation()
    const [reviewPresent, setReviewPresent] = useState(null)
    const [starReview, setStarReview] = useState('')
    const [totalRevLength, setTotalRevLength] = useState('')
    const [showDelAptModal, setShowDelAptModal] = useState(false)
    const [userData, setUserData] = useState(null)
    const [coverPhoto, setCoverPhoto] = useState(null)
    const [uniqueViews, setUniqueViews] = useState(null)
    const [errorUploadAlert, setErrorUploadAlert] = useState(false) // controls visibility of the profile upload error alert (create = 'Error Creating Profile', update='Error Updating profile' null = hidden) 
    const scrollViewRef = useRef();
    const viewShotRef = useRef();

    useEffect(()=>{
      getCoverPhoto()
   }, [])
   const getCoverPhoto = async ()=>{  
     try{
     const imageRequest = JSON.stringify(
       {
         "bucket": bucket,
         "key": `public/apartmentCoverPhoto/${apartment.id}/coverPhoto.jpeg`,
         "edits": {
           "resize": {
             "width": 150,
             "height": 150,
             "fit": "cover"
           }
         }
       }
     )
     const encoded = Buffer.from(imageRequest).toString('base64')
     setCoverPhoto(`${URL}${encoded}`)
     }catch(e){
       console.log('Error Retrieving Images List : ', e.message);
     }
   }
   
    const formatNumber = (num) => {
      if (num >= 1000000000) {
        return (num % 1000000000 === 0 ? num / 1000000000 : (num / 1000000000).toFixed(1)) + 'B';
      }
      if (num >= 1000000) {
        return (num % 1000000 === 0 ? num / 1000000 : (num / 1000000).toFixed(1)) + 'M';
      }
      if (num >= 1000) {
        return (num % 1000 === 0 ? num / 1000 : (num / 1000).toFixed(1)) + 'k';
      }
      return num?.toString();
    };
    
  
    useEffect(()=>{
      if(apartment && !payment?.UniqueViews){
        getTotalUniqueViews()
      }
  }, [apartment, payment])
    
    

    const getTotalUniqueViews = async()=>{
       const totalUniqueViews = await DataStore.query(Apartment, (a)=> a.id.eq(apartment.id))
       setUniqueViews(totalUniqueViews[0].uniqueViewCount)
    }

   
    const getUserDataFromPayment = async()=>{
      const theUserData = await DataStore.query(User, (u)=> u.id.eq(payment.userID))
      console.log('theUserData : ', theUserData)
      setUserData(theUserData[0])
  }

    useEffect(()=>{
        if(payment){
          getUserDataFromPayment()
        }
    }, [payment])

    

     useEffect(()=>{
        if(apartment){
          getApartmentImages()
        }
     }, [])
 
     const getApartmentImages = useCallback(async ()=>{  
      try{
        const result = await list({ prefix: apartment.key, options: { accessLevel: 'guest' } });
        const imagesUriArr = result.items.map((imgObj) => imgObj.key);
        console.log('result : ', result)
        console.log('imagesUriArr : ', imagesUriArr)
        const aptImages = await Promise.all(imagesUriArr.map(getImagesUrl));
        console.log('Apartment images fetched successfully : ',  aptImages)
        setApartmentImages(aptImages);
      }catch(e){
        console.error('Error Retrieving Images List : ', error.message);
        setErrorUploadAlert(true)
      }
    },[apartment])
  
  
  const getImagesUrl = async (imageKey)=>{
    try{
    const imageRequest = JSON.stringify(
      {
        "bucket": bucket,
        "key": `public/${imageKey}`,
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
    return `${URL}${encoded}`
    }catch(e){
      console.log('Error Retrieving Images Url : ', e.message)
      return null
    }
  }
    
    const getAverageReviewStarLength = useCallback(async ()=>{
      const reviewArr = await DataStore.query(AllReviews, (r)=> r.hostID.eq(dbHost.id))
      setTotalRevLength(reviewArr)
      console.log('reviewArr : ', reviewArr)
      if (reviewArr.length > 0) {
        const starLengths = reviewArr.reduce((a, review) => a + review.starLength, 0);
        setStarReview(starLengths / reviewArr.length);
    }
  }, [dbHost])
  
  

   useEffect(()=>{
    if(!dbHost){
        return
    }
    getAverageReviewStarLength()
   }, [dbHost])
   

    const getUserApartmentReview = async ()=>{
       const getUserAptReview = await DataStore.query(Review, (r)=> r.and(r => [
         r.hostID.eq(dbHost.id),
         r.apartmentID.eq(apartment.id)
       ]))
       console.log('getUserAptReview : ', getUserAptReview[0])
       setReviewPresent(getUserAptReview[0])
    }

    const getTheUserReview = async ()=>{
        const getPayHistoryObj = await DataStore.query(PaymentHistory, (p)=> p.id.eq(payment.id))
        console.log('getPayHistoryObj : ', getPayHistoryObj[0].Review)
        setReviewPresent(getPayHistoryObj[0].Review)
    }

  
   useEffect(()=>{
       if(dbHost && payment && !payment?.UniqueViews){
        getUserApartmentReview()
       }else{
          if(dbHost && payment && payment?.UniqueViews){
            getTheUserReview()
          }
       }
   }, [dbHost, apartment, payment])
  
 
  
    const handleIndex = (snapIndex)=>{
        setIndex(snapIndex)
}

  
    const removeApartmentFromS3Bucket = async (hostID, apartmentID)=>{
      try {
        const result = await list({
          prefix: `apartmentPhotos/${hostID}/${apartmentID}/`,
          options:  {
            accessLevel: 'guest'
          }
        });
        console.log('List of images from S3 bucket : ', result)
        const imagesArr = result.items
        console.log('imageResultArr : ', imagesArr)
        removeImagesFromS3Bucket(imagesArr)
     }
     catch(e){
        console.log('Error Deleting Images in S3 Bucket : ', e.message)
     }
    }
      
    const removeApartmentCoverPhoto = async ()=>{
      await remove({ 
        path: `public/${apartment.coverPhotoKey}`
      });
      console.log('Cover image deleted successfully')
    }

    const removeImagesFromS3Bucket = async (imagesArr)=>{
      try {
        for (imgPath of imagesArr){
          await remove({ 
            path: `public/${imgPath.key}`,
          });
        }
        console.log('Images successfully removed from S3 bucket')
        removeApartmentCoverPhoto()
      } catch (error) {
        console.log('Error : ', error.message);
      }
    }

 
    const showAlert = () => {
      Alert.alert(
        "Delete Apartment",
        "Are you sure you want to delete this apartment? This action cannot be undone.",
        [

          { text: "Delete Apartment", 
           onPress: () => {setShowDelAptModal(true); deleteApartment()}
         },
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },

        ],
        { cancelable: false }
      );
    }
     
   const deleteApartment = async ()=>{
     // Query Apartment
     const aptToDel = await DataStore.query(Apartment, (a)=> a.id.eq(apartment.id))
     console.log('aptToDel: ', aptToDel)

  // Query WishList
     const wishListApt = await DataStore.query(WishList, (w)=> w.apartmentId.eq(apartment.id))
     console.log('wishListApt : ', wishListApt)
   // Delete Wishlist
   if(wishListApt.length >= 1){
    const deletedWishList = await Promise.all(
      wishListApt.map(async (wl) => {
        return await DataStore.delete(wl);
      })
    );
    console.log('deletedWishList : ', deletedWishList)
   }
    
   const getTotalViewsObj = await DataStore.query(TotalViews, (t)=> t.apartmentID.eq(apartment.id))
      console.log('getTotalViewsObj on apartmentList : ', getTotalViewsObj[0])
      if(getTotalViewsObj[0]){
        const deletedTotalView = await DataStore.delete(getTotalViewsObj[0])
        console.log('deleted Apartment TotalView : ', deletedTotalView)
      }

   const getUniqueViews = await DataStore.query(UniqueViews, (u)=> u.apartmentID.eq(apartment.id))
   console.log('getUniqueViews : ', getUniqueViews)
   if(getUniqueViews.length >= 1){
    const deletedUniqueViews = await Promise.all(
      getUniqueViews.map(async (uv) => {
        return await DataStore.delete(uv);
      })
    );
    console.log('deletedUniqueViews : ', deletedUniqueViews)
   }

    
   const checkAptPaid = await DataStore.query(PaymentHistory, (p)=> p.apartmentID.eq(apartment.id))
      console.log('checkAptPaid : ', checkAptPaid)
      if(checkAptPaid.length == 0){
            // Delete Apartment Images
       await removeApartmentFromS3Bucket(aptToDel[0].hostID, aptToDel[0].id)
      }

       // Delete Apartment
     const deletedApartment = await DataStore.delete(aptToDel[0])
     console.log('deletedApartment : ', deletedApartment)
     setShowDelAptModal(false)
     navigation.navigate('Listings')
   }

   const handleShareScreenshot = async () => {
    try {
      // Capture the screenshot of the viewRef
      const uri = await captureRef(viewShotRef, {
        format: 'jpg',
        quality: 0.8,
      });

      // Prepare the share options
      const message = `Here is the apartment ID: ${apartment.id}`;
      const shareOptions = {
        message,
        url: uri,
        title: 'Check out this apartment!',
      };

      // Use the built-in Share API to share the image and message
      await Share.open(shareOptions);
    } catch (error) {
      console.error('Error capturing view or sharing:', error);
    }
  };

  
  
   
    if(!aptImages){
       return(
        <>
           <View style={styles.loadingCont}>
              <StatusBar style="light" backgroundColor={'rgba(0,0,0,0.5)'}/>
                <View style={styles.alignCont}>
                  <View style={styles.loadingImgCont}>
                      <Image source={require('../../../assets/loadingGif.gif')} style={styles.loadingImage}/>
                  </View>
                   <Text style={styles.loadingText}>Loading...</Text>
                </View>
           </View>
            <Modal visible={errorUploadAlert} onRequestClose={()=>{setErrorUploadAlert(false)}} presentationStyle='overFullScreen' transparent={true}>
            <StatusBar style="light" backgroundColor="rgba(0,0,0,0.5)" />
            <View style={{ flex: 1, ...styles.userProfileAlertContainer}}>
                    <View style={styles.userProfileSuccessAlert}>
                            <MaterialIcons name="error" size={50} color="red" style={{marginBottom: 10}}/>
                            <Text style={{color:"red", ...styles.errorAlertLabel}}>Network Error</Text>
                            <Text style={styles.errorAlertDescText}>An unknown error occured! Please check your internet connection and try again</Text>
                            <Pressable onPress={()=>{setErrorUploadAlert(false); navigation.goBack()}} style={{backgroundColor: 'black', ...styles.closeProfileAlert}}>
                                <Text style={styles.closeAlertText}>Done</Text>
                            </Pressable>
                        </View>
            </View>
      </Modal>
      </>
  
       )
    }

    return(
        <View style={styles.container}>
           <StatusBar style="light" backgroundColor={'rgba(0,0,0,0.5)'}/>
           <GestureHandlerRootView>
            <ScrollView ref={scrollViewRef} keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>
           
            <View style={styles.goBackIconCont}>
                  <TouchableOpacity onPress={()=>{navigation.goBack()}} style={styles.goBackIconBtn}>
                      <AntDesign name="arrowleft" size={20} color="black" />
                  </TouchableOpacity>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                    {payment?.UniqueViews || payment? null :<TouchableOpacity style={{...styles.delIcon, marginRight: 5}} onPress={handleShareScreenshot}>
                           <View style={styles.wishListDelCont}>
                                          <Entypo name="share" size={18} color="black" />
                            </View>
                </TouchableOpacity>}
                        {payment?.UniqueViews || payment? null : <View style={styles.delIcon}>
                                            <AntDesign onPress={showAlert} name="delete" size={20} color="black" />
                              </View>}
                    </View>
                     
            </View>
           <View>
           <Carousel
                loop
                width={width}
                height={35/100 * height}
                autoPlay={false}
                onSnapToItem={(index)=>handleIndex(index + 1)}
                data={aptImages}
                panGestureHandlerProps={{
                    activeOffsetX: [-10, 10],
                }}
                scrollAnimationDuration={250}
                
                renderItem={({ item, index}) => (
                   
                        <FastImage style={{width: width, height: (35/100 * height)}} source={{uri : item}} key={index}  resizeMode={FastImage.resizeMode.cover}/>
                        
                )}
            />
           
            </View>
            <View style={{...styles.aptImageCont, top: 30/100 * height}}>
                <Text style={styles.aptLengthText}>{index+" / "+aptImages?.length}</Text>
            </View>
           
           <View style={{paddingHorizontal: 15}}> 
           <View style={styles.apartmentHeaderDataCont}>
                <Text style={styles.apartmentTitle}>{apartment.apartmentTitle}</Text>
                <Text style={styles.apartmentDescText}>{apartment.apartmentDesc} with a nice apartment. Perfect for a middle class family of 5 and above. You will defintely love it.</Text>
                <View style={{...styles.alignContainer, marginTop: 10}}>
                    <Entypo name="location-pin" size={24} color="red"/>
                    <Text style={styles.apartmentLocation}>{apartment.address}</Text>
                   
                   <View style={{flexDirection:'row', alignItems:'center', marginRight: 10}}>
                      <Feather name="eye" size={18} color="#4C4C4C" />
                      <Text style={{color: '#4C4C4C', fontSize: 14, fontWeight:'500', marginLeft: 4}}>{payment?.UniqueViews? formatNumber(payment.TotalViews) + ' views' : views? formatNumber(views) +' views' : 0}</Text>
                   </View>
                  <View style={{flexDirection:'row', alignItems:'center'}}>
                        <AntDesign name="user" size={19} color="#4C4C4C" />
                        <Text style={{color: '#4C4C4C', fontSize: 14, fontWeight:'500', marginLeft: 4}}>{payment?.UniqueViews? formatNumber(payment.UniqueViews) : uniqueViews? formatNumber(uniqueViews) : 0}</Text>
                   </View>
                </View>
           </View>
           <View  style={styles.apartmentRoomsImgDetailCont}>
              <View style={styles.aptRoomImgCont}>
                <View style={styles.roomImgStyle}>
                    <AntDesign name="home" size={40} color="#4C4C4C"/>
                </View>
              <Text style={styles.roomImgText}>{apartment.shareStatus} apartment</Text>
              </View>
              <View style={styles.aptRoomImgCont}>
                   <View style={styles.roomImgStyle}>
                      <Ionicons name="bed-outline" size={40} color="#4C4C4C"/>
                    </View> 
                    <Text style={styles.roomImgText}>{apartment.bedroom} bedroom</Text>
              </View>
              <View style={styles.aptRoomImgCont}>
                 <View style={styles.roomImgStyle}>
                       <FontAwesome name="bathtub" size={40} color="#4C4C4C"/>
                 </View>
                <Text style={styles.roomImgText}>{apartment.bathroom} bathroom</Text>
              </View>
           </View>
                <ApartmentAmenities apartment={apartment}/>
                <ApartmentMap apartment={apartment}/>
                <AgentInfo userData={userData} payment={payment} starReview={starReview} totalRevLength={totalRevLength} apartment={apartment} hostData={dbHost}/>
                <View style={{paddingVertical: 15, borderBottomWidth: 1, borderBottomColor:'lightgray'}}>
                              <Text style={{fontSize: 18, fontWeight: '600', marginBottom: 10}}>Pricing</Text>
                              <View style={{flexDirection:'row', alignItems:'center'}}>
                                 <Text style={{color:'#4C4C4C', fontWeight:'500', fontSize: 15, marginRight:'auto'}}>Move in fee (one time initial deposit)</Text>
                                 <View style={{flexDirection:'row', alignItems:'center'}}>
                                     <FontAwesome6 name="naira-sign" size={11} color="black" />
                                     <Text style={{fontSize: 14, color:'black', fontWeight:'500'}}>{apartment.moveInCost}</Text>
                                 </View>
                              </View>
                              <View style={{flexDirection:'row', alignItems:'center', marginTop: 5}}>
                                 <Text style={{color:'#4C4C4C', fontWeight:'500', fontSize: 15, marginRight:'auto'}}>Rent &#8226; {apartment.leaseDuration}</Text>
                                 <View style={{flexDirection:'row', alignItems:'center'}}>
                                     <FontAwesome6 name="naira-sign" size={11} color="black" />
                                     <Text style={{fontSize: 14, fontWeight:'500', color:'black'}}>{apartment.formattedPrice}</Text>
                                 </View>
                              </View>
                          </View>
                   {(payment && reviewPresent)? <SingleUserReview reviewPresent={reviewPresent} /> : payment?
                      <View style={{padding: 20, flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                          <AntDesign name="staro" size={30} color="#4C4C4C" style={{marginRight: 5}}/>
                          <Text style={{fontWeight: '500', fontSize: 16, color:'#4C4C4C'}}>No review from occupant yet</Text>
                      </View> : 
                          <View style={{padding: 20}}>
                             <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                                   <AntDesign name="staro" size={30} color="#4C4C4C" style={{marginRight: 5}}/>
                                    <Text style={styles.noReviewText}>No review on apartment yet!</Text>
                              </View>
                            <Text style={{color:'#4C4C4C', fontWeight:'400', fontSize: 14, textAlign:'center'}}>Reviews are made on apartment, only when payment has been made for the apartment.</Text>
                        </View>
                          }
                         
                  </View>

            </ScrollView>
          </GestureHandlerRootView>
                        <Modal visible={showDelAptModal} transparent={true} presentationStyle='overFullScreen' onRequestClose={()=>{}}>
                                                <View style={styles.deleteAptContainer}>
                                                  <ActivityIndicator size={'large'} color={'red'}/>
                                                  <Text style={styles.deleteAptText}>Deleting Apartment</Text>
                                                </View>
                          </Modal>
          { payment?
                  <View style={styles.footerDetailCont}>
                  <View style={{...styles.alignContainer, marginRight:'auto'}}>
                  <MaterialCommunityIcons name="seal" size={25} color="gold" style={{marginRight: 2}}/>
                  <Text style={styles.paidText}>PAID</Text>
                  </View>
                  <View style={styles.alignContainer}>
                    <FontAwesome6 name="naira-sign" size={15} color="black" />
                     <Text><Text style={styles.leaseDurationText}>{apartment.formattedPrice}</Text> &#8226; <Text style={{fontWeight:'500', color:'#4C4C4C'}}>{apartment.leaseDuration}</Text></Text>
                  </View>
              </View> : apartment.status == 'AVAILABLE'? <View style={styles.footerDetailCont}>
                  <View style={styles.alignContainer}>
                    <FontAwesome6 name="naira-sign" size={15} color="black" />
                     <Text><Text style={styles.leaseDurationText}>{apartment.formattedPrice}</Text> &#8226; <Text style={{fontWeight:'500', color:'#4C4C4C'}}>{apartment.leaseDuration}</Text></Text>
                  </View>
                   <View style={styles.inLeaseCont}>
                      <Text style={styles.inLeaseText}>AVAILABLE</Text>
                   </View>
             </View> : <View style={styles.footerDetailCont}>
                  <View style={styles.alignContainer}>
                    <FontAwesome6 name="naira-sign" size={15} color="black" />
                     <Text><Text style={styles.leaseDurationText}>{apartment.formattedPrice}</Text> &#8226; <Text style={{fontWeight:'500', color:'#4C4C4C'}}>{apartment.leaseDuration}</Text></Text>
                  </View>
                   <View style={{...styles.inLeaseCont, backgroundColor:'gray'}}>
                      <Text style={styles.inLeaseText}>UNAVAILABLE</Text>
                   </View>
             </View>
              }      
                <View ref={viewShotRef} style={{position:'absolute', left: -1000, backgroundColor:'white', padding: 10}}>
                                   <View style={{flexDirection:"row", alignItems:'center'}}>
                                             <Image source={{uri : coverPhoto}} style={{width: 150, height: 150, borderRadius:10, resizeMode:'cover', marginRight:10}}/>
                                            <View style={{height:150, width: 40/100 * width, justifyContent:'space-around'}}>
                                                  <Text style={{fontSize: 18, fontWeight:'500', textAlign:'center' }}>{apartment.apartmentTitle}</Text>
                                                  <Text style={{fontSize: 16, fontWeight:'500', color:'#4C4C4C', textAlign:'center'}}><Entypo name="location-pin" size={20} color="#FF0000"/> {apartment.city} &#8226; {apartment.state} &#8226; {apartment.country}</Text>
                                                  <Text style={{fontSize: 16, fontWeight:'500', color:'#4C4C4C', textAlign:'center'}}><FontAwesome6 name="naira-sign" size={15} color='#4C4C4C' />{apartment.formattedPrice} &#8226; {apartment.leaseDuration}</Text>
                                                  {/* Other apartment details */}
                                            </View>
                                    </View>
                                    <View style={{marginTop: 5}}>
                                      <Text style={{fontSize: 15, fontWeight:'500', lineHeight: 20, textAlign:"center"}}>This apartment is exclusive on the StayLit App. Download the StayLit app on google playstore and copy the apartment ID: <Text style={{color:'blue'}}>{apartment.id}</Text> to find this apartment on the app.</Text>
                                    </View>  
                         </View>
                       
              
           </View>  
    )
}

export default AparmentDetailsScreen

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
    backgroundColor:'white'
  },
   goBackIconCont: {
    width: '100%', 
    flexDirection:"row", 
    alignItems:'center', 
    justifyContent:"space-between", 
    position:'absolute', 
    top: 25, 
    zIndex: 1
   },
   goBackIconBtn: {
    backgroundColor: 'white', 
    marginLeft : 20, 
    width: 35, 
    height: 35, 
    borderRadius: 35, 
    justifyContent:'center', 
    alignItems:'center'
   },
   delIcon: {
    backgroundColor:'white', 
    width: 35, 
    height: 35, 
    borderRadius: 35, 
    justifyContent:'center', 
    alignItems:'center',
    marginRight: 10
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
   apartmentHeaderDataCont: {
    paddingVertical: 15, 
    borderBottomWidth: 0.5, 
    borderColor: 'gray'
   },
   apartmentTitle: {
    fontSize: 22, 
    letterSpacing: 1, 
    fontWeight: '600', 
    marginBottom: 10
   },
   apartmentDescText: {
    fontSize: 15,
    fontWeight:'500'
   },
   alignContainer: {
    flexDirection:'row', 
    alignItems:'center'
   },
   apartmentLocation: {
    fontSize: 14, 
    color:'#4C4C4C',
    marginRight:"auto",
    width: '50%',
    fontWeight:'500'
   },
   apartmentRoomsImgDetailCont: {
    flexDirection:'row', 
    alignItems:'center', 
    justifyContent:'space-around',
    paddingVertical: 20, 
    borderBottomColor: 'gray', 
    borderBottomWidth: 0.5
   },
   aptRoomImgCont: {
    alignItems:'center', 
    justifyContent:'center'
   },
   roomImgStyle: {
    borderWidth: 0.5, 
    width: 80,
    height: 80,
    justifyContent:'center',
    alignItems:'center',
    borderRadius: 80, 
    borderColor: 'gray', 
    marginBottom: 10
   },
   roomImgText: {
    fontSize: 14, 
    color: "#4C4C4C"
   },
   noReviewText: {
    fontSize: 16, 
    color: '#4C4C4C', 
    fontWeight: '500'
   },
   deleteAptContainer: {
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent:'center', 
    alignItems:'center'
   },
   deleteAptText: {
    fontSize: 14, 
    fontWeight: '500', 
    color: 'white'
   },
   footerDetailCont: {
    flexDirection:'row', 
    alignItems:'center', 
    justifyContent:'space-between',
    padding: 10, 
    backgroundColor:'white', 
    borderTopWidth: 0.5, 
    borderTopColor: 'lightgray'
   },
   paidText: {
    fontWeight:'bold', 
    fontSize: 20, 
    color:'#4C4C4C'
   },
   inLeaseCont: {
    padding: 10,
    backgroundColor:'green', 
    borderRadius: 5
   },
   inLeaseText: {
    color: 'white', 
    fontWeight:'500', 
    fontSize: 14
   },
   leaseDurationText: {
    fontWeight: '600', 
    fontSize: 16
   },
userProfileAlertContainer: {
  backgroundColor:'rgba(0,0,0,0.5)', 
  justifyContent:'center',
   alignItems:"center"
},
errorAlertLabel: {
  fontWeight: '600', 
  fontSize: 20, 
  marginBottom: 15
},
errorAlertDescText: {
  color:"#4C4C4C", 
  fontWeight: '500', 
  textAlign:'center', 
  marginBottom: 30, 
  fontSize: 16
},
userProfileSuccessAlert: {
  padding: 30, 
  backgroundColor:'white', 
  borderRadius: 20, 
  elevation: 5, 
  alignItems: 'center',
  marginHorizontal: 20
},
closeProfileAlert: {
  padding: 10, 
  borderRadius: 10
},
closeAlertText: {
  color:'white', 
  fontWeight: '600', 
  fontSize: 16
}
})

