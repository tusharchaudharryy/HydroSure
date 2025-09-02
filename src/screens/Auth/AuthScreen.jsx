// FILE: varify-app/src/screens/Auth/AuthScreen.jsx

import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/globalStyles';

export const AuthScreen = ({ setPage, onLogin, isSignup = false }) => {
    return (
        <View style={[styles.container, { backgroundColor: '#F3F4F6' }]}>
            <View style={styles.authCard}>
                <Text style={{ fontSize: 64, color: '#2563EB', textAlign: 'center' }}>🛡️</Text>
                <Text style={styles.authTitle}>{isSignup ? 'Create Account' : 'Welcome Back!'}</Text>
                <Text style={styles.authSubtitle}>{isSignup ? 'Join us to monitor your water quality.' : 'Sign in to continue.'}</Text>

                <View style={styles.form}>
                    {isSignup && (
                        <TextInput placeholder="Full Name" style={styles.input} />
                    )}
                    <TextInput placeholder="Email Address" style={styles.input} keyboardType="email-address" />
                    <TextInput placeholder="Password" style={styles.input} secureTextEntry />

                    <TouchableOpacity onPress={onLogin} style={styles.button}>
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

