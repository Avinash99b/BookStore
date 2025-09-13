import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { PanGestureHandler, TapGestureHandler, GestureHandlerRootView, PanGestureHandlerGestureEvent, TapGestureHandlerStateChangeEvent } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import BookCard from './BookCard';
import { addToCart, getCart } from '../api/api';
import { Ionicons } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const CARD_WIDTH = SCREEN_WIDTH * 0.92; // ~92% of screen width
const CARD_HEIGHT = SCREEN_HEIGHT * 0.6; // 50% of screen height

interface Book {
  id: number;
  title: string;
  price: number;
  description: string;
  image_url?: string;
  sellerName?: string;
}

interface BookSwiperProps {
  books: Book[];
  onDeckEmpty?: () => void;
  onCardTap?: (book: Book) => void;
  onSwipeLeft?: (book: Book) => Promise<string | void> | string | void;
  onSwipeRight?: (book: Book) => void;
  showFlip?: boolean; // If false, disables flipping on tap
  onLongPress?: () => void;
}

const BookSwiper: React.FC<BookSwiperProps> = ({ books, onDeckEmpty, onCardTap, onSwipeLeft, onSwipeRight, showFlip = true, onLongPress }) => {
  const [current, setCurrent] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [atEnd, setAtEnd] = useState(false);
  const x = useSharedValue(0);
  const cardRef = useRef(null);

  const handleSwipe = async (direction: 'left' | 'right') => {
    const book = books[current];
    if (direction === 'left') {
      try {
        // Fetch the cart
        const cartRes = await getCart();
        // cartRes.data.items or cartRes.data depending on backend response
        const cartItems = cartRes.data?.items || cartRes.data || [];
        const cartItem = cartItems.find((item: any) => item.book_id === book.id);
        if (cartItem) {
          // Book is already in cart, update quantity
          await addToCart(book.id, cartItem.quantity + 1);
          setFeedback('Updated cart quantity!');
        } else {
          // Book not in cart, add with quantity 1
          await addToCart(book.id, 1);
          setFeedback('Added to Cart!');
        }
      } catch (e) {
        setFeedback('Error updating cart');
      }
    } else if (direction === 'right') {
      if (onSwipeRight) onSwipeRight(book);
      setFeedback(null);
    }
    setTimeout(() => setFeedback(null), 900);
    setCurrent((prev) => {
      const next = prev + 1;
      if (next >= books.length) {
        onDeckEmpty && onDeckEmpty();
        setAtEnd(true);
        return prev;
      }
      setAtEnd(false);
      return next;
    });
    x.value = 0;
  };

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { rotateZ: `${x.value / 20}deg` },
      { perspective: 1200 },
    ],
  }));

  // Pan gesture handler for swiping
  const onPanGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    x.value = event.nativeEvent.translationX;
  };

  const onPanHandlerStateChange = (event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.state === 5) { // State.END
      if (x.value < -80) { // Make swipe left and right equally sensitive
        runOnJS(handleSwipe)('left');
      } else if (x.value > 80) {
        runOnJS(handleSwipe)('right');
      } else {
        x.value = withSpring(0);
      }
    }
  };

  // Tap gesture handler for custom tap
  const onTapHandlerStateChange = (event: TapGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.state === 4) { // State.ACTIVE
      if (onCardTap) {
        onCardTap(books[current]);
      }
    }
  };

  if (atEnd) return (
    <View style={styles.emptyCentered}>
      <Ionicons name="refresh" size={48} color="#888" onPress={() => { setCurrent(0); setAtEnd(false); }}/>
      <Text style={styles.emptyTextCentered}>You are at the end of the feed, please refresh to start again.</Text>
    </View>
  );

  if (!books[current]) return <View style={styles.empty}><Text style={styles.emptyText}>No more books!</Text></View>;

  return (
    <GestureHandlerRootView style={styles.container}>
      <PanGestureHandler
        onGestureEvent={onPanGestureEvent}
        onHandlerStateChange={onPanHandlerStateChange}
        enabled={true}
      >
        <TapGestureHandler onHandlerStateChange={onTapHandlerStateChange} enabled={!feedback}>
          <Animated.View style={[styles.card, animatedCardStyle]} ref={cardRef}>
            <BookCard
              {...books[current]}
              style={{ width: CARD_WIDTH }}
              onLongPress={onLongPress}
              onPress={onCardTap ? () => onCardTap(books[current]) : undefined}
            />
            {feedback && (
              <View style={styles.feedbackOverlay} pointerEvents="none">
                <Text style={styles.feedbackText}>{feedback}</Text>
              </View>
            )}
          </Animated.View>
        </TapGestureHandler>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 18,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    overflow: 'visible',
    position: 'relative',
  },
  feedbackOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  feedbackText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 8,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCentered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  emptyText: {
    fontSize: 22,
    color: '#888',
    fontWeight: 'bold',
  },
  emptyTextCentered: {
    fontSize: 22,
    color: '#888',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
    marginHorizontal: 16,
  },
});

export default BookSwiper;
