import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCart, createOrder } from '../../api/api';
import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import { formatPrice } from '../../utils/helpers';
import { Ionicons } from '@expo/vector-icons';

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
        { text: 'OK', onPress: () => navigation.goBack() },
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
      <View style={styles.headerRow}>
        <Ionicons name="arrow-back" size={28} color="#007bff" onPress={() => navigation.goBack()} style={styles.backIcon} />
        <Text style={styles.title}>Checkout</Text>
      </View>
      {localItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={64} color="#bbb" style={{ marginBottom: 12 }} />
          <Text style={styles.emptyText}>Your cart is empty.</Text>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {localItems.map((item: CartItemType) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemTitle} numberOfLines={1}>{item.book_title}</Text>
              <Text style={styles.itemQty}>x{item.quantity}</Text>
              <Text style={styles.itemPrice}>{formatPrice(item.book_price * item.quantity)}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(localTotal)}</Text>
          </View>
          <View style={styles.buttonRow}>
            <Button
              title={createOrderMutation.isPending ? 'Placing Order...' : 'Place Order'}
              onPress={() => createOrderMutation.mutate()}
              disabled={createOrderMutation.isLoading}
              color="#007bff"
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: '#f7f8fa',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  backIcon: {
    marginRight: 10,
    padding: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 4,
  },
  itemTitle: {
    fontWeight: '600',
    fontSize: 16,
    flex: 2,
    color: '#333',
    marginRight: 8,
  },
  itemQty: {
    fontSize: 15,
    color: '#666',
    flex: 0.5,
    textAlign: 'center',
  },
  itemPrice: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#007bff',
    flex: 1,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
    borderRadius: 1,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
  },
  buttonRow: {
    marginTop: 8,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 20,
    color: '#888',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default CheckoutScreen;
