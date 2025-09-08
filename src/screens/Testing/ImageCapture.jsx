import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { styles, colors } from '../../styles/globalStyles';

const ImageCapture = ({ type, onNext, onBack }) => {
  const [image, setImage] = useState(null);

  const openCamera = async () => {
    launchCamera({ mediaType: 'photo', quality: 1 }, (response) => {
      if (!response.didCancel && !response.errorCode) {
        setImage(response.assets[0].uri);
      }
    });
  };

  const openGallery = async () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
      if (!response.didCancel && !response.errorCode) {
        setImage(response.assets[0].uri);
      }
    });
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
          <TouchableOpacity onPress={() => setImage(null)} style={[styles.button, styles.halfButton, { backgroundColor: '#E5E7EB' }]}>
            <Text style={[styles.buttonText, { color: '#1F2937' }]}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onNext} style={[styles.button, styles.halfButton, { backgroundColor: colors.accent }]}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ImageCapture;