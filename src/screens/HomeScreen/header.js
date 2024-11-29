import { View, Text, Pressable, StyleSheet, useWindowDimensions} from 'react-native'
import { Feather, FontAwesome6, Entypo} from '@expo/vector-icons'

const Header = ({showPlaceValue, setLocationModal, setModalVisible, aptSearchId, theAptTitle})=>{
     const { width, height} = useWindowDimensions()

    const openFilterScreen = ()=>{
        setModalVisible(true)
    }
    const openSearchByLocationModal = ()=>{
        setLocationModal(true)
    }

    return (
        <View style={{...styles.home_header, width}}>
        <View style={styles.search_and_filter_Container}>
            <Pressable onPress={openSearchByLocationModal} style={{...styles.searchContainer, padding: showPlaceValue? 10 : 10}}>
               <Feather name="search" size={25} color="black" style={styles.search_icon} />
               <View>
                  <Text style={styles.needAPlaceText}>{!showPlaceValue? 'Need a Place to Stay' : 'Showing results for'}?</Text>
                  { showPlaceValue? <View style={{flexDirection:'row', alignItems:'center'}}>
                                    <Entypo name="location-pin" size={20} color="red" style={{marginRight: 2}}/>
                                    <Text style={{fontSize: 14, fontWeight: '600', color: '#4C4C4C'}}>{aptSearchId? theAptTitle? theAptTitle : 'No places found' : showPlaceValue}</Text>
                                </View> : <Text style={{fontSize: 12, fontWeight: '600', color: '#4C4C4C'}}>Search places by location or ID</Text>}
               </View>
            </Pressable>
            <Pressable onPress={openFilterScreen} style={styles.filter_icon}>
                     <FontAwesome6 name="sliders" size={18} color="black"  />
            </Pressable>
        </View>
        <View style={{marginTop: '10%'}}>
            <Text style={styles.apartmentLabel}>Apartments</Text> 
        </View>
    </View>
    )
}

export default Header

const styles =  StyleSheet.create({
    home_header: {
                elevation: 5,
                shadowColor: 'gray',
                padding: 20,
                backgroundColor: 'white',
                position: 'relative',
                zIndex: 1
            },
        apartmentLabel: {
            fontSize: 25, 
            fontWeight: '600', 
            fontFamily:'serif'
        },
    search_and_filter_Container: {
        flexDirection : 'row',
        alignItems:'center'
    },
    searchContainer: {
                backgroundColor: 'white',
                borderRadius : 30,
                width : '80%', 
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: 'auto',
                elevation: 5,
                shadowColor: 'gray',
            },
        search_icon: {
            marginRight: 15, 
        },
    filter_icon: {
        elevation: 5,
        width: 50,
        height: 50,
        borderRadius : 50,
        backgroundColor:'white',
        justifyContent:"center",
        alignItems:'center'
    },
    needAPlaceText: {
        fontSize: 15, 
        fontWeight:'600'
    }
})