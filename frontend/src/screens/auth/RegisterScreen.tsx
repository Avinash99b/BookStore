import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const RegisterScreen = ({ navigation }: any) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    try {
      await register(name, email, password, role);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Ionicons name="book" size={64} color="#007bff" style={{ alignSelf: 'center', marginBottom: 16 }} />
      <Text style={styles.title}>Create Account</Text>
      <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" keyboardType="email-address" />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
      <View style={styles.roleRow}>
        <TouchableOpacity onPress={() => setRole('buyer')} style={[styles.roleBtn, role === 'buyer' && styles.selectedRole]}>
          <Ionicons name="cart" size={20} color={role === 'buyer' ? '#fff' : '#007bff'} />
          <Text style={[styles.roleText, role === 'buyer' && { color: '#fff' }]}>Buyer</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setRole('seller')} style={[styles.roleBtn, role === 'seller' && styles.selectedRole]}>
          <Ionicons name="book" size={20} color={role === 'seller' ? '#fff' : '#007bff'} />
          <Text style={[styles.roleText, role === 'seller' && { color: '#fff' }]}>Seller</Text>
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.link}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#007bff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  roleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  roleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginHorizontal: 8,
    backgroundColor: '#fff',
  },
  selectedRole: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  roleText: {
    marginLeft: 6,
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  error: {
    color: '#d9534f',
    marginBottom: 12,
    textAlign: 'center',
  },
  link: {
    alignItems: 'center',
    marginTop: 8,
  },
  linkText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
