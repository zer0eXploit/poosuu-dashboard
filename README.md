## Poo Suu Admin Dashboard

### Introduction

Poo Suu Dashboard is a client app to interact with the [Poo Suu REST API ](https://github.com/zer0eXploit/poosuu-api). It is used for managing managing lyrics, artists and song data. It is built using React and some performance optimization are implemented such as lazy loading for the components with React Lazy.

### Project Requirements

Please install dependencies with `npm install` first.

Some environment variables are required in order to be able to successfully run the app.

In the environment variables file, `REACT_APP_API_BASE_URL` and `REACT_APP_POOSUU_PUBLIC_API_KEY` need to be set. The public API key can be generated once logged in to the dashboard. It is required for read operations to get data from the API. After generating the API Key set it in the environment variable and restart the server to finish the setup.

### Available Scripts

#### `npm start` - Runs the app in the development mode.

#### `npm test` - Launches the test runner in the interactive watch mode.

#### `npm run build` - Builds the app for production to the `build` folder.

#### `npm run eject` - Change build tool config.

### Some Screenshots

<img align="center" alt="Login" width="100" height="100" src="https://i.ibb.co/9tw8bhs/1.png">
<img align="center" alt="Dashboard" width="100" height="100" src="https://i.ibb.co/5jDJdDp/2.png">
<img align="center" alt="My Account" width="100" height="100" src="https://i.ibb.co/VNB7pK4/3.png">
<img align="center" alt="Songs" width="100" height="100" src="https://i.ibb.co/dQnZzL7/4.png">
<img align="center" alt="Artists" width="100" height="100" src="https://i.ibb.co/8Pc8mwH/5.png">
