# StrokeSense Frontend

React.js frontend for **StrokeSense** — stroke risk early-detection web app.

## Tech Stack

- React (Vite), Tailwind CSS, React Router v6
- React Hook Form + Zod, Axios, Framer Motion, Recharts, Lucide React

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

3. Start the [backend](https://github.com/luthfi13wa/strokesense-backend) on `http://localhost:3000`.

4. Run the frontend:

   ```bash
   npm run dev
   ```

## Scripts

| Command         | Description          |
|----------------|----------------------|
| `npm run dev`  | Development server   |
| `npm run build`| Production build     |
| `npm run preview` | Preview production build |

## Routes

| Path         | Page                          |
|-------------|-------------------------------|
| `/`         | Home                          |
| `/check`    | Multi-step stroke risk form   |
| `/result`   | Prediction result             |
| `/dashboard`| Prediction history + chart    |

Team ID: **CC26-PSU036**
