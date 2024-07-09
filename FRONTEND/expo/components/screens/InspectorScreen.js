import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal, TextInput, ActivityIndicator } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

const InspectorScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newClaim, setNewClaim] = useState({});
  const [claims, setClaims] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [avatarUri, setAvatarUri] = useState(null);
  const [user, setUser] = useState(null);
  const [claimModalVisible, setClaimModalVisible] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [claimPhotos, setClaimPhotos] = useState([]);
  const [claimHistory, setClaimHistory] = useState([]);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [newStatus, setNewStatus] = useState(null);
  const [changeCause, setChangeCause] = useState('');
  const [selectedClaimId, setSelectedClaimId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const role = await AsyncStorage.getItem('userRole');
        setUserRole(role);

        const [userResponse, reclamosResponse, denunciasResponse, inspectorReclamosResponse] = await Promise.all([
          fetch('https://4245-181-170-230-112.ngrok-free.app/system/usuarios/yo', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then(res => res.json()),
          fetch('https://4245-181-170-230-112.ngrok-free.app/system/misreclamos', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then(res => res.json()),
          fetch('https://4245-181-170-230-112.ngrok-free.app/system/misdenuncias', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then(res => res.json()),
          fetch('https://4245-181-170-230-112.ngrok-free.app/system/reclamos/inspector', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then(res => res.json()),
        ]);

        const formattedUser = {
          name: `${userResponse.nombre} ${userResponse.apellido}`,
          id: userResponse.dni,
          actions: {
            claims: reclamosResponse.length,
            reports: denunciasResponse.length,
          },
          services: {
            commerce: userResponse.comercios.length,
            services: userResponse.servicios.length,
          },
        };
        setUser(formattedUser);

        if (userResponse.foto) {
          setAvatarUri(`data:image/jpeg;base64,${userResponse.foto}`);
        }

        setClaims(inspectorReclamosResponse);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const statusColors = {
    'En Revisión': '#FFA500',
    'Aceptado': '#00A676',
    'Finalizado': '#0000FF',
    'Denegado': '#FF0000'
  };

  const statusTexts = {
    1: 'En Revisión',
    2: 'Aceptado',
    3: 'Finalizado',
    4: 'Denegado'
  };

  const submitUpdate = async () => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      const response = await fetch(`https://4245-181-170-230-112.ngrok-free.app/system/reclamos/upd/${selectedClaimId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ estado: newStatus, causa: changeCause }),
      });
      if (response.ok) {
        setUpdateModalVisible(false);
        fetchClaims(); // Refresh the claims list after updating
      } else {
        console.error('Error updating claim status');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

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

  const openClaimModal = (claim) => {
    setSelectedClaim(claim);
    fetchClaimHistory(claim.idReclamo);
    setClaimModalVisible(true);
  };

  const updateStatus = (claimId) => {
    setSelectedClaimId(claimId);
    setUpdateModalVisible(true);
  };

  const closeClaimModal = () => {
    setClaimModalVisible(false);
    setSelectedClaim(null);
    setClaimHistory([]);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#00A676" />;
  }

  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/reclamos.jpg')} style={styles.headerImage} />
      <Text style={styles.title}>MUNI<Text style={styles.titleHighlight}>LIFE</Text></Text>
      <Text style={styles.subtitle}>PANEL INSPECTOR</Text>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reclamos Asignados</Text>
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
        {successMessage && <Text style={styles.successMessage}>{successMessage}</Text>}
        {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
      </ScrollView>
      {modalVisible && (
        <Modal visible={true} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <FontAwesome name="close" size={24} color="#00A676" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Nuevo Reclamo</Text>
              <Text style={styles.modalLabel}>Sitio</Text>
              <RNPickerSelect
                onValueChange={(value) => setNewClaim({ ...newClaim, site: value })}
                items={sites}
                style={styles.rnPicker}
                placeholder={{ label: "Selecciona un sitio", value: '' }}
                value={newClaim.site}
              />
              <Text style={styles.modalLabel}>Desperfecto</Text>
              <RNPickerSelect
                onValueChange={(value) => setNewClaim({ ...newClaim, type: value })}
                items={defects}
                style={pickerSelectStyles}
                placeholder={{ label: "Selecciona un tipo de desperfecto", value: null }}
                value={newClaim.type}
              />
              <Text style={styles.modalLabel}>Descripcion</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingrese una descripción"
                onChangeText={(value) => setNewClaim({ ...newClaim, description: value })}
                value={newClaim.description}
              />
              <Text style={styles.modalLabel}>Acepta Responsabilidad</Text>
              <RNPickerSelect
                onValueChange={(value) => setNewClaim({ ...newClaim, acceptsResponsibility: value })}
                items={[
                  { label: 'Sí', value: true },
                  { label: 'No', value: false },
                ]}
                style={pickerSelectStyles}
                placeholder={{ label: "Selecciona una opción", value: null }}
                value={newClaim.acceptsResponsibility}
              />
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Crear Reclamo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
      <Modal visible={claimModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={closeClaimModal}>
              <Ionicons name="close" size={24} color="#00A676" />
            </TouchableOpacity>
            {selectedClaim && (
              <>
                <Text style={styles.modalTitle}>Detalle del Reclamo</Text>
                <Text style={styles.claimLabel}>Denunciante: {selectedClaim.denunciante.nombre} {selectedClaim.denunciante.apellido} </Text>
                <Text style={styles.claimLabel}>Tipo: {selectedClaim.desperfecto.rubro.descripcion}</Text>
                <Text style={styles.claimLabel}>Descripción: {selectedClaim.descripcion}</Text>
                <Text style={styles.claimLabel}>Estado: <Text style={{ color: statusColors[statusTexts[selectedClaim.estado]] }}>{statusTexts[selectedClaim.estado]}</Text></Text>
                <Text style={styles.claimLabel}>Historial:</Text>
                {claimHistory.map((entry, index) => (
                  <View key={index} style={styles.historyEntry}>
                    <Text style={styles.historyText}>Fecha: {new Date(entry.fecha).toLocaleDateString()}</Text>
                    <Text style={styles.historyText}>Estado: <Text style={{ color: statusColors[statusTexts[entry.estado]] }}>{statusTexts[entry.estado]}</Text></Text>
                    <Text style={styles.historyText}>Causa: {entry.causa}</Text>
                  </View>
                ))}
                <Text style={styles.claimLabel}>Fotos:</Text>
                <ScrollView horizontal>
                  {claimPhotos.map((photo, index) => (
                    <Image key={index} source={{ uri: photo }} style={styles.claimPhoto} />
                  ))}
                </ScrollView>
                <TouchableOpacity style={styles.updateButton} onPress={() => updateStatus(selectedClaim.idReclamo)}>
                  <Text style={styles.updateButtonText}>Actualizar Estado</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
      <Modal visible={updateModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setUpdateModalVisible(false)}>
              <FontAwesome name="close" size={24} color="#00A676" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Actualizar Estado</Text>
            <Text style={styles.modalLabel}>Nuevo Estado</Text>
            <RNPickerSelect
              onValueChange={(value) => setNewStatus(value)}
              items={[
                { label: 'En Revisión', value: 1 },
                { label: 'Aceptado', value: 2 },
                { label: 'Finalizado', value: 3 },
                { label: 'Denegado', value: 4 },
              ]}
              style={pickerSelectStyles}
              placeholder={{ label: "Selecciona un nuevo estado", value: null }}
              value={newStatus}
            />
            <Text style={styles.modalLabel}>Causa del Cambio</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese la causa del cambio"
              onChangeText={setChangeCause}
              value={changeCause}
            />
            <TouchableOpacity style={styles.submitButton} onPress={submitUpdate}>
              <Text style={styles.submitButtonText}>Actualizar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          AsyncStorage.getItem('userToken').then(token => {
            if (token) {
              navigation.navigate("Profile");
            } else {
              console.error('No token found');
            }
          });
        }}
      >
        <Ionicons name="arrow-back" size={24} color="#000" style={styles.backButtonIcon} />
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
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
    paddingBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableCell: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 16,
    color: '#333',
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#00A676',
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  updateButton: {
    width: '100%',
    backgroundColor: '#00A676',
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  claimLabel: {
    fontSize: 16,
    color: '#333',
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  historyEntry: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  historyText: {
    fontSize: 14,
    color: '#333',
  },
  historyItem: {
    marginTop: 10,
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
  claimPhoto: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00A676',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 40,
    left: 20,
  },
  backButtonIcon: {
    marginRight: 10,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  rnPicker: {
    inputIOS: {
      color: '#333',
      paddingTop: 13,
      paddingHorizontal: 10,
      paddingBottom: 12,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      backgroundColor: 'white',
      fontSize: 16,
      marginTop: 10,
      marginBottom: 10
    },
    inputAndroid: {
      color: '#333',
      paddingTop: 13,
      paddingHorizontal: 10,
      paddingBottom: 12,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      backgroundColor: 'white',
      fontSize: 16,
      marginTop: 10,
      marginBottom: 10
    }
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    color: '#333',
    paddingTop: 13,
    paddingHorizontal: 10,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    backgroundColor: 'white',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  inputAndroid: {
    color: '#333',
    paddingTop: 13,
    paddingHorizontal: 10,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    backgroundColor: 'white',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
  },
});

export default InspectorScreen;

