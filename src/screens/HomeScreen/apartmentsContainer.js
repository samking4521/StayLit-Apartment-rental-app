import { View, Text, FlatList, StyleSheet, Image} from 'react-native'
import ApartmentList from '../../components/ApartmentList'

const ApartmentsContainer = ({apartments})=>{
  
    return(
        <View style={{flex: 1}}>
        {
            apartments?.length !== 0? 
            <View style={styles.apartmentListContainer}>
            <View>
                <Text style={styles.placesLength}>{apartments.length} places available</Text>
            </View>
            <FlatList
            showsVerticalScrollIndicator={false}
            data={apartments}
            renderItem={({ item }) => <ApartmentList apartment={item} mode={'main'}/>}
            keyExtractor={(item) => item.id}
      />
         </View> : 
         <View style={{...styles.apartmentListContainer, alignItems:'center'}}>
         <View>
             <Text style={styles.placesLength}>0 places available</Text>
             <View style={styles.noAptListedCont}>
                <Image source={require('../../../assets/apartmentHostImage.jpeg')} style={styles.noAptListedImage}/>
                <Text style={styles.noAptListedText}>No Apartments Available</Text>
                <Text style={styles.noAptListedDescText}>Currently, no apartment is available in your chosen location. Please check other areas.</Text>
        </View>        
         </View>
         
      </View>
        }
            </View>
        
    )
}

export default ApartmentsContainer

const styles =  StyleSheet.create({
    placesLength: {
    fontWeight: '600', 
    fontSize: 14,
    letterSpacing: 0.5, 
    textAlign: 'center'
    },
    noAptListedCont: {
        width: '80%', 
        marginTop: 30, 
        justifyContent:"center", 
        alignItems:'center', 
        backgroundColor:'white', 
        elevation: 5, 
        borderRadius: 20, 
        padding: 20
    },
    noAptListedText: {
        fontSize: 18, 
        fontWeight:'600', 
        marginTop: 15
    },
    noAptListedImage: {
        width: 250, 
        height: 200, 
        borderRadius: 10
    },
    noAptListedDescText: {
        color:'#4C4C4C', 
        fontWeight:'500', 
        fontSize: 14, 
        textAlign:'center', 
        marginBottom: 10
    },
    apartmentListContainer:{
        flex: 1, 
        backgroundColor:'white'
    }
})