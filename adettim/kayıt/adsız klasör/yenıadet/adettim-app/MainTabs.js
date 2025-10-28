import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';
import ProfileScreen from './ProfileScreen';
import CalendarScreen from './CalendarScreen';
import RemindersScreen from './RemindersScreen';
import TodayScreen from './TodayScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#FF6B9D',
        tabBarInactiveTintColor: '#B83280',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          height: 90,
          paddingBottom: 20,
          paddingTop: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 10,
        },
        headerShown: false,
        tabBarItemStyle: ({ focused }) => ({
          backgroundColor: focused ? '#F3E8FF' : 'transparent',
          borderRadius: 16,
          margin: 4,
        }),
      }}
    >
      <Tab.Screen 
        name="Bilgilerim" 
        component={TodayScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name="information-circle-outline"
              size={size}
              color={focused ? '#6400c8' : '#B83280'}
            />
          ),
        }}
      />
       <Tab.Screen 
        name="Takvim" 
        component={CalendarScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name="calendar"
              size={size}
              color={focused ? '#6400c8' : '#B83280'}
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Hatırlatmalar" 
        component={RemindersScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name="notifications"
              size={size}
              color={focused ? '#6400c8' : '#B83280'}
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Profil" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name="person-circle-outline"
              size={size}
              color={focused ? '#6400c8' : '#B83280'}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
