import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { PanGestureHandler, TapGestureHandler, GestureHandlerRootView, PanGestureHandlerGestureEvent, TapGestureHandlerStateChangeEvent } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import BookCard from './BookCard';
import { addToCart } from '../api/api';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH * 0.92;
const CARD_HEIGHT = 420;

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
  const [flipped, setFlipped] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const x = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const cardRef = useRef(null);

  const handleSwipe = async (direction: 'left' | 'right') => {
    const book = books[current];
    if (direction === 'left') {
      if (onSwipeLeft) {
        const result = await onSwipeLeft(book);
        if (typeof result === 'string') setFeedback(result);
        else setFeedback(null);
      } else {
        setFeedback('Added to Cart!');
        try {
          await addToCart(book.id, 1);
        } catch {}
      }
    } else if (direction === 'right') {
      if (onSwipeRight) onSwipeRight(book);
      setFeedback(null);
    }
    setTimeout(() => setFeedback(null), 900);
    setFlipped(false);
    setCurrent((prev) => {
      const next = prev + 1;
      if (next >= books.length) {
        onDeckEmpty && onDeckEmpty();
        return prev;
      }
      return next;
    });
    x.value = 0;
    rotateY.value = 0;
  };

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { rotateZ: `${x.value / 20}deg` },
      { perspective: 1200 },
      { rotateY: `${rotateY.value}deg` },
    ],
  }));

  // Pan gesture handler for swiping
  const onPanGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    if (!flipped) {
      x.value = event.nativeEvent.translationX;
    }
  };

  const onPanHandlerStateChange = (event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.state === 5) { // State.END
      if (x.value < -120) {
        runOnJS(handleSwipe)('left');
      } else if (x.value > 120) {
        runOnJS(handleSwipe)('right');
      } else {
        x.value = withSpring(0);
      }
    }
  };

  // Tap gesture handler for flipping or custom tap
  const onTapHandlerStateChange = (event: TapGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.state === 4) { // State.ACTIVE
      if (onCardTap) {
        onCardTap(books[current]);
      } else if (showFlip) {
        setFlipped((prev) => !prev);
        rotateY.value = withTiming(flipped ? 0 : 180, { duration: 400 });
      }
    }
  };

  if (!books[current]) return <View style={styles.empty}><Text style={styles.emptyText}>No more books!</Text></View>;

  return (
    <GestureHandlerRootView style={styles.container}>
      <PanGestureHandler
        onGestureEvent={onPanGestureEvent}
        onHandlerStateChange={onPanHandlerStateChange}
        enabled={!flipped}
      >
        <TapGestureHandler onHandlerStateChange={onTapHandlerStateChange} enabled={!feedback}>
          <Animated.View style={[styles.card, animatedCardStyle]} ref={cardRef}>
            <BookCard
              {...books[current]}
              showDetails={showFlip && flipped}
              style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
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
    height: CARD_HEIGHT,
    backgroundColor: '#fff',
    borderRadius: 18,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
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
  emptyText: {
    fontSize: 22,
    color: '#888',
    fontWeight: 'bold',
  },
});

export default BookSwiper;
