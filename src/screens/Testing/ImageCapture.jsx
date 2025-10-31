import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native'; // <-- Import Alert
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { styles, colors } from '../../styles/globalStyles';

const ImageCapture = ({ type, onNext, onBack }) => {
  const [image, setImage] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);

  useEffect(() => {
    setImage(null);
    setImageAsset(null);
  }, [type]);

  // --- REVISED: More robust handleResponse function ---
  const handleResponse = (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
      return; // Do nothing
    }

    if (response.errorCode) {
      console.log('ImagePicker Error: ', response.errorMessage);
      Alert.alert('Image Error', response.errorMessage); // Show error to user
      return;
    }

    // Check if assets exist and are not empty
    if (response.assets && response.assets.length > 0) {
      const asset = response.assets[0];
      setImage(asset.uri);
      setImageAsset(asset);
    } else {
      // This handles unexpected cases where no asset is returned
      Alert.alert('Error', 'Could not retrieve the image. Please try again.');
    }
  };
  // --- End of revision ---

  const openCamera = async () => {
    // Note: Ensure permissions were already granted by InstructionScreen
    launchCamera({ mediaType: 'photo', quality: 1 }, handleResponse);
  };

  const openGallery = async () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, handleResponse);
  };

  return (
    <View>
      <Text style={styles.pageTitle}>{`Capture ${type}`}</Text>

      <View style={styles.cameraPlaceholder}>
        {image ? (
          <Image source={{ uri: image }} style={{ width: 200, height: 200, borderRadius: 8 }} />
        ) : (
          <Text style={{ fontSize: 48, color: '#9CA3AF' }}>📷</Text>
        )}
      </View>

      {!image ? (
        <View>
          <TouchableOpacity onPress={openCamera} style={styles.button}>
            <Text style={styles.buttonText}>Take Picture</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={openGallery} style={[styles.button, { marginTop: 12 }]}>
            <Text style={styles.buttonText}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
          <TouchableOpacity
            onPress={() => {
              setImage(null);
              setImageAsset(null);
            }}
            style={[styles.button, styles.halfButton, { backgroundColor: '#E5E7EB' }]}
          >
            <Text style={[styles.buttonText, { color: '#1F2937' }]}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity
            // Pass the full asset up (this logic is correct)
            onPress={() => onNext(imageAsset)} 
            style={[styles.button, styles.halfButton, { backgroundColor: colors.accent }]}
          >
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Added the Back button for better navigation */}
      <TouchableOpacity onPress={onBack} style={[styles.button, { marginTop: 12, backgroundColor: 'transparent' }]}>
        <Text style={[styles.buttonText, { color: colors.text }]}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ImageCapture;