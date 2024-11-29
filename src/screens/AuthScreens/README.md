#Authentication

The authentication system in this application is built using AWS Amplify's Auth module, enabling secure email and password-based authentication. The implementation includes features such as login data validation, feedbacks, email verification and error handling, all designed with user experience and security in mind.

##Features

- **Email and Password Authentication**
  - Users can sign up and log in using their email and a password that is at least 8 characters long and contains alphabets, numbers, and symbols.

- **Email Verification**
  - Upon registration, a six-digit verification code is sent to the user's email.
  - The user must enter this code to verify their email address. Once confirmed, the user is automatically logged into the app.

- **Forget Password**
  - The "Forget Password" feature allows users to securely reset their password.
  - When entering a new password, a one-time six-digit email verification code is sent to the registered email address. This process ensures that only the rightful owner of the account can change the password.
  - Upon successful verification, the user is logged into the app with the new password.

- **Data Input Validation**
  - Validates email and password format using regular expressions.
  - Ensures the password meets security requirements (e.g., minimum length, character complexity).
  - Provides immediate feedback for incorrect inputs.

- **Error Handling**
  - Comprehensive error handling to ensure users receive clear and relevant feedback for various authentication-related actions (e.g., invalid credentials, unverified email, already existing user, network-related issues, etc).





