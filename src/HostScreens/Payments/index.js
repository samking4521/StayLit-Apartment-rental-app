import { useEffect, useCallback, useState} from 'react'
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native'
import { MaterialIcons, Ionicons, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons'
import { DataStore } from 'aws-amplify/datastore';
import { ObserveHostPayment } from '../../models';
import { useAuthContext } from '../../Context/hostContext';
import { parse, compareDesc } from 'date-fns';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import BottomSheet from '@gorhom/bottom-sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar';
import { useSelector, useDispatch } from 'react-redux'
import { fetchAllPaidApts } from '../../Redux/paidHostApartment/paidHostActions';
import { fetchObserveHostPayment } from '../../Redux/observeHostPayment/observeHostActions';
import { showHostProfile } from '../../Redux/showHostProfileAlert/showHostActions';

const Payments = ()=>{
    const dbHost = useSelector( state => state.host.dbHost)
    const hostBankDetails = useSelector( state => state.hostBank.hostBankDetails )
    const allPaidHostApartment = useSelector( state => state.paidHostApts.allHostApt )
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const [changeStatus, setChangeStatusBar] = useState(false)

    useFocusEffect(
        useCallback(() => {
         
          setChangeStatusBar(true)
          return () => setChangeStatusBar(false);
        }, [])
      );

    useEffect(()=>{
      // Helper function to parse date strings into Date objects
     const parseDate = dateString => parse(dateString, 'M/d/yyyy, h:mm:ss a', new Date());
     
     // Sort `paidApartments` based on parsed dates in descending(latest date) order
     const sortedHostPaidApts = allPaidHostApartment?.sort((a, b) => compareDesc(parseDate(a.date), parseDate(b.date)));
     dispatch(fetchAllPaidApts(sortedHostPaidApts))
 }, [allPaidHostApartment])


    const updateObserveHostPayment = async ()=>{
      const obsPaymentObj = await DataStore.query(ObserveHostPayment, (o)=> o.hostID.eq(dbHost.id))
      console.log('obsPaymentObj : ', obsPaymentObj[0])
      if(obsPaymentObj[0]){
          const updateObsPaymentObj = await DataStore.save(ObserveHostPayment.copyOf(obsPaymentObj[0], (updated)=>{
              updated.newPayment = false
          }))
          console.log('updateObsPaymentObj : ', updateObsPaymentObj)
          dispatch(fetchObserveHostPayment(updateObsPaymentObj))
      }
  }

  useFocusEffect(
      useCallback(() => {
          if (!dbHost) {
            return;
          }
          updateObserveHostPayment();
        }, [dbHost])
  )
  
 
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

    const openPaymentDetailsScreen = ()=>{
        if(!dbHost){
            dispatch(showHostProfile())
            return
        }
        navigation.navigate('HostAccount')
    }
   
   if(allPaidHostApartment?.length == 0 || !allPaidHostApartment){
       return(
          <GestureHandlerRootView style={styles.noPaidAptCont}>
             {changeStatus && <StatusBar style="light" backgroundColor={'rgba(0,0,0,0.5)'}/>}
                <View>
                    <Text style={styles.noPaidAptHeader}>Payments</Text>
                </View>
                <BottomSheet index={0} snapPoints={['90%']} containerStyle={{ backgroundColor:'rgba(0,0,0,0.5)'}} handleIndicatorStyle={{display:'none'}}>
                   <View style={styles.bottomSheetCont}>
                          <View style={styles.headerBankCont}>
                               <Text style={styles.headerBankText}>{!hostBankDetails? 'Add Bank Account' : 'Bank Account'}</Text>
                          </View>
                        <View style={styles.centerContainer}>
                            <View style={styles.circleA}>
                                <View style={styles.circleB}>
                                  <View style={styles.circleC}>
                                      <MaterialCommunityIcons name="bank" size={30} color="white" />
                                  </View>
                                </View>
                              </View>
                              <View style={styles.linkAccCont}>
                                <Text style={styles.linkAccText}>{ !hostBankDetails? 'Link your bank account' : 'No payments yet'}</Text>
                                <Text style={styles.linkAccDescText}>{!hostBankDetails? 'Receive apartment payments directly and securely into your bank account' : 'No payment received yet. Payments notifications appear here, once a payment is made'}</Text>
                              </View>
                        </View>

                        <Pressable onPress={openPaymentDetailsScreen} style={styles.linkBankBtn}>
                                   <Text style={styles.linkBankText}>{!hostBankDetails? 'Link Bank' : 'See Bank'}</Text>
                        </Pressable>
                          
                   </View>
                </BottomSheet>
         
          </GestureHandlerRootView>
       )
   }

    return(
    <View style={styles.mainContainer}>
        { changeStatus && <StatusBar style="dark" backgroundColor={'#F5F5F5'}/>}
            <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.paymentsLabel}>Payments</Text>
                    { hostBankDetails && <View style={styles.seeBankIcon}><MaterialCommunityIcons onPress={()=>{navigation.navigate('HostAccount')}} name="bank" size={18} color="white" /></View> }
            </View>
            <View>
                         
                          <FlatList showsVerticalScrollIndicator={false} data={allPaidHostApartment} contentContainerStyle={{paddingBottom: 100}} renderItem={({item})=>{
                      
                        return(
                          <Pressable onPress={()=>{navigation.navigate('Receipt', {payment : item, dbUser : item.User, apartment: item.Apartment, hostData: item.Host})}} style={styles.cardPaymentNotification} key={item.id}>
                          <View style={styles.alignContainer}>
                               <MaterialIcons name="apartment" size={20} color="#FF0000" style={{marginRight:10}}/>
                               <Text style={styles.paymentNotificationLabelText}>Apartment payment successful</Text>
                          </View>
                          <View style={{marginVertical: 10}}>
                             <Text style={styles.paymentNotificationText}>You have successfully received a payment of <FontAwesome6 name="naira-sign" size={15} color="black" /><Text style={styles.apartmentPriceText}>{ formatPriceToString(item.price)}</Text> for an apartment. Thanks for choosing StayLit.</Text>
                          </View>
                          <View style={{...styles.alignContainer, justifyContent:'space-between'}}>
                               <Text style={{color:'#4C4C4C'}}>{item.date}</Text>
                               <Text onPress={()=>{navigation.navigate('ApartmentsDetails', {payment: item, apartment: item.Apartment, dbHost})}} style={styles.reviewText}>Review</Text>
                               <View style={styles.alignContainer}>
                                   <Text style={{color:'#FF0000', fontSize: 12}}>View</Text>
                                   <Ionicons name="chevron-forward" size={14} color="#FF0000"/>
                               </View>
                           </View>
                       </Pressable>
                           
                                    
                        )}}
                         
                          />
                    
             </View>
          </View>   
          
    </View>
        
    )
}

