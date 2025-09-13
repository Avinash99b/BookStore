import React from 'react';
import { View, Text, StyleSheet, Image, Button, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBookById, addToCart } from '../../api/api';
import { formatPrice } from '../../utils/helpers';

interface Book {
  id: number;
  title: string;
  price: number;
  description: string;
  image_url?: string;
}

const ProductDetailScreen = () => {
  const route = useRoute();
  const queryClient = useQueryClient();
  const { id } = route.params as { id: number };

  const { data, isLoading, error } = useQuery<{ data: Book }>({
    queryKey: ['book', id],
    queryFn: () => getBookById(id),
  });
  const mutation = useMutation<void, unknown, { book_id: number; quantity: number }>({
    mutationFn: async ({ book_id, quantity }) => {
      await addToCart(book_id, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      alert('Added to cart!');
    },
    onError: () => {
      alert('Failed to add to cart.');
    },
  });

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Error loading book details.</Text>;

  const book = data?.data;
  if (!book) return <Text>Book not found.</Text>;
  return (
    <View style={styles.container}>
      {book.image_url ? (
        <Image source={{ uri: book.image_url }} style={styles.image} />
      ) : (
        <View style={styles.placeholder} />
      )}
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.price}>{formatPrice(book.price)}</Text>
      <Text style={styles.desc}>{book.description}</Text>
      <Button title="Add to Cart" onPress={() => mutation.mutate({ book_id: book.id, quantity: 1 })} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  image: {
    width: 160,
    height: 240,
    borderRadius: 8,
    marginBottom: 16,
  },
  placeholder: {
    width: 160,
    height: 240,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  price: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  desc: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default ProductDetailScreen;
