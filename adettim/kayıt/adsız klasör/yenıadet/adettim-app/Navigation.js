import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import IntroForm from './IntroForm';
import MainTabs from './MainTabs';

const Stack = createStackNavigator();

export default function Navigation() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasCompletedSetup, setHasCompletedSetup] = useState(false);

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      const userEmail = await AsyncStorage.getItem('USER_EMAIL');
      const userPassword = await AsyncStorage.getItem('USER_PASSWORD');
      const periodLength = await AsyncStorage.getItem('PERIOD_LENGTH');
      const cycleLength = await AsyncStorage.getItem('CYCLE_LENGTH');
      
      // Kullanıcı giriş yapmış mı?
      if (userEmail && userPassword) {
        setIsLoggedIn(true);
        
        // Kullanıcı kişisel bilgilerini girmiş mi?
        if (periodLength && cycleLength) {
          setHasCompletedSetup(true);
        }
      }
    } catch (error) {
      console.log('Kullanıcı durumu kontrolü sırasında hata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFDEE9' }}>
        <ActivityIndicator size="large" color="#FF6B9D" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={
          !isLoggedIn ? "Login" : 
          !hasCompletedSetup ? "IntroForm" : "MainTabs"
        }
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="IntroForm" component={IntroForm} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
