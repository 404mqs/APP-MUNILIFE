import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet, Image, Button, TouchableOpacity, ScrollView, Modal, Alert, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Footer from '../Footer';
import { TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const ClaimsScreen = () => {
  const [avatarUri, setAvatarUri] = useState('https://via.placeholder.com/150');
  const [claimPhotos, setClaimPhotos] = useState([]);
  const navigation = useNavigation();
  const [claims, setClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [claimHistory, setClaimHistory] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [siteModalVisible, setSiteModalVisible] = useState(false);
  const [defectModalVisible, setDefectModalVisible] = useState(false);
  const [claimModalVisible, setClaimModalVisible] = useState(false);
  const [rubroModalVisible, setRubroModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [imageUploadVisible, setImageUploadVisible] = useState(false);
  const [newClaim, setNewClaim] = useState({
    site: '',
    type: '',
    description: '',
    image: null
  });
  const [newSite, setNewSite] = useState({
    latitude: '',
    longitude: '',
    street: '',
    number: '',
    betweenStreetA: '',
    betweenStreetB: '',
    description: '',
    inCharge: '',
    opening: '',
    closing: '',
    comments: ''
  });

  const [sites, setSites] = useState([]);
  
  const [newDefect, setNewDefect] = useState({
    
    description: '',
    rubro: ''
  });

  const [newRubro, setNewRubro] = useState({
    description: ''
  });
  
  const [defects, setDefects] = useState([]);

  const [rubros, setRubros] = useState([]);	
  
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
      const response = await axios.post(`https://4245-181-170-230-112.ngrok-free.app/system/reclamos/subir-foto-base64/${id}`, data, config);
  
      if (response.status === 200) {
        setSuccessMessage(`Imagen cargada al reclamo ${id}`);
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
        Alert.alert('Success', 'Foto de reclamo adjuntada correctamente');

        fetchClaims();
        setImageUploadVisible(false); // Cerrar el modal después de la carga
      } else {
        setErrorMessage(`No se pudo adjuntar la foto del reclamo: ${response.data.message}`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
        Alert.alert('Error', `No se pudo adjuntar la foto del reclamo: ${response.data.message}`);
      }
    } catch (error) {
      setErrorMessage('Hubo un error al subir el reclamo');
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);  
      console.error('Error uploading photo:', error);
      Alert.alert('Error', 'Hubo un error al subir el relcamo');
    }
  };

  const fetchClaims = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      try {
        const response = await fetch('https://4245-181-170-230-112.ngrok-free.app/system/misreclamos', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('No se pudo obtener los reclamos');
        }
        const data = await response.json();
        setClaims(data);
      } catch (error) {
        console.error('Error al obtener los reclamos:', error);
      }
    } else {
      console.error('No hay token');
    }
  };
  
  const fetchDefects = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        try {
          

          const response = await fetch('https://4245-181-170-230-112.ngrok-free.app/system/desperfectos', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error('No se pudo obtener los desperfectos');
          }
          const data = await response.json();
          
          console.log('Desperfectos:', data);

          const defectOptions = data.map(defect => ({
            label: defect.descripcion,
            value: defect.idDesperfecto,
          }));
          setDefects(defectOptions);
        } catch (error) {
          console.error('Error al obtener los desperfectos:', error);
        }
      } else {
        console.error('No hay token');
      }
    
    };

  const fetchRubros = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      try {
        const response = await fetch('https://4245-181-170-230-112.ngrok-free.app/system/rubros', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('No se pudo obtener los rubros');
        }
        const data = await response.json();
          
        console.log('rubros:', data);

        const rubrosOptions = data.map(rubro => ({
          label: rubro.descripcion,
          value: rubro.idRubro,
        }));
        setRubros(rubrosOptions);
      } catch (error) {
        console.error('Error al obtener los rubros:', error);
      }
    } else {
      console.error('No hay token');
    }
    
  };

    const fetchSites = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        try {
          const response = await fetch('https://4245-181-170-230-112.ngrok-free.app/system/sitios', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error('No se pudo obtener los sitios');
          }
          const data = await response.json();
          console.log('Sitios:', data);

          const sitesOptions = data.map(site => ({
            label: `Direccion: ${site.calle} - Descripcion: ${site.descripcion}`,
            value: site.idSitio,
          })); 
          setSites(sitesOptions);
        } catch (error) {
          console.error('Error al obtener los sitios:', error);
        }
      } else {
        console.error('No hay token');
      }
    }


  useEffect(() => {
    
    fetchClaims();
    fetchDefects();
    fetchSites();
    fetchRubros();
  }, []);

  const fetchClaimHistory = async (id) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      try {
        const [historyResponse, photosResponse] = await Promise.all([
          fetch(`https://4245-181-170-230-112.ngrok-free.app/system/reclamos/his/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }),
          fetch(`https://4245-181-170-230-112.ngrok-free.app/system/reclamos/fotos/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          })
        ]);
  
        if (!historyResponse.ok) {
          throw new Error('No se pudo obtener el historial del reclamo');
        }
        if (!photosResponse.ok) {
          throw new Error('No se pudieron obtener las fotos del reclamo');
        }
  
        const historyData = await historyResponse.json();
        const photosData = await photosResponse.json();
  
        setClaimHistory(historyData.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)));
        setClaimPhotos(photosData.map(photo => `data:image/jpeg;base64,${photo.foto}`));

      } catch (error) {
        console.error('Error al obtener el historial del reclamo:', error);
      }
    } else {
      console.error('No hay token');
    }
  };
  

  const statusColors = {
    'En Revision': '#FFA500',
    'Aceptado': '#00A676',
    'Finalizado': '#0000FF',
    'Denegado': '#FF0000'
  };

  const statusTexts = {
    1: 'En Revision',
    2: 'Aceptado',
    3: 'Finalizado',
    4: 'Denegado'
  };

  
  

  const openClaimModal = (claim) => {
    setSelectedClaim(claim);
    fetchClaimHistory(claim.idReclamo);
    setClaimModalVisible(true);
  };

  const closeClaimModal = () => {
    setClaimModalVisible(false);
    setSelectedClaim(null);
    setClaimHistory([]);
  };

  const openSiteModal = () => {
    setSiteModalVisible(true);
  };

  const openDefectModal = () => {
    setDefectModalVisible(true);
  };

  const openRubroModal = () => {
    setRubroModalVisible(true);
  };
  

  // Funci贸n para cerrar el modal de sitios
