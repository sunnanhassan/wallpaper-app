import React, { useEffect, useState, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import axios from 'axios';
import ImageGrid from './ImageGrid'; // Ensure the correct path
import { wp } from '../helpers/common';
import { useRouter } from 'expo-router';

const Wallpapers = ({ selectedTag }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const fetchImages = useCallback(async (tag) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`https://res.cloudinary.com/dfxayonyy/image/list/${tag}.json`);
      const updatedImages = response.data.resources.map(image => ({
        uri: `https://res.cloudinary.com/dfxayonyy/image/upload/${image.public_id}.${image.format}`,
      }));
      setImages(updatedImages);
    } catch (err) {
      setError('Failed to fetch images. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages(selectedTag);
  }, [selectedTag, fetchImages]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : images.length > 0 ? (
          <ImageGrid images={images} router={router} />
        ) : (
          <Text style={styles.noImagesText}>No images found for "{selectedTag}"</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: wp(100),
    backgroundColor: '#fff',
    marginLeft: -wp(3),
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
  noImagesText: {
    fontSize: 18,
    color: '#555',
  },
});

export default Wallpapers;
