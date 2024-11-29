# Profile Screen

## Overview

The Profile Screen provides a user interface for users to input and manage their biodata. The screen includes features such as user data upload to aws-amplify database, image uploading to AWS S3 bucket, user data creation and updating, form validation, and editable/non-editable form fields based on the user's data upload status.

## Features

### 1. User Biodata Input
- Users can input their biodata, including:
  - **First Name**
  - **Last Name**
  - **Email Address**
  - **Telephone Number**
  - **Whatsapp number**
  - **Profile Image**
  - **DOB**
  - **Country**
  - **State**
  - **Ethnicity**
- The profile data is uploaded directly to aws-amplify database
- The profile image is uploaded directly to AWS S3 bucket.

### 2. Profile image selection
- User can select photo either from gallery or capture via device camera

### 3. User Data Creation and Updating
- **Data Creation**: If the user's data does not exist in the database, a new entry is created when the user submits the form.
- **Data Update**: If the user's data already exists in the database, the existing data is updated with the new inputs.

### 4. Editable/Non-Editable Form Fields
- **Editable**: When a user’s data has not yet been created (i.e does not exist in database), all form fields are fully editable.
- **Non-Editable**: If the user's data already exists in the database, the form fields are locked (non-editable) by default.
- **Edit Profile Button**: Users can unlock (make editable) the form fields by clicking the "Edit" icon.

### 5. Form Validation and Feedback
- Each form field is validated on input, and users receive text feedback if there are any invalid inputs.
  - **First Name**: value inputed must be greater than or equals to 1
  - **Last Name**: value inputed must be greater than or equals to 1
  - **Email Address**: Must be a valid email format must include ('.com' and '@' symbol) (e.g., `sam1@gmail.com`).
  - **Phone Number** and **Whatsapp Number**: Must be a valid telephone number (numeric and length check - 11 digits long).
  - **Date of birth** : Age must be at least 18 years old (age >= 18)
  - **Country**, **State of origin** :  a value must be selected
  - **Ethnicity** : value inputed must be greater than or equals to 1

### 6. Profile Upload Alert
- When profile is successfully created or updated, the user will see a pop-up alert with a success message.

### 7. Error Handling
   
 #### 1. Form Validation Errors
- Handles invalid user input such as incorrect input format or missing required fields.
- Client-side validation is performed before form submission. If an error is detected, a descriptive error message is shown near the respective form field.
- **Example**: "invalid email address, include '@' and '.com'

 #### 2. Network Errors
-  Handles network issues when creating or updating user data, or during image upload.
-  `try-catch` blocks are used to handle network errors, and users are shown an error alert feedback with a description of the error
- e.g "Error updating profile. An unknown error occured, please check your internet connection and try again."