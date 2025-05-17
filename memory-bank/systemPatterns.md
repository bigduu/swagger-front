# System Patterns

## System Architecture
- React + TypeScript SPA bootstrapped with Vite
- Ant Design for UI components and theming (dark mode)
- AppLayout composes ChatPanel (chat) and AppList (apps) side by side
- Glassmorphism and spotlight CSS effects for modern visuals
- LocalStorage for chat history persistence

## Key Technical Decisions
- Functional React components with hooks
- Ant Design for rapid, consistent UI
- CSS containment and GPU acceleration for performance
- Markdown/code/file rendering in chat

## Design Patterns in Use
- Container/presenter split: AppLayout (container), ChatPanel/AppList (presenters)
- Memoization for performance (AppListItem, ChatMessage)
- Local state for UI, localStorage for persistence

## Component Relationships
- App renders AppLayout
- AppLayout renders ChatPanel and AppList
- ChatPanel renders ChatMessage for each message

## Critical Implementation Paths
- ChatPanel manages chat state, input, and history
- ChatMessage renders markdown/code/files
- AppList manages app toggling and display

---

*Update this document as the system evolves and new patterns emerge.*
