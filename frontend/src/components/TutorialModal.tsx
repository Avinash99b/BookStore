import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface TutorialModalProps {
  visible: boolean;
  onClose: () => void;
  mode: 'buyer' | 'seller';
}

const TutorialModal: React.FC<TutorialModalProps> = ({ visible, onClose, mode }) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <Text style={styles.title}>How to Use the Swipe Deck</Text>
        <Text style={styles.text}>• Swipe right to see the next book.</Text>
        <Text style={styles.text}>• Swipe left {mode === 'buyer' ? 'to add the book to your cart.' : 'to skip to the next book.'}</Text>
        {mode === 'buyer' ? (
          <Text style={styles.text}>• Tap the card to flip and see details.</Text>
        ) : (
          <Text style={styles.text}>• Tap the card to edit your book.</Text>
        )}
        <Text style={styles.text}>• When you tap a card, it smoothly flips and the details (including seller and description) animate into view.</Text>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>Got it!</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    width: 320,
    elevation: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#007bff',
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  button: {
    marginTop: 18,
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 32,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default TutorialModal;
