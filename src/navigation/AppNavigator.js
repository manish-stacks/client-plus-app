import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ServicesScreen from '../screens/ServicesScreen';
import PaymentsScreen from '../screens/PaymentsScreen';
import SupportScreen from '../screens/SupportScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ServiceDetailScreen from '../screens/ServiceDetailScreen';
import RenewalsScreen from '../screens/RenewalsScreen';
import ProposalsScreen from '../screens/ProposalsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ── Bottom Tab Navigator (main 5 tabs) ──
function MainTabs() {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1.5,
          height: 70,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text3,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Home: focused ? 'home' : 'home-outline',
            Services: focused ? 'layers' : 'layers-outline',
            Payments: focused ? 'card' : 'card-outline',
            Support: focused ? 'help-circle' : 'help-circle-outline',
            Profile: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={icons[route.name]} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Services" component={ServicesScreen} />
      <Tab.Screen name="Payments" component={PaymentsScreen} />
      <Tab.Screen name="Support" component={SupportScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// ── Root Stack (Login + MainTabs + sub-screens) ──
export default function AppNavigator() {
  const { isLoggedIn, loading } = useAuth();
  if (loading) return null; // splash screen ya loading spinner laga sakte ho

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
            <Stack.Screen name="Renewals" component={RenewalsScreen} />
            <Stack.Screen name="Proposals" component={ProposalsScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}