export default Payments

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1, 
        backgroundColor:'#F5F5F5'
    },
    container: {
        flex: 1, 
        paddingHorizontal: 20
    },
    header: {
        flexDirection:'row', 
        alignItems:'center', 
        justifyContent:'space-between', 
        paddingHorizontal: 10, 
        paddingVertical: 15
    },
    paymentsLabel: {
        fontSize: 25, 
        fontWeight: '500'
    },
  cardPaymentNotification: {
    marginBottom: 20, 
    padding: 20, 
    backgroundColor:'white', 
    borderRadius: 10,
    width:'100%'
},
paymentNotificationLabel: {
    padding: 20, 
    flexDirection:'row', 
    alignItems:'center'
},
paymentNotificationLabelText: {
  fontSize: 16, 
  fontWeight: '600'
},
paymentNotificationText: {
    fontSize: 14, 
    lineHeight: 22
},
alignContainer: {
    flexDirection:'row', 
    alignItems:"center" 
},
apartmentPriceText: {
    fontSize: 14, 
    fontWeight: '500'
   },
   reviewText: {
    borderWidth: 2, 
    borderColor:'#FF0000', 
    padding: 2, 
    textAlign:'center', 
    borderRadius: 5,
    fontSize: 12
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
 noPaidAptCont: {
    flex: 1, 
    backgroundColor:'white', 
    padding: 20
 },
 noPaidAptHeader: {
    fontSize: 30, 
    fontWeight: '500'
 },
 bottomSheetCont: {
    flex: 1, 
    backgroundColor: "white", 
    paddingBottom: 20
 },
 headerBankCont: {
    alignItems:'center', 
    marginBottom: 50
 },
 headerBankText: {
    fontSize: 18, 
    fontWeight: '600'
 },
 centerContainer: {
    padding: 20,
    alignItems:'center', 
    marginBottom:'auto'
 },
 circleA: {
    backgroundColor: 'rgba(255,0,0,0.4)', 
    width: 120, 
    height: 120, 
    borderRadius: 100, 
    justifyContent:'center', 
    alignItems:'center'
 },
 circleB: {
    backgroundColor: 'rgba(255,0,0,0.6)', 
    width: 90, 
    height: 90, 
    borderRadius: 80, 
    justifyContent: 'center', 
    alignItems: 'center'
 },
 circleC: {
    backgroundColor: '#FF0000', 
    width: 60, 
    height: 60, 
    borderRadius: 50, 
    justifyContent: 'center', 
    alignItems: 'center'
 },
 linkAccCont: {
    alignItems:'center', 
    marginTop: 20
 },
    linkAccText: {
        fontSize: 20, 
        fontWeight: '600', 
        marginBottom: 5
    },
    linkAccDescText: {
        fontWeight: "500", 
        color: '#4C4C4C', 
        textAlign: 'center'
    },
    linkBankBtn: {
        backgroundColor: '#8B0000', 
        padding: 15, 
        borderRadius: 10, 
        marginHorizontal: 30
    },
    linkBankText: {
        textAlign:'center', 
        color:'white', 
        fontWeight:'600', 
        fontSize: 16
    },
    seeBankIcon: {
        width: 40, 
        height: 40, 
        borderRadius: 40, 
        backgroundColor:"#FF0000", 
        justifyContent:'center', 
        alignItems:'center'
    }
   
})