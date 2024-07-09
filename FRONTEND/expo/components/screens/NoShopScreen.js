import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import NoFooter from "../NoFoot";

const NoShopScreen = () => {
  const [shops, setShops] = useState([]);
  const [currentShopIndex, setCurrentShopIndex] = useState(0);
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(1)).current; // Valor inicial de la opacidad

  useEffect(() => {
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

    fetchShops();
  }, []);

  const handleNextShop = () => {
    // Animación de fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      // Cambiar al siguiente comercio y hacer fade in
      setCurrentShopIndex((prevIndex) => (prevIndex + 1) % shops.length);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
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
        </View>

        {currentShop ? (
          <Animated.View style={{ ...styles.shopCard, opacity: fadeAnim }}>
            {currentShop.foto ? (
              <Image source={{ uri: currentShop.foto }} style={styles.shopImage} />
            ) : (
              <Image source={require('../../../assets/comercios_ejemplo.png')} style={styles.shopImage} />
            )}
        <View style={styles.shopInfo}>
    <Text style={styles.shopName}>
        {currentShop.nombreComercio}
    </Text>
    <Text style={styles.shopPhone}>
        Se encuentra en: {currentShop.direccion ? currentShop.direccion : 'null'}
    </Text>
    <Text style={styles.shopTitle}>
        Este local abre a las {currentShop.apertura}
    </Text>
    <Text style={styles.shopDescription}>
        {currentShop.descripcion ? currentShop.descripcion : 'null'}
    </Text>
</View>

            <TouchableOpacity style={styles.nextButton} onPress={handleNextShop}>
              <Text style={styles.nextButtonText}>›</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <Text style={styles.noShopsText}>No se encontraron comercios.</Text>
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
    resizeMode: 'cover',
  },
  shopInfo: {
    padding: 16,
  },
  shopName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
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
    textAlign: 'center',
    color: '#777777',
    marginTop: 20,
    fontSize: 16,
  },
});

export default NoShopScreen;