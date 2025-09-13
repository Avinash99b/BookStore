import React from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrders, updateOrderStatus } from '../../api/api';
import OrderCard from '../../components/OrderCard';

interface Order {
  id: number;
  book_title: string;
  buyer_name: string;
  quantity: number;
  total_price: number;
  status: string;
}

const SalesDashboardScreen = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery<{ data: { orders: Order[] } }>({
    queryKey: ['orders'],
    queryFn: getOrders
  });
  const mutation = useMutation<void, unknown, { id: number; status: string }>({
    mutationFn: async ({ id, status }) => {
      await updateOrderStatus(id, status);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
    onError: () => Alert.alert('Error', 'Failed to update order status.'),
  });

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading orders.</Text>;

  const orders: Order[] = data?.data?.orders || [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sales Dashboard</Text>
      {orders.length === 0 ? (
        <Text>No orders found.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <OrderCard
              id={item.id}
              bookTitle={item.book_title || ''}
              buyerName={item.buyer_name || ''}
              quantity={item.quantity}
              totalPrice={item.total_price}
              status={item.status}
              onStatusChange={status => mutation.mutate({ id: item.id, status })}
            />
          )}
        />
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
});

export default SalesDashboardScreen;
