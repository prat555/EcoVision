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
| AI/ML     | DeepSeek R1 via OpenRouter for image analysis and chatbot |
| Auth      | Firebase Authentication       |

## 🚀 How It Works

1. **Login or Sign up** to access the platform.
2. **Upload or scan an item** using the camera or file picker.
3. The item is analyzed via **DeepSeek R1 AI model**.
4. You'll receive:
   - Waste category (e.g., Recyclable)
   - Disposal or reuse instructions
   - Environmental impact information
5. **Use the chatbot** to ask any questions about waste management.
