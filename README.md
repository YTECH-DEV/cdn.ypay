# YPay Payment Integration Documentation

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Configuration Options](#configuration-options)
- [Customization](#customization)
- [Language Support](#language-support)
- [Handling Payment Results](#handling-payment-results)
- [API Reference](#api-reference)
- [Accessibility Features](#accessibility-features)
- [Troubleshooting](#troubleshooting)

## Introduction

YPay is a JavaScript library that provides an accessible payment modal for processing payments. The library offers a customizable UI with multi-language support and proper accessibility features.

## Installation

### Step 1: Include the YPay script in your HTML file

```html
<script src="path/to/ypay.js"></script>
```

### Step 2: Add the payment button to your HTML

```html
<button id="ypay-button">Pay Now</button>
```

## Basic Usage

After including the library and adding the payment button, you can configure YPay with your payment details:

```javascript
YPay.setConfig({
  title: "Payment for order #12345",
  amount: 500,
  token: "your-project-token",
  onSuccess: (response) => {
    console.log("Payment successful:", response);
  },
  onFailure: (error) => {
    console.error("Payment failed:", error);
  },
});
```

When the user clicks the payment button, the modal will open automatically, displaying the payment form with the configured details.

## Configuration Options

| Option      | Type     | Required | Description                                               |
| ----------- | -------- | -------- | --------------------------------------------------------- |
| `title`     | String   | Yes      | The title of the payment that appears in the modal header |
| `amount`    | Number   | Yes      | The payment amount                                        |
| `token`     | String   | Yes      | Your project API token for authentication                 |
| `lang`      | String   | No       | Language code for the UI ('en' or 'fr', defaults to 'en') |
| `devise`    | String   | No       | Currency symbol (defaults to 'F')                         |
| `onSuccess` | Function | No       | Callback function that runs when payment is successful    |
| `onFailure` | Function | No       | Callback function that runs when payment fails            |

## Language Support

YPay supports multiple languages. Currently, English ('en') and French ('fr') are available. You can set the language during configuration:

```javascript
YPay.setConfig({
  // Other configurations...
  lang: "fr", // Set to French
});
```

## Handling Payment Results

YPay provides callbacks for handling successful and failed payments:

```javascript
YPay.setConfig({
  // Other configurations...
  onSuccess: (response) => {
    // Handle successful payment
    console.log("Payment successful:", response);
    // For example, redirect to a success page
    window.location.href = "/payment-success";
  },
  onFailure: (error) => {
    // Handle failed payment
    console.error("Payment failed:", error);
    // Display custom error message to user
    alert(`Payment failed: ${error.message}`);
  },
});
```

## API Reference

### YPay.setConfig(options)

Configures the YPay payment modal with the specified options.

**Parameters:**

- `options` (Object): Configuration options as described in the [Configuration Options](#configuration-options) section.

**Returns:** void

### YPay Modal (Internal)

The modal is automatically handled by the YPay library. When the user clicks the payment button (with id "ypay-button"), the modal will open. The modal includes accessibility features like keyboard navigation, focus trapping, and ARIA attributes.

## Accessibility Features

YPay is built with accessibility in mind:

- Keyboard navigation: Users can navigate the form using the Tab key
- Focus management: Focus is trapped inside the modal and returns to the trigger button when closed
- Proper ARIA attributes: The modal uses `role="dialog"`, `aria-modal="true"`, and other ARIA attributes
- Screen reader friendly: All interactive elements have proper labels

## Troubleshooting

### Common Issues

1. **Payment button doesn't open the modal**

   - Make sure your button has the ID "ypay-button"
   - Check the browser console for any JavaScript errors

2. **API errors during payment**

   - Verify your token is correct
   - Ensure the API URL is accessible from your environment

3. **Styling conflicts**
   - YPay uses the `ypay-` prefix for all its CSS classes to minimize conflicts
   - If conflicts occur, use more specific CSS selectors to override styles

### Error Messages

| Error                                      | Possible Cause                                                    | Solution                                        |
| ------------------------------------------ | ----------------------------------------------------------------- | ----------------------------------------------- |
| "Invalid amount"                           | The amount is not a valid number or is less than or equal to zero | Check the amount value in your configuration    |
| "Please enter a valid card number and OTP" | Card number or OTP is missing or invalid                          | Ensure the user enters all required information |

## Example Implementation

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>YPay Integration Example</title>
    <script src="path/to/ypay.js" defer></script>
  </head>
  <body>
    <h1>Checkout Page</h1>
    <p>Total: 500 F</p>

    <button id="ypay-button">Pay with YPay</button>

    <script>
      document.addEventListener("DOMContentLoaded", function () {
        YPay.setConfig({
          title: "Payment for order #12345",
          amount: 500,
          token: "your-project-token",
          lang: "en",
          onSuccess: (response) => {
            alert("Payment successful!");
            window.location.href = "/thank-you";
          },
          onFailure: (error) => {
            alert("Payment failed: " + error.message);
          },
        });
      });
    </script>
  </body>
</html>
```
