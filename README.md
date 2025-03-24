# &lt;your gym&gt; Gym Management System

A modern, responsive gym management system built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- 🏋️‍♂️ Membership Management
- 🔐 Entrance Authorization System
- 👤 Member Portal
- 📊 Admin Dashboard
- 🔑 Authentication System
- 📱 Responsive Design
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Prisma (Database ORM)
- PostgreSQL
- NextAuth.js
- React Hook Form
- Zod (Schema Validation)
- shadcn/ui Components

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   ```bash
   cp .env.example .env
   ```
4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file with the following variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/triple_x_gym"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## Project Structure

```
src/
├── app/              # Next.js app directory
├── components/       # Reusable components
├── lib/             # Utility functions and configurations
├── prisma/          # Database schema and migrations
└── types/           # TypeScript type definitions
```

## License

MIT
