# Receipt Screen Documentation

## Overview

The Receipt Screen is an essential feature of the application, designed to display transaction details whenever a payment is completed successfully. It caters to two main types of transactions:
1. **Card Charge Authorization**
2. **Apartment Payment**

The receipt includes comprehensive details about the transaction and allows the user to share the receipt as either a PDF or an image.

## Features

- **Dynamic Receipt Generation**: The receipt is generated based on the type of transaction (Card Charge Authorization or Apartment Payment).
- **Detailed Transaction Information**: Each receipt displays all relevant transaction details.
- **Share Receipt**: Users can share the receipt via other apps as either a PDF document or an image file.

## Transaction Data

### 1. **Card Charge Authorization**
When a card is charged, the receipt includes the following data:
- **Sender Name**: The name of the person making the payment.
- **Recipient Name**: The name of the person or entity receiving the payment.
- **Transaction Type**: Indicates the type of transaction (e.g., "Card Charge").
- **Transaction Reference**: A unique reference ID for the transaction.
- **Payment Method**: Indicates that the payment was made using a card.
- **Transaction Date**: The date and time when the transaction was completed.

### 2. **Apartment Payment**
When a payment is made for an apartment, the receipt includes:
- **Sender Name**: The name of the person making the payment.
- **Recipient Name**: The name of the landlord or apartment owner.
- **Apartment Type**: The type of apartment being paid for (e.g., "2 Bedroom Apartment").
- **Apartment Address**: The address of the apartment.
- **Transaction Type**: Indicates the type of transaction (e.g., "Apartment Payment").
- **Transaction Reference**: A unique reference ID for the transaction.
- **Payment Method**: Indicates the method used for the payment (e.g., "Card").
- **Transaction Date**: The date and time when the transaction was completed.

## Receipt Sharing

The receipt can be shared in two formats:
1. **PDF**: The receipt can be exported as a PDF document.
2. **Image**: The receipt can be captured and shared as an image file.

### How to Share the Receipt
- On Click of the share receipt button, a bottomsheet opens up with the pdf and image sharing options
- **PDF Sharing**: Upon clicking the "Pdf" icon, the receipt will be converted into a PDF file and shared using the preferred app (e.g., Email, WhatsApp, etc.).
- **Image Sharing**: Clicking the "Image" icon will capture the receipt view as an image and allow it to be shared using the preferred app.