import { useEffect, useState, useCallback, useRef} from 'react'
import { View, Text, Image, ScrollView, StyleSheet, Clipboard, TouchableOpacity, useWindowDimensions, Modal, Pressable, Alert} from 'react-native'
import { StatusBar } from 'expo-status-bar';
import { useRoute } from '@react-navigation/native'
import {captureRef} from 'react-native-view-shot';
import { Entypo, AntDesign, Ionicons, FontAwesome,  FontAwesome6, MaterialCommunityIcons, Feather, MaterialIcons} from '@expo/vector-icons'
import AgentReviews from './agentReviews';
import ReviewStars from '../../components/reviewStars';
import AgentInfo from './agentInfo';
import ApartmentMap from './apartmentMap';
import ApartmentAmenities from './aparmentAmenities';
import { useNavigation } from '@react-navigation/native';
import Carousel from 'react-native-reanimated-carousel';
import { useUserAuthContext } from '../../Context/userContext';
import { DataStore } from 'aws-amplify/datastore';
import { Apartment, WishList, Host, AllReviews, PaymentHistory, UniqueViews, TotalViews } from '../../models'
import { list } from 'aws-amplify/storage';
import { fetchWishListSuccess } from '../../Redux/wishList/wishListActions';
import Share from 'react-native-share';
import FastImage from 'react-native-fast-image';
import { Buffer } from 'buffer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSelector, useDispatch } from 'react-redux';
import { showProfileAlert } from '../../Redux/showProfile/showProfileActions';
const URL = 'https://dr4jupy057c0c.cloudfront.net/'
const bucket = 'staylit-storage-1914deba97d11-staging'

