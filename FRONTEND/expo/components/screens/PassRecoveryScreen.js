
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export default function PassRecoveryScreen() {
  const [email, setEmail] = useState('');
  const [dni, setDni] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dots, setDots] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setDots((prevDots) => (prevDots.length >= 3 ? '' : prevDots + '.'));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleSendEmail = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:8080/auth/solicitar-nueva-contrasena', {
        email: email,
        dni: dni,
      });

      if (response.data == "Nueva contraseña generada y enviada por correo electrónico") {
        setLoading(false);
        setSuccess('Nueva contraseña generada y enviada por correo electrónico');
        console.log(response.data)
      } else {
        setLoading(false);
        setError('Error al generar la nueva contraseña');
        console.log(response.data)
      }
    } catch (error) {
      setLoading(false);
      setError('Datos incorrectos o error en el servidor.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Icon name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Restablecer Contraseña</Text>
      <Text style={styles.instructions}>
        Por favor ingrese su dirección de correo y DNI. Le enviaremos las instrucciones para restablecer su contraseña. Si usted es un inspector debe arreglar el cambio de contraseña con municipalidad.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="DNI"
        value={dni}
        onChangeText={setDni}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleSendEmail}>
        <Text style={styles.buttonText}>Enviar Email</Text>
      </TouchableOpacity>
      {loading && <Text style={styles.loadingText}>Cargando{dots}</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}
      {success && <Text style={styles.successText}>{success}</Text>}
      <Text style={styles.footerText}>MUNILIFE</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  instructions: {
    marginBottom: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'gray',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'blue',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'red',
  },
  successText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'green',
  },
  footerText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'green',
  },
});
