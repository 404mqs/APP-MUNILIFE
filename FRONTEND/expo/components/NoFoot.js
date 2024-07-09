import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Animated, { Easing, useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { useNavigation, useRoute } from '@react-navigation/native';

const buttons = [
  { name: 'Comercios', icon: 'shopping-cart', page: 'NoShop' },
  { name: 'Home', icon: 'home', page: 'NoHome' },
  { name: 'Servicios', icon: 'question-circle', page: 'NoServ' }
];

const NoFoot = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [selected, setSelected] = useState(route.name);

  useEffect(() => {
    setSelected(route.name);
  }, [route.name]);

  const handlePress = (button) => {
    setSelected(button.page);
    navigation.navigate(button.page);
  };

  return (
    <View style={styles.footer}>
      {buttons.map((button, index) => (
        <FooterButton
          key={index}
          button={button}
          isSelected={selected === button.page}
          onPress={() => handlePress(button)}
        />
      ))}
    </View>
  );
};

const FooterButton = ({ button, isSelected, onPress }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withTiming(scale.value, { duration: 200, easing: Easing.bounce }) }]
    };
  });

  const handlePressIn = () => {
    scale.value = 1.2;
  };

  const handlePressOut = () => {
    scale.value = 1;
    onPress();
  };

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.buttonContainer}
    >
      <Animated.View style={[styles.button, animatedStyle, isSelected && styles.selectedButton]}>
        <Icon name={button.icon} size={24} color={isSelected ? 'white' : 'black'} />
        <Text style={[styles.buttonText, isSelected && styles.selectedButtonText]}>{button.name}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8f8f8',
    paddingVertical: 10,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
  },
  selectedButton: {
    backgroundColor: '#00A676',
  },
  buttonText: {
    fontSize: 12,
  },
  selectedButtonText: {
    color: 'white',
  },
});

export default NoFoot;