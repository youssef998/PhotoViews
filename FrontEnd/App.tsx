/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect  } from 'react';
import { Text, View, Button, Image, ScrollView,StyleSheet, TouchableOpacity } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios'; 
import config from './config';
import { Alert } from 'react-native';


const App = () => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
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

const handleDeleteButtonPress = async () => {
  // Handle the deletion of selected images here
  if (selectedImages.length > 0) {
    // Delete selected images
    deleteSelectedImages();
    setIsDeleteMode(false); // Exit delete mode after deletion
  }
};


const handleCancelButtonPress = () => {
  // If the user presses the "Cancel" button, exit delete mode
  setIsDeleteMode(false);

  // Fetch the photos again to update the list
  fetchPhotosFromBackend();
};


const toggleImageSelection = (imageUri: string) => {
  // Toggle the selection status of the image
  if (!isDeleteMode) {
    // If not in delete mode, switch to delete mode and select the image
    setIsDeleteMode(true);
    setSelectedImages([imageUri]);
  } else if (selectedImages.includes(imageUri)) {
    // If already selected in delete mode, remove it from the selectedImages array
    setSelectedImages(selectedImages.filter((uri) => uri !== imageUri));
  } else {
    // If not selected in delete mode, add it to the selectedImages array
    setSelectedImages([...selectedImages, imageUri]);
  }
};

const deleteSelectedImages = async () => {
  try {
    if (selectedImages.length === 0) {
      // No images selected for deletion, exit early
      return;
    }

    // Create an array of DELETE request promises for selected images
    const deletePromises = selectedImages.map(async (imageUri) => {
      // Extract the filename from the path by splitting and getting the last part
      const filename = imageUri.split('/').pop();

      // Check if filename is defined before constructing the URL
      if (filename) {
        // Construct the URL for the DELETE request using the extracted filename
        const backendApiUrl = `${config.backendApiDels}/delete/${encodeURIComponent(filename)}`;

        // Send the DELETE request
        try {
          await axios.delete(backendApiUrl);
        } catch (error) {
          console.error(`Error deleting image '${filename}':`, error);
        }
      } else {
        console.error('Invalid imageUri:', imageUri);
      }
    });

    // Wait for all DELETE requests for selected images to complete
    await Promise.all(deletePromises);

    // After all successful deletions, fetch the updated list of image URIs
    fetchPhotosFromBackend();

    // Clear the selected images
    setSelectedImages([]);

    // Show a success message using Alert
    Alert.alert('Deleted successfully', 'The selected images have been deleted successfully.');
  } catch (error) {
    console.error('Error deleting images:', error);
  }
};



return (
  <View style={styles.container}>
      {isDeleteMode ? (
        <View style={styles.deleteModeContainer}>
          <Button title="Delete" onPress={handleDeleteButtonPress} />
          <Button title="Cancel" onPress={handleCancelButtonPress} />
        </View>
      ) : (
        <Button title="Delete" onPress={() => setIsDeleteMode(true)} />
      )}

      <Text>Upload an Image</Text>
      <Button title="Add Image" onPress={handleImagePicker} />
      <ScrollView style={styles.scrollView}>
        {groupImagesIntoPairs().map((pair, pairIndex) => (
          <View key={pairIndex} style={styles.imageRow}>
            {pair.map((imageUri, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => isDeleteMode && toggleImageSelection(imageUri)} // Enable selection in delete mode
                style={styles.imageContainer}
              >
                <Image
                  source={{ uri: `http://192.168.188.1:3000${imageUri}` }}
                  style={styles.image}
                  onError={(e) => {
                    // Handle the error
                    console.log('Error loading image:', e.nativeEvent.error);
                  }}
                />
                {isDeleteMode && selectedImages.includes(imageUri) && (
                  <View style={styles.selectionIndicator} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
//   <View style={styles.container}>
//   <Text>Upload an Image</Text>
//   <Button title="Add Image" onPress={handleImagePicker} />
//   <ScrollView style={styles.scrollView}>
//     {groupImagesIntoPairs().map((pair, pairIndex) => (
//       <View key={pairIndex} style={styles.imageRow}>
//         {pair.map((imageUri, index) => (
//           <Image
//             key={index}
//             source={{ uri: `http://192.168.188.1:3000${imageUri}` }}
//             style={styles.image}
//             onError={(e) => {
//                 // Handle the error
//               console.log('Error loading image:', e.nativeEvent.error);
//             }}
//           />
//         ))}
//       </View>
//     ))}
//   </ScrollView>
// </View>

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
  imageContainer: {
    width: '45%',
    marginHorizontal: '2.5%',
  },

  deleteButton: {
    color: 'red',
    textAlign: 'center',
    marginTop: 5,
  },
  deleteModeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  selectionIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    backgroundColor: 'red',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
  },
});

export default App;