import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import StorefrontScreen from '../screens/buyer/StorefrontScreen';
import CartScreen from '../screens/buyer/CartScreen';
import ProfileScreen from '../screens/common/ProfileScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductDetailScreen from '../screens/buyer/ProductDetailScreen';
import CheckoutScreen from '../screens/buyer/CheckoutScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function StorefrontStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#007bff' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="Storefront" component={StorefrontScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
    </Stack.Navigator>
  );
}

const BuyerStack = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName = 'home';
        if (route.name === 'StorefrontTab') iconName = 'home';
        else if (route.name === 'Cart') iconName = 'cart';
        else if (route.name === 'Profile') iconName = 'person';
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#007bff',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: { paddingVertical: 6, height: 60 },
      headerShown: false,
    })}
  >
    <Tab.Screen name="StorefrontTab" component={StorefrontStack} options={{ title: 'Storefront' }} />
    <Tab.Screen name="Cart" component={CartScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export default BuyerStack;
