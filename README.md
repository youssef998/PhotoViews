This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# PhotoViews

This Project is supposed to be a CRUD app. So Far it only can upload a photo and list them in the app.

The repo works as it uploads the images in uploads folders and also in reads its data from the same folder. Each time the user uploads it is refreshed and update the list in the app.

Backend works on local machine. but on the PC machine not the mobile. Please follow the steps so you can run the app.

# Backend

Welcome to the PhotoViews Backend repository. This repository contains the backend code for the PhotoViews project.

## Getting Started

To get started with the backend, follow these steps:

### Cloning the Repository

1. Open your terminal or command prompt.

2. Run the following command to clone the repository:

   ```bash
   git clone https://github.com/youssef998/PhotoViews.git

   ```

3. Change Directory to backend

   `cd BackEnd`

4. To set up the development environment, follow these steps:
   -install ts-node as global
   `npm install -g ts-node`

5. Configure the execution policy (for Windows only):
   Set-ExecutionPolicy RemoteSigned -Scope Process

### Running the Server

To run the backend server, execute the following command:
`ts-node server.ts`

### Expected

- Server is running on port {}

## Congratulations! :tada:

You've successfully run your Backend on your Host machine fol listing and Uploading Photos in a React Native App. :partying_face:

### Setting Up the Development Environment

To set up the development environment for the frontend, follow these steps:

1. Navigate to the parent directory (assuming you are currently inside the `BackEnd` directory):

   ```bash
   cd FrontEnd
   ```

2. Navigate to the `FrontEnd` directory:

````bash
cd ..
cd FrontEnd```

3. Install additional frontend dependencies:
```bash
npm install express mongoose
npm install axios @types/axios
npm install react-native-image-picker
````

4. Obtain your IP address by running the following command:

- `ipconfig`
- Make note of your IP address, as you will need it in the next step.

5. Please Insert your IPv4 Address instead of thee one in config.js

   instead of 192.168.188.1 -> Make it Your Own
   if Your IPv4 Address is 192.168.15.1 convert the url to be http://192.168.15.1:3000/photos

6. Run the frontend on an Android emulator or device:

   `npx react-native run-android`

### For Android

```bash
# using npm
npx react-native run-android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```
