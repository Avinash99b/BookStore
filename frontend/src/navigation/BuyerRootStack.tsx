import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BuyerStack from './BuyerStack';
import CheckoutScreen from '../screens/buyer/CheckoutScreen';

const Stack = createNativeStackNavigator();

const BuyerRootStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MainTabs" component={BuyerStack} />
    <Stack.Screen name="Checkout" component={CheckoutScreen} />
  </Stack.Navigator>
);

export default BuyerRootStack;

