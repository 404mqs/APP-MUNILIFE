// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from 'expo-checkbox'; // Use CheckBox from expo-checkbox
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const response = await fetch('https://4245-181-170-230-112.ngrok-free.app/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mail: email,
          contraseña: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Save the token and role in AsyncStorage
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userRole', data.role);
        console.log('Login successful', data);
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', 'Credenciales inválidas');
      }
    } catch (error) {
      console.error('Error during login:', errorText);
      Alert.alert('Error', 'Ha ocurrido un error durante el login');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a MUNI<Text style={styles.titleHighlight}>LIFE</Text></Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese su dirección de correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Ingrese su contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={rememberMe}
          onValueChange={setRememberMe}
        />
        <Text style={styles.label}>Recordar Contraseña</Text>
      </View>
      <Button title="Ingresar" onPress={handleLogin} color="#888" />
      <TouchableOpacity onPress={() => navigation.navigate('Recovery')}>
        <Text style={styles.link}>¿Olvidaste la Contraseña?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>REGISTRARME</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  titleHighlight: {
    color: '#00A676', // Color verde
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 4,
    marginVertical: 8,
    paddingHorizontal: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    margin: 8,
  },
  link: {
    color: '#00A676', // Color verde
    marginVertical: 8,
  },
  registerButton: {
    backgroundColor: '#00A676', // Color verde del botón
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  registerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF', // Texto blanco para resaltar
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 20,
  },
});

export default LoginScreen;
