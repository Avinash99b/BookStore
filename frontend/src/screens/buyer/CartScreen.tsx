import React, {useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, Button} from 'react-native';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {getCart, updateCartItem, removeCartItem} from '../../api/api';
import CartItem from '../../components/CartItem';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {formatPrice} from '../../utils/helpers';

// Define types for cart items
interface Book {
    id: number;
    title: string;
    price: number;
    image_url?: string;
    seller_name?: string;
}

interface CartItemType {
    id: number;
    book_id: number;
    book_price: number;
    book_title: string;
    quantity: number;
}

// Add navigation param type
interface BuyerStackParamList {
    Checkout: { items: CartItemType[]; total: number } | undefined;
}

const CartScreen = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    const queryClient = useQueryClient();
    const {data, isLoading, error, refetch} = useQuery({
        queryKey: ['cart'],
        queryFn: getCart
    });

    const updateMutation = useMutation<
        void,
        unknown,
        { id: number; quantity: number }
    >({
        mutationFn: async ({id, quantity}) => {
            await updateCartItem(id, quantity);
        },
        onSuccess: () => queryClient.invalidateQueries({queryKey: ['cart']}),
    });
    const removeMutation = useMutation<void, unknown, number>({
        mutationFn: async (id) => {
            await removeCartItem(id);
        },
        onSuccess: () => queryClient.invalidateQueries({queryKey: ['cart']}),
    });

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            refetch();
        });
        return unsubscribe;
    }, [navigation, refetch]);

    if (isLoading) return <Text>Loading...</Text>;
    if (error) return <Text>Error loading cart.</Text>;

    const items: CartItemType[] = data?.data?.items || [];
    const total = items.reduce((sum: number, item: CartItemType) => sum + item.quantity * item.book_price, 0);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cart</Text>
            {items.length === 0 ? (
                <Text>Your cart is empty.</Text>
            ) : (
                <FlatList
                    data={items}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({item}) => (
                        <CartItem
                            title={item.book_title}
                            quantity={item.quantity}
                            price={item.book_price * item.quantity}
                            onUpdate={q => updateMutation.mutate({id: item.id, quantity: q})}
                            onConfirmRemove={() => removeMutation.mutate(item.id)}
                        />
                    )}
                />
            )}
            {items.length > 0 && (
                <View style={styles.footer}>
                    <Text style={styles.total}>Total: {formatPrice(total)}</Text>
                    <Button title="Checkout" onPress={() => navigation.navigate('Checkout', { items, total })}/>
                </View>
            )}
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
    footer: {
        marginTop: 16,
        alignItems: 'center',
    },
    total: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
});

export default CartScreen;
