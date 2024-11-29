import { View, Text, Pressable, StyleSheet, useWindowDimensions} from 'react-native'
import { Feather, FontAwesome6} from '@expo/vector-icons'

const Header = ({ placeValue, setLocationModal, setModalVisible, goToCreateApartment, apartments})=>{
    const { width, height } = useWindowDimensions()
    const openFilterScreen = ()=>{
        setModalVisible(true)
    }

    const openSearchByLocationModal = ()=>{
        setLocationModal(true)
    }
    return (
        <View style={{...styles.home_header, width: width}}>
        <View style={styles.search_and_filter_Container}>
            <Pressable onPress={openSearchByLocationModal} style={{...styles.searchContainer, padding: placeValue? 10 : 15}}>
               <Feather name="search" size={30} color="black" style={styles.search_icon} />
               <View>
                  <Text style={styles.searchLocationText}>{placeValue? 'Showing results for' : 'Quick search your listings'}</Text>
                                <View style={styles.alignContainer}>
                                    <Text style={styles.searchText}>{placeValue? placeValue.status == 'AVAILABLE'? `${placeValue.theApts.length} Available Apartments` : placeValue.status == 'UNAVAILABLE'? `${placeValue.theApts.length} Unavailable Apartments` : `${placeValue.theApts.length} Paid Apartments` : 'Search listings by availability'}</Text>
                                </View>
            </View>
            </Pressable>
            <Pressable onPress={openFilterScreen} style={styles.filter_icon}>
                     <FontAwesome6 name="sliders" size={18} color="black"  />
            </Pressable>
        </View>
        <View style={styles.hostAptCont}>
            <Text style={styles.hostAptContLabel}>Your Listings</Text> 
        {apartments?.length >= 1 && <Pressable onPress={()=>{goToCreateApartment()}} style={styles.hostAptButton}>
        <Text style={styles.hostAptText}>Host Apartment</Text>
        </Pressable>}
        </View>
    </View>
    )
}

export default Header

const styles = StyleSheet.create({
    home_header: {
        elevation: 5,
        shadowColor: 'gray',
        padding: 20,
        zIndex: 1,
        backgroundColor: 'white'
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
        marginRight: 10,
        elevation: 5,
        shadowColor:'gray'
    },
    search_icon: {
        marginRight: 20, 
    },
    filter_icon: {
        width: 50,
        height: 50,
        borderRadius : 50,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: 'gray',
        backgroundColor: 'white'
    },
    searchLocationText: {
        fontSize: 16,
        fontWeight: '500'
    },
    alignContainer: {
        flexDirection: 'row', 
        alignItems: 'center'
    },
    hostAptCont: {
        marginTop: '10%', 
        flexDirection: "row", 
        alignItems: 'center'
    },
    hostAptContLabel: {
        fontSize: 25, 
        fontWeight: '600', 
        fontFamily: 'serif',
        marginRight: 'auto'
    },
    hostAptButton: {
        borderWidth: 2, 
        borderColor:'#FF0000', 
        padding: 5,
        borderRadius: 5
    },
    hostAptText: {
        fontSize: 14, 
        fontWeight: '500'
    },
    placeValueText: {
        fontSize: 14, 
        fontWeight: '600', 
        color: '#4C4C4C'
    },
    searchText: {
        fontSize: 12, 
        fontWeight: '500', 
        color: '#4C4C4C'
    }
})