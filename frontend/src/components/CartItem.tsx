// CartItem component for cart display
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { formatPrice } from '../utils/helpers';

interface CartItemProps {
  title: string;
  quantity: number;
  price: number;
  onConfirmRemove?: () => void;
  onUpdate?: (quantity: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ title, quantity, price, onConfirmRemove, onUpdate }) => {
  const handleRemove = () => {
    // Use Alert for confirmation in React Native
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => onConfirmRemove && onConfirmRemove() },
      ]
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <Text style={styles.price}>{formatPrice(price)}</Text>
      </View>
      <View style={styles.actionContainer}>
        <View style={styles.quantityContainer}>
          {onUpdate && (
            <TouchableOpacity onPress={() => onUpdate(quantity + 1)} style={styles.button}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.quantity}>{quantity}</Text>
          {onUpdate && quantity > 1 && (
            <TouchableOpacity onPress={() => onUpdate(quantity - 1)} style={styles.button}>
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
          )}
        </View>
        {onConfirmRemove && (
          <TouchableOpacity onPress={handleRemove} style={styles.removeButton}>
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 10,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    flex: 2,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
    marginRight: 8,
  },
  price: {
    flex: 1,
    color: '#007bff',
    fontWeight: 'bold',
    textAlign: 'right',
    fontSize: 16,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quantity: {
    minWidth: 28,
    textAlign: 'center',
    fontSize: 15,
    color: '#444',
    fontWeight: 'bold',
    marginHorizontal: 4,
  },
  button: {
    padding: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    minWidth: 32,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  removeButton: {
    marginLeft: 10,
    backgroundColor: '#ff4d4f',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 0.5,
  },
});

export default CartItem;
