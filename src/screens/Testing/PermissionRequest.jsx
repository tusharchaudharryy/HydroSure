import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import { styles, colors } from '../../styles/globalStyles';

const PermissionsRequest = ({ onNext, onBack }) => {
  const [cameraGranted, setCameraGranted] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);

  const requestCameraPermission = async () => {
    const result = await request(
      Platform.select({
        ios: PERMISSIONS.IOS.CAMERA,
        android: PERMISSIONS.ANDROID.CAMERA,
      })
    );

    if (result === RESULTS.GRANTED) {
      setCameraGranted(true);
    } else {
      Alert.alert('Camera permission denied');
    }
  };

  const requestLocationPermission = async () => {
    const result = await request(
      Platform.select({
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      })
    );

    if (result === RESULTS.GRANTED) {
      setLocationGranted(true);
      Geolocation.getCurrentPosition(
        pos => console.log('User location:', pos.coords),
        err => console.log('Location error:', err),
        { enableHighAccuracy: true }
      );
    } else {
      Alert.alert('Location permission denied');
    }
  };

  return (
    <View>
      {/* Camera Permission */}
      <View style={[styles.permissionCard, cameraGranted && { backgroundColor: colors.successLight }]}>
        <View>
          <Text style={styles.sectionTitle}>📷 Camera Access</Text>
          <Text style={styles.textSmall}>Needed to scan the test strip and chart.</Text>
        </View>
        {!cameraGranted ? (
          <TouchableOpacity onPress={requestCameraPermission} style={styles.allowButton}>
            <Text style={styles.allowButtonText}>Allow</Text>
          </TouchableOpacity>
        ) : (
          <Text style={{ color: colors.success, fontWeight: 'bold' }}>Granted</Text>
        )}
      </View>

      {/* Location Permission */}
      <View style={[styles.permissionCard, locationGranted && { backgroundColor: colors.successLight }]}>
        <View>
          <Text style={styles.sectionTitle}>📍 Location Access</Text>
          <Text style={styles.textSmall}>To tag your test results with your location.</Text>
        </View>
        {!locationGranted ? (
          <TouchableOpacity onPress={requestLocationPermission} style={styles.allowButton}>
            <Text style={styles.allowButtonText}>Allow</Text>
          </TouchableOpacity>
        ) : (
          <Text style={{ color: colors.success, fontWeight: 'bold' }}>Granted</Text>
        )}
      </View>

      {(cameraGranted && locationGranted) && (
        <TouchableOpacity onPress={onNext} style={[styles.button, { marginTop: 32 }]}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default PermissionsRequest;
