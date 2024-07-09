import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, TextInput, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NoFooter from "../NoFoot";

const commercesData = [
  {
    id: "1",
    nombreComercio: "Lo de Charly",
    foto: "https://via.placeholder.com/150",
    direccion: "Calle Falsa 123",
    apertura: "9:00 AM",
    descripcion: "Descripción del Comercio 1",
  },
  {
    id: "2",
    nombreComercio: "Los Campeones",
    foto: "https://via.placeholder.com/150",
    direccion: "Avenida Siempreviva 742",
    apertura: "10:00 AM",
    descripcion: "Descripción del Comercio 2",
  },
  {
    id: "3",
    nombreComercio: "Farmacity",
    foto: "https://via.placeholder.com/150",
    direccion: "Calle Verdadera 456",
    apertura: "8:00 AM",
    descripcion: "Descripción del Comercio 3",
  },
];

const servicesData = [
  {
    id: "1",
    nombreServicio: "Profesora Particular",
    foto: "https://via.placeholder.com/150",
    descripcion: "Descripción del Servicio 1",
  },
  {
    id: "2",
    nombreServicio: "Plomero",
    foto: "https://via.placeholder.com/150",
    descripcion: "Descripción del Servicio 2",
  },
  {
    id: "3",
    nombreServicio: "Pintor",
    foto: "https://via.placeholder.com/150",
    descripcion: "Descripción del Servicio 3",
  },
];

const NoHomeScreen = () => {
  const [shops, setShops] = useState(commercesData);
  const [services, setServices] = useState(servicesData);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false); // User modal state
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredShops, setFilteredShops] = useState(commercesData);
  const [filteredServices, setFilteredServices] = useState(servicesData);

  const [user, setUser] = useState(null);
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredShops(shops);
      setFilteredServices(services);
    } else {
      setFilteredShops(
        Array.isArray(shops) ? 
        shops.filter((shop) =>
          shop.nombreComercio.toLowerCase().includes(searchQuery.toLowerCase())
        ) : []
      );
      setFilteredServices(
        Array.isArray(services) ? 
        services.filter((service) =>
          service.nombreServicio.toLowerCase().includes(searchQuery.toLowerCase())
        ) : []
      );
    }
  }, [searchQuery, shops, services]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');

        const [shopsResponse, servicesResponse] = await Promise.all([
          fetch('https://4245-181-170-230-112.ngrok-free.app/system/comercios', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then(res => res.json()),
          fetch('https://4245-181-170-230-112.ngrok-free.app/system/servicios', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then(res => res.json())
        ]);

        setShops(shopsResponse);
        setFilteredShops(shopsResponse);
        setServices(servicesResponse);
        setFilteredServices(servicesResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const openModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalVisible(false);
  };

  const openUserModal = () => {
    setUserModalVisible(true);
  };

  const closeUserModal = () => {
    setUserModalVisible(false);
  };

  const handleLogin = () => {
    closeUserModal();
    navigation.navigate("Login");
  };

  const renderImage = (foto) => {
    if (!foto) {
      return (
        <Image source={require("../../../assets/IMAGENNOCARGADA.png")} style={styles.cardImage} />
      );
    } else if (foto.startsWith('/9j/') || foto.length > 50) {
      return (
        <Image source={{ uri: `data:image/jpeg;base64,${foto}` }} style={styles.cardImage} />
      );
    } else {
      return (
        <Image source={{ uri: foto }} style={styles.cardImage} />
      );
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/comercios.jpeg")}
        style={styles.headerImage}
      />
      <Text style={styles.title}>
        MUNI<Text style={styles.titleHighlight}>LIFE</Text>
      </Text>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.welcomeText}>Bienvenido</Text>
      </Animated.View>

      <TextInput
        style={styles.searchBar}
        placeholder="Buscar comercios o servicios..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tiendas Destacadas</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filteredShops.map((shop, index) => (
            <TouchableOpacity key={index} style={styles.card} onPress={() => openModal(shop)}>
              {renderImage(shop.foto)}
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{shop.nombreComercio}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.separator} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Servicios Destacados</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filteredServices.map((service, index) => (
            <TouchableOpacity key={index} style={styles.card} onPress={() => openModal(service)}>
              {renderImage(service.imagen)}
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{service.nombreServicio}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                {renderImage(selectedItem.foto)}
                {renderImage(selectedItem.imagen)}
                <Text style={styles.modalTitle}>{selectedItem.nombreComercio || selectedItem.nombreServicio}</Text>
                <Text style={styles.modalDescription}>{selectedItem.descripcion}</Text>
                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                  <Text style={styles.closeButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.userButton}
        onPress={() => navigation.navigate("Profile")}
      >
        <Ionicons name="person-circle-outline" size={40} color="#000" />
      </TouchableOpacity>
      
      <NoFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  headerImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    color: "#000000",
  },
  titleHighlight: {
    color: "#00A676",
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    color: "#333333",
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#00A676",
  },
  searchBar: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    margin: 16,
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginRight: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    width: 200,
  },
  cardImage: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
  },
  cardInfo: {
    padding: 16,
  },
  cardName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  separator: {
    height: 20,
  },
  userButton: {
    position: "absolute",
    top: 210,
    right: 20,
    zIndex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalImage: {
    width: 250,
    height: 150,
    resizeMode: "cover",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#00A676",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#00A676",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default NoHomeScreen;