import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';

const AboutUs = () => {
    const navigation = useNavigation()
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
          <Feather name="arrow-left" size={28} color="black" style={{marginRight: 20}} onPress={()=>{navigation.goBack()}}/>
          <Text  style={styles.headerText}>About Us</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.text}>
          Welcome to StayLit, your trusted platform for renting apartments directly between agents and renters. Our mission is to simplify the rental process, making it easier, faster, and more transparent for both parties.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Our Mission</Text>
        <Text style={styles.text}>
          At StayLit, we believe in empowering agents and renters with a platform that facilitates secure and straightforward transactions. Our goal is to build a community where finding the perfect rental and reliable tenants is seamless and stress-free.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Why Choose Us?</Text>
        <View style={styles.bulletContainer}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText}>
            <Text style={styles.bold}>Easy to Use:</Text> Our app is designed with a user-friendly interface that makes it simple for anyone to navigate and use, whether you're listing a property or searching for your next home.
          </Text>
        </View>
        <View style={styles.bulletContainer}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText}>
            <Text style={styles.bold}>Secure Transactions:</Text> We prioritize your safety by providing secure payment options and verifying the authenticity of listings and user profiles.
          </Text>
        </View>
        <View style={styles.bulletContainer}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText}>
            <Text style={styles.bold}>Transparent Process:</Text> Our platform promotes transparency in all dealings, offering clear terms and direct communication between agents and renters.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Our Vision</Text>
        <Text style={styles.text}>
          We envision a future where renting an apartment is as easy as clicking a button, with trust and satisfaction at the core of every transaction. StayLit aims to set the standard for rental platforms, creating a safe and supportive environment for everyone involved.
        </Text>
      </View>

      <View>
        <Text style={styles.contactHeader}>Need to get in touch?</Text>
        <Text onPress={()=>{navigation.navigate('ContactUs')}} style={styles.contactText}>Contact us</Text>
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
    fontSize: 18,
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

});

export default AboutUs;
