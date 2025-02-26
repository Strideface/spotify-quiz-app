# Spotify Quiz App

## A web app built with React that offers a quiz based on Spotify tracks and artists.

The app is currently being hosted on Firebase: https://spotify-quiz-app-dev.web.app/

Due to Spotify's TOS, the app cannot be approved for the 'extended quota mode' which would allow anyone with a Spotify premiuim account to use it (https://developer.spotify.com/policy#iii-some-prohibited-applications - "Do not create a game, including trivia quizzes"). This means that the app will remain in "Development mode" where by only Spotify premium users whos registered emails have been added to a whitelist will be able to use it (max of 25 users can be added to the whitelist). Non-whitelisted users can reach the app but will fail authentication when trying to sign-in. Users are added to the whitelist through the Spotify for developers dashboard under 'User Management' (of course, only I will be able to add to this list as the owner of this Spotify app).

## Run locally

To run locally, you need to add a .env file at the root of the directory, with the following enviroment variables:

(Remember that in a 'Create React App' app, EVs must start with 'REACT_APP', else they won't be recognized.)

#Firebase Configuration object

`REACT_APP_FIREBASE_API_KEY=xxx`

`REACT_APP_FIREBASE_AUTH_DOMAIN=xxx`

`REACT_APP_FIREBASE_PROJECT_ID=xxx`

`REACT_APP_FIREBASE_STORAGE_BUCKET=xxx`

`REACT_APP_FIREBASE_MESSAGING_SENDER_ID=xxx`

`REACT_APP_FIREBASE_APP_ID=xxx`

#AppCheck details

`REACT_APP_SPOTIFY_QUIZ_APP_DEBUG_TOKEN=xxx`

#Spotify API account details

`REACT_APP_SPOTIFY_CLIENT_ID=*my_spotify_client_id`

`REACT_APP_SPOTIFY_REDIRECT_URI_DEV=http://localhost:3000/`


A seperate .env file needs to be included in the root of the 'Functions' sub directory in order to make the Firebase Function work:

#SMTP details and credentials for Brevo account

`BREVO_HOST=xx`

`BREVO_PORT=xxx`

`BREVO_USERNAME=xxx`

`BREVO_PASSWORD=xxx`

`BREVO_FROM=*the email address sending the email`

`RECIPIENT_EMAIL=*the email address receiving the email`

#SMTP details and credentials for Mailtrap account

`MAILTRAP_HOST=xxx`

`MAILTRAP_PORT=xxx`

`MAILTRAP_USERNAME=xxx`

`MAILTRAP_PASSWORD=xxx`

### Variable values with 'xxx' will need to be provided in a secure manner by the admin 

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
