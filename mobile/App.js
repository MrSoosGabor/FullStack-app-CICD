import 'react-native-gesture-handler';
import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './src/screens/HomeScreen';
import AddPhoneScreen from './src/screens/AddPhoneScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#667eea' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          tabBarActiveTintColor: '#667eea',
          tabBarInactiveTintColor: '#999',
          tabBarStyle: { paddingBottom: 4 },
        }}
      >
        <Tab.Screen
          name="Mobilok"
          component={HomeScreen}
          options={{
            title: 'Mobilok Listája',
            tabBarLabel: 'Mobilok',
            tabBarIcon: ({ color, size }) => (
              <TabIcon label="📱" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Hozzáadás"
          component={AddPhoneScreen}
          options={{
            title: 'Új Telefon Felvétel',
            tabBarLabel: 'Hozzáadás',
            tabBarIcon: ({ color, size }) => (
              <TabIcon label="➕" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// Egyszerű emoji ikon a tab barhoz, @expo/vector-icons importálása nélkül
function TabIcon({ label, size }) {
  return <Text style={{ fontSize: size - 4 }}>{label}</Text>;
}
