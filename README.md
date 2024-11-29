# Apartment Rental App Overview

A mobile application where hosts can upload and manage apartments for rent. Users can browse listings, view apartment locations on an interactive map with a route navigation feature, make payments, rent stays, add favourite listings to their wishlist and leave reviews for hosts. Users can also switch between renter and host modes seamlessly on the app.

## Core Features

### 1. **Authentication**
- **Users**: Users can sign up, sign in, sign out, and reset their passwords using a secure authentication system.
- **Backend**: AWS Amplify's authentication service handles user management and authentication processes.

### 2. **Browse Listings**
- Users can explore a variety of apartment listings posted by hosts.
- **UX**: Listings are displayed with relevant information such as price, type, location and duration.

### 3. **Filtering System**
- Users can filter apartment listings based on:
  - **Location**: Powered by the **Google Autocomplete API**, users can search for apartments in specific areas such as city, state or country.
  - **Price**: Users can set a price range to narrow their search.
  - **Type of Place**: Search for apartments by type, such as flats, duplex, etc.
  - **Amenities**: Filter apartments based on available amenities like running water, electricity, pop, security etc.

### 4. **Apartment Details**
- Each listing has a dedicated page with detailed information about the apartment, including:
  - **Photos**
  - **Description**
  - **Price**
  - **Availability**
  - **Location**
  - **Amenites**
  - **Host Information**
  - **Host Contact**
  - **Host Reviews**


### 5. **Apartment Location**
- Users can view the apartment's location on a map using **React Native Maps** and the **Google Maps API**.
- **Route Navigation**: A built-in feature allows users to see how to get to the apartment, with real-time updates of their location.
 
### 6. **Amenities Screen**
- Users can browse a list of available amenities for each apartment.

### 7. **Review System**
- Once an apartment is rented and paid for, users can leave reviews for the host.
- **Review Criteria**: Star Ratings and comments are included to provide feedback.

### 8. **Wishlist System**
- Users can add apartments to their wishlist to track their favorite listings.
- The status of apartments on the wishlist is updated (e.g., **Available**, **Unavailable**, or **Paid**).

### 9. **Payment System**
- **Paystack Integration**: The app integrates **Paystack** to handle payments.
  - **Users**: Add and charge debit cards.
  - **Hosts**: Add bank accounts to receive funds.
- Secure transaction handling and notifications for both parties( users and hosts ).

### 11. **Receipt Generation & Sharing**
- After each successful payment, a **receipt** is generated that includes key payment details such as sender name, recipent name, reference, etc
- **Sharing**: The receipt can be shared to other apps (e.g., WhatsApp, email, etc) using the **React Native Share API**.
 
### 12. **Apartment Upload and Management**
- **Hosts**: Hosts can upload new apartment listings, update existing ones, and delete listings.
- Listings can be managed through an easy-to-use interface.

### 13. **Profile Creation**
- **Users and Hosts**: Both users and hosts can create, upload, and manage their profiles.
- Profiles include essential details and photos to enhance the user/host experience.

### 14. **Contact**
- Users and hosts can contact each other via multiple communication options, including:
  - **WhatsApp**
  - **Email**
  - **Phone**
- These features are enabled through **React Native Linking API** for navigation to the communication apps.

### 15. **Switch App Modes**
- Users can seamlessly switch between **User Mode** (Exploring and renting apartments) and **Host Mode** (uploading and managing apartment listings).

## Core Technologies

- **Frontend**: React Native v0.74.5, Expo v51.0.25
- **Backend**: AWS Amplify (for authentication, API, and backend services)
- **Storage**: Amazon S3 (for image uploads and file storage)
- **Database**: DynamoDB (NoSQL database for handling app data)
- **Location**: React Native Maps, Google Maps API, Google Autocomplete API
- **Payment Integration**: React Native Paystack SDK
- **Navigation**: React Navigation (for in-app routing and navigation)
- **In-App Linking**: React Native Linking API (for enabling navigation to WhatsApp, Email, and Phone Dialer)
- **Sharing**: React Native Share API (for sharing receipts with external apps)

and others

## Documentation Links

Here are some helpful links for setting up various services in the project:
- Payment Integration:
The app uses the Paystack API for handling payments.

Test Payments (app default payment mode): For testing purposes, you can use the Paystack test card to simulate payment. You can find the test card details in the Paystack documentation:
[Paystack Test Card Information](https://paystack.com/docs/payments/test-payments/)

Live Payments: If you want to enable live payments, you'll need to generate a live payment API key from your Paystack dashboard. Follow this guide to get your live API key:
[How to Get Your Paystack API Key](https://dashboard.paystack.com/#/settings/developers)
- [Google Maps API Key Documentation](https://developers.google.com/maps/documentation/places/web-service/get-api-key)
- [Google Autocomplete API Documentation](https://developers.google.com/maps/documentation/places/web-service/autocomplete)
- [React Native Paystack SDK Documentation](https://github.com/tolu360/react-native-paystack)
- [AWS Amplify Documentation](https://docs.amplify.aws)


## Installation Instructions
This project is built using the **Expo Bare Workflow**. Follow the steps below to install and run the project locally.

Ensure you have the following installed:

- **Node.js**: [Download and install Node.js](https://nodejs.org/).
- **npm** or **yarn**: You can install `yarn` globally if preferred:
  ```bash
  npm install -g yarn
- Expo CLI: Install the Expo CLI globally:
  ```bash
  npm install -g expo-cli
  ```
- Android Studio (for Android development).
- Xcode (for iOS development) - macOS only.

For detailed environment setup instructions, refer to the official 
[React Native Getting Started guide.](https://reactnative.dev/docs/set-up-your-environment)

### Getting Started
1. Clone the Repository

To clone the project to your local machine, run:

```bash
git clone https://github.com/samking4521/Apartments-Rental-App-Airbnb-Clone.git
```
2. Navigate to the project directory:
```bash
 cd [your-project-name]
```
3. Install Dependencies

Install the project dependencies using your preferred package manager:
  - Using npm:
  ```bash
  npm install
  ```
  - Using yarn:
  ```bash
  yarn install
  ```
4. Running the Project
  ```bash
  npx expo run:android
  ```
5. Starting the Metro Bundler
```bash
  npm start
  ```
## Troubleshooting

- Metro bundler not starting? Ensure you have the correct dependencies installed, and try running `npm start` in a separate terminal window.

- Build fails? Make sure that your environment is correctly configured for Android development.

## Contributions
- **iOS Compatibility**: Due to hardware limitations, building for iOS could not be completed. Contributions are welcome to resolve iOS build.

## Additional Information

### Future Improvements
- **iOS Build Support**: Contributions to resolve hardware limitations for building the iOS version are highly encouraged.
- **Extended Filtering**: Potential future extensions include filtering by user ratings, neighborhood, or more advanced amenities.

### How to Contribute
To contribute, please submit a pull request. Make sure to follow the project's code style guidelines.