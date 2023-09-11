import express, { Request, Response } from 'express';
import multer from 'multer';
const path = require('path');
const fs = require('fs');

// Create an Express application
const app = express();

// Define the port number where your server will listen
const port = 3000;

// Configure Multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the destination directory here
  },
  filename: function (req, file, cb) {
  // timestamp to the original filename
    const timestamp = Date.now();
    const originalname = file.originalname;
    const filename = `${timestamp}-${originalname}`;
    cb(null, filename);
  },
});

// Create a Multer middleware instance
const upload = multer({
  storage: storage,  // Use the storage configuration defined above
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Handle HTTP POST requests to the '/upload' endpoint
app.post('/upload', upload.single('photo'), async (req, res) => {
  try {
    // Check if a file was uploaded
    const file = req.file as Express.Multer.File;
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }

    // The file has been successfully saved to the 'uploads' directory
    res.status(200).send('File uploaded successfully');
  } catch (error) {
    // Handle errors 
    console.error('Error handling file upload:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Define an API endpoint to browse all uploaded photos
app.get('/photos', async (req, res) => {
    try {
      // Read the contents of the 'uploads' directory and return a list of filenames
      const photoFiles = fs.readdirSync('uploads');
      const photoUrls = photoFiles.map((filename: string) => `/uploads/${filename}`);

  
      // Send the photoUrls as a JSON response
      res.status(200).json(photoUrls);
    } catch (error) {
      // Handle errors gracefully
      console.error('Error fetching photos:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
// Handle DELETE requests to delete a specific photo
app.delete('/delete/:filename', async (req, res) => {
  try {
    const filenameToDelete = req.params.filename;
    const filePath = path.join('uploads', filenameToDelete);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete the file
    fs.unlinkSync(filePath);

    // Respond with a success message
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    // Handle errors gracefully
    console.error('Error deleting photo:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

  // Serve images from the 'uploads' folder
app.use('/uploads', express.static('uploads'));

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
