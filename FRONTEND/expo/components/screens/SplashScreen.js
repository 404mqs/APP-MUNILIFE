// screens/SplashScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Intro');
    }, 3000); // 3 segundos
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        MUNI
        <Text style={styles.textHighlight}>LIFE</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontSize: 32,
    color: '#000000',
    fontWeight: 'bold',
  },
  textHighlight: {
    color: '#00A676', // Color verde
    fontWeight: 'bold',
  },
});

export default SplashScreen;