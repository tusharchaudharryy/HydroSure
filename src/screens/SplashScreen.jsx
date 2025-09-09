// FILE: varify-app/src/screens/SplashScreen.jsx

import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/globalStyles';

export const SplashScreen = () => (
    <View style={styles.splashContainer}>
        <Text style={{ fontSize: 128 }}>🛡️</Text>
        <Text style={styles.splashTitle}>HydroSure</Text>
        <Text style={styles.splashSubtitle}>Your Water Quality Partner</Text>
    </View>
);

