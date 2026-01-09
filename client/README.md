# RestorePro Services - Next.js

This is a Next.js conversion of the RestorePro Services website.

## Getting Started

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

To create a production build:

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Project Structure

- `app/` - Next.js App Router pages and layouts
- `components/` - React components
- `services/` - API services (Gemini AI integration)
- `public/` - Static assets
- `types.js` - Type definitions

## Features

- 5 dropdown navigation menus (Plumbing, Drains, HVAC, Water Damage, Emergency Services)
- Hero section with image on the right
- Emergency funnel modal
- Chat widget with AI integration
- Responsive design
- Tailwind CSS styling

## Notes

- This is a demo website for client presentation
- All contact information is fake/demo data
- Gemini API integration is optional (falls back to mock responses if API key is not set)
