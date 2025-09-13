import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, ActivityIndicator, FlatList } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyBooks, deleteBook } from '../../api/api';
import BookSwiper from '../../components/BookSwiper';
import BookCard from '../../components/BookCard';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TutorialModal from '../../components/TutorialModal';

type SellerStackParamList = {
  BookListing: undefined;
  AddBook: undefined;
  EditBook: { id: number };
};

interface Book {
  id: number;
  title: string;
  price: number;
  image_url?: string;
  seller_name?: string;
}

const BookListingScreen = () => {
  const navigation = useNavigation<NavigationProp<SellerStackParamList>>();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery<{ data: { books: Book[] } }>({
    queryKey: ['myBooks'],
    queryFn: getMyBooks
  });
  const deleteMutation = useMutation<void, unknown, number>({
    mutationFn: async (id) => {
      await deleteBook(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['myBooks'] }),
  });

  const [showTutorial, setShowTutorial] = useState(false);
  const [isListView, setIsListView] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [swipeKey, setSwipeKey] = useState(0); // To reset BookSwiper

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

  const handleRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['myBooks'] });
    setSwipeKey(prev => prev + 1); // Reset BookSwiper to first card
    setRefreshing(false);
  };

  if (isLoading) return (
    <View style={styles.centered}><ActivityIndicator size="large" color="#007bff" /><Text style={styles.loadingText}>Loading your books...</Text></View>
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
    description: '', // Optionally fetch description if available
  }));

  const handleCardTap = (book: Book) => {
    navigation.navigate('EditBook', { id: book.id });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>My Books</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Button title="Refresh" onPress={handleRefresh} color="#28a745" disabled={refreshing} />
          <View style={{ width: 8 }} />
          <Button title="Add Book" onPress={() => navigation.navigate('AddBook')} color="#007bff" />
        </View>
      </View>
      {mappedBooks.length === 0 ? (
        <Text style={styles.emptyText}>No books found. Start by adding a new book!</Text>
      ) : isListView ? (
        <FlatList
          data={mappedBooks}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <BookCard
              {...item}
              onPress={() => handleCardTap(item)}
              onLongPress={() => setIsListView(false)}
              style={{ marginVertical: 12, marginHorizontal: 8 }}
            />
          )}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      ) : (
        <BookSwiper
          key={swipeKey}
          books={mappedBooks}
          onCardTap={handleCardTap}
          showFlip={false}
          onLongPress={() => setIsListView(true)}
        />
      )}
      <TutorialModal visible={showTutorial} onClose={handleCloseTutorial} mode="seller" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007bff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 12,
    color: '#007bff',
    fontSize: 16,
  },
  errorText: {
    color: '#d9534f',
    fontSize: 16,
    textAlign: 'center',
    margin: 16,
  },
  emptyText: {
    color: '#6c757d',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 32,
  },
});

export default BookListingScreen;
