// // D:\HydroSure\src\screens\Testing\ProcessingScreen.jsx
// import React, { useEffect, useState } from 'react';
// import { View, Text, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
// // --- ADD Geolocation ---
// import Geolocation from '@react-native-community/geolocation';
// import { styles, colors } from '../../styles/globalStyles';
// //import * as logging from 'expo-logging'; // Or your preferred logging

// // --- CRITICAL NOTE ---
// // You must use your computer's local network IP address, not localhost.
// const API_URL = 'localhost'; // <-- REPLACE WITH YOUR IP

// // --- NEW Helper Function to get location ---
// const getCurrentLocation = () => {
//   return new Promise((resolve, reject) => {
//     Geolocation.getCurrentPosition(
//       (pos) => resolve(pos.coords),
//       (err) => reject(err),
//       // Note: enableHighAccuracy: true is required for best results
//       { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
//     );
//   });
// };


// const ProcessingScreen = ({ chartImage, stripImage, onComplete, onBack }) => {
//   const [error, setError] = useState(null);
//   // Add status message for better UX
//   const [statusMessage, setStatusMessage] = useState('Initializing analysis...');

//   useEffect(() => {
//     const handleAnalysis = async () => {
//       setError(null);
//       if (!chartImage || !stripImage) {
//         Alert.alert("Error", "Missing images, please go back.");
//         setError("Missing images.");
//         return;
//       }

//       try {
//         // --- 1. Get Location ---
//         setStatusMessage("Fetching location...");
//         let coords = { latitude: null, longitude: null };
//         try {
//           // This will use the permission already granted by InstructionScreen
//           coords = await getCurrentLocation();
//           console.log(`Location found: ${coords.latitude}, ${coords.longitude}`);
//         } catch (locError) {
//           console.warn("Could not get location: ", locError.message);
//           // Don't block the analysis; just send null coordinates
//           // You could alert the user here if location is mandatory
//         }

//         // --- 2. Create FormData ---
//         setStatusMessage("Uploading images...");
//         const formData = new FormData();
        
//         formData.append('chart_file', {
//           uri: chartImage.uri,
//           name: chartImage.fileName || 'chart.jpg',
//           type: chartImage.type || 'image/jpeg',
//         });

//         formData.append('strip_file', {
//           uri: stripImage.uri,
//           name: stripImage.fileName || 'strip.jpg',
//           type: stripImage.type || 'image/jpeg',
//         });
        
//         // --- 3. Append Location Data ---
//         // We send them as separate form fields
//         if (coords.latitude) {
//           formData.append('latitude', coords.latitude.toString());
//           formData.append('longitude', coords.longitude.toString());
//         }

//         // --- 4. Make the API call ---
//         setStatusMessage("Analyzing your test... This may take up to 30 seconds.");
//         const response = await fetch(API_URL, {
//           method: 'POST',
//           body: formData,
//           headers: { 
//             'Content-Type': 'multipart/form-data',
//             // No API Key header needed locally
//           },
//         });

//         const json = await response.json();

//         if (response.ok) {
//           // Success!
//           onComplete(json);
//         } else {
//           // Handle API errors (e.g., 400, 500)
//           const errorMsg = json.detail || "Analysis failed. Please try again.";
//           Alert.alert("Analysis Error", errorMsg);
//           setError(errorMsg);
//         }
//       } catch (e) {
//         // Handle network errors (e.g., wrong IP, server is down)
//         console.error("Network request failed:", e);
//         const errorMsg = "Could not connect to the server. Check your network and IP address.";
//         Alert.alert("Network Error", errorMsg);
//         setError(errorMsg);
//       }
//     };

//     handleAnalysis();
//   }, [chartImage, stripImage, onComplete]); // Dependencies

//   // --- UI to show loading or error state ---
//   if (error) {
//     return (
//       <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//         <Text style={[styles.pageTitle, { color: colors.danger, marginBottom: 20 }]}>Error</Text>
//         <Text style={[styles.textSmall, { textAlign: 'center', paddingHorizontal: 20, marginBottom: 30 }]}>
//           {error}
//         </Text>
//         <TouchableOpacity onPress={onBack} style={styles.button}>
//           <Text style={styles.buttonText}>Go Back</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//       <ActivityIndicator size="large" color={colors.accent} />
//       <Text style={[styles.pageTitle, { marginTop: 20 }]}>{statusMessage}</Text>
//     </View>
//   );
// };

// export default ProcessingScreen;

















// import React, { useEffect, useState } from 'react';
// // 1. Import StyleSheet
// import { View, Text, ActivityIndicator, Alert, TouchableOpacity, StyleSheet } from 'react-native';
// import Geolocation from '@react-native-community/geolocation';
// import { styles, colors } from '../../styles/globalStyles';

