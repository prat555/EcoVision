
# ♻️ Smart Waste Management Website

A smart, AI-powered web platform designed to help users identify, recycle, and responsibly dispose of waste items. Users can scan items using a camera or upload an image, and our machine learning model classifies the waste and provides eco-friendly disposal or reuse suggestions.

## ✨ Features

- 🔐 **User Authentication**  
  - Sign up and login functionality using Firebase Authentication with email/password and Google sign-in.

- 📷 **Smart Waste Scanner**  
  - Upload an image or use your camera to scan a waste item.
  - The system classifies the waste into one of four categories:
    - Recyclable
    - Compostable
    - Special (e.g., e-waste, hazardous)
    - Landfill
  - Based on the classification, the user receives instructions on how to recycle or reuse the item.

- 🤖 **AI-Powered Chatbot**  
  - Get assistance on waste disposal, recycling tips, and eco-friendly practices via a chatbot powered by DeepSeek R1.

- 🌙 **Dark and Light Theme Support**

- 📚 **Informational Pages**
  - About Page
  - Guide Page (with recycling tips and category info)
  - Contact Page

## 🛠️ Tech Stack

| Layer     | Technology                    |
|-----------|-------------------------------|
| Frontend  | React (Vite) + Tailwind CSS   |
| Backend   | Node.js / Express             |
| Database  | Firebase (Authentication)     |
| AI/ML     | DeepSeek R1 via OpenRouter, Hugging Face API, or local Python model for image analysis; DeepSeek R1 for chatbot |
| Auth      | Firebase Authentication       |

## 🚀 How It Works

1. **Login or Sign up** to access the platform.
2. **Upload or scan an item** using the camera or file picker.
3. The item is analyzed via one of:
  - **DeepSeek R1 AI model** (default)
  - **Hugging Face API** (e.g., amariayudha/RealWaste_Prediction_Deep_Learning)
  - **Local Python model** using [watersplash/waste-classification](https://huggingface.co/watersplash/waste-classification) with the `transformers` library
## 🧑‍💻 Local Python Waste Classification (Optional)

You can use a local Hugging Face model for image classification:

1. Install Python dependencies:
  ```bash
  pip install transformers torch pillow
  ```
2. Use the provided script:
  ```bash
  python server/waste_classifier.py <image_path>
  ```
  This uses the `watersplash/waste-classification` model from Hugging Face.

You can integrate this script with the Node.js backend to automate classification. (See `server/waste_classifier.py` for details.)
## 🔑 Environment Variables

Add the following to your `.env` file:

```
OPENROUTER_API_KEY=your_openrouter_api_key_here
HF_API_TOKEN=your_huggingface_api_token_here
```

`OPENROUTER_API_KEY` is required for DeepSeek R1. `HF_API_TOKEN` is required for Hugging Face API-based image classification.
4. You'll receive:
   - Waste category (e.g., Recyclable)
   - Disposal or reuse instructions
   - Environmental impact information
5. **Use the chatbot** to ask any questions about waste management.
