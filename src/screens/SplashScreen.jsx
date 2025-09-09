// FILE: varify-app/src/screens/SplashScreen.jsx

import React from 'react';
import { View, Text, Image } from 'react-native';
import { styles } from '../styles/globalStyles';

export const SplashScreen = () => (
    <View style={styles.splashContainer}>
        {/* <Text style={{ fontSize: 128 }}>🛡️</Text> */}
        <Image source={require('../../assets/Logo_HydroSure.png')} style={{width: 500, height: 500}} />
        <Text style={styles.splashSubtitle}>Your Water Quality Partner</Text>
    </View>
);