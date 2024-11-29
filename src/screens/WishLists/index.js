import { useState, useEffect, useCallback } from 'react'
import {View, Text, FlatList, Image, Pressable, StyleSheet, useWindowDimensions} from 'react-native'
import ApartmentList from '../../components/ApartmentList'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import BottomSheet from '@gorhom/bottom-sheet'
import { DataStore } from 'aws-amplify/dist/esm/datastore'
import { Apartment } from '../../models'
import { AntDesign, FontAwesome } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import { useSelector } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native'

const wishlistAptImage = require('../../../assets/wishlistAptImage.webp')
const WishLists = ()=>{
    const dbUser = useSelector( state => state.user.dbUser)
    const wishList = useSelector( state => state.wish.wishList)
    const [apartment, setApartment] = useState([])
    const [editTrue, setEditTrue] = useState(false)
    const [openBottomSheet, setOpenBottomSheet] = useState(false)
    const {width, height} = useWindowDimensions()
    const [changeStatus, setChangeStatusBar] = useState(false)
    
    useFocusEffect(
        useCallback(() => {
          setChangeStatusBar(true)
          return () => setChangeStatusBar(false);
        }, [])
      );

    const getAllWishListedApartments = async ()=>{
         const allApt = []
         for (apt of wishList){
            const aptId = apt.apartmentId
            const getAllWishListApt = await DataStore.query(Apartment, aptId)
            console.log('getAllWishListApt : ', getAllWishListApt)
            allApt.push(getAllWishListApt)
         }
         console.log('allApt : ', allApt)
         setApartment(allApt)
    }

    useEffect(()=>{
        if(!wishList){
            return
        }
        getAllWishListedApartments()
    }, [wishList])
    
    const showEditMarker = ()=>{
        setEditTrue(!editTrue)
    }
   
    if(wishList?.length == 0 || !wishList){
         return(
            <GestureHandlerRootView style={{...styles.container, padding: 20}}>
                 { changeStatus && <StatusBar style="dark" backgroundColor="white" />}
                <View>
                    <Text style={styles.wishListText}>Wishlists</Text>
                </View> 
                <View style={styles.addWishlistInfoCont}>
                     <View style={styles.addWishListViewCont}>
                        <Image source={wishlistAptImage} style={styles.wishListImage}/>
                        <Text style={styles.addAptToWishListText}>Add apartments to wishlist</Text>
                        <Text style={styles.descText}>Add apartments to your wishlist to easily track your favorites and make informed decisions faster. <Text onPress={()=>{setOpenBottomSheet(true)}} style={styles.learnMore}>Learn more</Text></Text>
                     </View>
                <View>
                    <Text></Text>
                </View>
                </View>
                {openBottomSheet && <BottomSheet index={0} snapPoints={[60/100 * height]} enablePanDownToClose={true} handleIndicatorStyle={{display : 'none'}} onClose={()=>{setOpenBottomSheet(false)}} containerStyle={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{flex: 1}}>
                    { changeStatus && <StatusBar style="light" backgroundColor="rgba(0,0,0,0.5)" />}
                          <View style={styles.bottomSheetInfoCont}>
                            <AntDesign name="close" size={20} color="black" style={{marginRight: 15}} onPress={()=>{setOpenBottomSheet(false)}} />
                                <Text style={styles.addToText}>Add to wishlist</Text>
                                <FontAwesome name="heart" size={24} color="#FF0000" />
                          </View>
                          <View style={{flex: 1, padding: 20}}>
                            <Text style={styles.infoText}>Adding apartments to your wishlist allows you to track your favorite properties, compare them easily, and receive updates on their status, such as whether they are available, unavailable, or have been paid for by someone else.</Text>
                             <Text style={styles.infoText}>This ensures you stay informed about any changes, helping you act quickly if an apartment you love becomes available or needs to be removed from your list.</Text>
                          <Pressable onPress={()=>{setOpenBottomSheet(false)}} style={styles.gotItBtn}>
                             <Text style={styles.gotItText}>Got it</Text>
                          </Pressable>

                          </View>
                    </ScrollView>
                </BottomSheet>}
            </GestureHandlerRootView>
         )
    }
    return(
        <View style={styles.container}>
            { changeStatus && <StatusBar style="dark" backgroundColor="white" />}
          <View style={{padding: 20}}>
          <View style={{alignItems: 'flex-end'}}>
                <Text onPress={showEditMarker} style={styles.editBtn}>{editTrue? 'Done' : 'Edit'}</Text>
            </View>
            <View>
                <Text style={styles.wishListText}>Wishlists</Text>
            </View>
            
          </View>
          <FlatList showsVerticalScrollIndicator={false} data={apartment} renderItem={({item, index})=>{
            
             return(
               <ApartmentList apartment={item} mode={'wishlists'} wishlistIcon={true} edit={editTrue} wishListDbUser={dbUser}/>
             )
          }}/>
        </View>
    )
}

export default WishLists

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: 'white'
    },
    wishListText: {
        fontSize: 25, 
        fontWeight: '600', 
        letterSpacing: 1
    },
    addWishlistInfoCont: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    addWishListViewCont: {
        padding: 20, 
        backgroundColor: 'white', 
        elevation: 5, 
        width: '90%', 
        borderRadius: 20, 
        justifyContent: "center", 
        alignItems: 'center'
    },
    wishListImage: {
        width: 150, 
        height: 150, 
        borderRadius: 10
    },
    addAptToWishListText: {
        fontSize: 20, 
        fontWeight: '600', 
        textAlign:'center', 
        marginTop: 20,
        marginBottom: 10
    },
    descText: {
        color:'#4C4C4C', 
        textAlign:'center',
        fontSize: 14
    },
    learnMore: {
        textDecorationLine:'underline', 
        fontWeight:'500'
    },
    bottomSheetInfoCont: {
        flexDirection:'row', 
        alignItems:'center', 
        paddingHorizontal: 20, 
        borderBottomWidth: 1, 
        borderBottomColor: 'lightgray', 
        paddingBottom: 10
    },
    addToText: {
        fontSize: 16, 
        fontWeight: '600', 
        marginRight:"auto"
    },
    infoText: {
        color:'#4C4C4C', 
        fontSize: 16, 
        textAlign:'justify', 
        lineHeight: 25
    },
    gotItText: {
        color:'white', 
        fontWeight:'600', 
        fontSize: 16, 
        textAlign:'center'
    },
    gotItBtn: {
        backgroundColor:'black', 
        padding: 15, 
        borderRadius: 5, 
        width: '70%',
        alignSelf:'center',
        marginTop:'auto'
    },
    editBtn: {
        fontSize: 16, 
        textDecorationLine:'underline', 
        letterSpacing: 0.5, 
        fontWeight:'500'
    }
})