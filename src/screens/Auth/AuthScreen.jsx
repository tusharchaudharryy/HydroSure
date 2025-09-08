import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { styles } from '../../styles/globalStyles';
import { auth } from '../../firebase'; // Import the auth object

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export const AuthScreen = ({ setPage, onLogin, isSignup = false }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');

    const handleSignUp = () => {
        if (!email || !password || !fullName) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }
        createUserWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                console.log('Registered with:', user.email);
                // You can now navigate the user to the main part of the app
                onLogin();
            })
            .catch(error => Alert.alert("Sign Up Error", error.message));
    };

    const handleLogin = () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter both email and password.");
            return;
        }
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                console.log('Logged in with:', user.email);
                // This will trigger the navigation in your main App component
                onLogin();
            })
            .catch(error => Alert.alert("Login Error", error.message));
    };

    return (
        <View style={[styles.container, { backgroundColor: '#F3F4F6' }]}>
            <View style={styles.authCard}>
                <Text style={{ fontSize: 64, color: '#2563EB', textAlign: 'center' }}>🛡️</Text>
                <Text style={styles.authTitle}>{isSignup ? 'Create Account' : 'Welcome Back!'}</Text>
                <Text style={styles.authSubtitle}>{isSignup ? 'Join us to monitor your water quality.' : 'Sign in to continue.'}</Text>

                <View style={styles.form}>
                    {isSignup && (
                        <TextInput
                            placeholder="Full Name"
                            style={styles.input}
                            value={fullName}
                            onChangeText={setFullName}
                        />
                    )}
                    <TextInput
                        placeholder="Email Address"
                        style={styles.input}
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                    />
                    <TextInput
                        placeholder="Password"
                        style={styles.input}
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    <TouchableOpacity onPress={isSignup ? handleSignUp : handleLogin} style={styles.button}>
                        <Text style={styles.buttonText}>{isSignup ? 'Sign Up' : 'Login'}</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => setPage(isSignup ? 'login' : 'signup')} style={{ marginTop: 24 }}>
                    <Text style={styles.authLink}>
                        {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
