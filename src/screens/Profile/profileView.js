import { useState, useEffect, useRef, useMemo } from 'react'
import {View, Text, StyleSheet, Image, TextInput, ScrollView, Pressable, Modal, FlatList, TouchableWithoutFeedback, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Keyboard} from 'react-native'
import { AntDesign, Entypo , SimpleLineIcons, Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons'
import { useSelector, useDispatch } from 'react-redux'
import { fetchDbUserSuccess, fetchDbUserFailure, fetchDbUserRequest} from '../../Redux/dbUser/dbUserActions'
import DatePicker from 'react-native-date-picker'
import * as ImagePicker from 'expo-image-picker';
import CountryPicker from 'react-native-country-picker-modal';
import BottomSheet from '@gorhom/bottom-sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import states from '../../../assets/data/states.json'
import { useNavigation } from '@react-navigation/native';
import { uploadData } from 'aws-amplify/storage';
import { DataStore } from 'aws-amplify/datastore';
import { User } from '../../models';
import { useUserAuthContext } from '../../Context/userContext';
import FastImage from 'react-native-fast-image';
import { StatusBar } from 'expo-status-bar';

// placeholder image
const placeholderProfileImage = require('../../../assets/profile_pic.png')

const ProfileView = ()=>{
    const dbUser = useSelector( state => state.user.dbUser)
    const Loading = useSelector( state => state.user.loading)
    const error = useSelector( state => state.user.error)
    const imageData = useSelector( state => state.image.imageData)
    const dispatch = useDispatch()
    const { userAuth } = useUserAuthContext() // user auth states and info from context api 
    const nameParts = dbUser? dbUser.name.split(' ') : [null, null]; // Split the user's name into first and last name, or set to [null, null] if dbUser is not defined
    const theFirstName = nameParts[0]; // Extract the first name from the split nameParts array
    const theLastName = nameParts[1]; // Extract the last name from the split nameParts array
    const [firstName, setFirstName] = useState(dbUser? theFirstName : '') // Initialize state with the first name if dbUser exists, otherwise use an empty string
    const [lastName, setLastName] = useState(dbUser? theLastName : '') // Initialize state with the last name if dbUser exists, otherwise use an empty string
    const [dob, setDOB] = useState(dbUser? dbUser.dob : 'Select date of birth') // stores user date of birth
    const [Email, setEmail] = useState(dbUser? dbUser.email : '') // stores user email
    const [Country, setCountry] = useState(dbUser? dbUser.country : 'Select country') // stores user country
    const [State, setState] = useState(dbUser? dbUser.state : 'Select state') // stores user state
    const [date, setDate] = useState(new Date()) // stores current date
    const [open, setOpen] = useState(false)  // controls visibility of the date picker component (true = visible, false = hidden) 
    const [isModalVisible, setIsModalVisible] = useState(false) // controls visibility of the country picker component (true = visible, false = hidden) 
    const [selectedCountryNameCode, setSelectedCountryNameCode] = useState(dbUser? dbUser.countryCode : null) // stores country name code
    const [selectedCountryStates, setSelectedCountryStates] = useState(null) // stores array of states from country selected
    const [isStateModalVisible, setIsStateModalVisible] = useState(false) // controls visibility of the state picker modal (true = visible, false = hidden) 
    const navigation = useNavigation() // navigation object for transition between screens
    const bottomSheetRef = useRef() // reference to the bottomsheet component
    const snapPoints = useMemo(()=> ['5%', '25%'], []) // memorised bottom sheet snap point positions
    const [bottomSheetAppear, setBottomSheetAppear] = useState(false) // controls visibility of the bottomsheet (true = visible, false = hidden) 
    const [image, setImage] = useState(imageData? imageData : null); // stores user image uri
    const [telephone, setTelephone] = useState(dbUser? dbUser.telephone : '') // stores user telephone number
    const [whatsapp, setWhatsapp] = useState(dbUser? dbUser.whatsapp : '' ) // stores user whatsapp number
    const [telephoneInputError, setTelephoneInputError] = useState(false) // controls visibility of the email telephone textInput error (true = visible, false = hidden) 
    const [whatsappInputError, setWhatsappInputError] = useState(false) // controls visibility of the whatsapp textInput error (true = visible, false = hidden) 
    const [emailInputError, setEmailInputError] = useState(false)  // controls visibility of the email textInput error (true = visible, false = hidden) 
    const [nameInputError, setNameInputError] = useState(false)  // controls visibility of the firstname textInput error (true = visible, false = hidden) 
    const [lastNameInputError, setLastNameInputError] = useState(false) // controls visibility of the lastname textInput error (true = visible, false = hidden) 
    const [dateInputError, setDateInputError] = useState(false)  // controls visibility of the date textInput error (true = visible, false = hidden) 
    const [ethnicityInputError, setEthnicityInputError] = useState(false)  // controls visibility of the ethnicity textInput error (true = visible, false = hidden) 
    const [ethnicity, setEthnicity] = useState(dbUser? dbUser.ethnicity : '') // stores user ethnicity
    // const [Loading, setLoading] = useState(false) // controls the value of the save changes button (true = loading..., false = save changes) 
    const [saveChanges, setSaveChanges] = useState(false) // controls visibility of the save changes button (true = visible, false = hidden) 
    const [disabled, setDisabled] = useState(true) // Controls whether the save changes button is pressable or not (true = not pressable, color : gray, false = pressable, color: red)
    const [callingCode, setCallingCode] = useState(dbUser? dbUser.callingCode : ''); // stores the country calling code
    const [disableProfileText, setDisableProfileText] = useState(dbUser? true : false) // Controls whether the form fields are editable or not (true = not editable, false = editable)
    const [successAlert, setSuccessAlert] = useState(false) // controls visibility of the profile upload success alert (true = visible, false = hidden) 
    const [createText, setCreateText] = useState(false) //controls the value of the profile upload success text (create = 'created', update='updated', false='hidden') 
    const [errorUploadAlert, setErrorUploadAlert] = useState(false) // controls visibility of the profile upload error alert (create = 'Error Creating Profile', update='Error Updating profile' null = hidden) 
    const [deleteImgAlert, setDeleteImgAlert] = useState(false) // controls visibility of the image required alert (true = visible, false = hidden) 
    
   
        /*
             * Calls the formatDate function when the component mounts.
             * The empty dependency array ensures this effect runs only once after the initial render.
        */
       
    /**
         * Formats the current date and time as a string in the local format.
         * 
         * @returns {string} The current date and time formatted as a locale-specific string.
    */
    const formatDate = ()=>{
        // Create a new Date object representing the current date and time
        const currentDate = new Date()
        const dateCreatedAt = currentDate.toLocaleString('en-US', {
          hour12: true})
        // Return the formatted date and time string
        return dateCreatedAt
     }



   //Checks if the email input is valid by ensuring it contains an '@' symbol, a '.' symbol, and does not contain any spaces.
   const checkEmailInput = ()=>{
    // Check if the email is invalid: missing '@', missing '.', or contains spaces
    if ((Email.includes('@') == false || Email.includes('.com') == false || Email.includes(' ') == true ) && Email.length!=0){
        // Set the email input error state to true if the email is invalid
        setEmailInputError(true)
    }
  }

   // Validates the firstname input to ensure it contains at least one character
   const validateFirstNameInput = ()=>{
    if(firstName.length == 0){
         // Set the firstname input error state to true if the name is invalid
        setNameInputError(true)
      }
   }


   // Validates the lastname input to ensure it contains at least one character
   const validateLastNameInput = ()=>{
    if(lastName.length == 0){
         // Set the lastname input error state to true if the name is invalid
        setLastNameInputError(true)
      }
   }


    // Checks if the telephone input is empty. If the input is empty, it sets an error state.
   const checkTelephoneInput = ()=>{
    // Check if the telephone input is empty
    if(telephone.length == 0){
        // Set the telephone input error state to true if the input is empty
        setTelephoneInputError(true)
    }
  }

    // Checks if the whatsapp input is empty. If the input is empty, it sets an error state.
  const checkWhatsappInput = ()=>{
    if(whatsapp.length == 0){
        setWhatsappInputError(true)
    }
  }

       // Checks if the ethnicity input is empty. If the input is empty, it sets an error state.
   const validateEthnicityInput = ()=>{
    if(ethnicity.length==0){
        setEthnicityInputError(true)
      }
   }


   /**
         * Handles changes to the ethnicity input. If the input length is at least 1 character,
         * it clears the ethnicity input error and sets the save changes state to true. 
         * Then, updates the ethnicity state with the new value.
         * 
         * @param {string} val - The new value for the ethnicity input.
 */
  const setEthnicityChange = (val)=>{
     // Check if the new value length is at least 1 character
    if(val.length>=1){
          // Clear the ethnicity input error
        setEthnicityInputError(false)
         // Set the save changes state to true
        setSaveChanges(true)
      }
       // Update the ethnicity state with the new value
      setEthnicity(val)
  }


  /**
         * Validates the date of birth to ensure the age is at least 18 years old.
         * 
         * @param {Date} date - The date of birth to be validated.
         * 
         * Checks the difference between the current year and the year of the provided date.
         * If the difference is 18 or more, it clears the date input error. Otherwise, it sets the error state.
 */
   const ValidateDOB = (date)=>{
    // Get the current date
     const currentDate = new Date()
     // Calculate the age based on the year difference
      const dateConfirm = currentDate.getFullYear() - date.getFullYear()
      console.log(dateConfirm)
      // Check if the calculated age is 18 or older
      if (dateConfirm >=18 ){
         // Clear the date input error if age is valid
        setDateInputError(false)
       
      }
      else {
         // Set the date input error if age is invalid
        setDateInputError(true)
      }

   }

   /**
 * Checks if all form fields are valid and sets the form's disabled state accordingly.
 * 
 * The function validates various fields including email, name, date of birth, country, state,
 * and other inputs. It also checks for specific conditions like the absence of errors and the presence
 * of required information. If all conditions are met, it enables the form by setting the disabled state to false;
 * otherwise, it disables the form by setting the disabled state to true.
 */
const checkAllFormFields = () => {
  
    // Check if all form fields meet the required conditions
    if (
      // Email should contain '@' and '.', and should not contain spaces
      (Email.includes('@') === true && Email.includes('.com') === true && Email.includes(' ') === false) &&
      // firstName is entered
      firstName.length >= 1 &&
      // lastName is entered
      lastName.length>=1 &&
      // Date of birth should be selected
      dob !== 'Select Date Of Birth' &&
      // Country should be selected
      Country !== 'Select country' &&
      // State should be selected
      State !== 'Select state' &&
      // Input error states should all be false
      emailInputError !== true &&
      dateInputError !== true &&
      nameInputError !== true &&
      // Image should be provided
      image !== null &&
      // Ethnicity should not be empty
      ethnicity.length !== 0 &&
      // Telephone number should be provided
      telephone?.length >=1 &&
      // WhatsApp number should be provided
      whatsapp?.length >=1 &&
      // Calling code should be provided
      callingCode &&
      // Country code
      selectedCountryNameCode
    ) {
      // Enable the form if all conditions are met
      setDisabled(false);
    } else {
      // Disable the form if any condition is not met
      setDisabled(true);
    }
  };
  
 // Handles all form data validation checks
   useEffect(()=>{
    /**
         * Calls the checkAllFormFields function whenever any of the specified dependencies change.
         * 
         * Dependencies:
         * - name
         * - Email
         * - dob
         * - Country
         * - State
         * - emailInputError
         * - dateInputError
         * - nameInputError
         * - image
         * - ethnicity
         * - telephone
         * - whatsapp
         * - callingCode
         * - selectedCountryNameCode
         * The effect ensures that the form validation is re-evaluated whenever any of the specified
         * dependencies are updated.
   */
    checkAllFormFields()
   }, [firstName, lastName, Email, dob, Country, State, emailInputError, dateInputError, nameInputError, image, ethnicity, telephone, whatsapp, callingCode, selectedCountryNameCode ])


   
  /**
         * Uploads a profile picture to aws storage service and updates user data based on the operation mode.
         * 
         * @param {string} img - The URL or path of the image to be uploaded.
         * @param {string} userId - The unique identifier(id) of the user.
         * @param {object} UserData - The user data object to be updated after the upload.
         * @param {string} mode - The operation mode ('create' or 'update'), determining the action to be performed.
         * 
         * The function fetches the image, converts it to a blob, and uploads it to the specified path in the storage.
         * It then calls `updateUserData` to update the user data.
         *  In case of any errors during the process, the error is logged to the console.
 */
const uploadProfilePicture = async (img, userId, UserData, mode) => {
    try {
      // Fetch the image and convert it to a blob
      const getRealImg = await fetch(img);
      const theBlob = await getRealImg.blob();
      console.log('The Blob', theBlob);
      // Upload the image blob to the storage
      const result = await uploadData({
        key: `userprofilePicture/${userId}/userPhoto.jpeg`,
        data: theBlob,
        options: {
          accessLevel: 'guest', // Default access level, can be 'private' | 'protected' | 'guest'
          contentType: theBlob.type // MIME type of the blob
        }
      }).result;
  
      // Log the result of the upload
      console.log('Succeeded: ', result);
  
      // Update the user data after successful upload
      updateUserData(UserData, mode);
  
    } catch(error) {
      // Log any errors that occur during the process
      console.log('Error: ', error);
      console.error('Error saving user:', e, e.stack);
      // update UI state after unsuccessful upload
      if(mode == 'create'){
        dispatch(fetchDbUserFailure('create'))
        setSaveChanges(true)
        setDisableProfileText(false)
      }else{
        dispatch(fetchDbUserFailure('update'))
        setSaveChanges(true)
        setDisableProfileText(false)
      }
    }
  };
  
  
   /**
         * Updates the user data in the backend database via DataStore and handles post-update actions based on the mode.
         * 
         * @param {object} UserData - The user data object containing user details to be updated.
         * @param {string} mode - The operation mode ('create' or 'update), determining additional actions after the update.
         * 
         * The function queries the DataStore to find the user by their `sub` identifier, updates the user data with the new profile picture key, and then saves the updated data back to the DataStore. Depending on the mode 
        
 */
    const updateUserData = async (UserData, mode)=>{
        try{
              // Query DataStore to find the user based on the `sub` identifier
              const theUserArr = await DataStore.query(User, (u)=> u.sub.eq(UserData.sub))
              console.log('Final Update User : ', theUserArr[0])
              
              // Save the updated user data to DataStore with the new profile picture key
              const updatedUserData = await DataStore.save(
                  User.copyOf(theUserArr[0], (updated)=>{
                      updated.key = `userprofilePicture/${theUserArr[0].id}/userPhoto.jpeg`
                  })
              )
              console.log('Updated User Data : ', updatedUserData)
              // Update the state with the new user data
             
               // If the mode is 'create', get the profile picture URL after saving the data
              if(mode == 'create'){
                   // Update UI state after successful operation
                  dispatch(fetchDbUserSuccess(updatedUserData))
                  setSaveChanges(false)
                  setDisableProfileText(true)
                  setCreateText(true)
                  setSuccessAlert(true)
              }         
              else{
                 dispatch(fetchDbUserSuccess(updatedUserData))
                  setSaveChanges(false)
                  setDisableProfileText(true)
                  setCreateText(true)
                  setSuccessAlert(true)
                  setCreateText(false)
                  setSuccessAlert(true)
              }
            
        }catch(err){
            // Log any errors that occur during the update process
            console.log('Error : ', err.message)
             // Update UI state after unsuccessful operation
             if(mode == 'create'){
               dispatch(fetchDbUserFailure('create'))
               setSaveChanges(true)
               setDisableProfileText(false)
             }else{
               dispatch(fetchDbUserFailure('update'))
               setSaveChanges(true)
               setDisableProfileText(false)
             }
            
        }
       
     }
   
     // Handles user name update
    const setFirstNameChange = (text)=>{
        // checks if firstname is >= 1
      if(text.length >= 1){
         // Clear the firstname input error if the format is valid
        setNameInputError(false)
        // Enable the save changes state if there's at least one character
        setSaveChanges(true)
      }
     
       // Update the name state with the new text
        setFirstName(text)
    }

     // Handles last name update
     const setLastNameChange = (text)=>{
         // checks if lastname is >= 1
      if(text.length >= 1){
        // Clear the lastname input error if the format is valid
       setLastNameInputError(false)
       // Enable the save changes state if there's at least one character
       setSaveChanges(true)
     }
    
      // Update the name state with the new text
       setLastName(text)
    }

// Handles user email update
    const setEmailChange = (email)=>{
        // Check if the email contains both '@' and '.' characters
        if ((email.includes('@') == true && email.includes('.com') == true)){
            // Clear the email input error if the format is valid
            setEmailInputError(false)
        }
        // Enable the save changes state if there's at least one character
        if(email.length>=1){
            setSaveChanges(true)
          }
        // Update the email state with the new email
        setEmail(email)
    }

    // Handles user telephone number update
    const setTelephoneChange = (tel)=>{
         // Check if the telephone number has at least one character
        if(tel.length >= 1){
            // Clear the telephone input error if the input is valid
              setTelephoneInputError(false)
        }else{
              // Enable the save changes state if the input is empty
          setSaveChanges(true)
        }
        // Update the telephone state with the new number
        setTelephone(tel)
      }
  
      // Handles user whatsapp telephone number update
      const setWhatsappChange = (tel)=>{
         // Check if the WhatsApp number has at least one character
          if(tel.length >= 1 ){
            // Clear the WhatsApp input error if the input is valid
                setWhatsappInputError(false)
          }else{
            // Enable the save changes state if the input is empty
            setSaveChanges(true)
          }
           // Update the WhatsApp state with the new number
          setWhatsapp(tel)
        }
      
   
      useEffect(()=>{
        // Check if the selected country code is available
           if(!selectedCountryNameCode){
            return // Exit if no country code is selected
           }
            // Filter the states based on the selected country code
           const country_states = states.filter((stat)=>{
            return(
               stat.country_code == selectedCountryNameCode
            )
            })
            console.log('c : ', country_states)
            // If there are no states available for the selected country
            if (country_states?.length == 0) {
                setState('No states') // Set the state prompt to "No states"
              }
        // Update the state with the filtered states for the selected country  
        setSelectedCountryStates(country_states)
      }, [selectedCountryNameCode])

     

      // Toggles the visibility of the bottom sheet.
    const openBottomSheet = ()=>{
        Keyboard.dismiss()
        // Check if profile text is disabled; if true, do nothing
        if (disableProfileText){
            return // Exit the function early if profile text is disabled
        }
         // Toggle the visibility of the bottom sheet
        setBottomSheetAppear(!bottomSheetAppear)
    }

    /**
         * Opens the image picker to select an image from the gallery or capture a new photo using the camera.
         * 
         * @param {string} mode - The mode to determine whether to open the gallery or camera. It can be either 'Gallery' or 'Camera'.
         * 
         * - If the mode is 'Gallery', the function launches the image library for the user to select an image.
         * - If the mode is 'Camera', the function launches the camera to capture a new image.
         * 
         * The function handles errors and updates state based on the result of the image selection or capture.
 */
    const pickImage = async (mode) => {
        // Check if the mode is 'Gallery' to open the image library
        if (mode == 'Gallery'){
            try{
                 // Launch the image library
                        let result = await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            allowsEditing: true,
                            aspect: [1, 1],
                            quality: 1.0
                        });
                    
                        console.log(result);
                       // Check if the user selected an image
                        if (!result.canceled) {
                             // Update state with the selected image URI and trigger save changes
                            setImage(result.assets[0].uri);
                            setSaveChanges(true)
                            // Toggle the bottom sheet visibility
                            setBottomSheetAppear(!bottomSheetAppear)
                           
                        }
                    }
                    catch(error){
                        // Alerts any error that occur during image selection
                        alert(error.message)
                    }
                
        }
        else {
             // If the mode is 'Camera', open the camera
            try{
                 // Request camera permissions
                await ImagePicker.requestCameraPermissionsAsync()
                // Launch the camera
                let result = await ImagePicker.launchCameraAsync({
                    cameraType: ImagePicker.CameraType.front,
                    allowsEditing: true,
                    aspect : [1, 1],
                    quality : 1,
                  
                })
                console.log(result);
                     // Check if the user captured an image
                      if (!result.canceled) {
                         // Update state with the captured image URI and trigger save changes
                        setImage(result.assets[0].uri);
                        setSaveChanges(true)
                         // Toggle the bottom sheet visibility
                        setBottomSheetAppear(!bottomSheetAppear)
                      }
              }
              catch(error){
                 // Alerts any error that occur during image capture
                  alert(error.message)
              }       
        }
      };

      /**
             * Handles the deletion of the selected image.
             * 
             * If a database user (`dbUser`) is present, the function displays an alert informing that the image is a required field.
             * If no `dbUser` is present, the function clears the selected image by setting the image state to `null`.
 */
      const deleteImage = ()=>{
            // Check if a database user is present
            if(dbUser){
                 // Show alert that image is a required field
                  setDeleteImgAlert(true)
                  // Toggle the bottom sheet visibility
                  setBottomSheetAppear(!bottomSheetAppear)
                }
            else {
                    // If no database user is present, clear the selected image
                    setImage(null)
                     // Toggle the bottom sheet visibility
                    setBottomSheetAppear(!bottomSheetAppear)
            }
      }
     
      // Close the bottom sheet if opened
      const handleCloseBottomSheet = ()=>{
        setBottomSheetAppear(false)
      }


      /**
             * Handles the upload of user data based on the presence of a database user (`dbUser`).
             * 
             * - If a `dbUser` exists, it updates the existing user data by calling `updateUser()`.
             * - If no `dbUser` is present, it creates new user data by calling `createUser()`.
             * 
             * Any errors encountered during the upload process are caught and logged to the console.
      */
      const uploadUserData = async ()=>{
        try{
            // Check if a database user exists
            if (dbUser){
                 // Update existing user data
                await updateUser()
            }
           else { 
             // Create new user data
            await createUser()
        }
        }
       catch(err){
            // Log any errors that occur during the upload process
            console.log('Error: ', err.message)
       }
      }

      /**
         * Creates a new user and uploads their profile picture.
         * 
         * This function performs the following steps:
         * 1. Saves a new user record in the DataStore with the provided user details.
         * 2. Logs the created user data to the console.
         * 3. Calls `uploadProfilePicture` to upload the user's profile picture.
         * 
         * Any errors encountered during the process are logged to the console.
    */

     
      const createUser = async ()=>{
       try { 
         // Save a new user record in the backend database via DataStore
         const UserData = await DataStore.save(new User({
            name : `${firstName} ${lastName}`,
            email : Email,
            telephone: telephone,
            whatsapp: whatsapp,
            callingCode: callingCode,
            countryCode: selectedCountryNameCode,
            dob: dob,
            country: Country,
            state: State,
            date: formatDate(), // Get the current date formatted as a string
            ethnicity: ethnicity,
            sub: userAuth // User authentication ID
        }))
        console.log('UserData : ', UserData)
        // Upload the user's profile picture
        uploadProfilePicture(image, UserData.id, UserData, 'create')
    }catch(e){
        // Log any errors that occur during user creation
        console.log('Error : ', e.message)
    }
      }


      /**
 * Updates an existing user record in the DataStore and uploads their profile picture.
 * 
 * This function performs the following steps:
 * 1. Retrieves the current user record from the database via datastore using the `userAuth` identifier.
 * 2. Updates the user record with new details and saves it to the backend database via datastore.
 * 3. Calls `uploadProfilePicture` to upload the user's profile picture.
 * 
 * Any errors encountered during the process are logged to the console.
 */
      const updateUser = async ()=>{
       try { 
         // Query the backend database via DataStore for the user with the specified authentication ID
         const theUserArr = await DataStore.query(User, (u)=> u.sub.eq(userAuth))
         console.log('My User : ', theUserArr[0])
 
         // Get the user from the query result
         const theUser = theUserArr[0]
 
         // Update the user record with new data
         const updateddUserData = await DataStore.save( 
             User.copyOf( theUser, (updated)=>{
                 updated.name =  `${firstName} ${lastName}`,
                 updated.email  = Email,
                 updated.telephone  = telephone,
                 updated.whatsapp  = whatsapp,
                 updated.callingCode  = callingCode,
                 updated.countryCode = selectedCountryNameCode,
                 updated.dob = dob,
                 updated.country = Country,
                 updated.state = State,
                 updated.ethnicity = ethnicity,
                 updated.sub = userAuth
         }))
         console.log('updatedUserData : ', updateddUserData)
         // Upload the user's profile picture
         uploadProfilePicture(image, updateddUserData.id, updateddUserData, 'update')
    }catch(e){
        // Log any error that occur during the update process
        console.log(e.message)
    }
      }

      // Handles user profile data upload to the database if save changes button is not disabled
       const uploadUserProfileData = ()=>{
         //dismisses Keyboard
         Keyboard.dismiss()
       try{
             // Check if the save changes button is not disabled
             if (!disabled){
                // Upload the user data
                  dispatch(fetchDbUserRequest())
                   uploadUserData()
                   
              }
           // Exit immediately if the save changes button is disabled
              return
       }catch(e){
          console.log('error uploading profile data : ', e)
       }
        
       }
       
       // Handles opening of the date picker component
       const openDatePicker = ()=>{
        // if form field is not editable 
        if (disableProfileText){
          // exits 
           return
        }
        // if form field is editable - open date picker
        setOpen(true)
       }

       // Handles opening the country picker component
       const openCountryPicker = ()=>{
        // if form field is not editable 
        if (disableProfileText){
          // exits
           return
        }
        // if form field is editable - open country picker
        setIsModalVisible(true)
       }
       // Handles opening the state picker modal
       const openStatePicker = ()=>{
         // if form field is not editable 
        if (disableProfileText){
          // exits
           return
        }
        // if form field is editable - open state picker modal
        setIsStateModalVisible(true)
       }
    
       if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        const originalWarn = console.error;
        // eslint-disable-next-line no-console
        console.error = (...args) => {
          if (
            args[0].includes(
              "Support for defaultProps will be removed from function components in a future major release.",
            )
          ) {
            return;
          }
          originalWarn(...args);
        };
      }

    return(
        <GestureHandlerRootView style={styles.container}>
         <StatusBar style="dark" backgroundColor="white" />
        <KeyboardAvoidingView behavior='padding' style={{flex:1}}>
         <View style={styles.profileContainer}>
           <AntDesign name="left" size={24} color="black" onPress={()=>{navigation.goBack()}}/>
           <Text style={styles.profileLabelText}>Profile</Text>     
           <TouchableOpacity onPress={()=>{setDisableProfileText(false)}}>
                    <Feather  name="edit" size={24} color="black" />
            </TouchableOpacity>  
            
           </View> 
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always' contentContainerStyle={{flexGrow: 1}}>
                <View  style={styles.scrollViewContainer}>
           <View style={styles.imageContainer}>

              <View style={{...styles.userImageCont, borderColor:disableProfileText? '#4C4C4C' : '#FF0000'}}>  
                     {image? <FastImage source={{uri : image}} style={styles.image} resizeMode={FastImage.resizeMode.cover}/> : <FastImage source={placeholderProfileImage} style={styles.image} resizeMode={FastImage.resizeMode.cover}/>}
            </View>
            <Entypo name="camera" size={30} color={disableProfileText? "#4C4C4C" : "#FF0000"} style={{right: 50, top: 175}} onPress={openBottomSheet}/>
         </View>
            <View style={{marginVertical: 20}}>
                <View style={styles.userNameContainer}>
                <View style={styles.nameContainer}>
                    <Text style={styles.label}>Firstname</Text>
                    <TextInput editable={disableProfileText? false : true} style={{...styles.txtInput, color: disableProfileText? '#4C4C4C' : 'black'}}  onBlur={validateFirstNameInput}  value={firstName} onChangeText={setFirstNameChange} placeholder='firstname' autoCapitalize='words' autoCorrect={false}/>
                    {nameInputError? <Text style={styles.errorText}>Firstname required!</Text> : <Text style={styles.errorText}></Text>}
                </View>
                <View style={styles.nameContainer}>
                    <Text style={styles.label}>Lastname</Text>
                    <TextInput editable={disableProfileText? false : true} style={{...styles.txtInput, color: disableProfileText? '#4C4C4C' : 'black'}}  onBlur={validateLastNameInput}  value={lastName} onChangeText={setLastNameChange} placeholder='lastname' autoCapitalize='words' autoCorrect={false}/>
                    {lastNameInputError? <Text style={styles.errorText}>Lastname required!</Text> :  <Text style={styles.errorText}></Text>}
                </View>
                </View>
                <View style={{marginBottom: 15}}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput editable={disableProfileText? false : true} keyboardType='email-address' style={{...styles.txtInput, color: disableProfileText? '#4C4C4C' : 'black'}}  onBlur={checkEmailInput}  value={Email} onChangeText={setEmailChange} placeholder='email' autoCorrect={false}/>
                    {emailInputError && <Text style={styles.errorText}>Invalid Email Address, Include '@' and '.com'</Text>}
                </View>
               <View style={styles.telephoneContainer}>
                       <View style={{width: '45%'}}>
                            <Text style={styles.label}>Telephone</Text>
                            <TextInput editable={disableProfileText? false : true} style={{...styles.txtInput, color: disableProfileText? '#4C4C4C' : 'black'}} keyboardType='numeric'  onBlur={checkTelephoneInput}  value={telephone} onChangeText={setTelephoneChange} placeholder='phone'/>
                            {telephoneInputError? <Text style={styles.errorText}>Telephone required!</Text> : <Text style={styles.errorText}></Text>}
                        </View>
                        <View style={{width: '45%'}}>
                            <Text style={styles.label}>Whatsapp</Text>
                            <TextInput editable={disableProfileText? false : true} style={{...styles.txtInput, color:  disableProfileText? '#4C4C4C' : 'black'}} keyboardType='numeric' onBlur={checkWhatsappInput}  value={whatsapp} onChangeText={setWhatsappChange} placeholder='whatsapp'/>
                            {whatsappInputError? <Text style={styles.errorText}>Whatsapp required!</Text> : <Text style={styles.errorText}></Text>}
                        </View>
               </View>
              
                <View style={{marginBottom: 15}}>
                    <Text style={styles.label}>Date Of Birth</Text>
                    <Pressable onPress={openDatePicker} style={styles.vwTxtInput}>
                         <Text style={{color: disableProfileText? '#4C4C4C' : 'black', ...styles.dobText}}>{dob}</Text>
                        <SimpleLineIcons name="arrow-down" size={18} color="#4C4C4C" />
                        <DatePicker
                                modal
                                title='Select date of birth'
                                confirmText='PICK DATE'
                                cancelText='CANCEL'
                                mode={'date'}
                                open={open}
                                date={date}
                                onConfirm={(date) => {
                                setOpen(false)
                                setDate(date)
                                setDOB(`${date.getDate()} / ${date.getMonth()>=9? date.getMonth()+ 1 : '0'+(date.getMonth()+1)} / ${date.getFullYear()}`)
                                ValidateDOB(date)
                                setSaveChanges(true)
                                }}
                                onCancel={() => {
                                setOpen(false)
                                }}
                            />
                    </Pressable>  
                    {dateInputError && <Text style={styles.errorText}>User must be over 18 years of age</Text>}  
                </View>
                <Pressable style={{marginBottom: 15}} onPress={openCountryPicker}>
                    <Text style={styles.label}>Country/Region</Text>
                    <View style={styles.vwTxtInput}>
                       
                         <CountryPicker
                                onSelect={(country) => {
                                // Handle country selection
                                console.log(country)
                                setIsModalVisible(false);
                                setCountry(country.name)
                                setSelectedCountryNameCode(country.cca2)
                                setCallingCode(country.callingCode[0])
                                setSaveChanges(true)
                                
                                // Close the modal after selection if needed
                                }}
                                withCallingCode
                                withFlag
                                withFilter
                                withModal
                                visible={isModalVisible}
                                onClose={()=>{setIsModalVisible(false)}} // Close modal on outside press or close button
                                placeholder={<Text style={{ color :  disableProfileText? '#4C4C4C' : 'black', fontSize: 14 }} onPress={openCountryPicker}>{Country}</Text>}
                                closeButtonImageStyle={styles.closeImageBtn}
                         />
                        <SimpleLineIcons name="arrow-down" size={18} color="#4C4C4C"/>
                    </View>

                </Pressable>
                <Pressable onPress={openStatePicker} style={{marginBottom: 15}}>
                    <Text style={styles.label}>State Of Origin</Text>
                    <View style={styles.vwTxtInput}>
                         <Text style={{color: disableProfileText? '#4C4C4C' : 'black', ...styles.dobText}}>{State}</Text>
                        <SimpleLineIcons name="arrow-down" size={18} color="#4C4C4C"/>
                     </View>
                     <Modal visible={isStateModalVisible} presentationStyle='overFullScreen' onRequestClose={()=>{setIsStateModalVisible(false)}}>
                       <View style={{flex: 1}}>
                        <View style={styles.statesContainer}>
                        <AntDesign name="close" size={24} color="black" onPress={()=>{setIsStateModalVisible(false)}} style={{marginRight: 20}}/>
                        <Text style={styles.stateText}>States</Text>
                        </View>
                        {selectedCountryStates? <FlatList data={selectedCountryStates.length !== 0? selectedCountryStates : ['Selected Country has no states']} showsVerticalScrollIndicator={false} contentContainerStyle={{flex: selectedCountryStates.length== 0? 1 : null, justifyContent : selectedCountryStates.length== 0? 'center': null, alignItems: selectedCountryStates.length == 0? 'center' : null }} renderItem={({item})=>{       
                                    return(
                                    <Pressable onPress={()=>{
                                        if(item == 'Selected Country has no states'){
                                              return null
                                    }
                                    else {
                                        setState(item.name); 
                                        setIsStateModalVisible(false)
                                    }
                                    }} key={item == 'Selected Country has no states'? 1 : item.id} style={{padding: 20, borderBottomWidth: item == 'Selected Country has no states'? 0 : 1, borderBottomColor: item == 'Selected Country has no states'? null : 'lightgray'}}>
                                   
                                        <Text style={{fontSize: 16, color: item == 'Selected Country has no states'? 'red' : null}}>{item == 'Selected Country has no states'? item : item.name}</Text>
                                    </Pressable>
                                    )
                                }}/> : <View style={styles.emptyCountryModal}>
                                      <Text style={styles.emptyCountryModalText}>Select Country First</Text>
                                    </View>}
                        
                       </View>
                     </Modal>
                </Pressable>
                <View>
                    <Text style={styles.label}>Ethnicity</Text>
                    <TextInput editable={disableProfileText? false : true} style={{...styles.txtInput, color: disableProfileText? '#4C4C4C' : 'black'}}  onBlur={validateEthnicityInput}  value={ethnicity} onChangeText={setEthnicityChange} placeholder="what's ur ethnicity e.g British" autoCapitalize='words' autoCorrect={false}/>
                    {ethnicityInputError && <Text style={styles.errorText}>Ethnicity is Required!</Text>}
                </View>
            </View>
            </View>
            </ScrollView>
            {saveChanges && <TouchableOpacity onPress={uploadUserProfileData}
                 style={{backgroundColor : disabled? 'rgba(0,0,0,0.5)': '#8B0000', ...styles.saveChangesBtn}}>
                     <Text style={styles.saveChangesText}>Save Changes</Text>
            </TouchableOpacity>}

            

               {bottomSheetAppear && <TouchableWithoutFeedback onPress={handleCloseBottomSheet}>
                                            <View style={{...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.5)"}} />
                                 </TouchableWithoutFeedback>
            }
           
           {bottomSheetAppear  && <BottomSheet enablePanDownToClose={true} onClose={()=>{setBottomSheetAppear(!bottomSheetAppear)}} ref={bottomSheetRef} index={1} snapPoints={snapPoints} style={{paddingHorizontal: 20}}>
           <StatusBar style="light" backgroundColor="rgba(0,0,0,0.5)" />
            <View style={styles.bottomSheetContainer}>
                <View style={styles.profilePhotoLabel}>
                    <Text style={styles.profilePhotoText}>Profile Photo</Text>
                    <AntDesign name="delete" size={24} color="black" onPress={deleteImage}/>
                </View>
         <View style={styles.profilePhotoOptionsContainer}>
            <Pressable onPress={()=>{pickImage('Camera')}} style={{alignItems:'center'}}>
                <View style={styles.profilePhotoOptionType}>
                <Entypo name="camera" size={30} color="#FF0000"/>
                </View>
               
                <Text style={styles.profilePhotoOptionText}>Camera</Text>
            </Pressable>
            <Pressable onPress={()=>{pickImage('Gallery')}} style={{alignItems:'center'}}>
                <View style={styles.profilePhotoOptionType}>
                <FontAwesome name="photo" size={30} color="#FF0000" />
                </View>
               
                <Text style={styles.profilePhotoOptionText}>Gallery</Text>
            </Pressable>
        </View>
        </View>
            </BottomSheet>}
            <Modal visible={Loading} onRequestClose={()=>{}} presentationStyle='overFullScreen' transparent={true}>
                    <StatusBar style="light" backgroundColor="rgba(0,0,0,0.5)" />
                    <View style={{ flex: 1, ...styles.loadingCont}}>
                        <View style={styles.alignCont}>
                        <View style={styles.loadingImgCont}>
                            <Image source={require('../../../assets/loadingGif.gif')} style={styles.loadingImage}/>
                        </View>
                        <Text style={styles.loadingText}>Uploading profile...</Text>
                        </View>
                </View>
            </Modal>
            <Modal visible={successAlert} onRequestClose={()=>{setSuccessAlert(false); navigation.goBack()}} presentationStyle='overFullScreen' transparent={true}>
                    <StatusBar style='light' backgroundColor="rgba(0,0,0,0.5)" />
                    <View style={{ flex: 1, ...styles.userProfileAlertContainer}}>
                            <View style={styles.userProfileSuccessAlert}>
                                    <Entypo name="upload-to-cloud" size={60} color="rgba(0,0,0,0.5)" /> 
                                    <Text style={styles.successText}>Success</Text>
                                    <Text style={styles.profileSuccessText}>Your profile was {createText? 'created' : 'updated'} successfully</Text>
                                    <Pressable onPress={()=>{ setSuccessAlert(false); navigation.goBack()}} style={{backgroundColor: 'black', ...styles.closeProfileAlert}}>
                                        <Text style={styles.closeAlertText}>OK</Text>
                                    </Pressable>
                                </View>
                    </View>
             </Modal>
             <Modal visible={error !== false? true : false} onRequestClose={()=>{dispatch(fetchDbUserFailure(false))}} presentationStyle='overFullScreen' transparent={true}>
                <StatusBar style="light" backgroundColor="rgba(0,0,0,0.5)" />
                <View style={{ flex: 1, ...styles.userProfileAlertContainer}}>
                        <View style={styles.userProfileSuccessAlert}>
                                <MaterialIcons name="error" size={40} color="red" style={{marginBottom: 10}}/>
                                <Text style={{color:"red", ...styles.errorAlertLabel}}>{error == 'create'? 'Error Creating Profile' : 'Error Updating Profile'}</Text>
                                <Text style={styles.errorAlertDescText}>An unknown error occured! Please check your internet connection and try again</Text>
                                <Pressable onPress={()=>{dispatch(fetchDbUserFailure(false))}} style={{backgroundColor: 'black', ...styles.closeProfileAlert}}>
                                    <Text style={styles.closeAlertText}>OK</Text>
                                </Pressable>
                            </View>
                </View>
             </Modal>
             
             <Modal visible={deleteImgAlert} onRequestClose={()=>{setDeleteImgAlert(false)}} presentationStyle='overFullScreen' transparent={true}>
             <StatusBar style="light" backgroundColor="rgba(0,0,0,0.5)" />
                <View style={{ flex: 1, ...styles.userProfileAlertContainer}}>
                        <View style={{marginHorizontal: 30, ...styles.userProfileSuccessAlert}}>
                                <AntDesign name="exclamationcircleo" size={40} color="#B8860B" style={{marginBottom: 10}}/>
                                <Text style={{color:"#B8860B", ...styles.errorAlertLabel}}>Image is a required field</Text>
                                <Text style={styles.errorAlertDescText}>Having a profile image help build trust and increase your chances of successful connections in the app.</Text>
                                <Pressable onPress={()=>{setDeleteImgAlert(false)}} style={{backgroundColor: 'black', ...styles.closeProfileAlert}}>
                                    <Text style={styles.closeAlertText}>OK</Text>
                                </Pressable>
                            </View>
                </View>
             </Modal>
           </KeyboardAvoidingView>
        </GestureHandlerRootView>
    )
}

