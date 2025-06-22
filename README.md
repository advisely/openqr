# OpenQR - Free QR Code Generator 🚀

This is a simple, free, and open-source QR code generator that runs entirely in your browser. Create QR codes for any weblink instantly!

## ✨ Features

- **Real-time Generation:** The QR code updates instantly as you type.
- **Color Customization:** Easily change the color of the QR code and its background.
- **Downloadable:** Save the QR code as a high-quality PNG image.
- **Client-Side:** No data is sent to a server. Everything happens in your browser.
- **Persistent QR Codes:** The generated QR codes store the link data directly and will work forever, independently of this app.
- **Free & Open Source:** This tool is completely free to use with no subscriptions or hidden costs.

## 🚀 Getting Started

Since this is a purely client-side application, there's no complex installation. You have two main options to run it:

**Option 1: Open the HTML File Directly**

1.  Clone or download this repository to your local machine.
2.  Navigate to the project folder.
3.  Open the `index.html` file in your favorite web browser.

**Option 2: Run a Local Server (Recommended for Development)**

For the best experience and to avoid any potential browser security issues with local files, run a simple web server:

1.  Make sure you have Python 3 installed.
2.  Open your terminal or command prompt.
3.  Navigate to the project directory:
    ```bash
    cd path/to/openqr
    ```
4.  Start the server:
    ```bash
    python3 -m http.server
    ```
5.  Open your browser and go to `http://localhost:8000`.

## 📝 How to Use the App

Using the QR code generator is straightforward:

1.  **Enter a URL:** Type or paste the website link you want to turn into a QR code in the input field.
2.  **Customize Colors (Optional):**
    -   Click the **Color** swatch to change the QR code's color.
    -   Click the **Background** swatch to change the background color.
    The QR code will update in real-time with your changes.
3.  **Download Your QR Code:**
    -   Once you're happy with the QR code, click the **Download QR Code** button.
    -   The QR code will be saved to your computer as a `qrcode.png` file.

---

Made with ❤️ by Yassine Boumiza
