import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Animated, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Footer from '../Footer';
import Modal from 'react-native-modal';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NoFooter from "../NoFoot";

const NoServScreen = () => {
  const [services, setServices] = useState([]);
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false); // Estado para controlar la visibilidad del modal
  const [newService, setNewService] = useState({
    nombreServicio: '',
    contacto: '',
    rubro: '',
    descripcion: ''
  });

  const selectPhoto = (id) => {
    const options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
      quality: 1,
    };
  
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const source = response.assets[0].uri;
        setAvatarUri(source); // Esto es opcional si quieres mostrar la imagen en la UI
  
        // Extraer el string base64 y subirlo
        const base64String = extractBase64FromUri(source);
        uploadPhoto(base64String, id);
      }
    });
  };


  const extractBase64FromUri = (uri) => {
    // La URI puede tener un formato como 'data:image/jpeg;base64,...'
    // Debemos extraer solo la parte base64
    const base64Index = uri.indexOf('base64,') + 7;
    return uri.substring(base64Index);
  };

  const uploadPhoto = async (base64String, id) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const data = {
        fotoBase64: base64String,
      };
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      };
  
      const response = await axios.post(`https://4245-181-170-230-112.ngrok-free.app/system/denuncias/subir-foto-base64/${id}`, data, config);
  
      if (response.status === 200) {
        setSuccessMessage(`Imagen cargada a la denuncia ${id}`);
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
        Alert.alert('Success', 'Foto de reclamo adjuntada correctamente');
      } else {
        setErrorMessage(`No se pudo adjuntar la foto de la denuncia: ${response.data.message}`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
        Alert.alert('Error', `No se pudo adjuntar la foto de la denuncia: ${response.data.message}`);
      }
    } catch (error) {
      setErrorMessage('Hubo un error al subir la foto');
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);  
      console.error('Error uploading photo:', error);
      Alert.alert('Error', 'Hubo un error al subir la foto');
    }
  };

  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(1)).current; // Valor inicial de la opacidad

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('https://4245-181-170-230-112.ngrok-free.app/system/servicios');
        if (response.ok) {
          const data = await response.json();
          setServices(data);
        } else {
          Alert.alert('Error', 'No se pudo obtener los servicios');
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        Alert.alert('Error', 'Ha ocurrido un error al obtener los servicios');
      }
    };

    fetchServices();
  }, []);

  const handleNextService = () => {
    // Animación de fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      // Cambiar al siguiente servicio y hacer fade in
      setCurrentServiceIndex((prevIndex) => (prevIndex + 1) % services.length);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleAddService = async () => {
    // Ejemplo de token de autorización (deberías obtener esto de tu lógica de autenticación)
    const token = await AsyncStorage.getItem('userToken');
  
    // Verifica que todos los campos requeridos estén completos
    if (
      !newService.nombreServicio ||
      !newService.contacto ||
      !newService.rubro ||
      !newService.descripcion
    ) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
  
    try {
      const response = await fetch('https://4245-181-170-230-112.ngrok-free.app/system/servicios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newService)
      });
  
      if (response.ok) {
        Alert.alert('Éxito', 'Servicio agregado exitosamente');
        setModalVisible(false); // Cerrar el modal después de agregar el servicio
        setNewService({
          nombreServicio: '',
          contacto: '',
          rubro: '',
          descripcion: ''
        });
        // Refrescar la lista de servicios
        const data = await response.json();
        setServices([...services, data]);
      } else {
        const errorData = await response.json();
        console.log('Error en la respuesta del servidor:', errorData);
        Alert.alert('Error', 'No se pudo agregar el servicio. Verifica los datos y vuelve a intentarlo.');
      }
    } catch (error) {
      console.error('Error adding service:', error);
      Alert.alert('Error', 'Ha ocurrido un error al agregar el servicio');
    }
  };
  

  const currentService = services[currentServiceIndex];

  return (
    <View style={styles.container}>
      {/* Imagen Superior */}
      <Image source={require('../../../assets/servicios.jpg')} style={styles.headerImage} />
      
      {/* Título y Subtítulo */}
      <Text style={styles.title}>MUNI<Text style={styles.titleHighlight}>LIFE</Text></Text>
      <Text style={styles.subtitle}>SERVICIOS</Text>
      
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Sección Mis Servicios */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Servicios Cercanos</Text>
        </View>
        
        {/* Ejemplo de Servicio */}
        {currentService ? (
          <Animated.View style={{ ...styles.serviceCard, opacity: fadeAnim }}>
            {currentService.imagen ? (
      currentService.imagen.startsWith('/9j/') || currentService.imagen.length > 50 ? ( // Suposición de que una imagen base64 tiene más de 50 caracteres
        // Construimos la URI de base64 con el prefijo adecuado
        <Image source={{ uri: `data:image/jpeg;base64,${currentService.imagen}` }} style={styles.serviceImage} />
      ) : (
        // Si no es base64, asumimos que es una URL normal
        <Image source={{ uri: currentService.imagen }} style={styles.serviceImage} />
      )
    ) : (
      // Imagen de placeholder si no hay imagen
      <Image source={require('../../../assets/IMAGENNOCARGADA.png')} style={styles.serviceImage} />
    )}
            <View style={styles.serviceInfo}> 
              <Text style={styles.serviceName}>{currentService.nombreServicio}</Text>
              <Text style={styles.servicePhone}>{currentService.contacto || 'Sin contacto'}</Text>
              <Text style={styles.serviceTitle}>Publicado por: {currentService.nombre} {currentService.apellido}</Text>
              <Text style={styles.serviceDescription}>{currentService.descripcion || 'Sin descripcion'}</Text>
            </View>
            <TouchableOpacity style={styles.nextButton} onPress={handleNextService}>
              <Text style={styles.nextButtonText}>›</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <Text style={styles.noServicesText}>No se encontraron servicios.</Text>
        )}
      </ScrollView>
      <NoFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginVertical: 10,
  },
  titleHighlight: {
    color: '#00A676',
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    color: '#00A676',
    marginBottom: 20,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#00A676',
    borderRadius: 25,
    padding: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  serviceImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  serviceInfo: {
    padding: 16,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  servicePhone: {
    fontSize: 16,
    color: '#777777',
    marginVertical: 4,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00A676',
    marginVertical: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#555555',
    marginTop: 8,
  },
  nextButton: {
    backgroundColor: '#00A676',
    borderRadius: 25,
    padding: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    margin: 16,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  noServicesText: {
    textAlign: 'center',
    color: '#777777',
    marginTop: 20,
    fontSize: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: '#00A676',
    marginTop: 10,
  },
  cancelButton: {
    marginTop: 10,
    color: '#00A676',
  },
});

export default NoServScreen;