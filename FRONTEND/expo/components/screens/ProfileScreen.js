import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarUri, setAvatarUri] = useState('https://via.placeholder.com/150');
  const [isInspector, setIsInspector] = useState(false); // Estado para el toggle switch
  const [userRole, setUserRole] = useState(null); // Estado para el rol de usuario

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const role = await AsyncStorage.getItem('userRole');
        setUserRole(role);

        const [userResponse, reclamosResponse, denunciasResponse] = await Promise.all([
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
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const selectPhoto = () => {
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
        uploadPhoto(base64String);
      }
    });
  };

  const extractBase64FromUri = (uri) => {
    // La URI puede tener un formato como 'data:image/jpeg;base64,...'
    // Debemos extraer solo la parte base64
    const base64Index = uri.indexOf('base64,') + 7;
    return uri.substring(base64Index);
  };

  const uploadPhoto = async (base64String) => {
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
  
      const response = await axios.post('https://4245-181-170-230-112.ngrok-free.app/system/subir-foto-base64', data, config);
  
      if (response.status === 200) {
        Alert.alert('Success', 'Foto de perfil actualizada correctamente');
      } else {
        Alert.alert('Error', `No se pudo actualizar la foto de perfil: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      Alert.alert('Error', 'Hubo un error al subir la foto');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#00A676" />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.navigate(isInspector ? 'Inspector' : 'Home')}
      >
        <Icon name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={selectPhoto} style={styles.avatarButton}>
          <Image style={styles.avatar} source={{ uri: avatarUri }} />
          <View style={styles.iconContainer}>
            <Icon name="pencil" size={24} color="white" />
          </View>
        </TouchableOpacity>
      </View>
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.id}>{user.id}</Text>

      <View style={styles.card}>
        <Text style={styles.cardHeader}>¡Gracias por tu colaboracion!</Text>
        <Text style={styles.sectionHeader}>Acciones realizadas:</Text>
        <Text style={styles.sectionItem}>Reclamos: {user.actions.claims}</Text>
        <Text style={styles.sectionItem}>Denuncias: {user.actions.reports}</Text>
        <Text style={styles.sectionHeader}>Prestaciones:</Text>
        <Text style={styles.sectionItem}>Comercios: {user.services.commerce}</Text>
        <Text style={styles.sectionItem}>Servicios: {user.services.services}</Text>
      </View>

      {/* Renderizar el toggle solo si el rol es INSPECTOR */}
      {userRole === 'INSPECTOR' && (
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Modo Inspector</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#00A676" }}
            thumbColor={isInspector ? "#ffffff" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => setIsInspector(previousState => !previousState)}
            value={isInspector}
          />
        </View>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
        <Text style={styles.footerText}>MUNI<Text style={styles.footerHighlight}>LIFE</Text></Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarButton: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  iconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#00000080',
    borderRadius: 12,
    padding: 5,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  id: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 20,
  },
  card: {
    width: '100%',
    padding: 20,
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  cardHeader: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 10,
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginVertical: 10,
    textAlign: 'center',
  },
  sectionItem: {
    fontSize: 16,
    color: '#333333',
    marginVertical: 5,
    textAlign: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  switchLabel: {
    fontSize: 18,
    marginRight: 10,
    color: '#000',
  },
  footerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 20,
  },
  footerHighlight: {
    color: '#00A676',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 10,
  },
});

export default ProfileScreen;
