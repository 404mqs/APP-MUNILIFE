import React, { useState, useEffect, useRef } from 'react';
import { Keyboard, TouchableWithoutFeedback, View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Animated, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Footer from '../Footer';
import Modal from 'react-native-modal';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';


const ShopsScreen = () => {
  const [shops, setShops] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [avatarUri, setAvatarUri] = useState('https://via.placeholder.com/150');
  const [currentShopIndex, setCurrentShopIndex] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newShop, setNewShop] = useState({
    nombreComercio: '',
    direccion: '',
    apertura: '',
    descripcion: ''
  });
  const [isImageUploadVisible, setImageUploadVisible] = useState(false);
  
  const [addedShopId, setAddedShopId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const fetchShops = async () => {
    try {
      const response = await fetch('https://4245-181-170-230-112.ngrok-free.app/system/comercios');
      if (response.ok) {
        const data = await response.json();
        setShops(data);
      } else {
        Alert.alert('Error', 'No se pudo obtener los comercios');
      }
    } catch (error) {
      console.error('Error fetching shops:', error);
      Alert.alert('Error', 'Ha ocurrido un error al obtener los comercios');
    }
  };

  const fetchUserRole = async () => {
    const role = await AsyncStorage.getItem('userRole');
    setUserRole(role);
  };


  useEffect(() => {
    fetchShops();
    fetchUserRole();
  }, []);

  const handleNextShop = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setCurrentShopIndex((prevIndex) => (prevIndex + 1) % shops.length);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleAddShop = async () => {
    const token = await AsyncStorage.getItem('userToken');

    if (!newShop.nombreComercio || !newShop.direccion || !newShop.apertura || !newShop.descripcion) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    try {
      const response = await fetch('https://4245-181-170-230-112.ngrok-free.app/system/comercios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newShop)
      });

      if (response.ok) {
        const data = await response.json();
        setShops([...shops, data]);
        setSuccessMessage('Comercio agregado correctamente');
        setTimeout(() => setSuccessMessage(null), 3000);
        setModalVisible(false);
        setNewShop({
          nombreComercio: '',
          direccion: '',
          apertura: '',
          descripcion: ''
        });
        setImageUploadVisible(true);
        setAddedShopId(data.idComercio);
      } else {
        const errorData = await response.json();
        console.log('Error en la respuesta del servidor:', errorData);
        Alert.alert('Error', 'No se pudo agregar el comercio. Verifica los datos y vuelve a intentarlo.');
      }
    } catch (error) {
      console.error('Error adding shop:', error);
      Alert.alert('Error', 'Ha ocurrido un error al agregar el comercio');
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
      console.log('Imagen seleccionada:', source);
      // Extraer el string base64 y subirlo
      const base64String = await getBase64FromUri(source);
      console.log('Imagen en base64:', base64String);
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
  
      console.log("yes: ", data);
      

      const response = await axios.put(`https://4245-181-170-230-112.ngrok-free.app/system/comercios/upd/${id}`, data, config);
      

      if (response.status === 200) {
        setSuccessMessage(`Imagen cargada al comercio ${id}`);
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
        Alert.alert('Success', 'Foto de reclamo adjuntada correctamente');

        fetchShops();
        setImageUploadVisible(false); // Cerrar el modal después de la carga
      } else {
        setErrorMessage(`No se pudo adjuntar la foto del comercio: ${response.data.message}`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
        Alert.alert('Error', `No se pudo adjuntar la foto del comercio: ${response.data.message}`);
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


  const currentShop = shops[currentShopIndex];

  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/comercios.jpeg')} style={styles.headerImage} />
      <Text style={styles.title}>MUNI<Text style={styles.titleHighlight}>LIFE</Text></Text>
      <Text style={styles.subtitle}>COMERCIOS</Text>
      
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tiendas Cercanas</Text>
          {userRole === 'VECINO' && (
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          )}
        </View>

        {currentShop ? (
          <Animated.View style={{ ...styles.shopCard, opacity: fadeAnim }}>
            {currentShop.foto ? (
      currentShop.foto.startsWith('/9j/') || currentShop.foto.length > 50 ? ( // Suposición de que una imagen base64 tiene más de 50 caracteres
        // Construimos la URI de base64 con el prefijo adecuado
        <Image source={{ uri: `data:image/jpeg;base64,${currentShop.foto}` }} style={styles.shopImage} />
      ) : (
        // Si no es base64, asumimos que es una URL normal
        <Image source={{ uri: currentShop.foto }} style={styles.shopImage} />
      )
    ) : (
      // Imagen de placeholder si no hay imagen
      <Image source={require('../../../assets/IMAGENNOCARGADA.png')} style={styles.shopImage} />
    )}
            <View style={styles.shopInfo}>
              <Text style={styles.shopName}>{currentShop.nombreComercio}</Text>
              <Text style={styles.shopPhone}>Se encuentra en: {currentShop.direccion || 'null'}</Text>
              <Text style={styles.shopTitle}>Este local abre a las {currentShop.apertura}</Text>
              <Text style={styles.shopDescription}>{currentShop.descripcion || 'null'}</Text>
            </View>
            <TouchableOpacity style={styles.nextButton} onPress={handleNextShop}>
              <Text style={styles.nextButtonText}>›</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <Text style={styles.noShopsText}>No se encontraron comercios.</Text>
        )}
      </ScrollView>

      <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)}>
      <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
        <View style={styles.modalContent}>
        <TouchableOpacity style={styles.closeButtonTopRight} onPress={() => setModalVisible(false)}>
          <FontAwesome name="close" size={24} color="#00A676" />
        </TouchableOpacity>
          <Text style={styles.modalTitle}>Nuevo Comercio</Text>
         
          <TextInput
            style={styles.input}
            placeholder="Nombre del Comercio"
            value={newShop.nombreComercio}
            onChangeText={(text) => setNewShop({ ...newShop, nombreComercio: text })}
          />
          
         
          <TextInput
            style={styles.input}
            placeholder="Dirección"
            value={newShop.direccion}
            onChangeText={(text) => setNewShop({ ...newShop, direccion: text })}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Hora de Apertura"
            value={newShop.apertura}
            onChangeText={(text) => setNewShop({ ...newShop, apertura: text })}
          />
          
          <TextInput
                style={styles.input}
                placeholder="Descripción"
                multiline
                numberOfLines={4}
                value={newShop.descripcion}
                onChangeText={(text) => setNewShop({ ...newShop, descripcion: text })}
              />
          <Button mode="contained" onPress={handleAddShop} style={styles.submitButton}>
            Enviar
          </Button>
          
        </View>
        </TouchableWithoutFeedback>
      </Modal>

      {isImageUploadVisible && (
        <Modal isVisible={isImageUploadVisible} onBackdropPress={() => setImageUploadVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cargar Foto del Comercio</Text>
            <Button mode="contained" onPress={() => selectPhoto(addedShopId)} style={styles.submitButton}>
            Agregar foto
            </Button>
            <Button mode="contained" onPress={() => setImageUploadVisible(false)} style={styles.closeButton}>
            Cerrar
            </Button>
          </View>
        </Modal>
      )}

      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerImage: {
    width: '100%',
    height: 200,
  },
  modalLabel: {
    fontSize: 16,
    marginBottom: 10,
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
  shopCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  shopImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  shopInfo: {
    padding: 16,
  },
  shopName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  shopPhone: {
    fontSize: 16,
    color: '#777777',
    marginVertical: 4,
  },
  shopTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00A676',
    marginVertical: 4,
  },
  shopDescription: {
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
  noShopsText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
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
});

export default ShopsScreen;