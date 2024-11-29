# Contact Screen

In the Contact Screen users are enabled to contact the host of a listed apartment via email, WhatsApp, or phone call. On clicking any of these options, the user is directly navigated to the corresponding app.

## Libraries Used

- **react-native-clipboard/clipboard**: This library is used to copy text to the clipboard, allowing users to easily copy contact details such as phone numbers or email addresses.

- **Linking**:  The `Linking` module from React Native is used to interact with other apps or services installed on the user's device, such as email clients, WhatsApp, Phone dialer and then open a URL in the corresponding app.

## Features

- **Contact via Email**: Clicking the "Email" option will open the default email app on the user's device with the host's email address pre-filled.

- **Contact via WhatsApp**: Clicking the "WhatsApp" option will open WhatsApp and start a chat with the host using the provided host phone number.

- **Contact via Phone**: Clicking the "Phone" option will open the phone dialer, copy the host phone number to the clipboard, where a phone call can be initiated on press of the call button.

