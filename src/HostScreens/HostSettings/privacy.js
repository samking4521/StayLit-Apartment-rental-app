import {View, Text, Image, ScrollView, StyleSheet} from 'react-native'
import {Ionicons, Entypo} from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';

const PrivacyPolicy = ()=>{
    const navigation = useNavigation()

    return (
        <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Ionicons onPress={()=>{navigation.goBack()}} name="arrow-back" size={24} color="black" style={{marginRight: 20}}/>
                    <Text style={styles.headerText}>Privacy Policy</Text>
                </View>
                <View style={styles.mainContainer}>
                    <View>
                        <Text style={styles.leotPrivacyLabel}>Leot Privacy</Text>
                        <Image source={require('../../../assets/privacyImage.jpg')} style={styles.imageStyle}/>
                    </View>
                    <View style={{marginVertical: 20}}>
                        <Text style={styles.descText}>Welcome to Leot, we are committed to protecting your privacy and ensuring that your personal information is handled securely and responsibly. This Privacy Policy outlines how we collect, use, and protect your data when you use our app or interact with our services.</Text>
                        <Text style={styles.termsBoldText}>1. Information We Collect</Text>
                        <Text style={styles.introText}>We collect the following types of information:</Text>
                        <View style={{marginBottom: 10}}>
                          <Text style={styles.privacyText}><Text style={styles.privacyTextBold}>Personal Information: </Text>This includes your name, email address, phone number, payment details, and other information you provide when you sign up, create a profile, or interact with our services.</Text>  
                        </View>
                        <View style={{marginBottom: 10}}>
                            <Text style={styles.privacyText}><Text style={styles.privacyTextBold}>Property Information:</Text> Details about the properties you list or rent, including addresses, descriptions, photos, and pricing.</Text>
                        </View>
                        <View style={{marginBottom: 10}}>
                            <Text style={styles.privacyText}><Text style={styles.privacyTextBold}>Usage Data:</Text> Information about how you interact with our app, including search queries, viewed properties, and communication between hosts and renters.</Text>
                        </View>
                        <View style={{marginBottom: 10}}>
                            <Text style={styles.privacyText}><Text style={styles.privacyTextBold}>Location Data: </Text>With your consent, we may collect your location data to improve our services, such as showing properties near you.</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={styles.termsBoldText}>2. How We Use Your Information</Text>
                        <Text style={styles.labelDesc}>We use the information we collect to: </Text>
                        <View style={{padding: 5}}>
                        <View style={styles.privacyPolicyCont}>
                                <Entypo name="dot-single" size={28} color="black" style={{marginRight: 5}} />
                                <Text style={styles.privacyText}>Facilitate the renting process between hosts and renters.</Text>
                        </View>
                        <View style={styles.privacyPolicyCont}>
                                <Entypo name="dot-single" size={28} color="black" style={{marginRight: 5}}/>
                                <Text style={styles.privacyText}>Improve and personalize your experience with our app.</Text>
                        </View>
                        <View style={styles.privacyPolicyCont}>
                                <Entypo name="dot-single" size={28} color="black" style={{marginRight: 5}}/>
                                <Text style={styles.privacyText}>Process payments and manage transactions.</Text>
                        </View>
                        <View style={styles.privacyPolicyCont}>
                                <Entypo name="dot-single" size={28} color="black" style={{marginRight: 5}}/>
                                <Text style={styles.privacyText}>Provide customer support and respond to inquiries.</Text>
                        </View>
                        <View style={styles.privacyPolicyCont}>
                                <Entypo name="dot-single" size={28} color="black" style={{marginRight: 5}}/>
                                <Text style={styles.privacyText}>Send you updates, notifications, and promotional materials (with your consent).</Text>
                        </View>
                        <View style={styles.alignContainer}>
                                <Entypo name="dot-single" size={28} color="black" style={{marginRight: 5}}/>
                                <Text style={styles.privacyText}>Ensure compliance with legal obligations and enforce our terms of service.</Text>
                        </View>
                        </View>
                        
                        <View style={{marginTop: 20}}>
                            <Text style={styles.termsBoldText}>3. Sharing Your Information</Text>
                            <Text style={styles.labelDesc}>We may share your information with: </Text>
                            <View style={{...styles.alignContainer, marginBottom: 5}}>
                                    <Entypo name="dot-single" size={28} color="black" style={{marginRight: 5}}/>
                                    <Text style={{...styles.privacyText, paddingRight: 5}}><Text style={styles.privacyTextBold}>Hosts and Renters: </Text>To facilitate the renting process, relevant information will be shared between parties involved in a transaction.</Text>
                            </View>
                            <View style={styles.privacyPolicyCont}>
                                    <Entypo name="dot-single" size={28} color="black" style={{marginRight: 5}}/>
                                    <Text style={styles.privacyText}><Text style={styles.privacyTextBold}>Service Providers: </Text>Third-party companies that help us provide and improve our services, such as payment processors, hosting providers, and customer support.</Text>
                            </View>
                            <View style={styles.privacyPolicyCont}>
                                    <Entypo name="dot-single" size={28} color="black" style={{marginRight: 5}}/>
                                    <Text style={styles.privacyText}><Text style={styles.privacyTextBold}>Legal Authorities: </Text>If required by law or necessary to protect our rights, property, or the safety of our users.</Text>
                            </View>
                        </View>
                        <View style={{marginTop: 20}}>
                            <Text style={styles.termsBoldText}>4. Data Security</Text>
                            <Text style={{...styles.privacyText, marginTop: 5}}>We take data security seriously and implement measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, so we cannot guarantee absolute security.</Text>
                        </View>
                        <View>
                            <Text style={styles.contactHeader}>Need to get in touch?</Text>
                            <Text onPress={()=>{navigation.navigate('ContactUs')}} style={styles.contactText}>Contact us</Text>
                        </View>
                    </View>
                </View>
        </ScrollView>
    )
}

