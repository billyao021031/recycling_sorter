import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { RootStackParamList } from '../types/navigation';
import LoginScreen from "../screens/LoginScreen/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen/RegisterScreen";
import { useAuth } from "../context/AuthContext";

// Import screens
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();

const MainDrawer = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        headerTintColor: '#0B2F33',
        headerTitleStyle: { fontWeight: '600' },
        drawerActiveTintColor: '#0F6B6E',
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="History" component={HistoryScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
};

const AppNavigator = () => {
  const { token } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {token ? (
          <Stack.Screen name="Home" component={MainDrawer} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 
