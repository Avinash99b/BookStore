import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBookById, updateBook } from '../../api/api';

// Define a Book type for type safety
interface Book {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
}

const EditBookScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { id } = route.params as { id: number };

  // useQuery with object syntax and type
  const { data, isPending, error } = useQuery<Book, Error>({
    queryKey: ['book', id],
    queryFn: () => getBookById(id).then((res: { data: Book }) => res.data),
  });

  // useMutation with correct types
  const mutation = useMutation({
    mutationFn: (book: Partial<Book>) => updateBook(id, book),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBooks'] });
      Alert.alert('Book Updated', 'Your book has been updated.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    },
    onError: () => setError('Failed to update book.'),
  });

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image_url, setImageUrl] = useState('');
  const [errorMsg, setError] = useState('');

  useEffect(() => {
    if (data) {
      setTitle(data.title || '');
      setDescription(data.description || '');
      setPrice(data.price?.toString() || '');
      setStock(data.stock?.toString() || '');
      setImageUrl(data.image_url || '');
    }
  }, [data]);

  const handleSubmit = () => {
    setError('');
    if (!title || !price) {
      setError('Title and price are required.');
      return;
    }
    mutation.mutate({
      title,
      description,
      price: parseFloat(price),
      stock: stock ? parseInt(stock) : 0,
      image_url,
    });
  };

  if (isPending) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading book.</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Book</Text>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} />
      <TextInput placeholder="Price" value={price} onChangeText={setPrice} style={styles.input} keyboardType="decimal-pad" />
      <TextInput placeholder="Stock" value={stock} onChangeText={setStock} style={styles.input} keyboardType="number-pad" />
      <TextInput placeholder="Image URL" value={image_url} onChangeText={setImageUrl} style={styles.input} />
      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
      <Button title={mutation.isPending ? 'Updating...' : 'Update Book'} onPress={handleSubmit} disabled={mutation.isPending} />
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
});

export default EditBookScreen;
