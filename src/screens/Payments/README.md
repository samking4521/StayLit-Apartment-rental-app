# Payment Screen Documentation

## Overview
The payment screen in the application is designed to handle payments based on the react native paystack apis, core features includes adding card, charging card, saving, updating and deleting card as well as card data input validation, payment notifications including error handling for invalid cases.

## Key Features
## 1. Adding Card

### a. Add Card Screen
- An **Add Card** screen is displayed with a bottom sheet where the user is required to input the following card details:
  - **Card Number**
  - **Card CVV**
  - **Card Expiry Date** (in the format MM/YY, e.g., 02/24)
  - **Card Name**
 - of which on successful entry will charge a sum of ₦50 from the user's card and this amount is discounted from the user's next apartment payment on the app.
 
 - **Create Profile Alert** (if user does not have a profile created)

- Upon pressing the **Pay ₦50** button:
  - A **Create Profile** pop-up alert is shown.
  - The alert includes a button that navigates the user to the profile screen to create their profile.

 - **User With a Profile**
If the user has created a profile and is available in the database on press of the pay #50 button a charging process is initialized.

### b. Payment Process
- If the card details entered by the user pass validation and are correct:
  - The **Pay ₦50** button triggers the card charging process using the **React Native Paystack library and API**.
  - The card is first **initialized**. If the initialization is successful:
    - A pop-up modal appears prompting the user to enter their **card PIN** and any additional details such as a **One-Time Password (OTP)** sent to their phone. The specific prompts may vary depending on the user's bank.
    - If the details are entered correctly:
      - The card is charged and then **verified**.
      - On successful charge, the card details and the payment information are saved to the backend database.
      - The **Add Card** screen disappears and is replaced by a payment notification, which includes an option to generate a **card charge payment receipt** upon click

## 2. Payment Notifications
     - Payment notifications are shown for both card charge and apartment payments after a successful payment on the app. 
     - On click of apartment payment notfication a receipt is generated with details of the payment and there is also a review option which on click shows the paid apartment details.
     - On click of card charge payment notification a recaipt is generated with details of the card payment

## 3. Card details 

### Display Card Details

- **Functionality:** Shows the details of the card that has been successfully charged and stored in the database.

- **Details Displayed:**
  - Card Number
  - Cardholder Name
  - Expiration Date
  - Card CVV

### Update Card Details
- **Functionality:** Allows users to update the card details.
- **Process:**
   - User can edit fields such as card number, expiration date, card holder name and cvv
   - Changes are saved to the database upon submission.
   - Validation checks are performed to ensure all entered data is correct.

### Delete Card
- **Functionality:** Provides an option for users to delete the card from their account.
- **Process:**
   - User initiates the delete action (e.g., by clicking the "Delete" button).
   - A confirmation prompt is displayed to prevent accidental deletions.
   - If confirmed, the card details are removed from the database.

## 4. Form Input Validation
The following validations are performed on the card input fields:
- **Card Expiry Date**: Must include both month and year in the format MM/YY (e.g., 02/24).
- **Card CVV**: Must be a maximum of 3 digits.

## 5. Error Handling
Error handling is implemented to manage various scenarios including in all payment screens:
- **Incomplete Card Details**: If any required card information is missing.
- **Incorrect Card Details**: If the card details entered are invalid.
- **Incorrect Card PIN**: If the wrong PIN is entered.
- **Insufficient Funds**: If the card has insufficient funds to complete the payment.
- **Timeout Error**: If the payment process times out.
- **Network Issues**: If there are network connectivity problems.
- **Card Initialization Errors**: If the card fails to initialize during the payment process.
- **Card Verification Errors**: If the card fails to verify after charging.