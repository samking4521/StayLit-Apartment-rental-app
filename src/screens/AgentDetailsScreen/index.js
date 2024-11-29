import { useEffect, useState } from "react";
import { View, Text , Image, StyleSheet, Pressable, ScrollView, FlatList} from "react-native";
import {useRoute, useNavigation} from '@react-navigation/native'
import {FontAwesome, Fontisto, AntDesign, MaterialCommunityIcons, Entypo} from '@expo/vector-icons'
import ApartmentList from "../../components/ApartmentList";
import { DataStore } from 'aws-amplify/datastore'
import { Apartment } from "../../models";
import { StatusBar } from "expo-status-bar";
import { Buffer } from "buffer";

const URL = 'https://dr4jupy057c0c.cloudfront.net/'
const bucket = 'staylit-storage-1914deba97d11-staging'

const AgentDetailsScreen = ()=>{
    const route = useRoute()
    const { hostData, totalRevLength, starReview} = route.params
    const [agentListings, setAgentListings] = useState(null)
    const navigation = useNavigation()
    const [hostImage, setHostImage] = useState(null)


    useEffect(()=>{
        if(hostData){
            getHostImageUrl(hostData?.key)
        }
    }, [hostData])

    const getHostImageUrl = (imageKey)=>{
        const imageRequest = JSON.stringify(
          {
            "bucket": bucket,
            "key": `public/${imageKey}`,
            "edits": {
              "resize": {
                "width": 130,
                "height": 130,
                "fit": "cover"
              }
            }
          }
        )
        const encoded = Buffer.from(imageRequest).toString('base64')
        setHostImage(`${URL}${encoded}`)
       
       }
      
    const getJoinDate = ()=>{
        const localeDateString = hostData?.date; // Example localeDateString in MM/DD/YYYY format
    
        // Split the string by the slash ("/") to extract month, day, and year
        const [month, , yearTime] = localeDateString.split('/');
        // Extract the year by splitting the yearTime and taking the first part
        const [year] = yearTime.trim().split(',');  
        console.log(`Month: ${month}, Year: ${year}`); // Outputs: "Month: 8, Year: 2023"
        const theMonth = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        return `${theMonth[month - 1]}, ${year}`
      }
    
     

    useEffect(()=>{
        if(!hostData){
          return
        }
        getAllAgentApartments()
       }, [hostData])
  
       const getAllAgentApartments = async ()=>{
        const allAgentApartments = await DataStore.query(Apartment, (a)=> a.and(a => [
          a.hostID.eq(hostData.id),
          a.status.eq('AVAILABLE')  
      ]));
        setAgentListings(allAgentApartments)
      }

   const navigateToAgentListings = ()=>{
       navigation.navigate('AgentListings', {
          agent_apartments : agentListings,
          hostData : hostData
       })
   }
  
  
 
    return(
        <View style={styles.container}>
             <StatusBar style="dark" backgroundColor={'white'}/>
            <View style={styles.header}>
                <AntDesign onPress={()=>{navigation.goBack()}} name="arrowleft" size={25} color="black" style={{ alignSelf:'flex-start' }} />
            </View>
            <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
            <View style={styles.box}>
                    <View style={styles.imageCont}>
                        {hostImage? <Image source={{uri : hostImage}} style={styles.image}/> : <View style={{width: 130, height: 130, borderRadius: 130, justifyContent:'center', alignItems:'center', backgroundColor:'lightgray'}}><Text style={{fontWeight:'700', fontSize: 40, color:'white'}}>{hostData?.name[0]}</Text></View>}
                    </View>
                    <View>
                        <Text style={styles.name}>{hostData.name}</Text>
                        <Text style={styles.bioData}>{hostData.state}, {hostData.country}</Text>
                        <View style={styles.hostRevCont}>
                                        <Text style={styles.revText}>Agent  &#8226;  </Text>
                                        <Fontisto name="star" size={16} color="#D4C63B" style={{marginRight: 2}} />
                                        <Text style={styles.starLength}>{starReview? starReview.toFixed(1) : 'New'}</Text>
                                </View>
                         <Text style={styles.revText}>Joined &#8226; {getJoinDate()}</Text>
                    </View>
              </View>
          
           <View style={styles.infoListCont}>
                <View style={styles.infoList}>
                       <FontAwesome name="star" size={22} color="black" style={styles.iconStyle}/>
                       <Text style={styles.hostInfoText}>{totalRevLength.length>=2? starReview.toFixed(1) : 'New'} &#8226; {totalRevLength.length} Reviews</Text>
                </View>
                <View style={styles.infoList}>
                <MaterialCommunityIcons name="family-tree" size={22} color="black" style={styles.iconStyle}/>
                <Text style={styles.hostInfoText}>{hostData.ethnicity}</Text>
                </View>
                <View style={styles.infoList}>
                <Entypo name="language" size={22} color="black" style={styles.iconStyle}/>
                 <Text style={styles.hostInfoText}>Speaks {hostData.language}, {hostData.secondLanguage}</Text>
                </View>
                <View style={styles.infoList}>
                <Entypo name="location-pin" size={22} color="black" style={styles.iconStyle}/>
                 <Text style={styles.hostInfoText}>Lives in {hostData.state}, {hostData.country}</Text>
                </View>
              </View>
             { agentListings?.length >= 1? <View style={styles.hostApartmentsContainer}>
                 <Text style={styles.hostNameApt}>{hostData.name}'s listing</Text>
                     <FlatList showsHorizontalScrollIndicator={false} data={agentListings} renderItem={({item})=> <ApartmentList apartment={item} mode={'horizontal'}/>} horizontal contentContainerStyle={{paddingRight: 10}} />
                 {
                    agentListings?.length>=3 && (
                        <Pressable onPress={navigateToAgentListings} style={styles.seeMoreBtn}>
                        <Text style={styles.seeMoreText}>Show all {agentListings?.length} Listings</Text>
                    </Pressable>
                    )
                 } 
              </View> : null }
              </ScrollView>
        </View>
     
    )
}

