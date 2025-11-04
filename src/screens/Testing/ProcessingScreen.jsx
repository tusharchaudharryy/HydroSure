// D:\HydroSure\src\screens\Testing\ProcessingScreen.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
// --- ADD Geolocation ---
import Geolocation from '@react-native-community/geolocation';
import { styles, colors } from '../../styles/globalStyles';
//import * as logging from 'expo-logging'; // Or your preferred logging

// --- CRITICAL NOTE ---
// You must use your computer's local network IP address, not localhost.
const API_URL = 'localhost'; // <-- REPLACE WITH YOUR IP

// --- NEW Helper Function to get location ---
const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (pos) => resolve(pos.coords),
      (err) => reject(err),
      // Note: enableHighAccuracy: true is required for best results
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });
};


const ProcessingScreen = ({ chartImage, stripImage, onComplete, onBack }) => {
  const [error, setError] = useState(null);
  // Add status message for better UX
  const [statusMessage, setStatusMessage] = useState('Initializing analysis...');

  useEffect(() => {
    const handleAnalysis = async () => {
      setError(null);
      if (!chartImage || !stripImage) {
        Alert.alert("Error", "Missing images, please go back.");
        setError("Missing images.");
        return;
      }

      try {
        // --- 1. Get Location ---
        setStatusMessage("Fetching location...");
        let coords = { latitude: null, longitude: null };
        try {
          // This will use the permission already granted by InstructionScreen
          coords = await getCurrentLocation();
          console.log(`Location found: ${coords.latitude}, ${coords.longitude}`);
        } catch (locError) {
          console.warn("Could not get location: ", locError.message);
          // Don't block the analysis; just send null coordinates
          // You could alert the user here if location is mandatory
        }

        // --- 2. Create FormData ---
        setStatusMessage("Uploading images...");
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
        // We send them as separate form fields
        if (coords.latitude) {
          formData.append('latitude', coords.latitude.toString());
          formData.append('longitude', coords.longitude.toString());
        }

        // --- 4. Make the API call ---
        setStatusMessage("Analyzing your test... This may take up to 30 seconds.");
        const response = await fetch(API_URL, {
          method: 'POST',
          body: formData,
          headers: { 
            'Content-Type': 'multipart/form-data',
            // No API Key header needed locally
          },
        });

        const json = await response.json();

        if (response.ok) {
          // Success!
          onComplete(json);
        } else {
          // Handle API errors (e.g., 400, 500)
          const errorMsg = json.detail || "Analysis failed. Please try again.";
          Alert.alert("Analysis Error", errorMsg);
          setError(errorMsg);
        }
      } catch (e) {
        // Handle network errors (e.g., wrong IP, server is down)
        console.error("Network request failed:", e);
        const errorMsg = "Could not connect to the server. Check your network and IP address.";
        Alert.alert("Network Error", errorMsg);
        setError(errorMsg);
      }
    };

    handleAnalysis();
  }, [chartImage, stripImage, onComplete]); // Dependencies

  // --- UI to show loading or error state ---
  if (error) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[styles.pageTitle, { color: colors.danger, marginBottom: 20 }]}>Error</Text>
        <Text style={[styles.textSmall, { textAlign: 'center', paddingHorizontal: 20, marginBottom: 30 }]}>
          {error}
        </Text>
        <TouchableOpacity onPress={onBack} style={styles.button}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <ActivityIndicator size="large" color={colors.accent} />
      <Text style={[styles.pageTitle, { marginTop: 20 }]}>{statusMessage}</Text>
    </View>
  );
};

export default ProcessingScreen;