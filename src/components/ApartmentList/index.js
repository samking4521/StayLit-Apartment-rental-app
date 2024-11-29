import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import {View, Text, StyleSheet, useWindowDimensions, Pressable, Alert} from 'react-native'
import { FontAwesome, FontAwesome6, AntDesign, MaterialCommunityIcons, Entypo, Feather} from '@expo/vector-icons'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { DataStore } from 'aws-amplify/datastore'
import {  Host, AllReviews, WishList, TotalViews } from '../../models'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { formatDistanceToNow } from 'date-fns';
import FastImage from 'react-native-fast-image';
import { Buffer } from 'buffer';
import { useSelector } from 'react-redux';

dayjs.extend(customParseFormat);

const URL = 'https://dr4jupy057c0c.cloudfront.net/'
const bucket = 'staylit-storage-1914deba97d11-staging'

const ApartmentList = React.memo(({apartment, mode, wishlistIcon, edit, wishListDbUser })=>{
    const dbUser = useSelector( state => state.user.dbUser)
    const {width, height } = useWindowDimensions()
    const [apartmentImages, setApartmentImages] = useState(null)
    const [hostData, setHostData] = useState(null)
    const navigation = useNavigation()
    const [starReview, setStarReview] = useState('')
    const [totalRevLength, setTotalRevLength] = useState('')
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
      getApartmentImages()
      getApartmentHostData()
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
    
  const formatDate = ()=>{
    const dat = dayjs(apartment.date, 'M/D/YYYY, h:mm:ss A')
    const timeElapsed = formatDistanceToNow(new Date(dat), { addSuffix: true });
   return timeElapsed
  }
 
  const getAverageReviewStarLength = async ()=>{
      const reviewArr = await DataStore.query(AllReviews, (r)=> r.hostID.eq(hostData.id))
      setTotalRevLength(reviewArr)
      console.log('reviewArr : ', reviewArr)
      if (reviewArr.length > 0) {
        const starLengths = reviewArr.reduce((a, review) => a + review.starLength, 0);
        setStarReview(starLengths / reviewArr.length);
    }
  }
  
     useEffect(()=>{
      if(hostData){
        getAverageReviewStarLength()
      }
     }, [hostData])

    const getApartmentHostData = async ()=>{
        const HostDataObj = await DataStore.query(Host, (h)=>h.id.eq(apartment.hostID))
        console.log('Host Data From Apartment : ', HostDataObj[0])
        setHostData(HostDataObj[0])
    }

   

    const getApartmentImages = async ()=>{  
      try{
      const imageRequest = JSON.stringify(
        {
          "bucket": bucket,
          "key": `public/apartmentCoverPhoto/${apartment.id}/coverPhoto.jpeg`,
          "edits": {
            "resize": {
              "width": mode == 'horizontal'? 300 : width,
              "height": mode == 'horizontal'? 250 : (35/100 * height),
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
        if(apartment.status !== 'AVAILABLE' && mode == 'wishlists'){
          Alert.alert(
            'Apartment Status',
            'This apartment is no longer available and cannot be accessed for further details',
            [
              {
                text: 'OK',
                onPress: () => console.log('OK Pressed'),
              },
            ],
            { cancelable: false }
          );
        }else{
          navigation.navigate('ApartmentsDetails', { apartment, views, hostData, wishlistIcon, mod : wishlistIcon? 'main' : mode})
        }
     }
  
    
   
     const deleteWishlistApartment = async (mode)=>{
            if (mode == 'del'){
              const wishListApt = await DataStore.query(WishList, (w)=> w.and(w => [
                w.userId.eq(dbUser?.id),
                w.apartmentId.eq(apartment?.id)
              ]))
              console.log('Del wishListApt : ', wishListApt)
              const deletedWishListApt = await DataStore.delete(wishListApt[0])
              console.log('deletedWishListApt', deletedWishListApt)
              const allWishListApt = await DataStore.query(WishList)
              setWishList(allWishListApt)
            }
            else{
              const wishListApt = await DataStore.query(WishList, (w)=> w.and(w => [
              w.userId.eq(wishListDbUser?.id),
              w.apartmentId.eq(apartment?.id)
            ]))
            console.log('Del wishListApt : ', wishListApt)
            const deletedWishListApt = await DataStore.delete(wishListApt[0])
            console.log('deletedWishListApt', deletedWishListApt)
            const allWishListApt = await DataStore.query(WishList)
            setWishList(allWishListApt)
          }
     }

   

   
   

    return(
        <Pressable onPress={NavigateToApartmentDetailsScreen} key={apartment.id} style={{flex: mode=='horizontal'? 0 : 1, marginTop: '5%', marginRight: mode == 'horizontal'? 10 : 0}}>
              { !apartmentImages ? <View style={{width: mode == 'horizontal'? 300: width, height: mode=='horizontal'? 250 : 300, borderRadius: mode == 'horizontal'? 10 : 0, backgroundColor:'lightgray'}}></View> :
               <FastImage source={{uri : apartmentImages,  priority: FastImage.priority.high}} style={{width: mode == 'horizontal'? 300: width, height: mode=='horizontal'? 250 : (35/100 * height), borderRadius: mode == 'horizontal'? 10 : 0 }} resizeMode={FastImage.resizeMode.cover}  />
           }
       {mode=='wishlists'? <Pressable onPress={deleteWishlistApartment} style={{...styles.deleteWishListAptStyle, display : edit? 'flex' : 'none'}}>
                                <Entypo name="cross" size={20} color="black" />
                           </Pressable>: null
       }
        <View style={{paddingHorizontal: 20}}>
        <View style={styles.firstAptDataHeaderCont}>
            <Text style={styles.aptTitleStyle}>{apartment.apartmentTitle}</Text>
            <View style={styles.alignContainer}>
                <FontAwesome name="star" size={14} color="black" style={{marginRight: 5}}/>
                <Text style={{fontWeight:'600'}}>{totalRevLength.length>=2? Number(starReview).toFixed(1) : 'New'}</Text>
            </View>
        </View>
        <Text style={styles.aptLocation}>{apartment.city} &#8226; {apartment.state} &#8226; {apartment.country}</Text>
        <View style={{...styles.alignContainer, justifyContent:'space-between'}}>
            <Text style={styles.dateText}>{formatDate()}</Text>
             {mode == 'wishlists'?<View style={{...styles.alignContainer, justifyContent:'center'}}>
                                        { apartment.status == 'AVAILABLE'? <> 
                                                                                     <MaterialCommunityIcons name="octagon" size={20} color="green"/>
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
                                  </View> : null}
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
    </Pressable>
    )
})

export default ApartmentList

const styles = StyleSheet.create({
 
  deleteWishListAptStyle: {
    position: 'absolute', 
    top: 10, 
    left : 10 , 
    width: 30, 
    height: 30, 
    borderRadius: 30, 
    backgroundColor: 'white', 
    justifyContent: 'center', 
    alignItems: 'center'
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
    fontSize: 16, 
    fontWeight: '400', 
    marginRight: 'auto', 
    paddingRight: 30, 
    width: '70%'
  },
  alignContainer: {
    flexDirection: 'row', 
    alignItems:'center'
  },
  aptLocation: {
    fontSize: 14, 
    color: '#4C4C4C'
  },
  dateText: {
    fontSize: 14, 
    color: '#4C4C4C'
  },
  aptStatusText: {
    fontSize: 14, 
    color: '#4C4C4C', 
    marginLeft: 2, 
    fontWeight:'500'
  },
  footerLabelData: { 
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