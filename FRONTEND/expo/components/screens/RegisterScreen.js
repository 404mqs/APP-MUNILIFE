import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

export default function RegisterScreen({ navigation }) {
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false); // Estado para el indicador de carga
  const [error, setError] = useState(''); // Estado para el mensaje de error
  const [success, setSuccess] = useState(''); // Estado para el mensaje de éxito
  const [dots, setDots] = useState(''); // Estado para los puntos de carga

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setDots((prevDots) => (prevDots.length >= 3 ? '' : prevDots + '.'));
      }, 500);

      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setLoading(true); // Mostrar el indicador de carga

    try {
      const response = await axios.post('https://4245-181-170-230-112.ngrok-free.app/auth/register', {
        dni: dni,
        email: email,
      });

      if (response.data && response.data.token) {
        setLoading(false); // Ocultar el indicador de carga
        setSuccess('Registro correcto, volviendo a pantalla de login');
        setTimeout(() => {
          navigation.navigate('Login'); // Navegar a la pantalla de login después de 3 segundos
        }, 3000);
      }
    } catch (error) {
      setLoading(false); // Ocultar el indicador de carga
      setError('Vecino no encontrado o hubo un problema con el registro');
      setTimeout(() => setError(''), 3000); // Ocultar el mensaje de error después de 3 segundos
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
      <Text style={styles.title}>Registrarme</Text>
      <TextInput
        style={styles.input}
        placeholder="DNI"
        value={dni}
        onChangeText={setDni}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarme</Text>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
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
  link: {
    marginTop: 15,
    alignItems: 'center',
  },
  linkText: {
    color: 'blue',
  },
  footerText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'green',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 10
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
  }
});
