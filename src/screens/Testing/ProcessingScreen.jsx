// Testing.zip/Testing/ProcessingScreen.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { styles, colors } from '../../styles/globalStyles';

const API_URL = 'http://localhost:8000/analyze'; // <-- REPLACE WITH YOUR IP
// ... // <-- REPLACE WITH YOUR IP

const ProcessingScreen = ({ chartImage, stripImage, onComplete, onBack }) => {
  const [error, setError] = useState(null);

  useEffect(() => {
    // This function runs once when the component loads
    const handleAnalysis = async () => {
      setError(null);
      if (!chartImage || !stripImage) {
        Alert.alert("Error", "Missing images, please go back.");
        setError("Missing images.");
        return;
      }

      // 1. Create FormData to send files
      const formData = new FormData();

      // 2. Append both files.
      // The API expects 'chart_file' and 'strip_file'
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

      // 3. Make the API call
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            // --- If you set an API Key, add it here ---
            // 'X-API-Key': 'YOUR_SECRET_KEY_123'
          },
        });

        const json = await response.json();

        if (response.ok) {
          // Success! Pass the full JSON report to the onComplete callback
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
  }, [chartImage, stripImage, onComplete]);

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
      <Text style={[styles.pageTitle, { marginTop: 20 }]}>Analyzing your test...</Text>
      <Text style={[styles.textSmall, { marginTop: 10, textAlign: 'center', paddingHorizontal: 20 }]}>
        Please wait while we calibrate the chart and analyze your strip. This may take up to 30 seconds.
      </Text>
    </View>
  );
};

export default ProcessingScreen;