// // --- No change to core logic ---
// const API_URL = 'localhost'; // <-- REPLACE WITH YOUR IP

// const getCurrentLocation = () => {
//   return new Promise((resolve, reject) => {
//     Geolocation.getCurrentPosition(
//       (pos) => resolve(pos.coords),
//       (err) => reject(err),
//       { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
//     );
//   });
// };
// // --- End of core logic ---


// const ProcessingScreen = ({ chartImage, stripImage, onComplete, onBack }) => {
//   const [error, setError] = useState(null);

//   // 2. SIMPLIFIED STATUS: Only one message, no more updates.
//   const [statusMessage, setStatusMessage] = useState('Analyzing your test...');

//   useEffect(() => {
//     const handleAnalysis = async () => {
//       setError(null);
//       if (!chartImage || !stripImage) {
//         Alert.alert("Error", "Missing images, please go back.");
//         setError("Missing images.");
//         return;
//       }

//       try {
//         // --- 1. Get Location ---
//         // setStatusMessage("Fetching location..."); // <-- REMOVED
//         let coords = { latitude: null, longitude: null };
//         try {
//           coords = await getCurrentLocation();
//           console.log(`Location found: ${coords.latitude}, ${coords.longitude}`);
//         } catch (locError) {
//           console.warn("Could not get location: ", locError.message);
//         }

//         // --- 2. Create FormData ---
//         // setStatusMessage("Uploading images..."); // <-- REMOVED
//         const formData = new FormData();
        
//         formData.append('chart_file', {
//           uri: chartImage.uri,
//           name: chartImage.fileName || 'chart.jpg',
//           type: chartImage.type || 'image/jpeg',
//         });

//         formData.append('strip_file', {
//           uri: stripImage.uri,
//           name: stripImage.fileName || 'strip.jpg',
//           type: stripImage.type || 'image/jpeg',
//         });
        
//         // --- 3. Append Location Data ---
//         if (coords.latitude) {
//           formData.append('latitude', coords.latitude.toString());
//           formData.append('longitude', coords.longitude.toString());
//         }

//         // --- 4. Make the API call ---
//         // setStatusMessage("Analyzing your test... This may take up to 30 seconds."); // <-- REMOVED
        
//         // We can add a more descriptive message one time *if* we want
//         setTimeout(() => {
//             setStatusMessage("Just a moment... running analysis.");
//         }, 8000); // e.g., Update after 8 seconds

//         const response = await fetch(API_URL, {
//           method: 'POST',
//           body: formData,
//           headers: { 
//             'Content-Type': 'multipart/form-data',
//           },
//         });

//         const json = await response.json();

//         if (response.ok) {
//           onComplete(json);
//         } else {
//           const errorMsg = json.detail || "Analysis failed. Please try again.";
//           Alert.alert("Analysis Error", errorMsg);
//           setError(errorMsg);
//         }
//       } catch (e) {
//         console.error("Network request failed:", e);
//         const errorMsg = "Could not connect to the server. Check your network and IP address.";
//         Alert.alert("Network Error", errorMsg);
//         setError(errorMsg);
//       }
//     };

//     handleAnalysis();
//   }, [chartImage, stripImage, onComplete]);

//   // --- 3. NEW: Attractive Error State UI ---
//   if (error) {
//     return (
//       <View style={localStyles.container}>
//         <Text style={localStyles.errorIcon}>⚠️</Text>
//         <Text style={[styles.pageTitle, { color: colors.danger, marginBottom: 16 }]}>
//           Analysis Failed
//         </Text>
//         <View style={localStyles.errorCard}>
//           <Text style={localStyles.errorText}>{error}</Text>
//         </View>
//         <TouchableOpacity 
//           onPress={onBack} 
//           style={[styles.button, { backgroundColor: colors.accent }]} // Use accent for 'Go Back'
//         >
//           <Text style={styles.buttonText}>Try Again</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   // --- 4. NEW: Attractive Loading State UI ---
//   return (
//     <View style={localStyles.container}>
//       <ActivityIndicator size="large" color={colors.accent} style={{ transform: [{ scale: 1.5 }]}} />
//       <Text style={[styles.pageTitle, { marginTop: 24, textAlign: 'center' }]}>
//         {statusMessage}
//       </Text>
//       <Text style={[styles.textSmall, { marginTop: 8, color: colors.textSecondary }]}>
//         Please keep the app open.
//       </Text>
//     </View>
//   );
// };

