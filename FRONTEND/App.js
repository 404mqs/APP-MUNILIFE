import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './.expo/components/screens/LoginScreen';
import SplashScreen from './.expo/components/screens/SplashScreen';
import HomeScreen from './.expo/components/screens/HomeScreen';
import RegisterScreen from './.expo/components/screens/RegisterScreen';
import PassRecoveryScreen from './.expo/components/screens/PassRecoveryScreen';
import ProfileScreen from './.expo/components/screens/ProfileScreen';
import ServicesScreen from './.expo/components/screens/ServicesScreen';
import ShopsScreen from './.expo/components/screens/ShopsScreen';
import ClaimsScreen from './.expo/components/screens/ClaimsScreen';
import ComplaintScreen from './.expo/components/screens/ComplaintScreen';
import IntroScreen from './.expo/components/screens/IntroScreen';
import NoHomeScreen from './.expo/components/screens/NoHomeScreen'; 
import NoServScreen from './.expo/components/screens/NoServScreen'; 
import NoShopScreen from './.expo/components/screens/NoShopScreen'; 
import InspectorScreen from './.expo/components/screens/InspectorScreen'; 

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Inspector"
          component={InspectorScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Intro"
          component={IntroScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Recovery"
          component={PassRecoveryScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Services"
          component={ServicesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Claims"
          component={ClaimsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Complaints"
          component={ComplaintScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Shops"
          component={ShopsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NoHome"
          component={NoHomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NoServ"
          component={NoServScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NoShop"
          component={NoShopScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}