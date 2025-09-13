// Root navigator: decides stack based on auth state
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import BuyerRootStack from './BuyerRootStack';
import SellerStack from './SellerStack';

const RootNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) return <AuthStack />;
  if (user.role === 'buyer') return <BuyerRootStack />;
  if (user.role === 'seller') return <SellerStack />;
  return null;
};

export default RootNavigator;
