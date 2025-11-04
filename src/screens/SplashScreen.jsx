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

// import React, { useEffect, useRef } from "react";
// import { View, Text, Image, StyleSheet, Animated, Dimensions } from "react-native";
// const { width } = Dimensions.get("window");
// export const SplashScreen = ({ navigation }) => {
// const fadeAnim = useRef(new Animated.Value(0)).current;
// useEffect(() => {
// Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 1200,
//         useNativeDriver: true,
// }).start();

// // Optional: navigate to AuthScreen after delay
// const timer = setTimeout(() => {
//   if (navigation) navigation.replace("AuthScreen");
// }, 2500);

// return () => clearTimeout(timer);

// }, [navigation]);
// return (
// <View style={styles.container}>
// <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
// <Image
// source={require("../../assets/Logo_HydroSure.png")}
// style={styles.logo}
// resizeMode="contain"
// />
// <Text style={styles.subtitle}>Your Water Quality Partner</Text>
// </Animated.View>
// </View>
// );
// };
// const styles = StyleSheet.create({
// container: {
// flex: 1,
// backgroundColor: "#F8FCFF",
// alignItems: "center",
// justifyContent: "center",
// },
// content: {
// alignItems: "center",
// justifyContent: "center",
// },
// logo: {
// width: width * 0.55,
// height: width * 0.55,
// marginBottom: 20,
// },
// subtitle: {
// fontSize: 18,
// fontWeight: "600",
// color: "#007B83",
// letterSpacing: 0.5,
// },
// });
// export default SplashScreen;
