
# ♻️ EcoVision - Smart Waste Management Platform

A smart, AI-powered web platform designed to help users identify, recycle, and responsibly dispose of waste items. Users can scan items using a camera or upload an image, and our AI model provides accurate waste classification with eco-friendly disposal suggestions.

## ✨ Features

- 🔐 **User Authentication**  
  - Sign up and login functionality using Firebase Authentication with email/password and Google sign-in.

- 📷 **Smart Waste Scanner**  
  - Upload an image or use your camera to scan a waste item.
  - Powered by **Google Gemini 2.0 Flash** for fast and accurate classification.
  - The system classifies the waste into one of four categories:
    - **Recyclable** - Items that can be recycled
    - **Compostable** - Organic waste that can be composted
    - **Special** - Items requiring special disposal (e-waste, batteries, chemicals)
    - **Landfill** - Items that must go to landfill
  - Provides detailed disposal instructions and environmental impact information.

- 🤖 **AI-Powered Chatbot**  
  - Get instant assistance on waste disposal, recycling tips, and eco-friendly practices.
  - Powered by **Google Gemini** for fast, intelligent responses.

- 🌙 **Dark and Light Theme Support**

- 📚 **Informational Pages**
  - About Page
  - Guide Page (with recycling tips and category info)
  - Contact Page

## 🛠️ Tech Stack

| Layer     | Technology                    |
|-----------|-------------------------------|
| Frontend  | React (Vite) + Tailwind CSS + ShadCN UI |
| Backend   | Node.js / Express + TypeScript |
| Database  | Firebase (Authentication & Storage) |
| AI/ML     | Google Gemini 2.0 Flash (Vision + Chat) |
| Auth      | Firebase Authentication       |

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/prat555/EcoVision.git
   cd EcoVision
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```bash
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
   Get your Gemini API key from: [Google AI Studio](https://aistudio.google.com/app/apikey)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5000`

## 🔑 Environment Variables

Add the following to your `.env` file:

```env
# Required: Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Firebase Configuration (if using authentication)
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
```

## 💡 How It Works

1. **Sign up or Login** to access the platform.
2. **Upload or scan a waste item** using the camera or file picker.
3. **Get instant AI analysis** powered by Google Gemini 2.0 Flash:
   - Accurate waste category identification
   - Detailed disposal instructions
   - Environmental impact information
4. **Chat with the AI assistant** for personalized waste management advice.

## 🎯 Key Benefits

- ⚡ **Fast Response Times** - Gemini 2.0 Flash provides near-instant results
- 🎯 **High Accuracy** - Superior image recognition compared to traditional ML models
- 💰 **Cost Effective** - Generous free tier (15 req/min, 1,500/day)
- 🌍 **Eco-Friendly** - Helps users make informed decisions about waste disposal
- 📱 **Mobile Friendly** - Responsive design works on all devices

## 📁 Project Structure

```
EcoVision/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities and configs
│   │   └── App.tsx        # Main app component
│   └── index.html
├── server/                # Express backend
│   ├── gemini.ts         # Gemini AI integration
│   ├── routes.ts         # API routes
│   ├── firebase-auth.ts  # Firebase authentication
│   ├── simple-storage.ts # Data storage
│   └── index.ts          # Server entry point
├── package.json
└── README.md
```

## 🔧 Available Scripts

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run check
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Google Gemini](https://ai.google.dev/) for the powerful AI capabilities
- [Firebase](https://firebase.google.com/) for authentication and storage
- [ShadCN UI](https://ui.shadcn.com/) for beautiful UI components
- [React](https://react.dev/) and [Vite](https://vitejs.dev/) for the frontend framework

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Made with ♻️ for a sustainable future
