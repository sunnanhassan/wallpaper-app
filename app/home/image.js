import { StyleSheet, View, ActivityIndicator, Alert, Text, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import { BlurView } from 'expo-blur';
import { hp, wp } from '../../helpers/common'; // Assuming wp is a helper function for width percentage
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image as ExpoImage } from 'expo-image';
import { Entypo, Octicons, AntDesign } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library'; // Updated import

// Helper function to calculate image size
const getSize = (imageWidth, imageHeight) => {
  if (!imageWidth || !imageHeight) return { width: wp(92), height: wp(92) };
  const aspectRatio = imageWidth / imageHeight;
  const maxWidth = wp(92);
  let calculatedWidth = maxWidth;
  let calculatedHeight = maxWidth / aspectRatio;
  if (aspectRatio < 1) {
    calculatedHeight = maxWidth;
    calculatedWidth = calculatedHeight * aspectRatio;
  }
  return { width: calculatedWidth, height: calculatedHeight };
};

const ImageScreen = () => {
  const [status, setStatus] = useState('loading');
  const [imageSize, setImageSize] = useState({ width: wp(92), height: wp(92) });
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();
  const { imageUri, imageWidth, imageHeight } = useLocalSearchParams();

  // Ensure imageUri is valid
  const uri = decodeURIComponent(imageUri || '');

  const handleDownloadImage = async () => {
    if (!uri) {
      Alert.alert('Error', 'Image URL is not available');
      return;
    }

    // Request permission to access the media library
    const { granted } = await MediaLibrary.requestPermissionsAsync();
    if (!granted) {
      Alert.alert('Permission Denied', 'Cannot save the image without permission to access the gallery.');
      return;
    }

    try {
      const fileUri = FileSystem.documentDirectory + 'downloaded_image.jpg';
      const downloadResult = await FileSystem.downloadAsync(uri, fileUri);

      if (downloadResult.status !== 200) {
        Alert.alert('Download Failed', 'Unable to download the image.');
        return;
      }

      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync('Download', asset, false);

      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);

      Alert.alert('Success', 'Image downloaded successfully to gallery.');
    } catch (error) {
      console.error('Error downloading image:', error);
      Alert.alert('Error', 'Failed to download the image.');
    }
  };

  const handleShareImage = async () => {
    if (!uri) {
      Alert.alert('Error', 'Image URL is not available');
      return;
    }

    try {
      const fileUri = FileSystem.documentDirectory + 'shared_image.jpg';
      const downloadResult = await FileSystem.downloadAsync(uri, fileUri);

      if (downloadResult.status !== 200) {
        Alert.alert('Download Failed', 'Unable to prepare the image for sharing.');
        return;
      }

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Error', 'Sharing is not available on this device.');
        return;
      }

      await Sharing.shareAsync(fileUri);
    } catch (error) {
      Alert.alert('Error', 'Failed to share the image.');
      console.error('Error sharing image:', error);
    }
  };

  useEffect(() => {
    if (uri && imageWidth && imageHeight) {
      const size = getSize(Number(imageWidth), Number(imageHeight));
      setImageSize(size);
      setStatus('Loaded');
    }
  }, [uri, imageWidth, imageHeight]);

  return (
    <BlurView style={styles.container} tint="dark" intensity={60}>
      <View>
        <View style={styles.loading}>
          {status === 'loading' && <ActivityIndicator size="large" color="white" />}
        </View>
        <ExpoImage
          transition={100}
          style={[styles.image, { width: imageSize.width, height: imageSize.height }]}
          source={{ uri }}
          onLoad={() => setStatus('Loaded')}
        />
      </View>
      <View style={styles.buttons}>
        <Animated.View entering={FadeInUp.springify()}>
          <Pressable style={styles.button} onPress={() => router.back()}>
            <Octicons name='x' size={24} color='white' />
          </Pressable>
        </Animated.View>
        <Animated.View entering={FadeInUp.springify().delay(100)}>
          <Pressable style={styles.button} onPress={handleDownloadImage}>
            <Octicons name='download' size={24} color='white' />
          </Pressable>
        </Animated.View>
        <Animated.View entering={FadeInUp.springify().delay(200)}>
          <Pressable style={styles.button} onPress={handleShareImage}>
            <Entypo name='share' size={24} color='white' />
          </Pressable>
        </Animated.View>
      </View>
      {showPopup && (
        <Animated.View
          style={styles.popup}
          entering={FadeInUp.springify()}
          exiting={FadeOutDown.springify()}
        >
          <AntDesign name="checkcircle" size={24} color="white" />
          <View style={styles.popupTextContainer}>
            <Text style={styles.popupTitle}>Success</Text>
            <Text style={styles.popupMessage}>Image saved successfully</Text>
          </View>
        </Animated.View>
      )}
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loading: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  image: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  buttons: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 50,
  },
  button: {
    height: hp(6),
    width: hp(6),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255, 0.2)',
    borderRadius: 10,
  },
  popup: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  popupTextContainer: {
    marginLeft: 10,
  },
  popupTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  popupMessage: {
    color: 'white',
    fontSize: 14,
  },
});

export default ImageScreen;
