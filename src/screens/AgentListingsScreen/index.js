import {View, FlatList, Text, StyleSheet } from 'react-native'
import {useRoute, useNavigation} from '@react-navigation/native'
import ApartmentList from '../../components/ApartmentList'
import { Ionicons } from '@expo/vector-icons'

const AgentListingsScreen  = ()=>{
    const navigation = useNavigation()
    const route = useRoute()
    const {agent_apartments, hostData} = route.params
    return (
          <View style={styles.container}>
                <View style={styles.boxShadow}>
                    <Ionicons onPress={()=>{ navigation.goBack()}} name="chevron-back-sharp" size={30} color="#4C4C4C" style={{ marginRight: 20 }}/>
                    <Text style={styles.boxText}>{hostData.name}'s Listings</Text>
                </View>
                <View>
                    <Text style={styles.noOfPlaces}>{agent_apartments.length} places available</Text>
                </View>
               <FlatList showsVerticalScrollIndicator={false} data={agent_apartments} renderItem={({item})=> <ApartmentList apartment={item}/>}/>
              
               
          </View>
    )
}

export default AgentListingsScreen

const styles = StyleSheet.create({
    container: {
        flex : 1, 
        backgroundColor: "white"
    },
    boxShadow : {
                flexDirection:'row',
                alignItems: 'center',
                backgroundColor: 'white',
                elevation: 10,
                shadowColor: 'gray',
                paddingVertical: 15,
                paddingHorizontal: 20
            },
            boxText: {
                fontSize: 18, 
                fontWeight: '600', 
                letterSpacing: 0.5
            },
            noOfPlaces: {
                fontSize: 14, 
                fontWeight:'600', 
                textAlign:'center'
            }
    })