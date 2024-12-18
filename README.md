# PRD Generator

A sophisticated AI-powered tool that transforms high-level product ideas into detailed Product Requirements Documents (PRDs) and technical blueprints. Built with Next.js 14, TypeScript, and the Google Gemini AI API.

## Features

### Core Functionality

- **AI-Powered PRD Generation**: Convert product ideas into comprehensive PRDs with features, epics, and technical specifications
- **Granularity Control**: Choose between high-level and detailed PRD generation
- **Interactive History**: Track and revisit previous PRD generations
- **Quick Start Templates**: Pre-built product templates via an animated carousel
- **Real-time Processing**: Visual feedback during PRD generation
- **Expandable Sections**: Collapsible UI components for better information organization

### Technical Components

- **Responsive Blueprint UI**: Custom blueprint-themed design with grid patterns and rulers
- **Component Architecture**: Modular React components for maintainability
- **Type Safety**: Comprehensive TypeScript typing for robust development
- **Modern UI Components**: Built with shadcn/ui and Tailwind CSS
- **API Integration**: Seamless integration with Google's Gemini AI

## Tech Stack

- **Frontend**:

  - Next.js 14 (App Router)
  - TypeScript
  - Tailwind CSS
  - Lucide Icons
  - shadcn/ui Components

- **Backend**:

  - Next.js API Routes
  - Google Generative AI SDK

- **Development Tools**:
  - ESLint
  - PostCSS
  - TypeScript Compiler

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/prd-generator.git
cd prd-generator
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Add your Google AI API key to `.env.local`:

```
GOOGLE_AI_API_KEY=your_api_key_here
```

5. Start the development server:

```bash
npm run dev
```

## Project Structure

```
balus444-prd-generator/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── styles/            # Global styles
│   ├── page.tsx           # Main page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # UI components (shadcn/ui)
│   └── [feature].tsx     # Feature-specific components
├── lib/                  # Utility functions
└── public/               # Static assets
```

## Key Components

### Frontend Components

1. **PRDDisplay**: Renders the generated PRD with expandable sections for:

   - Product overview
   - Features and epics
   - Non-functional requirements
   - Development roadmap

2. **PromptCarousel**: Displays scrolling project templates with:

   - Automatic animation
   - Hover pause functionality
   - Click-to-use template selection

3. **LoadingScreen**: Shows generation progress with:
   - Animated progress bar
   - Step-by-step status updates
   - Smooth transitions

### API Integration

The project uses two main API endpoints:

1. `/api/breakdown`: Generates comprehensive PRDs with:

   - Product vision and scope
   - Feature specifications
   - Technical requirements
   - Development roadmap

2. `/api/explore-component`: Provides detailed component analysis with:
   - Implementation steps
   - Technical considerations
   - Required technologies
   - Integration points

## Customization

### Styling

The project uses a custom blueprint theme that can be modified in:

- `app/styles/blueprint.css`: Blueprint-specific styles
- `tailwind.config.ts`: Tailwind configuration
- `app/globals.css`: Global styles

### Components

UI components from shadcn/ui can be customized in:

- `components/ui/`: Individual component styles
- `lib/utils.ts`: Utility functions for styling

## Development

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Google AI API key

### Best Practices

1. Follow TypeScript types and interfaces
2. Use component-based architecture
3. Implement error handling for API calls
4. Maintain responsive design principles
5. Follow Next.js 14 App Router patterns

### Adding New Features

1. Create new components in `components/`
2. Add TypeScript interfaces as needed
3. Update API handlers if required
4. Add styles following the blueprint theme
5. Update tests accordingly

## Environment Variables

Required environment variables:

```
GOOGLE_AI_API_KEY=your_google_ai_api_key
```

## Production Deployment

1. Build the project:

```bash
npm run build
```

2. Start the production server:

```bash
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- AI powered by [Google Gemini](https://ai.google.dev/)
