import React, { useEffect, useState } from 'react';
import { TextInput, View, Text, Dimensions, StyleSheet, Image, Button, TouchableOpacity, ScrollView, Modal, Alert, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Footer from '../Footer';
import { FontAwesome } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import SearchableDropdown from 'react-native-searchable-dropdown';

const ComplaintScreen = () => {
  const navigation = useNavigation();
  const [claimPhotos, setClaimPhotos] = useState([]);
  const [avatarUri, setAvatarUri] = useState('https://via.placeholder.com/150');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showCommerceDropdown, setShowCommerceDropdown] = useState(false);
  const [denunciaModalVisible, setDenunciaModalVisible] = useState(false);
  const [newButtonModalVisible, setNewButtonModalVisible] = useState(false);
  const [tipoDenuncia, setTipoDenuncia] = useState('');
  const [sites, setSites] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [comercios, setComercios] = useState([]);
  const [denunciasContra, setDenunciasContra] = useState([]);
  const [showTipoDenunciaOptions, setShowTipoDenunciaOptions] = useState(false);
  const [showAceptaResponsabilidadOptions, setShowAceptaResponsabilidadOptions] = useState(false);
  const [usuarioComercio, setUsuarioComercio] = useState('');
  const [aceptaResponsabilidad, setAceptaResponsabilidad] = useState('');
  const [denuncias, setDenuncias] = useState([]);
  const [siteModalVisible, setSiteModalVisible] = useState(false);
  const [selectedDenuncia, setSelectedDenuncia] = useState(null);
  const [errorMessage, setErrorMessage] = useState(''); 
  const [warnMessage, setWarnMessage] = useState(''); 
  const [successMessage, setSuccessMessage] = useState(null);

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
    comments: ''
  });
  const [newComplaint, setNewComplaint] = useState({
    takes_responsibility: '',
    type: '',
    site: '',
    user_commerce: '',
    description: ''
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
        setSuccessMessage(`Imagen cargada a la denuncia ${id}. Refresque el detallado para visualizar`);
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

  

  const openSiteModal = () => {
    setSiteModalVisible(true);
  };

  const closeSiteModal = () => {
    setSiteModalVisible(false);
    setNewSite({ street: '', description: '' });
  };

  // Función para abrir el nuevo modal desde el botón
  const openNewButtonModal = () => {
    setNewButtonModalVisible(true);
  };

  // Función para cerrar el nuevo modal
  const closeNewButtonModal = () => {
    setNewButtonModalVisible(false);
  };

  
  // Función para obtener el tipo de denuncia
  const fetchTipoDenuncia = async (id) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      try {
        const response = await fetch(`https://4245-181-170-230-112.ngrok-free.app/system/denunciaobjetivo/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          console.log(response)
          throw new Error('No se pudo obtener el tipo de denuncia');
        }
        const data = await response.json();
        return data.tipoObjetivo; // Asumiendo que `tipoObjetivo` es el tipo de denuncia
      } catch (error) {
        console.error('Error al obtener el tipo de denuncia:', error);
        return null;
      }
    } else {
      console.error('No hay token');
      return null;
    }
  };

  

  useEffect(() => {
    if (newComplaint.type === 'Vecino') {
      setShowUserDropdown(true);
      setShowCommerceDropdown(false);
    } else if (newComplaint.type === 'Comercio') {
      setShowUserDropdown(false);
      setShowCommerceDropdown(true);
    } else {
      setShowUserDropdown(false);
      setShowCommerceDropdown(false);
    }
  }, [newComplaint.type]);





  const fetchDenuncias = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      try {
        const response = await fetch('https://4245-181-170-230-112.ngrok-free.app/system/misdenuncias', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('No se pudo obtener las denuncias');
        }
        const data = await response.json();
        
        const updatedDenuncias = await Promise.all(data.map(async (denuncia) => {
          const tipo = await fetchTipoDenuncia(denuncia.idDenuncia);
          return { ...denuncia, tipoDenuncia: tipo };
        }));

        setDenuncias(updatedDenuncias);
      } catch (error) {
        console.error('Error al obtener las denuncias:', error);
      }
    } else {
      console.error('No hay token');
    }
  };

  const fetchDenunciasContra = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      try {
        const response = await fetch('https://4245-181-170-230-112.ngrok-free.app/system/fuidenunciado', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('No se pudo obtener las denuncias en tu contra');
        }
        const data = await response.json();
        
        const updatedDenunciasContra = await Promise.all(data.map(async (denuncia) => {
          const tipo = await fetchTipoDenuncia(denuncia.denuncia.idDenuncia);
          return { ...denuncia, denuncia: { ...denuncia.denuncia, tipoDenuncia: tipo } };
        }));

        setDenunciasContra(updatedDenunciasContra);
      } catch (error) {
        console.error('Error al obtener las denuncias en tu contra:', error);
      }
    } else {
      console.error('No hay token');
    }
  };
  

  // Función para obtener las denuncias del servidor
  useEffect(() => {
    
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
            label: `Dirección: ${site.calle} - Descripción: ${site.descripcion}`,
            value: site.idSitio, // Asegúrate de que `value` sea una cadena
          }));
    
          setSites(sitesOptions);
          
        } catch (error) {
          console.error('Error al obtener los sitios:', error);
        }
      } else {
        console.error('No hay token');
      }
    }

    const fetchUsuarios = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        try {
          const response = await fetch('https://4245-181-170-230-112.ngrok-free.app/system/usuarios', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error('No se pudo obtener los usuarios');
          }
          const data = await response.json();
          console.log('Usuarios:', data);

          const usuariosOptions = data.map(usuario => ({
            label: usuario.username,
            value: usuario.id,
          }));
          setUsuarios(usuariosOptions);
          
        } catch (error) {
          console.error('Error al obtener los usuarios:', error);
        }
      } else {
        console.error('No hay token');
      }
    }

    const fetchComercios = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        try {
          const response = await fetch('https://4245-181-170-230-112.ngrok-free.app/system/comercios', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error('No se pudo obtener los comercios');
          }
          const data = await response.json();
          console.log('Comercios:', data);

          const comerciosOptions = data.map(comercio => ({
            label: comercio.nombreComercio,
            value: comercio.idComercio,
          }));
          setComercios(comerciosOptions);
          
        } catch (error) {
          console.error('Error al obtener los comercios:', error);
        }
      } else {
        console.error('No hay token');
      }
    }

    

    fetchUsuarios();
    fetchComercios();
    fetchDenuncias();
    fetchSites();
    fetchDenunciasContra();
  }, []);

  const fetchClaimHistory = async (id) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      try {
        const [photosResponse] = await Promise.all([
          fetch(`https://4245-181-170-230-112.ngrok-free.app/system/denuncias/fotos/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          })
        ]);

        if (!photosResponse.ok) {
          throw new Error('No se pudieron obtener las fotos del reclamo');
        }
        
        const photosData = await photosResponse.json();
        setClaimPhotos(photosData.map(photo => `data:image/jpeg;base64,${photo.foto}`));

      } catch (error) {
        console.error('Error al obtener las fotos del reclamo:', error);
      }
    } else {
      console.error('No hay token');
    }
  };



  // Función para abrir el modal de detalles de denuncia
  const openDenunciaModal = (denuncia) => {
    setSelectedDenuncia(denuncia);
    fetchClaimHistory(denuncia.idDenuncia);
    setDenunciaModalVisible(true);
  };

  // Función para cerrar el modal de detalles de denuncia
  const closeDenunciaModal = () => {
    setDenunciaModalVisible(false);
    setSelectedDenuncia(null);
  };

  // Estado de la denuncia (puedes adaptar esto según los estados que tengas)
  const statusTexts = {
    1: 'En Revisión',
    2: 'Aceptado',
    3: 'Finalizado',
    4: 'Denegado'
  };

  // Colores de estado
  const statusColors = {
    'En Revisión': '#FFA500', // Naranja
    'Aceptado': '#00A676', // Verde
    'Finalizado': '#0000FF', // Azul
    'Denegado': '#FF0000' // Rojo
  };

  const handleSubmit = async () => {
    // Definir variables para tipoDenuncia y aceptaRespo
    let tipoDenunciaValue;
    let aceptaRespoValue;
  
    
    console.log(newComplaint.type)
    console.log(newComplaint.takes_responsibility)

    // Convertir los valores de los campos a los formatos correctos
    if (tipoDenuncia === 'Usuario') {
      tipoDenunciaValue = 1;
    } else if (tipoDenuncia === 'Comercio') {
      tipoDenunciaValue = 2;
    }
  
    if (aceptaResponsabilidad === 'Sí') {
      aceptaRespoValue = true;
    } else if (aceptaResponsabilidad === 'No') {
      aceptaRespoValue = false;
    }
  
    // Crear el objeto de denuncia
    const nuevaDenuncia = {
      descripcion: newComplaint.description,
      sitio: newComplaint.site,
      denunciado: newComplaint.user_commerce,
      aceptaRespo: aceptaRespoValue,
      tipoDenuncia: tipoDenunciaValue
    };
  
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error('No hay token');
        return;
      }
  
      const response = await fetch('https://4245-181-170-230-112.ngrok-free.app/system/denuncias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(nuevaDenuncia),
      });

      const data = await response.json();
      
      console.log("yo: ", data)

      console.log('Denuncia enviada con éxito:', data);

      

    } catch (error) {
      
  
      // Verificar si el mensaje de error contiene "Unexpected token 'D'"
      if (error.message && error.message.includes("Unexpected character: D") || error.message && error.message.includes("Unexpected token 'D'")) {
          fetchDenuncias();
          fetchDenunciasContra();
          closeNewButtonModal();
          console.log('Denuncia enviada con éxito:');
          setErrorMessage(''); // Mostrar error si no hay token

      } else {
        closeDenunciaModal();
        setErrorMessage('Hubo un error al procesar la solicitud. Intentalo nuevamente');
        console.log(nuevaDenuncia)
        
      
      }
  }
};

  /* const submitComplaint = async (complaint) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      try {
        const response = await fetch('https://4245-181-170-230-112.ngrok-free.app/system/denuncias', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(complaint),
        });
        if (!response.ok) {
          throw new Error('Error al enviar la denuncia');
        }
        const data = await response.json();
        console.log('Denuncia enviada:', data);
        // Actualizar la lista de denuncias con la nueva denuncia
        setDenuncias([...denuncias, data]);
      } catch (error) {
        console.error('Error al enviar la denuncia:', error);
      }
    } else {
      console.error('No hay token');
    }
  }; */

  const submitSite = async () => {
    console.log(newSite);
    if (newSite.street && newSite.description && newSite.latitude && newSite.longitude && newSite.number && newSite.betweenStreetA && newSite.betweenStreetB && newSite.inCharge && newSite.comments) {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          throw new Error('No se encontró el token de acceso');
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
            comentarios: newSite.comments
          }),
        });
        if (response.ok) {
          const responseData = await response.json();
          setSites([...sites, { label: `Dirección: ${responseData.calle} - Descripción: ${responseData.descripcion}`, value: responseData.idSitio }]);
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
            comments: ''
          });
          setSiteModalVisible(false);
          alert('Sitio agregado exitosamente');
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


  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/denuncias.jpg')} style={styles.headerImage} />
      <Text style={styles.title}>MUNI<Text style={styles.titleHighlight}>LIFE</Text></Text>
      <Text style={styles.subtitle}>DENUNCIAS</Text>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mis Denuncias</Text>
          <TouchableOpacity style={styles.addButton} onPress={openNewButtonModal}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>ID</Text>
            <Text style={styles.tableHeaderText}>Tipo</Text>
            <Text style={styles.tableHeaderText}>Estado</Text>
            <Text style={styles.tableHeaderText}>Sitio</Text>

          </View>
          {denuncias.map(denuncia => (
            <TouchableOpacity key={denuncia.idDenuncia} style={styles.tableRow} onPress={() => openDenunciaModal(denuncia)}>
              <Text style={styles.tableCell} numberOfLines={1} adjustsFontSizeToFit>{denuncia.idDenuncia}</Text>
              <Text style={styles.tableCell}>{denuncia.tipoDenuncia}</Text>
              <Text style={[styles.tableCell, { color: statusColors[statusTexts[denuncia.estado]] }]}>{statusTexts[denuncia.estado]}</Text>
              <Text style={styles.tableCell} numberOfLines={1} adjustsFontSizeToFit>{denuncia.sitio.calle} {denuncia.sitio.numero}</Text>

            </TouchableOpacity>
          ))}
        </View>
  

        {/* Separación visual */}
        <View style={styles.divider} />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Denuncias en mi contra</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>ID</Text>
            <Text style={styles.tableHeaderText}>Denunciante</Text>
            <Text style={styles.tableHeaderText}>Estado</Text>
            <Text style={styles.tableHeaderText}>Sitio</Text>
          </View>
          {denunciasContra.map(({ denuncia }) => (
            <TouchableOpacity key={denuncia.idDenuncia} style={styles.tableRow} onPress={() => openDenunciaModal(denuncia)}>
              <Text style={styles.tableCell} numberOfLines={1} adjustsFontSizeToFit>{denuncia.idDenuncia}</Text>
              <Text style={styles.tableCell}>{denuncia.denunciante.nombre} {denuncia.denunciante.apellido}</Text>
              <Text style={[styles.tableCell, { color: statusColors[statusTexts[denuncia.estado]] }]}>{statusTexts[denuncia.estado]}</Text>
              <Text style={styles.tableCell} numberOfLines={1} adjustsFontSizeToFit>{denuncia.sitio.calle} {denuncia.sitio.numero}</Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      {/* Modal para el nuevo formulario de denuncia */}
      <Modal visible={newButtonModalVisible} transparent={true} animationType="slide">
      <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={closeNewButtonModal}>
              <FontAwesome name="close" size={24} color="#00A676" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Nueva Denuncia</Text>

            {/* Formulario de denuncia */}
            {/* <View style={styles.formGroup}>
              <Text style={styles.label}>Tipo Denuncia:</Text>
              <View style={styles.inputContainer}>
                <TouchableOpacity
                  style={[styles.dropdown, newComplaint.type === 'Vecino' && styles.dropdownSelected]}
                  onPress={() => setNewComplaint({...newComplaint, type: 'Vecino'})}>
                  <Text>Vecino</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.dropdown, newComplaint.type === 'Comercio' && styles.dropdownSelected]}
                  onPress={() => setNewComplaint({...newComplaint, type: 'Comercio'})}>
                  <Text>Comercio</Text>
                </TouchableOpacity>
              </View>
            </View> */}

            <Text style={styles.modalLabel}>Tipo de Denuncia:</Text>
            <TouchableOpacity style={styles.dropdown} onPress={() => setShowTipoDenunciaOptions(!showTipoDenunciaOptions)}>
              <Text style={styles.dropdownText}>{tipoDenuncia || 'Seleccionar'}</Text>
              <FontAwesome name="caret-down" size={24} color="black" />
            </TouchableOpacity>
            {showTipoDenunciaOptions && (
              <View style={styles.dropdownOptions}>
               <TouchableOpacity style={styles.dropdownOption} onPress={() => { setShowUserDropdown(true); setTipoDenuncia('Usuario'); setShowTipoDenunciaOptions(false); setShowCommerceDropdown(false)}}>
                  <Text style={styles.dropdownOptionText}>Usuario</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dropdownOption} onPress={() => { setShowCommerceDropdown(true); setTipoDenuncia('Comercio'); setShowTipoDenunciaOptions(false); setShowUserDropdown(false) }}>
                  <Text style={styles.dropdownOptionText}>Comercio</Text>
                </TouchableOpacity>
              </View>
            )}

            <Text style={styles.label}>Sitio:</Text>
            <RNPickerSelect
                onValueChange={(value) => setNewComplaint({ ...newComplaint, site: value })}
                items={sites}
                style={pickerSelectStyles}
                placeholder={{ label: "Selecciona un sitio", value: '' }}
                value={newComplaint.site}
            />

              <TouchableOpacity style={styles.addButtonModal} onPress={openSiteModal}>
                <Text style={styles.addSiteText}>Añadir Sitio</Text>
              </TouchableOpacity>

              {showUserDropdown && (
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Usuario:</Text>
                  <RNPickerSelect
                      onValueChange={(value) => setNewComplaint({ ...newComplaint, user_commerce: value })}
                      items={usuarios}
                      style={pickerSelectStyles}
                      placeholder={{ label: "Selecciona un usuario", value: '' }}
                      value={newComplaint.user_commerce}
                  />
                </View>
              )}

              {showCommerceDropdown && (
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Comercio:</Text>
                  <RNPickerSelect
                      onValueChange={(value) => setNewComplaint({ ...newComplaint, user_commerce: value })}
                      items={comercios}
                      style={pickerSelectStyles}
                      placeholder={{ label: "Selecciona un comercio", value: '' }}
                      value={newComplaint.user_commerce}
                  />
                </View>
              )}
            
            {/* <View style={styles.formGroup}>
              <Text style={styles.label}>Usuario / Comercio a denunciar:</Text>
              <TextInput
                style={styles.input}
                value={newComplaint.user_commerce}
                onChangeText={text => setNewComplaint({ ...newComplaint, user_commerce: text })}
                placeholder="Escriba el nombre"
              />
            </View> */}

            {/* <View style={styles.formGroup}>
              <Text style={styles.label}>Acepta Responsabilidad:</Text>
              <View style={styles.inputContainer}>
                <TouchableOpacity
                  style={[styles.dropdown, newComplaint.takes_responsibility === 'Sí' && styles.dropdownSelected]}
                  onPress={() => setNewComplaint({...newComplaint, takes_responsibility: 'Sí'})}>
                  <Text>Sí</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.dropdown, newComplaint.takes_responsibility === 'No' && styles.dropdownSelected]}
                  onPress={() => setNewComplaint({...newComplaint, takes_responsibility: 'No'})}>
                  <Text>No</Text>
                </TouchableOpacity>
              </View>
            </View> */}

            <Text style={styles.modalLabel}>Acepta Responsabilidad:</Text>
            <TouchableOpacity style={styles.dropdown} onPress={() => setShowAceptaResponsabilidadOptions(!showAceptaResponsabilidadOptions)}>
              <Text style={styles.dropdownText}>{aceptaResponsabilidad || 'Seleccionar'}</Text>
              <FontAwesome name="caret-down" size={24} color="black" />
            </TouchableOpacity>
            {showAceptaResponsabilidadOptions && (
              <View style={styles.dropdownOptions}>
                <TouchableOpacity style={styles.dropdownOption} onPress={() => { setAceptaResponsabilidad('Sí'); setShowAceptaResponsabilidadOptions(false); setWarnMessage(false)}}>
                  <Text style={styles.dropdownOptionText}>Sí</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dropdownOption} onPress={() => { setAceptaResponsabilidad('No'); setShowAceptaResponsabilidadOptions(false); setWarnMessage(true)}}>
                  <Text style={styles.dropdownOptionText}>No</Text>
                </TouchableOpacity>
              </View>
            )}

              {warnMessage && <Text style={styles.warnMessage}>{warnMessage}</Text>}

            <TextInput
                style={styles.input}
                placeholder="Descripción"
                multiline
                numberOfLines={4}
                value={newComplaint.description}
                onChangeText={(text) => setNewComplaint({ ...newComplaint, description: text })}
              />
            {errorMessage !== '' && (
            <Text style={styles.errorText}>{errorMessage}</Text>
            )}
            {/* Botón de enviar */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal para los detalles de la denuncia */}
      <Modal visible={denunciaModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={closeDenunciaModal}>
              <FontAwesome name="close" size={24} color="#00A676" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Detalles de la Denuncia</Text>
            {selectedDenuncia && (
              <>
                <Text style={styles.detailText}>ID: {selectedDenuncia.idDenuncia}</Text>
                <Text style={styles.detailText}>Tipo: {selectedDenuncia.tipoDenuncia}</Text>
                <Text style={styles.detailText}>Estado: {statusTexts[selectedDenuncia.estado]}</Text>
                <Text style={styles.detailText}>Sitio: {selectedDenuncia.sitio.calle} {selectedDenuncia.sitio.numero}</Text>
                <Text style={styles.detailText}>Responsabilidad: {selectedDenuncia.aceptaResponsabilidad ? 'Sí' : 'No'}</Text>
                <Text style={styles.modalHistoryTitle}>Imágenes cargadas</Text>
              <ScrollView horizontal style={styles.scrollView}>
      {claimPhotos.length === 0 ? (
        <Text style={styles.noHistoryText}>No hay imágenes cargadas para esta denuncia</Text>
      ) : (
        <View style={styles.imagesContainer}>
          {claimPhotos.map((photo, index) => (
            <Image key={index} style={styles.image} source={{ uri: photo }} />
          ))}
        </View>
      )}

    </ScrollView>
    <TouchableOpacity style={styles.submitButton} onPress={() => selectPhoto(selectedDenuncia.idDenuncia)}>
            <Text style={styles.detailTextPlus}>Agregar Fotos</Text>
            </TouchableOpacity> 

            {successMessage && <Text style={styles.successMessage}>{successMessage}</Text>}
            {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}

              </>
            )}
          </View>

        </View>
      </Modal>

      {siteModalVisible && (
        <Modal visible={true} transparent={true} animationType="slide">
          <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={closeSiteModal}>
                <FontAwesome name="close" size={24} color="#00A676" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Nuevo Sitio</Text>
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
                placeholder="Número"
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
                placeholder="Descripción"
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
  addButtonModal: {
    backgroundColor: '#00A676',
    marginBottom: 10,
    width:'35%',
    borderRadius:20,
    padding: 5,
    marginTop: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  headerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
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
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
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
    color: '#FFF',
    fontSize: 24,
  },
  table: {
    marginTop: 10,
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
    paddingVertical: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 5, // Adding padding to match the header
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  dropdownText: {
    fontSize: 16,
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    marginRight: 10,
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownOptions: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
  dropdownOption: {
    padding: 10,
  },
  dropdownOptionText: {
    fontSize: 16,
  },
  dropdownSelected: {
    backgroundColor: '#00A676',
    color: '#FFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    placeholderTextColor:"#c7c7c7"
  },
  addSiteText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize:11,
  },
  submitButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  detailText: {
    fontSize: 16,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#00A676',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  detailTextPlus: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  divider: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    marginBottom: 20,
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
  noHistoryText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    color: '#888',
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
  modalHistoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

const stylesDropdown = StyleSheet.create({
  textInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  dropdownItem: {
    padding: 10,
    marginTop: 2,
    backgroundColor: '#FAF9F8',
    borderColor: '#bbb',
    borderWidth: 1,
    borderRadius: 5,
  },
  dropdownItemText: {
    color: '#222',
  },
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
    marginBottom: 10, // Añadido para mantener consistencia en el espaciado
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    color: 'black',
    paddingRight: 30,
    marginBottom: 10, // Añadido para mantener consistencia en el espaciado
  },
}); 


export default ComplaintScreen;