export default ProfileView

const styles = StyleSheet.create({
    container : {
        flex: 1,
         backgroundColor:'white'
    },
    scrollViewContainer : {
        flex: 1, 
        paddingHorizontal: 20, 
        paddingTop: 20
    },
    label : {
        fontWeight: '600', 
        fontSize: 15,
        letterSpacing: 0.5,
        marginBottom: 5,
        color:'#4C4C4C'
    },
    txtInput : {
        padding: 5,
        borderBottomWidth: 1,
         borderRadius: 5,
         borderColor: '#4C4C4C',
         fontWeight:'400',
         fontSize: 14
    },
    vwTxtInput : {
        borderBottomWidth: 1,
        padding: 10,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        borderRadius: 5,
        borderColor: '#4C4C4C',
      
    }, 
    profileContainer: {
        flexDirection:'row', 
        alignItems: 'center', 
        justifyContent:'space-between', 
        paddingHorizontal: 20, 
        paddingVertical: 10
    },
    profileLabelText: {
        fontSize: 20, 
        fontWeight:'600', 
        letterSpacing: 0.5, 
        color:'black'
    },
    imageContainer: {
        flexDirection:'row',
         justifyContent:'center',
          width: '100%',
           height: 200
    },
    userImageCont: {
        width: 207, 
        height: 207, 
        borderWidth: 2, 
        justifyContent:'center', 
        alignItems:'center', 
        borderRadius: 207,  
        marginLeft : 25
    },
    image: {
        width : 200, 
        height: 200, 
        borderRadius: 200, 
        resizeMode:'cover'
    },
    userNameContainer: {
        flexDirection:"row",
         alignItems:'center',
          justifyContent:'space-between'
    },
    nameContainer: {
        marginBottom: 15,
         width: '45%'
    },
    errorText: {
        color: 'red', 
        fontSize: 14, 
        fontWeight: '400'
    },
    dobText: {
        fontSize: 14, 
        fontWeight: '400'
    },
    telephoneContainer : {
        flexDirection:'row', 
        alignItems:'center', 
        marginBottom: 15, 
        justifyContent:'space-between'
    },
    closeImageBtn: {
        width: 20, 
        height: 20
    }, 
    stateText: {
        fontSize: 20,
         fontWeight: '600'
    },
    statesContainer: {
        flexDirection: 'row', 
        alignItems: "center", 
        padding: 20
    },
    emptyCountryModal: {
        flex: 1,
         alignItems: 'center',
          justifyContent:'center'
    },
    emptyCountryModalText: {
        color: 'red', 
        fontSize: 16, 
        fontWeight:'600', 
        letterSpacing:0.5
    },
    saveChangesBtn: {
      padding: 10, 
      borderRadius: 10, 
      marginBottom: 10, 
      alignSelf:'center',
      width: '70%'
        },
    saveChangesText: {
        fontSize: 16, 
        fontWeight:'600', 
        color:'white', 
        textAlign:'center'
    }, 
    bottomSheetContainer: {
        flex: 1, 
        justifyContent:'space-around'

    },
    profilePhotoLabel: {
        flexDirection:'row', 
        alignItems:'center', 
        justifyContent:'space-between'
    },
    profilePhotoText: {
        fontSize: 20, 
        fontWeight:'600', 
        letterSpacing: 1
    },
    profilePhotoOptionsContainer: {
        flexDirection:'row', 
        alignItems:'center', 
        justifyContent:'space-around'
    },
    profilePhotoOptionType: {
        width: 60, 
        height: 60, 
        borderRadius: 60, 
        borderWidth: 1, 
        borderColor:'lightgray', 
        alignItems: 'center', 
        justifyContent:'center'
    },
    profilePhotoOptionText: {
        color:'#4C4C4C', 
        fontSize : 16, 
        letterSpacing: 0.5, 
        fontWeight:'400', 
        marginTop: 5
    },
    loadingAlert: {
        backgroundColor:'rgba(0,0,0,0.5)', 
        justifyContent:'center', 
        alignItems: 'center'
    },
    loadingAlertContainer: {
        justifyContent:"center", 
        alignItems:"center"
    },
    uploadingText: {
        color:'white', 
        fontWeight: '500'
    },
    userProfileAlertContainer: {
        backgroundColor:'rgba(0,0,0,0.5)', 
        justifyContent:'center',
         alignItems:"center"
    },
    userProfileSuccessAlert: {
        padding: 20, 
        backgroundColor:'white', 
        borderRadius: 20, 
        elevation: 5, 
        alignItems: 'center',
        width:'70%'
    },
    successText: {
        color:"green", 
        fontWeight: '600', 
        fontSize: 16, 
        marginBottom: 0
    },
    profileSuccessText: {
        color:"#4C4C4C", 
        fontWeight: '500', 
        textAlign:'center', 
        marginBottom: 30, 
        fontSize: 14
    },
    closeProfileAlert: {
        paddingVertical: 10, 
        paddingHorizontal: 15,
        borderRadius: 5
    },
    closeAlertText: {
        color:'white', 
        fontWeight: '600', 
        fontSize: 14
    },
    errorAlertLabel: {
        fontWeight: '600', 
        fontSize: 16, 
        marginBottom: 15
    },
    errorAlertDescText: {
        color:"#4C4C4C", 
        fontWeight: '500', 
        textAlign:'center', 
        marginBottom: 30, 
        fontSize: 14
    },
    loadingCont: {
        flex: 1, 
        backgroundColor:'rgba(0,0,0,0.5)', 
        justifyContent:'center', 
        alignItems:'center'
      },
      alignCont: {
         justifyContent:'center',
         alignItems:'center'
      },
      loadingImage: {
        width: 90, 
        height: 90
      },
      loadingText: {
          textAlign:'center', 
          fontSize: 16, 
          fontWeight: '600', 
          color:'white'
      },
      loadingImgCont: {
        width: 110, 
        height: 110, 
        borderRadius: 20, 
        backgroundColor:'white', 
        justifyContent:'center', 
        alignItems:'center', 
        marginBottom: 10
      },
})