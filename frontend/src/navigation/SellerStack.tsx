import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BookListingScreen from '../screens/seller/BookListingScreen';
import SalesDashboardScreen from '../screens/seller/SalesDashboardScreen';
import ProfileScreen from '../screens/common/ProfileScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddBookScreen from '../screens/seller/AddBookScreen';
import EditBookScreen from '../screens/seller/EditBookScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function BookStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#007bff' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="BookListing" component={BookListingScreen} />
      <Stack.Screen name="AddBook" component={AddBookScreen} />
      <Stack.Screen name="EditBook" component={EditBookScreen} />
    </Stack.Navigator>
  );
}

const SellerStack = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName = 'book';
        if (route.name === 'Books') iconName = 'book';
        else if (route.name === 'Sales') iconName = 'stats-chart';
        else if (route.name === 'Profile') iconName = 'person';
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#007bff',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: { paddingVertical: 6, height: 60 },
      headerShown: false,
    })}
  >
    <Tab.Screen name="Books" component={BookStack} />
    <Tab.Screen name="Sales" component={SalesDashboardScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export default SellerStack;
