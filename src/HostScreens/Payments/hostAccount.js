import { useState, useEffect} from 'react'
import {View, Text, StyleSheet, Pressable, Modal, TextInput, Image, FlatList, ScrollView, Keyboard} from 'react-native'
import { MaterialIcons, AntDesign, Ionicons, Entypo} from '@expo/vector-icons'
import { DataStore } from 'aws-amplify/datastore';
import { HostAccount } from '../../models';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useSelector, useDispatch } from 'react-redux';
import { storeHostBank } from '../../Redux/hostBankDetails/hostBankActions';

  const HostAcc = ()=>{
    const dbHost = useSelector( state => state.host.dbHost)
    const hostBankDetails = useSelector( state => state.hostBank.hostBankDetails )
    const dispatch = useDispatch()
    const [banks, setBanks] = useState([]);
    const [bankName, setBankName] = useState(hostBankDetails?.bankName || null)
    const [bankAccNo, setBankAccNo] = useState(hostBankDetails?.accountNo || '')
    const [bankAccountHolderName, setBankAccountHolderName] = useState(hostBankDetails?.accountName || '')
    const [bankAccCode, setBankAccCode] = useState(hostBankDetails?.bankCode || '')
    const [openBankModal, setOpenBankModal] = useState(false)
    const [accNotValid, setAccNotValid] = useState(false)
    const [loading, setLoading] = useState(false)
    const [textEdit, setTextEdit] = useState(true)
    const [disableAddBtn, setDisableAddBtn] = useState(true)
    const [successAlert, setSuccessAlert] = useState(false) // controls visibility of the profile upload success alert (true = visible, false = hidden) 

    const navigation = useNavigation()

    useEffect(() => { 
        (async () => {
       const response = await fetch('https://api.paystack.co/bank', {
         method: 'GET',
         headers: {
           'Authorization': 'sk_test_dae21acb196f91cc0b08cae228f347bf241aa7e6',
           'Content-Type': 'application/json'
         }
       });
 
       const data = await response.json();
       console.log('banks : ', data.data)
       setBanks(data.data); // Assuming 'data.data' contains the list of banks
     })()
   }, []);

    useEffect(()=>{
        if(bankAccountHolderName && bankAccNo.length == 10 && bankName && bankAccCode){
            setDisableAddBtn(false)
        }else{
          setDisableAddBtn(true)
        }
  }, [bankAccountHolderName, bankAccNo, bankName, bankAccCode])

  useEffect(()=>{
    if(textEdit){
      if(bankAccNo.length == 10 && bankAccCode ){
        (async()=>{
            const accountDetails = await verifyAccount(bankAccNo, bankAccCode)
            console.log('accountDetails : ', accountDetails)
            if(accountDetails.status){
                setBankAccountHolderName(accountDetails.data.account_name)
                if(accNotValid){
                    setAccNotValid(false)
                }
            }
            else{
                setAccNotValid(true)
            }
        })()
       }
    }
}, [bankAccNo, bankAccCode])

useEffect(()=>{
    if(hostBankDetails){
      setTextEdit(false)
    }
  }, [hostBankDetails])

useEffect(()=>{
    if(!bankName || !(bankAccNo.length == 10)){
         setBankAccountHolderName('')
    }
}, [bankName, bankAccNo])

const addBankAccount = async ()=>{
 try{
  if(hostBankDetails){
    SubaccountUpdate()
}
else{
       createSubaccount(bankAccountHolderName, bankName, bankAccNo)
  }
 }catch(e){
  console.log('Error adding bank account : ', e)
 }
}

    const seeBanksModal = ()=>{
        if(hostBankDetails && !textEdit){
           return
        }else{
          setOpenBankModal(true)
        }
      }
  
      const onPressAddBankAccount = ()=>{
        Keyboard.dismiss()
        if(disableAddBtn){
          return
        }
        setLoading(true)
        addBankAccount() 
      }

      const getBankName = (valBankName, valBankCode)=>{
        if(bankAccNo || bankAccountHolderName){
            setBankAccNo('')
            setBankAccountHolderName('')
            if(accNotValid){
                setAccNotValid(false)
            }
        }
        setBankName(valBankName)
        setBankAccCode(valBankCode)
        setOpenBankModal(false)
     }


      const onCancel = ()=>{
        setBankName(hostBankDetails?.bankName || '')
        setBankAccCode(hostBankDetails?.bankCode || '')
        setBankAccNo(hostBankDetails?.accountNo || '')
        setBankAccountHolderName(hostBankDetails?.accountName || '')
        if(hostBankDetails){
          setTextEdit(false)
        }
       navigation.goBack()
       }


       const verifyAccount = async (accountNumber, bankCode) => {
        const response = await fetch(`https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`, {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer sk_test_dae21acb196f91cc0b08cae228f347bf241aa7e6',
            'Content-Type': 'application/json'
          }
        });
      
        const data = await response.json();
        return data;
      };

      const updateHostBankAccount = async (subAccountDataCode)=>{
        try{
          const HostAccountArr = await DataStore.query(HostAccount, (h)=> h.hostID.eq(dbHost.id))
          console.log('HostAccountArr : ', HostAccountArr)
          const bankDetails = await DataStore.save(HostAccount.copyOf(HostAccountArr[0], (updated)=>{
           updated.accountName = bankAccountHolderName,
           updated.accountNo = bankAccNo,
           updated.bankName = bankName,
           updated.hostID = dbHost.id,
           updated.bankCode = bankAccCode,
           updated.subaccountCode = subAccountDataCode
         } 
        ))
          console.log('updatedBankAccount : ', bankDetails)
          dispatch(storeHostBank(bankDetails))
          setLoading(false)
          setSuccessAlert(true)
        }catch(e){
            console.log('Error updating acc : ', e.message)
        }
       
      }
  
      const createHostBankAccount = async (subAccountDataCode)=>{
      const bankDetails = await DataStore.save(new HostAccount({
            accountName: bankAccountHolderName,
            accountNo: bankAccNo,
            bankName: bankName, 
            hostID: dbHost.id,
            bankCode: bankAccCode,
            subaccountCode: subAccountDataCode
            }
          ))
            console.log('BankDetails Saved Successfully : ', bankDetails)
            dispatch(storeHostBank(bankDetails))
            setLoading(false)
            setSuccessAlert(true)
      }
  
      const createSubaccount = async (businessName, settlementBank, accountNumber) => {
        const secretKey = 'sk_test_dae21acb196f91cc0b08cae228f347bf241aa7e6';
        try {
          const response = await axios.post(
            'https://api.paystack.co/subaccount',
            {
              business_name: businessName,
              settlement_bank: settlementBank,
              account_number: accountNumber,
              percentage_charge: 0
            },
            {
              headers: {
                Authorization: `Bearer ${secretKey}`,
                'Content-Type': 'application/json',
              },
            }
          );
         
       
          console.log('Subaccount created:', response.data);
          const subAccData = response.data
          console.log('Subaccount code: ', subAccData.data.subaccount_code)
          createHostBankAccount(subAccData.data.subaccount_code)
        } catch (error) {
          console.error('Error creating subaccount:', error.response ? error.response.data : error.message);
          throw error;
        }
      };
  
    const updateSubaccount = async (subaccountId, updateData) => {
    const secretKey = 'sk_test_dae21acb196f91cc0b08cae228f347bf241aa7e6';
    const endpoint = `https://api.paystack.co/subaccount/${subaccountId}`;
  
    try {
      const response = await axios.put(endpoint, updateData, {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Subaccount updated successfully:', response.data);
        const subAccData = response.data
        console.log('Subaccount code: ', subAccData.data.subaccount_code)
        updateHostBankAccount(subAccData.data.subaccount_code)
    } catch (error) {
      console.error('Error updating subaccount:', error);
    }
  };
  
  const SubaccountUpdate = async () => {
      const getSubAccIdArr = await DataStore.query(HostAccount, (h)=> h.hostID.eq(dbHost.id))
      console.log('getSubAccIdArr : ', getSubAccIdArr)
      const subaccountId = getSubAccIdArr[0].subaccountCode; // Replace with the actual subaccount ID
      const updateData = {
        business_name: bankAccountHolderName,
        settlement_bank: bankName,
        account_number: bankAccNo
      };
      updateSubaccount(subaccountId, updateData);
      }
  

    return(
      <ScrollView  showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always' contentContainerStyle={styles.scrollViewContainer}>
             <StatusBar style="dark" backgroundColor={'white'}/>
            <View style={styles.container}>
                <View style={styles.alignContainer}>
                    <Text onPress={onCancel} style={styles.cancelText}>Cancel</Text>
                    <Text style={styles.bankAccText}>{textEdit? 'Add a bank account' : 'Your bank account'}</Text>
                    {hostBankDetails && <AntDesign onPress={()=>{setTextEdit(true)}} name="edit" size={20} color={textEdit? 'blue' : 'black'} />}
                </View>

                <View style={{marginVertical: 25}}>
                    <Text style={styles.labelHeader}>Bank account details</Text>
                </View>

                <Pressable onPress={seeBanksModal} style={styles.bankNameCont}>
                    <TextInput placeholder='Bank' value={bankName? bankName : ''} style={{...styles.bankNameTxtInput, color: bankName? 'black' : 'gray'}} editable={false} />
                    <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
                </Pressable>

                <View style={styles.bankAccNoCont}>
                    <TextInput placeholder='Account number' value={bankAccNo} onChangeText={setBankAccNo} style={styles.bankAccNoTxtInput} keyboardType='numeric' maxLength={10} editable={textEdit}/>
                </View>
            <View style={styles.bankAccHolderNameCont}>
                    <View style={styles.txtInputCont}>
                        <TextInput placeholder='Account holder name' value={bankAccountHolderName} style={{...styles.accHolderTxtInput, color: bankAccountHolderName? 'green' : 'gray'}} editable={false}/>
                    </View>
                        {accNotValid && <Text style={styles.errorText}>The account number you entered is invalid. Please check the number and try again.</Text>}
            </View>
            {textEdit && <View>
                <Text style={styles.addAccDescText}>By clicking 'Add Bank Account', you confirm that the bank account details provided are accurate and belong to you. You also agree to our <Text onPress={()=>{ navigation.navigate('TermsAndConditions')}} style={styles.termsLabel}>Terms of Service</Text> and <Text onPress={()=>{ navigation.navigate('privacyPolicy')}} style={styles.termsLabel}>Privacy Policy</Text>.</Text>
                <Pressable onPress={onPressAddBankAccount} style={{backgroundColor: disableAddBtn? 'gray' : '#8B0000', ...styles.addBankAccBtn}}>
                    <Text style={styles.addBankAccText}>Add Bank Account</Text>
                </Pressable>
            </View>}
        </View>
        <Modal visible={loading} onRequestClose={()=>{}} presentationStyle='overFullScreen' transparent={true}>
               <StatusBar style="light" backgroundColor={'rgba(0,0,0,0.5)'}/>
              <View style={{ flex: 1, ...styles.loadingCont}}>
                      <View style={styles.alignCont}>
                        <View style={styles.loadingImgCont}>
                            <Image source={require('../../../assets/loadingGif.gif')} style={styles.loadingImage}/>
                        </View>
                        <Text style={styles.loadingText}>Adding bank account...</Text>
                      </View>
                </View>
        </Modal>
       
        <Modal visible={openBankModal} onRequestClose={()=>{ setOpenBankModal(false) }} presentationStyle='overFullScreen'>
                <View style={styles.modalContainer}>
                                <Ionicons name="arrow-back" onPress={()=>{setOpenBankModal(false)}} size={24} color="black" style={{marginRight: 30}} />
                                <Text style={styles.headerText}>Banks</Text>
                </View>
                <FlatList data={banks} renderItem={({item})=>{
                      return (
                        <Pressable onPress={()=>{getBankName(item.name, item.code)}} style={styles.bankNameBtn}>
                            <Text>{item.name}</Text>
                        </Pressable>
                      )
                }} contentContainerStyle={{padding: 10}}/>
             </Modal>
             <Modal visible={successAlert} onRequestClose={()=>{setSuccessAlert(false); navigation.goBack()}} presentationStyle='overFullScreen' transparent={true}>
           <StatusBar style="light" backgroundColor={'rgba(0,0,0,0.5)'}/>
                <View style={{ flex: 1, ...styles.userProfileAlertContainer}}>
                          <View style={styles.userProfileSuccessAlert}>
                                  <Entypo name="upload-to-cloud" size={60} color="rgba(0,0,0,0.5)" /> 
                                  <Text style={styles.successText}>Success</Text>
                                  <Text style={styles.profileSuccessText}>Your bank account was added successfully</Text>
                                  <Pressable onPress={()=>{ setSuccessAlert(false); navigation.goBack()}} style={{backgroundColor: 'black', ...styles.closeProfileAlert}}>
                                      <Text style={styles.closeAlertText}>Done</Text>
                                  </Pressable>
                              </View>
                    </View>
            </Modal>
   </ScrollView>
    )
  }

export default HostAcc

const styles = StyleSheet.create({
    scrollViewContainer: {
      flex: 1, 
      backgroundColor:'white'
    },
    container: {
      flex: 1, 
      padding: 20
    },
    alignContainer: {
      flexDirection:'row', 
      alignItems:'center',
      justifyContent:'space-between'
    },
    cancelText: {
      fontSize: 16
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
      bankAccText: {
        fontSize: 16, 
        fontWeight: '500'
      },
      labelHeader: {
        fontSize: 25, 
        fontWeight:'600'
      },
      bankNameCont :{
        flexDirection:'row', 
        padding: 10, 
        borderBottomWidth: 1, 
        borderBottomColor:'gray'
      },
      bankNameTxtInput: {
        flex: 1, 
        fontSize: 16
      },
      bankAccNoCont: {
        padding: 10, 
        borderBottomWidth: 1, 
        marginVertical: 20, 
        borderBottomColor:'gray'
      },
      bankAccNoTxtInput: {
        width: '100%', 
        fontSize: 16, 
        color: 'black'
      },
      bankAccHolderNameCont: {
        marginTop: 3, 
        marginBottom: 'auto'
      },
      txtInputCont: {
        padding: 10, 
        borderBottomWidth: 1, 
        borderBottomColor:'gray'
      },
      accHolderTxtInput: {
        width: '100%', 
        fontSize: 16
      },
      errorText: {
        color: 'red', 
        fontWeight: '500'
      },
      addAccDescText: {
        color: '#4C4C4C', 
        fontWeight: '500', 
        textAlign: 'center', 
        fontSize: 13
      },
      addBankAccBtn: {
        padding: 15, 
        borderRadius: 10, 
        marginTop: 10
      },
      addBankAccText: {
        color: 'white', 
        fontSize: 16, 
        fontWeight: '600', 
        textAlign: 'center'
      },
      modalContainer: {
        padding: 15, 
        flexDirection:'row', 
        alignItems:'center'
      },
      headerText: {
        fontSize: 30, 
        fontWeight:'600'
      },
      bankNameBtn: {
        padding: 15, 
        borderBottomWidth: 1, 
        borderBottomColor: 'lightgray', 
        justifyContent: 'center'
      },
      termsLabel: {
        color:'blue', 
        textDecorationLine: 'underline',
        textDecorationColor:'blue'
      },
      userProfileAlertContainer: {
        backgroundColor:'rgba(0,0,0,0.5)', 
        justifyContent:'center',
         alignItems:"center"
    },
    userProfileSuccessAlert: {
        padding: 20, 
        backgroundColor:'white', 
        borderRadius: 20, 
        elevation: 5, 
        alignItems: 'center',
        width:'70%',
        alignSelf:'center'
    },
    successText: {
        color:"green", 
        fontWeight: '600', 
        fontSize: 18, 
        marginBottom: 0,
        textAlign:"center"
    },
    profileSuccessText: {
        color:"#4C4C4C", 
        fontWeight: '500', 
        textAlign:'center', 
        marginBottom: 30, 
        fontSize: 14
    },
    closeProfileAlert: {
        paddingVertical: 5, 
        paddingHorizontal:15,
        borderRadius: 5
    },
    closeAlertText: {
        color:'white', 
        fontWeight: '600', 
        fontSize: 14
    },

})