const closeSiteModal = () => {
  setSiteModalVisible(false);
  setNewSite({ street: '', description: '' });
};
  
 
  

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setNewClaim({ ...newClaim, image: result.uri });
    }
  };

  const submitClaim = async () => {
    console.log(newClaim);
    if (newClaim.site && newClaim.type && newClaim.description) {
      const newClaimData = {
        ...newClaim,
        id: Math.floor(Math.random() * 1000),
        date: new Date().toLocaleDateString(),
        status: 1
      };
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          throw new Error('No se encontr贸 el token de acceso');
        }
        const response = await fetch('https://4245-181-170-230-112.ngrok-free.app/system/reclamos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            sitio: newClaim.site,
            tipo: newClaim.type,
            descripcion: newClaim.description,
            foto: newClaim.image,
            id: Math.floor(Math.random() * 1000),
            date: new Date().toLocaleDateString(),
            estado: newClaim.status
          }),
        });
        
        if (response.ok) {
          const responseData = await response.json();
          setClaims([...claims, responseData]);
          setNewClaim({ site: '', type: '', description: '', image: null });
          setModalVisible(false);
          alert('Reclamo enviado exitosamente');
        } else {
          alert('Error al enviar el reclamo');
        }
      } catch (error) {
        console.error('Error al enviar el reclamo:', error);
        alert('Ha ocurrido un error al enviar el reclamo');
      }
    } else {
      alert('Por favor complete todos los campos');
    }
  };

  const submitSite = async () => {
    console.log(newSite);
    if (newSite.street && newSite.description && newSite.latitude && newSite.longitude && newSite.number && newSite.betweenStreetA && newSite.betweenStreetB && newSite.inCharge && newSite.comments) {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          throw new Error('No se encontr贸 el token de acceso');
        }
        const response = await fetch('https://4245-181-170-230-112.ngrok-free.app/system/sitios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            latitud: newSite.latitude,
            longitud: newSite.longitude,
            calle: newSite.street,
            numero: newSite.number,
            entreCalleA: newSite.betweenStreetA,
            entreCalleB: newSite.betweenStreetB,
            descripcion: newSite.description,
            aCargoDe: newSite.inCharge,
            apertura: newSite.opening,
            cierre: newSite.closing,
            comentarios: newSite.comments
          }),
        });
        if (response.ok) {
          const responseData = await response.json();
          setSites([...sites, { label: `Direccion: ${responseData.calle} - Descripcion: ${responseData.descripcion}`, value: responseData.idSitio }]);
          setNewSite({ 
            latitude: '',
            longitude: '',
            street: '',
            number: '',
            betweenStreetA: '',
            betweenStreetB: '',
            description: '',
            inCharge: '',
            opening: '',
            closing: '',
            comments: ''
          });
          setSiteModalVisible(false);
          alert('Sitio agregado exitosamente');
          fetchSites();
        } else {
          alert('Error al agregar el sitio');
        }
      } catch (error) {
        console.error('Error al agregar el sitio:', error);
        alert('Ha ocurrido un error al agregar el sitio');
      }
    } else {
      alert('Por favor complete todos los campos');
    }
};

