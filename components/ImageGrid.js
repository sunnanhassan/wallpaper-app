import { View, Image, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import { MasonryFlashList } from '@shopify/flash-list';
import { wp } from '../helpers/common';

const ImageGrid = ({ images, router }) => {
  return (
    <View style={styles.container}>
      <MasonryFlashList
        data={images}
        contentContainerStyle={styles.listContainerStyle} // Supported props only
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push({ pathname: 'home/image', params: { imageUri: item.uri } })}>
            <Image
              source={{ uri: item.uri }}
              style={[
                styles.image,
                {
                  height: wp(45) * 1.5, // Dynamic height
                  width: wp(45),        // Dynamic width
                }
              ]}
            />
          </Pressable>
        )}
        estimatedItemSize={200}
        numColumns={2} // Ensure 2 columns
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: wp(100),
    marginLeft: -wp(1),
  },
  listContainerStyle: {
    paddingHorizontal: wp(2), // Only supported property
  },
  image: {
    marginBottom: 10,
    marginHorizontal: wp(1), // Margin between images
    borderRadius: 10,
  },
});

export default ImageGrid;
