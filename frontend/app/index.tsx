import {Button, Text, View} from "react-native";
import { StyleSheet } from 'react-native';

export default function Index() {
    const handlePress = () => {
        alert('Button Pressed!');
    };

    return (
        <View style={styles.container}>
            <Button title="Setup" onPress={handlePress} />
        </View>
    );

}
const styles = StyleSheet.create({
    container: {
        flex: 1,             // Fill the whole screen
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
});
