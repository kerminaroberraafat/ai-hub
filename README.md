
# AI Hub - Next-Gen Intelligence

A high-performance, neomorphic AI platform designed for creators, developers, and visionaries. AI Hub leverages the latest generative models to provide a unified workspace for text, image, and motion synthesis.

## 🚀 Core Features

- **Intelligence Assistant**: A context-aware chatbot powered by **Google Gemini 3.0**, featuring real-time streaming responses and elegant conversation management.
- **Vision Studio**: Advanced text-to-image generation engine supporting multiple aspect ratios and high-fidelity neural rendering.
- **The Gallery**: A cinematic showcase of AI-generated motion, featuring high-definition video previews and fluid UI transitions.
- **Neomorphic Design**: A cutting-edge "soft UI" aesthetic that adapts seamlessly to both Light and Dark modes.

## 🛠️ Technical Stack

- **Frontend**: React (v19), TypeScript, Tailwind CSS
- **Icons**: Lucide React
- **AI Integration**: `@google/genai` (Gemini API), Fal.ai, Pexels API
- **State Management**: React Hooks + LocalStorage Persistence
- **Styling**: Custom Neomorphic Utility Classes

## 📦 Project Structure

```text
├── components/          # Reusable UI components (Navbar, Footer)
├── pages/               # Primary route components (Home, Chat, ImageGen, VideoGen)
├── services/            # API integration and AI logic (aiService.ts)
├── types/               # TypeScript interfaces and enums
├── App.tsx              # Main application router and theme provider
└── index.html           # Root HTML template with Tailwind configuration
```

## ⚙️ Environment Configuration

The application requires an API Key for the Google Gemini SDK. This key is injected via `process.env.API_KEY` in the execution environment.

## 🎨 Aesthetics

AI Hub uses a custom neomorphic shadow system defined in `index.html`. It prioritizes depth, soft shadows, and high-contrast typography (using the **Syne** and **DM Sans** font families) to create a premium, futuristic feel.