const submitDefect = async () => {
  console.log(newDefect);
  if (newDefect.description && newDefect.rubro) {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('No se encontr贸 el token de acceso');
      }
      const response = await fetch('https://4245-181-170-230-112.ngrok-free.app/system/desperfectos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          descripcion: newDefect.description,
          rubro: newDefect.rubro
        }),
      });
      if (response.ok) {
        const responseData = await response.json();
        setDefects([...defects, responseData]); 
        setNewDefect({ 
          description: '',
          rubro: ''
        });
        setDefectModalVisible(false);
        alert('Desperfecto agregado exitosamente');
        fetchDefects();
      } else {
        alert('Error al agregar el desperfecto');
      }
    } catch (error) {
      console.error('Error al agregar el desperfecto:', error);
      alert('Ha ocurrido un error al agregar el desperfecto');
    }
  } else {
    alert('Por favor complete todos los campos');
  }
};

const submitRubro = async () => {
  console.log(newRubro);
  if (newRubro.description) {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('No se encontr贸 el token de acceso');
      } 
      const response = await fetch('https://4245-181-170-230-112.ngrok-free.app/system/rubros', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          descripcion: newRubro.description,
          
        }),
      });
      if (response.ok) {
        const responseData = await response.json();
        setRubros([...rubros, responseData]); 
        setNewRubro({ 
          description: '',
        });
        setRubroModalVisible(false);
        console.log(rubros);
        alert('Rubro agregado exitosamente');
        fetchRubros();
      } else {
        alert('Error al agregar el rubro');
      }
    } catch (error) {
      console.error('Error al agregar el rubro:', error);
      alert('Ha ocurrido un error al agregar el rubro');
    }
  } else {
    alert('Por favor complete todos los campos');
  }
};

  

