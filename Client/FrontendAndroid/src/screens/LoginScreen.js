// src/screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios'; // Import axios
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

// Make sure your backend URL is correct and accessible from the emulator/device
// For Android emulator, '10.0.2.2' maps to your host machine's 'localhost'.
const API_BASE_URL = 'http://192.168.29.66:8082/api/auth';

const LoginScreen = ({ navigation }) => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!emailOrUsername || !password) {
      Alert.alert('Login Error', 'Please enter both email/username and password.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        usernameOrEmail: emailOrUsername, // Make sure this matches your Spring Boot DTO field names
        password: password,
      });

      const { token, refreshToken, roles } = response.data; // Assuming your backend returns token, refreshToken, roles

      // Store the JWT token and user info persistently
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userRefreshToken', refreshToken);
      await AsyncStorage.setItem('userRoles', JSON.stringify(roles)); // Store roles as stringified JSON

      Alert.alert('Login Success', 'You are now logged in!');
      console.log('Login successful, token:', token);

      // Navigate to a protected screen (e.g., 'Dashboard')
      // You'll need to define 'Dashboard' in your App.js navigator later.
      // For now, let's just navigate to a placeholder or back to Login to confirm.
      // If you don't have a Dashboard screen yet, you can create a simple one or comment this line for now
      navigation.replace('Dashboard'); // Use replace to prevent going back to login/register via back button

    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      Alert.alert(
        'Login Failed',
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message // Use error message from backend if available
          : 'Failed to connect or invalid credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email or Username"
        value={emailOrUsername}
        onChangeText={setEmailOrUsername}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={styles.spinner} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>Don't have an account? Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => Alert.alert('Forgot Password', 'Implement navigation to Forgot Password screen later.')}>
        <Text style={styles.linkText}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  spinner: {
    marginTop: 10,
    marginBottom: 20,
  },
  linkText: {
    color: '#007bff',
    marginTop: 15,
    fontSize: 16,
  },
});

export default LoginScreen;