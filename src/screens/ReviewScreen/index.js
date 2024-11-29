import { useState, useEffect } from 'react'
import { View, Text, Pressable, Modal, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { Entypo, MaterialIcons, Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import Reviews from '../../components/Reviews'
import { useAuthContext } from '../../Context/hostContext'
import { DataStore } from 'aws-amplify/datastore'
import { AllReviews } from '../../models'
import { StatusBar } from 'expo-status-bar'

const ReviewScreen = ({mode})=>{
  const route = useRoute()
  if(mode !== 'host'){
    var { Agent_Reviews, averageReviewStar } = route.params
  }
  const { dbHost } = useAuthContext()
  const [agent_rev, setAgent_rev] = useState(Agent_Reviews)
  const [showModalSort, setShowModalShow] = useState(false)
  const [allAgentRev, setAllAgentRev] = useState(null) 
  const [AllAgentRev, SetAllAgentRev] = useState(null)
  const [averageRevStar, setAverageRevStar] = useState(null)

  const getAverageReviewStarLength = async ()=>{
    const reviewArr = await DataStore.query(AllReviews, (r)=> r.hostID.eq(dbHost.id))
    console.log('reviewArr : ', reviewArr)
    calculateAverageReviewStar(reviewArr)
    setAllAgentRev(reviewArr)
    SetAllAgentRev(reviewArr)
}

const calculateAverageReviewStar = (reviewArr)=>{
   
     const starLengths = reviewArr.reduce((a, review)=>{
            return a + review.starLength
     }, 0)
     console.log('StarLength : ', starLengths)
     const averageRevStar = starLengths/reviewArr.length
     setAverageRevStar(averageRevStar)
}

useEffect(()=>{
  if(!dbHost || mode !== 'host'){
    return
  }
  getAverageReviewStarLength()
 }, [dbHost, mode])
   
    return(
       <View style={styles.container}>
              <FlatList data={mode == 'host'? allAgentRev : agent_rev}
              ListHeaderComponent={ReviewHeader(averageRevStar, mode, showModalSort, setShowModalShow, mode== 'host'? setAllAgentRev : setAgent_rev, mode == 'host'? allAgentRev : agent_rev, mode=='host'? AllAgentRev : Agent_Reviews)} 
              renderItem={({item})=>{
                 return(
                  <Reviews item={item} mode={'vertical'} averageReviewStar={mode=='host'? averageRevStar : averageReviewStar} Agent_Reviews={mode == 'host'? allAgentRev : agent_rev}/>
           )
        }} showsVerticalScrollIndicator={false}/>
            
            {showModalSort && <View style={{...StyleSheet.absoluteFillObject, backgroundColor:'rgba(0,0,0,0.5)'}}/>}
    </View> 
    )
}

export default ReviewScreen

const ReviewHeader = (averageRevStar, mode, showModalSort, setShowModalShow, setAgent_rev, agent_rev, Agent_Reviews)=>{
  const route = useRoute()
  if(mode !== 'host'){
    var {avgRevStar} = route.params

  }
  const [filterText, setFilterText] = useState('Most Recent')
  const [radBtnValue, setRadBtnValue] = useState('Recent')
 

   const closeRadBtnModal = ()=>{
    if(filterText=='Most Recent'){
      setRadBtnValue('Recent')
      setShowModalShow(false)
    }
    if(filterText=='Highest Rated'){
      setRadBtnValue('High')
      setShowModalShow(false)
    }
    if(filterText=='Lowest Rated'){
      setRadBtnValue('Low')
      setShowModalShow(false)
    }
   }
  
  
   const filterReview = ()=>{
    if(radBtnValue == 'Recent'){
     setAgent_rev(Agent_Reviews)
     setShowModalShow(false)
     setFilterText('Most Recent')
    }
    if(radBtnValue == 'High'){
      const filteredRev = Agent_Reviews?.filter((rev)=>{
          return(
            rev.starLength>=3 && rev.starLength<=5
          )
      })
      const recentReviews = filteredRev.sort((a, b )=>{
          if (a.starLength !== b.starLength){
            return b.starLength - a.starLength
          }
          return new Date(b.date) - new Date(a.date)
      })
      setAgent_rev(recentReviews)
      setShowModalShow(false)
      setFilterText('Highest Rated')

    }
    if(radBtnValue == 'Low'){
      const filteredRev = Agent_Reviews?.filter((rev)=>{
        return(
          rev.starLength>=1 && rev.starLength<=2
        )
    })
    const recentReviews = filteredRev.sort((a, b )=>{
        if (a.starLength !== b.starLength){
          return a.starLength - b.starLength
        }
        return new Date(b.date) - new Date(a.date)
          
    })
    setAgent_rev(recentReviews)
    setShowModalShow(false)
    setFilterText('Lowest Rated')
    
    }
   }

  return(
    <View>
         
         <View style={{ padding : 40, alignItems:'center', borderBottomWidth: 1, borderBottomColor:'lightgray'}}>
            <View style={styles.alignContainer}>
                    <Entypo name="star" size={45} color="black" style={{marginRight: 10}}/>
                    <Text style={styles.headerText}>{Agent_Reviews?.length>=2? mode == 'host'? averageRevStar?.toFixed(1) : avgRevStar?.toFixed(1) : 'New'} &#8226; {Agent_Reviews?.length == 0 || !Agent_Reviews? 0 : Agent_Reviews?.length} <Text style={{fontSize: 35}}>reviews</Text></Text>
            </View>
            { (Agent_Reviews?.length <=1 || !Agent_Reviews) && <Text style={{color:"#4C4C4C", textAlign:'center', fontWeight:'500', fontSize: 14, marginTop: 10}}>The average review star rating for a host is displayed once at least two reviews have been submitted.</Text>}         
       </View>
            <View style={{marginTop: 10, ...styles.filterContainer}}>
              { Agent_Reviews?.length >= 1 && <Pressable onPress={()=>{setShowModalShow(true)}} style={styles.sortReviewCont}>
                  <Text style={styles.sortText}>{filterText}</Text>
                  <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
              </Pressable>}
            </View>
        {  (Agent_Reviews?.length == 0 || !Agent_Reviews) && <View style={{paddingVertical: 40}}>
            <Text style={styles.noReviewText}>Oops! No Reviews Yet</Text>
        </View>}
        {  (agent_rev?.length == 0 && Agent_Reviews?.length >= 1)  && <View style={{paddingVertical: 40}}>
            <Text style={styles.noReviewText}>Oops! No Reviews For This Category</Text>
        </View>}

           <Modal visible={showModalSort} presentationStyle='overFullScreen' transparent={true} onRequestClose={closeRadBtnModal}>
               <StatusBar style='light' backgroundColor='rgba(0,0,0,0.5)'/>
               <View style={{flex: 1, backgroundColor:'rgba(0,0,0,0.5)', justifyContent:'center', alignItems:'center'}}>
                      <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                        <Ionicons name="close" size={25} color="black" style={{ marginRight: 15}} onPress={closeRadBtnModal}/>
                            <Text style={styles.sortByText}>Sort by</Text>
                        </View>

                        <View style={{paddingVertical: 10}}>
                          <TouchableOpacity onPress={()=>{
                                  setRadBtnValue('Recent')
                          }} style={styles.sortButtons}>
                            <Text style={{fontSize: radBtnValue == 'Recent'? 20 : 18, letterSpacing:0.5, fontWeight: radBtnValue == 'Recent'? '500' : '400'}}>Most Recent</Text>
                            {radBtnValue == 'Recent'?  <Ionicons name="radio-button-on" size={30} color="black" /> : 
                            <Ionicons name="radio-button-off" size={30} color="gray" />}
                          </TouchableOpacity>
                          <TouchableOpacity onPress={()=>{ 
                              setRadBtnValue('High') 
                            }} 
                              style={styles.sortButtons}>
                            <Text style={{fontSize: radBtnValue == 'High'? 20 : 18, letterSpacing:0.5, fontWeight:radBtnValue == 'High'? '500' : '400'}}>Highest Rated</Text>
                            {radBtnValue == 'High'?  <Ionicons name="radio-button-on" size={30} color="black" /> : 
                            <Ionicons name="radio-button-off" size={30} color="gray" />}
                          </TouchableOpacity>

                          <TouchableOpacity onPress={()=>{ 
                            setRadBtnValue('Low')
                          }} 
                            style={{...styles.sortButtons, marginBottom: 0}}>
                            <Text style={{fontSize: radBtnValue == 'Low'? 20 : 18, letterSpacing:0.5, fontWeight:radBtnValue == 'Low'? '500' : '400'}}>Lowest Rated</Text>
                            {radBtnValue == 'Low'?  <Ionicons name="radio-button-on" size={30} color="black" /> : 
                            <Ionicons name="radio-button-off" size={30} color="gray"  style={{borderColor: 'red'}} />}
                          </TouchableOpacity>
                        </View>
                        <View style={styles.saveContainer}>
                            <Pressable onPress={filterReview} style={styles.saveBtn}>
                                <Text style={styles.saveText}>Save</Text>
                            </Pressable>
                          </View>
                    </View>
               </View>
            
        </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
     container : {
      flex: 1, 
      backgroundColor:'white'
     },
     headerText: {
      fontSize: 35, 
      fontWeight: '600'
     },
     alignContainer: {
      flexDirection:'row', 
      alignItems:'center'
     },
     filterContainer: {
      borderTopColor: 'gray', 
      alignSelf:'flex-end',
      padding: 20
     },
     reviewLengthText: {
      fontSize: 25, 
      fontWeight: '600'
     },
     sortReviewCont: {
      flexDirection:'row', 
      alignItems:'center',
      borderWidth: 0.5, 
      borderRadius: 20, 
      paddingVertical: 5, 
      paddingHorizontal: 10, 
      borderColor:'gray'
     },
     sortText: {
      marginRight: 10, 
      textAlign:'center'
     },
     modalContainer: {
      width: '80%', 
      height: 300, 
      backgroundColor:'white', 
      borderRadius: 20, 
      padding: 20
     },
     modalHeader: {
      flexDirection:'row', 
      alignItems:'center', 
      borderBottomWidth: 0.5, 
      borderBottomColor:'gray',
     paddingBottom: 10
     },
     sortByText: {
      fontSize: 20, 
      fontWeight:'600', 
      letterSpacing:0.5
     },
     sortButtons: {
      flexDirection:'row', 
      alignItems:'center', 
      justifyContent:'space-between', 
      marginBottom: 20 
     },
     saveContainer: {
        borderTopWidth:0.5, 
        borderTopColor:'gray', 
        justifyContent:'center', 
        flex: 1
     },
     saveBtn: {
      alignSelf:'center',
      backgroundColor:'black', 
      width: '80%', 
      padding: 15, 
      borderRadius: 10,
      marginTop: 10
    },
    saveText: {
      textAlign:'center', 
      color:'white', 
      fontWeight:'600', 
      fontSize: 18
    },
    noReviewText: {
      textAlign:'center', 
      color:'#F52F57', 
      fontSize: 16, 
      fontWeight:'500'
    }
})