return (
  <View style={styles.container}>
    <Image source={require('../../../assets/reclamos.jpg')} style={styles.headerImage} />
    <Text style={styles.title}>MUNI<Text style={styles.titleHighlight}>LIFE</Text></Text>
    <Text style={styles.subtitle}>RECLAMOS</Text>
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mis Reclamos</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>ID</Text>
          <Text style={styles.tableHeaderText}>Tipo</Text>
          <Text style={styles.tableHeaderText}>Estado</Text>
        </View>
        {claims.map(claim => (
          <TouchableOpacity key={claim.idReclamo} style={styles.tableRow} onPress={() => openClaimModal(claim)}>
            <Text style={styles.tableCell}>{claim.idReclamo}</Text>
            <Text style={styles.tableCell}>{claim.desperfecto.rubro.descripcion}</Text>
            <Text style={[styles.tableCell, { color: statusColors[statusTexts[claim.estado]] }]}>{statusTexts[claim.estado]}</Text>
          </TouchableOpacity>
        ))}
      </View>

    </ScrollView>
      {modalVisible && (
        <Modal visible={true} transparent={true} animationType="slide">
          
          <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <FontAwesome name="close" size={24} color="#00A676" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Nuevo Reclamo</Text>
              <Text style={styles.modalSubTitle}>Luego de ingresar el reclamo, se habilitara la opcion de cargar evidencia a dicho reclamo.</Text>

              
              {/* <TextInput
                style={styles.input}
                placeholder="Sitio"
                value={newClaim.site}
                onChangeText={(text) => setNewClaim({ ...newClaim, site: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Tipo de desperfecto"
                value={newClaim.type}
                onChangeText={(text) => setNewClaim({ ...newClaim, type: text })}
              /> */}
              <Text style={styles.modalLabel}>Sitio</Text>
              <RNPickerSelect
                onValueChange={(value) => setNewClaim({ ...newClaim, site: value })}
                items={sites}
                style={pickerSelectStyles}
                placeholder={{ label: "Selecciona un sitio", value: '' }}
                value={newClaim.site}
              />
              
              <TouchableOpacity style={styles.addButtonModal} onPress={() => setSiteModalVisible(true)}>
                <Text style={styles.addSiteText}>Añadir Sitio</Text>
              </TouchableOpacity>

              <Text style={styles.modalLabel}>Desperfecto</Text>
              <RNPickerSelect
                onValueChange={(value) => setNewClaim({ ...newClaim, type: value })}
                items={defects}
                style={pickerSelectStyles}
                placeholder={{ label: "Selecciona un tipo de desperfecto", value: null }}
                value={newClaim.type}
              />

              <TouchableOpacity style={styles.addButtonModal} onPress={() => setDefectModalVisible(true)}>
                <Text style={styles.addSiteText}>Añadir Desperfecto</Text>
              </TouchableOpacity>

              <Text style={styles.modalLabel}>Descripcion</Text>
              <TextInput
                style={styles.input}
                placeholder="Descripcion"
                multiline
                numberOfLines={4}
                value={newClaim.description}
                onChangeText={(text) => setNewClaim({ ...newClaim, description: text })}
              />

              {newClaim.image && (
                <Image source={{ uri: newClaim.image }} style={styles.previewImage} />
              )}
              <TouchableOpacity style={styles.submitButton} onPress={submitClaim}>
                <Text style={styles.submitButtonText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
          </TouchableWithoutFeedback>
          
        </Modal>
      )}
      {claimModalVisible && selectedClaim && (
        <Modal visible={true} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Detalle del Reclamo</Text>
              <Text style={styles.modalLabel}>ID: {selectedClaim.idReclamo}</Text>
              <Text style={styles.modalLabel}>Descripcion: {selectedClaim.descripcion}</Text>
              <Text style={styles.modalLabel}>Estado: {statusTexts[selectedClaim.estado]}</Text>
              <Text style={styles.modalLabel}>Rubro: {selectedClaim.desperfecto.rubro.descripcion}</Text>
              <Text style={styles.modalHistoryTitle}>Imagenes cargadas</Text>
              <ScrollView horizontal style={styles.scrollView}>
      {claimPhotos.length === 0 ? (
        <Text style={styles.noHistoryText}>No hay imagenes cargadas para este reclamo</Text>
      ) : (
        <View style={styles.imagesContainer}>
          {claimPhotos.map((photo, index) => (
            <Image key={index} style={styles.image} source={{ uri: photo }} />
          ))}
        </View>
      )}
    </ScrollView>

    <TouchableOpacity style={styles.submitButton} onPress={() => selectPhoto(selectedClaim.idReclamo)}>
            <Text style={styles.detailTextPlus}>Agregar Fotos</Text>
            </TouchableOpacity> 

            {successMessage && <Text style={styles.successMessage}>{successMessage}</Text>}
            {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}

              <ScrollView contentContainerStyle={styles.historyContainer}>
                <Text style={styles.modalHistoryTitle}>Historial de Cambios</Text>
                {claimHistory.length === 0 ? (
                  <Text style={styles.noHistoryText}>Aun no se efectuaron cambios en este reclamo</Text>
                ) : (
                  claimHistory.map((change, index) => (
                    <View key={index} style={styles.historyItem}>
                      <Text style={styles.historyText}>Fecha: {change.fecha}</Text>
                      <Text style={styles.historyText}>Nuevo Estado: {statusTexts[change.estado]}</Text>
                      <Text style={styles.historyText}>Causa: {change.causa}</Text>
                      <Text style={styles.historyText}>Responsable: {change.responsable}</Text>
                    </View>
                  ))
                )}
              </ScrollView>
              <TouchableOpacity style={styles.closeButton} onPress={closeClaimModal}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {defectModalVisible && (
        <Modal visible={true} transparent={true} animationType="slide">
          <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setDefectModalVisible(false)}>
                <FontAwesome name="close" size={24} color="#00A676" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Nuevo Desperfecto</Text>
              <Text style={styles.modalSubTitle}>Desperfectos incoherentes o mal cargados seran eliminados por Municipalidad.</Text>
              <RNPickerSelect
                onValueChange={(value) => setNewDefect({ ...newRubro, rubro: value })}
                items={rubros}
                style={pickerSelectStyles}
                placeholder={{ label: "Selecciona un rubro", value: null }}
                value={newDefect.rubro}
              />
              <TouchableOpacity style={styles.addButtonModal} onPress={openRubroModal}>
                <Text style={styles.addSiteText}>Añadir Rubro</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="Descripcion"
                value={newDefect.description}
                onChangeText={(text) => setNewDefect({ ...newDefect, description: text })}
              />
              
              <TouchableOpacity style={styles.submitButton} onPress={submitDefect}>
                <Text style={styles.submitButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}

      {rubroModalVisible && (
        <Modal visible={true} transparent={true} animationType="slide">
          <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setRubroModalVisible(false)}>
                <FontAwesome name="close" size={24} color="#00A676" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Nuevo Rubro</Text>
              <Text style={styles.modalSubTitle}>Rubros incoherentes o mal cargados seran eliminados por Municipalidad.</Text>
              {/* Aqu铆 van los campos para agregar un desperfecto */}
              <TextInput
                style={styles.input}
                placeholder="Descripcion"
                value={newRubro.description}
                onChangeText={(text) => setNewRubro({ ...newRubro, description: text })}
              />
              <TouchableOpacity style={styles.submitButton} onPress={submitRubro}>
                <Text style={styles.submitButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}


      {siteModalVisible && (
        <Modal visible={true} transparent={true} animationType="slide">
          
          <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={closeSiteModal}>
                <FontAwesome name="close" size={24} color="#00A676" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Nuevo Sitio</Text>
              <Text style={styles.modalSubTitle}>Sitios incorrectos o mal cargados seran eliminados por Municipalidad.</Text>

              <TextInput
                style={styles.input}
                placeholder="Latitud"
                value={newSite.latitude}
                onChangeText={(text) => setNewSite({ ...newSite, latitude: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Longitud"
                keyboardType="numeric"
                value={newSite.longitude.toString()}
                onChangeText={(text) => setNewSite({ ...newSite, longitude: parseInt(text) || 0 })}
              />
              <TextInput
                style={styles.input}
                placeholder="Calle"
                value={newSite.street}
                onChangeText={(text) => setNewSite({ ...newSite, street: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Numero"
                keyboardType="numeric"
                value={newSite.number.toString()}
                onChangeText={(text) => setNewSite({ ...newSite, number: parseInt(text) || 0 })}
              />
              <TextInput
                style={styles.input}
                placeholder="Entre Calle A"
                value={newSite.betweenStreetA}
                onChangeText={(text) => setNewSite({ ...newSite, betweenStreetA: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Entre Calle B"
                value={newSite.betweenStreetB}
                onChangeText={(text) => setNewSite({ ...newSite, betweenStreetB: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Descripcion"
                value={newSite.description}
                onChangeText={(text) => setNewSite({ ...newSite, description: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="A Cargo De"
                value={newSite.inCharge}
                onChangeText={(text) => setNewSite({ ...newSite, inCharge: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Comentarios"
                multiline
                numberOfLines={4}
                value={newSite.comments}
                onChangeText={(text) => setNewSite({ ...newSite, comments: text })}
              />
              <TouchableOpacity style={styles.submitButton} onPress={submitSite}>
                <Text style={styles.submitButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
          </TouchableWithoutFeedback>
          
        </Modal>
      )}

      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  rnPicker:{
    marginBottom: 10,
  },
  addButtonModal: {
    backgroundColor: '#00A676',
    marginBottom: 10,
    width:'35%',
    borderRadius:20,
    padding: 5,
    marginTop: 10,
  },
  icon: {
    marginLeft: 10,
  },
  headerImage: {
    width: '100%',
    height: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
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
  table: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#00A676',
    paddingVertical: 10,
  },
  tableHeaderText: {
    flex: 1,
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 10, // Adding padding to match the header
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scrollView: {
    flexDirection: 'row',
  },
  imagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubTitle: {
    fontSize: 15,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalHistoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  historyContainer: {
    paddingVertical: 10,
  },
  historyItem: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  historyText: {
    fontSize: 14,
  },
  detailTextPlus: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  noHistoryText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    color: '#888',
  },
  successMessage: {
    color: 'green',
    textAlign: 'center',
    marginTop: 10,
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    placeholderTextColor:"#c7c7c7"
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  uploadButtonText: {
    marginLeft: 10,
    color: '#00A676',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: '#00A676',
    borderRadius: 5,
    padding: 15,
    marginTop: 10,
  },
  submitButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  addSiteText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize:11,
  },
  closeButtonText: {
    color: '#00A676',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    color: 'black',
    paddingRight: 30,
    marginBottom: 10, // A帽adido para mantener consistencia en el espaciado
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    backgroundColor: 'white', // ensure you set backgroundColor to 'white' if input is required
  },
}); 

export default ClaimsScreen;