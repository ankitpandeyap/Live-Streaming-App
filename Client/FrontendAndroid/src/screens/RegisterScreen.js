// src/screens/RegisterScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios'; // Still using plain axios as per your implied request
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

// REMOVED: No longer using a fixed API_BASE_URL constant here.
// const API_BASE_URL = 'http://192.168.29.66:8082/api/auth/';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('USER');
  const [step, setStep] = useState(1);

  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const handleSendOtp = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email.');
      return;
    }
    setSendingOtp(true);
    try {
      // CHANGED: Direct URL for sending OTP as per Register.jsx
      const response = await axios.post(
        `http://192.168.29.66:8082/api/auth/otp/request?email=${encodeURIComponent(email)}`
      );
      Alert.alert('Success', response.data.message || 'OTP sent to your email.');
      setStep(2);
    } catch (error) {
      console.error('Send OTP error:', error.response ? error.response.data : error.message);
      Alert.alert(
        'Error',
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : 'Failed to send OTP.'
      );
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Error', 'Please enter a 6-digit OTP.');
      return;
    }
    setVerifyingOtp(true);
    try {
      // CHANGED: Direct URL for verifying OTP as per Register.jsx
      const response = await axios.post(
        `http://192.168.29.66:8082/api/auth/otp/verify?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`
      );
      Alert.alert('Success', response.data.message || 'OTP verified successfully!');
      setOtpVerified(true);
      setStep(3);
    } catch (error) {
      console.error('Verify OTP error:', error.response ? error.response.data : error.message);
      Alert.alert(
        'Error',
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : 'OTP verification failed.'
      );
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleRegister = async () => {
    if (!otpVerified) {
      Alert.alert('Error', 'Please verify OTP first.');
      return;
    }
    if (!userName || !password || !name) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    setRegistering(true);
    try {
      // CHANGED: Direct URL for registration as per Register.jsx
      const response = await axios.post(`http://192.168.29.66:8082/api/auth/register`, {
        email,
        userName, // Matches DTO field
        password,
        name,
        role, // Matches DTO field
      });

      const { token, refreshToken, roles } = response.data;

      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userRefreshToken', refreshToken);
      await AsyncStorage.setItem('userRoles', JSON.stringify(roles));

      Alert.alert('Success', 'Registration complete!');
      console.log('Registration successful, token:', token);
      navigation.replace('Dashboard');

    } catch (error) {
      console.error('Registration error:', error.response ? error.response.data : error.message);
      Alert.alert(
        'Error',
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : 'Registration failed.'
      );
    } finally {
      setRegistering(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {step === 1 && "Step 1: Send OTP"}
        {step === 2 && "Step 2: Verify OTP"}
        {step === 3 && "Step 3: Complete Registration"}
      </Text>

      {step === 1 && (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {sendingOtp ? (
            <ActivityIndicator size="large" color="#007bff" style={styles.spinner} />
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleSendOtp} disabled={sendingOtp}>
              <Text style={styles.buttonText}>Send OTP</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {step === 2 && (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
            maxLength={6}
          />
          {verifyingOtp ? (
            <ActivityIndicator size="large" color="#007bff" style={styles.spinner} />
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleVerifyOtp} disabled={verifyingOtp}>
              <Text style={styles.buttonText}>Verify OTP</Text>
            </TouchableOpacity>
          )}
           <TouchableOpacity onPress={() => setStep(1)} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back to Email</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 3 && otpVerified && (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={userName}
            onChangeText={setUserName}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={role}
              onValueChange={(itemValue) => setRole(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="User" value="USER" />
              <Picker.Item label="Admin" value="ADMIN" />
            </Picker>
          </View>

          {registering ? (
            <ActivityIndicator size="large" color="#007bff" style={styles.spinner} />
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={registering}>
              <Text style={styles.buttonText}>Complete Registration</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => setStep(2)} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back to OTP Verification</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
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
    marginBottom: 10,
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
    marginTop: 20,
    fontSize: 16,
  },
  pickerContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  pickerItem: {
    fontSize: 16,
  },
  backButton: {
    marginTop: 10,
    padding: 10,
  },
  backButtonText: {
    color: '#666',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;