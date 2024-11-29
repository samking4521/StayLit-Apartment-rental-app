import { View, FlatList, Text, Pressable, Modal, Image, StyleSheet} from 'react-native'
import HostApartmentList from '../../components/HostApartmentList'


const HostApartmentContainer = ({ placeValue, apartments, setDeletingAptModal, loading, goToCreateApartment})=>{
    return(
    <View style={{flex: 1, backgroundColor:"white"}}>
       { apartments?.length>=1?
          <View style={{flex: 1}}>
            <View style={{alignSelf:'center'}}>
                <Text style={styles.placeAvalText}>{placeValue? placeValue.theApts.length : apartments.length} places listed</Text>
            </View>
               
            <View  style={styles.bottomSheetContainer} >
            <FlatList
            showsVerticalScrollIndicator={false}
            data={apartments}
            renderItem={({item})=><HostApartmentList apartment={item} setDeletingAptModal={setDeletingAptModal}/>}
            keyExtractor={(item) => item.id}
      />
            </View>
        </View> 
                : 
     <View style={styles.noAptCont}>
         <View style={styles.noHostAptCont}>
                <Image source={require('../../../assets/apartmentHostImage.jpeg')} style={styles.imageStyle}/>
                <Text style={styles.noAptHeaderText}>{placeValue? placeValue.status == 'AVAILABLE'? 'No Listings Available': placeValue.status == 'UNAVAILABLE'? 'No Listings Unavailable' : 'No Listings Paid': 'No Listings Available'}</Text>
                <Text style={styles.noHostAptDescText}>List your apartment with us. It's easy to setup, no hassle, and start earning effortlessly. Get started today!</Text>
        </View> 
              <Pressable onPress={()=>{goToCreateApartment()}} style={styles.hostAptButton}>
                        <Text style={styles.hostAptText}>Host Apartment</Text>
             </Pressable>
            <Modal visible={loading} presentationStyle='fullScreen' onRequestClose={()=>{}}>
                     <View style={styles.modalContainer}>
                            <View style={styles.loadingGifCont}>
                                    <Image source={require('../../../assets/loadingGif.gif')} style={styles.loadingGif}/>               
                            </View>
                            <Text style={styles.switchingHostText}>Switching to Hosting...</Text>
                    </View>  
            </Modal>
            </View>
        }
            </View>
    )
}

export default HostApartmentContainer

const styles = StyleSheet.create({
   placeAvalText : {
        fontWeight: '600', 
        fontSize: 16, 
        letterSpacing: 0.5
   },
    bottomSheetContainer: {
        flex: 1
    },
    noAptCont: {
        flex: 1, 
        alignItems: 'center'
    },
    noHostAptCont: {
        width: '80%',
        marginTop: 30,
        marginBottom: '10%', 
        justifyContent:"center", 
        alignItems:'center', 
        backgroundColor:'white', 
        elevation: 5, 
        borderRadius: 20, 
        padding: 20
    },
    imageStyle: {
        width: 250, 
        height: 200, 
        borderRadius: 10
    },
    noAptHeaderText: {
        fontSize: 20, 
        fontWeight: '600', 
        marginTop: 15
    },
    noHostAptDescText: {
        color: '#4C4C4C', 
        fontWeight: '500', 
        fontSize: 14, 
        textAlign: 'center', 
        marginBottom: 10
    },
    hostAptButton: {
        backgroundColor: '#8B0000', 
        borderRadius: 10,
        padding: 15
    },
    hostAptText: {
        fontSize: 16, 
        fontWeight: '500', 
        color: 'white', 
        textAlign:'center'
    },
    modalContainer: {
        flex: 1, 
        backgroundColor: 'white', 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    loadingGifCont: {
        backgroundColor: 'white', 
        justifyContent:'center', 
        alignItems:'center', 
        width: 150, 
        height: 150, 
        elevation: 5, 
        borderRadius: 20
    },
    loadingGif: {
        width: 100, 
        height: 100
    },
    switchingHostText: {
        color: '#FF0000', 
        fontWeight:'600', 
        fontSize: 16, 
        marginTop: 15
    }
})