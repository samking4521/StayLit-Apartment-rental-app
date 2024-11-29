import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet} from 'react-native';
import {Entypo, MaterialIcons, FontAwesome, Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';

const ContactUs = () => {
    const navigation = useNavigation()
  const handlePress = (url) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <Feather name="arrow-left" size={28} color="black" style={{marginRight: 20}} onPress={()=>{navigation.goBack()}}/>
             <Text style={styles.headerText}>Contact Us</Text>
        </View>
     
      <View style={styles.contactItem}>
        <Entypo name="email" size={24} color="#ff6b6b" style={styles.icon} />
        <Text style={styles.label}>Email</Text>
        <TouchableOpacity onPress={() => handlePress('mailto:leot3359@gmail.com')}>
          <Text style={styles.value}>leot3359@gmail.com</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contactItem}>
        <MaterialIcons name="phone" size={24} color="#1dd1a1" style={styles.icon} />
        <Text style={styles.label}>Telephone</Text>
        <TouchableOpacity onPress={() => handlePress('tel:+2348071864277')}>
          <Text style={styles.value}>+234 8071864277</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contactItem}>
        <FontAwesome name="whatsapp" size={24} color="#25D366" style={styles.icon} />
        <Text style={styles.label}>WhatsApp</Text>
        <TouchableOpacity onPress={() => handlePress('https://wa.me/2348071864277')}>
          <Text style={styles.value}>+234 807 186 4277</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FAFAFA',
    flex: 1
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
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  icon: {
    marginRight: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  value: {
    fontSize: 18,
    color: '#007bff',
    textDecorationLine: 'underline',
  },
});

export default ContactUs;
