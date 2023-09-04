/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect  } from 'react';
import { Text, View, Button, Image, ScrollView,StyleSheet } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios'; 
import config from './config';


const App = () => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const handleImagePicker = () => {
    launchImageLibrary(
      {
        selectionLimit: 1,
        mediaType: 'photo',
        includeBase64: false,
      },
      async (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('Error code', response.errorCode);
        } else if (response.errorMessage) {
          console.log('Error message', response.errorMessage);
        } else if (response.assets) {
          const fileUri = response.assets[0].uri;
          console.log('URI is ', fileUri);
  
          if (fileUri) {
            try {
              // Make a POST request to backend to upload the image
              console.log('URI is ', fileUri);
              const formData = new FormData();
              formData.append('photo', {
                uri: fileUri,
                type: 'image/jpeg', // adjust the type as needed
                name: 'photo.jpg',
              });
              const backendApiUrl = config.backendApiUploads;
              await axios.post(backendApiUrl, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });
              // After successfully uploading, fetch the updated list of image URIs
              fetchPhotosFromBackend();
              // Update state or display a success message
            } catch (error) {
              console.error('Error uploading image:', error);
            }
          }
        }
      }
    );
  };
  
  
 // Function to group images into pairs
 const groupImagesIntoPairs = () => {
  console.log('selectedImages', selectedImages); 
  const pairs: string[][] = [];
  for (let i = 0; i < selectedImages.length; i += 2) {
    const pair = [selectedImages[i], selectedImages[i + 1]];
    pairs.push(pair);
  }
  return pairs;
};
const fetchPhotosFromBackend = async () => {
  try {
    const backendApiUrl = config.backendApiPhotos;
    const response = await axios.get(backendApiUrl);

    if (response.data) {
      const imageUrls = response.data;
      setSelectedImages(imageUrls);
      // Log the fetched photos
      console.log('Fetched photos:', imageUrls); 
    }
  } catch (error) {
    console.error('Error fetching photos from backend:', error);
  }
};

// Fetch photos from the backend automatically when the component mounts
useEffect(() => {
  fetchPhotosFromBackend();
}, []); // Empty dependency array to run the effect once

return (
  <View style={styles.container}>
  <Text>Upload an Image</Text>
  <Button title="Add Image" onPress={handleImagePicker} />
  <ScrollView style={styles.scrollView}>
    {groupImagesIntoPairs().map((pair, pairIndex) => (
      <View key={pairIndex} style={styles.imageRow}>
        {pair.map((imageUri, index) => (
          <Image
            key={index}
            source={{ uri: `http://192.168.188.1:3000${imageUri}` }}
            style={styles.image}
            onError={(e) => {
                // Handle the error
              console.log('Error loading image:', e.nativeEvent.error);
            }}
          />
        ))}
      </View>
    ))}
  </ScrollView>
</View>

);
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    marginTop: 20,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  image: {
    width: '45%', //width to 45%  two images per row 
    height: 130,
  },
});

export default App;