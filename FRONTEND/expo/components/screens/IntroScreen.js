import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const IntroScreen = () => {
    const navigation = useNavigation();

    return (
    <View style={styles.container}>
      <Image source={'../../../assets/login.png'} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>Tu vecindario en un solo lugar.</Text>
        <Text style={styles.subtitle}>Creemos que el compromiso, orden y disposicion de todos los vecinos ayuda a vivir cada vez mejor.</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Iniciar Sesion</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('NoHome')}>
          <Text style={styles.linkText}>Continuar sin Usuario</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  image: {
    width: '100%',
    height: '60%',
    resizeMode: 'cover',
  },
  textContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center', // Align text to center horizontally
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3C3C3C',
    textAlign: 'center',
    marginBottom: 15, // Added margin bottom for spacing
  },
  subtitle: {
    fontSize: 14,
    color: '#6C6C6C',
    textAlign: 'center',
    marginBottom: 30, // Added margin bottom for spacing
  },
  button: {
    backgroundColor: '#00A676',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 20, // Added margin bottom for spacing
    width: '100%', // Ensure button is full width within the container
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    color: '#4CAF50',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default IntroScreen;