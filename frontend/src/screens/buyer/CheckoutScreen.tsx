import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCart, createOrder } from '../../api/api';
import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import { formatPrice } from '../../utils/helpers';

type BuyerStackParamList = {
  Storefront: undefined;
  Checkout: { items: CartItemType[]; total: number } | undefined;
};

interface Book {
  id: number;
  title: string;
  price: number;
  image_url?: string;
  seller_name?: string;
}
interface CartItemType {
  id: number;
  book_id:number;
  book_price:number;
  book_title:string;
  quantity: number;
}
interface CartData {
  items: CartItemType[];
}

const CheckoutScreen = () => {
  const navigation = useNavigation<NavigationProp<BuyerStackParamList>>();
  const route = useRoute<RouteProp<BuyerStackParamList, 'Checkout'>>();
  const queryClient = useQueryClient();
  // Use params if available, otherwise fetch
  const itemsFromParams = route.params?.items;
  const totalFromParams = route.params?.total;
  const { data, isLoading, error } = useQuery<{ data: CartData }>({
    queryKey: ['cart'],
    queryFn: getCart,
    enabled: !itemsFromParams, // Only fetch if no params
  });
  // Local state for items and total
  const [localItems, setLocalItems] = useState<CartItemType[]>(itemsFromParams || []);
  const [localTotal, setLocalTotal] = useState<number>(totalFromParams !== undefined ? totalFromParams : 0);

  // Update local state if fetched data arrives and no params were provided
  useEffect(() => {
    if (!itemsFromParams && data?.data?.items) {
      setLocalItems(data.data.items);
      setLocalTotal(data.data.items.reduce((sum: number, item: any) => sum + (item.quantity * (item.book_price || item.book_price)), 0));
    }
  }, [data, itemsFromParams]);

  const createOrderMutation = useMutation<any, unknown, void>({
    mutationFn: async () => {
      return await createOrder();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      setLocalItems([]);
      setLocalTotal(0);
      Alert.alert('Order Placed', 'Your order has been placed successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Cart') },
      ]);
    },
    onError: (err: any) => {
      Alert.alert('Order Failed', err?.response?.data?.error || 'Failed to place order.');
    },
  });

  if (isLoading && !itemsFromParams) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading cart.</Text>;

  return (
    <View style={styles.container}>
      <Button title="Back" onPress={() => navigation.goBack()} />
      <Text style={styles.title}>Checkout</Text>
      {localItems.length === 0 ? (
        <Text>Your cart is empty.</Text>
      ) : (
        <>
          {localItems.map((item: CartItemType) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemTitle}>{item.book_title}</Text>
              <Text>Qty: {item.quantity}</Text>
              <Text>{formatPrice(item.book_price * item.quantity)}</Text>
            </View>
          ))}
          <Text style={styles.total}>Total: {formatPrice(localTotal)}</Text>
          <Button title={createOrderMutation.isPending ? 'Placing Order...' : 'Place Order'} onPress={() => createOrderMutation.mutate()} disabled={createOrderMutation.isLoading} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemTitle: {
    fontWeight: 'bold',
    flex: 1,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'right',
  },
});

export default CheckoutScreen;