export default PrivacyPolicy

const styles = StyleSheet.create({
   container: {
    backgroundColor:'#FAFAFA'
   },
   mainContainer: {
    flex: 1, 
    padding: 20
   },
   header: {
    flexDirection:"row", 
    alignItems:'center', 
    padding: 20, 
    borderBottomWidth: 1, 
    borderBottomColor:'lightgray'
   },
   headerText: {
    fontSize: 18, 
    fontWeight:'600'
   },
   descText: {
    fontSize: 16, 
    fontWeight:'400', 
    lineHeight: 20, 
    marginBottom: 10
   },
   leotPrivacyLabel: {
    fontSize: 30, 
    fontWeight:'600', 
    marginBottom: 10
   },
   imageStyle: {
    width: '100%', 
    height: 250, 
    borderTopLeftRadius: 0, 
    borderTopRightRadius: 0, 
    borderBottomLeftRadius: 20, 
    borderBottomRightRadius: 20
   },
   termsBoldText: {
    fontSize: 18, 
    fontWeight: '600'
   },
   introText: {
    fontSize: 16, 
    fontWeight:'500', 
    marginVertical: 10
   },
   privacyText: {
    fontSize: 16, 
    lineHeight: 20
   },
   privacyTextBold: {
    fontSize: 16, 
    fontWeight:'600'
   },
   labelDesc: {
    fontSize: 16, 
    fontWeight:'500', 
    marginBottom: 10, 
    marginTop: 5
   },
   privacyPolicyCont: {
    flexDirection: 'row', 
    alignItems:'center', 
    marginBottom: 5
   },
   alignContainer: {
    flexDirection: 'row', 
    alignItems:'center'
   },
   contactHeader: {
    fontSize: 25, 
    fontWeight:'600', 
    marginVertical: 30
   },
   contactText: {
    alignSelf:'flex-start', 
    borderWidth: 2, 
    borderRadius: 10, 
    padding: 20, 
    fontSize: 16, 
    fontWeight:'600', 
    textAlign:'center'
   }
})