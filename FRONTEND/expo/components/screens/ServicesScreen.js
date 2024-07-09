import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Animated, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Footer from '../Footer';
import Modal from 'react-native-modal';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const ServicesScreen = () => {
  const [services, setServices] = useState([]);
  const [avatarUri, setAvatarUri] = useState('https://via.placeholder.com/150');
  const [userRole, setUserRole] = useState('');
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newService, setNewService] = useState({
    nombreServicio: '',
    contacto: '',
    rubro: '',
    descripcion: ''
  });
  const [isImageUploadVisible, setImageUploadVisible] = useState(false);
  const [addedServiceId, setAddedServiceId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(1)).current;

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

  const fetchUserRole = async () => {
    const role = await AsyncStorage.getItem('userRole');
    setUserRole(role);
  };

  useEffect(() => {
    fetchServices();
    fetchUserRole();
  }, []);

  const handleNextService = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setCurrentServiceIndex((prevIndex) => (prevIndex + 1) % services.length);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleAddService = async () => {
    const token = await AsyncStorage.getItem('userToken');
  
    if (!newService.nombreServicio || !newService.contacto || !newService.rubro || !newService.descripcion) {
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
        const data = await response.json();
        setServices([...services, data]);
        setSuccessMessage('Servicio agregado correctamente');
        setTimeout(() => setSuccessMessage(null), 3000);
        setModalVisible(false);
        setNewService({
          nombreServicio: '',
          contacto: '',
          rubro: '',
          descripcion: ''
        });
        setImageUploadVisible(true);
        setAddedServiceId(data.idServicio); // Suponiendo que la respuesta incluye el ID del nuevo servicio
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

  const selectPhoto = async (id) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Lo sentimos, necesitamos permisos de acceso a la galería para hacer esto funcionar.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const source = result.assets[0].uri;
      setAvatarUri(source); // Esto es opcional si quieres mostrar la imagen en la UI

      // Extraer el string base64 y subirlo
      const base64String = await getBase64FromUri(source);
      uploadPhoto(base64String, id);
    }
  };

  const getBase64FromUri = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
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
  
      const response = await axios.put(`https://4245-181-170-230-112.ngrok-free.app/system/servicios/upd/${id}`, data, config);
  
      if (response.status === 200) {
        setSuccessMessage(`Imagen cargada al servicio ${id}`);
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
        Alert.alert('Success', 'Foto de reclamo adjuntada correctamente');

        fetchServices();
        setImageUploadVisible(false); // Cerrar el modal después de la carga
      } else {
        setErrorMessage(`No se pudo adjuntar la foto del servicio: ${response.data.message}`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
        Alert.alert('Error', `No se pudo adjuntar la foto del servicio: ${response.data.message}`);
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

  const currentService = services[currentServiceIndex];

  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/servicios.jpg')} style={styles.headerImage} />
      <Text style={styles.title}>MUNI<Text style={styles.titleHighlight}>LIFE</Text></Text>
      <Text style={styles.subtitle}>SERVICIOS</Text>
      
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Servicios Cercanos</Text>
          {userRole === 'VECINO' && (
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          )}
        </View>
        
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

      <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)}>
      <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
        <View style={styles.modalContent}>
        <TouchableOpacity style={styles.closeButtonTopRight} onPress={() => setModalVisible(false)}>
          <FontAwesome name="close" size={24} color="#00A676" />
        </TouchableOpacity>
          <Text style={styles.modalTitle}>Nuevo Servicio</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Nombre del Servicio"
            value={newService.nombreServicio}
            onChangeText={(text) => setNewService({ ...newService, nombreServicio: text })}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Contacto (mail o telefono)"
            value={newService.contacto}
            onChangeText={(text) => setNewService({ ...newService, contacto: text })}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Rubro"
            value={newService.rubro}
            onChangeText={(text) => setNewService({ ...newService, rubro: text })}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Descripción"
            value={newService.descripcion}
            onChangeText={(text) => setNewService({ ...newService, descripcion: text })}
          />
          <Button style={styles.submitButton} mode="contained" onPress={handleAddService}>
            Enviar
          </Button>
        </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal isVisible={isImageUploadVisible} onBackdropPress={() => setImageUploadVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Imagen de portada</Text>
          
          <Button style={styles.submitButton} mode="contained" onPress={() => selectPhoto(addedServiceId)}>
            Agregar foto
          </Button>
          <Button mode="contained" onPress={() => setImageUploadVisible(false)} style={styles.closeButton}>
            Cerrar
          </Button>
        </View>
      </Modal>

      {successMessage && <Text style={styles.successMessage}>{successMessage}</Text>}
      {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
      
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f9',
  },
  headerImage: {
    width: '100%',
    height: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
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
    paddingHorizontal: 20,
    paddingBottom: 20,
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
    borderRadius: 30,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  addButtonText: {
    fontSize: 24,
    color: '#FFF',
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
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#00A676',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButton: { // Nuevo estilo para el botón de cierre
    marginTop: 10,
    backgroundColor: '#ff4d4d', // Un color diferente para indicar el cierre
  },
  closeButtonTopRight: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  successMessage: {
    color: 'green',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  }
});

export default ServicesScreen;