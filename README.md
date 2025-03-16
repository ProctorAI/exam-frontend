# NEST Exam Platform

A modern, interactive examination platform built with Next.js and Supabase. This platform provides a seamless experience for students taking online exams with features like real-time answer submission, timer management, and an intuitive user interface.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **State Management**: TanStack Query
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **UI Components**: shadcn/ui

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/ProctorAI/exam-frontend.git
cd exam-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

## API Routes

The platform includes several API routes for exam management:

1. `/api/tests`
   - GET: Fetch available tests
   - POST: Create new test

2. `/api/tests/[id]`
   - GET: Fetch specific test details
   - PUT: Update test details

3. `/api/attempts/[id]`
   - POST: Start a new test attempt
   - GET: Fetch attempt details

4. `/api/attempts/[id]/answers`
   - POST: Submit answer for a question

5. `/api/attempts/[id]/complete`
   - POST: Complete test attempt

