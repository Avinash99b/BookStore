import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addBook } from '../../api/api';
import { useNavigation, NavigationProp } from '@react-navigation/native';

type SellerStackParamList = {
  BookListing: undefined;
  AddBook: undefined;
  EditBook: { id: number };
};

// Define BookDataType for mutation
interface BookDataType {
  title: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
}

const AddBookScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image_url, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation<NavigationProp<SellerStackParamList>>();
  const queryClient = useQueryClient();

  const mutation = useMutation<void, unknown, BookDataType>({
    mutationFn: async (data) => {
      await addBook(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBooks'] });
      Alert.alert('Book Added', 'Your book has been added.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    },
    onError: () => setError('Failed to add book.'),
  });

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Book</Text>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} />
      <TextInput placeholder="Price" value={price} onChangeText={setPrice} style={styles.input} keyboardType="decimal-pad" />
      <TextInput placeholder="Stock" value={stock} onChangeText={setStock} style={styles.input} keyboardType="number-pad" />
      <TextInput placeholder="Image URL" value={image_url} onChangeText={setImageUrl} style={styles.input} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title={mutation.isPending ? 'Adding...' : 'Add Book'} onPress={handleSubmit} disabled={mutation.isPending} />
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

export default AddBookScreen;