// // 5. NEW: Local styles for this component
// const localStyles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: colors.background || '#F9FAFB', // Use background color from global
//   },
//   errorIcon: {
//     fontSize: 64,
//     marginBottom: 16,
//   },
//   errorCard: {
//     backgroundColor: '#FFFBEB', // A light yellow error background
//     borderColor: '#FEE2E2', // Light red border
//     borderWidth: 1,
//     borderRadius: 8,
//     padding: 16,
//     width: '100%',
//     marginBottom: 24,
//   },
//   errorText: {
//     fontSize: 16,
//     color: '#9A3412', // Darker text color for readability
//     textAlign: 'center',
//   },
// });

// export default ProcessingScreen;



















import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { styles, colors } from '../../styles/globalStyles';

// const API_URL = 'localhost'; // <-- No longer needed for this test

const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (pos) => resolve(pos.coords),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });
};


const ProcessingScreen = ({ chartImage, stripImage, onComplete, onBack }) => {
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState('Analyzing your test...');

  useEffect(() => {
    const handleAnalysis = async () => {
      setError(null);
      if (!chartImage || !stripImage) {
        Alert.alert("Error", "Missing images, please go back.");
        setError("Missing images.");
        return;
      }

      // --- 1. Get Location (Still good to test this) ---
      try {
        const coords = await getCurrentLocation();
        console.log(`Location found: ${coords.latitude}, ${coords.longitude}`);
      } catch (locError) {
        console.warn("Could not get location: ", locError.message);
      }
      
      // --- 2. API CALL SKIPPED ---
      // We will simulate a 3-second processing delay
      
      console.log("Simulating API call...");

      const timer = setTimeout(() => {
        // --- Create your mock data here ---
        const mockResponse = {
          "ph": 7.4,
          "hardness_ppm": 150,
          "nitrate_ppm": 10,
          "chlorine_ppm": 0.5,
          "alkalinity_ppm": 120,
          "timestamp": new Date().toISOString()
        };
        
        console.log("Simulation complete. Passing mock data:", mockResponse);
        onComplete(mockResponse);

      }, 3000); // 3-second delay

      // Cleanup function for the timer
      return () => clearTimeout(timer);


      /* --- ⛔️ ORIGINAL API LOGIC COMMENTED OUT ⛔️ ---

      try {
        // --- 2. Create FormData ---
        const formData = new FormData();
        
        formData.append('chart_file', {
          uri: chartImage.uri,
          name: chartImage.fileName || 'chart.jpg',
          type: chartImage.type || 'image/jpeg',
        });

        formData.append('strip_file', {
          uri: stripImage.uri,
          name: stripImage.fileName || 'strip.jpg',
          type: stripImage.type || 'image/jpeg',
        });
        
        // --- 3. Append Location Data ---
        if (coords.latitude) {
          formData.append('latitude', coords.latitude.toString());
          formData.append('longitude', coords.longitude.toString());
        }

        // --- 4. Make the API call ---
        const response = await fetch(API_URL, {
          method: 'POST',
          body: formData,
          headers: { 
            'Content-Type': 'multipart/form-data',
          },
        });

        const json = await response.json();

        if (response.ok) {
          onComplete(json);
        } else {
          const errorMsg = json.detail || "Analysis failed. Please try again.";
          Alert.alert("Analysis Error", errorMsg);
          setError(errorMsg);
        }
      } catch (e) {
        console.error("Network request failed:", e);
        const errorMsg = "Could not connect to the server. Check your network and IP address.";
        Alert.alert("Network Error", errorMsg);
        setError(errorMsg);
      }
      
      --- ⛔️ END OF COMMENTED BLOCK ⛔️ --- */

    };

    handleAnalysis();
    // Add onComplete to dependencies if it's not stable (e.g., from useCallback)
  }, [chartImage, stripImage, onComplete]); 

  // --- No changes to the UI sections ---

  if (error) {
    return (
      <View style={localStyles.container}>
        <Text style={localStyles.errorIcon}>⚠️</Text>
        <Text style={[styles.pageTitle, { color: colors.danger, marginBottom: 16 }]}>
          Analysis Failed
        </Text>
        <View style={localStyles.errorCard}>
          <Text style={localStyles.errorText}>{error}</Text>
        </View>
        <TouchableOpacity 
          onPress={onBack} 
          style={[styles.button, { backgroundColor: colors.accent }]}
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={localStyles.container}>
      <ActivityIndicator size="large" color={colors.accent} style={{ transform: [{ scale: 1.5 }]}} />
      <Text style={[styles.pageTitle, { marginTop: 24, textAlign: 'center' }]}>
        {statusMessage}
      </Text>
      <Text style={[styles.textSmall, { marginTop: 8, color: colors.textSecondary }]}>
        Please keep the app open.
      </Text>
    </View>
  );
};

// --- No changes to localStyles ---
const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background || '#F9FAFB',
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorCard: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FEE2E2',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    width: '100%',
    marginBottom: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#9A3412',
    textAlign: 'center',
  },
});

export default ProcessingScreen;