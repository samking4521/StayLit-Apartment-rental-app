import { useState, useEffect } from 'react'
import {View, Text, Image, Modal, StyleSheet, Pressable} from 'react-native'
import Header from './header'
import HostApartmentContainer from './hostApartmentContainer'
import FilterScreen from './modal'
import { StatusBar } from 'expo-status-bar'
import { DataStore } from 'aws-amplify/datastore'
import { useAuthContext } from '../../Context/hostContext'
import { Entypo, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useSelector, useDispatch } from 'react-redux'
import { showHostProfile, dontShowHostProfile } from '../../Redux/showHostProfileAlert/showHostActions'
import { fetchDbHostFailure, fetchDbHostSuccess } from '../../Redux/dbHost/dbHostActions';
import { storeHostBank } from '../../Redux/hostBankDetails/hostBankActions';
import { fetchAllPaidApts } from '../../Redux/paidHostApartment/paidHostActions';
import { Apartment, Host, HostAccount, PaymentHistory, ObserveHostPayment } from '../../models';
import { fetchObserveHostPayment } from '../../Redux/observeHostPayment/observeHostActions';

const ListingsScreen = ()=>{
    const { hostAuth, loading, setLoading } = useAuthContext()
    const dbHost = useSelector(state => state.host.dbHost)
    const showProfileAlert = useSelector( state => state.hostProfile.showHostProfile)
    const hostBankDetails = useSelector( state => state.hostBank.hostBankDetails)
    const dispatch = useDispatch()
    const [apartments, setApartments] = useState(null)
    const [ modalIsVisible, setModalVisible] = useState(false)
    const navigation = useNavigation()
    const [virtualApartments, setVirtualApartments] = useState(null)
    const [arr, setArr] = useState([])
    const [typeOfPlace, setTypeOfPlace] = useState('All')
    const [runningWater, setRunningWater] = useState(null)
    const [electricity, setElecricity] = useState(null)
    const [security, setSecurity] = useState(null)
    const [wardrobe, setWardrobe] = useState(null)
    const [parkingSpace, setParkingSpace] = useState(null)
    const [pop, setPop] = useState(null)
    const [minPriceValue, setMinPriceValue] = useState('All')
    const [maxPriceValue, setMaxPriceValue] = useState('All')
    const [amenityVal, setAmenityVal] = useState(null)
    const [amenityFalseVal, setAmenityFalseVal] = useState(null)
    const [locationModal, setLocationModal] = useState(false)
    const [placeValue, setPlaceValue] = useState(null)
    const [showAllPlaces, setShowAllPlaces] = useState(null)
    const [allApartments, setAllApartments] = useState(null)
    const [showAddBankAcc, setShowAddBankAcc] = useState(false) // controls the visibility of the profile alert component (false = hidden, true = show )
    const [deletingAptModal, setDeletingAptModal] = useState(false)



    const getDbHost = async () => {
        try {
          const theHost = await DataStore.query(Host, (host) => host.sub.eq(hostAuth));
          console.log('The Host : ', theHost)
          dispatch(fetchDbHostSuccess(theHost[0]))
          setLoading(false)
        } catch (err) {
          console.log('Error Getting DbHost:', err.message);
          dispatch(fetchDbHostFailure(err.message))
          setLoading(false)
        }
      }
    
      const getHostAccount = async () => {
        if (!dbHost) {
          return;
        }
        try {
          const hostAccountDetails = await DataStore.query(HostAccount, (h) => h.hostID.eq(dbHost.id));
          dispatch(storeHostBank(hostAccountDetails[0]))
        } catch (err) {
          console.log('Error getting Host account:', err.message);
        }
      }
    
      const getHostPaidApartments = async () => {
        if (!dbHost) {
          return;
        }
        try {
          const hostPaidApt = await DataStore.query(PaymentHistory, (p) => p.hostID.eq(dbHost.id));
          dispatch(fetchAllPaidApts(hostPaidApt))
        } catch (err) {
          console.log('Error getting Host paid apartments:', err.message);
        }
      }
    
      const getHostObservePayment = async () => {
        if (!dbHost){
          return;
        } 
        try {
          const hostObsPayment = await DataStore.query(ObserveHostPayment, (o) => o.hostID.eq(dbHost.id));
          dispatch(fetchObserveHostPayment(hostObsPayment[0]))
        } catch (err) {
          console.log('Error getting ObserveHostPayment:', err.message);
        }
      }
    
    
      useEffect(() => {
        if (!hostAuth){
          return;
        } 
    
        const initializeDataStore = async () => {
          await DataStore.start();
          getDbHost();
        };
    
        initializeDataStore();
    
        const hostSubscription = DataStore.observe(Host).subscribe((msg) => {
          if (['INSERT', 'UPDATE'].includes(msg.opType)) {
            getDbHost();
          }
        });
    
        return () => hostSubscription.unsubscribe();
      }, [hostAuth]);
    
      useEffect(() => {
        if (!dbHost){
          return;
        } 
    
        getHostAccount();
        getHostPaidApartments();
        getHostObservePayment();
    
        const hostAccountSubscription = DataStore.observe(HostAccount).subscribe((msg) => {
          if (['UPDATE', 'DELETE'].includes(msg.opType)) {
            getHostAccount();
          }
        });
    
        return () => hostAccountSubscription.unsubscribe();
      }, [dbHost]);
    
  const filterAptByAvailabilityStat = async (aptStatus)=>{
     if(aptStatus == 'AVAILABLE'){
        const filterAptArr = allApartments.filter((a)=> a.status == 'AVAILABLE')
        console.log('filterAptArr ', filterAptArr)
        setApartments(filterAptArr)
        setPlaceValue({status: 'AVAILABLE', theApts: filterAptArr})
     }else if (aptStatus == 'UNAVAILABLE'){
        const filterAptArr = allApartments.filter((a)=> a.status == 'UNAVAILABLE')
        console.log('filterAptArr ', filterAptArr)
        setApartments(filterAptArr)
        setPlaceValue({status: 'UNAVAILABLE', theApts: filterAptArr})
     }else{
        const filterAptArr = allApartments.filter((a)=> a.status == 'PAID')
        console.log('filterAptArr ', filterAptArr)
        setApartments(filterAptArr)
        setPlaceValue({status: 'PAID', theApts: filterAptArr})
     }
     setLocationModal(false)
  }
  
   useEffect(()=>{
      if(!runningWater && !electricity && !pop && !security && !wardrobe && !parkingSpace){
            setArr([])
            setAmenityFalseVal(null)
       }
    }, [runningWater, electricity, pop, security, wardrobe, parkingSpace])

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
        if(!dbHost){
            return
        }
                getAllHostApt()
         }, [dbHost, apartments])

    const getAllHostApt = async ()=>{
        const apartmentsData = await DataStore.query(Apartment, (a)=> a.hostID.eq(dbHost.id))
         console.log('Apartment Fetched Successsfully : ', apartmentsData)
         setAllApartments(apartmentsData)
    }

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
            if (typeOfPlace && minPriceValue && maxPriceValue && (runningWater || electricity || security || wardrobe || pop || parkingSpace)) {
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

    const goToCreateApartment = ()=>{
        if(dbHost && hostBankDetails){
            navigation.navigate('ApartmentDetailsForm', {mode: null, apartment: null})
        }
        else{
            if(!dbHost){
                dispatch(showHostProfile())
            }else{
                setShowAddBankAcc(true)
            }
        }
       
    }

     useEffect(()=>{
        if(!dbHost){
            return
        }
        getAllHostApartments()
        const subscription = DataStore.observe(Apartment).subscribe(msg => {
            console.log("DataStore subscription message:", msg);
            // Handle the subscription message if needed
            if(msg.opType == 'DELETE'){
            console.log('subscription host delete update')
            getAllHostApartments()
            }
            // if(msg.opType == 'INSERT'){
            //     console.log('subscription insert update')
            
            //     }
            if(msg.opType == 'UPDATE'){
                console.log('subscription host update update')
                getAllHostApartments()
                }
          });
      
          return () => {
            subscription.unsubscribe();
          }
     }, [dbHost])

    const getAllHostApartments = async ()=>{
        const hostApartments = await DataStore.query(Apartment, (a)=>a.hostID.eq(dbHost.id))
        setApartments(hostApartments)
    }
    

    return(
    <View style={{flex: 1}}>
        <View style={{flex: 1}}>
            <StatusBar style='dark' backgroundColor='white'/>
            <Header placeValue={placeValue} setLocationModal={setLocationModal} modalIsVisible={modalIsVisible} setModalVisible={setModalVisible} goToCreateApartment={goToCreateApartment} apartments={apartments}/>
            <HostApartmentContainer setDeletingAptModal={setDeletingAptModal} placeValue={placeValue} apartments={apartments} loading={loading} goToCreateApartment={goToCreateApartment} dbHost={dbHost}/>
            <FilterScreen allApartments={allApartments} setPlaceValue={setPlaceValue} showAllPlaces={showAllPlaces} minPriceValue={minPriceValue} maxPriceValue={maxPriceValue} typeOfPlace={typeOfPlace} setRunningWater={setRunningWater} setElecricity={setElecricity} setPop={setPop} setWardrobe={setWardrobe} setParkingSpace={setParkingSpace} setSecurity={setSecurity} setMinPriceValue={setMinPriceValue} setMaxPriceValue={setMaxPriceValue} setTypeOfPlace={setTypeOfPlace} setAmenityFalseVal={setAmenityFalseVal} setAmenityVal={setAmenityVal} setArr={setArr} setApartments={setApartments} apartments={virtualApartments} modalIsVisible={modalIsVisible} setModalVisible={setModalVisible}/>
        </View>
        <Modal visible={deletingAptModal} onRequestClose={()=>{}} presentationStyle='overFullScreen' transparent={true}>
        <StatusBar style='light' backgroundColor='rgba(0,0,0,0.5)'/>
                       <View style={{flex: 1, ...styles.loadingCont}}>
                        <View style={styles.alignCont}>
                          <View style={styles.loadingImgCont}>
                              <Image source={require('../../../assets/loadingGif.gif')} style={styles.loadingImage}/>
                          </View>
                           <Text style={styles.loadingText}>Deleting Apartment...</Text>
                        </View>
                   </View>
        </Modal>
            <Modal visible={locationModal} onRequestClose={()=>{setLocationModal(false)}} presentationStyle='overFullScreen' transparent={true}>
                  <StatusBar style="light" backgroundColor={'rgba(0,0,0,0.5)'}/>
                  <View style={{flex: 1, backgroundColor:'rgba(0,0,0,0.5)', justifyContent:'center', alignItems:'center'}}>
                                    <View style={{width: '70%', borderRadius: 10, backgroundColor:'white', padding: 10}}>
                                        <View style={{borderBottomWidth: 1, paddingVertical: 10, flexDirection:'row', alignItems:'center'}}>
                                            <AntDesign name="close" onPress={()=>{setLocationModal(false)}} size={20} color="black" style={{width: 30}} />
                                            <Text style={{textAlign:'center', fontSize: 16, fontWeight:'600'}}>Select Apartment Status</Text>
                                        </View>
                                        <View>
                                          <View>
                                          <Pressable onPress={()=>{filterAptByAvailabilityStat('AVAILABLE')}} style={{borderBottomWidth: 1, padding: 10, flexDirection:'row', alignItems:'center'}}>
                                                <MaterialCommunityIcons name="octagon" size={18} color="green" style={{width: 30}}/>
                                                <Text style={{fontSize: 15}}>Available</Text>
                                            </Pressable>
                                            <Pressable onPress={()=>{filterAptByAvailabilityStat('UNAVAILABLE')}} style={{borderBottomWidth: 1, padding: 10, flexDirection:'row', alignItems:'center'}}>
                                                 <MaterialCommunityIcons name="octagon" size={18} color="red" style={{width: 30}}/>
                                                <Text style={{fontSize: 15}}>Unavailable</Text>
                                            </Pressable>
                                            <Pressable onPress={()=>{filterAptByAvailabilityStat('PAID')}} style={{padding: 10, flexDirection:'row', alignItems:'center'}}>
                                                <MaterialCommunityIcons name="seal" size={18} color="gold" style={{width: 30}}/>
                                                <Text style={{fontSize: 15}}>Paid</Text>
                                            </Pressable>
                                          </View>
                                           
                                        </View>
                                    </View>
                  </View>
        </Modal>
        <Modal visible={showProfileAlert} onRequestClose={()=>{dispatch(dontShowHostProfile())}} presentationStyle='overFullScreen' transparent={true}>
                <StatusBar style="light" backgroundColor={'rgba(0,0,0,0.5)'}/>
                <View style={{ flex: 1, ...styles.profileAlertContainer}}>
                    <View style={styles.profileAlertCont}>
                            <View style={styles.alignContainer}>
                                    <AntDesign onPress={()=>{dispatch(dontShowHostProfile())}} name="close" size={20} color="black"/>
                                    <Text style={{...styles.createProfileText, alignSelf:'center', flex: 1}}>Create your profile</Text>
                            </View>
                            <View style={styles.imageTextCont}>
                                    <Image source={require('../../../assets/profile_pic.png')} style={styles.image}/>
                                        <View style={styles.alignContainer}> 
                                                        <Text style={styles.infoDescText}>Tell others about yourself</Text>
                                                        <Entypo name="edit" size={18} color="#FF0000" onPress={()=>{dispatch(dontShowHostProfile()); navigation.navigate('Profile')}}/>
                                        </View>
                            </View>
                    </View>
            </View> 
      </Modal>
        <Modal visible={showAddBankAcc} onRequestClose={()=>{setShowAddBankAcc(false)}} presentationStyle='overFullScreen' transparent={true}>
        <StatusBar style='light' backgroundColor='rgba(0,0,0,0.5)'/>
            <View style={styles.showAddBankAlert}>
                <View style={{...styles.profileAlertCont, marginHorizontal: 40}}>
                <View style={styles.alignContainer}>
                             <AntDesign onPress={()=>{setShowAddBankAcc(false)}} name="close" size={20} color="black"/>
                             <Text style={{...styles.createProfileText, alignSelf:'center', flex: 1}}>Add Bank Account</Text>
                     </View>
                     <View style={styles.imageTextCont}>
                            <MaterialCommunityIcons name="bank" size={90} color="gray" style={{marginVertical: 20}} />
                                <View style={styles.alignContainer}> 
                                                <Text style={styles.infoDescText}>Receive funds into your bank account</Text>
                                                <Entypo name="edit" size={18} color="#F52F57" onPress={()=>{ setShowAddBankAcc(false); navigation.navigate('Payments')}}/>
                                </View>
                     </View>
                </View>
                    
            </View>
      </Modal>
     </View>
    )
}

export default ListingsScreen

const styles = StyleSheet.create({
   
    modalContainer: {
            elevation: 5,
            shadowColor: 'black',
            backgroundColor: 'white',
            width: '95%',
            height: '55%',
            marginLeft: '2.5%',
            marginTop: '40%', 
            borderRadius: 20, 
            paddingVertical: 15,
            paddingHorizontal: 20,
            justifyContent: 'space-evenly'
    },
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
        marginRight: 5,
        textAlign:'center'
    },
    imageTextCont: {
        alignItems:'center', 
        marginVertical: 10, 
        paddingHorizontal: 30
    },
    showAddBankAlert: {
        backgroundColor: 'rgba(0,0,0,0.5)', 
        flex: 1, 
        justifyContent:'center', 
        alignItems:'center'
    }
    })

