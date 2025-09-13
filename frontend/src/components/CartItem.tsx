// CartItem component for cart display
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { formatPrice } from '../utils/helpers';

interface CartItemProps {
  title: string;
  quantity: number;
  price: number;
  onRemove?: () => void;
  onUpdate?: (quantity: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ title, quantity, price, onRemove, onUpdate }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.quantity}>Qty: {quantity}</Text>
    <Text style={styles.price}>{formatPrice(price)}</Text>
    {onUpdate && (
      <TouchableOpacity onPress={() => onUpdate(quantity + 1)} style={styles.button}>
        <Text>+</Text>
      </TouchableOpacity>
    )}
    {onUpdate && quantity > 1 && (
      <TouchableOpacity onPress={() => onUpdate(quantity - 1)} style={styles.button}>
        <Text>-</Text>
      </TouchableOpacity>
    )}
    {onRemove && (
      <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
        <Text style={{ color: 'red' }}>Remove</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 8,
    padding: 12,
    elevation: 1,
  },
  title: {
    flex: 2,
    fontWeight: 'bold',
  },
  quantity: {
    flex: 1,
    textAlign: 'center',
  },
  price: {
    flex: 1,
    color: '#007bff',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  button: {
    marginHorizontal: 4,
    padding: 4,
    backgroundColor: '#eee',
    borderRadius: 4,
  },
  removeButton: {
    marginLeft: 8,
  },
});

export default CartItem;

