import React from 'react';
import { View, Text, ScrollView, StyleSheet} from 'react-native';
import {Entypo, Feather} from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';

const TermsAndConditions = () => {
    const navigation = useNavigation()
  return (
    <ScrollView contentContainerStyle={styles.container}>
    <View style={styles.header}>
           <Feather name="arrow-left" size={28} color="black" style={{marginRight: 20}} onPress={()=>{navigation.goBack()}}/>
            <Text style={styles.headerText}>Terms and Conditions</Text>
    </View>
      <View style={styles.section}>
        <Text style={styles.title}>1. Introduction</Text>
        <Text style={styles.text}>
          Welcome to Leot. These Terms and Conditions govern your access to and use of our app and services. By using our app, you agree to comply with these Terms. If you do not agree to these Terms, please do not use our services.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>2. Use of the App</Text>
        <View style={styles.bulletContainer}>
          <Entypo name="dot-single" size={18} style={styles.bullet} />
          <Text style={styles.bulletText}>
            <Text style={styles.bold}>Eligibility:</Text> You must be at least 18 years old and legally capable of entering into contracts to use our services.
          </Text>
        </View>
        <View style={styles.bulletContainer}>
          <Entypo name="dot-single" size={18} style={styles.bullet} />
          <Text style={styles.bulletText}>
            <Text style={styles.bold}>Account Creation:</Text> To use certain features, you must create an account with accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </Text>
        </View>
        <View style={styles.bulletContainer}>
          <Entypo name="dot-single" size={18} style={styles.bullet} />
          <Text style={styles.bulletText}>
            <Text style={styles.bold}>Permitted Use:</Text> You agree to use our app only for lawful purposes and in accordance with these Terms. You may not use the app to engage in any illegal activities or to harass, harm, or defraud others.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>3. Property Listings</Text>
        <View style={styles.bulletContainer}>
          <Entypo name="dot-single" size={18} style={styles.bullet} />
          <Text style={styles.bulletText}>
            <Text style={styles.bold}>Listing Requirements:</Text> Hosts must provide accurate and complete information about their properties, including descriptions, photos, pricing, and availability.
          </Text>
        </View>
        <View style={styles.bulletContainer}>
          <Entypo name="dot-single" size={18} style={styles.bullet} />
          <Text style={styles.bulletText}>
            <Text style={styles.bold}>Responsibility:</Text> Hosts are responsible for ensuring that their properties comply with all applicable laws, regulations, and local ordinances.
          </Text>
        </View>
        <View style={styles.bulletContainer}>
          <Entypo name="dot-single" size={18} style={styles.bullet} />
          <Text style={styles.bulletText}>
            <Text style={styles.bold}>No Endorsement:</Text> We do not endorse or guarantee the quality, safety, or legality of any listed properties. Renters are responsible for conducting their own due diligence before entering into a rental agreement.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>4. Renting and Payments</Text>
        <View style={styles.bulletContainer}>
          <Entypo name="dot-single" size={18} style={styles.bullet} />
          <Text style={styles.bulletText}>
            <Text style={styles.bold}>Renting Process:</Text> Renters can rent properties through our app by following the booking process outlined in the app. Once a payment is confirmed, a legally binding agreement is formed between the host and renter.
          </Text>
        </View>
        <View style={styles.bulletContainer}>
          <Entypo name="dot-single" size={18} style={styles.bullet} />
          <Text style={styles.bulletText}>
            <Text style={styles.bold}>Payment:</Text> All payments for bookings must be made through our app using the payment methods provided. We may charge service fees for processing payments and facilitating bookings.
          </Text>
        </View>
        <View style={styles.bulletContainer}>
          <Entypo name="dot-single" size={18} style={styles.bullet} />
          <Text style={styles.bulletText}>
            <Text style={styles.bold}>Cancellations and Refunds:</Text> Cancellation and refund policies are determined by the host and will be outlined in the property listing. Renters should review these policies carefully before booking.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
        padding: 20, 
        backgroundColor:'#FAFAFA' 
    },
    header: {
        flexDirection:'row', 
        alignItems:'center', 
        marginBottom: 20
      },
      headerText: {
        fontSize: 28, 
        fontWeight:'600', 
        textAlign:'center'
      },
  subHeader: {
    fontSize: 14,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  bulletContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bullet: {
    marginRight: 5,
    marginTop: 2,
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default TermsAndConditions;
