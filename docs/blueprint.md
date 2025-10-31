# **App Name**: HealSpace

## Core Features:

- User Authentication: Secure user sign-up and login using Firebase Authentication with email/password and Google provider. Includes age verification and parental consent flow with Firestore status management.
- Journal Sentiment Analysis: Real-time sentiment analysis of journal entries using TensorFlow.js. Generates a dynamic 'Wellness Rhythm' chart. Displays a UI notification ('It looks like today was a heavy day. Would you like to explore these feelings with Mitr?') if the sentiment score drops below -0.5.
- AI Chatbot: Gemini-powered chatbot 'Mitr' to provide empathetic wellness guidance. Core Implementation: The backend API route for Gemini must use a detailed System Prompt to define Mitr's personality, cultural context (Hinglish, CBT), and safety boundaries. Initial State: Includes conversation starter buttons to guide the user. Reliability: Includes a fallback mechanism to a pre-scripted conversation if the API call fails.
- Therapist Marketplace: Display therapist profiles with filtering by language and specialty, facilitating warm handoffs from the chatbot.
- SOS Protocol: Global 'SOS' protocol triggered by the SOS button, AI safety scanner, and proactive safety mechanism with the crisis modal.
- Peer Support Circles: UI for peer support circles with proactive safety mechanism for high-risk keyword detection. Functions as a support mock-up and a means to access the 'SOS' Protocol.
- Data Persistence: Data models for persisting the authentication status, the contents of the journal entries and the chat sessions. Chat Sessions persist conversation history with Gemini, journal contents with sentiment scores, and manages the 'pending_approval' or 'approved' states for users.

## Style Guidelines:

- Primary color: Soft Blue (#60A5FA)
- Accent color: Gentle Green (#34D399)
- Background color: Neutral Gray (#F3F4F6)
- Danger/SOS color: Red (#EF4444)
- Font: 'PT Sans' from Google Fonts for headlines and body text.
- Simple, clear icons to represent navigation and key actions.
- Fixed Navbar and Footer for consistent navigation.
- Subtle transitions and animations to enhance user experience without being distracting