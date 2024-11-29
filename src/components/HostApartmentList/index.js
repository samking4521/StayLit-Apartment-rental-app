import React from 'react';
import { useState, useEffect } from 'react';
import {View, Text, StyleSheet, useWindowDimensions, Pressable, Alert, Modal} from 'react-native'
import { FontAwesome6, AntDesign, MaterialCommunityIcons, Entypo, Feather} from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { list, remove } from 'aws-amplify/storage';
import { DataStore } from 'aws-amplify/datastore'
import { Apartment, Review, WishList, RentStatus, Payment, TotalViews, UniqueViews, PaymentHistory } from '../../models'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useAuthContext } from '../../Context/hostContext';
import { formatDistanceToNow } from 'date-fns';
import FastImage from 'react-native-fast-image';
import { Buffer } from 'buffer';
import { StatusBar } from 'expo-status-bar';
import { useSelector } from 'react-redux';

dayjs.extend(customParseFormat);

const URL = 'https://dr4jupy057c0c.cloudfront.net/'
const bucket = 'staylit-storage-1914deba97d11-staging'

const HostApartmentList = React.memo(({apartment, setDeletingAptModal})=>{
    const dbHost = useSelector(state => state.host.dbHost)
    const {width, height } = useWindowDimensions()
    const [index, setIndex] = useState(0);
    const [apartmentImages, setApartmentImages] = useState(null)
    const navigation = useNavigation()
    const [showEditDelCont, setShowEditDelCont] = useState(false)
    const [payment, setPayment] = useState(null)
    const [views, setViews] = useState(null)

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
      return num.toString();
    };
    
    
    useEffect(()=>{
      if(!apartment){
          return
      }
      getAllPaidApartments()
      getApartmentImages()
    }, [apartment])

    useEffect(()=>{
        if(apartment){
          getAndUpdateTotalViewCount()
        }
    }, [apartment])

      const getAndUpdateTotalViewCount = async ()=>{
        try{
          const getTotalViewsObj = await DataStore.query(TotalViews, (t)=> t.apartmentID.eq(apartment.id))
          console.log('getTotalViewsObj on apartmentList : ', getTotalViewsObj)
          setViews(getTotalViewsObj[0]?.finalViewCount)
        }catch(e){
            console.log('Error in getAndUpdateTotalViewCount ApartmentList', e.message)
        }
          
      }

    const getAllPaidApartments = async ()=>{
       const paidApts = await DataStore.query(Payment, (p)=> p.apartmentID.eq(apartment.id))
       console.log('paid Apts : ', paidApts[0])
       setPayment(paidApts[0])
    }
    
  const formatDate = ()=>{
    const date = dayjs(apartment.date, 'M/D/YYYY, h:mm:ss A')
    const timeElapsed = formatDistanceToNow(new Date(date), { addSuffix: true });
   return timeElapsed
  }

    const getApartmentImages = ()=>{  
      try{
      const imageRequest = JSON.stringify(
        {
          "bucket": bucket,
          "key": `public/apartmentCoverPhoto/${apartment.id}/coverPhoto.jpeg`,
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
      setApartmentImages(`${URL}${encoded}`)
      }catch(e){
        console.log('Error Retrieving Images List : ', e.message);
      }
    }
    
     const NavigateToApartmentDetailsScreen = ()=>{
     
        navigation.navigate('ApartmentsDetails', { apartment, views , dbHost, payment})
   
     }
  
   const navigateToApartmentDetailsForm = ()=>{
       navigation.navigate('ApartmentDetailsForm', {
           mode : 'hostUpdateForm',
           apartment
       })
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
           onPress: () => {setDeletingAptModal(true); deleteApartment()}
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
        if(wishListApt.length>=1){
              // Delete Wishlist
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
        setDeletingAptModal(false)
 }

      const UpdatePaidApartmentStatus = async()=>{

          const getUserAptReview = await DataStore.query(Review, (r)=> r.apartmentID.eq(apartment.id))
          console.log('getUserAptReview : ', getUserAptReview[0])
          if(getUserAptReview[0]){
              const delUserAptReview = await DataStore.delete(getUserAptReview[0])
              console.log('delUserAptReview : ', delUserAptReview)
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
        
          const apartmentToBeUpdated = await DataStore.query(Apartment, (a)=> a.id.eq(apartment.id))
          console.log('apartmentToBeUpdated : ', apartmentToBeUpdated)
          const updatedAprtStatus = await DataStore.save(Apartment.copyOf(apartmentToBeUpdated[0], (updated)=>{
              updated.status = RentStatus.AVAILABLE,
              updated.uniqueViewCount = null
          }))
          console.log('Update Apartment Status To Available Successful : ', updatedAprtStatus)

          if(payment){
            const deletePaymentOnApt = await DataStore.delete(payment)
            console.log('deletePaymentOnApt : ', deletePaymentOnApt)
            const checkAptPayment = await DataStore.query(Payment, (p)=> p.apartmentID.eq(apartment.id))
            setPayment(checkAptPayment[0])
          }
  
      }

      const UpdateToAvailableApartmentStatus = async ()=>{
          const apartmentToBeUpdated = await DataStore.query(Apartment, (a)=> a.id.eq(apartment.id))
          console.log('apartmentToBeUpdated : ', apartmentToBeUpdated)
          const updatedAprtStatus = await DataStore.save(Apartment.copyOf(apartmentToBeUpdated[0], (updated)=>{
              updated.status = RentStatus.AVAILABLE
          }))
          console.log('Update Apartment Status To Available Successful : ', updatedAprtStatus)
      }

      const UpdateToUnavailableApartmentStatus = async()=>{
        const apartmentToBeUpdated = await DataStore.query(Apartment, (a)=> a.id.eq(apartment.id))
        console.log('apartmentToBeUpdated : ', apartmentToBeUpdated)
        const updatedAprtStatus = await DataStore.save(Apartment.copyOf(apartmentToBeUpdated[0], (updated)=>{
             updated.status = RentStatus.UNAVAILABLE
        }))
        console.log('Update Apartment Status To UnAvailable Successful : ', updatedAprtStatus)
      }

   const UpdateApartmentStatus = async ()=>{
      if(apartment.status == 'AVAILABLE'){
        Alert.alert(
          'Change Apartment Status',
          'Are you sure you want to change the status of this available apartment to unavailable? Making it unavailable will remove it from the visible listings and will not be available for booking by users.',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            { text: 'OK', onPress: () => UpdateToUnavailableApartmentStatus()},
          ],
          { cancelable: false }
        );
          
      }
      else if(apartment.status == 'PAID'){
        Alert.alert(
          'Change Apartment Status',
          'Are you sure you want to change the status of this paid apartment to available? Making it available will display it as visible and available for booking by users.',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            { text: 'Continue', onPress: () => UpdatePaidApartmentStatus()},
          ],
          { cancelable: false }
        );
        
      }
      else{
        Alert.alert(
          'Change Apartment Status',
          'Are you sure you want to change the status of this unavailable apartment to available? Making it available will display it as visible and available for booking by users.',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            { text: 'OK', onPress: () => UpdateToAvailableApartmentStatus()},
          ],
          { cancelable: false }
        );
        
      }
   }

  

    return(
        <Pressable onPress={NavigateToApartmentDetailsScreen} key={apartment.id} style={{flex: 1, marginTop: '5%'}}>
              { !apartmentImages ? <View style={{width: width, height: 300, borderRadius: 0, backgroundColor:'lightgray'}}></View> :
               <FastImage key={index} source={{uri : apartmentImages,  priority: FastImage.priority.high}} style={{width: width, height: (35/100 * height)}} resizeMode={FastImage.resizeMode.cover}  />
           }
      
      
       <Entypo  onPress={()=>{setShowEditDelCont(!showEditDelCont)}} name="dots-three-vertical" size={30} color="white" style={styles.heartStyle}/>
        <View style={{paddingHorizontal: 20}}>
        <View style={styles.firstAptDataHeaderCont}>
            <Text style={styles.aptTitleStyle}>{apartment.apartmentTitle}</Text>
        </View>
        <Text style={styles.aptLocation}>{apartment.city} &#8226; {apartment.state} &#8226; {apartment.country}</Text>
        <View style={{...styles.alignContainer, justifyContent:'space-between'}}>
            <Text style={styles.dateText}>{formatDate()}</Text>
             <View style={{...styles.alignContainer, justifyContent:'center'}}>
                                        { apartment.status == 'AVAILABLE'? <> 
                                                                                     <MaterialCommunityIcons name="octagon" size={14} color="green"/>
                                                                                      <Text style={styles.aptStatusText}>Available</Text>
                                                                              </> : apartment.status == 'PAID'?

                                                                                                                  <>
                                                                                                                    <MaterialCommunityIcons name="seal" size={25} color="gold" style={{marginRight: 2}}/>
                                                                                                                    <Text style={styles.aptStatusText}>PAID</Text>
                                                                                                                  </> :
                                                                                                                    <>       
                                                                                                                          <MaterialCommunityIcons name="octagon" size={20} color="red" />
                                                                                                                          <Text style={styles.aptStatusText}>Unavailable</Text>
                                                                                                                    </>
                                                                    }
            </View>
        </View>
        <View style={styles.footerLabelData}>
          <View style={{flexDirection:'row', alignItems:'center', marginRight:'auto'}}>
              <FontAwesome6 name="naira-sign" size={10} color="black" />
                <Text style={styles.aptPrice}>{apartment.formattedPrice} </Text>
                <Text style={styles.aptDurationText}>{apartment.leaseDuration}</Text>
            </View>
           <View style={{flexDirection:'row', alignItems:'center'}}>
                <Feather name="eye" size={16} color="#4C4C4C" />
                <Text style={{color: '#4C4C4C', fontWeight: '500', fontSize: 14, marginLeft: 4}}>{views? formatNumber(views) +' views' : 0}</Text>
           </View>
          </View>
        </View>
        <Modal visible={showEditDelCont} onRequestClose={()=>{setShowEditDelCont(false)}} presentationStyle='overFullScreen' transparent={true}>
           <StatusBar style='light' backgroundColor='rgba(0,0,0,0.5)'/>
            <View style={{flex: 1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.5)'}}>
            <View style={styles.editAptCont}>
                <View style={{padding: 10}}>
                <Pressable onPress={()=>{setShowEditDelCont(false)}} style={{alignSelf:'flex-end', width: 35, height: 35, borderRadius : 35, backgroundColor:'rgba(0,0,0,0.5)', justifyContent:'center', alignItems:'center'}}>
                        <AntDesign name="close" size={20} color="white" />
                 </Pressable>
                </View>
                 
                  { (apartment.status !== 'PAID') && <Pressable onPress={()=>{navigateToApartmentDetailsForm(); setShowEditDelCont(false)}} style={styles.editAptStyle}>
                      <Text style={styles.editAptText}>Edit Apartment</Text>
                      <AntDesign name="edit" size={20} color="black" />
                  </Pressable>}
                { (apartment.status !== 'PAID') && <Pressable onPress={()=>{showAlert(); setShowEditDelCont(false)}} style={styles.editAptStyle}>
                    <Text style={{...styles.editAptText, color:'red'}}>Delete Apartment</Text>
                    <AntDesign name="delete" size={20} color="black" />
                  </Pressable>}
                  <Pressable onPress={()=>{UpdateApartmentStatus(); setShowEditDelCont(false)}} style={styles.editAptStyle}>
                    <Text style={styles.editAptText}>{apartment.status == 'AVAILABLE'? 'Make status unavailable' : 'Make status available' }</Text>
                    {apartment.status == 'AVAILABLE'?  <MaterialCommunityIcons name="octagon" size={20} color="red" /> : <MaterialCommunityIcons name="octagon" size={25} color="green" />}
                  </Pressable>
        </View>
            </View>
       
        </Modal>
    </Pressable>
    )
})

export default HostApartmentList

const styles = StyleSheet.create({
  editAptCont: {
    borderRadius: 10,
    backgroundColor: 'white',
    width: '70%'
  },
  editAptStyle: {
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 10,
    borderTopWidth: 1,
    borderTopColor:'gray'
  },
  editAptText: {
    fontSize: 16,
    paddingLeft: 5, 
    fontWeight: '500',
    marginRight:'auto'
  },
  heartStyle: {
    position: 'absolute', 
    top: 20, 
    left: '88%'
  },
  firstAptDataHeaderCont: {
    flexDirection: 'row', 
    alignItems:'center',  
    marginTop: 5
  },
  aptTitleStyle: {
    fontSize: 17, 
    fontWeight: '400'
  },
  alignContainer: {
    flexDirection: 'row', 
    alignItems:'center'
  },
  aptLocation: {
    fontSize: 14, 
    color: '#4C4C4C', 
    marginTop: 2
  },
  dateText: {
    fontSize: 14, 
    color: '#4C4C4C', 
  },
  aptStatusText: {
    fontSize: 14, 
    color: '#4C4C4C', 
    marginLeft: 2
  },
  footerLabelData: {
    marginTop: 4, 
    flexDirection: 'row', 
    alignItems:'center'
  },
  aptPrice: {
    color:"black", 
    fontWeight: '600', 
    fontSize: 12
  },
  aptDurationText: {
    fontSize: 12, 
    color:'#4C4C4C'
  }
})