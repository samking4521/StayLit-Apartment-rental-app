import { useState, useEffect, useRef } from 'react'
import {View, Text, Modal, Image, StyleSheet, ActivityIndicator, useWindowDimensions, TextInput, Pressable} from 'react-native'
import Header from './header'
import ApartmentsContainer from './apartmentsContainer.js';
import FilterScreen from './modal'
import { Apartment, User, WishList, PaymentHistory, ObservePayment, CardDetails } from '../../models';
import { StatusBar } from 'expo-status-bar'
import { DataStore } from 'aws-amplify/datastore'
import { AntDesign, Entypo} from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useSelector, useDispatch } from 'react-redux';
import { dontShowProfileAlert } from '../../Redux/showProfile/showProfileActions';
import { useUserAuthContext } from '../../Context/userContext';
import { fetchUserCardSuccess } from '../../Redux/userCardFound/userCardFoundActions';
import { fetchDbUserSuccess, fetchDbUserFailure } from '../../Redux/dbUser/dbUserActions';
import { fetchWishListSuccess } from '../../Redux/wishList/wishListActions';
import { fetchPaidApartments } from '../../Redux/paymentHistory/paymentActions';
import { fetchObservePayment } from '../../Redux/observePayment/observePaymentActions.js';

const HomeScreen = ()=>{
    const { userAuth } = useUserAuthContext()
    const dbUser = useSelector( state => state.user.dbUser)
    const showProfileAlert = useSelector( state => state.profile.showProfile)
    const dispatch = useDispatch()
    const [modalVisible, setModalVisible] = useState(false);
    const [apartments, setApartments] = useState(null)
    const [virtualApartments, setVirtualApartments] = useState(null)
    const navigation = useNavigation()
    const [arr, setArr] = useState([])
    const [typeOfPlace, setTypeOfPlace] = useState('All')
    const [runningWater, setRunningWater] = useState(null)
    const [electricity, setElecricity] = useState(null)
    const [security, setSecurity] = useState(null)
    const [wardrobe, setWardrobe] = useState(null)
    const [pop, setPop] = useState(null)
    const [parkingSpace, setParkingSpace] = useState(null)
    const [minPriceValue, setMinPriceValue] = useState('All')
    const [maxPriceValue, setMaxPriceValue] = useState('All')
    const [amenityVal, setAmenityVal] = useState(null)
    const [amenityFalseVal, setAmenityFalseVal] = useState(null)
    const [locationModal, setLocationModal] = useState(false)
    const [allApartments, setAllApartments] = useState(null)
    const [showPlaceValue, setShowPlaceValue] = useState(null)
    const [isLoading, setIsLoading] = useState(null);
    const [placeNotFound, setPlaceNotFound] = useState(null)
    const [theAptTitle, setTheAptTitle] = useState(null)
    const {width, height} = useWindowDimensions()
    const [aptSearchId, setAptSearchId] = useState(null)
    const autocompleteRef = useRef()
    const aptIDTextInputRef = useRef()
    
     const API_KEY = `AIzaSyCMHvsm1pHmyT3kopYOYJhUhPTZpikpX5M`

     const getUserCardDetails = async () => {
        const getCardDetails = await DataStore.query(CardDetails, (c) => c.userID.eq(dbUser.id));
        dispatch(fetchUserCardSuccess(getCardDetails[0]))
    }
    
    const checkObservePayment = async () => {
      const theObsPaymentObj = await DataStore.query(ObservePayment, (o) => o.userID.eq(dbUser.id));
        dispatch(fetchObservePayment(theObsPaymentObj[0]))
    }
    
    const getPaidApartments = async () => {
      const paidApt = await DataStore.query(PaymentHistory, (p) => p.userID.eq(dbUser.id));
        dispatch(fetchPaidApartments(paidApt))
    }
    
    
    const getUserWishListApartments = async () => {
      const allWishListApt = await DataStore.query(WishList, (w) => w.userId.eq(dbUser.id));
       dispatch(fetchWishListSuccess(allWishListApt))
    }
    
    useEffect(() => {
      if (!dbUser){
        return
      }
      getUserCardDetails();
    }, [dbUser]);
    
    useEffect(() => {
      if (!dbUser){
        return
      }
      checkObservePayment();
    }, [dbUser]);
    
    useEffect(() => {
      if (!dbUser){
        return
      }
      getPaidApartments();
    }, [dbUser]);
    
    useEffect(() => {
      if (!dbUser){
        return
      }
      getUserWishListApartments();
        const subscription = DataStore.observe(WishList).subscribe(msg => {
            console.log("Wishlist subscription message:", msg);
            if(msg.opType == 'DELETE'){
            console.log('Wishlist delete update')
            getUserWishListApartments()
          
            }
            if(msg.opType == 'INSERT'){
                console.log('Wishlist insert update')
                getUserWishListApartments()
             
                }
            if(msg.opType == 'UPDATE'){
                console.log('Wishlist update update')
                getUserWishListApartments()
            
                }
      
          return () => {
            subscription.unsubscribe();
          }
      });
      return () => subscription.unsubscribe();
    }, [dbUser]);
    
    
      // Fetch the user from the database and observe changes
      const getDbUser = async () => {
        try {
          const theUser = await DataStore.query(User, (u) => u.sub.eq(userAuth));
          const userData = theUser[0];
          if (userData) {
            dispatch(fetchDbUserSuccess(userData))
          }else{
            dispatch(fetchDbUserFailure(false))
          }
        } catch (err) {
          console.log('Error Getting DbUser:', err.message);
        }
      }
    
      useEffect(() => {
        if (!userAuth){
          return
        };
    
        getDbUser();
    
      }, [userAuth]);
    
    useEffect(()=>{
        ( async () => { 
         const apartmentsData = await DataStore.query(Apartment, (a)=> a.status.eq('AVAILABLE'))
         console.log('Apartment Fetched Successsfully : ', apartmentsData)
         setAllApartments(apartmentsData)
         }
         )()
         }, [apartments])

    const getApartmentByLocation = async (placeVal)=>{
       

            if(placeVal == 'Abuja' || placeVal == 'Federal Capital Territory' || placeVal == 'Abuja (F.c.t.)'){
                placeVal = 'Abuja Federal Capital Territory'
            }

             
            const getApartmentsByPlaceVal = await DataStore.query(Apartment, (a) =>
                a.or(a => [
                  a.city.contains(placeVal),
                  a.state.contains(placeVal),
                  a.country.contains(placeVal)
                ]));

            const filterAptByLocation = getApartmentsByPlaceVal.filter((apt)=>{
                return(
                        apt.status == 'AVAILABLE'
                )
            })

            setApartments(filterAptByLocation)
            setLocationModal(false)
            setShowPlaceValue(placeVal)
    }
      
    const getApartmentByAptSearchID = async(val)=>{
         const aptID = val.trim()
         const getTheApt = await DataStore.query(Apartment, (a) =>
            a.and(a => [
              a.status.eq('AVAILABLE'),
              a.id.eq(aptID)
            ]))
            console.log('The Apartment : ', getTheApt)
            setApartments(getTheApt)
            setTheAptTitle(getTheApt[0]?.apartmentTitle)
            setLocationModal(false)
            setShowPlaceValue(aptID)
    }

    const clearAddressText = ()=>{
      autocompleteRef.current?.clear()
      aptIDTextInputRef.current?.clear()
      setIsLoading(null)
      setAptSearchId(null)
    }
  
    useEffect(()=>{
        if(!apartments){
            return
        }
        setVirtualApartments(apartments)
    }, [apartments])
    
     const getChkBoxVal = (val)=>{
        setArr(prevArr => {
            if(val){
                var newArr = [...prevArr, val];
            }else{
                var newArr = [...prevArr];
            }
            getNewlyFilteredApt(newArr);
            return newArr;
        });
        setAmenityVal(null)
     }
    
     const getApartmentsFromNewArrApts = (aptArr, newArr)=>{
            let realAptArr = aptArr
            for(val of newArr){
                if(val == 'water'){
                    const aptment = realAptArr.filter((apt)=>{
                        return apt.water == 'water'
                    })
                     realAptArr =  aptment
                }
                if(val == 'electricity'){
                    const aptment = realAptArr.filter((apt)=>{
                        return apt.electricity == 'electricity'
                    })
                    realAptArr =  aptment
                }
                if(val == 'pop'){
                    const aptment = realAptArr.filter((apt)=>{
                        return apt.pop == 'pop'
                    })
                    realAptArr = aptment
                }
                if(val == 'wardrobe'){
                    const aptment = realAptArr.filter((apt)=>{
                        return apt.wardrobe == 'wardrobe'
                    })
                    console.log('aptment : ', aptment)
                    realAptArr =  aptment
                }
                if(val == 'security'){
                    const aptment = realAptArr.filter((apt)=>{
                        return apt.security == 'security'
                    })
                    realAptArr =  aptment
                }
                if(val == 'parkingSpace'){
                    const aptment = realAptArr.filter((apt)=>{
                        return apt.parkingSpace == 'parkingSpace'
                    })
                    realAptArr =  aptment
                }


            }
          
            console.log('realAptArr : ', realAptArr)
            setVirtualApartments(realAptArr)
     }

     useEffect(()=>{
        if(!runningWater && !electricity && !pop && !security && !wardrobe && !parkingSpace){
              setArr([])
              setAmenityFalseVal(null)
         }
      }, [runningWater, electricity, pop, security, wardrobe, parkingSpace])
  
      const getNewlyFilteredApt = async (newArr)=>{
           if(newArr[0] == 'water'){
               if(typeOfPlace == 'All' && minPriceValue=='All' && maxPriceValue == 'All'){
                const virtualApt = apartments.filter((apt)=>{
                    return apt.water == 'water'
            })
                
                getApartmentsFromNewArrApts(virtualApt, newArr)
               }
               if(typeOfPlace == 'All' && minPriceValue!=='All' && maxPriceValue!=='All'){
                const virtualApt = apartments.filter((apt)=>{
                    const minPriceVal = parseInt(minPriceValue, 10)
                    const maxPriceVal = parseInt(maxPriceValue, 10)
                    return apt.water == 'water' && apt.price >= minPriceVal && apt.price <= maxPriceVal
                })
                getApartmentsFromNewArrApts(virtualApt, newArr)
               }
               if(typeOfPlace !== 'All' && minPriceValue!=='All' && maxPriceValue!=='All'){
                const virtualApt = apartments.filter((apt)=>{
                    const minPriceVal = parseInt(minPriceValue, 10)
                    const maxPriceVal = parseInt(maxPriceValue, 10)
                    return apt.placeType == typeOfPlace && apt.water == 'water' && apt.price >= minPriceVal && apt.price <= maxPriceVal
                })
                getApartmentsFromNewArrApts(virtualApt, newArr)
               }
               if(typeOfPlace !== 'All' && minPriceValue=='All' && maxPriceValue=='All'){
                const virtualApt = apartments.filter((apt)=>{
                    return apt.placeType == typeOfPlace && apt.water == 'water'
                })
                getApartmentsFromNewArrApts(virtualApt, newArr)
               }
               
                 }
           if(newArr[0] == 'electricity'){
            if(typeOfPlace == 'All' && minPriceValue=='All' && maxPriceValue == 'All'){
                const virtualApt = apartments.filter((apt)=>{
                    return apt.electricity == 'electricity'
            })
                
                getApartmentsFromNewArrApts(virtualApt, newArr)
               }
               if(typeOfPlace == 'All' && minPriceValue!=='All' && maxPriceValue!=='All'){
                const virtualApt = apartments.filter((apt)=>{
                    const minPriceVal = parseInt(minPriceValue, 10)
                    const maxPriceVal = parseInt(maxPriceValue, 10)
                    return apt.electricity == 'electricity' && apt.price >= minPriceVal && apt.price <= maxPriceVal
                })
                getApartmentsFromNewArrApts(virtualApt, newArr)
               }
               if(typeOfPlace !== 'All' && minPriceValue!=='All' && maxPriceValue!=='All'){
                const virtualApt = apartments.filter((apt)=>{
                    const minPriceVal = parseInt(minPriceValue, 10)
                    const maxPriceVal = parseInt(maxPriceValue, 10)
                    return apt.placeType == typeOfPlace && apt.electricity == 'electricity' && apt.price >= minPriceVal && apt.price <= maxPriceVal
                })
                getApartmentsFromNewArrApts(virtualApt, newArr)
               }
               if(typeOfPlace !== 'All' && minPriceValue=='All' && maxPriceValue=='All'){
                const virtualApt = apartments.filter((apt)=>{
                    return apt.placeType == typeOfPlace && apt.electricity == 'electricity'
                })
                getApartmentsFromNewArrApts(virtualApt, newArr)
               }
               
           }
           if(newArr[0] == 'pop'){
            if(typeOfPlace == 'All' && minPriceValue=='All' && maxPriceValue == 'All'){
                const virtualApt = apartments.filter((apt)=>{
                    return apt.pop == 'pop'
            })
                
                getApartmentsFromNewArrApts(virtualApt, newArr)
               }
               if(typeOfPlace == 'All' && minPriceValue!=='All' && maxPriceValue!=='All'){
                const virtualApt = apartments.filter((apt)=>{
                    const minPriceVal = parseInt(minPriceValue, 10)
                    const maxPriceVal = parseInt(maxPriceValue, 10)
                    return apt.pop == 'pop' && apt.price >= minPriceVal && apt.price <= maxPriceVal
                })
                getApartmentsFromNewArrApts(virtualApt, newArr)
               }
               if(typeOfPlace !== 'All' && minPriceValue!=='All' && maxPriceValue!=='All'){
                const virtualApt = apartments.filter((apt)=>{
                    const minPriceVal = parseInt(minPriceValue, 10)
                    const maxPriceVal = parseInt(maxPriceValue, 10)
                    return apt.placeType == typeOfPlace && apt.pop == 'pop' && apt.price >= minPriceVal && apt.price <= maxPriceVal
                })
                getApartmentsFromNewArrApts(virtualApt, newArr)
               }
               if(typeOfPlace !== 'All' && minPriceValue=='All' && maxPriceValue=='All'){
                const virtualApt = apartments.filter((apt)=>{
                    return apt.placeType == typeOfPlace && apt.pop == 'pop'
                })
                getApartmentsFromNewArrApts(virtualApt, newArr)
               }
           }
           if(newArr[0] == 'security'){
            if(typeOfPlace == 'All' && minPriceValue=='All' && maxPriceValue == 'All'){
                const virtualApt = apartments.filter((apt)=>{
                    return apt.security == 'security'
            })
                getApartmentsFromNewArrApts(virtualApt, newArr)
               }
               if(typeOfPlace == 'All' && minPriceValue!=='All' && maxPriceValue!=='All'){
                const virtualApt = apartments.filter((apt)=>{
                    const minPriceVal = parseInt(minPriceValue, 10)
                    const maxPriceVal = parseInt(maxPriceValue, 10)
                    return apt.security == 'security' && apt.price >= minPriceVal && apt.price <= maxPriceVal
                })
                getApartmentsFromNewArrApts(virtualApt, newArr)
               }
               if(typeOfPlace !== 'All' && minPriceValue!=='All' && maxPriceValue!=='All'){
                const virtualApt = apartments.filter((apt)=>{
                    const minPriceVal = parseInt(minPriceValue, 10)
                    const maxPriceVal = parseInt(maxPriceValue, 10)
                    return apt.placeType == typeOfPlace && apt.security == 'security' && apt.price >= minPriceVal && apt.price <= maxPriceVal
                })
                getApartmentsFromNewArrApts(virtualApt, newArr)
               }
               if(typeOfPlace !== 'All' && minPriceValue=='All' && maxPriceValue=='All'){
                const virtualApt = apartments.filter((apt)=>{
                    return apt.placeType == typeOfPlace && apt.security == 'security'
                })
                getApartmentsFromNewArrApts(virtualApt, newArr)
               }
           }
           if(newArr[0] == 'wardrobe'){
            if(typeOfPlace == 'All' && minPriceValue=='All' && maxPriceValue == 'All'){
                const virtualApt = apartments.filter((apt)=>{
                    return apt.wardrobe == 'wardrobe'
            })
                
                getApartmentsFromNewArrApts(virtualApt, newArr)
               }
               if(typeOfPlace == 'All' && minPriceValue!=='All' && maxPriceValue!=='All'){
                const virtualApt = apartments.filter((apt)=>{
                    const minPriceVal = parseInt(minPriceValue, 10)
                    const maxPriceVal = parseInt(maxPriceValue, 10)
                    return apt.wardrobe == 'wardrobe' && apt.price >= minPriceVal && apt.price <= maxPriceVal
                })
                getApartmentsFromNewArrApts(virtualApt, newArr)
               }
               if(typeOfPlace !== 'All' && minPriceValue!=='All' && maxPriceValue!=='All'){
                const virtualApt = apartments.filter((apt)=>{
                    const minPriceVal = parseInt(minPriceValue, 10)
                    const maxPriceVal = parseInt(maxPriceValue, 10)
                    return apt.placeType == typeOfPlace && apt.wardrobe == 'wardrobe' && apt.price >= minPriceVal && apt.price <= maxPriceVal
                })
                getApartmentsFromNewArrApts(virtualApt, newArr)
               }
               if(typeOfPlace !== 'All' && minPriceValue=='All' && maxPriceValue=='All'){
                const virtualApt = apartments.filter((apt)=>{
                    return apt.placeType == typeOfPlace && apt.wardrobe == 'wardrobe'
                })
                getApartmentsFromNewArrApts(virtualApt, newArr)
               }
           }
           if(newArr[0] == 'parkingSpace'){
            if(typeOfPlace == 'All' && minPriceValue=='All' && maxPriceValue == 'All'){
                const virtualApt = apartments.filter((apt)=>{
                    return apt.parkingSpace == 'parkingSpace'
            })
                
                getApartmentsFromNewArrApts(virtualApt, newArr)
               }
               if(typeOfPlace == 'All' && minPriceValue!=='All' && maxPriceValue!=='All'){
                const virtualApt = apartments.filter((apt)=>{
                    const minPriceVal = parseInt(minPriceValue, 10)
                    const maxPriceVal = parseInt(maxPriceValue, 10)
                    return apt.parkingSpace == 'parkingSpace' && apt.price >= minPriceVal && apt.price <= maxPriceVal
                })
                getApartmentsFromNewArrApts(virtualApt, newArr)
               }
               if(typeOfPlace !== 'All' && minPriceValue!=='All' && maxPriceValue!=='All'){
                const virtualApt = apartments.filter((apt)=>{
                    const minPriceVal = parseInt(minPriceValue, 10)
                    const maxPriceVal = parseInt(maxPriceValue, 10)
                    return apt.placeType == typeOfPlace && apt.parkingSpace == 'parkingSpace' && apt.price >= minPriceVal && apt.price <= maxPriceVal
                })
                getApartmentsFromNewArrApts(virtualApt, newArr)
               }
               if(typeOfPlace !== 'All' && minPriceValue=='All' && maxPriceValue=='All'){
                const virtualApt = apartments.filter((apt)=>{
                    return apt.placeType == typeOfPlace && apt.parkingSpace == 'parkingSpace'
                })
                getApartmentsFromNewArrApts(virtualApt, newArr)
               }
           }
       
      }
     const getChkBoxValFalse = (val)=>{
            const newArr = arr.filter((a)=>{
                return a !== val
            })
            console.log('newArr : ', newArr)
            getNewlyFilteredApt(newArr)
            setArr(newArr)
            setAmenityFalseVal(null)
     }
  
    useEffect(()=>{
        fetchApartments()
        const subscription = DataStore.observe(Apartment).subscribe(msg => {
            console.log("DataStore subscription message:", msg);
            if(msg.opType == 'DELETE'){
            console.log('subscription delete update')
            fetchApartments()
            }
            if(msg.opType == 'INSERT'){
                console.log('subscription insert update')
                fetchApartments()
                }
            if(msg.opType == 'UPDATE'){
                console.log('subscription update update')
                fetchApartments()
                }
          });
      
          return () => {
            subscription.unsubscribe();
          }
       }, [])

         useEffect(()=>{
            fetchVirtualApartments()
         }, [typeOfPlace, runningWater, electricity, security, wardrobe, pop, parkingSpace, minPriceValue, maxPriceValue])

    
    const fetchVirtualApartments = async()=>{
        try{
            if(typeOfPlace == 'All' && minPriceValue == 'All' && maxPriceValue == 'All' &&  (!runningWater && !electricity && !security && !wardrobe && !pop && !parkingSpace)){
                setVirtualApartments(apartments)
            }
            if(typeOfPlace == 'All' && minPriceValue !== 'All' && maxPriceValue !== 'All' && (!runningWater && !electricity && !security && !wardrobe && !pop && !parkingSpace)){
                const minPriceVal = parseInt(minPriceValue, 10)
                const maxPriceVal = parseInt(maxPriceValue, 10)
                const virtualApt = apartments.filter((apt)=>{
                        return apt.price >= minPriceVal && apt.price <= maxPriceVal
                })
                setVirtualApartments(virtualApt)
            }
            
            if (typeOfPlace !=='All' && minPriceValue == 'All' && maxPriceValue == 'All' &&  (!runningWater && !electricity && !security && !wardrobe && !pop && !parkingSpace)){
                const virtualApt = apartments.filter((apt)=>{
                    return apt.placeType == typeOfPlace
            })
                setVirtualApartments(virtualApt)
            }
            if (typeOfPlace!=='All' && minPriceValue!=='All' && maxPriceValue!=='All' && (!runningWater && !electricity && !security && !wardrobe && !pop && !parkingSpace)){
                const virtualApt = apartments.filter((apt)=>{
                    const minPriceVal = parseInt(minPriceValue, 10)
                    const maxPriceVal = parseInt(maxPriceValue, 10)
                    return apt.placeType == typeOfPlace && apt.price >= minPriceVal && apt.price <= maxPriceVal
            })
                setVirtualApartments(virtualApt)
            }
            if (typeOfPlace && minPriceValue && maxPriceValue && (runningWater || electricity || security || wardrobe || pop || parkingSpace)){
                    if(amenityFalseVal){
                        console.log('Val false : ', amenityFalseVal)
                        getChkBoxValFalse(amenityFalseVal)
                    }else{
                        console.log('Val true : ', amenityVal)
                        getChkBoxVal(amenityVal)
                    }
                    
            }
     
        }catch(e){
            console.log('Error : ', e)
        }
    }

   
    
    const fetchApartments = async()=>{
          const availableApartments = await DataStore.query(Apartment, (a)=> a.status.eq('AVAILABLE'))
          setApartments(availableApartments)
  }

    if(!apartments){
        return(
            <Modal visible={true} presentationStyle='fullScreen' onRequestClose={()=>{}}>
            <View style={{flex: 1, backgroundColor: 'white', justifyContent:'center', alignItems:'center'}}>
                   <View style={{backgroundColor: 'white', justifyContent:'center', alignItems:'center', width: 150, height: 150, elevation: 5, borderRadius: 20}}>
                           <Image source={require('../../../assets/loadingGif.gif')} style={{width: 100, height: 100}}/>               
                   </View>
                   <Text style={{color: '#F52F57', fontWeight:'600', fontSize: 16, marginTop: 15}}>Loading...</Text>
           </View>  
            </Modal>
   
        )
    }
    return(
    <View style={{flex: 1}}>
       <StatusBar style='dark' backgroundColor='white'/>
    <View style={{flex: 1}}> 
            <Header showPlaceValue={showPlaceValue} setLocationModal={setLocationModal} setModalVisible={setModalVisible} showProfileAlert={showProfileAlert} aptSearchId={aptSearchId} theAptTitle={theAptTitle}/>
            <ApartmentsContainer apartments={apartments}/>
            <FilterScreen setShowPlaceValue={setShowPlaceValue} allApartments={allApartments} minPriceValue={minPriceValue} maxPriceValue={maxPriceValue} typeOfPlace={typeOfPlace} setParkingSpace={setParkingSpace} setRunningWater={setRunningWater} setElecricity={setElecricity} setPop={setPop} setWardrobe={setWardrobe} setSecurity={setSecurity} setMinPriceValue={setMinPriceValue} setMaxPriceValue={setMaxPriceValue} setTypeOfPlace={setTypeOfPlace} setAmenityFalseVal={setAmenityFalseVal} setAmenityVal={setAmenityVal} setArr={setArr} setApartments={setApartments} apartments={virtualApartments} modalVisible={modalVisible} setModalVisible={setModalVisible} setAptSearchId={setAptSearchId} setTheAptTitle={setTheAptTitle}/>
        </View>
        <Modal visible={showProfileAlert} onRequestClose={()=>{dispatch(dontShowProfileAlert())}} presentationStyle='overFullScreen' transparent={true}>
        <StatusBar style='dark' backgroundColor='rgba(0,0,0,0.5)'/>
        <View style={{ flex: 1, ...styles.profileAlertContainer}}>
            <View style={styles.profileAlertCont}>
                     <View style={styles.alignContainer}>
                             <AntDesign onPress={()=>{dispatch(dontShowProfileAlert())}} name="close" size={20} color="black"/>
                             <Text style={{...styles.createProfileText, alignSelf:'center', flex: 1}}>Create your profile</Text>
                     </View>
                     <View style={styles.imageTextCont}>
                            <Image source={require('../../../assets/profile_pic.png')} style={styles.image}/>
                                <View style={styles.alignContainer}> 
                                                <Text style={styles.infoDescText}>Tell others about yourself</Text>
                                                <Entypo name="edit" size={18} color="#FF0000" onPress={()=>{dispatch(dontShowProfileAlert()); navigation.navigate('Profile')}}/>
                                </View>
                     </View>
            </View>
      </View> 
      </Modal>
            <Modal visible={locationModal} onRequestClose={()=>{setLocationModal(false)}} presentationStyle='overFullScreen'>
                    <View style={styles.modalContainer}>
                            <View style={styles.alignContainer}>
                                <AntDesign name="arrowleft" size={24} color="black" style={{marginRight: 20}} onPress={()=>{setLocationModal(false)}}/>
                                <Text style={styles.searchLocationLabel}>Find places</Text>
                                <Text onPress={clearAddressText} style={styles.clearText}>Clear</Text>
                            </View>
                            {isLoading && (
                                <View style={{ position: 'absolute', top: '50%', alignSelf:'center', marginTop: -10 }}>
                                <ActivityIndicator size="large" color="red" />
                                </View>
                            )}
                             {placeNotFound == 'notFound' && (
                                <View style={{ position: 'absolute', top: '50%', alignSelf:'center', marginTop: -10 }}>
                                        <Text style={{fontSize: 15, fontWeight:'500', textAlign:'center'}}>No places found matching your search. Please ensure you are searching for a valid city, state, or country, and try again</Text>
                                </View>
                            )}
                             {placeNotFound == 'error' && (
                                <View style={{ position: 'absolute', top: '50%', alignSelf:'center', marginTop: -10 }}>
                                        <Text style={{fontSize: 15, fontWeight:'500', textAlign:'center'}}>An Error occurred! Pls check your internet connection or try again later</Text>
                                </View>
                            )}
                            {placeNotFound == 'timeout' && (
                                <View style={{ position: 'absolute', top: '50%', alignSelf:'center', marginTop: -10 }}>
                                        <Text style={{fontSize: 15, fontWeight:'500', textAlign:'center'}}>Request timed out. Please check your internet connection or try again later</Text>
                                </View>
                            )}


                       
                        <View style={{ marginTop: 20}}>
                        
                                <GooglePlacesAutocomplete
                                                ref={autocompleteRef}
                                                placeholder='Search places by city, state or country'
                                                keepResultsAfterBlur={true}
                                                onPress={(data, details) => {
                                                   console.log('details : ', details.name)
                                                   setIsLoading(null)
                                                   getApartmentByLocation(details.name)
                                                   
                                                }}
                                                
                                                onNotFound={()=>{ setIsLoading(null);
                                                                  setPlaceNotFound('notFound')
                                                                }}
                                                
                                                onTimeout={()=>{ setIsLoading(null); 
                                                                 setPlaceNotFound('timeout')
                                                                }}
                                                
                                                query={{
                                                    key: API_KEY,
                                                    language: 'en',
                                                    types: '(regions)',
                                                 }}
                                                 textInputProps={{
                                                    onChangeText: (val)=>{
                                                        setIsLoading(val)
                                                    }
                                                 }}
                                                onFail={()=>{ setIsLoading(null); 
                                                              setPlaceNotFound('error')
                                                            }}
                                                minLength={2}
                                                fetchDetails={true}
                                                autoFillOnNotFound={true}
                                                enablePoweredByContainer={false}
                                                keyboardShouldPersistTaps={"always"}
                                                isRowScrollable={true}
                                                styles={{
                                                    textInput: styles.locationTextInput,
                                                    separator: styles.seperatorLine,
                                                    listView: styles.locationListView,
                                                    description: styles.locationDescText,
                                                    row:{
                                                        backgroundColor:'#FAFAFA'
                                                    }
                                                    }}
                                                
                                        />
                                
                              
                            
                        </View>
                        {isLoading? null : <>
                        <View style={{flexDirection:'row', alignItems:'row', postion:'absolute', top: 10/100 * height, alignSelf:'center'}}>
                                            <Text style={{fontWeight:'600'}}>________________</Text>
                                            <Text style={{marginTop:5, marginHorizontal: 10}}>or</Text>
                                            <Text style={{fontWeight:'600'}}>________________</Text>
                        </View>
                        <View style={{position:'absolute', top: 25/100 * height, alignSelf:'center', width:'100%'}}>
                                <View>
                                    <TextInput ref={aptIDTextInputRef} style={styles.locationTextInput} placeholder='Search places by apartmentID' onChangeText={setAptSearchId}/>
                                    { aptSearchId && <Pressable onPress={()=>{getApartmentByAptSearchID(aptSearchId)}} style={{paddingVertical: 10, paddingHorizontal:15, borderRadius: 5, alignSelf:'flex-end', backgroundColor:'black', position:'absolute', top: 10/100 * height, alignSelf:'center'}}>
                                    <Text style={{color:'white', fontWeight:'600'}}>Search</Text>
                                </Pressable> }
                                </View>
                              
                        </View>
                       
                        </>
                        }

                       
                    </View>
                    
        </Modal>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1, 
        justifyContent:'center', 
        alignItems:'center'
    },
    profileAlertContainer: {
        backgroundColor: 'rgba(0,0,0,0.5)', 
        justifyContent:"center", 
        alignItems:'center'
    },
    profileAlertCont: {
        backgroundColor:"white", 
        padding: 20, 
        borderRadius: 10
    },
    alignContainer: {
        flexDirection:'row', 
        alignItems:"center" 
    },
    createProfileText: {
        fontSize: 20, 
        fontWeight: '500', 
        textAlign:'center',
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
    imageTextCont: {
        alignItems:'center', 
        marginVertical: 10, 
        paddingHorizontal: 30
    }, 
    gifImage: {
        width: 100, 
        height: 100
    },
    modalContainer: {
        flex: 1, 
        padding: 20,
        backgroundColor:'white'
    },
    searchLocationLabel: {
        fontWeight:'600', 
        fontSize: 18, 
        letterSpacing:0.5, 
        marginRight: 'auto'
    },
    clearText: {
        fontSize:14, 
        letterSpacing:0.5, 
        color:'#FF0000'
    },
    locationTextInput: {
        color: '#4C4C4C',
        fontSize: 16,
        backgroundColor:'#FAFAFA',
        height: 50,
        borderRadius: 20,
        borderWidth: 2,
        paddingLeft: 20
    },
    seperatorLine: {
        borderColor:'black',
        borderWidth: 0.5
    },
    locationListView: {
        position:'absolute',
        top: 50,
        left: '0%',
        width: '100%'
    },
    locationDescText: {
        color:'black',
        fontSize: 14
    }
    })

