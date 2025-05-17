# MCP Frontend

A React + TypeScript project bootstrapped with Vite, using Ant Design for UI components.

## Project Overview

MCP Frontend is a modern chat and app connector UI built with React, TypeScript, Vite, and Ant Design.

### Features

- Chat interface with markdown, code highlighting, and file download support
- App management panel with toggles for connected applications
- Persistent chat history using localStorage
- Modern UI with glassmorphism and spotlight CSS effects
- Responsive and accessible design

See the [memory-bank/](memory-bank/) directory for detailed project documentation and ongoing context.

## Architecture

- **AppLayout**: Main layout with header, chat panel, and app list
- **ChatPanel**: Manages chat history, input, and message sending
- **ChatMessage**: Renders individual messages with markdown/code/file support
- **AppList**: Displays and manages connected applications
- **Ant Design**: Provides UI components and theming
- **Vite**: Fast development and build tooling

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Project Structure

- `src/` - Application source code
- `src/components/` - React components
- `public/` - Static assets
- `memory-bank/` - Project documentation and context

## Memory Bank

Project context, requirements, architecture, and progress are documented in the [memory-bank/](memory-bank/) directory.  
Update these files regularly to ensure project continuity and clarity.

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to your branch
5. Open a pull request

## License

[MIT](LICENSE)
