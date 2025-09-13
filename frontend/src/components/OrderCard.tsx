// OrderCard component for seller dashboard
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface OrderCardProps {
  id: number;
  bookTitle: string;
  buyerName: string;
  quantity: number;
  totalPrice: number;
  status: string;
  onStatusChange?: (status: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ id, bookTitle, buyerName, quantity, totalPrice, status, onStatusChange }) => (
  <View style={styles.card}>
    <Text style={styles.title}>{bookTitle}</Text>
    <Text>Buyer: {buyerName}</Text>
    <Text>Qty: {quantity}</Text>
    <Text>Total: ${totalPrice.toFixed(2)}</Text>
    <Text>Status: {status}</Text>
    {onStatusChange && status === 'Pending' && (
      <TouchableOpacity onPress={() => onStatusChange('Shipped')} style={styles.button}>
        <Text style={{ color: '#fff' }}>Mark as Shipped</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 8,
    padding: 12,
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  button: {
    marginTop: 8,
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
});

export default OrderCard;

