# MaxReward Frontend

## Tech Stack

### Core

- React 19
- Vite 7
- TailwindCSS 4

### UI Components & Styling

- shadcn/ui (Based on Radix UI primitives)
- Lucide React (Icons)
- Tailwind Merge (Utility for merging Tailwind CSS classes)
- Class Variance Authority (for creating variant components)
- tw-animate-css (Tailwind CSS animations)

### Development Tools

- ESLint 9 with React plugins
  - eslint-plugin-react-hooks
  - eslint-plugin-react-refresh

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/finobytes/maxreward-frontend.git
cd maxreward-frontend
```

2. Install dependencies:

```bash
npm install
# or
yarn
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview production build locally

## Development

### Styling with Tailwind CSS

This project uses Tailwind CSS for styling. You can find the Tailwind configuration in the project root. The UI components are built using shadcn/ui, which provides a collection of accessible and customizable components.

### UI Components

The project uses shadcn/ui components, which are built on top of Radix UI primitives. These components are:

- Accessible (following WAI-ARIA patterns)
- Customizable (using Tailwind CSS)
- Reusable and type-safe

### Code Style

This project uses ESLint for code linting with specific configurations for React and TypeScript. The configuration can be found in `eslint.config.js`.

## Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components built with Radix UI and Tailwind CSS
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components
- [Lucide Icons](https://lucide.dev/) - Beautiful & consistent icons
