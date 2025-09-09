import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { styles, colors } from '../../styles/globalStyles';

const ProcessingScreen = ({ onComplete }) => {
  useEffect(() => {
    // Simulate processing for 3 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <ActivityIndicator size="large" color={colors.accent} />
      <Text style={[styles.pageTitle, { marginTop: 20 }]}>Analyzing your test...</Text>
      <Text style={[styles.textSmall, { marginTop: 10, textAlign: 'center', paddingHorizontal: 20 }]}>
        Please wait while we process the images and generate your report.
      </Text>
    </View>
  );
};

export default ProcessingScreen;
