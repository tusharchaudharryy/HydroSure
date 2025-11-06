// import React from 'react';
// import { View, Text, TouchableOpacity, Alert, Platform } from 'react-native';
// import { request, check, PERMISSIONS, RESULTS } from 'react-native-permissions';
// import Geolocation from '@react-native-community/geolocation';
// import { styles } from '../../styles/globalStyles';

// const InstructionScreen = ({ onNext }) => {
//   const handleStartTest = async () => {
//     try {
//       // ✅ Request Camera permission directly
//       const cameraResult = await request(
//         Platform.select({
//           ios: PERMISSIONS.IOS.CAMERA,
//           android: PERMISSIONS.ANDROID.CAMERA,
//         })
//       );

//       if (cameraResult !== RESULTS.GRANTED) {
//         Alert.alert('Camera permission is required to proceed.');
//         return;
//       }

//       // ✅ Request Location permission
//       const locationResult = await request(
//         Platform.select({
//           ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
//           android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
//         })
//       );

//       if (locationResult !== RESULTS.GRANTED) {
//         Alert.alert('Location permission is required to proceed.');
//         return;
//       }

//       // ✅ Get location (optional)
//       Geolocation.getCurrentPosition(
//         pos => console.log('User location:', pos.coords),
//         err => console.log('Location error:', err),
//         { enableHighAccuracy: true }
//       );

//       // ✅ Both permissions granted → proceed
//       onNext();

//     } catch (err) {
//       console.error('Permission error:', err);
//       Alert.alert('Something went wrong while requesting permissions.');
//     }
//   };

//   return (
//     <View>
//       <Text style={[styles.pageTitle, { textAlign: 'center' }]}>
//         Water Test Instructions
//       </Text>

//       <View style={styles.instructionCard}>
//         <Text style={styles.instructionStep}>Step 1</Text>
//         <Text>Prepare your water sample and test strip.</Text>
//       </View>

//       <View style={styles.instructionCard}>
//         <Text style={styles.instructionStep}>Step 2</Text>
//         <Text>Take a picture of the color chart from your kit.</Text>
//       </View>

//       <View style={styles.instructionCard}>
//         <Text style={styles.instructionStep}>Step 3</Text>
//         <Text>Take a picture of your litmus strip.</Text>
//       </View>

//       <Text style={[styles.textSmall, { textAlign: 'center', marginVertical: 16 }]}>
//         Our app will analyze the colors and generate a report.
//       </Text>

//       <TouchableOpacity onPress={handleStartTest} style={styles.button}>
//         <Text style={styles.buttonText}>Start Test</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default InstructionScreen;

import React from 'react';
// 1. Import StyleSheet
import { View, Text, TouchableOpacity, Alert, Platform, StyleSheet } from 'react-native';
import { request, check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
// 2. Import 'colors' so we can use your theme
import { styles, colors } from '../../styles/globalStyles';

const InstructionScreen = ({ onNext }) => {
  // --- This permission logic is unchanged ---
  const handleStartTest = async () => {
    try {
      const cameraResult = await request(
        Platform.select({
          ios: PERMISSIONS.IOS.CAMERA,
          android: PERMISSIONS.ANDROID.CAMERA,
        })
      );

      if (cameraResult !== RESULTS.GRANTED) {
        Alert.alert('Camera permission is required to proceed.');
        return;
      }

      const locationResult = await request(
        Platform.select({
          ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
          android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        })
      );

      if (locationResult !== RESULTS.GRANTED) {
        Alert.alert('Location permission is required to proceed.');
        return;
      }

      Geolocation.getCurrentPosition(
        pos => console.log('User location:', pos.coords),
        err => console.log('Location error:', err),
        { enableHighAccuracy: true }
      );

      onNext();

    } catch (err) {
      console.error('Permission error:', err);
      Alert.alert('Something went wrong while requesting permissions.');
    }
  };

  return (
    <View>
      <Text style={[styles.pageTitle, { textAlign: 'center' }]}>
        Water Test Instructions
      </Text>

      {/* --- 3. Updated Instruction Cards UI --- */}

      <View style={localStyles.instructionCard}>
        <View style={localStyles.stepNumber}>
          <Text style={localStyles.stepNumberText}>1</Text>
        </View>
        <Text style={localStyles.instructionText}>
          Prepare your water sample and test strip.
        </Text>
      </View>

      <View style={localStyles.instructionCard}>
        <View style={localStyles.stepNumber}>
          <Text style={localStyles.stepNumberText}>2</Text>
        </View>
        <Text style={localStyles.instructionText}>
          Take a picture of the color chart from your kit.
        </Text>
      </View>

      <View style={localStyles.instructionCard}>
        <View style={localStyles.stepNumber}>
          <Text style={localStyles.stepNumberText}>3</Text>
        </View>
        <Text style={localStyles.instructionText}>
          Take a picture of your litmus strip.
        </Text>
      </View>

      <Text style={[styles.textSmall, { textAlign: 'center', marginVertical: 16 }]}>
        Our app will analyze the colors and generate a report.
      </Text>

      {/* --- This button logic is unchanged --- */}
      <TouchableOpacity onPress={handleStartTest} style={styles.button}>
        <Text style={styles.buttonText}>Start Test</Text>
      </TouchableOpacity>
    </View>
  );
};

// 4. NEW: Local styles defined for this component
const localStyles = StyleSheet.create({
  instructionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Explicit white background
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    // Using your 'accent' color from globalStyles
    backgroundColor: colors.accent || '#007AFF', 
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#FFFFFF', // White text on the accent color
    fontWeight: 'bold',
    fontSize: 16,
  },
  instructionText: {
    flex: 1, // Allows text to wrap
    fontSize: 16,
    // THE FIX: Using your 'text' color from globalStyles
    color: colors.text || '#333333', 
  },
});

export default InstructionScreen;