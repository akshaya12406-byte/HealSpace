# HealSpace: Your Sanctuary for Mental Wellness

![HealSpace Hero](https://images.unsplash.com/photo-1495312040802-a929cd14a6ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjYWxtJTIwbGFuZHNjYXBlfGVufDB8fHx8MTc2MTg5NjQ5Mnww&ixlib=rb-4.1.0&q=80&w=1080)
*<p align="center">Find your calm, one breath at a time.</p>*

---

**HealSpace** is a comprehensive mental wellness platform designed to provide a private, safe, and supportive environment for users to navigate their emotional journey. Built with a focus on empathy and accessibility, HealSpace integrates cutting-edge AI tools with community and professional support systems.

## ✨ Key Features

- **🧠 AI-Powered Journaling**: A private journal that provides real-time, on-device sentiment analysis using TensorFlow.js, helping users understand their emotional patterns without compromising privacy. Includes a "Wellness Rhythm" chart to visualize mood trends over time.

- **🤖 HealBuddy AI Chatbot**: An empathetic AI companion built with Google's Gemini model. HealBuddy uses principles of Cognitive Behavioral Therapy (CBT) to offer guidance, handle crisis detection, and provide a safe space for users to talk.

- **🧑‍⚕️ Therapist Marketplace**: A curated directory of professional therapists. Users can filter by specialty and language to find the right professional and request to book a session.

- **🤝 Peer Support Circles**: Safe, community-driven groups focused on specific topics like anxiety, stress, and grief. A request-to-join system simulates a moderated environment to ensure user safety.

- **🗓️ My Day Wellness Planner**: A tool to help users structure their day with positive, achievable wellness goals from a curated library of ideas.

- **🆘 Proactive SOS & Safety**: A prominent SOS button provides immediate access to crisis helplines (localized for India). The platform also includes simulated monitoring for high-risk keywords in public spaces to proactively ensure community safety.

- **🔒 Secure Authentication & Age Gating**: Robust user authentication using Firebase Auth (Email/Password & Google). Includes a complete sign-up flow with an age gate that triggers a parental consent workflow for users under 18.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, ShadCN UI Components
- **Backend & Database**: Firebase (Firestore, Authentication)
- **Generative AI**: Genkit, Google Gemini 2.5 Flash
- **On-Device ML**: TensorFlow.js (Universal Sentence Encoder)

## 🚀 Getting Started

Follow these instructions to set up and run the HealSpace project on your local machine.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-name>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Set up Environment Variables:**
    This project requires API keys for Firebase and Google AI services.

    Create a `.env.local` file in the root of the project and add the following keys:

    ```
    # Your Google API Key for Genkit/Gemini
    GOOGLE_API_KEY=AIzaSy...

    # The following keys are found in your Firebase project settings
    # You can get these by running `firebase apps:sdkconfig` or from the Firebase Console
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
    NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
    NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
    ```

    > **Note:** The `firebaseConfig` object in `src/firebase/config.ts` is populated from these environment variables.

4.  **Run the Development Server:**
    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:9002`.

### Running Genkit Flows

The AI flows (chatbot, sentiment analysis) are managed by Genkit. To inspect, debug, and test these flows, use the Genkit development UI.

```bash
npm run genkit:watch
```

This will start the Genkit development server, and you can view traces at `http://localhost:4000`.

---
This project was built with ❤️ for a healthier mind.
