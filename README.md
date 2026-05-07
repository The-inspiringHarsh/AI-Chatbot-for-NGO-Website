# Amaanitvam Foundation AI Assistant

A production-quality AI chatbot web application for Amaanitvam Foundation, built as a full-stack internship assignment project with a polished SaaS-style interface, RAG-style knowledge retrieval, multilingual support, voice features, and a secure admin dashboard.

## Features

- Modern AI chat interface with ChatGPT-inspired layout
- RAG-style contextual retrieval from NGO knowledge records
- Gemini API integration with graceful local fallback
- English, Hindi, and Tamil language modes
- Browser voice input and text-to-speech output
- Local chat history using `localStorage`
- Suggested prompt chips for common NGO questions
- Markdown responses, copy response, and conversation export
- Responsive glassmorphism UI with animations and dark/light toggle
- Secure admin login using JWT httpOnly cookies
- Admin dashboard to add, edit, delete, and search knowledge records
- MongoDB Atlas support with bundled demo knowledge fallback
- Vercel-ready Next.js 15 App Router architecture

## Screenshots

Add screenshots after running the app:

- `screenshots/chat-empty-state.png`
- `screenshots/chat-conversation.png`
- `screenshots/admin-dashboard.png`
- `screenshots/mobile-chat.png`

## Tech Stack

- Frontend: Next.js 15, React 19, Tailwind CSS, Framer Motion, Lucide Icons
- Backend: Next.js API Routes
- Database: MongoDB Atlas with Mongoose
- AI: Gemini API
- Auth: JWT using `jose`
- UX: Sonner toasts, Markdown rendering, browser Speech APIs

## Project Structure

```txt
app/
  admin/
    login/page.tsx
    layout.tsx
    page.tsx
  api/
    admin/
      knowledge/route.ts
      knowledge/[id]/route.ts
      login/route.ts
      logout/route.ts
    chat/route.ts
  globals.css
  layout.tsx
  page.tsx
components/
  admin/
  chat/
  ui/
data/
  knowledge-base.ts
hooks/
  use-local-storage.ts
  use-speech.ts
lib/
  ai.ts
  auth.ts
  mongodb.ts
  retrieval.ts
  utils.ts
models/
  Conversation.ts
  Knowledge.ts
middleware.ts
```

## Getting Started

Install dependencies:

```bash
npm install
```

Create `.env.local` from the example:

```bash
cp .env.example .env.local
```

Run locally:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

Admin dashboard:

```txt
http://localhost:3000/admin
```

Default development login:

```txt
Email: admin@amaanitvam.org
Password: admin12345
```

Change these before deployment.

## Environment Variables

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/amaanitvam-chatbot
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=replace-with-a-long-random-secret
ADMIN_EMAIL=admin@amaanitvam.org
ADMIN_PASSWORD=change-this-password
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

The app works without `MONGODB_URI` and `GEMINI_API_KEY` by using bundled demo knowledge and a fallback assistant response. MongoDB is required for admin create, update, and delete operations.

## MongoDB Atlas Setup

1. Create a free MongoDB Atlas cluster.
2. Create a database user with read/write access.
3. Allow your IP address or `0.0.0.0/0` for Vercel.
4. Copy the connection string.
5. Add it as `MONGODB_URI` in `.env.local` and Vercel.

The first admin records can be added from `/admin` after MongoDB is configured.

## Gemini API Setup

1. Go to Google AI Studio.
2. Create an API key.
3. Add it to `.env.local` as `GEMINI_API_KEY`.
4. Restart the dev server.

The chat route uses retrieved NGO context and recent conversation history before calling Gemini.

## Deployment to Vercel

1. Push the project to GitHub.
2. Import the repository in Vercel.
3. Add all environment variables from `.env.example`.
4. Deploy with the default Next.js settings.
5. Confirm `/`, `/admin/login`, and `/api/chat` work.

## Quality Checks

```bash
npm run build
```

The project has been verified with a production build.

## Future Improvements

- Add admin user management and password hashing flow
- Add streaming responses using Server-Sent Events
- Add analytics for popular questions
- Add official contact and donation fields once available
- Add image upload support for NGO updates
- Add semantic vector search for larger knowledge bases
