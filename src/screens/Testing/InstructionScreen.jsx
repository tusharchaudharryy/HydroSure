// import React from 'react';
// import { View, Text, TouchableOpacity, Alert, Platform } from 'react-native';
// import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
// import Geolocation from '@react-native-community/geolocation';
// import { styles } from '../../styles/globalStyles';

// const InstructionScreen = ({ onNext }) => {
//   const handleStartTest = async () => {
//     try {
//       // Camera permission
//       const cameraResult = await check(
//         Platform.select({
//           ios: PERMISSIONS.IOS.CAMERA,
//           android: PERMISSIONS.ANDROID.CAMERA,
//         })
//       );

//       if (cameraResult !== RESULTS.GRANTED && cameraResult !== RESULTS.UNAVAILABLE) {
//         showSettingsAlert(
//           translations['permissions.cameratitle'],
//           translations['permissions.cameradesc']
//         );
//       }
  
//       // Location permission
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

//       // Fetch location (optional, can remove if not needed immediately)
//       Geolocation.getCurrentPosition(
//         pos => console.log('User location:', pos.coords),
//         err => console.log('Location error:', err),
//         { enableHighAccuracy: true }
//       );

//       // ✅ Both granted → proceed
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

//       <Text
//         style={[styles.textSmall, { textAlign: 'center', marginVertical: 16 }]}
//       >
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
import { View, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import { request, check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import { styles } from '../../styles/globalStyles';

const InstructionScreen = ({ onNext }) => {
  const handleStartTest = async () => {
    try {
      // ✅ Request Camera permission directly
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

      // ✅ Request Location permission
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

      // ✅ Get location (optional)
      Geolocation.getCurrentPosition(
        pos => console.log('User location:', pos.coords),
        err => console.log('Location error:', err),
        { enableHighAccuracy: true }
      );

      // ✅ Both permissions granted → proceed
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

      <View style={styles.instructionCard}>
        <Text style={styles.instructionStep}>Step 1</Text>
        <Text>Prepare your water sample and test strip.</Text>
      </View>

      <View style={styles.instructionCard}>
        <Text style={styles.instructionStep}>Step 2</Text>
        <Text>Take a picture of the color chart from your kit.</Text>
      </View>

      <View style={styles.instructionCard}>
        <Text style={styles.instructionStep}>Step 3</Text>
        <Text>Take a picture of your litmus strip.</Text>
      </View>

      <Text style={[styles.textSmall, { textAlign: 'center', marginVertical: 16 }]}>
        Our app will analyze the colors and generate a report.
      </Text>

      <TouchableOpacity onPress={handleStartTest} style={styles.button}>
        <Text style={styles.buttonText}>Start Test</Text>
      </TouchableOpacity>
    </View>
  );
};

export default InstructionScreen;