export default AgentDetailsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor:'white'
    },
    header: {
        paddingVertical: 10, 
        paddingHorizontal: 20
    },
    box : {
        backgroundColor:'white',
        borderRadius: 10,
        padding: 10,
        alignSelf:'center',
        alignItems:'center',
        elevation: 5,
        width: '90%',
        marginBottom: 15
      },
      imageCont : {
        borderWidth: 2, 
        borderColor:'lightgray', 
        borderRadius: 130, 
        marginBottom: 10
      },
      image: {
        width: 130, 
        height: 130, 
        borderRadius: 130
      },
      name : {
        textAlign:"center", 
        fontSize: 18, 
        fontWeight:'600'
      },
      bioData: {
        textAlign:"center", 
        fontSize: 14, 
        fontWeight:"500", 
        color:'#4C4C4C'
      },
      hostRevCont: {
        flexDirection:'row', 
        alignItems:'center', 
        justifyContent:"center"
      },
      revText: {
        textAlign:"center", 
        fontSize: 14, 
        fontWeight:"500", 
        color:'#4C4C4C'
      },
      starLength: {
        fontWeight:"600", 
        fontSize: 14,
        color:'#4C4C4C'
      },
    infoDetailCont: {
        borderBottomWidth: 0.5, 
        borderBottomColor: 'gray', 
        paddingBottom: 10
    },
    infoDetailContV: {
        borderBottomWidth: 0.5, 
        borderBottomColor: 'gray', 
        paddingVertical: 10
    },
    infoText: {
        fontSize: 20, 
        fontWeight: '600', 
        letterSpacing: 0.5
    },
    highLightText: {
        fontSize: 12, 
        fontWeight: '400'
    },
    infoListCont: {
        borderBottomWidth: 0.5, 
        color: 'gray', 
        paddingBottom: 20
    },
    infoList: {
        flexDirection:'row', 
        alignItems:'center', 
        marginBottom: 5
    },
    iconStyle: {
        marginRight: 10, 
        width: '7%'
    },
    hostInfoText: {
        fontSize: 15, 
        fontWeight: '400', 
        color: '#4C4C4C'
    },
    hostApartmentsContainer: {
        flex: 1, 
        paddingVertical: 30
    },
    hostNameApt: {
        fontSize: 18,
        letterSpacing: 0.5, 
        fontWeight: '500', 
        paddingBottom: 15
    },
    seeMoreBtn: {
        borderWidth: 1, 
        paddingVertical: 10, 
        marginHorizontal: 10, 
        borderRadius: 10, 
        marginTop: 30
    },
    seeMoreText: {
        textAlign:'center', 
        fontSize: 14, 
        fontWeight: '500', 
        letterSpacing:0.5
    }
})