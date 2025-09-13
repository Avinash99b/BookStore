// BookCard component for book display
import React from 'react';
import { View, Text, Image, StyleSheet, StyleProp, ViewStyle, Pressable } from 'react-native';
import { formatPrice } from '../utils/helpers';

interface BookCardProps {
  title: string;
  price: number;
  image_url?: string;
  sellerName?: string;
  description?: string;
  showDetails?: boolean;
  style?: StyleProp<ViewStyle>;
  onLongPress?: () => void;
  onPress?: () => void;
}

const BookCard: React.FC<BookCardProps> = ({
  title,
  price,
  image_url,
  sellerName,
  description,
  showDetails = false,
  style,
  onLongPress,
  onPress,
}) => (
  <Pressable
    style={[styles.card, style]}
    onLongPress={onLongPress}
    onPress={onPress}
    android_ripple={{ color: '#e0e0e0' }}
  >
    {/* Front Side */}
    {!showDetails && (
      <View style={[styles.side, styles.front]}>
        {image_url ? (
          <Image source={{ uri: image_url }} style={styles.imageLarge} />
        ) : (
          <View style={styles.placeholderLarge} />
        )}
        <Text style={styles.titleLarge}>{title}</Text>
        {sellerName && <Text style={styles.sellerLarge}>by {sellerName}</Text>}
        <Text style={styles.priceLarge}>{formatPrice(price)}</Text>
      </View>
    )}
    {/* Back Side */}
    {showDetails && (
      <View style={[styles.side, styles.back]}>
        <Text style={styles.titleLarge}>{title}</Text>
        {sellerName && <Text style={styles.sellerLarge}>by {sellerName}</Text>}
        <Text style={styles.priceLarge}>{formatPrice(price)}</Text>
        <Text style={styles.desc}>{description || 'No description available.'}</Text>
      </View>
    )}
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  side: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
    padding: 18,
  },
  front: {
    zIndex: 2,
  },
  back: {
    backgroundColor: '#f7f7ff',
    zIndex: 1,
    paddingTop: 32,
  },
  imageLarge: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginBottom: 18,
    backgroundColor: '#eee',
  },
  placeholderLarge: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginBottom: 18,
    backgroundColor: '#eee',
  },
  titleLarge: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 6,
    textAlign: 'center',
    color: '#222',
  },
  sellerLarge: {
    color: '#888',
    fontSize: 14,
    marginBottom: 2,
    textAlign: 'center',
  },
  priceLarge: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  desc: {
    fontSize: 16,
    color: '#444',
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default BookCard;
