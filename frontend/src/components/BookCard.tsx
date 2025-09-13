// BookCard component for book display
import React from 'react';
import { View, Text, Image, StyleSheet, StyleProp, ViewStyle, Pressable, Dimensions, ScrollView } from 'react-native';
import { formatPrice } from '../utils/helpers';

interface BookCardProps {
  title: string;
  price: number;
  image_url?: string;
  sellerName?: string;
  description?: string;
  style?: StyleProp<ViewStyle>;
  onLongPress?: () => void;
  onPress?: () => void;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.6;

const BookCard: React.FC<BookCardProps> = ({
  title,
  price,
  image_url,
  sellerName,
  description,
  style,
  onLongPress,
  onPress,
}) => {
  return (
    <Pressable
      style={[styles.card, style, { height: CARD_HEIGHT }]}
      onLongPress={onLongPress}
      onPress={onPress}
      android_ripple={{ color: '#e0e0e0' }}
    >
      {image_url ? (
        <Image source={{ uri: image_url }} style={styles.imageLarge} resizeMode="cover" />
      ) : (
        <View style={styles.placeholderLarge} />
      )}
      <View style={styles.infoBlock}>
        <Text style={styles.titleLarge} numberOfLines={2}>{title}</Text>
        {sellerName && <Text style={styles.sellerLarge}>by {sellerName}</Text>}
        <Text style={styles.priceLarge}>{formatPrice(price)}</Text>
      </View>
      {description && (
        <View style={styles.descScrollWrapper}>
          <ScrollView style={styles.descScroll} contentContainerStyle={styles.descContent} showsVerticalScrollIndicator={true}>
            <Text style={styles.desc}>{description}</Text>
          </ScrollView>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%', // Only width, no card-like visuals
  },
  imageLarge: {
    width: '100%',
    height: '45%',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginBottom: 10,
    backgroundColor: '#eee',
    alignSelf: 'center',
    objectFit: 'cover',
  },
  placeholderLarge: {
    width: '100%',
    height: '45%',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginBottom: 10,
    backgroundColor: '#eee',
    alignSelf: 'center',
  },
  infoBlock: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  titleLarge: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 4,
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
    marginBottom: 6,
    textAlign: 'center',
  },
  descScrollWrapper: {
    flex: 1,
    width: '100%',
    maxHeight: '40%',
    minHeight: 40,
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  descScroll: {
    flexGrow: 1,
    width: '100%',
  },
  descContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  desc: {
    fontSize: 16,
    color: '#444',
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 22,
    padding: 18,
  },
});

export default BookCard;
