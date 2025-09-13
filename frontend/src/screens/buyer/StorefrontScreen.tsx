import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getBooks } from '../../api/api';
import BookSwiper from '../../components/BookSwiper';
import TutorialModal from '../../components/TutorialModal';

// Define Book type
interface Book {
  id: number;
  title: string;
  price: number;
  image_url?: string;
  seller_name?: string;
  description?: string;
}

const StorefrontScreen = () => {
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    (async () => {
      const seen = await AsyncStorage.getItem('hasSeenTutorial');
      if (!seen) setShowTutorial(true);
    })();
  }, []);

  const handleCloseTutorial = async () => {
    setShowTutorial(false);
    await AsyncStorage.setItem('hasSeenTutorial', 'true');
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['books'],
    queryFn: getBooks
  });

  if (isLoading) return (
    <View style={styles.centered}><ActivityIndicator size="large" color="#007bff" /><Text style={styles.loadingText}>Loading books...</Text></View>
  );
  if (error) return (
    <View style={styles.centered}><Text style={styles.errorText}>Error loading books. Please try again later.</Text></View>
  );

  const books: Book[] = data?.data?.books || [];

  // Map API fields to BookSwiper fields
  const mappedBooks = books.map(book => ({
    id: book.id,
    title: book.title,
    price: book.price,
    image_url: book.image_url,
    sellerName: book.seller_name,
    description: book.description ?? '', // Ensure string
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Storefront</Text>
      <BookSwiper books={mappedBooks} />
      <TutorialModal visible={showTutorial} onClose={handleCloseTutorial} mode="buyer" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 18,
    letterSpacing: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#007bff',
    fontSize: 18,
  },
  errorText: {
    color: '#d00',
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 24,
  },
});

export default StorefrontScreen;