const AparmentDetailsScreen = ()=>{
    const dbUser = useSelector(state => state.user.dbUser)
    const dispatch = useDispatch()
    const { userAuth } = useUserAuthContext()
    const {width, height } = useWindowDimensions()
    const route = useRoute()
    const { payment, views, apartment, hostData, wishlistIcon, mod} = route.params
    const [aptImages, setApartmentImages] = useState(null)
    const [index, setIndex] = useState(1);
    const [reviewStarLength, setReviewStarLength] = useState(0)
    const [reviewText, setReviewText] = useState('')
    const [isTextInputFocused, setIsTextInputFocused] = useState(false)
    const [modalShow, setModalShow] = useState(false)
    const navigation = useNavigation()
    const [reviewPresent, setReviewPresent] = useState(null)
    const [mode, setMode] = useState(null)
    const [starReview, setStarReview] = useState('')
    const [totalRevLength, setTotalRevLength] = useState('')
    const [inWishList, setInWishList] = useState('null')
    const [aptWishTrue, setAptWishTrue] = useState()
    const [host, setHost] = useState(null)
    const [totalAptView, setTotalAptView] = useState(null)
    const [closeReview, setCloseReview] = useState(false)
    const [coverPhoto, setCoverPhoto] = useState(null)
    const [timeState, setTimeState] = useState(false)
    const [scrollToBottom, setScrollToBottom] = useState(false);
    const [errorUploadAlert, setErrorUploadAlert] = useState(null) // controls visibility of the profile upload error alert (create = 'Error Creating Profile', update='Error Updating profile' null = hidden) 
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
   
    const checkWishList = async ()=>{
        const getWishListApartment = await DataStore.query(WishList, (w)=> w.and(w => [
          w.userId.eq(dbUser?.id),
          w.apartmentId.eq(apartment?.id)
        ]))
        if(getWishListApartment[0]){
          setAptWishTrue(true)
        }
    }
 
    useEffect(()=>{
      if(dbUser && apartment){
        checkWishList()
      }
    }, [dbUser, apartment])

    useEffect(()=>{
        if(((payment && !reviewPresent && dbUser) && !closeReview && aptImages)){
            setTimeout(()=>{
                setTimeState(true)
            }, 2000)
        }else{
          setTimeState(false)
        }
    }, [payment, reviewPresent, dbUser, closeReview, aptImages])
    

    useEffect(() => {
      if (scrollToBottom) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }, [scrollToBottom]);

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
      if(apartment && aptImages && userAuth && !payment){
        getAndIncrementUniqueViewsCount()
        getAndIncrementTotalViewsCount()
      }
    }, [apartment, aptImages, userAuth, mod])

    const getAndIncrementTotalViewsCount = async ()=>{
        try{
          const getTotalViewsObj = await DataStore.query(TotalViews, (t) => t.apartmentID.eq(apartment.id))
          console.log('getTotalViewsObj : ', getTotalViewsObj[0])
          if (getTotalViewsObj[0]){
            const updateTotalViewsCount = await DataStore.save( 
              TotalViews.copyOf( getTotalViewsObj[0], (updated)=>{
                  updated.finalViewCount = getTotalViewsObj[0].finalViewCount += 1
              }))
              console.log('updateTotalViewsCount : ', updateTotalViewsCount)
              setTotalAptView(updateTotalViewsCount.finalViewCount)
          }else{
              const saveTotalViewsCount = await DataStore.save(new TotalViews({
                   apartmentID: apartment.id,
                   finalViewCount: 1
              }))
              console.log('saveTotalViewsCount : ', saveTotalViewsCount)
              setTotalAptView(saveTotalViewsCount.finalViewCount)
          }
  
        }catch(e){
              console.log('Error in getAndIncrementTotalViewsCount', e.message)
        }
    }

   const getAndIncrementUniqueViewsCount = async()=>{
       try{
        const uniqueViewsCount = await DataStore.query(UniqueViews, (u)=> u.and(u => [
          u.apartmentID.eq(apartment.id),
          u.userID.eq(userAuth)
          ]))
          console.log('uniqueViewsCount : ', uniqueViewsCount)
         if (uniqueViewsCount[0]){
             return
           }else{
          const saveUniqueViewCount = await DataStore.save(new UniqueViews({
              apartmentID: apartment.id,
              userID: userAuth
          }))
          console.log('saveUniqueViewCount : ', saveUniqueViewCount)
          const theAptment = await DataStore.query(Apartment, (a)=> a.id.eq(apartment.id))
              const updateUniqueViewCount = await DataStore.save( 
                Apartment.copyOf( theAptment[0], (updated)=>{
                    updated.uniqueViewCount = theAptment[0].uniqueViewCount? theAptment[0].uniqueViewCount += 1 : 1
                }))
                console.log('updateUniqueViewCount : ', updateUniqueViewCount)
        }
       }catch(e){
            console.log('Error in getAndIncrementUniqueViewsCount : ', e.message)
       }   
   }

    useEffect(()=>{
      if(payment && hostData){
        getCurrentHost()
      }else{
        return
      }
    }, [hostData, payment])
    
   
    const getCurrentHost = async ()=>{
        const theHost = await DataStore.query(Host, (h)=> h.id.eq(hostData.id))
        console.log('theHost : ', theHost[0])
        setHost(theHost[0])
    }

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
      const reviewArr = await DataStore.query(AllReviews, (r)=> r.hostID.eq(hostData.id))
      setTotalRevLength(reviewArr)
      console.log('reviewArr : ', reviewArr)
      if (reviewArr.length > 0) {
        const starLengths = reviewArr.reduce((a, review) => a + review.starLength, 0);
        setStarReview(starLengths / reviewArr.length);
    }
  }, [hostData])
  
  

   useEffect(()=>{
    if(hostData){
      getAverageReviewStarLength()
    }
   }, [hostData])
   
    useEffect(()=>{
    if(payment && reviewPresent){
        setMode('UpdateReview')
    }
    else{
        setMode('CreateReview')
    }
    }, [payment, reviewPresent])

    
    const getTheUserReview = async ()=>{
      const getPayHistoryObj = await DataStore.query(PaymentHistory, (p)=> p.id.eq(payment.id))
      console.log('getPayHistoryObj : ', getPayHistoryObj[0].Review)
      setReviewPresent(getPayHistoryObj[0].Review)
    }

   useEffect(()=>{
          if(hostData && payment && apartment){
            getTheUserReview()
          }    
   }, [hostData, apartment, payment])

    const handleIndex = (snapIndex)=>{
        setIndex(snapIndex)
}

    const delFromWishList = async ()=>{
        const wishListApt = await DataStore.query(WishList, (w)=> w.and(w => [
            w.userId.eq(dbUser?.id),
            w.apartmentId.eq(apartment?.id)
          ]))
          console.log('Del wishListApt : ', wishListApt)
          const deletedWishListApt = await DataStore.delete(wishListApt[0])
          console.log('deletedWishListApt', deletedWishListApt)
          const allWishListApt = await DataStore.query(WishList, (w)=> w.and(w => [
            w.userId.eq(dbUser?.id),
            w.apartmentId.eq(apartment?.id)
          ]))
          dispatch(fetchWishListSuccess(allWishListApt))
          setInWishList(false)
    }

    const addToWishList = async()=>{
        if(!dbUser){
           dispatch(showProfileAlert())
           return
        }
        const wishList = await DataStore.save(new WishList({
            userId : dbUser.id,
            apartmentId : apartment.id
          }))
          console.log('WishList Apt : ', wishList)
  
          const allWishListApt = await DataStore.query(WishList, (w)=> w.and(w => [
            w.userId.eq(dbUser?.id),
            w.apartmentId.eq(apartment?.id)
          ]))
          console.log('All WishList Apt : ', allWishListApt)
          dispatch(fetchWishListSuccess(allWishListApt))
          setInWishList(true)
    }

    useEffect(()=>{
       if(inWishList == 'null'){
        return
       }
       setTimeout(()=>{
            setInWishList('null')
       }, 2000)
    }, [inWishList])

   
   const navigateToPaymentDetails = ()=>{
        navigation.navigate('PaymentDetails', {apartment, hostData, totalAptView, wishlistIcon, apartmentImages: aptImages[0], starReview, totalRevLength, dbUser})
   }

   const saveAptWishList = ()=>{
       if(dbUser){
           setAptWishTrue(true)
           addToWishList()
       }else{
          setAptWishTrue(false)
          addToWishList()
       }
   }

  //  const handleShareScreenshot = () => {
  //   try{
  //     viewShotRef.current.capture().then(uri => {
  //       const shareOptions = {
  //         title: 'Share Apartment Details',
  //         message: `Check out this apartment! ID: ${apartmentId}`,
  //         url: uri,
  //         type: 'image/png',
  //       };
  //       Share.open(shareOptions).catch(err => console.log(err));
  //     });
  //   }catch(e){
  //      console.log('Error message : ', e.message)
  //   }
   
  // };

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
        <View style={styles.container}>
           <StatusBar style="light" backgroundColor={'rgba(0,0,0,0.5)'}/>
            {inWishList == 'null'? null : inWishList?
                    <View style={styles.wishlist}>
                    <View style={styles.wishListAlertCont}>
                            <Text style={styles.wishListAlertText}>Apartment added to wishlist</Text>
                            <AntDesign name="checkcircle" size={24} color="green" />
                    </View> 
                </View>
            : 
                <View style={styles.wishlist}>
                <View style={styles.wishListAlertCont}>
                        <Text style={styles.wishListAlertText}>Apartment removed from wishlist</Text>
                        <AntDesign name="checkcircle" size={24} color="#FF0000" />
                </View> 
            </View> 
            }
          <GestureHandlerRootView>
                <ScrollView ref={scrollViewRef} keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>
            <View style={styles.goBackIconCont}>
            <TouchableOpacity onPress={()=>{navigation.goBack()}} style={styles.goBackIconBtn}>
                <AntDesign name="arrowleft" size={20} color="black" />
            </TouchableOpacity>
               <View style={{flexDirection:'row', alignItems:'center'}}>
               <TouchableOpacity onPress={handleShareScreenshot}>
                  {(mod == 'main' || mod == 'horizontal') && !payment? <View style={styles.wishListDelCont}>
                                   <Entypo name="share" size={18} color="black" />
                                         </View> : null }
                </TouchableOpacity>
               <View style={{marginRight: 10}}>
                  {(mod == 'main' || mod == 'horizontal') && !payment? <View style={styles.wishListDelCont}>
                        {aptWishTrue? <AntDesign  onPress={()=>{setAptWishTrue(false); delFromWishList();}} name="heart" size={18} color="#FF0000"  /> : <AntDesign name="hearto" onPress={saveAptWishList} size={18} color="black"  /> }
                                         </View> : null }
                </View>
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
                <Text style={styles.apartmentDescText}>{apartment.apartmentDesc}</Text>
                <View style={{...styles.alignContainer, marginTop: 10}}>
                    <Entypo name="location-pin" size={24} color="#FF0000"/>
                    <Text style={styles.apartmentLocation}>{apartment.address}</Text>
                   
                   <View style={{flexDirection:'row', alignItems:'center', marginRight: 0}}>
                      <Feather name="eye" size={18} color="#4C4C4C" />
                      <Text style={{color: '#4C4C4C', fontSize: 13, marginLeft: 4, fontWeight:'500'}}>{payment? formatNumber(payment.TotalViews) + ' views' : views? formatNumber(views) +' views' : 0}</Text>
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
              <View style={styles.aptRoomImgCont} > 
                <View style={styles.roomImgStyle}>
                     <Ionicons name="bed-outline" size={40} color="#4C4C4C"  />
                </View>
              <Text style={styles.roomImgText}>{apartment.bedroom} bedroom</Text>
              </View>
              <View style={styles.aptRoomImgCont}>
              <View style={styles.roomImgStyle}>
                    <FontAwesome name="bathtub" size={40} color="#4C4C4C" />
              </View>
                <Text style={styles.roomImgText}>{apartment.bathroom} bathroom</Text>
              </View>
           </View>
                <ApartmentAmenities apartment={apartment}/>
                <ApartmentMap apartment={apartment}/>
                <AgentInfo starReview={starReview} totalRevLength={totalRevLength} apartment={apartment} hostData={payment? host : hostData}/>
                <View style={{paddingVertical: 15, borderBottomWidth: 1, borderBottomColor:'lightgray'}}>
                              <Text style={{fontSize: 18, fontWeight: '600', marginBottom: 10}}>Pricing</Text>
                              <View style={{flexDirection:'row', alignItems:'center'}}>
                                 <Text style={{color:'#4C4C4C', fontWeight:'500', fontSize: 14, marginRight:'auto'}}>Move in fee (one time initial deposit)</Text>
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
                <AgentReviews setScrollToBottom={setScrollToBottom} getAverageReviewStarLength={getAverageReviewStarLength} starReview={starReview} setTotalRevLength={setTotalRevLength} totalRevLength={totalRevLength} mode={mode} setMode={setMode} dbUser={dbUser} reviewPresent={reviewPresent} payment={payment} hostData={hostData} reviewStarLength={reviewStarLength} setReviewStarLength={setReviewStarLength} modalShow={modalShow} setModalShow={setModalShow} apartment={apartment} reviewText={reviewText} setReviewText={setReviewText} isTextInputFocused={isTextInputFocused} setIsTextInputFocused={setIsTextInputFocused} setReviewPresent={setReviewPresent}/>
             </View>
            </ScrollView>
          </GestureHandlerRootView>
            { payment? 
            <View style={styles.footerDetailCont}>
            <View style={{...styles.alignContainer, marginRight: 'auto'}}>
            <MaterialCommunityIcons name="seal" size={25} color="gold" style={{marginRight: 2}}/>
            <Text style={styles.paidText}>PAID</Text>
            </View>
            <View style={styles.alignContainer}>
                    <FontAwesome6 name="naira-sign" size={15} color="black" />
                     <Text><Text style={styles.leaseDurationText}>{apartment.formattedPrice}</Text> &#8226; <Text style={{fontWeight:'500', color:'#4C4C4C'}}>{apartment.leaseDuration}</Text></Text>
                  </View>
        </View> : <View style={styles.footerDetailCont}>
                                <View style={styles.alignContainer}>
                                  <FontAwesome6 name="naira-sign" size={15} color="black" />
                                  <Text><Text style={styles.leaseDurationText}>{apartment.formattedPrice}</Text> &#8226; {apartment.leaseDuration}</Text>
                                </View>
                                <Pressable onPress={navigateToPaymentDetails} style={styles.rentBtn}>
                                    <Text style={styles.rentText}>Rent</Text>
                                </Pressable>
                          
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
                       
           
              
             
                    { timeState && <Modal visible={true} onRequestClose={()=>{setCloseReview(true)}} transparent={true} presentationStyle='overFullScreen'>
                            <View style={{flex: 1, backgroundColor:'rgba(0,0,0,0.5)', justifyContent:'center', alignItems:"center"}}>
                                      <View style={{width: '80%', padding: 20, backgroundColor:'white', borderRadius: 20}}>
                                            <Pressable onPress={()=>{setCloseReview(true)}} style={{alignSelf:'flex-end', width:30, height: 30, backgroundColor:'lightgray', justifyContent:'center', alignItems:'center', borderRadius: 30}}>
                                                <AntDesign name="close" size={20} color="black" />
                                            </Pressable>
                                            <View>
                                              <Text style={{fontSize: 18, fontWeight: 600, textAlign:'center'}}>How would you rate your experience with {hostData.name}?</Text>
                                            </View>
                                            <ReviewStars reviewStarLength={reviewStarLength} setCloseReview={setCloseReview} mode={'paid'} setReviewStarLength={setReviewStarLength} setModalShow={setModalShow}/>
                                      </View>
                            </View>
                        </Modal>}
                       
                               
                              

                           
                       
                       
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
  wishlist: {
      elevation: 5,
      shadowColor: 'black',
      backgroundColor: 'white',
      position:'absolute',
      top: '80%',
      zIndex: 1,
      width: '80%',
      marginHorizontal: '10%',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
   },
   wishListAlertCont: {
    flexDirection:"row", 
    justifyContent:'center', 
    alignItems:'center'
   },
   wishListAlertText: {
    fontSize: 14, 
    fontWeight:'500', 
    letterSpacing: 0.5, 
    marginRight: 10
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
   wishListDelCont: {
    backgroundColor:'white', 
    marginLeft:10, 
    width: 35, 
    height: 35, 
    borderRadius: 35, 
    justifyContent:'center', 
    alignItems:'center'
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
    fontSize: 13, 
    color:'#4C4C4C',
    marginRight:"auto",
    width: '70%',
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
   footerDetailCont: {
    flexDirection:'row', 
    alignItems:'center', 
    justifyContent:'space-between',
    padding: 20, 
    backgroundColor:'white', 
    borderTopWidth: 1, 
    borderTopColor: 'lightgray'
   },
   paidText: {
    fontWeight:'bold', 
    fontSize: 20, 
    color:'#4C4C4C'
   },
   inLeaseCont: {
    paddingHorizontal: 40, 
    paddingVertical: 10, 
    backgroundColor:'#F52F57', 
    borderRadius: 5
   },
   inLeaseText: {
    color: 'white', 
    fontWeight:'500', 
    fontSize: 16
   },
   leaseDurationText: {
    fontWeight:'bold', 
    fontSize: 16
   },
   rentBtn: {
    paddingHorizontal: 40, 
    paddingVertical: 10, 
    backgroundColor:'#8B0000', 
    borderRadius: 5
   },
   rentText: {
    color: 'white', 
    fontWeight:'500', 
    fontSize: 16
   },
   profileAlertContainer: {
    backgroundColor: 'rgba(0,0,0,0.3)', 
    justifyContent:"center", 
    alignItems:'center'
},
profileAlertCont: {
    backgroundColor:"white", 
    padding: 50, 
    justifyContent:"center", 
    alignItems:'center', 
    borderRadius: 10
},
actionContainer: {
    flexDirection:'row', 
    alignItems:'center', 
    justifyContent:'space-between'
},
createProfileText: {
    fontSize: 20, 
    fontWeight: '500', 
    marginLeft:10, 
    textAlign:'center'
},
image: {
  width: 150, 
  height: 150, 
  borderRadius: 150, 
  marginVertical: 15
},
infoDescText: {
  fontWeight: '500', 
  color:'#4C4C4C', 
  fontSize: 16, 
  marginRight: 5
},
userProfileAlertContainer: {
  backgroundColor:'rgba(0,0,0,0.5)', 
  justifyContent:'center',
   alignItems:"center"
},
errorAlertLabel: {
  fontWeight: '600', 
  fontSize: 16, 
  marginBottom: 15
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
  width:'70%'
},
closeProfileAlert: {
  paddingVertical: 10, 
  paddingHorizontal: 15,
  borderRadius: 5
},
closeAlertText: {
  color:'white', 
  fontWeight: '600', 
  fontSize: 14
}
})

